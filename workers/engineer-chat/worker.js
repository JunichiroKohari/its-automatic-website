import { ENGINEER_CONTEXT } from './context.js';

const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:4321',
  'http://127.0.0.1:4321',
];

const json = (payload, init = {}, corsHeaders = {}) => new Response(JSON.stringify(payload), {
  ...init,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    ...corsHeaders,
    ...(init.headers || {}),
  },
});

const getAllowedOrigins = (env) => {
  if (!env.ALLOWED_ORIGINS) {
    return DEFAULT_ALLOWED_ORIGINS;
  }

  return env.ALLOWED_ORIGINS.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const getCorsHeaders = (request, env) => {
  const origin = request.headers.get('origin') || '';
  const allowedOrigins = getAllowedOrigins(env);
  const allowOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0] || '';

  return {
    'access-control-allow-origin': allowOrigin,
    'access-control-allow-methods': 'POST, OPTIONS, GET',
    'access-control-allow-headers': 'content-type',
    'access-control-max-age': '86400',
    vary: 'Origin',
  };
};

const getClientIp = (request) => (
  request.headers.get('cf-connecting-ip')
  || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  || '127.0.0.1'
);

const sha256 = async (value) => {
  const encoded = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

const nowIso = () => new Date().toISOString();

const toInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const addDays = (date, days) => new Date(date.getTime() + days * 86400000);

const getLimits = (env) => ({
  maxInputChars: toInt(env.MAX_INPUT_CHARS, 600),
  maxOutputTokens: toInt(env.MAX_OUTPUT_TOKENS, 500),
  maxSessionTurns: toInt(env.MAX_SESSION_TURNS, 10),
  historyMessageLimit: toInt(env.HISTORY_MESSAGE_LIMIT, 8),
  ipMinuteLimit: toInt(env.IP_MINUTE_LIMIT, 3),
  ipDailyLimit: toInt(env.IP_DAILY_LIMIT, 20),
  sessionDailyLimit: toInt(env.SESSION_DAILY_LIMIT, 10),
  globalDailyLimit: toInt(env.GLOBAL_DAILY_LIMIT, 100),
});

const getWindowKey = (date, unit) => {
  if (unit === 'minute') {
    return date.toISOString().slice(0, 16);
  }

  return date.toISOString().slice(0, 10);
};

const incrementRateLimit = async (db, { scope, key, window }) => {
  const updatedAt = nowIso();
  await db.prepare(`
    INSERT INTO rate_limits (scope, key, window, count, updated_at)
    VALUES (?, ?, ?, 1, ?)
    ON CONFLICT(scope, key, window)
    DO UPDATE SET count = count + 1, updated_at = excluded.updated_at
  `).bind(scope, key, window, updatedAt).run();

  const row = await db.prepare(`
    SELECT count FROM rate_limits
    WHERE scope = ? AND key = ? AND window = ?
  `).bind(scope, key, window).first();

  return row?.count || 0;
};

const assertLimit = (count, limit, message) => {
  if (count > limit) {
    const error = new Error(message);
    error.status = 429;
    throw error;
  }
};

const isNearLimit = (remaining, limit, explicitThreshold) => {
  const threshold = explicitThreshold ?? Math.max(1, Math.ceil(limit * 0.2));
  return remaining <= threshold;
};

const buildLimitWarnings = ({ limits, counts, nextSessionTurns }) => {
  const sessionRemaining = Math.max(limits.maxSessionTurns - nextSessionTurns, 0);
  const sessionDailyRemaining = Math.max(limits.sessionDailyLimit - counts.sessionDaily, 0);
  const ipDailyRemaining = Math.max(limits.ipDailyLimit - counts.ipDaily, 0);
  const ipMinuteRemaining = Math.max(limits.ipMinuteLimit - counts.ipMinute, 0);
  const globalDailyRemaining = Math.max(limits.globalDailyLimit - counts.globalDaily, 0);
  const nearLimit = (
    sessionRemaining === 0
    || isNearLimit(sessionRemaining, limits.maxSessionTurns)
    || sessionDailyRemaining === 0
    || isNearLimit(sessionDailyRemaining, limits.sessionDailyLimit)
    || ipMinuteRemaining <= 1
    || isNearLimit(ipDailyRemaining, limits.ipDailyLimit)
    || isNearLimit(globalDailyRemaining, limits.globalDailyLimit, Math.max(1, Math.ceil(limits.globalDailyLimit * 0.1)))
  );

  return nearLimit ? ['QUESTION_LIMIT_NEAR'] : [];
};

const verifyTurnstile = async ({ token, request, env }) => {
  const secret = env.TURNSTILE_SECRET_KEY;
  const requireTurnstile = env.REQUIRE_TURNSTILE === 'true';

  if (!secret) {
    if (requireTurnstile) {
      const error = new Error('bot検証の設定が未完了です。');
      error.status = 500;
      throw error;
    }
    return;
  }

  if (!token) {
    const error = new Error('bot検証に失敗しました。ページを再読み込みしてもう一度お試しください。');
    error.status = 403;
    throw error;
  }

  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  form.append('remoteip', getClientIp(request));

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: form,
  });
  const result = await response.json();

  if (!result.success) {
    const error = new Error('bot検証に失敗しました。ページを再読み込みしてもう一度お試しください。');
    error.status = 403;
    throw error;
  }
};

const getOrCreateSession = async ({ db, sessionId, ipHash, userAgentHash }) => {
  const now = new Date();
  const createdAt = now.toISOString();
  const expiresAt = addDays(now, 7).toISOString();
  const normalizedSessionId = /^[a-zA-Z0-9-]{20,80}$/.test(sessionId || '') ? sessionId : crypto.randomUUID();

  const existing = await db.prepare(`
    SELECT session_id, turns_count FROM sessions
    WHERE session_id = ? AND expires_at > ?
  `).bind(normalizedSessionId, createdAt).first();

  if (existing) {
    await db.prepare(`
      UPDATE sessions SET updated_at = ?, expires_at = ?
      WHERE session_id = ?
    `).bind(createdAt, expiresAt, normalizedSessionId).run();
    return existing;
  }

  await db.prepare(`
    INSERT INTO sessions (session_id, ip_hash, user_agent_hash, turns_count, created_at, updated_at, expires_at)
    VALUES (?, ?, ?, 0, ?, ?, ?)
  `).bind(normalizedSessionId, ipHash, userAgentHash, createdAt, createdAt, expiresAt).run();

  return { session_id: normalizedSessionId, turns_count: 0 };
};

const getRecentMessages = async ({ db, sessionId, limit }) => {
  const { results } = await db.prepare(`
    SELECT role, content FROM messages
    WHERE session_id = ?
    ORDER BY id DESC
    LIMIT ?
  `).bind(sessionId, limit).all();

  return (results || [])
    .reverse()
    .map((message) => ({
      role: message.role,
      content: message.content,
    }));
};

const saveMessage = async ({ db, sessionId, role, content, model = '', usage = {} }) => {
  await db.prepare(`
    INSERT INTO messages (
      session_id, role, content, model,
      input_tokens, output_tokens, total_tokens, created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    sessionId,
    role,
    content,
    model,
    usage.input_tokens || 0,
    usage.output_tokens || 0,
    usage.total_tokens || 0,
    nowIso(),
  ).run();
};

const incrementSessionTurn = async ({ db, sessionId }) => {
  await db.prepare(`
    UPDATE sessions
    SET turns_count = turns_count + 1, updated_at = ?
    WHERE session_id = ?
  `).bind(nowIso(), sessionId).run();
};

const saveUsage = async ({ db, day, scope, key, usage }) => {
  await db.prepare(`
    INSERT INTO usage_daily (
      day, scope, key, request_count,
      input_tokens, output_tokens, total_tokens, updated_at
    )
    VALUES (?, ?, ?, 1, ?, ?, ?, ?)
    ON CONFLICT(day, scope, key)
    DO UPDATE SET
      request_count = request_count + 1,
      input_tokens = input_tokens + excluded.input_tokens,
      output_tokens = output_tokens + excluded.output_tokens,
      total_tokens = total_tokens + excluded.total_tokens,
      updated_at = excluded.updated_at
  `).bind(
    day,
    scope,
    key,
    usage.input_tokens || 0,
    usage.output_tokens || 0,
    usage.total_tokens || 0,
    nowIso(),
  ).run();
};

const extractOutputText = (data) => {
  if (typeof data.output_text === 'string' && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const chunks = [];
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (typeof content.text === 'string') {
        chunks.push(content.text);
      }
    }
  }

  return chunks.join('\n').trim();
};

const buildInstructions = () => `
あなたは J.K. のスキルシートに関する問い合わせに答えるAIアシスタントです。

制約:
- 回答は日本語。
- スキルシートに記載された事実だけで回答する。
- 事実不明な内容は推測しない。
- 回答は原則4文以内。比較や列挙が必要な場合だけ箇条書きにする。
- 面談、発注、単価、稼働開始時期など未掲載情報は「スキルシート上は確認できません。お問い合わせください。」と返す。

スキルシート:
${ENGINEER_CONTEXT}
`.trim();

const buildInput = ({ history, message }) => [
  ...history.map((item) => ({
    role: item.role,
    content: item.content,
  })),
  {
    role: 'user',
    content: message,
  },
];

const getLocalDevAnswer = (message) => [
  'ローカル確認用の応答です。OPENAI_API_KEY を設定すると、OpenAI APIによる実回答に切り替わります。',
  `質問: ${message}`,
  'このAPIはD1への会話保存、回数制限、CORS、Turnstile検証の入口まで動作しています。',
].join('\n');

const callOpenAI = async ({ env, message, history, limits }) => {
  const apiKey = env.OPENAI_API_KEY;
  const model = env.OPENAI_MODEL || 'gpt-5-nano';

  if (!apiKey) {
    return {
      answer: getLocalDevAnswer(message),
      model: 'local-dev',
      usage: { input_tokens: 0, output_tokens: 0, total_tokens: 0 },
      localMock: true,
    };
  }

  const body = {
    model,
    instructions: buildInstructions(),
    input: buildInput({ history, message }),
    max_output_tokens: limits.maxOutputTokens,
    store: false,
  };

  body.reasoning = { effort: env.OPENAI_REASONING_EFFORT || 'minimal' };

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.error?.message || 'OpenAI API request failed.');
    error.status = 502;
    throw error;
  }

  const answer = extractOutputText(data);
  const isIncompleteForOutputLimit = data.status === 'incomplete'
    && data.incomplete_details?.reason === 'max_output_tokens';

  return {
    answer: answer || (isIncompleteForOutputLimit
      ? '回答生成の上限に達しました。質問を少し短くしてもう一度お試しください。'
      : '回答を生成できませんでした。質問を少し具体化してもう一度お試しください。'),
    model,
    usage: data.usage || { input_tokens: 0, output_tokens: 0, total_tokens: 0 },
    localMock: false,
  };
};

const handleChat = async (request, env, corsHeaders) => {
  const limits = getLimits(env);
  const body = await request.json().catch(() => ({}));
  const message = `${body.message || ''}`.replace(/\s+/g, ' ').trim();

  if (!message) {
    return json({ error: '質問を入力してください。' }, { status: 400 }, corsHeaders);
  }

  if (message.length > limits.maxInputChars) {
    return json({ error: `質問は${limits.maxInputChars}文字以内で入力してください。` }, { status: 400 }, corsHeaders);
  }

  await verifyTurnstile({ token: body.turnstileToken, request, env });

  const date = new Date();
  const dayWindow = getWindowKey(date, 'day');
  const minuteWindow = getWindowKey(date, 'minute');
  const ipHash = await sha256(`${env.RATE_LIMIT_SALT || 'local-dev-salt'}:${getClientIp(request)}`);
  const userAgentHash = await sha256(`${env.RATE_LIMIT_SALT || 'local-dev-salt'}:${request.headers.get('user-agent') || ''}`);

  const session = await getOrCreateSession({
    db: env.DB,
    sessionId: body.sessionId,
    ipHash,
    userAgentHash,
  });

  if (session.turns_count >= limits.maxSessionTurns) {
    return json({ error: 'このチャットの上限に達しました。新しく開き直してからお試しください。' }, { status: 429 }, corsHeaders);
  }

  const counts = {
    ipMinute: await incrementRateLimit(env.DB, { scope: 'ip_minute', key: ipHash, window: minuteWindow }),
    ipDaily: await incrementRateLimit(env.DB, { scope: 'ip_day', key: ipHash, window: dayWindow }),
    sessionDaily: await incrementRateLimit(env.DB, { scope: 'session_day', key: session.session_id, window: dayWindow }),
    globalDaily: await incrementRateLimit(env.DB, { scope: 'global_day', key: 'all', window: dayWindow }),
  };

  assertLimit(counts.ipMinute, limits.ipMinuteLimit, '短時間に質問が集中しています。少し待ってからお試しください。');
  assertLimit(counts.ipDaily, limits.ipDailyLimit, '本日の質問上限に達しました。');
  assertLimit(counts.sessionDaily, limits.sessionDailyLimit, 'このチャットでの本日の質問上限に達しました。');
  assertLimit(counts.globalDaily, limits.globalDailyLimit, '本日のAIチャット全体の上限に達しました。');

  const history = await getRecentMessages({
    db: env.DB,
    sessionId: session.session_id,
    limit: limits.historyMessageLimit,
  });

  const result = await callOpenAI({ env, message, history, limits });

  await saveMessage({ db: env.DB, sessionId: session.session_id, role: 'user', content: message, model: result.model });
  await saveMessage({
    db: env.DB,
    sessionId: session.session_id,
    role: 'assistant',
    content: result.answer,
    model: result.model,
    usage: result.usage,
  });
  await incrementSessionTurn({ db: env.DB, sessionId: session.session_id });
  await saveUsage({ db: env.DB, day: dayWindow, scope: 'ip', key: ipHash, usage: result.usage });
  await saveUsage({ db: env.DB, day: dayWindow, scope: 'global', key: 'all', usage: result.usage });

  const limitWarnings = buildLimitWarnings({
    limits,
    counts,
    nextSessionTurns: session.turns_count + 1,
  });

  return json({
    sessionId: session.session_id,
    answer: result.answer,
    limitWarnings,
    model: result.model,
    usage: result.usage,
    localMock: result.localMock,
  }, {}, corsHeaders);
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsHeaders = getCorsHeaders(request, env);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    try {
      if (request.method === 'GET' && url.pathname === '/health') {
        return json({ ok: true, service: 'engineer-chat' }, {}, corsHeaders);
      }

      if (request.method === 'POST' && url.pathname === '/chat') {
        return await handleChat(request, env, corsHeaders);
      }

      return json({ error: 'Not found' }, { status: 404 }, corsHeaders);
    } catch (error) {
      console.error(error);
      return json({
        error: error.message || 'AIチャットでエラーが発生しました。',
      }, { status: error.status || 500 }, corsHeaders);
    }
  },
};

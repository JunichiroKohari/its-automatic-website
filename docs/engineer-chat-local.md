# Engineer Skill Chat Local Setup

`engineer_skill_sheet` のAIチャットは、静的サイト本体とは別にCloudflare Workerとして動かします。

## 1. 依存関係

```bash
npm ci
```

## 2. ローカルD1を初期化

```bash
npm run db:chat:migrate:local
```

## 3. 任意: OpenAI APIキー

`.dev.vars.example` を参考に `.dev.vars` を作成します。

```bash
OPENAI_API_KEY=sk-...
RATE_LIMIT_SALT=local-random-string
```

`OPENAI_API_KEY` が未設定の場合、Workerはローカル確認用の応答を返します。画面連携、D1保存、回数制限の確認は可能です。

リミットに近づくと、APIレスポンスの `limitWarnings` に警告コードが入り、フロントでは回答末尾に面談予約リンク付きの案内を表示します。

## 4. 起動

ターミナルを2つ使います。

```bash
npm run dev:chat-api
```

```bash
npm start
```

ブラウザで `http://localhost:4321/engineer_skill_sheet/` を開き、右下の「AIに質問」から送信します。

## Production Notes

- XServer StaticにはAPIキーを置かないでください。
- 本番のCloudflare Worker、D1、Turnstileは `infra/cloudflare` のTerraformでデプロイします。
- `OPENAI_API_KEY`、`TURNSTILE_SECRET_KEY`、`RATE_LIMIT_SALT` はTerraformのWorker secret bindingとして登録されます。Terraform stateの保管先は安全に扱ってください。
- 本番のWorker URLをフロントへ渡すには、`window.ENGINEER_CHAT_API_ENDPOINT` を設定するか、チャットパネルの `data-chat-api-endpoint` を更新します。
- Turnstileを使う場合は `window.ENGINEER_CHAT_TURNSTILE_SITE_KEY` または `data-turnstile-site-key` を設定し、Worker側で `REQUIRE_TURNSTILE=true` にします。
- 手順は `infra/cloudflare/README.md` を参照してください。

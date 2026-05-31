/* Booking — final CTA + multi-step form + sticky widget + modal */

const { React } = window;
const {
  useState, useEffect, useMemo, useRef,
} = React;

/* ---------- date helpers ---------- */

const PAD = (n) => String(n).padStart(2, '0');
const fmtJP = (d) => (d ? `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日` : '—');
const fmtISO = (d) => (d ? `${d.getFullYear()}-${PAD(d.getMonth() + 1)}-${PAD(d.getDate())}` : '');
const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const nights = (a, b) => Math.max(0, Math.round((b - a) / 86400000));

/* ---------- inline date picker ---------- */

function DatePicker({
  value, min, onChange, label,
}) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(value || today());
  const ref = useRef(null);

  useEffect(() => {
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const year = view.getFullYear();
  const month = view.getMonth();
  const first = new Date(year, month, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  return (
    <div ref={ref} className="date-picker" style={{ position: 'relative' }}>
      <button
        className="date-picker__button"
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          textAlign: 'left',
          padding: '12px 14px',
          background: 'var(--kinari)',
          border: '1px solid var(--line)',
          fontFamily: 'var(--serif)',
          fontSize: 15,
          letterSpacing: '.04em',
          color: 'var(--sumi)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>{value ? fmtJP(value) : <span style={{ opacity: 0.5 }}>日付を選択</span>}</span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--aka)' }}>▾</span>
      </button>
      {open && (
        <div
          className="date-picker__popover"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            zIndex: 30,
            background: '#fbf8f1',
            border: '1px solid var(--sumi)',
            padding: 14,
            width: 280,
            boxShadow: '0 12px 40px rgba(26,24,22,.12)',
          }}
        >
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12,
          }}
          >
            <button type="button" onClick={() => setView(new Date(year, month - 1, 1))} style={{ padding: 4, fontFamily: 'var(--mono)' }}>‹</button>
            <div style={{ fontFamily: 'var(--serif)', letterSpacing: '.1em' }}>
              {year}
              年
              {month + 1}
              月
            </div>
            <button type="button" onClick={() => setView(new Date(year, month + 1, 1))} style={{ padding: 4, fontFamily: 'var(--mono)' }}>›</button>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.1em', color: 'var(--sumi-2)', marginBottom: 6,
          }}
          >
            {['日', '月', '火', '水', '木', '金', '土'].map((d, i) => (
              <div key={d} style={{ textAlign: 'center', padding: 4, color: i === 0 ? 'var(--aka)' : i === 6 ? 'var(--koke)' : 'inherit' }}>{d}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {cells.map((d, i) => {
              if (!d) return <div key={i} />;
              const disabled = min && d < min;
              const selected = value && fmtISO(d) === fmtISO(value);
              return (
                <button
                  key={i}
                  type="button"
                  disabled={disabled}
                  onClick={() => { onChange(d); setOpen(false); }}
                  style={{
                    padding: '8px 0',
                    textAlign: 'center',
                    fontFamily: 'var(--serif)',
                    fontSize: 14,
                    background: selected ? 'var(--aka)' : 'transparent',
                    color: selected ? 'var(--kinari)' : disabled ? 'rgba(26,24,22,.25)' : 'var(--sumi)',
                    border: '1px solid transparent',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                  }}
                  onMouseOver={(e) => { if (!disabled && !selected) e.currentTarget.style.background = 'var(--kinari-2)'; }}
                  onMouseOut={(e) => { if (!selected) e.currentTarget.style.background = 'transparent'; }}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- counter ---------- */

function Counter({
  value, onChange, min = 1, max = 6, label, sub,
}) {
  return (
    <div className="booking-counter" style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--line)',
    }}
    >
      <div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 15, letterSpacing: '.06em' }}>{label}</div>
        {sub && <div className="body-sm" style={{ margin: 0, fontSize: 12 }}>{sub}</div>}
      </div>
      <div className="booking-counter__controls" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          style={{
            width: 32,
            height: 32,
            border: '1px solid var(--sumi)',
            fontFamily: 'var(--mono)',
            background: value <= min ? 'transparent' : 'var(--kinari)',
            color: value <= min ? 'rgba(26,24,22,.3)' : 'var(--sumi)',
          }}
        >
          −
        </button>
        <span style={{
          width: 24, textAlign: 'center', fontFamily: 'var(--serif)', fontSize: 18,
        }}
        >
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          style={{
            width: 32,
            height: 32,
            border: '1px solid var(--sumi)',
            fontFamily: 'var(--mono)',
            background: value >= max ? 'transparent' : 'var(--kinari)',
            color: value >= max ? 'rgba(26,24,22,.3)' : 'var(--sumi)',
          }}
        >
          ＋
        </button>
      </div>
    </div>
  );
}

/* ---------- room option card ---------- */

function RoomOption({
  id, jp, en, desc, price, selected, onSelect,
}) {
  return (
    <button
      className="room-option"
      type="button"
      onClick={() => onSelect(id)}
      style={{
        textAlign: 'left',
        padding: 20,
        background: selected ? 'var(--sumi)' : '#fbf8f1',
        color: selected ? 'var(--kinari)' : 'var(--sumi)',
        border: `1px solid ${selected ? 'var(--sumi)' : 'var(--line)'}`,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        transition: 'all .2s',
      }}
    >
      <div className="room-option__head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{
          fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 600, letterSpacing: '.06em',
        }}
        >
          {jp}
        </span>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.2em', color: selected ? 'var(--kincha)' : 'var(--aka)',
        }}
        >
          {en}
        </span>
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.7, opacity: selected ? 0.85 : 0.75 }}>{desc}</div>
      <div style={{
        fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.16em', marginTop: 4, color: selected ? 'var(--kincha)' : 'var(--aka)',
      }}
      >
        {price}
      </div>
    </button>
  );
}

/* ============================================================
   BOOKING FORM — multi-step
   ============================================================ */

const ROOMS = [
  {
    id: 'matsu', jp: '本館・松', en: 'MATSU', desc: '十畳の標準和室、檜の内風呂。', price: '¥28,000〜 / 人',
  },
  {
    id: 'take', jp: '本館・竹', en: 'TAKE', desc: '十二畳＋次の間、二名様に最適。', price: '¥34,000〜 / 人',
  },
  {
    id: 'ume', jp: '特別室・梅', en: 'UME', desc: '二間続き、専用の坪庭付き。', price: '¥46,000〜 / 人',
  },
  {
    id: 'rokuen', jp: '離れ・鹿苑', en: 'ROKUEN', desc: '若草山ビュー・檜の半露天付き。', price: '¥58,000〜 / 人',
  },
];

function BookingForm({
  initial = {}, embedded = false, onSubmitted, idPrefix = 'bk',
}) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    checkIn: initial.checkIn || addDays(today(), 14),
    checkOut: initial.checkOut || addDays(today(), 16),
    adults: 2,
    children: 0,
    room: 'rokuen',
    plan: 'kaiseki',
    name: '',
    kana: '',
    email: '',
    phone: '',
    pickup: 'none',
    notes: '',
    ...initial,
  });
  const update = (k, v) => setData((d) => ({ ...d, [k]: v }));

  const n = useMemo(() => nights(data.checkIn, data.checkOut), [data.checkIn, data.checkOut]);
  const roomObj = ROOMS.find((r) => r.id === data.room);
  const basePrice = useMemo(() => {
    const p = {
      matsu: 28000, take: 34000, ume: 46000, rokuen: 58000,
    }[data.room] || 0;
    const planAdd = { kaiseki: 0, premium: 8000, simple: -4000 }[data.plan] || 0;
    return (p + planAdd) * data.adults * n + ((p + planAdd) * 0.5) * data.children * n;
  }, [data, n]);

  const canNext1 = n >= 1 && data.adults + data.children >= 1;
  const canNext2 = !!data.room && !!data.plan;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
  const phoneOk = /^[\d\-+()\s]{8,}$/.test(data.phone);
  const canSubmit = data.name.trim() && data.kana.trim() && emailOk && phoneOk;

  const [submitted, setSubmitted] = useState(false);

  /* ---------- step UIs ---------- */

  const StepNav = () => (
    <div className="booking-steps" style={{
      display: 'flex', gap: 0, marginBottom: 36, borderBottom: '1px solid var(--line)',
    }}
    >
      {['日程・人数', 'お部屋・お食事', 'ご連絡先', 'ご確認'].map((s, i) => {
        const active = step === i + 1;
        const done = step > i + 1;
        return (
          <div
            className="booking-steps__item"
            key={s}
            style={{
              flex: 1,
              padding: '16px 8px',
              borderBottom: active ? '2px solid var(--aka)' : '2px solid transparent',
              marginBottom: -1,
              opacity: active || done ? 1 : 0.45,
            }}
          >
            <div style={{
              fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.22em', color: 'var(--aka)', marginBottom: 4,
            }}
            >
              STEP
              {' '}
              {i + 1}
            </div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 14, letterSpacing: '.08em' }}>{s}</div>
          </div>
        );
      })}
    </div>
  );

  if (submitted) {
    return (
      <div style={{ padding: embedded ? 0 : 48, textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.22em', color: 'var(--aka)', marginBottom: 18,
        }}
        >
          RESERVATION RECEIVED
        </div>
        <h3 style={{
          fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 600, margin: '0 0 18px', letterSpacing: '.08em',
        }}
        >
          ご予約を承りました。
        </h3>
        <p className="body" style={{ maxWidth: 520, margin: '0 auto 24px' }}>
          {data.email}
          {' '}
          宛に確認メールをお送りいたしました。
          <br />
          お電話
          {' '}
          {data.phone}
          {' '}
          にてご連絡を差し上げる場合がございます。
          <br />
          ご到着を心よりお待ちしております。
        </p>
        <div style={{
          display: 'inline-block', padding: '20px 28px', background: 'var(--kinari-2)', border: '1px solid var(--line)', textAlign: 'left', fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.1em', lineHeight: 2,
        }}
        >
          <div>
            RES NO.　— SK-
            {Math.floor(Math.random() * 90000) + 10000}
          </div>
          <div>
            STAY　　 —
            {fmtISO(data.checkIn)}
            {' '}
            →
            {fmtISO(data.checkOut)}
            {' '}
            (
            {n}
            泊)
          </div>
          <div>
            ROOM　　 —
            {roomObj?.jp}
          </div>
          <div>
            GUESTS 　— 大人
            {data.adults}
            {' '}
            / 子ども
            {data.children}
          </div>
          <div style={{ color: 'var(--aka)' }}>
            TOTAL　 — ¥
            {basePrice.toLocaleString()}
          </div>
        </div>
        <div style={{ marginTop: 32 }}>
          <button className="btn btn--ghost" onClick={() => { setSubmitted(false); setStep(1); }}>
            別のご予約をする
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-form">
      <StepNav />

      {step === 1 && (
        <div style={{ display: 'grid', gap: 28 }}>
          <div className="booking-date-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <label style={{
                display: 'block', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.2em', color: 'var(--sumi-2)', marginBottom: 8,
              }}
              >
                CHECK-IN ／ ご到着
              </label>
              <DatePicker
                value={data.checkIn}
                min={today()}
                onChange={(d) => {
                  update('checkIn', d);
                  if (data.checkOut <= d) update('checkOut', addDays(d, 1));
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.2em', color: 'var(--sumi-2)', marginBottom: 8,
              }}
              >
                CHECK-OUT ／ ご出発
              </label>
              <DatePicker
                value={data.checkOut}
                min={addDays(data.checkIn, 1)}
                onChange={(d) => update('checkOut', d)}
              />
            </div>
          </div>
          <div style={{
            fontFamily: 'var(--serif)', fontSize: 14, letterSpacing: '.08em', color: 'var(--aka)',
          }}
          >
            ご滞在 —
            {' '}
            {n}
            {' '}
            泊
          </div>
          <div>
            <Counter label="大人" sub="（13歳以上）" value={data.adults} onChange={(v) => update('adults', v)} min={1} max={6} />
            <Counter label="お子様" sub="（0〜12歳）" value={data.children} onChange={(v) => update('children', v)} min={0} max={4} />
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ display: 'grid', gap: 28 }}>
          <div>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.2em', color: 'var(--sumi-2)', marginBottom: 12,
            }}
            >
              ROOM ／ お部屋を選ぶ
            </div>
            <div className="booking-room-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {ROOMS.map((r) => (
                <RoomOption key={r.id} {...r} selected={data.room === r.id} onSelect={(id) => update('room', id)} />
              ))}
            </div>
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.2em', color: 'var(--sumi-2)', marginBottom: 12,
            }}
            >
              MEAL ／ お食事プラン
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              {[
                {
                  id: 'kaiseki', jp: '月替わり会席（標準）', desc: '夕食九品＋朝食。大和野菜と地酒のペアリング。', price: '',
                },
                {
                  id: 'premium', jp: '料理長おまかせ特別会席', desc: '黒毛和牛・鮑などの食材を中心に。', price: '+ ¥8,000 / 人 / 泊',
                },
                {
                  id: 'simple', jp: '軽めの会席（少量多品）', desc: '品数控えめ、味わいはそのまま。', price: '− ¥4,000 / 人 / 泊',
                },
              ].map((p) => (
                <button
                  className="meal-option"
                  key={p.id}
                  type="button"
                  onClick={() => update('plan', p.id)}
                  style={{
                    textAlign: 'left',
                    padding: 16,
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    alignItems: 'center',
                    gap: 16,
                    background: data.plan === p.id ? 'var(--sumi)' : '#fbf8f1',
                    color: data.plan === p.id ? 'var(--kinari)' : 'var(--sumi)',
                    border: `1px solid ${data.plan === p.id ? 'var(--sumi)' : 'var(--line)'}`,
                  }}
                >
                  <div>
                    <div style={{
                      fontFamily: 'var(--serif)', fontSize: 15, fontWeight: 600, letterSpacing: '.06em', marginBottom: 4,
                    }}
                    >
                      {p.jp}
                    </div>
                    <div style={{ fontSize: 12, opacity: data.plan === p.id ? 0.8 : 0.7 }}>{p.desc}</div>
                  </div>
                  <div style={{
                    fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.14em', color: data.plan === p.id ? 'var(--kincha)' : 'var(--aka)',
                  }}
                  >
                    {p.price || '標準'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ display: 'grid', gap: 18 }}>
          {[
            {
              k: 'name', l: 'お名前', ph: '山田 太郎', col: 1,
            },
            {
              k: 'kana', l: 'フリガナ', ph: 'ヤマダ タロウ', col: 1,
            },
            {
              k: 'email', l: 'メールアドレス', ph: 'name@example.com', col: 2, type: 'email',
            },
            {
              k: 'phone', l: 'お電話番号', ph: '090-0000-0000', col: 2, type: 'tel',
            },
          ].reduce((rows, f, i, arr) => {
            if (f.col === 1 || i === arr.length - 1) rows.push([f]);
            else if (rows[rows.length - 1].length < 2 && rows[rows.length - 1][0].col === 2) rows[rows.length - 1].push(f);
            else rows.push([f]);
            return rows;
          }, []).map((row, ri) => (
            <div key={ri} className="booking-field-row" style={{ display: 'grid', gridTemplateColumns: row.length === 2 ? '1fr 1fr' : '1fr', gap: 18 }}>
              {row.map((f) => (
                <div key={f.k}>
                  <label style={{
                    display: 'block', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.2em', color: 'var(--sumi-2)', marginBottom: 6,
                  }}
                  >
                    {f.l.toUpperCase()}
                    {' '}
                    ／
                    {f.l}
                    <span style={{ color: 'var(--aka)', marginLeft: 6 }}>*</span>
                  </label>
                  <input
                    id={`${idPrefix}-${f.k}`}
                    type={f.type || 'text'}
                    value={data[f.k]}
                    placeholder={f.ph}
                    onChange={(e) => update(f.k, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: 'var(--kinari)',
                      border: '1px solid var(--line)',
                      fontFamily: 'var(--serif)',
                      fontSize: 15,
                      letterSpacing: '.04em',
                    }}
                  />
                </div>
              ))}
            </div>
          ))}

          <div>
            <label style={{
              display: 'block', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.2em', color: 'var(--sumi-2)', marginBottom: 6,
            }}
            >
              PICKUP ／ 駅からの送迎（無料）
            </label>
            <select
              value={data.pickup}
              onChange={(e) => update('pickup', e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                background: 'var(--kinari)',
                border: '1px solid var(--line)',
                fontFamily: 'var(--serif)',
                fontSize: 15,
              }}
            >
              <option value="none">利用しない</option>
              <option value="jr">JR奈良駅から</option>
              <option value="kintetsu">近鉄奈良駅から</option>
            </select>
          </div>

          <div>
            <label style={{
              display: 'block', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.2em', color: 'var(--sumi-2)', marginBottom: 6,
            }}
            >
              NOTES ／ ご要望（任意）
            </label>
            <textarea
              value={data.notes}
              rows={3}
              placeholder="アレルギー、ベジタリアン対応、記念日のサプライズなど"
              onChange={(e) => update('notes', e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                background: 'var(--kinari)',
                border: '1px solid var(--line)',
                fontFamily: 'var(--serif)',
                fontSize: 14,
                resize: 'vertical',
              }}
            />
          </div>

          <div className="body-sm" style={{ paddingTop: 8 }}>
            ※ 入力項目は最小限にしています。確認メール後に、お食事制限などの詳細を伺います。
          </div>
        </div>
      )}

      {step === 4 && (
        <div style={{ display: 'grid', gap: 20 }}>
          <div style={{ padding: 24, background: '#fbf8f1', border: '1px solid var(--line)' }}>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.2em', color: 'var(--aka)', marginBottom: 14,
            }}
            >
              ご予約内容のご確認
            </div>
            {[
              ['ご宿泊', `${fmtJP(data.checkIn)} 〜 ${fmtJP(data.checkOut)}（${n}泊）`],
              ['ご人数', `大人 ${data.adults}名 / お子様 ${data.children}名`],
              ['お部屋', `${roomObj?.jp}（${roomObj?.en}）`],
              ['お食事', { kaiseki: '月替わり会席', premium: 'おまかせ特別会席', simple: '軽めの会席' }[data.plan]],
              ['送　迎', { none: '利用しない', jr: 'JR奈良駅から', kintetsu: '近鉄奈良駅から' }[data.pickup]],
              ['お名前', `${data.name}（${data.kana}）`],
              ['ご連絡先', `${data.email} ／ ${data.phone}`],
              ['ご要望', data.notes || '—'],
            ].map(([k, v]) => (
              <div
                className="booking-confirm-row"
                key={k}
                style={{
                  display: 'grid', gridTemplateColumns: '100px 1fr', gap: 16, padding: '10px 0', borderBottom: '1px dashed var(--line)',
                }}
              >
                <div style={{
                  fontFamily: 'var(--serif)', fontSize: 13, color: 'var(--sumi-2)', letterSpacing: '.1em',
                }}
                >
                  {k}
                </div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 14, letterSpacing: '.04em' }}>{v}</div>
              </div>
            ))}
            <div className="booking-total" style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '16px 0 0', marginTop: 8,
            }}
            >
              <span style={{ fontFamily: 'var(--serif)', fontSize: 15, letterSpacing: '.1em' }}>合計（税・サービス料込）</span>
              <span style={{
                fontFamily: 'var(--serif)', fontSize: 30, color: 'var(--aka)', fontWeight: 600, letterSpacing: '.02em',
              }}
              >
                ¥
                {basePrice.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="body-sm">
            ※ お支払いは現地にて。クレジットカード・現金がご利用いただけます。
            <br />
            ※ キャンセルポリシー：7日前まで無料／前日50%／当日100%。
          </div>
        </div>
      )}

      {/* nav buttons */}
      <div className="booking-actions" style={{
        display: 'flex', justifyContent: 'space-between', marginTop: 36, paddingTop: 24, borderTop: '1px solid var(--line)',
      }}
      >
        <button
          className="btn btn--ghost"
          type="button"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          style={{ opacity: step === 1 ? 0.3 : 1 }}
        >
          <span className="btn__arrow">←</span>
          {' '}
          戻る
        </button>
        {step < 4 ? (
          <button
            className="btn"
            type="button"
            onClick={() => setStep((s) => s + 1)}
            disabled={(step === 1 && !canNext1) || (step === 2 && !canNext2)}
            style={{ opacity: (step === 1 && !canNext1) || (step === 2 && !canNext2) ? 0.5 : 1 }}
          >
            次へ進む
            {' '}
            <span className="btn__arrow">→</span>
          </button>
        ) : (
          <button
            className="btn btn--aka"
            type="button"
            onClick={() => {
              if (!canSubmit) return;
              setSubmitted(true);
              onSubmitted && onSubmitted(data);
            }}
            disabled={!canSubmit}
            style={{ opacity: canSubmit ? 1 : 0.5 }}
          >
            この内容で予約する
            {' '}
            <span className="btn__arrow">→</span>
          </button>
        )}
      </div>

      {step === 3 && !canSubmit && (
        <div className="body-sm" style={{ marginTop: 14, color: 'var(--aka)' }}>
          ※ お名前・フリガナ・正しいメール・電話番号をご入力ください。
        </div>
      )}
    </div>
  );
}

/* ============================================================
   FINAL CTA section (block 10)
   ============================================================ */

function CTA() {
  const ref = useReveal();
  return (
    <section ref={ref} id="reserve" className="dark" style={{ paddingTop: 120, paddingBottom: 120 }}>
      <div className="wrap">
        <div className="fade" style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 className="h-section" style={{ color: 'var(--kinari)' }}>
            さあ、奈良の朝へ。
          </h2>
          <p className="body-lg" style={{ color: 'rgba(244,239,230,.8)', maxWidth: 580, margin: '20px auto 0' }}>
            ご予約は約3分。
            <br />
            空室確認から、ご連絡先のご入力まで、このページで完結します。
          </p>
        </div>

        <div
          className="fade booking-panel"
          style={{
            background: 'var(--kinari)',
            color: 'var(--sumi)',
            padding: '48px clamp(24px, 4vw, 56px)',
            maxWidth: 920,
            margin: '0 auto',
            border: '1px solid var(--kincha)',
            position: 'relative',
          }}
        >
          <BookingForm idPrefix="main" />
        </div>

        {/* secondary contact */}
        <div
          className="fade reserve-contact"
          style={{
            marginTop: 48,
            paddingTop: 32,
            borderTop: '1px solid rgba(244,239,230,.18)',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 32,
            textAlign: 'center',
          }}
        >
          <div>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.22em', color: 'var(--kincha)', marginBottom: 8,
            }}
            >
              TEL ／ お電話でのご予約
            </div>
            <div style={{
              fontFamily: 'var(--serif)', fontSize: 26, letterSpacing: '.08em', color: 'var(--kinari)',
            }}
            >
              0742-00-0000
            </div>
            <div className="body-sm" style={{ color: 'rgba(244,239,230,.6)', marginTop: 6 }}>
              受付 9:00 – 21:00（年中無休）
            </div>
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.22em', color: 'var(--kincha)', marginBottom: 8,
            }}
            >
              ACCESS ／ アクセス
            </div>
            <div style={{
              fontFamily: 'var(--serif)', fontSize: 16, letterSpacing: '.06em', color: 'var(--kinari)', lineHeight: 1.7,
            }}
            >
              奈良県奈良市登大路町 ●●
              <br />
              JR奈良駅から徒歩15分（送迎可）
            </div>
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.22em', color: 'var(--kincha)', marginBottom: 8,
            }}
            >
              EMAIL ／ メール
            </div>
            <div style={{
              fontFamily: 'var(--serif)', fontSize: 16, letterSpacing: '.06em', color: 'var(--kinari)',
            }}
            >
              info@shikanoyado.example
            </div>
            <div className="body-sm" style={{ color: 'rgba(244,239,230,.6)', marginTop: 6 }}>
              24時間以内にご返信
            </div>
          </div>
        </div>

        <style>
          {`
          @media (max-width: 760px){
            #reserve .fade[style*="repeat(3, 1fr)"]{ grid-template-columns: 1fr !important; }
            #reserve .fade > div[style*="1fr 1fr"]{ grid-template-columns: 1fr !important; }
          }
        `}
        </style>
      </div>
    </section>
  );
}

/* ============================================================
   STICKY widget (always-on bottom-right)
   ============================================================ */

function StickyReserve({ onOpen }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <button
      className="sticky-reserve"
      onClick={onOpen}
      aria-label="ご予約フォームを開く"
      style={{
        position: 'fixed',
        right: 24,
        bottom: 24,
        zIndex: 60,
        padding: '16px 22px',
        background: 'var(--aka)',
        color: 'var(--kinari)',
        fontFamily: 'var(--serif)',
        fontSize: 14,
        letterSpacing: '.16em',
        boxShadow: '0 12px 36px rgba(26,24,22,.28)',
        transform: visible ? 'translateY(0)' : 'translateY(120%)',
        opacity: visible ? 1 : 0,
        transition: 'transform .4s ease, opacity .4s ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <span style={{
        width: 8, height: 8, borderRadius: '50%', background: 'var(--kincha)', boxShadow: '0 0 0 4px rgba(176,137,71,.25)',
      }}
      />
      空室を確認する
      <span style={{ fontFamily: 'var(--mono)' }}>→</span>
    </button>
  );
}

/* ============================================================
   MODAL form (for nav + sticky)
   ============================================================ */

function BookingModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="booking-modal"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(26,24,22,.7)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '60px 16px 40px',
        overflowY: 'auto',
      }}
    >
      <div
        className="booking-modal__panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--kinari)',
          width: 'min(920px, 100%)',
          padding: 'clamp(24px, 4vw, 48px)',
          position: 'relative',
          border: '1px solid var(--kincha)',
        }}
      >
        <button
          onClick={onClose}
          aria-label="閉じる"
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            width: 36,
            height: 36,
            border: '1px solid var(--line)',
            fontFamily: 'var(--mono)',
            fontSize: 18,
          }}
        >
          ×
        </button>
        <div style={{ marginBottom: 24 }}>
          <span className="num" style={{ display: 'block', marginBottom: 10 }}>RESERVE — ご予約</span>
          <h3 style={{
            fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 600, margin: 0, letterSpacing: '.06em',
          }}
          >
            鹿乃宿、ご宿泊のご予約
          </h3>
        </div>
        <BookingForm idPrefix="modal" />
      </div>
    </div>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */

function Footer() {
  return (
    <footer id="access" style={{ background: '#100f0d', color: 'rgba(244,239,230,.7)', padding: '72px 0 32px' }}>
      <div className="wrap footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 40 }}>
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18,
          }}
          >
            <span style={{
              width: 36, height: 36, border: '1px solid var(--kincha)', display: 'grid', placeItems: 'center', fontFamily: 'var(--serif)', fontSize: 16, color: 'var(--kincha)',
            }}
            >
              鹿
            </span>
            <span style={{
              fontFamily: 'var(--serif)', fontSize: 18, letterSpacing: '.2em', color: 'var(--kinari)',
            }}
            >
              鹿乃宿
            </span>
          </div>
          <p className="body-sm" style={{ color: 'rgba(244,239,230,.6)', maxWidth: 320 }}>
            奈良公園のすぐそば。明治二十五年創業、五代続く木造の宿。
            朝の散歩から、旅をはじめませんか。
          </p>
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.22em', color: 'var(--kincha)', marginBottom: 14,
          }}
          >
            ACCESS
          </div>
          <div className="body-sm" style={{ color: 'rgba(244,239,230,.7)', lineHeight: 2 }}>
            〒630-8213
            <br />
            奈良県奈良市登大路町 ●●
            <br />
            TEL 0742-00-0000
          </div>
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.22em', color: 'var(--kincha)', marginBottom: 14,
          }}
          >
            HOURS
          </div>
          <div className="body-sm" style={{ color: 'rgba(244,239,230,.7)', lineHeight: 2 }}>
            チェックイン　15:00
            <br />
            チェックアウト 11:00
            <br />
            受付 9:00 – 21:00
          </div>
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.22em', color: 'var(--kincha)', marginBottom: 14,
          }}
          >
            LINKS
          </div>
          <div className="body-sm" style={{ color: 'rgba(244,239,230,.7)', lineHeight: 2 }}>
            <a href="#about">宿について</a>
            <br />
            <a href="#rooms">客室・料理</a>
            <br />
            <a href="#faq">よくある質問</a>
            <br />
            <a href="#reserve">ご予約</a>
          </div>
        </div>
      </div>
      <div
        className="wrap"
        style={{
          marginTop: 56, paddingTop: 24, borderTop: '1px solid rgba(244,239,230,.12)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.18em', color: 'rgba(244,239,230,.45)',
        }}
      >
        <span>© 鹿乃宿 SHIKANOYADO — EST. 1892. SAMPLE LP.</span>
        <span>NARA, JAPAN — 奈良公園 徒歩3分</span>
      </div>
      <style>
        {`
        @media (max-width:860px){
          footer .wrap[style*="1.4fr 1fr 1fr 1fr"]{ grid-template-columns: 1fr 1fr !important; }
        }
      `}
      </style>
    </footer>
  );
}

Object.assign(window, {
  BookingForm, CTA, StickyReserve, BookingModal, Footer,
});

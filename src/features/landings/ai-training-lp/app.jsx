/* ============================================================
   AI研修 LP — App shell + Side Index + Tweaks integration
   ============================================================ */

const BLOCKS = [
  {
    id: 'top', no: '01', name: 'ファーストビュー', label: 'FV',
  },
  {
    id: 'problem', no: '02', name: '問題提起', label: 'PROBLEMS',
  },
  {
    id: 'empathy', no: '03', name: '共感', label: 'EMPATHY',
  },
  {
    id: 'solution', no: '04', name: '解決策', label: 'SOLUTION',
  },
  {
    id: 'service', no: '05', name: 'サービス説明', label: 'SERVICE',
  },
  {
    id: 'strengths', no: '06', name: '強み', label: 'WHY US',
  },
  {
    id: 'results', no: '07', name: '実績', label: 'RESULTS',
  },
  {
    id: 'flow', no: '08', name: '導入フロー', label: 'PROCESS',
  },
  {
    id: 'faq', no: '09', name: 'よくある質問', label: 'FAQ',
  },
  {
    id: 'contact', no: '10', name: 'CTA / 申込', label: 'CONTACT',
  },
];

function SideIndex({ visible }) {
  const [active, setActive] = React.useState('top');
  React.useEffect(() => {
    if (!visible) return;
    const observers = BLOCKS.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(id); }),
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
      );
      io.observe(el);
      return io;
    });
    return () => observers.forEach((o) => o && o.disconnect());
  }, [visible]);

  if (!visible) return null;
  return (
    <aside
      aria-label="LP block index"
      className="hide-mobile"
      style={{
        position: 'fixed',
        top: '50%',
        right: 24,
        transform: 'translateY(-50%)',
        zIndex: 30,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        background: 'rgba(245,244,237,0.92)',
        backdropFilter: 'blur(10px)',
        border: '1px solid var(--border-2)',
        borderRadius: 14,
        padding: '12px 8px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
      }}
    >
      <div style={{
        fontSize: 9, letterSpacing: 1.4, color: 'var(--ink-3)', textTransform: 'uppercase', textAlign: 'center', padding: '4px 4px 8px', borderBottom: '1px solid var(--border-1)', marginBottom: 4,
      }}
      >
        10ブロック
      </div>
      {BLOCKS.map(({ id, no, name }) => (
        <a
          key={id}
          href={`#${id}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '6px 10px',
            borderRadius: 8,
            background: active === id ? 'var(--ink-1)' : 'transparent',
            color: active === id ? 'var(--on-dark-1)' : 'var(--ink-2)',
            transition: 'all 0.15s',
          }}
        >
          <span style={{
            fontFamily: 'var(--serif)', fontSize: 11, fontWeight: 500, opacity: 0.75, minWidth: 18,
          }}
          >
            {no}
          </span>
          <span style={{ fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap' }}>{name}</span>
        </a>
      ))}
    </aside>
  );
}

/* ─── Floating persistent CTA ─── */
function FloatingCTA() {
  // Hide when the contact form section is on screen (otherwise it overlaps the form)
  const [hideNearForm, setHideNearForm] = React.useState(false);
  React.useEffect(() => {
    const target = document.getElementById('contact');
    if (!target) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => setHideNearForm(e.isIntersecting)),
      { rootMargin: '0px 0px -20% 0px', threshold: 0.05 },
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* Mobile: bottom bar */}
      <div
        className="mobile-cta show-mobile"
        style={{
          opacity: hideNearForm ? 0 : 1,
          transform: hideNearForm ? 'translateY(120%)' : 'translateY(0)',
          transition: 'opacity 0.25s, transform 0.3s',
          pointerEvents: hideNearForm ? 'none' : 'auto',
        }}
      >
        <a href="#contact" className="btn btn--ghost btn--sm" style={{ flex: 1 }}>資料を無料DL</a>
        <a href="#contact" className="btn btn--primary btn--sm" style={{ flex: 1.4 }}>無料相談を予約</a>
      </div>

      {/* Desktop: floating pill bottom-right */}
      <a
        href="#contact"
        aria-label="無料相談を予約する"
        className="hide-mobile"
        style={{
          position: 'fixed',
          right: 24,
          bottom: 24,
          zIndex: 40,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 22px 14px 18px',
          background: 'var(--brand)',
          color: '#fff',
          borderRadius: 9999,
          fontFamily: 'var(--sans)',
          fontSize: 14,
          fontWeight: 500,
          boxShadow: '0 6px 22px rgba(201,100,66,0.36), 0 2px 6px rgba(0,0,0,0.10)',
          transition: 'transform 0.2s ease, background 0.2s ease, opacity 0.25s ease',
          opacity: hideNearForm ? 0 : 1,
          transform: hideNearForm ? 'translateY(20px) scale(0.96)' : 'translateY(0) scale(1)',
          pointerEvents: hideNearForm ? 'none' : 'auto',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--brand-dark)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--brand)'; e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        <span
          aria-hidden
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.18)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 8.5a5.5 5.5 0 0 1-7.92 4.94L3 14l.57-3.08A5.5 5.5 0 1 1 14 8.5Z" />
          </svg>
        </span>
        <span style={{
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.15,
        }}
        >
          <span style={{
            fontSize: 10, opacity: 0.85, letterSpacing: 0.6, textTransform: 'uppercase',
          }}
          >
            60分 / オンライン
          </span>
          <span style={{ fontSize: 15, fontWeight: 500 }}>無料相談を予約</span>
        </span>
      </a>
    </>
  );
}

/* ─── Tweaks ─── */
const TWEAK_DEFAULTS = /* EDITMODE-BEGIN */{
  theme: 'ocean',
  heroHeadline: 'AIを入れるのではなく、',
}/* EDITMODE-END */;

function TweaksUI() {
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  React.useEffect(() => {
    if (t.theme && t.theme !== 'warm') {
      document.documentElement.setAttribute('data-theme', t.theme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [t.theme]);

  // Apply hero headline + index visibility globally via context-like signal
  React.useEffect(() => {
    window.__lpTweaks = t;
    window.dispatchEvent(new CustomEvent('lptweaks', { detail: t }));
  }, [t]);

  return (
    <window.TweaksPanel>
      <window.TweakSection title="カラーパレット">
        <window.TweakSelect
          label="テーマ"
          value={t.theme}
          onChange={(v) => setTweak('theme', v)}
          options={[
            { value: 'warm', label: 'Warm — テラコッタ + パーチメント (現在)' },
            { value: 'navy', label: 'Navy — ネイビー + ティール' },
            { value: 'sage', label: 'Sage — セージグリーン + クリーム' },
            { value: 'sunset', label: 'Sunset — プラム + アンバー' },
            { value: 'charcoal', label: 'Charcoal — チャコール + マゼンタ' },
            { value: 'ocean', label: 'Ocean — ディープティール + コーラル' },
          ]}
        />
      </window.TweakSection>
      <window.TweakSection title="コピー">
        <window.TweakSelect
          label="ヒーロー見出し"
          value={t.heroHeadline}
          onChange={(v) => setTweak('heroHeadline', v)}
          options={[
            { value: 'AIを入れるのではなく、', label: 'AIを入れるのではなく' },
            { value: '目的は、業務改善。', label: '目的は、業務改善。' },
            { value: 'AIは、手段にすぎない。', label: 'AIは、手段にすぎない。' },
            { value: '業務を、変える。', label: '業務を、変える。' },
          ]}
        />
      </window.TweakSection>
    </window.TweaksPanel>
  );
}

/* ─── Custom hook: subscribe to tweaks ─── */
function useLpTweaks() {
  const [t, setT] = React.useState(window.__lpTweaks || TWEAK_DEFAULTS);
  React.useEffect(() => {
    const h = (e) => setT(e.detail);
    window.addEventListener('lptweaks', h);
    return () => window.removeEventListener('lptweaks', h);
  }, []);
  return t;
}

/* ─── App ─── */
function App() {
  const t = useLpTweaks();
  return (
    <>
      <main>
        <window.Hero headline={t.heroHeadline} />
        <window.Problem />
        <window.Empathy />
        <window.Solution />
        <window.Service />
        <window.Strengths />
        <window.Results />
        <window.Flow />
        <window.FAQ />
        <window.CTA />
      </main>
      <SideIndex visible={Boolean(t.showIndex)} />
      <window.Footer />
      <FloatingCTA />
      <TweaksUI />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

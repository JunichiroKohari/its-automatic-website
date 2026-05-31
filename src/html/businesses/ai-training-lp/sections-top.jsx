/* ============================================================
   AI研修 LP — Section components (Hero → Solution)
   ============================================================ */

/* ─── HOOK: scroll state ─── */
function useScrolled(threshold = 24) {
  const [s, setS] = React.useState(false);
  React.useEffect(() => {
    const h = () => setS(window.scrollY > threshold);
    h();
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, [threshold]);
  return s;
}

/* ─── NAV ─── */
function Nav() {
  const scrolled = useScrolled(20);
  const [open, setOpen] = React.useState(false);
  const links = [
    ['#problem', '課題'],
    ['#solution', '解決策'],
    ['#service', 'サービス'],
    ['#results', '導入事例'],
    ['#flow', '導入の流れ'],
    ['#faq', 'よくある質問'],
  ];
  return (
    <header className={`nav-bar${scrolled ? ' scrolled' : ''}`}>
      <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <img
          src="assets/logo-primary.png"
          alt="It's Automatic"
          style={{ height: 28, width: 'auto' }}
        />
        <span
          style={{
            fontFamily: 'var(--serif)',
            fontSize: 13,
            color: 'var(--ink-2)',
            letterSpacing: 0.5,
            paddingLeft: 12,
            marginLeft: 6,
            borderLeft: '1px solid var(--border-2)',
          }}
        >
          AI研修サービス
        </span>
      </a>
      <nav className="nav-links">
        {links.map(([h, l]) => (
          <a key={h} href={h}>
            {l}
          </a>
        ))}
        <a href="#contact" className="btn btn--primary btn--sm">
          無料相談を予約
        </a>
      </nav>
      <button
        className="show-mobile"
        aria-label="menu"
        onClick={() => setOpen((o) => !o)}
        style={{ padding: 8 }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <line x1="2" y1="6" x2="20" y2="6" />
          <line x1="2" y1="12" x2="20" y2="12" />
          <line x1="2" y1="18" x2="20" y2="18" />
        </svg>
      </button>
      {open && (
        <div
          className="show-mobile"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'var(--bg-ivory)',
            borderBottom: '1px solid var(--border-2)',
            padding: '24px var(--px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          {links.map(([h, l]) => (
            <a
              key={h}
              href={h}
              onClick={() => setOpen(false)}
              style={{ fontSize: 15 }}
            >
              {l}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="btn btn--primary"
            style={{ alignSelf: 'flex-start' }}
          >
            無料相談を予約
          </a>
        </div>
      )}
    </header>
  );
}

/* ─── 01 HERO ─── */
function Hero({ headline }) {
  const main = headline || 'AIを入れるのではなく、';
  return (
    <>
      <section
        id="top"
        className="hero-section"
        style={{
          position: 'relative',
          minHeight: 'min(960px, 100vh)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          color: '#ffffff',
        }}
      >
        {/* Background image */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=2400&q=88&auto=format&fit=crop"
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'saturate(0.82) contrast(1.04)',
            }}
          />
          {/* Top dark gradient for logo + nav legibility */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(20,20,19,0.62) 0%, rgba(20,20,19,0.35) 18%, rgba(20,20,19,0.40) 55%, rgba(20,20,19,0.82) 100%)',
            }}
          />
          {/* Center vignette for headline area */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(ellipse 75% 60% at 50% 50%, rgba(20,20,19,0.55) 0%, rgba(20,20,19,0.30) 50%, transparent 85%)',
            }}
          />
          {/* Warm tonal overlay to match palette */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(135deg, rgba(201,100,66,0.16) 0%, transparent 50%, rgba(20,20,19,0.25) 100%)',
              mixBlendMode: 'multiply',
            }}
          />
        </div>

        {/* Brand mark — top left */}
        <a
          href="#top"
          aria-label="It's Automatic"
          style={{
            position: 'absolute',
            top: 'clamp(20px, 3vw, 36px)',
            left: 'var(--px)',
            zIndex: 5,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <img
            src="assets/logo-primary.png"
            alt="It's Automatic"
            style={{
              height: 26,
              width: 'auto',
              filter: 'brightness(0) invert(1)',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 12,
              color: 'rgba(255,255,255,0.85)',
              letterSpacing: 0.5,
              paddingLeft: 10,
              borderLeft: '1px solid rgba(255,255,255,0.25)',
            }}
          >
            AI研修サービス
          </span>
        </a>

        {/* Content — vertically centered */}
        <div
          className="hero-content"
          style={{
            position: 'relative',
            zIndex: 2,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding:
              'clamp(120px, 14vh, 180px) var(--px) clamp(120px, 16vh, 200px)',
            textAlign: 'center',
          }}
        >
          <div className="container" style={{ maxWidth: 1080 }}>
            <window.Reveal delay={0.08} y={24}>
              <h1
                className="hero-title"
                style={{
                  margin: '0 auto 36px',
                  maxWidth: 1000,
                  fontFamily: 'var(--serif)',
                  fontWeight: 500,
                  color: '#ffffff',
                  fontSize: 'clamp(38px, 6.8vw, 92px)',
                  lineHeight: 1.22,
                  letterSpacing: '-0.01em',
                  textWrap: 'balance',
                  wordBreak: 'auto-phrase',
                  textShadow:
                    '0 2px 28px rgba(0,0,0,0.75), 0 1px 4px rgba(0,0,0,0.55)',
                }}
              >
                <span style={{ display: 'block', marginBottom: '0.12em' }}>
                  {main}
                </span>
                <span style={{ display: 'block' }}>
                  <span
                    style={{
                      backgroundImage:
                        'linear-gradient(transparent 62%, rgba(232,123,84,0.55) 62%, rgba(232,123,84,0.55) 92%, transparent 92%)',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '100% 100%',
                      padding: '0 6px',
                    }}
                  >
                    業務を変える
                  </span>
                  ところから、始めます。
                </span>
              </h1>
            </window.Reveal>

            <window.Reveal delay={0.18} y={20}>
              <p
                className="hero-lead"
                style={{
                  maxWidth: 680,
                  margin: '0 auto 48px',
                  fontSize: 'clamp(15px, 1.5vw, 19px)',
                  lineHeight: 1.85,
                  color: '#ffffff',
                  textWrap: 'pretty',
                  wordBreak: 'auto-phrase',
                  textShadow:
                    '0 2px 16px rgba(0,0,0,0.70), 0 1px 3px rgba(0,0,0,0.5)',
                }}
              >
                AIを学ぶことがゴールではありません。「どの業務を、どう効率化するか」から逆算することで、受講者が明日から手を動かせる研修を設計します。
              </p>
            </window.Reveal>

            <window.Reveal delay={0.28} y={20}>
              <div
                className="hero-actions"
                style={{
                  display: 'flex',
                  gap: 14,
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                <a
                  href="#contact"
                  className="btn btn--arrow"
                  style={{
                    background: 'var(--brand-coral)',
                    color: '#ffffff',
                    boxShadow:
                      '0 6px 22px rgba(232,123,84,0.55), 0 1px 6px rgba(0,0,0,0.30)',
                  }}
                >
                  資料を無料ダウンロード
                </a>
                <a
                  href="#contact"
                  className="btn"
                  style={{
                    background: 'rgba(255,255,255,0.10)',
                    color: '#ffffff',
                    border: '1.5px solid var(--brand-coral)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 18px rgba(0,0,0,0.25)',
                  }}
                >
                  60分の無料相談を予約
                </a>
              </div>
            </window.Reveal>
          </div>

          {/* Scroll indicator */}
          <div
            style={{
              position: 'absolute',
              bottom: 32,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              color: 'rgba(255,255,255,0.7)',
              fontSize: 10,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              animation: 'float 2.4s ease-in-out infinite',
            }}
          >
            <span>Scroll</span>
            <svg
              width="12"
              height="24"
              viewBox="0 0 12 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="1" y="1" width="10" height="18" rx="5" />
              <circle cx="6" cy="7" r="1.5" fill="currentColor" stroke="none">
                <animate
                  attributeName="cy"
                  values="7;11;7"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          </div>
        </div>
      </section>

      {/* Stats ribbon — below hero, full bleed editorial */}
      <section
        className="section"
        style={{
          paddingTop: 'clamp(48px, 7vw, 80px)',
          paddingBottom: 'clamp(48px, 7vw, 80px)',
          background: 'var(--bg-parchment)',
        }}
      >
        <div className="container">
          <window.Reveal y={16}>
            <div
              className="hero-stats-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 'clamp(12px, 1.4vw, 24px)',
              }}
            >
              {[
                { v: 50, suffix: '社+', k: '業務改善支援実績' },
                {
                  v: 8.6,
                  prefix: '+',
                  suffix: ' h / 週',
                  dec: 1,
                  k: '受講者あたり業務削減',
                },
                { v: 98, suffix: '%', k: '受講者満足度' },
                {
                  v: 2,
                  prefix: '最短 ',
                  suffix: ' 週間',
                  k: '研修開始までの期間',
                },
                { v: 0, k: '業務棚卸しから伴走', static: '棚卸し' },
              ].map((s, i) => (
                <div key={s.k} style={{ padding: '4px 0' }}>
                  <div
                    style={{
                      fontFamily: 'var(--serif)',
                      fontSize: 'clamp(28px, 3.4vw, 40px)',
                      fontWeight: 500,
                      color: 'var(--ink-1)',
                      lineHeight: 1.05,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {s.static ? (
                      s.static
                    ) : (
                      <>
                        <span
                          style={{
                            fontSize: '0.6em',
                            color: 'var(--ink-3)',
                            marginRight: 4,
                          }}
                        >
                          {s.prefix || ''}
                        </span>
                        <window.Counter
                          to={s.v}
                          decimals={s.dec || 0}
                          duration={1500}
                        />
                        <span
                          style={{
                            fontSize: '0.55em',
                            color: 'var(--ink-3)',
                            marginLeft: 4,
                          }}
                        >
                          {s.suffix || ''}
                        </span>
                      </>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: 'var(--ink-3)',
                      marginTop: 10,
                      letterSpacing: 0.3,
                    }}
                  >
                    {s.k}
                  </div>
                </div>
              ))}
            </div>
          </window.Reveal>
        </div>
      </section>
    </>
  );
}

function HeroPhoto() {
  const { Reveal, Parallax, Counter } = window;
  return (
    <div style={{ position: 'relative' }}>
      <Reveal y={32}>
        <div
          style={{
            position: 'relative',
            borderRadius: 'clamp(16px, 2vw, 28px)',
            overflow: 'hidden',
            boxShadow:
              '0 30px 80px rgba(20,20,19,0.18), 0 6px 18px rgba(20,20,19,0.06)',
            aspectRatio: '21 / 9',
            background: 'var(--bg-sand)',
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1800&q=85&auto=format&fit=crop"
            alt="チームで業務を棚卸ししている様子"
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'saturate(0.85) contrast(1.02)',
              display: 'block',
            }}
          />
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(135deg, rgba(20,20,19,0.20) 0%, rgba(20,20,19,0.55) 100%)',
              pointerEvents: 'none',
            }}
          />
          <div
            aria-hidden
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: '60%',
              background:
                'linear-gradient(180deg, transparent 0%, rgba(20,20,19,0.85) 100%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              padding: 'clamp(20px, 3vw, 36px)',
              color: '#ffffff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: 24,
              flexWrap: 'wrap',
              textShadow: '0 2px 12px rgba(0,0,0,0.45)',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: 1.4,
                  color: '#ffd2c0',
                  textTransform: 'uppercase',
                  marginBottom: 6,
                  fontWeight: 500,
                }}
              >
                Field — 業務棚卸しワークショップ
              </div>
              <div
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 'clamp(16px, 1.8vw, 22px)',
                  fontWeight: 500,
                  textWrap: 'balance',
                  maxWidth: 560,
                  color: '#ffffff',
                }}
              >
                「どの業務に時間がかかるか」を、まず可視化する。
              </div>
            </div>
            <div
              style={{
                padding: '10px 16px',
                background: 'rgba(20,20,19,0.55)',
                backdropFilter: 'blur(10px)',
                borderRadius: 9999,
                fontSize: 12,
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.22)',
                textShadow: 'none',
              }}
            >
              <span style={{ fontFamily: 'var(--serif)' }}>導入企業 50社+</span>
            </div>
          </div>
        </div>
      </Reveal>

      <Parallax
        speed={-0.05}
        style={{
          position: 'absolute',
          top: -28,
          left: -20,
          zIndex: 3,
        }}
      >
        <Reveal delay={0.5} y={20}>
          <div
            style={{
              background: 'var(--bg-dark)',
              color: 'var(--on-dark-1)',
              borderRadius: 14,
              padding: '16px 20px',
              boxShadow: '0 14px 36px rgba(0,0,0,0.22)',
              minWidth: 200,
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: 'var(--on-dark-3)',
                letterSpacing: 0.5,
                marginBottom: 6,
              }}
            >
              受講者ひとりあたり
            </div>
            <div
              style={{
                fontFamily: 'var(--serif)',
                fontSize: 26,
                fontWeight: 500,
                lineHeight: 1,
              }}
            >
              <span style={{ color: 'var(--brand-coral)' }}>
                -
                <Counter to={8.6} decimals={1} duration={1600} />
              </span>
              <span
                style={{
                  fontSize: 13,
                  marginLeft: 4,
                  color: 'var(--on-dark-2)',
                }}
              >
                時間 / 週
              </span>
            </div>
            <div
              style={{ fontSize: 11, color: 'var(--on-dark-2)', marginTop: 8 }}
            >
              業務削減時間（実測）
            </div>
          </div>
        </Reveal>
      </Parallax>

      <Parallax
        speed={0.06}
        style={{
          position: 'absolute',
          bottom: -32,
          right: -16,
          zIndex: 3,
        }}
      >
        <Reveal delay={0.7} y={20}>
          <div
            className="hide-mobile"
            style={{
              background: 'var(--bg-white)',
              border: '1px solid var(--border-2)',
              borderRadius: 14,
              padding: '18px 22px',
              boxShadow: '0 14px 36px rgba(0,0,0,0.10)',
              minWidth: 240,
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: 'var(--ink-3)',
                letterSpacing: 0.5,
                marginBottom: 12,
              }}
            >
              業務改善・部門別実績
            </div>
            <window.Bar
              value={9.4}
              max={12}
              suffix="h"
              color="var(--brand)"
              bg="var(--brand-soft)"
              height={6}
              duration={1200}
              delay={200}
              label="営業部"
            />
            <div style={{ height: 8 }} />
            <window.Bar
              value={10.6}
              max={12}
              suffix="h"
              color="var(--brand)"
              bg="var(--brand-soft)"
              height={6}
              duration={1300}
              delay={400}
              label="開発部"
            />
          </div>
        </Reveal>
      </Parallax>
    </div>
  );
}

function HeroComposition() {
  const {
    Reveal, Parallax, useInView, Counter,
  } = window;
  const [chatRef, chatInView] = useInView({ threshold: 0.25, once: false });

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: 520 }}>
      {/* Large parchment frame */}
      <Reveal delay={0.1} y={32}>
        <div
          ref={chatRef}
          style={{
            position: 'relative',
            background: 'var(--bg-ivory)',
            border: '1px solid var(--border-2)',
            borderRadius: 24,
            padding: 28,
            overflow: 'hidden',
            boxShadow:
              '0 24px 60px rgba(20,20,19,0.10), 0 4px 12px rgba(20,20,19,0.04)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              minHeight: 380,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: 14,
                borderBottom: '1px solid var(--border-1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    background: 'var(--brand)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--serif)',
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  A
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: 'var(--ink-1)',
                    }}
                  >
                    実践コース · DAY 2
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>
                    議事録 → 要約 → タスク化
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 10,
                  color: 'var(--brand)',
                  background: 'var(--brand-soft)',
                  padding: '4px 10px',
                  borderRadius: 9999,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--brand)',
                    display: 'inline-block',
                    animation: 'pulse 1.6s ease-in-out infinite',
                  }}
                />
                LIVE
              </div>
            </div>

            <ChatLoop active={chatInView} />

            <div
              style={{
                marginTop: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 14,
                borderTop: '1px solid var(--border-1)',
                fontSize: 11,
                color: 'var(--ink-3)',
              }}
            >
              <span>進捗 · 6/12 完了</span>
              <span>講師 · 田中 / 受講者 12名</span>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Floating "ROI" badge — parallax */}
      <Parallax
        speed={-0.06}
        style={{
          position: 'absolute',
          top: -24,
          left: -24,
          zIndex: 2,
        }}
      >
        <Reveal delay={0.5} y={20}>
          <div
            style={{
              background: 'var(--bg-dark)',
              color: 'var(--on-dark-1)',
              borderRadius: 14,
              padding: '16px 20px',
              boxShadow: '0 14px 36px rgba(0,0,0,0.20)',
              minWidth: 190,
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: 'var(--on-dark-3)',
                letterSpacing: 0.5,
                marginBottom: 6,
              }}
            >
              受講者ひとりあたり
            </div>
            <div
              style={{
                fontFamily: 'var(--serif)',
                fontSize: 26,
                fontWeight: 500,
                lineHeight: 1,
              }}
            >
              <span style={{ color: 'var(--brand-coral)' }}>
                -
                <Counter to={8.6} decimals={1} duration={1600} />
              </span>
              <span
                style={{
                  fontSize: 13,
                  marginLeft: 4,
                  color: 'var(--on-dark-2)',
                }}
              >
                時間 / 週
              </span>
            </div>
            <div
              style={{ fontSize: 11, color: 'var(--on-dark-2)', marginTop: 8 }}
            >
              定型業務の削減
            </div>
          </div>
        </Reveal>
      </Parallax>

      {/* Floating "受講前後スコア" badge — parallax other direction */}
      <Parallax
        speed={0.08}
        style={{
          position: 'absolute',
          bottom: -24,
          right: -16,
          zIndex: 2,
        }}
      >
        <Reveal delay={0.7} y={20}>
          <div
            style={{
              background: 'var(--bg-white)',
              border: '1px solid var(--border-2)',
              borderRadius: 14,
              padding: '16px 20px',
              boxShadow: '0 14px 36px rgba(0,0,0,0.10)',
              minWidth: 210,
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: 'var(--ink-3)',
                letterSpacing: 0.5,
                marginBottom: 10,
              }}
            >
              受講前後スキル診断
            </div>
            <window.Bar
              value={32}
              max={100}
              color="var(--ink-3)"
              bg="var(--border-2)"
              height={6}
              duration={900}
              delay={200}
              label="BEFORE"
            />
            <div style={{ height: 8 }} />
            <window.Bar
              value={78}
              max={100}
              color="var(--brand)"
              bg="var(--brand-soft)"
              height={6}
              duration={1300}
              delay={600}
              label="AFTER"
            />
          </div>
        </Reveal>
      </Parallax>
    </div>
  );
}

/* ─── Chat conversation loop ─── */
const CHAT_TURNS = [
  {
    role: 'user',
    text: 'この議事録から、来週までのアクションだけ抜き出して表にして。',
  },
  {
    role: 'assistant',
    kind: 'table',
    title: 'アクションリスト',
    cols: ['担当', 'タスク', '期限'],
    rows: [
      ['佐藤', '見積を再送付', '11/24'],
      ['田中', '契約書をリーガル送付', '11/26'],
      ['人事', '受講者枠を最終確定', '11/28'],
    ],
  },
  {
    role: 'instructor',
    text: 'いいですね。"期限の表記ゆれ"も整えてみましょう。',
  },

  { role: 'user', text: '営業日報を集計して、今月のサマリーを作って。' },
  {
    role: 'assistant',
    kind: 'summary',
    title: '11月 営業サマリー',
    items: [
      ['訪問件数', '142', '+18%'],
      ['受注件数', '23', '+9%'],
      ['平均単価', '¥384k', '+12%'],
    ],
  },
  {
    role: 'instructor',
    text: '前年同月比も併記すると、経営層に伝わりやすいですね。',
  },

  { role: 'user', text: '面接記録から、合格者に共通する特徴を3つ挙げて。' },
  {
    role: 'assistant',
    kind: 'bullets',
    title: '合格者の共通点 (n=42)',
    items: [
      '「具体例」を平均3件以上挙げている',
      '質問に対し30秒以内で結論から話す',
      '前職での数値成果を自発的に言及',
    ],
  },
  {
    role: 'instructor',
    text: '良い視点です。不合格者の傾向とも比較してみましょう。',
  },

  { role: 'user', text: '新入社員向けの説明会案内メールを、丁寧めに作って。' },
  {
    role: 'assistant',
    kind: 'email',
    title: '案内メール ドラフト',
    subject: '【ご案内】新入社員研修プログラムについて',
    body: '配属先の皆さま\n\nお世話になっております、人事部です。\n来月開始予定の新入社員研修プログラムについて、ご案内いたします…',
  },
  { role: 'instructor', text: '宛先・件名・本文の構造化、定着しましたね。' },
];

function ChatLoop({ active }) {
  const [items, setItems] = React.useState([]);
  const [typing, setTyping] = React.useState(null); // { role, text }
  const scrollRef = React.useRef(null);
  const stateRef = React.useRef({ cancelled: false });

  React.useEffect(() => {
    const state = { cancelled: false, timer: null };
    stateRef.current = state;
    if (!active) {
      // pause but keep state visible
      return () => {
        state.cancelled = true;
        clearTimeout(state.timer);
      };
    }
    let idx = 0;

    const schedule = (fn, ms) => {
      state.timer = setTimeout(() => {
        if (!state.cancelled) fn();
      }, ms);
    };

    const next = () => {
      if (state.cancelled) return;
      if (idx >= CHAT_TURNS.length) {
        // Fade out for loop reset
        schedule(() => {
          setItems([]);
          idx = 0;
          schedule(next, 500);
        }, 1800);
        return;
      }
      const turn = CHAT_TURNS[idx++];
      if (turn.role === 'user' || turn.role === 'instructor') {
        // Type letter-by-letter
        let i = 0;
        setTyping({ role: turn.role, text: '' });
        const typeChar = () => {
          if (state.cancelled) return;
          i++;
          setTyping({ role: turn.role, text: turn.text.slice(0, i) });
          if (i < turn.text.length) {
            state.timer = setTimeout(typeChar, 28 + Math.random() * 18);
          } else {
            // Finalize message into items
            setItems((arr) => [...arr, turn]);
            setTyping(null);
            schedule(next, turn.role === 'instructor' ? 1500 : 900);
          }
        };
        schedule(typeChar, 200);
      } else {
        // Assistant block — appears instantly
        setItems((arr) => [...arr, turn]);
        schedule(next, 2000);
      }
    };

    schedule(next, 300);
    return () => {
      state.cancelled = true;
      clearTimeout(state.timer);
    };
  }, [active]);

  // Auto-scroll on new content
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    });
  }, [items.length, typing]);

  return (
    <div
      ref={scrollRef}
      className="chat-scroll"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        fontSize: 12.5,
        height: 260,
        overflowY: 'auto',
        overflowX: 'hidden',
        position: 'relative',
        WebkitMaskImage:
          'linear-gradient(180deg, transparent 0%, #000 12%, #000 100%)',
        maskImage:
          'linear-gradient(180deg, transparent 0%, #000 12%, #000 100%)',
        paddingTop: 10,
      }}
    >
      {items.map((t, i) => (
        <Bubble key={`it-${i}`} turn={t} />
      ))}
      {typing && <Bubble turn={{ ...typing, typing: true }} />}
      <div style={{ height: 1, flexShrink: 0 }} />
    </div>
  );
}

function Bubble({ turn }) {
  const {
    role, text, typing, kind,
  } = turn;
  const isUser = role === 'user';
  const isInstructor = role === 'instructor';
  const isAssistant = role === 'assistant';

  if (isUser || isInstructor) {
    return (
      <div
        style={{
          background: 'var(--bg-parchment)',
          padding: '10px 14px',
          borderRadius: isInstructor
            ? '12px 12px 12px 4px'
            : '12px 12px 12px 4px',
          maxWidth: '88%',
          alignSelf: 'flex-start',
          animation: typing ? 'none' : 'slidein 0.3s ease both',
          flexShrink: 0,
          border: isInstructor ? '1px dashed var(--border-3)' : 'none',
        }}
      >
        <div
          style={{
            fontSize: 10,
            color: isInstructor ? 'var(--brand)' : 'var(--ink-3)',
            marginBottom: 4,
            letterSpacing: 0.4,
            fontWeight: isInstructor ? 500 : 400,
          }}
        >
          {isInstructor ? '講師' : 'YOU'}
        </div>
        <span>{text}</span>
        {typing && (
          <span
            style={{
              display: 'inline-block',
              width: 1.5,
              height: 14,
              background: 'var(--ink-1)',
              marginLeft: 2,
              verticalAlign: 'middle',
              animation: 'blink 1s steps(2) infinite',
            }}
          />
        )}
      </div>
    );
  }

  if (isAssistant) {
    return (
      <div
        style={{
          background: '#1e1e1c',
          color: 'var(--on-dark-1)',
          padding: '10px 14px',
          borderRadius: '12px 12px 4px 12px',
          maxWidth: '94%',
          alignSelf: 'flex-end',
          animation: 'slidein 0.35s ease both',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 6,
          }}
        >
          <span
            style={{
              fontSize: 10,
              color: 'var(--brand-coral)',
              letterSpacing: 0.4,
            }}
          >
            ASSISTANT
          </span>
          {turn.title && (
            <span style={{ fontSize: 10, color: 'var(--on-dark-3)' }}>
              {turn.title}
            </span>
          )}
        </div>
        {kind === 'table' && (
          <AssistantTable cols={turn.cols} rows={turn.rows} />
        )}
        {kind === 'summary' && <AssistantSummary items={turn.items} />}
        {kind === 'bullets' && <AssistantBullets items={turn.items} />}
        {kind === 'email' && (
          <AssistantEmail subject={turn.subject} body={turn.body} />
        )}
      </div>
    );
  }
  return null;
}

function AssistantTable({ cols, rows }) {
  const all = [cols, ...rows];
  return (
    <div
      style={{
        borderTop: '1px solid rgba(255,255,255,0.1)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '6px 0',
        display: 'grid',
        gridTemplateColumns: '1fr 1.6fr 0.7fr',
        gap: 8,
        fontSize: 11.5,
      }}
    >
      {all.map((row, i) => row.map((c, j) => (
        <span
          key={`${i}-${j}`}
          style={{
            opacity: 0,
            animation: 'fadeup 0.35s ease forwards',
            animationDelay: `${0.05 + i * 0.12 + j * 0.04}s`,
            color: i === 0 ? 'var(--on-dark-3)' : 'var(--on-dark-1)',
          }}
        >
          {c}
        </span>
      )))}
    </div>
  );
}

function AssistantSummary({ items }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        paddingTop: 4,
      }}
    >
      {items.map(([k, v, delta], i) => (
        <div
          key={k}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto auto',
            alignItems: 'baseline',
            gap: 10,
            padding: '4px 0',
            borderBottom:
              i < items.length - 1
                ? '1px solid rgba(255,255,255,0.06)'
                : 'none',
            opacity: 0,
            animation: 'fadeup 0.4s ease forwards',
            animationDelay: `${0.1 + i * 0.12}s`,
          }}
        >
          <span style={{ color: 'var(--on-dark-3)', fontSize: 11 }}>{k}</span>
          <span
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 14,
              color: 'var(--on-dark-1)',
              fontWeight: 500,
            }}
          >
            {v}
          </span>
          <span
            style={{
              color: 'var(--brand-coral)',
              fontSize: 10,
              fontWeight: 500,
            }}
          >
            {delta}
          </span>
        </div>
      ))}
    </div>
  );
}

function AssistantBullets({ items }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        paddingTop: 4,
      }}
    >
      {items.map((it, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            gap: 8,
            alignItems: 'flex-start',
            padding: '3px 0',
            opacity: 0,
            animation: 'fadeup 0.4s ease forwards',
            animationDelay: `${0.1 + i * 0.18}s`,
          }}
        >
          <span
            style={{
              color: 'var(--brand-coral)',
              fontFamily: 'var(--serif)',
              fontSize: 11,
              flexShrink: 0,
              marginTop: 1,
            }}
          >
            {i + 1}
            .
          </span>
          <span
            style={{
              fontSize: 12,
              color: 'var(--on-dark-1)',
              lineHeight: 1.55,
            }}
          >
            {it}
          </span>
        </div>
      ))}
    </div>
  );
}

function AssistantEmail({ subject, body }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        paddingTop: 4,
        fontSize: 11.5,
      }}
    >
      <div
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          paddingBottom: 6,
          opacity: 0,
          animation: 'fadeup 0.4s ease forwards',
          animationDelay: '0.1s',
        }}
      >
        <div
          style={{ color: 'var(--on-dark-3)', fontSize: 10, marginBottom: 2 }}
        >
          件名
        </div>
        <div style={{ color: 'var(--on-dark-1)' }}>{subject}</div>
      </div>
      <div
        style={{
          color: 'var(--on-dark-2)',
          whiteSpace: 'pre-line',
          lineHeight: 1.6,
          opacity: 0,
          animation: 'fadeup 0.4s ease forwards',
          animationDelay: '0.25s',
        }}
      >
        {body}
      </div>
    </div>
  );
}

/* ─── 02 PROBLEM ─── */
function Problem() {
  const pains = [
    {
      num: '01',
      title: 'AIを入れることが目的化している',
      desc: '「生成AIを導入せよ」と言われ見よう見まねで動く。しかし、どの業務を、なぜ改善するのかは語られない。',
    },
    {
      num: '02',
      title: 'ツール研修だけでは、業務は変わらない',
      desc: 'ChatGPTの使い方を教わっても、「で、明日何に使う」となる。業務の棚卸しがないまま使える人は現れない。',
    },
    {
      num: '03',
      title: '効果を「AI活用率」でしか語れない',
      desc: '「で、何時間削減できたんだ」と問われても、受講アンケートと「AIツール使用率」以上の数字が出せない。',
    },
    {
      num: '04',
      title: '受講者はやる気になっても、現場は動かない',
      desc: '研修当日は盛り上がる。だが、業務フローを見直さない限り、AIを使う「隚間」がないまま。',
    },
  ];
  return (
    <section
      id="problem"
      className="section section--dark"
      data-screen-label="02 Problem"
    >
      <div className="container">
        <div style={{ maxWidth: 880, marginBottom: 64 }}>
          <window.Reveal y={20}>
            <h2
              className="h-section"
              style={{
                color: 'var(--on-dark-1)',
                marginBottom: 28,
                textWrap: 'balance',
                wordBreak: 'auto-phrase',
                maxWidth: 760,
              }}
            >
              「AIを入れること」が
              <span style={{ color: 'var(--brand-coral)' }}>ゴール</span>
              になっていませんか？
            </h2>
          </window.Reveal>
          <window.Reveal delay={0.12} y={20}>
            <p
              className="lead on-dark"
              style={{
                maxWidth: 680,
                textWrap: 'pretty',
                wordBreak: 'auto-phrase',
              }}
            >
              AI研修を入れても、業務は変わらない。成果も見えない。その原因はスキル不足ではなく、「何を、なぜ改善するのか」が決まっていないことにあります。AIを入れることだけが目的化した研修は、現場を動かせません。
            </p>
          </window.Reveal>
        </div>

        <div className="problem-cards">
          {pains.map((p, i) => (
            <window.Reveal
              key={p.num}
              delay={i * 0.08}
              y={24}
              style={{ height: '100%', display: 'flex' }}
            >
              <div
                className="card card--dark"
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '28px 24px 26px',
                  minHeight: 200,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '40%',
                    height: 2,
                    background: 'var(--brand-coral)',
                  }}
                />
                <div
                  className="num-badge"
                  style={{ color: 'var(--brand-coral)', marginBottom: 18 }}
                >
                  {p.num}
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--serif)',
                    fontWeight: 500,
                    fontSize: 'clamp(15.5px, 1.55vw, 17px)',
                    lineHeight: 1.55,
                    color: 'var(--on-dark-1)',
                    marginBottom: 12,
                    textWrap: 'balance',
                    wordBreak: 'auto-phrase',
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    fontSize: 13.5,
                    lineHeight: 1.85,
                    color: 'var(--on-dark-2)',
                    textWrap: 'pretty',
                    wordBreak: 'auto-phrase',
                    marginTop: 'auto',
                  }}
                >
                  {p.desc}
                </p>
              </div>
            </window.Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 03 EMPATHY ─── */
function Empathy() {
  return (
    <section
      id="empathy"
      className="section"
      data-screen-label="03 Empathy"
      style={{ background: 'var(--bg-parchment)' }}
    >
      <div className="container" style={{ maxWidth: 920 }}>
        <window.Reveal delay={0.08}>
          <h2
            className="h-section"
            style={{
              textAlign: 'center',
              marginBottom: 56,
              textWrap: 'balance',
              wordBreak: 'auto-phrase',
              maxWidth: 780,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            AIは、
            <span className="accent-underline">目的ではない。</span>
            <br />
            業務を変えるための、手段だ。
          </h2>
        </window.Reveal>

        {/* Visual equation: means → end */}
        <window.Reveal delay={0.16} y={28}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              gap: 'clamp(12px, 2vw, 32px)',
              alignItems: 'stretch',
              marginBottom: 48,
            }}
            className="empathy-equation"
          >
            <div
              style={{
                background: 'var(--bg-ivory)',
                border: '1px solid var(--border-2)',
                borderRadius: 14,
                padding: 'clamp(20px, 3vw, 32px)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: 1.4,
                  color: 'var(--ink-3)',
                  textTransform: 'uppercase',
                  marginBottom: 10,
                }}
              >
                手段 / MEANS
              </div>
              <div
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 'clamp(20px, 2.4vw, 28px)',
                  fontWeight: 500,
                  color: 'var(--ink-2)',
                  textDecoration: 'line-through',
                  textDecorationColor: 'var(--border-3)',
                  textDecorationThickness: 1,
                }}
              >
                AIを導入する
              </div>
              <div
                style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 10 }}
              >
                これは目的ではありません
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--serif)',
                fontSize: 32,
                color: 'var(--brand)',
              }}
            >
              →
            </div>
            <div
              style={{
                background: 'var(--bg-dark)',
                color: 'var(--on-dark-1)',
                borderRadius: 14,
                padding: 'clamp(20px, 3vw, 32px)',
                textAlign: 'center',
                position: 'relative',
                boxShadow: '0 16px 40px rgba(0,0,0,0.18)',
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: 1.4,
                  color: 'var(--brand-coral)',
                  textTransform: 'uppercase',
                  marginBottom: 10,
                }}
              >
                目的 / END
              </div>
              <div
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 'clamp(20px, 2.4vw, 28px)',
                  fontWeight: 500,
                  color: 'var(--on-dark-1)',
                }}
              >
                業務を、変える
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--on-dark-2)',
                  marginTop: 10,
                }}
              >
                これがゴールです
              </div>
            </div>
          </div>
        </window.Reveal>

        <window.Reveal delay={0.26} y={28}>
          <div
            style={{
              background: 'var(--bg-ivory)',
              border: '1px solid var(--border-2)',
              borderLeft: '3px solid var(--brand)',
              borderRadius: 12,
              padding: 'clamp(28px, 4vw, 48px)',
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(17px, 1.8vw, 21px)',
              lineHeight: 1.95,
              color: 'var(--ink-1)',
              textWrap: 'pretty',
              wordBreak: 'auto-phrase',
              boxShadow: '0 12px 40px rgba(20,20,19,0.06)',
            }}
          >
            AI導入は、あくまで
            <span style={{ color: 'var(--brand)' }}>手段</span>
            であって、目的ではありません。
            <br />
            <br />
            業務改善を行い、業務を効率化することが目的であり、AIはそのための
            <span style={{ color: 'var(--brand)' }}>選択肢のひとつ</span>
            にすぎない。
            <br />
            <br />
            だから私たちは、AIを教える前に、いつも
            <span style={{ color: 'var(--brand)' }}>業務</span>
            から話を始めます。どの業務に時間がかかり、どこにムダがあるのか。その上で、AIで解ける部分と、AI以外の手段が適している部分を見極める。
            <br />
            <br />
            「AIを入れた」ではなく、
            <span style={{ color: 'var(--brand)' }}>「業務が変わった」</span>
            と言える状態を、一緒につくります。
          </div>
        </window.Reveal>

        <window.Reveal delay={0.36}>
          <p
            className="body"
            style={{
              textAlign: 'center',
              marginTop: 32,
              fontSize: 14,
              color: 'var(--ink-3)',
            }}
          >
            ── 株式会社It's Automatic 代表 / AI研修プログラム責任者
          </p>
        </window.Reveal>
      </div>

      {/* Editorial photo: hands at whiteboard */}
      <div
        className="container"
        style={{ marginTop: 'clamp(56px, 8vw, 96px)' }}
      >
        <window.Reveal y={32}>
          <figure
            className="empathy-photo"
            style={{
              position: 'relative',
              borderRadius: 'clamp(16px, 2vw, 24px)',
              overflow: 'hidden',
              boxShadow: '0 24px 60px rgba(20,20,19,0.16)',
              aspectRatio: '21 / 8',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1800&q=85&auto=format&fit=crop"
              alt="業務フローを書き出すワークショップ"
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'saturate(0.82) contrast(1.02)',
              }}
            />
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(90deg, rgba(20,20,19,0.85) 0%, rgba(20,20,19,0.50) 55%, rgba(20,20,19,0.15) 100%)',
                pointerEvents: 'none',
              }}
            />
            <figcaption
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: 'clamp(28px, 5vw, 64px)',
                color: '#ffffff',
                maxWidth: 560,
                textShadow: '0 2px 14px rgba(0,0,0,0.45)',
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: 1.4,
                  color: '#ffd2c0',
                  textTransform: 'uppercase',
                  marginBottom: 14,
                  fontWeight: 500,
                }}
              >
                Belief
              </div>
              <h3
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 'clamp(22px, 2.8vw, 34px)',
                  fontWeight: 500,
                  lineHeight: 1.45,
                  textWrap: 'balance',
                  wordBreak: 'auto-phrase',
                  color: '#ffffff',
                }}
              >
                AIを教える前に、
                <br />
                まず
                <span style={{ color: '#ffb59a' }}>業務</span>
                を、よく見る。
              </h3>
            </figcaption>
          </figure>
        </window.Reveal>
      </div>
    </section>
  );
}

/* ─── 04 SOLUTION ─── */
function Solution() {
  const pillars = [
    {
      num: '01',
      title: '業務棚卸しから、始める',
      desc: 'いきなりChatGPTを教えることはしません。まず貴社の業務を棚卸しし、どこに時間がかかり、どこにムダがあるのかを見える化します。',
      bullets: [
        '業種別ヒアリングシート',
        '業務工程マッピング',
        'ムダ・重複業務の可視化',
      ],
    },
    {
      num: '02',
      title: 'AIで解けること、解けないことを分ける',
      desc: '棚卸しした業務を、「AIで解ける」「ロボットや仕組み化が適している」「人がやるべき」に分類。AIは手段のひとつにすぎず、本当に効くところにだけ使います。',
      bullets: [
        '業務別 ROI 試算',
        'AI / 仕組み化 / 人の心得え表',
        'そもそも不要な業務の見直し',
      ],
      featured: true,
    },
    {
      num: '03',
      title: '「業務が変わった」まで、伴走する',
      desc: '研修後30日間、現場で使い続けられるまでSlack/メールで伴走。受講者アンケートではなく、「週あたりで何時間削減されたか」を業務KPIで追います。',
      bullets: [
        '業務削減時間を実測',
        '14日後・30日後チェックイン',
        '経営層提出用効果レポート',
      ],
    },
  ];
  return (
    <section
      id="solution"
      className="section"
      data-screen-label="04 Solution"
      style={{ background: 'var(--bg-ivory)' }}
    >
      <div className="container">
        <window.Reveal y={20}>
          <div
            style={{
              textAlign: 'center',
              maxWidth: 760,
              margin: '0 auto 48px',
            }}
          >
            <h2
              className="h-section"
              style={{
                marginBottom: 20,
                textWrap: 'balance',
                wordBreak: 'auto-phrase',
              }}
            >
              だから、研修を "AI講座" ではなく
              <br />
              <span className="accent-underline">"業務改革プロジェクト"</span>
              として設計します。
            </h2>
            <p
              className="lead"
              style={{
                margin: '0 auto',
                textWrap: 'pretty',
                wordBreak: 'auto-phrase',
              }}
            >
              業務棚卸し → ムダの見える化 → 手段の選定（AI / 仕組み化 / 人） →
              実装 →
              業務KPIで効果測定。この流れで進めるから、「AIを使える人」ではなく「業務を変えられる人」が生まれます。
            </p>
          </div>
        </window.Reveal>

        {/* Big editorial showcase — animated dashboard */}
        <window.Reveal delay={0.12} y={32}>
          <SolutionShowcase />
        </window.Reveal>

        <window.Stagger
          step={0.1}
          y={28}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
            marginTop: 48,
          }}
        >
          {pillars.map(({
            num, title, desc, bullets, featured,
          }) => (
            <div
              key={num}
              className="card"
              style={{
                background: featured ? 'var(--bg-dark)' : 'var(--bg-white)',
                color: featured ? 'var(--on-dark-1)' : 'var(--ink-1)',
                borderColor: featured ? 'var(--bg-dark)' : 'var(--border-1)',
                boxShadow: featured
                  ? '0 16px 40px rgba(0,0,0,0.16)'
                  : '0 1px 0 var(--border-1)',
                transform: featured ? 'translateY(-8px)' : 'translateY(0)',
                padding: '32px 28px',
              }}
            >
              <div
                className="num-badge"
                style={{ color: 'var(--brand-coral)', marginBottom: 18 }}
              >
                {num}
              </div>
              <h3
                className="h-card"
                style={{
                  whiteSpace: 'pre-line',
                  marginBottom: 14,
                  color: featured ? 'var(--on-dark-1)' : 'var(--ink-1)',
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.85,
                  color: featured ? 'var(--on-dark-2)' : 'var(--ink-2)',
                  marginBottom: 20,
                }}
              >
                {desc}
              </p>
              <div
                style={{
                  borderTop: `1px solid ${featured ? 'rgba(255,255,255,0.1)' : 'var(--border-1)'}`,
                  paddingTop: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                {bullets.map((b) => (
                  <div
                    key={b}
                    style={{
                      display: 'flex',
                      gap: 10,
                      alignItems: 'flex-start',
                      fontSize: 13.5,
                      color: featured ? 'var(--on-dark-2)' : 'var(--ink-2)',
                    }}
                  >
                    <span
                      style={{
                        color: 'var(--brand-coral)',
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      —
                    </span>
                    {b}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </window.Stagger>
      </div>
    </section>
  );
}

/* ─── Solution Showcase — large editorial dashboard mockup ─── */
function SolutionShowcase() {
  const {
    Reveal, Bar, Counter, useInView,
  } = window;
  const [ref, inView] = useInView({ threshold: 0.25 });
  return (
    <div
      ref={ref}
      className="solution-showcase"
      style={{
        background:
          'linear-gradient(180deg, var(--bg-parchment) 0%, var(--bg-sand) 100%)',
        border: '1px solid var(--border-2)',
        borderRadius: 24,
        overflow: 'hidden',
        padding: 'clamp(28px, 4vw, 56px)',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 0.85fr) minmax(0, 1.15fr)',
        gap: 'clamp(28px, 4vw, 56px)',
        alignItems: 'center',
      }}
    >
      <div>
        <div
          style={{
            fontSize: 11,
            color: 'var(--brand)',
            letterSpacing: 1.4,
            textTransform: 'uppercase',
            marginBottom: 14,
            fontWeight: 500,
          }}
        >
          業務改善レポート / SAMPLE
        </div>
        <h3
          className="h-section"
          style={{
            fontSize: 'clamp(22px, 2.6vw, 32px)',
            marginBottom: 18,
            color: 'var(--ink-1)',
            textWrap: 'balance',
            wordBreak: 'auto-phrase',
          }}
        >
          測るのは「AI使用率」ではなく、
          <br />
          <span style={{ color: 'var(--brand)' }}>
            業務がどれだけ変わったか。
          </span>
        </h3>
        <p
          className="body"
          style={{
            marginBottom: 24,
            textWrap: 'pretty',
            wordBreak: 'auto-phrase',
          }}
        >
          受講アンケートではなく、業務ごとの削減時間・コスト換算ROIを一枚に。「AIを入れた」ではなく「業務が変わった」と、経営層にファクトで語れる設計です。
        </p>
        <div
          className="report-metrics"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            paddingTop: 20,
            borderTop: '1px solid var(--border-2)',
          }}
        >
          {[
            ['週あたり業務削減', '受講者あたり +8.6h'],
            ['年間人件費換算', '推計 -¥940万 / 予算規模100名'],
            ['業務改善項目', '平均 12.4 件 / 部門'],
          ].map(([k, v]) => (
            <div
              className="report-metric-row"
              key={k}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                gap: 16,
              }}
            >
              <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>{k}</span>
              <span
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 15,
                  color: 'var(--ink-1)',
                  fontWeight: 500,
                  textAlign: 'right',
                }}
              >
                {v}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Dashboard mockup */}
      <div
        className="dashboard-mockup"
        style={{
          background: 'var(--bg-white)',
          border: '1px solid var(--border-2)',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow:
            '0 30px 80px rgba(20,20,19,0.12), 0 4px 16px rgba(20,20,19,0.04)',
          transform: inView
            ? 'translateY(0) scale(1)'
            : 'translateY(20px) scale(0.97)',
          opacity: inView ? 1 : 0,
          transition:
            'opacity 0.9s cubic-bezier(0.22,0.61,0.36,1) 0.1s, transform 1s cubic-bezier(0.22,0.61,0.36,1) 0.1s',
        }}
      >
        {/* Window chrome */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 14px',
            borderBottom: '1px solid var(--border-1)',
            background: 'var(--bg-ivory)',
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#e8c2b3',
            }}
          />
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#dcd9c9',
            }}
          />
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#dcd9c9',
            }}
          />
          <span
            style={{
              fontSize: 11,
              color: 'var(--ink-3)',
              marginLeft: 14,
              fontFamily: 'var(--serif)',
            }}
          >
            業務改善レポート — 2026 Q1
          </span>
        </div>

        <div style={{ padding: '24px' }}>
          {/* Big KPI */}
          <div
            className="dashboard-kpis"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 12,
              marginBottom: 24,
            }}
          >
            {[
              {
                v: 78,
                suffix: 'pt',
                label: '受講後スコア',
                sub: '+46pt',
              },
              {
                v: 8.6,
                suffix: 'h',
                label: '週あたり削減',
                sub: '/ 人',
                dec: 1,
              },
              {
                v: 92,
                suffix: '%',
                label: '30日後活用率',
                sub: '継続',
              },
            ].map((k, i) => (
              <div
                key={k.label}
                className="dashboard-kpi-card"
                style={{
                  background: 'var(--bg-parchment)',
                  border: '1px solid var(--border-1)',
                  borderRadius: 10,
                  padding: '14px 14px',
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: 'var(--ink-3)',
                    letterSpacing: 0.3,
                    marginBottom: 6,
                  }}
                >
                  {k.label}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--serif)',
                    fontSize: 22,
                    fontWeight: 500,
                    color: 'var(--ink-1)',
                    lineHeight: 1,
                  }}
                >
                  <Counter
                    to={k.v}
                    decimals={k.dec || 0}
                    duration={1500}
                    suffix={k.suffix}
                  />
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: 'var(--brand)',
                    marginTop: 6,
                    fontWeight: 500,
                  }}
                >
                  {k.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Bar chart: weekly time savings by team */}
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                marginBottom: 14,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: 'var(--ink-2)',
                  fontWeight: 500,
                  letterSpacing: 0.3,
                }}
              >
                部門別 業務削減時間 (h / 週)
              </span>
              <span style={{ fontSize: 10, color: 'var(--ink-3)' }}>
                受講者平均
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Bar
                label="営業部"
                value={9.4}
                max={12}
                suffix="h"
                color="var(--brand)"
                duration={1200}
                delay={200}
              />
              <Bar
                label="人事部"
                value={7.2}
                max={12}
                suffix="h"
                color="var(--brand)"
                duration={1200}
                delay={350}
              />
              <Bar
                label="総務部"
                value={6.8}
                max={12}
                suffix="h"
                color="var(--brand-coral)"
                duration={1200}
                delay={500}
              />
              <Bar
                label="開発部"
                value={10.6}
                max={12}
                suffix="h"
                color="var(--brand)"
                duration={1200}
                delay={650}
              />
            </div>
          </div>

          {/* Score progression */}
          <div
            style={{
              padding: '14px 0',
              borderTop: '1px dashed var(--border-2)',
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: 'var(--ink-2)',
                fontWeight: 500,
                marginBottom: 10,
              }}
            >
              スキル診断スコア推移
            </div>
            <ScoreLine inView={inView} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreLine({ inView }) {
  // Sample data points for the line chart
  const points = [
    { x: 0, y: 70 }, // Before
    { x: 50, y: 38 }, // During DAY1
    { x: 100, y: 28 }, // DAY2
    { x: 160, y: 20 }, // 14日後
    { x: 220, y: 14 }, // 30日後
  ];
  const labels = ['受講前', 'DAY1', 'DAY2', '14日後', '30日後'];
  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');
  const ref = React.useRef(null);
  const [len, setLen] = React.useState(0);
  React.useEffect(() => {
    if (ref.current) setLen(ref.current.getTotalLength());
  }, []);

  return (
    <div style={{ position: 'relative', height: 90 }}>
      <svg
        viewBox="0 0 220 90"
        preserveAspectRatio="none"
        width="100%"
        height="90"
      >
        {/* gridlines */}
        {[20, 40, 60, 80].map((y) => (
          <line
            key={y}
            x1="0"
            x2="220"
            y1={y}
            y2={y}
            stroke="var(--border-1)"
            strokeWidth="0.5"
          />
        ))}
        {/* area */}
        <path
          d={`${pathD} L 220 90 L 0 90 Z`}
          fill="var(--brand-soft)"
          opacity={inView ? 0.5 : 0}
          style={{ transition: 'opacity 1.2s ease 0.8s' }}
        />
        {/* line */}
        <path
          ref={ref}
          d={pathD}
          fill="none"
          stroke="var(--brand)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray={len || 1}
          strokeDashoffset={inView ? 0 : len || 1}
          style={{
            transition:
              'stroke-dashoffset 1.6s cubic-bezier(0.22,0.61,0.36,1) 0.3s',
          }}
        />
        {/* dots */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="3"
            fill="var(--brand)"
            stroke="#fff"
            strokeWidth="1.5"
            opacity={inView ? 1 : 0}
            style={{ transition: `opacity 0.3s ease ${0.4 + i * 0.18}s` }}
          />
        ))}
      </svg>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 4,
          fontSize: 9,
          color: 'var(--ink-3)',
        }}
      >
        {labels.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, {
  Nav,
  Hero,
  Problem,
  Empathy,
  Solution,
});

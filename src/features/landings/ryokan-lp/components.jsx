/* Components for the 鹿乃宿 LP — blocks 1–9 */

const { React } = window;
const { useEffect, useRef, useState } = React;

/* ---------- Shared helpers ---------- */

function Placeholder({
  label, tone = 'light', style = {}, className = '',
}) {
  return (
    <div
      className={`ph ${tone === 'dark' ? 'ph--dark' : ''} ${className}`}
      style={style}
      role="img"
      aria-label={label}
    >
      <div className="ph__tag">{label}</div>
    </div>
  );
}

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    ref.current.querySelectorAll('.fade').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return ref;
}

/* ---------- Top nav ---------- */

function TopNav({ onReserve }) {
  return (
    <nav className="nav">
      <div className="nav__brand">
        <span className="crest" aria-hidden="true">
          鹿
        </span>
        <span>鹿乃宿</span>
      </div>
      <div className="nav__links">
        <a href="#about">宿について</a>
        <a href="#rooms">客室</a>
        <a href="#cuisine">料理</a>
        <a href="#voice">お客様の声</a>
        <a href="#faq">よくある質問</a>
        <a href="#access">アクセス</a>
      </div>
      <button type="button" className="nav__cta" onClick={onReserve}>
        ご予約
      </button>
    </nav>
  );
}

/* ============================================================
   01  FIRST VIEW
   ============================================================ */

function HeroFacts({ className = '' }) {
  return (
    <div
      className={`hero-facts ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 24,
        borderTop: '1px solid rgba(244,239,230,.18)',
        paddingTop: 24,
        fontFamily: 'var(--mono)',
        fontSize: 11,
        letterSpacing: '.18em',
        color: 'rgba(244,239,230,.7)',
      }}
    >
      <div>
        <div style={{ color: 'var(--kincha)', marginBottom: 6 }}>
          01 / LOCATION
        </div>
        <div>奈良公園 徒歩3分</div>
      </div>
      <div>
        <div style={{ color: 'var(--kincha)', marginBottom: 6 }}>
          02 / SINCE
        </div>
        <div>明治二十五年創業</div>
      </div>
      <div>
        <div style={{ color: 'var(--kincha)', marginBottom: 6 }}>
          03 / ROOMS
        </div>
        <div>全12室・離れあり</div>
      </div>
      <div>
        <div style={{ color: 'var(--kincha)', marginBottom: 6 }}>
          04 / RATING
        </div>
        <div>★ 4.86 / 1,240件</div>
      </div>
    </div>
  );
}

function Hero({ onReserve }) {
  const videoRef = useRef(null);
  const [heroVideoEnded, setHeroVideoEnded] = useState(false);

  const handleHeroVideoEnded = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
    setHeroVideoEnded(true);
  };

  const replayHeroVideo = () => {
    if (!videoRef.current) return;
    setHeroVideoEnded(false);
    videoRef.current.currentTime = 0;
    videoRef.current.play();
  };

  return (
    <>
      <header
        style={{
          position: 'relative',
          minHeight: '100vh',
          paddingTop: 72,
          background: 'var(--sumi)',
          color: 'var(--kinari)',
          overflow: 'hidden',
        }}
      >
        {/* full bleed hero video */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <video
            ref={videoRef}
            src="assets/movie/ryokan-lp-hero.mp4"
            autoPlay
            muted
            playsInline
            onEnded={handleHeroVideoEnded}
            aria-label="奈良公園の朝霧と鹿の群れ、若草山を望む動画"
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(26,24,22,.35) 0%, rgba(26,24,22,.55) 60%, rgba(26,24,22,.85) 100%)',
            }}
          />
          {heroVideoEnded && (
            <button
              type="button"
              onClick={replayHeroVideo}
              aria-label="ヒーロー動画を再生"
              style={{
                position: 'absolute',
                right: 36,
                bottom: 36,
                zIndex: 4,
                width: 'clamp(48px, 8vw, 64px)',
                height: 'clamp(48px, 8vw, 64px)',
                borderRadius: '50%',
                border: '1px solid rgba(244,239,230,.58)',
                background: 'rgba(26,24,22,.45)',
                color: 'var(--kinari)',
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 0,
                  height: 0,
                  borderTop: 'clamp(8px, 1.4vw, 11px) solid transparent',
                  borderBottom: 'clamp(8px, 1.4vw, 11px) solid transparent',
                  borderLeft: 'clamp(13px, 2vw, 17px) solid currentColor',
                  marginLeft: 5,
                }}
              />
            </button>
          )}
        </div>

        {/* vertical kanji */}
        <div
          className="vtext"
          style={{
            position: 'absolute',
            top: 120,
            right: 36,
            fontSize: 26,
            letterSpacing: '.5em',
            color: 'rgba(244,239,230,.6)',
          }}
        >
          — 千三百年、奈良の朝に
        </div>

        {/* content */}
        <div
          className="wrap"
          style={{
            position: 'relative',
            zIndex: 2,
            minHeight: 'calc(100vh - 72px)',
            display: 'grid',
            gridTemplateRows: '1fr auto',
            paddingTop: 80,
            paddingBottom: 56,
          }}
        >
          <div style={{ alignSelf: 'center', maxWidth: 820 }}>
            <h1
              className="h-display"
              style={{
                fontSize: 'clamp(38px, 6vw, 78px)',
                fontWeight: 500,
                lineHeight: 1.25,
                letterSpacing: '.06em',
                marginBottom: 28,
                color: 'var(--kinari)',
              }}
            >
              <span
                className="phrase"
                style={{
                  display: 'block',
                  color: 'var(--kincha)',
                  fontSize: '.6em',
                  letterSpacing: '.4em',
                  marginBottom: 18,
                }}
              >
                し か の や ど
              </span>
              <span className="phrase">門を出れば、鹿。</span>
              <br />
              <span className="phrase">朝の散歩から、</span>
              <br className="mobile-only-break" />
              <span className="phrase">旅が始まる。</span>
            </h1>

            <p
              className="body-lg"
              style={{
                color: 'rgba(244,239,230,.85)',
                fontSize: 17,
                maxWidth: 620,
                marginBottom: 44,
              }}
            >
              奈良公園まで徒歩三分。創業百三十余年、木造数寄屋造りの宿で、
              朝靄に佇む鹿と、千年の都の静けさをお過ごしください。
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <button type="button" className="btn btn--aka" onClick={onReserve}>
                ご宿泊のご予約
                <span className="btn__arrow">→</span>
              </button>
              <a
                className="btn btn--ghost"
                href="#about"
                style={{
                  color: 'var(--kinari)',
                  borderColor: 'rgba(244,239,230,.45)',
                }}
              >
                宿について
                <span className="btn__arrow">↓</span>
              </a>
            </div>
          </div>

          {/* hero footer strip */}
          <HeroFacts className="hero-facts--in-hero" />
        </div>
      </header>
      <div className="hero-facts-mobile-band" aria-label="鹿乃宿の特徴">
        <div className="wrap">
          <HeroFacts className="hero-facts--after-hero" />
        </div>
      </div>
    </>
  );
}

/* ============================================================
   02  PROBLEM
   ============================================================ */

function Problem() {
  const ref = useReveal();
  const items = [
    {
      n: '01',
      q: '観光地のホテルは似たり寄ったり',
      a: '全国チェーンの無機質なロビーで、せっかくの旅情が薄れてしまう。',
    },
    {
      n: '02',
      q: '朝起きたら、もう行列',
      a: '東大寺も春日大社も人だらけ。静かに古都を歩く時間が、もう持てない。',
    },
    {
      n: '03',
      q: '"奈良らしさ"が見つからない',
      a: '京都とは違う、奈良ならではの体験を、宿でも味わいたい。',
    },
  ];
  return (
    <section ref={ref} id="problem" style={{ background: 'var(--kinari)' }}>
      <div className="wrap">
        <div className="section-head fade">
          <div className="section-head__meta">
            <span
              className="vtext"
              style={{ fontSize: 16, opacity: 0.5, color: 'var(--sumi-2)' }}
            >
              旅の悩み
            </span>
          </div>
          <div className="section-head__title">
            <h2 className="h-section">
              <span className="phrase">せっかくの奈良旅。</span>
              <br />
              <span className="phrase pc-only">
                「思っていたのと、違った」と
              </span>
              <span className="phrase sp-only">「思っていたのと違う」と</span>
              <span className="phrase">感じたことはありませんか。</span>
            </h2>
          </div>
        </div>

        <div
          className="fade problem-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 0,
            borderTop: '1px solid var(--line)',
            borderBottom: '1px solid var(--line)',
          }}
        >
          {items.map((it, i) => (
            <div
              className="problem-card"
              key={it.n}
              style={{
                padding: '44px 32px',
                borderRight:
                  i < items.length - 1 ? '1px solid var(--line)' : 'none',
              }}
            >
              <div className="num" style={{ marginBottom: 22 }}>
                {it.n}
              </div>
              <h3
                style={{
                  fontFamily: 'var(--serif)',
                  fontWeight: 600,
                  fontSize: 20,
                  letterSpacing: '.04em',
                  margin: '0 0 16px',
                  lineHeight: 1.6,
                }}
              >
                「
                {it.q}
                」
              </h3>
              <p className="body-sm" style={{ margin: 0 }}>
                {it.a}
              </p>
            </div>
          ))}
        </div>

        <style>
          {`
          @media (max-width: 760px){
            #problem .fade > div[style*="grid-template-columns"]{ grid-template-columns: 1fr !important; }
            #problem .fade > div > div{ border-right: none !important; }
            #problem .fade > div > div:last-child{ border-bottom: none; }
          }
        `}
        </style>
      </div>
    </section>
  );
}

/* ============================================================
   03  EMPATHY
   ============================================================ */

function Empathy() {
  const ref = useReveal();
  return (
    <section ref={ref} className="dark" id="empathy">
      <div
        className="wrap empathy-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1.05fr 1fr',
          gap: 80,
          alignItems: 'center',
        }}
      >
        <div className="fade">
          <h2
            className="h-section"
            style={{ color: 'var(--kinari)', marginBottom: 28 }}
          >
            <span className="phrase">分かります。</span>
            <br />
            <span className="phrase">私たちも、</span>
            <span className="phrase">同じ景色を見てきました。</span>
          </h2>
          <p
            className="body-lg"
            style={{ color: 'rgba(244,239,230,.82)', marginBottom: 22 }}
          >
            この宿で五代続く女将もまた、年に何度も観光地の喧騒を目にしてきました。
            けれど、奈良の本当の魅力は、観光客が動き出す前の朝六時にあります。
          </p>
          <p
            className="body-lg"
            style={{ color: 'rgba(244,239,230,.82)', margin: 0 }}
          >
            霧の中をゆっくり歩く鹿、苔むした石灯籠、まだ閉ざされた朱色の門。
            ——その「ひととき」だけは、近くに泊まった人にしか、味わえません。
          </p>

          <div
            className="okami-profile"
            style={{
              display: 'flex',
              gap: 28,
              marginTop: 40,
              paddingTop: 28,
              borderTop: '1px solid rgba(244,239,230,.18)',
            }}
          >
            <img
              src="assets/images/okami-portrait.png"
              alt="五代目女将 南都美和"
              style={{
                width: 60,
                height: 80,
                flex: '0 0 auto',
                objectFit: 'cover',
              }}
            />
            <div>
              <div
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 16,
                  letterSpacing: '.1em',
                  marginBottom: 4,
                  color: 'var(--kinari)',
                }}
              >
                五代目 女将　南都 美和
              </div>
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 11,
                  letterSpacing: '.18em',
                  color: 'var(--kincha)',
                }}
              >
                MIWA NANTO — OKAMI, 5TH GEN.
              </div>
            </div>
          </div>
        </div>

        <div className="fade" style={{ position: 'relative' }}>
          <img
            src="assets/images/nara-park-dawn-deer-lantern.png"
            alt="夜明けの奈良公園、鹿と石灯籠"
            style={{
              display: 'block',
              width: '100%',
              aspectRatio: '4/5',
              objectFit: 'cover',
            }}
          />
          <div
            className="empathy-photo-badge"
            style={{
              position: 'absolute',
              bottom: -32,
              left: -32,
              width: 220,
              aspectRatio: '1/1',
              border: '1px solid var(--kincha)',
              background: 'var(--sumi)',
              display: 'grid',
              placeItems: 'center',
              padding: 24,
              textAlign: 'center',
            }}
          >
            <div>
              <div
                className="vtext"
                style={{
                  fontSize: 16,
                  color: 'var(--kincha)',
                  letterSpacing: '.5em',
                }}
              >
                朝六時の奈良
              </div>
            </div>
          </div>
        </div>

        <style>
          {`
          @media (max-width: 860px){
            #empathy .wrap{ grid-template-columns: 1fr !important; gap: 48px !important; }
          }
        `}
        </style>
      </div>
    </section>
  );
}

/* ============================================================
   04  SOLUTION
   ============================================================ */

function Solution() {
  const ref = useReveal();
  const pillars = [
    {
      label: '立地',
      en: 'LOCATION',
      title: '公園まで徒歩三分。',
      body: '門を一歩出れば、もう鹿のいる風景。朝の散策に出ても、戻って朝食に十分間に合います。',
    },
    {
      label: '建築',
      en: 'ARCHITECTURE',
      title: '明治の木造、登録有形文化財。',
      body: '百三十余年の梁と、奈良の職人による格子。建物そのものが、奈良の歴史の一部です。',
    },
    {
      label: '料理',
      en: 'CUISINE',
      title: '大和野菜と、月替わりの会席。',
      body: '奈良の畑から届く朝採れ野菜と、地酒。料理長が季節ごとに献立を組み直します。',
    },
  ];
  return (
    <section ref={ref} id="about" style={{ background: 'var(--kinari)' }}>
      <div className="wrap">
        <div className="section-head fade">
          <div className="section-head__meta">
            <span
              className="vtext"
              style={{ fontSize: 16, opacity: 0.5, color: 'var(--sumi-2)' }}
            >
              鹿乃宿のお約束
            </span>
          </div>
          <div className="section-head__title">
            <h2 className="h-section">
              <span className="phrase">鹿乃宿は、</span>
              <span className="phrase">「奈良で一番、</span>
              <span className="phrase">朝が早く始まる宿」です。</span>
            </h2>
            <p className="body-lg" style={{ marginTop: 22 }}>
              他のどこにも代えがたい場所と時間。三つの軸でご用意しています。
            </p>
          </div>
        </div>

        <div
          className="fade solution-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 32,
          }}
        >
          {pillars.map((p) => (
            <div
              key={p.en}
              style={{ borderTop: '1px solid var(--sumi)', paddingTop: 24 }}
            >
              {p.en === 'LOCATION' ? (
                <img
                  src="assets/images/location-ryokan-entrance.png"
                  alt="奈良公園に近い鹿乃宿の門前"
                  style={{
                    display: 'block',
                    width: '100%',
                    aspectRatio: '4/3',
                    objectFit: 'cover',
                    marginBottom: 24,
                  }}
                />
              ) : p.en === 'ARCHITECTURE' ? (
                <img
                  src="assets/images/architecture-wooden-ryokan.png"
                  alt="木造数寄屋造りの鹿乃宿"
                  style={{
                    display: 'block',
                    width: '100%',
                    aspectRatio: '4/3',
                    objectFit: 'cover',
                    marginBottom: 24,
                  }}
                />
              ) : p.en === 'CUISINE' ? (
                <img
                  src="assets/images/cuisine-kaiseki-table.png"
                  alt="大和野菜と季節の会席料理"
                  style={{
                    display: 'block',
                    width: '100%',
                    aspectRatio: '4/3',
                    objectFit: 'cover',
                    marginBottom: 24,
                  }}
                />
              ) : (
                <Placeholder
                  label={`PHOTO  /  ${p.en}`}
                  style={{
                    width: '100%',
                    aspectRatio: '4/3',
                    marginBottom: 24,
                  }}
                />
              )}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--serif)',
                    fontSize: 22,
                    fontWeight: 600,
                    color: 'var(--aka)',
                  }}
                >
                  {p.label}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 10,
                    letterSpacing: '.22em',
                    color: 'var(--sumi-2)',
                    opacity: 0.6,
                  }}
                >
                  /
                  {' '}
                  {p.en}
                </span>
              </div>
              <h3
                style={{
                  fontFamily: 'var(--serif)',
                  fontWeight: 600,
                  fontSize: 22,
                  lineHeight: 1.6,
                  margin: '0 0 12px',
                }}
              >
                {p.title}
              </h3>
              <p className="body-sm" style={{ margin: 0 }}>
                {p.body}
              </p>
            </div>
          ))}
        </div>

        <style>
          {`
          @media (max-width: 860px){
            #about .fade[style*="grid-template-columns"]{ grid-template-columns: 1fr !important; }
          }
        `}
        </style>
      </div>
    </section>
  );
}

/* ============================================================
   05  SERVICE — Rooms, Cuisine, Onsen
   ============================================================ */

function Service() {
  const ref = useReveal();
  return (
    <section ref={ref} id="rooms" style={{ background: 'var(--washi)' }}>
      <div className="wrap">
        <div className="section-head fade">
          <div className="section-head__meta">
            <span
              className="vtext"
              style={{ fontSize: 16, opacity: 0.5, color: 'var(--sumi-2)' }}
            >
              客室と過ごし方
            </span>
          </div>
          <div className="section-head__title">
            <h2 className="h-section">
              <span className="phrase">全十二室、</span>
              <span className="phrase">すべての部屋から、</span>
              <span className="phrase">奈良の景色を。</span>
            </h2>
            <p className="body-lg" style={{ marginTop: 22 }}>
              本館・離れ・特別室。それぞれに、ふさわしい朝があります。
            </p>
          </div>
        </div>

        {/* Big room hero */}
        <div
          className="fade room-feature"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr',
            gap: 32,
            marginBottom: 80,
          }}
        >
          <img
            src="assets/images/room-rokuen-wakakusa-view.png"
            alt="離れ鹿苑の十畳和室と若草山ビュー"
            style={{
              display: 'block',
              width: '100%',
              aspectRatio: '16/10',
              objectFit: 'cover',
            }}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '12px 0',
            }}
          >
            <div>
              <div className="num" style={{ marginBottom: 14 }}>
                SUITE / 鹿苑 ROKUEN
              </div>
              <h3
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 30,
                  fontWeight: 600,
                  margin: '0 0 18px',
                  letterSpacing: '.06em',
                }}
              >
                離れ「鹿苑」
              </h3>
              <p className="body" style={{ margin: 0 }}>
                母屋から渡り廊下で繋がる、独立した離れ。
                十畳の和室と広縁、檜の半露天風呂を備え、若草山と春日山原始林を一望できます。
                朝、障子を開ければ——鹿が庭を歩いていることも。
              </p>
            </div>
            <div
              className="room-specs"
              style={{
                marginTop: 28,
                borderTop: '1px solid var(--line)',
                paddingTop: 20,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 16,
                fontFamily: 'var(--mono)',
                fontSize: 11,
                letterSpacing: '.14em',
              }}
            >
              <div>
                <span style={{ color: 'var(--aka)' }}>定員</span>
                　最大4名
              </div>
              <div>
                <span style={{ color: 'var(--aka)' }}>広さ</span>
                　64㎡ + 露天
              </div>
              <div>
                <span style={{ color: 'var(--aka)' }}>食事</span>
                　部屋食
              </div>
              <div>
                <span style={{ color: 'var(--aka)' }}>料金</span>
                　¥58,000〜 / 人
              </div>
            </div>
          </div>
        </div>

        {/* 3 smaller rooms */}
        <div
          className="fade room-card-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
            marginBottom: 96,
          }}
        >
          {[
            {
              jp: '本館・松',
              en: 'MATSU',
              desc: '十畳の標準和室、檜の内風呂。',
              price: '¥28,000〜',
            },
            {
              jp: '本館・竹',
              en: 'TAKE',
              desc: '十二畳＋次の間、二名様に最適。',
              price: '¥34,000〜',
            },
            {
              jp: '特別室・梅',
              en: 'UME',
              desc: '二間続き、専用の坪庭付き。',
              price: '¥46,000〜',
            },
          ].map((r) => (
            <div key={r.en}>
              {r.en === 'MATSU' ? (
                <img
                  src="assets/images/room-matsu-tatami-garden.png"
                  alt="本館松の十畳和室と庭の眺め"
                  style={{
                    display: 'block',
                    width: '100%',
                    aspectRatio: '5/4',
                    objectFit: 'cover',
                    marginBottom: 18,
                  }}
                />
              ) : r.en === 'TAKE' ? (
                <img
                  src="assets/images/room-take-tatami-sitting.png"
                  alt="本館竹の十二畳和室と次の間"
                  style={{
                    display: 'block',
                    width: '100%',
                    aspectRatio: '5/4',
                    objectFit: 'cover',
                    marginBottom: 18,
                  }}
                />
              ) : r.en === 'UME' ? (
                <img
                  src="assets/images/room-ume-night-garden.png"
                  alt="特別室梅の二間続き和室と専用坪庭"
                  style={{
                    display: 'block',
                    width: '100%',
                    aspectRatio: '5/4',
                    objectFit: 'cover',
                    marginBottom: 18,
                  }}
                />
              ) : (
                <Placeholder
                  label={`PHOTO  /  客室 ${r.en}`}
                  style={{
                    width: '100%',
                    aspectRatio: '5/4',
                    marginBottom: 18,
                  }}
                />
              )}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: 8,
                }}
              >
                <h4
                  style={{
                    fontFamily: 'var(--serif)',
                    fontSize: 20,
                    fontWeight: 600,
                    margin: 0,
                    letterSpacing: '.06em',
                  }}
                >
                  {r.jp}
                </h4>
                <span
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 11,
                    letterSpacing: '.18em',
                    color: 'var(--aka)',
                  }}
                >
                  {r.price}
                </span>
              </div>
              <p className="body-sm" style={{ margin: 0 }}>
                {r.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Cuisine */}
        <div
          id="cuisine"
          className="fade cuisine-block"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.3fr',
            gap: 56,
            alignItems: 'center',
            marginBottom: 96,
          }}
        >
          <div>
            <span
              className="num"
              style={{ display: 'block', marginBottom: 18 }}
            >
              — CUISINE / 御料理
            </span>
            <h3
              style={{
                fontFamily: 'var(--serif)',
                fontSize: 30,
                fontWeight: 600,
                margin: '0 0 22px',
                letterSpacing: '.06em',
                lineHeight: 1.4,
              }}
            >
              <span className="phrase">月替わりの会席、</span>
              <br />
              <span className="phrase">大和の旬を、</span>
              <span className="phrase">ひと皿ずつ。</span>
            </h3>
            <p className="body" style={{ marginBottom: 18 }}>
              先付から水菓子まで全九品。料理長は宇陀の畑と毎朝相談し、その日に届いた大和野菜を主役に組み立てます。
              冬は「大和肉鶏のはりはり鍋」、夏は「鮎の塩焼きと冷やし茶碗蒸し」——奈良でしか味わえない献立です。
            </p>
            <div
              style={{
                display: 'flex',
                gap: 28,
                flexWrap: 'wrap',
                paddingTop: 18,
                borderTop: '1px solid var(--line)',
              }}
            >
              {[
                '大和肉鶏',
                '宇陀の朝採れ野菜',
                '三輪素麺',
                '奈良漬',
                '地酒6種',
              ].map((t) => (
                <span
                  key={t}
                  style={{
                    fontFamily: 'var(--serif)',
                    fontSize: 14,
                    letterSpacing: '.1em',
                  }}
                >
                  —
                  {' '}
                  {t}
                </span>
              ))}
            </div>
          </div>
          <img
            src="assets/images/cuisine-kaiseki-course.png"
            alt="会席料理の先付、八寸、椀物"
            style={{
              display: 'block',
              width: '100%',
              aspectRatio: '16/10',
              objectFit: 'cover',
            }}
          />
        </div>

        {/* Onsen */}
        <div
          className="fade onsen-block"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.3fr 1fr',
            gap: 56,
            alignItems: 'center',
          }}
        >
          <img
            src="assets/images/onsen-hinoki-night.png"
            alt="檜の大浴場と夜の湯気と灯り"
            style={{
              display: 'block',
              width: '100%',
              aspectRatio: '16/10',
              objectFit: 'cover',
            }}
          />
          <div>
            <span
              className="num"
              style={{ display: 'block', marginBottom: 18 }}
            >
              — ONSEN / 大浴場
            </span>
            <h3
              style={{
                fontFamily: 'var(--serif)',
                fontSize: 30,
                fontWeight: 600,
                margin: '0 0 22px',
                letterSpacing: '.06em',
                lineHeight: 1.4,
              }}
            >
              <span className="phrase">檜の大浴場と、</span>
              <span className="phrase">星を見る露天風呂。</span>
            </h3>
            <p className="body" style={{ margin: 0 }}>
              地下から汲み上げた弱アルカリ性の温泉を、樹齢二百年の檜風呂で。
              露天からは若草山の稜線が望め、夜は灯りを落として、星空をご覧いただけます。
              夜通しご入浴いただけます（清掃時間 3:00–5:00 を除く）。
            </p>
          </div>
        </div>

        <style>
          {`
          @media (max-width: 860px){
            #rooms .fade[style*="1.4fr 1fr"],
            #rooms .fade[style*="1fr 1.3fr"],
            #rooms .fade[style*="1.3fr 1fr"]{ grid-template-columns: 1fr !important; gap: 32px !important; }
            #rooms .fade[style*="repeat(3, 1fr)"]{ grid-template-columns: 1fr !important; }
          }
        `}
        </style>
      </div>
    </section>
  );
}

/* ============================================================
   06  STRENGTHS
   ============================================================ */

function Strengths() {
  const ref = useReveal();
  const items = [
    {
      n: '01',
      jp: '奈良公園まで徒歩三分',
      en: '3-min walk to Nara Park',
      body: '朝の散歩で東大寺南大門まで、戻って朝食に間に合う立地。荷物は到着前から預かれます。',
    },
    {
      n: '02',
      jp: '明治創業、五代続く木造建築',
      en: 'Founded 1892, 5th-gen',
      body: '登録有形文化財。建物そのものが歴史。修繕は奈良の宮大工と共に、百年先を見据えて。',
    },
    {
      n: '03',
      jp: '夕朝食付き／部屋食 or 個室',
      en: 'Kaiseki, in-room option',
      body: 'ご家族・記念日のお食事は、お部屋または完全個室で。気兼ねなく、ゆっくりと。',
    },
    {
      n: '04',
      jp: '源泉の檜風呂、24時間入浴可',
      en: '24h cypress onsen',
      body: '弱アルカリ性のお湯で肌当たりやわらか。深夜の入浴も、貸切感覚で。',
    },
    {
      n: '05',
      jp: '鹿せんべい・朝の散歩マップ',
      en: 'Morning walk, complimentary',
      body: '宿オリジナルの早朝散歩マップと、鹿せんべいをお部屋に。鹿との作法も女将がご案内。',
    },
    {
      n: '06',
      jp: 'JR奈良駅から無料送迎',
      en: 'Free pickup',
      body: 'ご到着時刻をお知らせいただければ、JR奈良駅・近鉄奈良駅まで送迎いたします。',
    },
  ];
  return (
    <section ref={ref} className="dark" id="strengths">
      <div className="wrap">
        <div className="section-head fade">
          <div className="section-head__meta">
            <span
              className="vtext"
              style={{ fontSize: 16, color: 'rgba(244,239,230,.45)' }}
            >
              鹿乃宿の六つの強み
            </span>
          </div>
          <div className="section-head__title">
            <h2 className="h-section" style={{ color: 'var(--kinari)' }}>
              <span className="phrase">「奈良に泊まる」</span>
              <span className="phrase">ということを、</span>
              <br />
              <span className="phrase">ここまで考え抜きました。</span>
            </h2>
          </div>
        </div>

        <div
          className="fade strengths-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 0,
            borderTop: '1px solid rgba(244,239,230,.16)',
            borderLeft: '1px solid rgba(244,239,230,.16)',
          }}
        >
          {items.map((it) => (
            <div
              key={it.n}
              style={{
                padding: '36px 28px',
                borderRight: '1px solid rgba(244,239,230,.16)',
                borderBottom: '1px solid rgba(244,239,230,.16)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 12,
                  marginBottom: 18,
                }}
              >
                <span className="num" style={{ color: 'var(--kincha)' }}>
                  {it.n}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 10,
                    letterSpacing: '.22em',
                    color: 'rgba(244,239,230,.5)',
                  }}
                >
                  {it.en}
                </span>
              </div>
              <h3
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 19,
                  fontWeight: 600,
                  margin: '0 0 14px',
                  color: 'var(--kinari)',
                  lineHeight: 1.55,
                  letterSpacing: '.04em',
                }}
              >
                {it.jp}
              </h3>
              <p
                className="body-sm"
                style={{ margin: 0, color: 'rgba(244,239,230,.7)' }}
              >
                {it.body}
              </p>
            </div>
          ))}
        </div>

        <style>
          {`
          @media (max-width: 860px){
            #strengths .fade[style*="repeat(3, 1fr)"]{ grid-template-columns: 1fr !important; }
          }
        `}
        </style>
      </div>
    </section>
  );
}

/* ============================================================
   07  VOICE / RESULTS
   ============================================================ */

function Voice() {
  const ref = useReveal();
  const stats = [
    { n: '134', u: '年', l: '創業からの年月' },
    { n: '4.86', u: '/ 5.0', l: '宿泊者評価平均' },
    { n: '78%', u: '', l: 'リピーター比率' },
    { n: '12', u: '室', l: 'ご用意できる客室' },
  ];
  const reviews = [
    {
      stars: 5,
      title: '本当に「門を出たら鹿」でした。',
      body: '六時に散歩に出たら、霧の中の春日大社まで誰もおらず。鹿だけがゆっくり歩いていて、忘れられない朝になりました。お料理も大和野菜が主役で、奈良に来たという実感がありました。',
      who: '田中様 ご夫妻 / 50代 / 東京',
      stay: '離れ・鹿苑 にご宿泊',
    },
    {
      stars: 5,
      title: '祖母の喜寿祝いに選びました。',
      body: '段差や階段を事前に相談したら、すべて配慮した動線でご案内いただけました。お部屋食、座椅子のご用意、車椅子の貸出まで——気配りが本当にありがたかったです。',
      who: '佐藤様 ご家族4名 / 40代 / 神奈川',
      stay: '本館・竹 にご宿泊',
    },
    {
      stars: 5,
      title: '建物そのものが宝物のような宿。',
      body: '明治の梁、職人の格子、磨き込まれた廊下。建築が好きで泊まりに来ました。女将さんが宿の歴史を丁寧に話してくださって、ただの宿泊以上の体験でした。',
      who: '鈴木様 / 30代 / 大阪',
      stay: '特別室・梅 にご宿泊',
    },
  ];
  return (
    <section ref={ref} id="voice" style={{ background: 'var(--kinari)' }}>
      <div className="wrap">
        <div className="section-head fade">
          <div className="section-head__meta">
            <span
              className="vtext"
              style={{ fontSize: 16, opacity: 0.5, color: 'var(--sumi-2)' }}
            >
              実績とお客様の声
            </span>
          </div>
          <div className="section-head__title">
            <h2 className="h-section">
              <span className="phrase">百三十余年、</span>
              <span className="phrase">選ばれ続けてきました。</span>
            </h2>
          </div>
        </div>

        {/* stats */}
        <div
          className="fade voice-stats"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 0,
            borderTop: '1px solid var(--sumi)',
            borderBottom: '1px solid var(--line)',
            marginBottom: 72,
          }}
        >
          {stats.map((s, i) => (
            <div
              key={s.l}
              style={{
                padding: '32px 24px',
                borderRight: i < 3 ? '1px solid var(--line)' : 'none',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--serif)',
                  fontWeight: 500,
                  fontSize: 52,
                  letterSpacing: '.02em',
                  lineHeight: 1,
                  color: 'var(--aka)',
                }}
              >
                {s.n}
                <span
                  style={{
                    fontSize: 18,
                    marginLeft: 4,
                    color: 'var(--sumi-2)',
                    fontWeight: 400,
                  }}
                >
                  {s.u}
                </span>
              </div>
              <div className="body-sm" style={{ marginTop: 12 }}>
                {s.l}
              </div>
            </div>
          ))}
        </div>

        {/* reviews */}
        <div
          className="fade voice-reviews"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 28,
          }}
        >
          {reviews.map((r, i) => (
            <article
              key={i}
              style={{
                background: '#fbf8f1',
                border: '1px solid var(--line)',
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <div
                style={{
                  letterSpacing: '.25em',
                  color: 'var(--aka)',
                  fontSize: 14,
                }}
              >
                ★★★★★
              </div>
              <h4
                style={{
                  fontFamily: 'var(--serif)',
                  fontWeight: 600,
                  fontSize: 18,
                  margin: 0,
                  lineHeight: 1.55,
                }}
              >
                「
                {r.title}
                」
              </h4>
              <p className="body-sm" style={{ margin: 0, flex: 1 }}>
                {r.body}
              </p>
              <div
                style={{
                  borderTop: '1px solid var(--line)',
                  paddingTop: 14,
                  marginTop: 4,
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--serif)',
                    fontSize: 13,
                    letterSpacing: '.06em',
                  }}
                >
                  {r.who}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 10.5,
                    letterSpacing: '.14em',
                    color: 'var(--sumi-2)',
                    opacity: 0.7,
                    marginTop: 4,
                  }}
                >
                  {r.stay}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* press logos */}
        <div
          className="fade"
          style={{
            marginTop: 72,
            paddingTop: 28,
            borderTop: '1px solid var(--line)',
          }}
        >
          <div
            className="press-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 24,
              alignItems: 'center',
            }}
          >
            {[
              '家庭画報',
              'サライ',
              'Discover Japan',
              'じゃらん',
              'Travel + Leisure',
            ].map((p) => (
              <div
                key={p}
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 16,
                  letterSpacing: '.12em',
                  color: 'var(--sumi-2)',
                  opacity: 0.65,
                  borderLeft: '1px solid var(--line)',
                  paddingLeft: 16,
                  textAlign: 'center',
                }}
              >
                {p}
              </div>
            ))}
          </div>
        </div>

        <style>
          {`
          @media (max-width: 860px){
            #voice .fade[style*="repeat(4, 1fr)"]{ grid-template-columns: repeat(2, 1fr) !important; }
            #voice .fade[style*="repeat(3, 1fr)"]{ grid-template-columns: 1fr !important; }
            #voice .fade[style*="repeat(5, 1fr)"]{ grid-template-columns: repeat(2, 1fr) !important; }
          }
        `}
        </style>
      </div>
    </section>
  );
}

/* ============================================================
   08  FLOW
   ============================================================ */

function Flow({ onReserve }) {
  const ref = useReveal();
  const steps = [
    {
      n: '01',
      title: 'ご予約',
      body: '公式サイトからご希望の日付・お部屋を選び、ご予約フォームに進みます。所要約3分。',
      time: '3分',
    },
    {
      n: '02',
      title: 'ご確認メール',
      body: 'ご予約直後と前日に、確認メールをお送りします。送迎・お食事制限のご相談はこちらに返信ください。',
      time: '即時',
    },
    {
      n: '03',
      title: 'ご到着・チェックイン',
      body: '15時よりチェックイン。JR奈良駅からは無料送迎をご利用ください。ご到着前のお荷物預かりも可能。',
      time: '15:00〜',
    },
    {
      n: '04',
      title: 'ご滞在',
      body: 'お部屋でひと息ついた後、奈良公園へお散歩を。夕食は18:00〜、朝食は7:30〜（応相談）。',
      time: '—',
    },
    {
      n: '05',
      title: 'チェックアウト',
      body: '11:00までゆっくりと。お見送り後、ご希望の方には駅まで送迎いたします。',
      time: '〜11:00',
    },
  ];
  return (
    <section ref={ref} id="flow" style={{ background: 'var(--washi)' }}>
      <div className="wrap">
        <div className="section-head fade">
          <div className="section-head__meta">
            <span
              className="vtext"
              style={{ fontSize: 16, opacity: 0.5, color: 'var(--sumi-2)' }}
            >
              ご予約から滞在まで
            </span>
          </div>
          <div className="section-head__title">
            <h2 className="h-section">
              <span className="phrase">ご予約からお見送りまで、</span>
              <span className="phrase">五つのお約束。</span>
            </h2>
          </div>
        </div>

        <div className="fade" style={{ position: 'relative' }}>
          {steps.map((s, i) => (
            <div
              className="flow-row"
              key={s.n}
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr 120px',
                gap: 32,
                padding: '32px 0',
                borderTop: '1px solid var(--line)',
                borderBottom:
                  i === steps.length - 1 ? '1px solid var(--line)' : 'none',
                alignItems: 'center',
              }}
            >
              <div
                className="flow-number"
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 44,
                  fontWeight: 500,
                  color: 'var(--aka)',
                  letterSpacing: '.04em',
                }}
              >
                {s.n}
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--serif)',
                    fontSize: 22,
                    fontWeight: 600,
                    margin: '0 0 8px',
                    letterSpacing: '.06em',
                  }}
                >
                  {s.title}
                </h3>
                <p className="body" style={{ margin: 0 }}>
                  {s.body}
                </p>
              </div>
              <div
                className="flow-time"
                style={{
                  textAlign: 'right',
                  fontFamily: 'var(--mono)',
                  fontSize: 12,
                  letterSpacing: '.18em',
                  color: 'var(--sumi-2)',
                }}
              >
                {s.time}
              </div>
            </div>
          ))}
        </div>

        <div className="fade" style={{ marginTop: 48, textAlign: 'center' }}>
          <button type="button" className="btn btn--aka" onClick={onReserve}>
            まずは空室を確認する
            <span className="btn__arrow">→</span>
          </button>
        </div>

        <style>
          {`
          @media (max-width: 760px){
            #flow .fade > div[style*="120px 1fr 120px"]{ grid-template-columns: 60px 1fr !important; }
            #flow .fade > div[style*="120px 1fr 120px"] > div:last-child{ display:none; }
          }
        `}
        </style>
      </div>
    </section>
  );
}

/* ============================================================
   09  FAQ
   ============================================================ */

function FAQ() {
  const ref = useReveal();
  const [open, setOpen] = useState(0);
  const qs = [
    {
      q: '奈良公園までは、本当に徒歩三分ですか？',
      a: 'はい。宿の表門から奈良公園の入口（県庁東交差点）まで、ゆっくり歩いて約3分です。東大寺南大門までは徒歩約8分、春日大社までは約15分です。早朝の散策をおすすめしています。',
    },
    {
      q: '鹿せんべいはどこで買えますか？',
      a: '宿のフロントにて、チェックイン時にお一人様一束を無料でお渡ししています。追加は奈良公園内の売店でお求めいただけます。鹿との接し方は、女将より簡単な作法をご案内します。',
    },
    {
      q: '駅からの送迎はありますか？',
      a: 'JR奈良駅・近鉄奈良駅から、無料の送迎をご用意しています。ご予約時または前日までに、ご到着時刻をお知らせください。お帰りも、ご希望の方は駅までお送りします。',
    },
    {
      q: '小さな子ども連れでも泊まれますか？',
      a: 'もちろんです。お子様用の浴衣、踏み台、子ども用食器をご用意しています。離乳食のお持ち込み・温めもお気軽にお申し付けください。離れ「鹿苑」はお子様連れに特に人気です。',
    },
    {
      q: 'アレルギーや食事制限の対応は可能ですか？',
      a: '可能です。ご予約後の確認メールにご返信いただくか、お電話にてご相談ください。料理長が一品ずつ献立を組み替えます。ベジタリアン・ヴィーガンにも対応しております（前日17時までにご連絡ください）。',
    },
    {
      q: '車で行きたいのですが、駐車場はありますか？',
      a: '宿に専用駐車場（無料・10台）がございます。満車の場合は、徒歩2分の提携駐車場をご案内します。チェックイン前後の駐車も可能です。',
    },
    {
      q: 'キャンセルポリシーを教えてください。',
      a: '7日前まで無料、6〜2日前は宿泊料の20%、前日は50%、当日・無連絡は100%を申し受けます。やむを得ない事情の際はご相談ください。',
    },
  ];
  return (
    <section ref={ref} id="faq" style={{ background: 'var(--kinari)' }}>
      <div className="wrap-narrow">
        <div className="fade" style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 className="h-section">
            <span className="phrase">よくあるご質問</span>
          </h2>
        </div>
        <div className="fade" style={{ borderTop: '1px solid var(--line)' }}>
          {qs.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={i} style={{ borderBottom: '1px solid var(--line)' }}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '24px 4px',
                    display: 'grid',
                    gridTemplateColumns: '40px 1fr 24px',
                    alignItems: 'center',
                    gap: 16,
                  }}
                >
                  <span className="num">
                    Q.
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--serif)',
                      fontSize: 17,
                      fontWeight: 500,
                      letterSpacing: '.04em',
                      lineHeight: 1.55,
                    }}
                  >
                    {it.q}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 18,
                      color: 'var(--aka)',
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                      transition: 'transform .25s ease',
                      textAlign: 'right',
                    }}
                  >
                    +
                  </span>
                </button>
                <div
                  style={{
                    maxHeight: isOpen ? 400 : 0,
                    overflow: 'hidden',
                    transition: 'max-height .35s ease',
                  }}
                >
                  <div style={{ padding: '0 4px 28px 60px' }}>
                    <p className="body" style={{ margin: 0 }}>
                      {it.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- Expose to other scripts ---------- */
Object.assign(window, {
  TopNav,
  Hero,
  Problem,
  Empathy,
  Solution,
  Service,
  Strengths,
  Voice,
  Flow,
  FAQ,
  Placeholder,
  useReveal,
});

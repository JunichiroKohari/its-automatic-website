/* ============================================================
   AI研修 LP — Section components (Service → Results)
   ============================================================ */

/* ─── 05 SERVICE ─── */
function Service() {
  const [tab, setTab] = React.useState(0);
  const courses = [
    {
      tag: '基礎',
      title: 'AIリテラシー基礎コース',
      target: '全社員 / AI未経験者',
      duration: '半日 (4時間)',
      price: '¥98,000〜 / 回',
      desc: 'AIとは何かから、ChatGPTを業務で安全に使うための基本操作・プロンプト・社内ルールまで。受講者全員のスタート地点を揃えます。',
      curriculum: [
        ['09:30', 'オリエンテーション・受講前診断'],
        ['10:00', '生成AIの仕組みと、業務での"勘所"'],
        ['11:00', 'ChatGPT基本操作・プロンプト演習'],
        ['13:00', '業務メール・議事録・資料への活用演習'],
        ['15:30', '情報セキュリティ・社内利用ルール'],
        ['16:30', '受講後診断・宣言タイム'],
      ],
    },
    {
      tag: '実践',
      title: '業務効率化・実践コース',
      target: '一般社員・現場リーダー層',
      duration: '1日 (8時間)・全2日',
      price: '¥198,000〜 / 回',
      desc: '部門ごとの実務シナリオに沿ってAIを使い倒します。Excel連携・議事録自動化・データ整形・社内ナレッジ整備など、明日から使える"型"を持ち帰れます。',
      curriculum: [
        ['DAY1 AM', '部門別ユースケース棚卸し'],
        ['DAY1 PM', 'Excel × AI / 帳票自動化演習'],
        ['DAY2 AM', '議事録 → 要約 → タスク化の自動化'],
        ['DAY2 PM', '社内ナレッジへのAI実装演習'],
        ['DAY2 末', '活用ロードマップ作成・発表'],
      ],
      featured: true,
    },
    {
      tag: '戦略',
      title: 'AI経営戦略コース',
      target: '経営層・管理職・DX推進担当',
      duration: '半日 (4時間)',
      price: '¥148,000〜 / 回',
      desc: 'AI導入のROI計算、競合のAI活用事例、自社へのロードマップ策定まで。意思決定の解像度を上げ、人事と経営層が同じ言葉で話せる状態をつくります。',
      curriculum: [
        ['1限', '業界別AI活用の最前線'],
        ['2限', 'AI導入ROIの考え方・試算演習'],
        ['3限', '自社AI活用ロードマップ策定ワーク'],
        ['4限', 'AI活用組織への移行計画'],
      ],
    },
  ];
  const c = courses[tab];

  return (
    <section id="service" className="section" data-screen-label="05 Service" style={{ background: 'var(--bg-parchment)' }}>
      <div className="container">
        <window.Reveal y={20}>
          <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 56px' }}>
            <h2 className="h-section" style={{ marginBottom: 20, textWrap: 'balance', wordBreak: 'auto-phrase' }}>
              業務の階層・規模に合わせて、
              <br />
              3つのコース。
            </h2>
            <p className="lead">
              「全員に同じAI研修」では業務は変わりません。現場・リーダー・経営、それぞれの業務棚卸しから設計した3コース。組み合わせることで、全社で「業務を見直す文化」が育ちます。
            </p>
          </div>
        </window.Reveal>

        {/* Tab selector */}
        <div
          role="tablist"
          className="course-tabs"
          style={{
            display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 32, flexWrap: 'wrap',
          }}
        >
          {courses.map((co, i) => (
            <button
              key={co.tag}
              role="tab"
              className="course-tab"
              aria-selected={tab === i}
              onClick={() => setTab(i)}
              style={{
                padding: '10px 22px',
                borderRadius: 9999,
                fontSize: 13.5,
                fontWeight: 500,
                background: tab === i ? 'var(--ink-1)' : 'transparent',
                color: tab === i ? 'var(--on-dark-1)' : 'var(--ink-2)',
                border: `1px solid ${tab === i ? 'var(--ink-1)' : 'var(--border-2)'}`,
                transition: 'all 0.18s ease',
              }}
            >
              <span style={{ opacity: 0.7, marginRight: 8, fontSize: 11 }}>
                0
                {i + 1}
              </span>
              {co.tag}
              コース
            </button>
          ))}
        </div>

        {/* Course detail */}
        <div
          key={tab}
          className="course-detail"
          style={{
            background: 'var(--bg-ivory)',
            border: '1px solid var(--border-1)',
            borderRadius: 18,
            padding: 'clamp(28px, 4vw, 48px)',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.1fr)',
            gap: 'clamp(28px, 4vw, 56px)',
            animation: 'slidein 0.5s cubic-bezier(0.22,0.61,0.36,1) both',
          }}
        >
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 14px', borderRadius: 9999, background: c.featured ? 'var(--brand)' : 'var(--brand-soft)', color: c.featured ? '#fff' : 'var(--brand-dark)', fontSize: 11, fontWeight: 500, letterSpacing: 0.4, marginBottom: 18,
            }}
            >
              {c.featured && <span>★ 人気No.1</span>}
              {!c.featured && <span>{c.tag}</span>}
            </div>
            <h3 className="h-section" style={{ fontSize: 'clamp(24px, 2.8vw, 32px)', marginBottom: 14 }}>{c.title}</h3>
            <p className="body" style={{ marginBottom: 24 }}>{c.desc}</p>

            <div
              className="course-meta-grid"
              style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, paddingTop: 20, borderTop: '1px solid var(--border-1)',
              }}
            >
              {[['対象', c.target], ['期間', c.duration], ['料金', c.price], ['実施形式', 'オンライン / 訪問']].map(([k, v]) => (
                <div key={k}>
                  <div style={{
                    fontSize: 11, color: 'var(--ink-3)', letterSpacing: 0.5, marginBottom: 4,
                  }}
                  >
                    {k}
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--ink-1)', fontWeight: 500 }}>{v}</div>
                </div>
              ))}
            </div>

            <a href="#contact" className="btn btn--primary btn--arrow" style={{ marginTop: 28 }}>このコースの資料を請求する</a>
          </div>

          <div>
            <div style={{
              fontSize: 11, color: 'var(--ink-3)', letterSpacing: 0.5, marginBottom: 14, textTransform: 'uppercase',
            }}
            >
              カリキュラム例
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {c.curriculum.map(([t, item], i) => (
                <div
                  key={i}
                  className="curriculum-row"
                  style={{
                    display: 'grid', gridTemplateColumns: '90px 1fr', gap: 14, padding: '12px 0', borderTop: i === 0 ? 'none' : '1px solid var(--border-1)',
                  }}
                >
                  <div style={{
                    fontFamily: 'var(--serif)', fontSize: 13, color: 'var(--brand)', fontWeight: 500,
                  }}
                  >
                    {t}
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--ink-1)', lineHeight: 1.5 }}>{item}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Format options */}
        <div
          className="format-options"
          style={{
            marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12,
          }}
        >
          {[
            ['オンライン研修', 'Zoom・Teams等での同期型。少人数でも全国対応。'],
            ['訪問研修', '首都圏・関西圏中心に貴社オフィスで実施。'],
            ['ハイブリッド', '集合 + リモート併用。拠点が分散する企業様向け。'],
          ].map(([h, d]) => (
            <div
              key={h}
              style={{
                background: 'var(--bg-white)', border: '1px solid var(--border-2)', borderRadius: 12, padding: '18px 20px',
              }}
            >
              <div style={{
                fontFamily: 'var(--serif)', fontSize: 15, fontWeight: 500, color: 'var(--ink-1)', marginBottom: 6,
              }}
              >
                {h}
              </div>
              <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.7 }}>{d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 06 STRENGTHS / WHY US ─── */
function Strengths() {
  const strengths = [
    {
      num: '01',
      title: 'AIを教える前に、業務を棚卸しする',
      desc: '90分×2回のヒアリングで、貴社の業務フローを可視化。「どこに時間がかかり、どこにムダがあるのか」を見える化してから、カリキュラムを設計します。',
    },
    {
      num: '02',
      title: 'AI以外の手段も、フラットに提案する',
      desc: 'AI会社だからといってAIばかり勧めません。ロボット、仕組み化、フォーマットの見直しなど、業務に一番効く手段を選んで提案します。',
    },
    {
      num: '03',
      title: '実測された「業務削減時間」で評価',
      desc: '受講アンケートではなく、受講者の実業務を追跡して「週あたり何時間削減されたか」を測定。業務KPIで効果を語れるようにします。',
    },
    {
      num: '04',
      title: 'プログラミング不要のカリキュラム',
      desc: 'すべて「ノーコード×自然言語」で完結。スマホ・パソコンの基本操作ができれば、文系・営業・総務でも受講可能。',
    },
    {
      num: '05',
      title: '研修後30日間の業務定着伴走',
      desc: 'Slack/メールでの質問対応に加え、14日後・30日後に「業務に組み込めているか」をチェックイン。「学んだ」を「使っている」に変えます。',
    },
    {
      num: '06',
      title: '人事担当者向けプレイブック付き',
      desc: '研修運営・社内告知・効果報告のテンプレート一式を提供。人事担当者が「業務改革の推進者」として動きやすい状態をつくります。',
    },
  ];
  return (
    <section id="strengths" className="section" data-screen-label="06 Strengths" style={{ background: 'var(--bg-ivory)' }}>
      <div className="container">
        <window.Reveal y={20}>
          <div className="strengths-intro" style={{
            display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 'clamp(28px, 5vw, 80px)', alignItems: 'end', marginBottom: 'clamp(40px, 5vw, 64px)',
          }}
          >
            <div>
              <h2 className="h-section" style={{ textWrap: 'balance', wordBreak: 'auto-phrase' }}>
                「業務が変わる」
                <span className="accent-color">6つの</span>
                理由。
              </h2>
            </div>
            <p className="lead" style={{ maxWidth: 520, textWrap: 'pretty', wordBreak: 'auto-phrase' }}>
              生成AI研修を提供する会社は多くあります。その中で私たちが選ばれているのは、「AIを教えたか」ではなく「業務が変わるまで伴走できるか」を評価いただいているからです。
            </p>
          </div>
        </window.Reveal>

        <window.Stagger step={0.06} y={20} className="strengths-grid">
          {strengths.map(({ num, title, desc }, i) => (
            <div key={num} className="strength-cell">
              <div className="num-badge" style={{ marginBottom: 14 }}>{num}</div>
              <h3 style={{
                fontFamily: 'var(--serif)',
                fontWeight: 500,
                fontSize: 'clamp(16px, 1.7vw, 19px)',
                lineHeight: 1.45,
                marginBottom: 12,
                textWrap: 'balance',
                wordBreak: 'auto-phrase',
              }}
              >
                {title.replace(/\n/g, '')}
              </h3>
              <p style={{
                fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.85, textWrap: 'pretty', wordBreak: 'auto-phrase',
              }}
              >
                {desc}
              </p>
            </div>
          ))}
        </window.Stagger>
      </div>
    </section>
  );
}

/* ─── 07 RESULTS ─── */
function Results() {
  const testimonials = [
    {
      industry: '製造業 / 従業員120名',
      company: 'A社 製造業',
      role: '人事課 課長',
      headline: '「AIを入れた」ではなく「業務が変わった」と言えるように。',
      photo: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800&q=80&auto=format&fit=crop',
      photoAlt: '製造業の現場',
      text: '毎年外部研修を入れていましたが、現場で定着したのは今回が初めてです。受講後30日のフォローと、業務削減時間レポートで、経営層への説明にも困らなくなりました。',
      kpi: [['週あたり削減時間', '+6.4h / 人'], ['受講者活用継続率 (30日)', '92%']],
    },
    {
      industry: '士業 / 従業員40名',
      company: 'B法律事務所',
      role: '総務人事 マネージャー',
      headline: 'AIとAI以外を併せて、本当に効く改善ができた。',
      photo: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80&auto=format&fit=crop',
      photoAlt: '士業事務所のデスク',
      text: '情報セキュリティ研修と組み合わせていただき、機密文書の扱いも含めて整理できたのが大きいです。弁護士の文書作成時間は平均で35%短縮できました。',
      kpi: [['文書作成時間', '-35%'], ['受講者満足度', '4.7 / 5']],
    },
    {
      industry: '卸売業 / 従業員25名',
      company: 'C商事',
      role: '代表取締役 兼 人事',
      headline: '中小企業でも、「業務が変わる」手応えが見えました。',
      photo: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80&auto=format&fit=crop',
      photoAlt: 'チームミーティングの様子',
      text: '人事専任者がいない弊社でも、人事プレイブックがあるおかげで運用できました。受講後の社内アンケートで「他社の研修より圧倒的に実用的」との声が出ています。',
      kpi: [['年間人件費換算 ROI', '+940万円'], ['全社AI活用率', '88%']],
    },
  ];

  return (
    <section id="results" className="section section--dark" data-screen-label="07 Results">
      <div className="container">
        <window.Reveal y={20}>
          <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 56px' }}>
            <h2
              className="h-section"
              style={{
                color: 'var(--on-dark-1)', marginBottom: 18, textWrap: 'balance', wordBreak: 'auto-phrase',
              }}
            >
              「AIを使える」ではなく、
              <br />
              <span style={{ color: 'var(--brand-coral)' }}>業務が変わった</span>
              企業たち。
            </h2>
            <p className="lead on-dark">
              受講者アンケートではなく、業務KPIの実測ベースで報告します。業種・規模はさまざまですが、共通するのは「実数値で語れる」こと。
            </p>
          </div>
        </window.Reveal>

        {/* Big stats */}
        <window.Reveal delay={0.1} y={28}>
          <div className="results-stats" style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 0, border: '1px solid var(--border-dark)', borderRadius: 16, overflow: 'hidden', background: 'var(--bg-dark-3)', marginBottom: 64,
          }}
          >
            {[
              { v: 50, suffix: '社+', k: '業務改善支援実績' },
              {
                v: 8.6, suffix: 'h', dec: 1, prefix: '+', k: '週あたり業務削減 / 人',
              },
              {
                v: 940, suffix: '万円', prefix: '-', k: '年間人件費換算 (平均)',
              },
              { v: 88, suffix: '%', k: '業務KPI改善項目達成率' },
              { v: 98, suffix: '%', k: '受講者満足度' },
            ].map((s, i) => (
              <div key={s.k} style={{ padding: '28px 24px', borderRight: i < 4 ? '1px solid var(--border-dark)' : 'none' }}>
                <div style={{
                  fontFamily: 'var(--serif)', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 500, color: 'var(--on-dark-1)', lineHeight: 1.05,
                }}
                >
                  <window.Counter to={s.v} decimals={s.dec || 0} duration={1500} prefix={s.prefix || ''} suffix={s.suffix} />
                </div>
                <div style={{
                  fontSize: 12, color: 'var(--on-dark-3)', marginTop: 8, letterSpacing: 0.4,
                }}
                >
                  {s.k}
                </div>
              </div>
            ))}
          </div>
        </window.Reveal>

        {/* Logo marquee */}
        <window.Reveal delay={0.18} y={16}>
          <div style={{ marginBottom: 64 }}>
            <div style={{
              textAlign: 'center', fontSize: 11, letterSpacing: 1.4, color: 'var(--on-dark-3)', textTransform: 'uppercase', marginBottom: 24,
            }}
            >
              導入企業（一例）
            </div>
            <div
              className="marquee-mask"
              style={{
                overflow: 'hidden', border: '1px solid var(--border-dark)', borderRadius: 14, padding: '24px 0', background: 'var(--bg-dark-2)',
              }}
            >
              <div className="marquee-track">
                {[...Array(2)].flatMap((_, dup) => (
                  ['Mfg-A工業', '丸〇商事', 'B法律事務所', '△△クリニック', '◇◇設計', '○×サービス', 'Tech-Z株式会社', '　ケア　Care+', 'スタジオ K']
                    .map((l, i) => (
                      <span
                        key={`${dup}-${i}`}
                        style={{
                          fontFamily: 'var(--serif)', fontSize: 18, color: 'var(--on-dark-2)', letterSpacing: 1, opacity: 0.85, whiteSpace: 'nowrap',
                        }}
                      >
                        {l}
                      </span>
                    ))
                ))}
              </div>
            </div>
          </div>
        </window.Reveal>

        {/* Testimonials */}
        <window.Stagger
          step={0.1}
          y={28}
          className="results-testimonials"
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16,
          }}
        >
          {testimonials.map((t) => (
            <div
              key={t.company}
              className="card card--dark results-testimonial-card"
              style={{
                display: 'flex', flexDirection: 'column', gap: 0, padding: 0, overflow: 'hidden',
              }}
            >
              {/* Card photo */}
              <div style={{
                position: 'relative', aspectRatio: '16 / 9', overflow: 'hidden', background: 'var(--bg-dark-3)',
              }}
              >
                <img
                  src={t.photo}
                  alt={t.photoAlt}
                  loading="lazy"
                  style={{
                    width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.82) contrast(1.02)',
                  }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,20,19,0.0) 40%, rgba(20,20,19,0.7) 100%)' }} />
                <div style={{
                  position: 'absolute', left: 14, top: 14, fontSize: 10, color: 'var(--brand-coral)', background: 'rgba(20,20,19,0.55)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: 9999, letterSpacing: 0.4,
                }}
                >
                  {t.industry}
                </div>
              </div>
              <div style={{
                padding: '20px 22px 22px', display: 'flex', flexDirection: 'column', gap: 14, flex: 1,
              }}
              >
                <h3
                  className="h-card"
                  style={{
                    color: 'var(--on-dark-1)', fontSize: 17, marginBottom: 0, textWrap: 'balance', wordBreak: 'auto-phrase',
                  }}
                >
                  {t.headline}
                </h3>
                <p
                  className="body on-dark results-testimonial-body"
                  style={{ fontSize: 14, textWrap: 'pretty', wordBreak: 'auto-phrase' }}
                >
                  {t.text}
                </p>

                <div
                  className="results-testimonial-kpis"
                  style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '14px 0', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  {t.kpi.map(([k, v]) => (
                    <div key={k}>
                      <div style={{
                        fontSize: 10, color: 'var(--on-dark-3)', letterSpacing: 0.4, marginBottom: 4,
                      }}
                      >
                        {k}
                      </div>
                      <div style={{
                        fontFamily: 'var(--serif)', fontSize: 18, color: 'var(--brand-coral)', fontWeight: 500,
                      }}
                      >
                        {v}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ fontSize: 12, color: 'var(--on-dark-2)', marginTop: 'auto' }}>
                  <span style={{ color: 'var(--on-dark-1)', fontWeight: 500 }}>{t.company}</span>
                  {' '}
                  /
                  {' '}
                  {t.role}
                </div>
              </div>
            </div>
          ))}
        </window.Stagger>
      </div>
    </section>
  );
}

Object.assign(window, { Service, Strengths, Results });

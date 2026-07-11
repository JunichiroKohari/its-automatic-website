/* ============================================================
   AI研修 LP — Section components (Flow → CTA → Footer)
   ============================================================ */

/* ─── 08 FLOW ─── */
function Flow() {
  const steps = [
    {
      num: '01',
      title: 'お問い合わせ',
      span: '当日〜翌営業日',
      desc: '資料請求 / 無料相談フォームよりご連絡ください。担当より24時間以内にご連絡します。',
      action: '人事担当者だけでなく、経営層・現場リーダーも同席いただくと、その後がスムーズです。',
    },
    {
      num: '02',
      title: '業務ヒアリング・棚卸し (90分 × 2回)',
      span: '1週目',
      desc: '貴社の業務工程をマッピングし、「どこに時間がかかり、どこにムダがあるのか」を可視化します。ここが出発点です。',
      action: '「何となくAI入れたい」段階でOK。むしろ、課題が漠然としているほど効果が出やすいです。',
    },
    {
      num: '03',
      title: '手段の選定・カリキュラム提案',
      span: '1〜2週目',
      desc: '棚卸した業務を「AI / 仕組み化 / 人」に振り分けた上で、貴社専用カリキュラムとお見積りをご提示します。',
      action: '稟議書ひな形・社内告知文・社内説明スライドもご提供します。',
    },
    {
      num: '04',
      title: '契約・研修実施',
      span: '2〜4週目',
      desc: '契約後、最短2週間で初回研修を実施。事前課題・受講前診断もご案内します。',
      action: '実施日は受講者と相談しながら柔軟に調整可能です。',
    },
    {
      num: '05',
      title: '業務KPIで効果測定 + 30日間定着サポート',
      span: '実施後〜30日',
      desc: '「週あたり何時間削減されたか」を実測し、年間換算ROIレポートを納品。Slack/メールで質問対応 + チェックイン。',
      action: '経営層向けの効果報告書フォーマットもセットでお渡しします。',
    },
  ];
  return (
    <section id="flow" className="section" data-screen-label="08 Flow" style={{ background: 'var(--bg-parchment)' }}>
      <div className="container">
        <window.Reveal y={20}>
          <div style={{ maxWidth: 880, marginBottom: 'clamp(40px, 6vw, 64px)' }}>
            <h2
              className="h-section"
              style={{
                marginBottom: 24, textWrap: 'balance', wordBreak: 'auto-phrase', maxWidth: 760,
              }}
            >
              業務棚卸しから始め、
              <span className="accent-underline">最短2週間</span>
              で初回研修。
            </h2>
            <p className="lead" style={{ maxWidth: 720, textWrap: 'pretty', wordBreak: 'auto-phrase' }}>
              いきなり研修を始めるのではなく、まず業務を見る。これがIt's Automaticのコミットメントです。それでも最短2週間で初回研修を開始できるよう、ヒアリングと提案を高密度で進めます。
            </p>
          </div>
        </window.Reveal>

        <div style={{
          display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', maxWidth: 880, margin: '0 auto',
        }}
        >
          <window.Stagger step={0.1} y={20} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {steps.map((s, i) => (
              <div
                key={s.num}
                className="flow-step"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: 'clamp(20px, 2.5vw, 32px)',
                  paddingBottom: i === steps.length - 1 ? 0 : 28,
                }}
              >
                {/* Number + connector */}
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                }}
                >
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: i === 0 ? 'var(--brand)' : 'var(--bg-ivory)',
                    border: i === 0 ? 'none' : '1px solid var(--border-2)',
                    color: i === 0 ? '#fff' : 'var(--ink-1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--serif)',
                    fontSize: 16,
                    fontWeight: 500,
                    flexShrink: 0,
                    position: 'relative',
                    zIndex: 1,
                  }}
                  >
                    {s.num}
                  </div>
                  {i !== steps.length - 1 && (
                    <div style={{
                      width: 1,
                      flex: 1,
                      minHeight: 60,
                      background: 'repeating-linear-gradient(180deg, var(--border-3) 0, var(--border-3) 4px, transparent 4px, transparent 9px)',
                    }}
                    />
                  )}
                </div>

                <div style={{ paddingTop: 6, paddingBottom: i === steps.length - 1 ? 0 : 8 }}>
                  <div style={{
                    display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap', marginBottom: 8,
                  }}
                  >
                    <h3 className="h-card" style={{ fontSize: 'clamp(17px, 2vw, 21px)' }}>{s.title}</h3>
                    <span style={{
                      fontSize: 12, color: 'var(--brand)', background: 'var(--brand-soft)', padding: '3px 10px', borderRadius: 9999, letterSpacing: 0.3, fontWeight: 500,
                    }}
                    >
                      {s.span}
                    </span>
                  </div>
                  <p className="body" style={{ marginBottom: 10 }}>{s.desc}</p>
                  <div style={{
                    fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.7, paddingLeft: 14, borderLeft: '2px solid var(--brand-soft)',
                  }}
                  >
                    <span style={{ color: 'var(--brand)', fontWeight: 500, marginRight: 6 }}>POINT</span>
                    {s.action}
                  </div>
                </div>
              </div>
            ))}
          </window.Stagger>
        </div>
      </div>
    </section>
  );
}

/* ─── 09 FAQ ─── */
function FAQ() {
  const [open, setOpen] = React.useState(0);
  const faqs = [
    {
      q: '「AI研修サービス」ということは、AIを必ず導入する前提ですか？',
      a: 'いいえ、まったく違います。私たちは「AIは目的ではなく、業務改善のための手段の一つ」と考えています。事前ヒアリングで貴社の業務を棚卸しした結果、「ここはAIで効率化できる」「ここはAIより仕組み化が向いている」「ここは業務自体を見直すべき」と判断します。結果的にAI以外の手段を中心にご提案するケースもあります。大切なのは、AIを使うことではなく、業務が変わることです。',
    },
    {
      q: 'IT・プログラミングの知識がない社員でも受講できますか？',
      a: 'はい、まったく問題ありません。本研修はプログラミング等の専門知識がない方を対象に設計されています。スマートフォン・PCの基本操作ができれば、文系・営業職・総務・人事のいずれの方でも受講いただけます。受講前診断で基礎スキルを把握した上で進めるため、置いていかれる方は出ません。',
    },
    {
      q: '最少何名から、最大何名まで受講可能ですか？',
      a: 'スターターパックは5名〜、スタンダードパックは5〜30名、エンタープライズは人数上限なしで対応可能です。1〜4名の少人数の場合は、複数企業合同コースもご紹介できます。お気軽にご相談ください。',
    },
    {
      q: '業種・業務に合わせたカリキュラムにできますか？',
      a: 'スタンダードパック以上では、事前のヒアリング (60分×2回) をもとに貴社専用のカリキュラムをご提案します。製造・小売・建設・士業・医療・サービス業など、幅広い業種への導入実績がありますので、業界特有の事情にも対応可能です。',
    },
    {
      q: '機密情報や個人情報の扱いは大丈夫ですか？',
      a: '研修で使用する業務データはすべて事前に匿名化処理を行います。また、貴社のAI利用ポリシー策定・情報セキュリティ研修もオプションでご提供可能です。守秘義務NDAは標準で締結します。',
    },
    {
      q: '経営層・取締役会に出せる効果報告はもらえますか？',
      a: 'はい。受講前後のスキル診断スコア、業務削減時間、活用継続率を数値化した「効果測定レポート」を標準納品します。次年度の研修予算策定や、経営会議でのご報告にそのままご利用いただけます。',
    },
    {
      q: '研修後のフォローはどれくらいの期間ありますか？',
      a: 'スタンダードパック以上では、研修終了後30日間のSlack・メールサポートを標準提供します。実際の業務でAIを使い始めた際の疑問・つまずきにお答えするほか、14日後・30日後に活用度のチェックインを実施し、"研修やりっぱなし"を防ぎます。',
    },
    {
      q: 'お問い合わせから初回研修まで、最短どれくらいですか？',
      a: '最短2週間です。ヒアリング・カリキュラム提案を1週目、契約・事前準備を2週目に進め、3週目以降で初回研修実施というスケジュールが標準です。期末の予算消化など、お急ぎのご事情がある場合はご相談ください。',
    },
    {
      q: '相談だけしてみたい、まだ社内検討段階でも問題ないですか？',
      a: 'もちろん歓迎します。むしろ「まだ何から考えればいいか分からない」段階でのご相談を多くいただいています。60分の無料相談では、貴社の状況をお聞きした上で、研修以外の選択肢（社内勉強会・PoC等）もフラットにご提案します。',
    },
  ];
  return (
    <section id="faq" className="section" data-screen-label="09 FAQ" style={{ background: 'var(--bg-ivory)' }}>
      <div className="container" style={{ maxWidth: 920 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 className="h-section">よくある質問</h2>
        </div>

        <div>
          {faqs.map((f, i) => (
            <div key={i} style={{ borderTop: '1px solid var(--border-2)' }}>
              <button
                type="button"
                className="faq-question"
                onClick={() => setOpen(open === i ? -1 : i)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '22px 0',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 18,
                  fontFamily: 'var(--serif)',
                }}
              >
                <span style={{
                  color: 'var(--brand)', fontFamily: 'var(--serif)', fontSize: 15, fontWeight: 500, flexShrink: 0, paddingTop: 2, minWidth: 24,
                }}
                >
                  Q
                  {(i + 1).toString().padStart(2, '0')}
                </span>
                <span style={{
                  flex: 1, fontSize: 'clamp(15px, 1.7vw, 17px)', fontWeight: 500, color: 'var(--ink-1)', lineHeight: 1.55, textWrap: 'pretty',
                }}
                >
                  {f.q}
                </span>
                <span style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: open === i ? 'var(--brand)' : 'var(--bg-parchment)',
                  color: open === i ? '#fff' : 'var(--ink-1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: 14,
                  fontWeight: 400,
                  transition: 'all 0.18s',
                  transform: open === i ? 'rotate(45deg)' : 'rotate(0)',
                }}
                >
                  +
                </span>
              </button>
              {open === i && (
                <div
                  className="faq-answer"
                  style={{
                    paddingLeft: 42,
                    paddingBottom: 24,
                    paddingRight: 48,
                    animation: 'fadein 0.2s ease',
                  }}
                >
                  <p className="body" style={{ fontSize: 15 }}>{f.a}</p>
                </div>
              )}
            </div>
          ))}
          <div style={{ borderTop: '1px solid var(--border-2)' }} />
        </div>

        <div style={{
          textAlign: 'center', marginTop: 40, fontSize: 14, color: 'var(--ink-2)',
        }}
        >
          ここに無い質問は、
          <a href="#contact" style={{ color: 'var(--brand)', borderBottom: '1px solid currentColor' }}>無料相談</a>
          {' '}
          にて直接お聞かせください。
        </div>
      </div>
    </section>
  );
}

/* ─── 10 CTA / CONTACT ─── */
function CTA() {
  const [intent, setIntent] = React.useState('doc'); // 'doc' or 'consult'
  const [submitted, setSubmitted] = React.useState(false);
  const [form, setForm] = React.useState({
    company: '', name: '', email: '', size: '', message: '',
  });
  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };
  const update = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  return (
    <section id="contact" className="section section--dark" data-screen-label="10 CTA" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background photograph */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1800&q=85&auto=format&fit=crop"
          alt=""
          loading="lazy"
          style={{
            width: '100%', height: '100%', objectFit: 'cover', opacity: 0.18, filter: 'saturate(0.7) contrast(1.05)',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,20,19,0.85) 0%, rgba(20,20,19,0.92) 100%)' }} />
      </div>
      <div
        aria-hidden
        style={{
          position: 'absolute', top: -100, right: -100, width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,100,66,0.18) 0%, transparent 60%)', pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute', bottom: -160, left: -120, width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(107,127,92,0.10) 0%, transparent 60%)', pointerEvents: 'none',
        }}
      />

      <div
        className="container"
        style={{
          position: 'relative', maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 'clamp(32px, 5vw, 56px)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h2
            className="h-section"
            style={{
              color: 'var(--on-dark-1)', marginBottom: 24, textWrap: 'balance', wordBreak: 'auto-phrase', maxWidth: 680, marginLeft: 'auto', marginRight: 'auto',
            }}
          >
            業務を見直す、
            <span style={{ color: 'var(--brand-coral)' }}>最初の一歩</span>
            を一緒に。
          </h2>
          <p
            className="lead on-dark"
            style={{
              marginBottom: 40, textWrap: 'pretty', wordBreak: 'auto-phrase', maxWidth: 620, marginLeft: 'auto', marginRight: 'auto',
            }}
          >
            「AIを入れるべきか」の段階からご相談いただけます。業務の棚卸しを一緒にし、AIで解ける部分と、AI以外で解いたほうがよい部分を、フラットにお伝えします。
          </p>

          <div
            className="cta-proof-grid"
            style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 36, textAlign: 'left',
            }}
          >
            {[
              ['資料は1営業日以内にメール送付', '社内回覧用 / 経営層向け説明資料の2種類'],
              ['無料相談は人事だけでも参加可', '経営層・現場の同席なしでもOK。'],
              ['しつこい営業は一切ありません', '相談後に再連絡を希望されない場合、その後の連絡は行いません。'],
            ].map(([h, d]) => (
              <div
                key={h}
                style={{
                  display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-dark)', borderRadius: 12,
                }}
              >
                <span style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: 'var(--brand)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  flexShrink: 0,
                  marginTop: 2,
                }}
                >
                  ✓
                </span>
                <div>
                  <div style={{
                    fontFamily: 'var(--serif)', fontSize: 13.5, fontWeight: 500, color: 'var(--on-dark-1)', marginBottom: 3, textWrap: 'balance',
                  }}
                  >
                    {h}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--on-dark-2)', lineHeight: 1.55 }}>{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div style={{
          background: 'var(--bg-ivory)',
          borderRadius: 18,
          padding: 'clamp(24px, 4vw, 40px)',
          color: 'var(--ink-1)',
        }}
        >
          {submitted ? (
            <div style={{ padding: '32px 8px', textAlign: 'center' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%', background: 'var(--brand-soft)', color: 'var(--brand)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
              }}
              >
                ✓
              </div>
              <h3 className="h-card" style={{ marginBottom: 12 }}>お問い合わせありがとうございます。</h3>
              <p className="body">担当より1営業日以内にご連絡いたします。</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Intent toggle */}
              <div>
                <div style={{
                  fontSize: 12, fontWeight: 500, color: 'var(--ink-2)', display: 'block', marginBottom: 8,
                }}
                >
                  お問い合わせ内容
                  {' '}
                  <span style={{
                    display: 'inline-block', marginLeft: 6, background: 'var(--brand)', color: '#fff', fontSize: 10, padding: '1px 6px', borderRadius: 3,
                  }}
                  >
                    必須
                  </span>
                </div>
                <div className="intent-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[['doc', '資料ダウンロード', 'まずは情報収集から'], ['consult', '無料相談を予約', '60分・オンライン']].map(([k, t, sub]) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setIntent(k)}
                      style={{
                        padding: '14px 16px',
                        textAlign: 'left',
                        background: intent === k ? 'var(--brand)' : 'var(--bg-white)',
                        color: intent === k ? '#fff' : 'var(--ink-1)',
                        border: `1px solid ${intent === k ? 'var(--brand)' : 'var(--border-2)'}`,
                        borderRadius: 10,
                        transition: 'all 0.15s',
                      }}
                    >
                      <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{t}</div>
                      <div style={{ fontSize: 11, opacity: 0.85 }}>{sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="field">
                  <label htmlFor="ai-contact-company">
                    会社名
                    <span className="req">必須</span>
                  </label>
                  <input
                    id="ai-contact-company"
                    required
                    value={form.company}
                    onChange={(e) => update('company', e.target.value)}
                    placeholder="株式会社〇〇"
                  />
                </div>
                <div className="field">
                  <label htmlFor="ai-contact-name">
                    お名前
                    <span className="req">必須</span>
                  </label>
                  <input
                    id="ai-contact-name"
                    required
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    placeholder="山田 太郎"
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="ai-contact-email">
                  会社メールアドレス
                  <span className="req">必須</span>
                </label>
                <input
                  id="ai-contact-email"
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="info@company.co.jp"
                />
              </div>

              <div className="field">
                <label htmlFor="ai-contact-size">従業員規模</label>
                <select
                  id="ai-contact-size"
                  value={form.size}
                  onChange={(e) => update('size', e.target.value)}
                >
                  <option value="">選択してください</option>
                  <option>個人・10名未満</option>
                  <option>10〜50名</option>
                  <option>51〜100名</option>
                  <option>101〜300名</option>
                  <option>301名以上</option>
                </select>
              </div>

              {intent === 'consult' && (
                <div className="field">
                  <label htmlFor="ai-contact-message">ご相談内容（任意）</label>
                  <textarea
                    id="ai-contact-message"
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                    placeholder="検討中のコース、社内の状況などをご記入いただけるとスムーズです。"
                  />
                </div>
              )}

              <button type="submit" className="btn btn--primary btn--arrow" style={{ marginTop: 8, width: '100%' }}>
                {intent === 'doc' ? '資料を無料ダウンロードする' : '無料相談を予約する'}
              </button>

              <p style={{
                fontSize: 11, color: 'var(--ink-3)', textAlign: 'center', lineHeight: 1.7, marginTop: 4,
              }}
              >
                ご入力情報は
                {' '}
                <a href="/tokushoho/" style={{ borderBottom: '1px solid currentColor' }}>特定商取引法に基づく表記</a>
                {' '}
                に従って取り扱います。
              </p>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  return (
    <footer style={{ background: 'var(--bg-dark-2)', color: 'var(--on-dark-2)', padding: '56px var(--px) 32px' }}>
      <div className="container">
        <div
          className="footer-grid"
          style={{
            display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) repeat(3, minmax(0, 1fr))', gap: 'clamp(28px, 4vw, 56px)', marginBottom: 40,
          }}
        >
          <div>
            <img
              src="assets/logo-light.svg"
              alt="It's Automatic"
              style={{
                height: 28, width: 'auto', marginBottom: 16, opacity: 0.9,
              }}
            />
            <p style={{
              fontSize: 13, color: 'var(--on-dark-3)', lineHeight: 1.85, maxWidth: 280,
            }}
            >
              株式会社It's Automatic
              <br />
              スマホアプリ・Webサービスの企画・開発・運営。企業向けAI研修を提供しています。
            </p>
            <p style={{
              fontSize: 12, color: 'var(--on-dark-3)', marginTop: 16, lineHeight: 1.7,
            }}
            >
              〒564-0000 大阪府吹田市
              <br />
              設立：2026年1月 / 代表：小針 隼一郎
            </p>
          </div>
          {[
            ['サービス', [
              ['AI研修サービス', '#service'],
              ['カリキュラム', '#service'],
              ['料金プラン', '#service'],
              ['導入事例', '#results'],
            ]],
            ['会社情報', [
              ['会社概要', '/'],
              ['採用情報', '/'],
              ['お知らせ', '/'],
              ['ブログ', '/'],
            ]],
            ['ポリシー', [
              ['特定商取引法', '/tokushoho/'],
              ['お問い合わせ', '#contact'],
              ['サイトマップ', '/'],
            ]],
          ].map(([h, links]) => (
            <div key={h}>
              <div style={{
                fontSize: 11, color: 'var(--on-dark-3)', letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 14,
              }}
              >
                {h}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {links.map(([label, href]) => (
                  <a key={label} href={href} style={{ fontSize: 13.5, color: 'var(--on-dark-2)' }}>{label}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{
          borderTop: '1px solid var(--border-dark)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, fontSize: 12, color: 'var(--on-dark-3)',
        }}
        >
          <span>© 2026 株式会社It's Automatic. All rights reserved.</span>
          <span>https://its-automatic.com/</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  Flow, FAQ, CTA, Footer,
});

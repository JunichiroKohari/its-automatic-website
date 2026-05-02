document.addEventListener('DOMContentLoaded', async () => {
  const breadcrumb = document.querySelector('.breadcrumb')
  const galleryInner = document.querySelector('.gallery-inner')
  const detailWrap = document.querySelector('.detail-wrap')
  const relatedGrid = document.querySelector('.related-grid')
  const lightboxLabel = document.querySelector('.lightbox-img p')
  const numberFormatter = new Intl.NumberFormat('ja-JP')

  if (!breadcrumb || !galleryInner || !detailWrap || !relatedGrid) {
    return
  }

  const escapeHtml = (value) => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

  const buildDetailUrl = (property) => {
    const separator = property.detailUrl.includes('?') ? '&' : '?'
    return `${property.detailUrl}${separator}id=${encodeURIComponent(property.id)}`
  }

  const getCategoryIcon = (category) => {
    if (category === 'マンション') {
      return '<svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>'
    }

    if (category === '土地') {
      return '<svg viewBox="0 0 24 24"><polygon points="3 11 12 2 21 11 21 21 15 21 15 15 9 15 9 21 3 21"/></svg>'
    }

    return '<svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'
  }

  const parseSpecValue = (spec) => String(spec ?? '')
    .replace(/^建面積\s*/, '')
    .replace(/^土地\s*/, '')
    .replace(/^専有\s*/, '')
    .replace(/^地積\s*/, '')
    .trim()

  const getQuickSpecs = (property) => {
    if (property.category === 'マンション') {
      return [
        { label: '間取り', value: property.specs[0] || '-' },
        { label: '専有面積', value: parseSpecValue(property.specs[1]) || '-' },
        { label: '所在階', value: property.specs[2] || '-' },
        { label: '築年数', value: property.specs[3] || '-' },
      ]
    }

    if (property.category === '土地') {
      return [
        { label: '土地種別', value: '売土地' },
        { label: '地積', value: parseSpecValue(property.specs[1]) || '-' },
        { label: '現況 / 特徴', value: property.specs[2] || '-' },
        { label: '条件', value: property.specs[3] || '-' },
      ]
    }

    return [
      { label: '間取り', value: property.specs[0] || '-' },
      { label: '建物面積', value: parseSpecValue(property.specs[1]) || '-' },
      { label: '土地面積', value: parseSpecValue(property.specs[2]) || '-' },
      { label: '築年数', value: property.specs[3] || '-' },
    ]
  }

  const getPrefecture = (location) => {
    const match = String(location ?? '').match(/^(東京都|北海道|京都府|大阪府|.{2,3}県)/)
    return match ? match[1] : location
  }

  const renderRows = (rows) => rows.map(([label, value]) => (
    `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`
  )).join('')

  const activateReveals = () => {
    const reveals = Array.from(document.querySelectorAll('.reveal'))

    if (!('IntersectionObserver' in window)) {
      reveals.forEach((element) => element.classList.add('visible'))
      return
    }

    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return
        }

        entry.target.classList.add('visible')
        currentObserver.unobserve(entry.target)
      })
    }, {
      threshold: 0.1,
    })

    reveals.forEach((element) => observer.observe(element))
  }

  try {
    const [propertiesResponse, detailsResponse] = await Promise.all([
      fetch('assets/data/properties.json'),
      fetch('assets/data/property-details.json'),
    ])

    if (!propertiesResponse.ok) {
      throw new Error(`properties.json: ${propertiesResponse.status}`)
    }

    if (!detailsResponse.ok) {
      throw new Error(`property-details.json: ${detailsResponse.status}`)
    }

    const [properties, detailData] = await Promise.all([
      propertiesResponse.json(),
      detailsResponse.json(),
    ])

    const detailsById = new Map(detailData.map((detail) => [detail.id, detail]))
    const params = new URLSearchParams(window.location.search)
    const requestedId = params.get('id')
    const property = properties.find((item) => item.id === requestedId) || properties[0]
    const detail = detailsById.get(property.id)

    if (!property || !detail) {
      throw new Error(`property not found: ${requestedId}`)
    }

    const quickSpecs = getQuickSpecs(property)
    const relatedProperties = [...properties]
      .filter((item) => item.id !== property.id)
      .sort((left, right) => {
        const leftCategoryScore = left.category === property.category ? 0 : 1
        const rightCategoryScore = right.category === property.category ? 0 : 1

        if (leftCategoryScore !== rightCategoryScore) {
          return leftCategoryScore - rightCategoryScore
        }

        const leftPrefectureScore = getPrefecture(left.location) === getPrefecture(property.location) ? 0 : 1
        const rightPrefectureScore = getPrefecture(right.location) === getPrefecture(property.location) ? 0 : 1

        if (leftPrefectureScore !== rightPrefectureScore) {
          return leftPrefectureScore - rightPrefectureScore
        }

        return Math.abs(left.price - property.price) - Math.abs(right.price - property.price)
      })
      .slice(0, 3)

    document.title = `${property.title} | 小針不動産株式会社`

    breadcrumb.innerHTML = `
      <a href="index.html">ホーム</a>
      <span>›</span>
      <a href="properties.html">物件一覧</a>
      <span>›</span>
      <span style="color: var(--text-mid);">${escapeHtml(property.title)}</span>
    `

    galleryInner.innerHTML = `
      <div class="gallery-main" onclick="openLightbox()" style="background:${escapeHtml(property.background)}">
        <div class="gallery-overlay"><span>写真を拡大する</span></div>
        <div class="gallery-ph">
          ${getCategoryIcon(property.category)}
          <p>${escapeHtml(detail.gallery.mainCaption)}</p>
        </div>
        <div class="gallery-count">${escapeHtml(detail.gallery.countLabel)}</div>
      </div>
      <div class="gallery-sub" style="background:${escapeHtml(property.background)}">
        <div class="gallery-ph">
          ${getCategoryIcon(property.category)}
          <p>${escapeHtml(detail.gallery.subCaptions[0] || detail.gallery.mainCaption)}</p>
        </div>
      </div>
      <div class="gallery-sub" style="background:${escapeHtml(property.background)}">
        <div class="gallery-ph">
          ${getCategoryIcon(property.category)}
          <p>${escapeHtml(detail.gallery.subCaptions[1] || detail.gallery.mainCaption)}</p>
        </div>
      </div>
    `

    detailWrap.innerHTML = `
      <div class="detail-left">
        <div class="detail-header reveal">
          <div class="detail-badges">
            ${property.badges.map((badge) => `<span class="badge badge-new">${escapeHtml(badge)}</span>`).join('')}
            <span class="badge badge-type">${escapeHtml(property.category)}</span>
          </div>
          <h1 class="detail-title">${escapeHtml(property.title)}</h1>
          <div class="detail-location">
            <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${escapeHtml(detail.address)} ／ ${escapeHtml(property.access)}
          </div>
        </div>

        <div class="detail-price-row reveal reveal-delay-1">
          <div>
            <div class="detail-price">${numberFormatter.format(property.price)}<span>万円</span></div>
          </div>
          <div class="detail-price-note">
            ※価格には消費税が含まれています<br>
            ※別途仲介手数料が必要です
          </div>
        </div>

        <div class="quick-specs reveal reveal-delay-2">
          ${quickSpecs.map((item) => `
            <div class="qs-item">
              ${getCategoryIcon(property.category)}
              <div class="qs-label">${escapeHtml(item.label)}</div>
              <div class="qs-value">${escapeHtml(item.value)}</div>
            </div>
          `).join('')}
        </div>

        <div class="tabs reveal">
          <button class="tab-btn active" onclick="switchTab(this,'tab-detail')">物件詳細</button>
          <button class="tab-btn" onclick="switchTab(this,'tab-desc')">物件紹介</button>
          <button class="tab-btn" onclick="switchTab(this,'tab-map')">地図・周辺</button>
        </div>

        <div class="tab-panel active reveal" id="tab-detail">
          <table class="detail-table">
            <tbody>${renderRows(detail.detailRows)}</tbody>
          </table>
        </div>

        <div class="tab-panel" id="tab-desc">
          <div class="desc-section">
            <h3>物件のご紹介</h3>
            ${detail.description.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}
            <h3>おすすめポイント</h3>
            <div class="feature-list">
              ${detail.features.map((feature) => `<div class="feature-item">${escapeHtml(feature)}</div>`).join('')}
            </div>
          </div>
        </div>

        <div class="tab-panel" id="tab-map">
          <div class="map-placeholder">
            <div class="map-pin">
              <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <svg viewBox="0 0 24 24" style="margin-top: 0"><rect x="3" y="3" width="18" height="18"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18" stroke-opacity="0.3"/></svg>
            <p>${escapeHtml(detail.address)}<br>周辺施設の参考位置イメージ</p>
          </div>
          <div style="margin-top: 1.5rem;">
            <table class="detail-table">
              <tbody>${renderRows(detail.nearbyRows)}</tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="detail-right reveal">
        <div class="contact-card">
          <div class="contact-card-header">
            <div class="cc-label">販売価格</div>
            <div class="price">${numberFormatter.format(property.price)}<span>万円</span></div>
          </div>
          <div class="contact-card-body">
            <div class="cc-specs">
              ${quickSpecs.slice(0, 4).map((item) => `
                <div class="cc-spec">${escapeHtml(item.label)}<strong>${escapeHtml(item.value)}</strong></div>
              `).join('')}
            </div>
            <div class="cc-divider"></div>
            <div class="cc-form">
              <input class="cc-input" type="text" placeholder="お名前">
              <input class="cc-input" type="tel" placeholder="電話番号">
              <input class="cc-input" type="email" placeholder="メールアドレス">
              <textarea class="cc-textarea" placeholder="${escapeHtml(property.title)}について知りたいことをご入力ください"></textarea>
              <button class="btn-contact">この物件について問い合わせる</button>
              <button class="btn-tel">
                <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.1 1.18C.1.69.5.2 1.09.2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L5.09 7.09a16 16 0 006.29 6.29l1.06-1.26a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.18v2.74z"/></svg>
                電話で問い合わせる
              </button>
            </div>
            <p class="cc-note">無料・24時間受付<br>翌営業日中にご連絡いたします</p>
          </div>
        </div>
        <div class="action-bar">
          <button class="action-btn" id="favBtn" onclick="toggleFav()">
            <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            お気に入り
          </button>
          <button class="action-btn">
            <svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            シェア
          </button>
          <button class="action-btn">
            <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            印刷
          </button>
        </div>
      </div>
    `

    relatedGrid.innerHTML = relatedProperties.map((item, index) => `
      <a href="${buildDetailUrl(item)}" class="rel-card reveal${index > 0 ? ` reveal-delay-${index}` : ''}">
        <div class="rel-img" style="background:${escapeHtml(item.background)}">
          ${getCategoryIcon(item.category)}
        </div>
        <div class="rel-body">
          <div class="rel-location">${escapeHtml(item.location)} / ${escapeHtml(item.access)}</div>
          <div class="rel-title">${escapeHtml(item.title)}</div>
          <div class="rel-price">${numberFormatter.format(item.price)}<span>万円</span></div>
        </div>
      </a>
    `).join('')

    if (lightboxLabel) {
      lightboxLabel.textContent = detail.gallery.mainCaption
    }

    activateReveals()
  } catch (error) {
    console.error('物件詳細データの読み込みに失敗しました。', error)
    detailWrap.innerHTML = '<div style="grid-column:1/-1;padding:2rem;background:#fff;border:1px solid rgba(0,0,0,0.06);color:#555;">物件詳細データの読み込みに失敗しました。時間をおいて再度お試しください。</div>'
    relatedGrid.innerHTML = ''
  }
})

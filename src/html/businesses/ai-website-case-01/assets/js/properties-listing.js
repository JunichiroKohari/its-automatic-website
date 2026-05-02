document.addEventListener('DOMContentLoaded', async () => {
  const propGrid = document.getElementById('propGrid')
  const pagination = document.getElementById('pagination')
  const resultCount = document.querySelector('.result-count strong')
  const sortSelect = document.querySelector('.sort-select')
  const gridButton = document.getElementById('gridBtn')
  const listButton = document.getElementById('listBtn')
  const priceMinInput = document.getElementById('priceMinInput')
  const priceMaxInput = document.getElementById('priceMaxInput')
  const filterClearButton = document.querySelector('.filter-clear')
  const checkboxFilters = Array.from(document.querySelectorAll('[data-filter-flag]'))
  const revealables = Array.from(document.querySelectorAll('.reveal'))
  const numberFormatter = new Intl.NumberFormat('ja-JP')
  const badgeClassMap = {
    新着: 'badge-new',
    おすすめ: 'badge-rec',
    成約済: 'badge-sold',
  }

  if (!propGrid || !pagination) {
    return
  }

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

  const getPrefecture = (location) => {
    const match = String(location ?? '').match(/^(東京都|北海道|京都府|大阪府|.{2,3}県)/)
    return match ? match[1] : ''
  }

  const parseWalkMinutes = (access) => {
    const match = String(access ?? '').match(/徒歩(\d+)分/)
    return match ? Number(match[1]) : null
  }

  const getLayoutInfo = (specs) => {
    const layoutLabel = String(Array.isArray(specs) ? specs[0] ?? '' : specs ?? '')
    const roomCountMatch = layoutLabel.match(/^(\d+)/)
    const roomCount = roomCountMatch ? Number(roomCountMatch[1]) : null

    return {
      label: layoutLabel,
      roomCount,
      hasLDK: /LDK/.test(layoutLabel),
      smallLayout: /^(1R|1K|1DK)$/.test(layoutLabel),
    }
  }

  const includesKeyword = (text, patterns) => patterns.some((pattern) => pattern.test(text))

  const createCardMarkup = (property, index) => {
    const animationDelay = `${((index + 1) * 0.05).toFixed(2)}s`
    const badges = property.badges.map((badge) => (
      `<span class="prop-badge ${badgeClassMap[badge] || ''}">${badge}</span>`
    )).join('')
    const specs = property.specs.map((spec) => (
      `<span class="prop-spec">${spec}</span>`
    )).join('')

    return `
      <div class="prop-card" style="animation-delay:${animationDelay}">
        <div class="prop-img" style="background:${property.background}">
          ${badges ? `<div class="prop-badges">${badges}</div>` : ''}
          <button class="prop-fav" type="button" aria-pressed="false" aria-label="${property.title}をお気に入りに追加" onclick="toggleFav(this)">
            <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          </button>
          <div class="prop-img-inner">
            ${getCategoryIcon(property.category)}
            <p>${property.category}</p>
          </div>
        </div>
        <div class="prop-body">
          <div class="prop-location"><svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>${property.location} / ${property.access}</div>
          <div class="prop-title">${property.title}</div>
          <div class="prop-price">${numberFormatter.format(property.price)}<span>万円</span></div>
          <div class="prop-specs">${specs}</div>
          <div class="prop-actions">
            <a href="${buildDetailUrl(property)}" class="prop-btn-main">詳細を見る</a>
            <button class="prop-btn-sub" type="button">資料請求</button>
          </div>
        </div>
      </div>
    `
  }

  try {
    const [propertiesResponse, detailResponse] = await Promise.all([
      fetch('assets/data/properties.json'),
      fetch('assets/data/property-details.json').catch(() => null),
    ])

    if (!propertiesResponse.ok) {
      throw new Error(`properties.json: ${propertiesResponse.status}`)
    }

    const propertyData = await propertiesResponse.json()
    const detailData = detailResponse && detailResponse.ok ? await detailResponse.json() : []
    const detailsById = new Map(detailData.map((detail) => [detail.id, detail]))

    const state = {
      currentPage: 1,
      pageSize: 6,
      sortKey: 'newest',
      viewMode: 'grid',
      filters: {
        area: '',
        category: '',
        sidebarLayout: '',
        priceMin: '',
        priceMax: '',
        flags: {
          walk10: false,
          age10: false,
          parking: false,
          southFacing: false,
          corner: false,
          renovated: false,
        },
      },
      properties: propertyData.map((property, index) => {
        const detail = detailsById.get(property.id)
        const searchableText = [
          property.title,
          property.location,
          property.access,
          ...(property.specs || []),
          ...(detail?.features || []),
          ...(detail?.description || []),
          ...((detail?.detailRows || []).flat()),
          ...((detail?.nearbyRows || []).flat()),
        ].join(' ')

        return {
          ...property,
          listedOrder: index,
          prefecture: getPrefecture(property.location),
          walkMinutes: parseWalkMinutes(property.access),
          layoutInfo: getLayoutInfo(property.specs),
          hasParking: includesKeyword(searchableText, [/駐車/]),
          isSouthFacing: includesKeyword(searchableText, [/南向き/]),
          isCorner: includesKeyword(searchableText, [/(角地|角住戸|角部屋)/]),
          isRenovated: includesKeyword(searchableText, [/(リノベ|リフォーム)/]),
        }
      }),
    }

    const normalizeNumericFilter = (value) => {
      if (value === '' || value == null) {
        return ''
      }

      const normalized = Number(value)
      return Number.isFinite(normalized) && normalized >= 0 ? normalized : ''
    }

    const syncFilterControls = () => {
      if (priceMinInput) {
        priceMinInput.value = state.filters.priceMin === '' ? '' : String(state.filters.priceMin)
      }

      if (priceMaxInput) {
        priceMaxInput.value = state.filters.priceMax === '' ? '' : String(state.filters.priceMax)
      }

      checkboxFilters.forEach((input) => {
        input.checked = Boolean(state.filters.flags[input.dataset.filterFlag])
      })

      document.querySelectorAll('[data-filter-group]').forEach((chip) => {
        const group = chip.dataset.filterGroup
        const value = chip.dataset.filterValue || ''
        const isActive = (
          (group === 'category' && value === state.filters.category) ||
          (group === 'area' && value === state.filters.area) ||
          (group === 'sidebar-layout' && value === state.filters.sidebarLayout)
        )

        chip.classList.toggle('active', isActive)
      })

      if (!state.filters.category) {
        const allCategoryChip = document.querySelector('[data-filter-group="category"][data-filter-value=""]')
        allCategoryChip?.classList.add('active')
      }
    }

    const matchesSidebarLayout = (property) => {
      const { layoutInfo } = property

      if (!state.filters.sidebarLayout) {
        return true
      }

      if (!layoutInfo.label || property.category === '土地') {
        return false
      }

      if (state.filters.sidebarLayout === 'under-1ldk') {
        if (layoutInfo.smallLayout) {
          return true
        }

        return layoutInfo.hasLDK && layoutInfo.roomCount != null && layoutInfo.roomCount <= 1
      }

      if (state.filters.sidebarLayout === '2ldk') {
        return layoutInfo.hasLDK && layoutInfo.roomCount === 2
      }

      if (state.filters.sidebarLayout === '3ldk') {
        return layoutInfo.hasLDK && layoutInfo.roomCount === 3
      }

      if (state.filters.sidebarLayout === '4ldk-plus') {
        return layoutInfo.hasLDK && layoutInfo.roomCount != null && layoutInfo.roomCount >= 4
      }

      return true
    }

    const getFilteredProperties = () => {
      const rawMin = normalizeNumericFilter(state.filters.priceMin)
      const rawMax = normalizeNumericFilter(state.filters.priceMax)
      const priceMin = rawMin !== '' && rawMax !== '' ? Math.min(rawMin, rawMax) : rawMin
      const priceMax = rawMin !== '' && rawMax !== '' ? Math.max(rawMin, rawMax) : rawMax

      return state.properties.filter((property) => {
        if (state.filters.area && property.prefecture !== state.filters.area) {
          return false
        }

        if (state.filters.category && property.category !== state.filters.category) {
          return false
        }

        if (!matchesSidebarLayout(property)) {
          return false
        }

        if (priceMin !== '' && property.price < priceMin) {
          return false
        }

        if (priceMax !== '' && property.price > priceMax) {
          return false
        }

        if (state.filters.flags.walk10 && (property.walkMinutes == null || property.walkMinutes > 10)) {
          return false
        }

        if (state.filters.flags.age10 && property.category !== '土地' && (typeof property.buildingAge !== 'number' || property.buildingAge > 10)) {
          return false
        }

        if (state.filters.flags.parking && !property.hasParking) {
          return false
        }

        if (state.filters.flags.southFacing && !property.isSouthFacing) {
          return false
        }

        if (state.filters.flags.corner && !property.isCorner) {
          return false
        }

        if (state.filters.flags.renovated && !property.isRenovated) {
          return false
        }

        return true
      })
    }

    const getSortedProperties = () => {
      const sortedProperties = [...getFilteredProperties()]

      sortedProperties.sort((left, right) => {
        if (state.sortKey === 'price-asc') {
          return left.price - right.price
        }

        if (state.sortKey === 'price-desc') {
          return right.price - left.price
        }

        if (state.sortKey === 'area-desc') {
          return right.sortAreaSqm - left.sortAreaSqm
        }

        if (state.sortKey === 'age-asc') {
          const leftAge = typeof left.buildingAge === 'number' ? left.buildingAge : Number.POSITIVE_INFINITY
          const rightAge = typeof right.buildingAge === 'number' ? right.buildingAge : Number.POSITIVE_INFINITY
          return leftAge - rightAge
        }

        return left.listedOrder - right.listedOrder
      })

      return sortedProperties
    }

    const setView = (mode) => {
      state.viewMode = mode === 'list' ? 'list' : 'grid'

      propGrid.classList.toggle('list-view', state.viewMode === 'list')

      if (gridButton && listButton) {
        gridButton.classList.toggle('active', state.viewMode === 'grid')
        listButton.classList.toggle('active', state.viewMode === 'list')
      }
    }

    const toggleChip = (element) => {
      if (!element || !element.dataset.filterGroup) {
        return
      }

      const { filterGroup, filterValue = '' } = element.dataset
      const isCurrentlyActive = element.classList.contains('active')

      if (filterGroup === 'category') {
        state.filters.category = isCurrentlyActive && filterValue !== '' ? '' : filterValue
      }

      if (filterGroup === 'area') {
        state.filters.area = isCurrentlyActive ? '' : filterValue
      }

      if (filterGroup === 'sidebar-layout') {
        state.filters.sidebarLayout = isCurrentlyActive ? '' : filterValue
      }

      state.currentPage = 1
      syncFilterControls()
      render()
    }

    const toggleFav = (button) => {
      if (!button) {
        return
      }

      const isActive = button.classList.toggle('active')
      button.setAttribute('aria-pressed', String(isActive))
    }

    const renderPagination = (totalPages) => {
      if (totalPages <= 1) {
        pagination.hidden = true
        pagination.innerHTML = ''
        return
      }

      pagination.hidden = false

      const pageButtons = Array.from({ length: totalPages }, (_, index) => {
        const pageNumber = index + 1
        const activeClass = pageNumber === state.currentPage ? ' active' : ''

        return `<button class="page-btn${activeClass}" type="button" data-page="${pageNumber}">${pageNumber}</button>`
      }).join('')

      pagination.innerHTML = `
        <button class="page-btn arrow" type="button" data-page="${state.currentPage - 1}" ${state.currentPage === 1 ? 'disabled' : ''}>← 前へ</button>
        ${pageButtons}
        <button class="page-btn arrow" type="button" data-page="${state.currentPage + 1}" ${state.currentPage === totalPages ? 'disabled' : ''}>次へ →</button>
      `

      pagination.querySelectorAll('[data-page]').forEach((button) => {
        button.addEventListener('click', () => {
          const targetPage = Number(button.dataset.page)

          if (!Number.isInteger(targetPage) || targetPage < 1 || targetPage > totalPages) {
            return
          }

          state.currentPage = targetPage
          render()
          window.scrollTo({ top: 0, behavior: 'smooth' })
        })
      })
    }

    const render = () => {
      const sortedProperties = getSortedProperties()
      const totalPages = Math.ceil(sortedProperties.length / state.pageSize)
      const safeCurrentPage = totalPages > 0 ? Math.min(state.currentPage, totalPages) : 1
      const startIndex = (safeCurrentPage - 1) * state.pageSize
      const pageItems = sortedProperties.slice(startIndex, startIndex + state.pageSize)

      state.currentPage = safeCurrentPage

      if (resultCount) {
        resultCount.textContent = numberFormatter.format(sortedProperties.length)
      }

      if (pageItems.length === 0) {
        propGrid.innerHTML = '<div style="grid-column:1/-1;padding:2.4rem 2rem;background:#fff;border:1px solid rgba(0,0,0,0.06);border-radius:4px;color:#555;line-height:1.8;">該当する物件は見つかりませんでした。検索条件を変更して再度お試しください。</div>'
      } else {
        propGrid.innerHTML = pageItems.map((property, index) => (
          createCardMarkup(property, index)
        )).join('')
      }

      setView(state.viewMode)
      renderPagination(totalPages)
    }

    const setupRevealAnimations = () => {
      if (!('IntersectionObserver' in window)) {
        revealables.forEach((element) => element.classList.add('visible'))
        return
      }

      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return
          }

          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        })
      }, {
        threshold: 0.1,
      })

      revealables.forEach((element) => {
        revealObserver.observe(element)
      })
    }

    const resetFilters = () => {
      state.filters = {
        area: '',
        category: '',
        sidebarLayout: '',
        priceMin: '',
        priceMax: '',
        flags: {
          walk10: false,
          age10: false,
          parking: false,
          southFacing: false,
          corner: false,
          renovated: false,
        },
      }

      state.currentPage = 1
      syncFilterControls()
      render()
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        state.sortKey = sortSelect.value || 'newest'
        state.currentPage = 1
        render()
      })
    }

    priceMinInput?.addEventListener('input', () => {
      state.filters.priceMin = normalizeNumericFilter(priceMinInput.value)
      state.currentPage = 1
      render()
    })

    priceMaxInput?.addEventListener('input', () => {
      state.filters.priceMax = normalizeNumericFilter(priceMaxInput.value)
      state.currentPage = 1
      render()
    })

    checkboxFilters.forEach((input) => {
      input.addEventListener('change', () => {
        state.filters.flags[input.dataset.filterFlag] = input.checked
        state.currentPage = 1
        render()
      })
    })

    filterClearButton?.addEventListener('click', resetFilters)

    window.setView = setView
    window.toggleChip = toggleChip
    window.toggleFav = toggleFav

    syncFilterControls()
    setView('grid')
    render()
    setupRevealAnimations()
  } catch (error) {
    console.error('物件一覧データの読み込みに失敗しました。', error)
    propGrid.innerHTML = '<p style="grid-column:1/-1;padding:2rem;background:#fff;border:1px solid rgba(0,0,0,0.06);color:#555;">物件データの読み込みに失敗しました。時間をおいて再度お試しください。</p>'
    pagination.hidden = true
  }
})

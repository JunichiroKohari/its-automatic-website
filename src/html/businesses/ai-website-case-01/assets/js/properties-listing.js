document.addEventListener('DOMContentLoaded', async () => {
  const propGrid = document.getElementById('propGrid');
  const pagination = document.getElementById('pagination');
  const resultCount = document.querySelector('.result-count strong');
  const sortSelect = document.querySelector('.sort-select');
  const gridButton = document.getElementById('gridBtn');
  const listButton = document.getElementById('listBtn');
  const keywordInput = document.getElementById('keywordInput');
  const priceMinInput = document.getElementById('priceMinInput');
  const priceMaxInput = document.getElementById('priceMaxInput');
  const areaMinInput = document.getElementById('areaMinInput');
  const areaMaxInput = document.getElementById('areaMaxInput');
  const walkMaxSelect = document.getElementById('walkMaxSelect');
  const filterClearButton = document.querySelector('.filter-clear');
  const activeFilterBar = document.getElementById('activeFilterBar');
  const activeFilterChips = document.getElementById('activeFilterChips');
  const checkboxFilters = Array.from(document.querySelectorAll('[data-filter-flag]'));
  const revealables = Array.from(document.querySelectorAll('.reveal'));
  const numberFormatter = new Intl.NumberFormat('ja-JP');
  const badgeClassMap = {
    新着: 'badge-new',
    おすすめ: 'badge-rec',
    成約済: 'badge-sold',
  };
  const layoutFilterLabelMap = {
    'under-1ldk': '1LDK以下',
    '2ldk': '2LDK',
    '3ldk': '3LDK',
    '4ldk-plus': '4LDK以上',
  };
  const flagFilterLabelMap = {
    newArrival: '新着',
    recommended: 'おすすめ',
    age10: '築10年以内',
    parking: '駐車場あり',
    southFacing: '南向き',
    corner: '角部屋・角地',
    renovated: 'リフォーム済み',
  };

  if (!propGrid || !pagination) {
    return;
  }

  const buildDetailUrl = (property) => {
    const separator = property.detailUrl.includes('?') ? '&' : '?';
    return `${property.detailUrl}${separator}id=${encodeURIComponent(property.id)}`;
  };

  const getCategoryIcon = (category) => {
    if (category === 'マンション') {
      return '<svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>';
    }

    if (category === '土地') {
      return '<svg viewBox="0 0 24 24"><polygon points="3 11 12 2 21 11 21 21 15 21 15 15 9 15 9 21 3 21"/></svg>';
    }

    return '<svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>';
  };

  const getPrefecture = (location) => {
    const match = String(location ?? '').match(/^(東京都|北海道|京都府|大阪府|.{2,3}県)/);
    return match ? match[1] : '';
  };

  const parseWalkMinutes = (access) => {
    const match = String(access ?? '').match(/徒歩(\d+)分/);
    return match ? Number(match[1]) : null;
  };

  const getLayoutInfo = (specs) => {
    const layoutLabel = String(Array.isArray(specs) ? specs[0] ?? '' : specs ?? '');
    const roomCountMatch = layoutLabel.match(/^(\d+)/);
    const roomCount = roomCountMatch ? Number(roomCountMatch[1]) : null;

    return {
      label: layoutLabel,
      roomCount,
      hasLDK: /LDK/.test(layoutLabel),
      smallLayout: /^(1R|1K|1DK)$/.test(layoutLabel),
    };
  };

  const includesKeyword = (text, patterns) => patterns.some((pattern) => pattern.test(text));

  const normalizeSearchText = (value) => String(value ?? '')
    .normalize('NFKC')
    .toLocaleLowerCase('ja-JP');

  const tokenizeKeyword = (value) => normalizeSearchText(value)
    .split(/[\s\u3000]+/)
    .filter(Boolean);

  const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const compareNumbersMissingLast = (leftValue, rightValue, direction = 'asc') => {
    const leftMissing = typeof leftValue !== 'number' || Number.isNaN(leftValue);
    const rightMissing = typeof rightValue !== 'number' || Number.isNaN(rightValue);

    if (leftMissing && rightMissing) {
      return 0;
    }

    if (leftMissing) {
      return 1;
    }

    if (rightMissing) {
      return -1;
    }

    return direction === 'desc' ? rightValue - leftValue : leftValue - rightValue;
  };

  const createCardMarkup = (property, index) => {
    const animationDelay = `${((index + 1) * 0.05).toFixed(2)}s`;
    const badges = property.badges.map((badge) => (
      `<span class="prop-badge ${badgeClassMap[badge] || ''}">${badge}</span>`
    )).join('');
    const specs = property.specs.map((spec) => (
      `<span class="prop-spec">${spec}</span>`
    )).join('');

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
    `;
  };

  try {
    const [propertiesResponse, detailResponse] = await Promise.all([
      fetch('assets/data/properties.json'),
      fetch('assets/data/property-details.json').catch(() => null),
    ]);

    if (!propertiesResponse.ok) {
      throw new Error(`properties.json: ${propertiesResponse.status}`);
    }

    const propertyData = await propertiesResponse.json();
    const detailData = detailResponse && detailResponse.ok ? await detailResponse.json() : [];
    const detailsById = new Map(detailData.map((detail) => [detail.id, detail]));
    const createDefaultFilters = () => ({
      keyword: '',
      area: '',
      category: '',
      sidebarLayout: '',
      priceMin: '',
      priceMax: '',
      areaMin: '',
      areaMax: '',
      walkMax: '',
      flags: {
        newArrival: false,
        recommended: false,
        age10: false,
        parking: false,
        southFacing: false,
        corner: false,
        renovated: false,
      },
    });

    const state = {
      currentPage: 1,
      pageSize: 6,
      sortKey: 'newest',
      viewMode: 'grid',
      filters: createDefaultFilters(),
      properties: propertyData.map((property, index) => {
        const detail = detailsById.get(property.id);
        const searchableText = [
          property.id,
          property.title,
          property.category,
          property.location,
          property.access,
          ...(property.specs || []),
          ...(property.badges || []),
          detail?.address,
          ...(detail?.features || []),
          ...(detail?.description || []),
          ...((detail?.detailRows || []).flat()),
          ...((detail?.nearbyRows || []).flat()),
        ].join(' ');

        return {
          ...property,
          listedOrder: index,
          prefecture: getPrefecture(property.location),
          walkMinutes: parseWalkMinutes(property.access),
          layoutInfo: getLayoutInfo(property.specs),
          searchIndex: normalizeSearchText(searchableText),
          hasParking: includesKeyword(searchableText, [/駐車/]),
          isSouthFacing: includesKeyword(searchableText, [/南向き/]),
          isCorner: includesKeyword(searchableText, [/(角地|角住戸|角部屋)/]),
          isRenovated: includesKeyword(searchableText, [/(リノベ|リフォーム)/]),
        };
      }),
    };

    const normalizeNumericFilter = (value) => {
      if (value === '' || value == null) {
        return '';
      }

      const normalized = Number(value);
      return Number.isFinite(normalized) && normalized >= 0 ? normalized : '';
    };

    const getNormalizedRange = (minValue, maxValue) => {
      const rawMin = normalizeNumericFilter(minValue);
      const rawMax = normalizeNumericFilter(maxValue);

      return {
        min: rawMin !== '' && rawMax !== '' ? Math.min(rawMin, rawMax) : rawMin,
        max: rawMin !== '' && rawMax !== '' ? Math.max(rawMin, rawMax) : rawMax,
      };
    };

    const syncFilterControls = () => {
      if (keywordInput) {
        keywordInput.value = state.filters.keyword;
      }

      if (priceMinInput) {
        priceMinInput.value = state.filters.priceMin === '' ? '' : String(state.filters.priceMin);
      }

      if (priceMaxInput) {
        priceMaxInput.value = state.filters.priceMax === '' ? '' : String(state.filters.priceMax);
      }

      if (areaMinInput) {
        areaMinInput.value = state.filters.areaMin === '' ? '' : String(state.filters.areaMin);
      }

      if (areaMaxInput) {
        areaMaxInput.value = state.filters.areaMax === '' ? '' : String(state.filters.areaMax);
      }

      if (walkMaxSelect) {
        walkMaxSelect.value = state.filters.walkMax === '' ? '' : String(state.filters.walkMax);
      }

      if (sortSelect) {
        sortSelect.value = state.sortKey;
      }

      checkboxFilters.forEach((input) => {
        input.checked = Boolean(state.filters.flags[input.dataset.filterFlag]);
      });

      document.querySelectorAll('[data-filter-group]').forEach((chip) => {
        const group = chip.dataset.filterGroup;
        const value = chip.dataset.filterValue || '';
        const isActive = (
          (group === 'category' && value === state.filters.category)
          || (group === 'area' && value === state.filters.area)
          || (group === 'sidebar-layout' && value === state.filters.sidebarLayout)
        );

        chip.classList.toggle('active', isActive);
      });

      if (!state.filters.category) {
        const allCategoryChip = document.querySelector('[data-filter-group="category"][data-filter-value=""]');
        allCategoryChip?.classList.add('active');
      }
    };

    const matchesSidebarLayout = (property) => {
      const { layoutInfo } = property;

      if (!state.filters.sidebarLayout) {
        return true;
      }

      if (!layoutInfo.label || property.category === '土地') {
        return false;
      }

      if (state.filters.sidebarLayout === 'under-1ldk') {
        if (layoutInfo.smallLayout) {
          return true;
        }

        return layoutInfo.hasLDK && layoutInfo.roomCount != null && layoutInfo.roomCount <= 1;
      }

      if (state.filters.sidebarLayout === '2ldk') {
        return layoutInfo.hasLDK && layoutInfo.roomCount === 2;
      }

      if (state.filters.sidebarLayout === '3ldk') {
        return layoutInfo.hasLDK && layoutInfo.roomCount === 3;
      }

      if (state.filters.sidebarLayout === '4ldk-plus') {
        return layoutInfo.hasLDK && layoutInfo.roomCount != null && layoutInfo.roomCount >= 4;
      }

      return true;
    };

    const createRangeLabel = (label, minValue, maxValue, unit) => {
      if (minValue !== '' && maxValue !== '') {
        return `${label}: ${numberFormatter.format(minValue)}${unit}〜${numberFormatter.format(maxValue)}${unit}`;
      }

      if (minValue !== '') {
        return `${label}: ${numberFormatter.format(minValue)}${unit}以上`;
      }

      if (maxValue !== '') {
        return `${label}: ${numberFormatter.format(maxValue)}${unit}以下`;
      }

      return '';
    };

    const getActiveFilterItems = () => {
      const items = [];
      const priceRange = getNormalizedRange(state.filters.priceMin, state.filters.priceMax);
      const areaRange = getNormalizedRange(state.filters.areaMin, state.filters.areaMax);

      if (state.filters.keyword.trim()) {
        items.push({ key: 'keyword', label: `キーワード: ${state.filters.keyword.trim()}` });
      }

      if (state.filters.category) {
        items.push({ key: 'category', label: `種別: ${state.filters.category}` });
      }

      if (state.filters.area) {
        items.push({ key: 'area', label: `エリア: ${state.filters.area}` });
      }

      if (state.filters.sidebarLayout) {
        items.push({
          key: 'sidebarLayout',
          label: `間取り: ${layoutFilterLabelMap[state.filters.sidebarLayout] || state.filters.sidebarLayout}`,
        });
      }

      const priceLabel = createRangeLabel('価格', priceRange.min, priceRange.max, '万円');
      if (priceLabel) {
        items.push({ key: 'price', label: priceLabel });
      }

      const areaLabel = createRangeLabel('面積', areaRange.min, areaRange.max, '㎡');
      if (areaLabel) {
        items.push({ key: 'areaSize', label: areaLabel });
      }

      if (state.filters.walkMax !== '') {
        items.push({ key: 'walkMax', label: `駅徒歩: ${numberFormatter.format(state.filters.walkMax)}分以内` });
      }

      Object.entries(state.filters.flags).forEach(([key, isActive]) => {
        if (!isActive) {
          return;
        }

        items.push({ key: `flag:${key}`, label: flagFilterLabelMap[key] || key });
      });

      return items;
    };

    const clearFilter = (key) => {
      if (key === 'keyword') {
        state.filters.keyword = '';
      } else if (key === 'category') {
        state.filters.category = '';
      } else if (key === 'area') {
        state.filters.area = '';
      } else if (key === 'sidebarLayout') {
        state.filters.sidebarLayout = '';
      } else if (key === 'price') {
        state.filters.priceMin = '';
        state.filters.priceMax = '';
      } else if (key === 'areaSize') {
        state.filters.areaMin = '';
        state.filters.areaMax = '';
      } else if (key === 'walkMax') {
        state.filters.walkMax = '';
      } else if (key.startsWith('flag:')) {
        const flagKey = key.replace('flag:', '');
        state.filters.flags[flagKey] = false;
      }

      state.currentPage = 1;
      syncFilterControls();
      render();
    };

    const renderActiveFilters = () => {
      if (!activeFilterBar || !activeFilterChips) {
        return;
      }

      const items = getActiveFilterItems();
      activeFilterBar.hidden = items.length === 0;

      if (items.length === 0) {
        activeFilterChips.innerHTML = '';
        return;
      }

      activeFilterChips.innerHTML = items.map((item) => (
        `<button class="active-filter-chip" type="button" data-filter-remove="${escapeHtml(item.key)}">${escapeHtml(item.label)}<span aria-hidden="true">×</span></button>`
      )).join('');

      activeFilterChips.querySelectorAll('[data-filter-remove]').forEach((button) => {
        button.addEventListener('click', () => {
          clearFilter(button.dataset.filterRemove || '');
        });
      });
    };

    const getFilteredProperties = () => {
      const keywordTokens = tokenizeKeyword(state.filters.keyword);
      const priceRange = getNormalizedRange(state.filters.priceMin, state.filters.priceMax);
      const areaRange = getNormalizedRange(state.filters.areaMin, state.filters.areaMax);
      const walkMax = normalizeNumericFilter(state.filters.walkMax);

      return state.properties.filter((property) => {
        if (keywordTokens.length > 0 && !keywordTokens.every((token) => property.searchIndex.includes(token))) {
          return false;
        }

        if (state.filters.area && property.prefecture !== state.filters.area) {
          return false;
        }

        if (state.filters.category && property.category !== state.filters.category) {
          return false;
        }

        if (!matchesSidebarLayout(property)) {
          return false;
        }

        if (priceRange.min !== '' && property.price < priceRange.min) {
          return false;
        }

        if (priceRange.max !== '' && property.price > priceRange.max) {
          return false;
        }

        if (areaRange.min !== '' && property.sortAreaSqm < areaRange.min) {
          return false;
        }

        if (areaRange.max !== '' && property.sortAreaSqm > areaRange.max) {
          return false;
        }

        if (walkMax !== '' && (property.walkMinutes == null || property.walkMinutes > walkMax)) {
          return false;
        }

        if (state.filters.flags.newArrival && !(property.badges || []).includes('新着')) {
          return false;
        }

        if (state.filters.flags.recommended && !(property.badges || []).includes('おすすめ')) {
          return false;
        }

        if (state.filters.flags.age10 && property.category !== '土地' && (typeof property.buildingAge !== 'number' || property.buildingAge > 10)) {
          return false;
        }

        if (state.filters.flags.parking && !property.hasParking) {
          return false;
        }

        if (state.filters.flags.southFacing && !property.isSouthFacing) {
          return false;
        }

        if (state.filters.flags.corner && !property.isCorner) {
          return false;
        }

        if (state.filters.flags.renovated && !property.isRenovated) {
          return false;
        }

        return true;
      });
    };

    const getSortedProperties = () => {
      const sortedProperties = [...getFilteredProperties()];

      sortedProperties.sort((left, right) => {
        if (state.sortKey === 'price-asc') {
          return compareNumbersMissingLast(left.price, right.price, 'asc') || left.listedOrder - right.listedOrder;
        }

        if (state.sortKey === 'price-desc') {
          return compareNumbersMissingLast(left.price, right.price, 'desc') || left.listedOrder - right.listedOrder;
        }

        if (state.sortKey === 'area-desc') {
          return compareNumbersMissingLast(left.sortAreaSqm, right.sortAreaSqm, 'desc') || left.listedOrder - right.listedOrder;
        }

        if (state.sortKey === 'area-asc') {
          return compareNumbersMissingLast(left.sortAreaSqm, right.sortAreaSqm, 'asc') || left.listedOrder - right.listedOrder;
        }

        if (state.sortKey === 'walk-asc') {
          return compareNumbersMissingLast(left.walkMinutes, right.walkMinutes, 'asc') || left.listedOrder - right.listedOrder;
        }

        if (state.sortKey === 'age-asc') {
          return compareNumbersMissingLast(left.buildingAge, right.buildingAge, 'asc') || left.listedOrder - right.listedOrder;
        }

        if (state.sortKey === 'age-desc') {
          return compareNumbersMissingLast(left.buildingAge, right.buildingAge, 'desc') || left.listedOrder - right.listedOrder;
        }

        if (state.sortKey === 'recommended') {
          const leftRecommended = (left.badges || []).includes('おすすめ') ? 1 : 0;
          const rightRecommended = (right.badges || []).includes('おすすめ') ? 1 : 0;

          return rightRecommended - leftRecommended || left.listedOrder - right.listedOrder;
        }

        return left.listedOrder - right.listedOrder;
      });

      return sortedProperties;
    };

    const setView = (mode) => {
      state.viewMode = mode === 'list' ? 'list' : 'grid';

      propGrid.classList.toggle('list-view', state.viewMode === 'list');

      if (gridButton && listButton) {
        gridButton.classList.toggle('active', state.viewMode === 'grid');
        listButton.classList.toggle('active', state.viewMode === 'list');
      }
    };

    const toggleChip = (element) => {
      if (!element || !element.dataset.filterGroup) {
        return;
      }

      const { filterGroup, filterValue = '' } = element.dataset;
      const isCurrentlyActive = element.classList.contains('active');

      if (filterGroup === 'category') {
        state.filters.category = isCurrentlyActive && filterValue !== '' ? '' : filterValue;
      }

      if (filterGroup === 'area') {
        state.filters.area = isCurrentlyActive ? '' : filterValue;
      }

      if (filterGroup === 'sidebar-layout') {
        state.filters.sidebarLayout = isCurrentlyActive ? '' : filterValue;
      }

      state.currentPage = 1;
      syncFilterControls();
      render();
    };

    const toggleFav = (button) => {
      if (!button) {
        return;
      }

      const isActive = button.classList.toggle('active');
      button.setAttribute('aria-pressed', String(isActive));
    };

    const renderPagination = (totalPages) => {
      if (totalPages <= 1) {
        pagination.hidden = true;
        pagination.innerHTML = '';
        return;
      }

      pagination.hidden = false;

      const pageButtons = Array.from({ length: totalPages }, (_, index) => {
        const pageNumber = index + 1;
        const activeClass = pageNumber === state.currentPage ? ' active' : '';

        return `<button class="page-btn${activeClass}" type="button" data-page="${pageNumber}">${pageNumber}</button>`;
      }).join('');

      pagination.innerHTML = `
        <button class="page-btn arrow" type="button" data-page="${state.currentPage - 1}" ${state.currentPage === 1 ? 'disabled' : ''}>← 前へ</button>
        ${pageButtons}
        <button class="page-btn arrow" type="button" data-page="${state.currentPage + 1}" ${state.currentPage === totalPages ? 'disabled' : ''}>次へ →</button>
      `;

      pagination.querySelectorAll('[data-page]').forEach((button) => {
        button.addEventListener('click', () => {
          const targetPage = Number(button.dataset.page);

          if (!Number.isInteger(targetPage) || targetPage < 1 || targetPage > totalPages) {
            return;
          }

          state.currentPage = targetPage;
          render();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      });
    };

    const render = () => {
      const sortedProperties = getSortedProperties();
      const totalPages = Math.ceil(sortedProperties.length / state.pageSize);
      const safeCurrentPage = totalPages > 0 ? Math.min(state.currentPage, totalPages) : 1;
      const startIndex = (safeCurrentPage - 1) * state.pageSize;
      const pageItems = sortedProperties.slice(startIndex, startIndex + state.pageSize);

      state.currentPage = safeCurrentPage;

      if (resultCount) {
        resultCount.textContent = numberFormatter.format(sortedProperties.length);
      }

      renderActiveFilters();

      if (pageItems.length === 0) {
        propGrid.innerHTML = `
          <div class="empty-state">
            <p>該当する物件は見つかりませんでした。</p>
            <button class="empty-reset" type="button">条件をリセット</button>
          </div>
        `;
        propGrid.querySelector('.empty-reset')?.addEventListener('click', resetFilters);
      } else {
        propGrid.innerHTML = pageItems.map((property, index) => (
          createCardMarkup(property, index)
        )).join('');
      }

      setView(state.viewMode);
      renderPagination(totalPages);
    };

    const setupRevealAnimations = () => {
      if (!('IntersectionObserver' in window)) {
        revealables.forEach((element) => element.classList.add('visible'));
        return;
      }

      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        });
      }, {
        threshold: 0.1,
      });

      revealables.forEach((element) => {
        revealObserver.observe(element);
      });
    };

    const resetFilters = () => {
      state.filters = createDefaultFilters();

      state.currentPage = 1;
      syncFilterControls();
      render();
    };

    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        state.sortKey = sortSelect.value || 'newest';
        state.currentPage = 1;
        render();
      });
    }

    keywordInput?.addEventListener('input', () => {
      state.filters.keyword = keywordInput.value;
      state.currentPage = 1;
      render();
    });

    priceMinInput?.addEventListener('input', () => {
      state.filters.priceMin = normalizeNumericFilter(priceMinInput.value);
      state.currentPage = 1;
      render();
    });

    priceMaxInput?.addEventListener('input', () => {
      state.filters.priceMax = normalizeNumericFilter(priceMaxInput.value);
      state.currentPage = 1;
      render();
    });

    areaMinInput?.addEventListener('input', () => {
      state.filters.areaMin = normalizeNumericFilter(areaMinInput.value);
      state.currentPage = 1;
      render();
    });

    areaMaxInput?.addEventListener('input', () => {
      state.filters.areaMax = normalizeNumericFilter(areaMaxInput.value);
      state.currentPage = 1;
      render();
    });

    walkMaxSelect?.addEventListener('change', () => {
      state.filters.walkMax = normalizeNumericFilter(walkMaxSelect.value);
      state.currentPage = 1;
      render();
    });

    checkboxFilters.forEach((input) => {
      input.addEventListener('change', () => {
        state.filters.flags[input.dataset.filterFlag] = input.checked;
        state.currentPage = 1;
        render();
      });
    });

    filterClearButton?.addEventListener('click', resetFilters);

    window.setView = setView;
    window.toggleChip = toggleChip;
    window.toggleFav = toggleFav;

    syncFilterControls();
    setView('grid');
    render();
    setupRevealAnimations();
  } catch (error) {
    console.error('物件一覧データの読み込みに失敗しました。', error);
    propGrid.innerHTML = '<p style="grid-column:1/-1;padding:2rem;background:#fff;border:1px solid rgba(0,0,0,0.06);color:#555;">物件データの読み込みに失敗しました。時間をおいて再度お試しください。</p>';
    pagination.hidden = true;
  }
});

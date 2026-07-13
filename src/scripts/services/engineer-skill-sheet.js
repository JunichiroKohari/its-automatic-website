const contactMessageTemplate = [
  '面談依頼',
  '',
  '株式会社 It\'s Automatic ご担当者様',
  '',
  'スキルシートを拝見し、開発支援について面談をお願いしたくご連絡しました。',
  '以下の日程でご都合の良い時間帯がありましたら、ご調整いただけますと幸いです。',
  '',
  '【希望日時】',
  '・第1希望：',
  '・第2希望：',
  '・第3希望：',
  '',
  '【ご相談内容】',
  '・',
  '',
  '【面談形式】',
  '・オンライン面談を希望します。',
  '',
  'どうぞよろしくお願いいたします。',
].join('\n');

const contactUrl = new URL('index.html', window.location.href);
contactUrl.searchParams.set('contactMessage', contactMessageTemplate);
contactUrl.hash = 'contact';

// eslint-disable-next-line no-console
console.log(
  '%cご確認いただきありがとうございます！ご興味をお持ちいただけましたら、下記リンクより面談をご予約ください！%c\n%c%s',
  [
    'display: inline-block',
    'padding: 10px 14px',
    'border: 1px solid #1f2937',
    'border-radius: 6px',
    'background: #f8fafc',
    'color: #0f172a',
    'font-size: 13px',
    'font-weight: 600',
    'line-height: 1.6',
  ].join(';'),
  '',
  [
    'display: inline-block',
    'padding: 10px 14px',
    'border: 1px solid #1d4ed8',
    'border-radius: 6px',
    'background: #2563eb',
    'color: #ffffff',
    'font-size: 15px',
    'font-weight: 700',
    'letter-spacing: 0',
    'text-decoration: underline',
    'box-shadow: 0 2px 6px rgba(37, 99, 235, 0.24)',
  ].join(';'),
  contactUrl.href,
);

const setActive = (nodes, activeNode, activeClass) => {
  nodes.forEach((node) => node.classList.toggle(activeClass, node === activeNode));
};

const normalizeSearchText = (value = '') => value.toString().toLowerCase().replace(/\s+/g, ' ').trim();

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const getMonthIndex = (dateValue) => {
  const value = String(dateValue || '').padStart(8, '0');
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6));

  if (!year || !month) {
    return 0;
  }

  return year * 12 + month;
};

const getCurrentDateValue = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return Number(`${year}${month}${day}`);
};

const getEstimatedDurationMonths = (start, end, active, declaredDuration) => {
  if (declaredDuration > 0) {
    return declaredDuration;
  }

  if (!start) {
    return 0;
  }

  const startMonth = getMonthIndex(start);
  const endMonth = getMonthIndex(active || !end || end >= 99991231 ? getCurrentDateValue() : end);

  return Math.max(endMonth - startMonth + 1, 0);
};

document.addEventListener('DOMContentLoaded', () => {
  const page = document.querySelector('.skill-sheet-page');
  const sidebar = document.querySelector('[data-sidebar]');
  const sidebarToggle = document.querySelector('[data-sidebar-toggle]');
  const sidebarCloseButtons = Array.from(document.querySelectorAll('[data-sidebar-close]'));
  const pathLabel = document.querySelector('[data-path-label]');
  const tabButtons = Array.from(document.querySelectorAll('[data-tab-target]'));
  const panels = Array.from(document.querySelectorAll('[data-tab-panel]'));
  const skillFilterButtons = Array.from(document.querySelectorAll('[data-skill-filter]'));
  const skillCards = Array.from(document.querySelectorAll('[data-skill-card]'));
  const projectCards = Array.from(document.querySelectorAll('[data-project-card]'));
  const projectList = document.querySelector('[data-project-list]');
  const projectSearch = document.querySelector('[data-project-search]');
  const projectSearchSubmit = document.querySelector('[data-project-search-submit]');
  const industryFilter = document.querySelector('[data-project-industry]');
  const techFilter = document.querySelector('[data-project-tech]');
  const typeFilter = document.querySelector('[data-project-type]');
  const projectSort = document.querySelector('[data-project-sort]');
  const projectFilterReset = document.querySelector('[data-project-filter-reset]');
  const projectCount = document.querySelector('[data-project-count]');
  const projectSummary = document.querySelector('[data-project-summary]');
  const projectEmpty = document.querySelector('[data-project-empty]');
  const pdfExportButton = document.querySelector('[data-pdf-export]');
  const floatingChatPanel = document.querySelector('[data-floating-chat-panel]');
  const floatingChatLauncher = document.querySelector('[data-floating-chat-launcher]');
  const floatingChatLabel = document.querySelector('[data-floating-chat-label]');
  const floatingChatClose = document.querySelector('[data-floating-chat-close]');
  const floatingChatMessages = document.querySelector('[data-floating-chat-messages]');
  const floatingChatEmpty = document.querySelector('[data-floating-chat-empty]');
  const floatingChatInput = document.querySelector('[data-floating-chat-input]');
  const floatingChatSend = document.querySelector('[data-floating-chat-send]');
  const floatingChatClear = document.querySelector('[data-floating-chat-clear]');
  const floatingMessages = [];
  let pdfExportResetTimer = 0;
  const sidebarMediaQuery = window.matchMedia('(max-width: 1080px)');

  const isMobileSidebar = () => sidebarMediaQuery.matches;

  const setSidebarOpen = (open) => {
    const shouldOpen = Boolean(open && isMobileSidebar());

    if (page) {
      page.classList.toggle('is-sidebar-open', shouldOpen);
      page.style.overflow = shouldOpen ? 'hidden' : '';
    }

    if (sidebarToggle) {
      sidebarToggle.setAttribute('aria-expanded', String(shouldOpen));
      sidebarToggle.setAttribute('aria-label', shouldOpen ? 'メニューを閉じる' : 'メニューを開く');
    }

    if (!sidebar) {
      return;
    }

    sidebar.inert = isMobileSidebar() && !shouldOpen;

    if (isMobileSidebar()) {
      sidebar.setAttribute('aria-hidden', String(!shouldOpen));
      if (shouldOpen) {
        sidebar.querySelector('[data-sidebar-close]')?.focus();
      } else if (document.activeElement && sidebar.contains(document.activeElement)) {
        sidebarToggle?.focus();
      }
      return;
    }

    sidebar.removeAttribute('aria-hidden');
  };

  const syncSidebarMode = () => {
    setSidebarOpen(page?.classList.contains('is-sidebar-open'));
  };

  const projectItems = projectCards.map((card, fallbackIndex) => {
    const start = toNumber(card.getAttribute('data-project-start'));
    const end = toNumber(card.getAttribute('data-project-end'));
    const active = card.getAttribute('data-project-active') === 'true';
    const declaredDuration = toNumber(card.getAttribute('data-project-duration'));

    return {
      card,
      index: toNumber(card.getAttribute('data-project-index'), fallbackIndex),
      industry: card.getAttribute('data-project-industry') || '',
      tech: (card.getAttribute('data-project-tech') || '').split('|').filter(Boolean),
      type: card.getAttribute('data-project-type') || '',
      typeLabel: card.getAttribute('data-project-type-label') || '',
      active,
      start,
      end,
      duration: getEstimatedDurationMonths(start, end, active, declaredDuration),
      searchText: normalizeSearchText(card.getAttribute('data-project-search') || card.textContent),
    };
  });
  let projectSearchQuery = normalizeSearchText(projectSearch?.value || '');
  let projectSearchLabel = projectSearch?.value.trim() || '';

  const showPanel = (name) => {
    panels.forEach((panel) => {
      panel.toggleAttribute('hidden', panel.getAttribute('data-tab-panel') !== name);
    });

    const activeButton = tabButtons.find((button) => button.getAttribute('data-tab-target') === name);
    if (activeButton) {
      setActive(tabButtons, activeButton, 'is-active');
    }

    if (pathLabel) {
      pathLabel.textContent = {
        profile: 'profile.md',
        skills: 'skills.yaml',
        career: 'career.log',
      }[name] || 'profile.md';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (isMobileSidebar()) {
      setSidebarOpen(false);
    }
  };

  sidebarToggle?.addEventListener('click', () => {
    setSidebarOpen(!page?.classList.contains('is-sidebar-open'));
  });

  sidebarCloseButtons.forEach((button) => {
    button.addEventListener('click', () => setSidebarOpen(false));
  });

  if (sidebarMediaQuery.addEventListener) {
    sidebarMediaQuery.addEventListener('change', syncSidebarMode);
  } else {
    sidebarMediaQuery.addListener(syncSidebarMode);
  }

  syncSidebarMode();

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => showPanel(button.getAttribute('data-tab-target')));
  });

  skillFilterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-skill-filter');
      setActive(skillFilterButtons, button, 'is-active');
      skillCards.forEach((card) => {
        card.toggleAttribute('hidden', filter !== 'all' && card.getAttribute('data-skill-cat') !== filter);
        card.classList.remove('is-highlighted');
      });
    });
  });

  document.querySelectorAll('[data-highlight-skills]').forEach((button) => {
    button.addEventListener('click', () => {
      const related = button.getAttribute('data-highlight-skills').split('|');
      showPanel('skills');
      skillFilterButtons.find((item) => item.getAttribute('data-skill-filter') === 'all')?.click();

      requestAnimationFrame(() => {
        skillCards.forEach((card) => {
          card.classList.toggle('is-highlighted', related.includes(card.getAttribute('data-skill-name')));
        });
      });
    });
  });

  const getSelectedText = (select) => select?.selectedOptions?.[0]?.textContent || '';

  const projectSorters = {
    newest: (a, b) => b.start - a.start || b.end - a.end || a.index - b.index,
    oldest: (a, b) => a.start - b.start || a.end - b.end || a.index - b.index,
    'duration-desc': (a, b) => b.duration - a.duration || b.start - a.start || a.index - b.index,
    'duration-asc': (a, b) => a.duration - b.duration || b.start - a.start || a.index - b.index,
    'order-asc': (a, b) => a.index - b.index,
  };

  const updateProjectReset = () => {
    if (!projectFilterReset) {
      return;
    }

    const hasActiveFilter = Boolean(
      projectSearchQuery
      || projectSearch?.value.trim()
      || (industryFilter && industryFilter.value !== 'all')
      || (techFilter && techFilter.value !== 'all')
      || (typeFilter && typeFilter.value !== 'all')
      || (projectSort && projectSort.value !== 'newest'),
    );

    projectFilterReset.disabled = !hasActiveFilter;
  };

  const updateProjects = () => {
    const keywords = projectSearchQuery.split(/[\s,、]+/).filter(Boolean);
    const industry = industryFilter ? industryFilter.value : 'all';
    const tech = techFilter ? techFilter.value : 'all';
    const type = typeFilter ? typeFilter.value : 'all';
    const sort = projectSort?.value || 'newest';
    let visibleCount = 0;
    const activeFilterLabels = [];

    if (projectSearchQuery) {
      activeFilterLabels.push(`検索: ${projectSearchLabel}`);
    }

    if (industry !== 'all') {
      activeFilterLabels.push(`業種: ${getSelectedText(industryFilter)}`);
    }

    if (tech !== 'all') {
      activeFilterLabels.push(`技術: ${getSelectedText(techFilter)}`);
    }

    if (type !== 'all') {
      activeFilterLabels.push(`区分: ${getSelectedText(typeFilter)}`);
    }

    const sortedProjectItems = [...projectItems]
      .sort(projectSorters[sort] || projectSorters.newest);

    sortedProjectItems.forEach((projectItem) => {
      const keywordMatch = keywords.every((keyword) => projectItem.searchText.includes(keyword));
      const industryMatch = industry === 'all' || projectItem.industry === industry;
      const techMatch = tech === 'all' || projectItem.tech.includes(tech);
      const typeMatch = type === 'all' || projectItem.type === type;
      const visible = keywordMatch && industryMatch && techMatch && typeMatch;

      projectItem.card.toggleAttribute('hidden', !visible);
      if (visible) {
        visibleCount += 1;
      }

      projectList?.appendChild(projectItem.card);
    });

    if (projectCount) {
      projectCount.textContent = String(visibleCount);
    }

    if (projectSummary) {
      projectSummary.textContent = activeFilterLabels.length
        ? `${visibleCount}件に絞り込み（${activeFilterLabels.join(' / ')}）`
        : '全件表示中';
    }

    if (projectEmpty) {
      projectEmpty.hidden = visibleCount !== 0;
    }

    updateProjectReset();
  };

  const applyProjectSearch = () => {
    projectSearchQuery = normalizeSearchText(projectSearch?.value || '');
    projectSearchLabel = projectSearch?.value.trim() || '';
    updateProjects();
  };

  projectSearch?.addEventListener('input', updateProjectReset);

  projectSearch?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      applyProjectSearch();
    }
  });

  projectSearchSubmit?.addEventListener('click', applyProjectSearch);

  [industryFilter, techFilter, typeFilter, projectSort].forEach((filter) => {
    filter?.addEventListener('change', updateProjects);
  });

  projectFilterReset?.addEventListener('click', () => {
    if (projectSearch) {
      projectSearch.value = '';
    }

    projectSearchQuery = '';
    projectSearchLabel = '';

    if (industryFilter) {
      industryFilter.value = 'all';
    }

    if (techFilter) {
      techFilter.value = 'all';
    }

    if (typeFilter) {
      typeFilter.value = 'all';
    }

    if (projectSort) {
      projectSort.value = 'newest';
    }

    updateProjects();
    projectSearch?.focus();
  });

  document.querySelectorAll('[data-project-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('[data-project-card]');
      const detail = card?.querySelector('[data-project-detail]');
      const expanded = button.getAttribute('aria-expanded') === 'true';
      const label = button.querySelector('span');

      button.setAttribute('aria-expanded', String(!expanded));
      if (label) {
        label.textContent = expanded ? '詳細を見る' : '閉じる';
      }

      if (detail) {
        detail.hidden = expanded;
      }
    });
  });

  const setPdfExportMode = (enabled) => {
    if (page) {
      page.classList.toggle('is-pdf-exporting', enabled);
    }

    if (pdfExportButton) {
      pdfExportButton.disabled = enabled;
      pdfExportButton.setAttribute('aria-busy', String(enabled));
    }
  };

  const resetPdfExportMode = () => {
    window.clearTimeout(pdfExportResetTimer);
    setPdfExportMode(false);
  };

  const startPdfExport = () => {
    setPdfExportMode(true);

    window.requestAnimationFrame(() => {
      window.print();
      pdfExportResetTimer = window.setTimeout(resetPdfExportMode, 1200);
    });
  };

  pdfExportButton?.addEventListener('click', startPdfExport);
  window.addEventListener('beforeprint', () => setPdfExportMode(true));
  window.addEventListener('afterprint', resetPdfExportMode);

  document.querySelectorAll('[data-theme]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!page) {
        return;
      }

      page.setAttribute('data-theme-mode', button.getAttribute('data-theme'));
      setActive(Array.from(document.querySelectorAll('[data-theme]')), button, 'is-active');
    });
  });

  document.querySelectorAll('[data-chat-question]').forEach((button) => {
    button.addEventListener('click', () => {
      const answerText = button.getAttribute('data-chat-answer');
      const answers = document.querySelectorAll('[data-chat-answer-output]');
      answers.forEach((answer) => answer.replaceChildren(answerText));
    });
  });

  const setFloatingChatOpen = (open) => {
    if (floatingChatPanel) {
      floatingChatPanel.hidden = !open;
    }

    if (floatingChatLauncher) {
      floatingChatLauncher.classList.toggle('is-open', open);
      floatingChatLauncher.setAttribute('aria-expanded', String(open));
    }

    if (floatingChatLabel) {
      floatingChatLabel.textContent = open ? '×' : 'AIに質問';
    }
  };

  const getFloatingAnswer = (question, explicitAnswer = '') => {
    if (explicitAnswer) {
      return explicitAnswer;
    }

    if (/python|go|golang|言語|開発経験/i.test(question)) {
      return 'Go は決済基盤、不正利用対策、広告計測SaaSのバッチ、住宅施工品質SaaSのバッチで経験があります。Python は広告計測API、Apache Airflow / MWAAのデータパイプライン、住宅施工品質SaaSのバッチで経験があります。';
    }

    if (/金融|決済|銀行/i.test(question)) {
      return '法人クレジットカードの不正利用対策システムと、T銀行・E銀行・F銀行向けの銀行系システムで実績があります。決済基盤、社内システム、口座開設、電子帳票、個人ローン申込、営業支援まで担当しています。';
    }

    if (/infra|devops|インフラ|aws|gcp|kubernetes|terraform/i.test(question)) {
      return 'AWS / GCP、Kubernetes、Terraform / Terragrunt、Docker、GitHub Actions、ArgoCD、Helm、MWAAなどの経験があります。アプリケーション実装とあわせて、運用を見据えた基盤整備も支援可能です。';
    }

    return 'スキルシート掲載情報では、自社事業を含む12件の経歴・案件実績を掲載しています。フロントエンド、バックエンド、データ基盤、インフラ / DevOps まで横断して担当できるエンジニアとして整理されています。';
  };

  const renderFloatingMessages = () => {
    if (!floatingChatMessages) {
      return;
    }

    floatingChatMessages.querySelectorAll('[data-floating-chat-message]').forEach((node) => node.remove());

    if (floatingChatEmpty) {
      floatingChatEmpty.hidden = floatingMessages.length > 0;
    }

    if (floatingChatClear) {
      floatingChatClear.hidden = floatingMessages.length === 0;
    }

    floatingMessages.forEach((message) => {
      const row = document.createElement('div');
      row.className = `floating-ai-chat__message floating-ai-chat__message--${message.role}`;
      row.setAttribute('data-floating-chat-message', '');

      const label = document.createElement('div');
      label.className = 'floating-ai-chat__message-label';
      label.textContent = message.role === 'user' ? 'あなた' : 'H.K. AI';

      const bubble = document.createElement('div');
      bubble.className = 'floating-ai-chat__bubble';
      bubble.textContent = message.content;

      row.append(label, bubble);
      floatingChatMessages.append(row);
    });

    floatingChatMessages.scrollTop = floatingChatMessages.scrollHeight;
  };

  const sendFloatingQuestion = (question, explicitAnswer = '') => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) {
      return;
    }

    floatingMessages.push({ role: 'user', content: trimmedQuestion });
    floatingMessages.push({ role: 'assistant', content: getFloatingAnswer(trimmedQuestion, explicitAnswer) });
    renderFloatingMessages();

    if (floatingChatInput) {
      floatingChatInput.value = '';
      floatingChatInput.style.height = 'auto';
    }

    setFloatingChatOpen(true);
  };

  floatingChatLauncher?.addEventListener('click', () => {
    const isOpen = floatingChatLauncher.getAttribute('aria-expanded') === 'true';
    setFloatingChatOpen(!isOpen);
  });

  floatingChatClose?.addEventListener('click', () => {
    setFloatingChatOpen(false);
  });

  floatingChatClear?.addEventListener('click', () => {
    floatingMessages.splice(0, floatingMessages.length);
    renderFloatingMessages();
  });

  document.querySelectorAll('[data-floating-chat-question]').forEach((button) => {
    button.addEventListener('click', () => {
      sendFloatingQuestion(button.textContent || '', button.getAttribute('data-chat-answer') || '');
    });
  });

  floatingChatSend?.addEventListener('click', () => {
    sendFloatingQuestion(floatingChatInput?.value || '');
  });

  floatingChatInput?.addEventListener('input', () => {
    floatingChatInput.style.height = 'auto';
    floatingChatInput.style.height = `${Math.min(floatingChatInput.scrollHeight, 120)}px`;
  });

  floatingChatInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendFloatingQuestion(floatingChatInput.value);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setFloatingChatOpen(false);
      setSidebarOpen(false);
    }
  });

  renderFloatingMessages();
  updateProjects();
});

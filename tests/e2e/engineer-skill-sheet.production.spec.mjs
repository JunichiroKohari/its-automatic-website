import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '../..');
const productionUrl = process.env.SKILL_SHEET_URL || 'https://its-automatic.com/engineer_skill_sheet.html';
const productionOrigin = new URL(productionUrl).origin;
const chatEndpoint = 'https://engineer-skill-chat-api.junichiro-kohari.workers.dev/chat';
const turnstileScriptPattern = /^https:\/\/challenges\.cloudflare\.com\/turnstile\/v0\/api\.js/;

const loadYaml = async (relativePath) => {
  const loader = yaml.load || yaml.safeLoad;
  const raw = await readFile(resolve(projectRoot, relativePath), 'utf8');
  return loader(raw);
};

const [skills, projects, strengths] = await Promise.all([
  loadYaml('src/data/engineer-skill-sheet/skills.yaml'),
  loadYaml('src/data/engineer-skill-sheet/projects.yaml'),
  loadYaml('src/data/engineer-skill-sheet/strengths.yaml'),
]);

const skillCategoryLabels = {
  all: 'ALL',
  lang: '言語',
  fw: 'フレームワーク',
  db: 'DB',
  infra: 'インフラ',
  tool: 'その他',
  ai: 'AI',
};
const leadingSkillCategoryOrder = ['lang', 'fw', 'db', 'infra', 'ai'];
const skillCategoryKeys = Array.from(new Set(skills.map((skill) => skill.cat)));
const orderedSkillCategoryKeys = [
  ...leadingSkillCategoryOrder.filter((key) => skillCategoryKeys.includes(key)),
  ...skillCategoryKeys.filter((key) => !leadingSkillCategoryOrder.includes(key) && key !== 'tool'),
  ...(skillCategoryKeys.includes('tool') ? ['tool'] : []),
];
const expectedSkillFilters = ['all', ...orderedSkillCategoryKeys];

const normalizeSearchText = (value = '') => value.toString().toLowerCase().replace(/\s+/g, ' ').trim();

const relevantResponseFailure = (url, resourceType) => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.origin === productionOrigin || ['document', 'script', 'stylesheet'].includes(resourceType);
  } catch {
    return true;
  }
};

const trackBrowserDiagnostics = (page) => {
  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];
  const failedResponses = [];

  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });
  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });
  page.on('requestfailed', (request) => {
    const url = request.url();
    const resourceType = request.resourceType();
    if (relevantResponseFailure(url, resourceType)) {
      failedRequests.push(`${resourceType} ${url}: ${request.failure()?.errorText || 'unknown failure'}`);
    }
  });
  page.on('response', (response) => {
    const request = response.request();
    const url = response.url();
    const resourceType = request.resourceType();
    if (response.status() >= 400 && relevantResponseFailure(url, resourceType)) {
      failedResponses.push(`${response.status()} ${resourceType} ${url}`);
    }
  });

  return () => {
    expect(pageErrors, 'No uncaught JavaScript exceptions').toEqual([]);
    expect(consoleErrors, 'No browser console errors').toEqual([]);
    expect(failedRequests, 'No critical failed network requests').toEqual([]);
    expect(failedResponses, 'No critical HTTP error responses').toEqual([]);
  };
};

const setupPrintMock = async (page) => {
  await page.addInitScript(() => {
    window.__skillSheetPrintCalls = 0;
    window.print = () => {
      window.__skillSheetPrintCalls += 1;
      window.dispatchEvent(new Event('afterprint'));
    };
  });
};

const setupChatMocks = async (page) => {
  const chatRequests = [];

  await page.route((url) => turnstileScriptPattern.test(url.href), async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: `
        window.turnstile = {
          render: function (_container, options) {
            window.__skillSheetTurnstileOptions = options;
            return 'test-widget';
          },
          execute: function () {
            setTimeout(function () {
              window.__skillSheetTurnstileOptions.callback('test-turnstile-token');
            }, 0);
          },
          reset: function () {}
        };
      `,
    });
  });

  await page.route(chatEndpoint, async (route) => {
    const requestBody = JSON.parse(route.request().postData() || '{}');
    chatRequests.push(requestBody);
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        sessionId: 'playwright-session',
        answer: `テスト回答: ${requestBody.message}`,
      }),
    });
  });

  return chatRequests;
};

const loadSkillSheet = async (page, options = {}) => {
  const assertNoBrowserDiagnostics = trackBrowserDiagnostics(page);
  await setupPrintMock(page);
  const chatRequests = options.mockChat ? await setupChatMocks(page) : [];
  const response = await page.goto(productionUrl, { waitUntil: 'domcontentloaded' });

  expect(response?.ok(), `Expected ${productionUrl} to respond successfully`).toBe(true);
  await expect(page.locator('.skill-sheet-page')).toBeVisible();
  await expect(page.locator('[data-floating-chat-launcher]')).toBeVisible();
  await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});

  return { assertNoBrowserDiagnostics, chatRequests };
};

const visibleCount = async (locator) => locator.evaluateAll((nodes) => nodes.filter((node) => {
  const style = window.getComputedStyle(node);
  const rect = node.getBoundingClientRect();
  return !node.hidden && style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
}).length);

const expectVisibleCount = async (locator, count) => {
  await expect.poll(() => visibleCount(locator)).toBe(count);
};

const expectNoHorizontalOverflow = async (page) => {
  const overflow = await page.evaluate(() => (
    Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth
  ));
  expect(overflow, 'The page should not render wider than the viewport').toBeLessThanOrEqual(1);
};

const getProjectCardData = async (page) => page.locator('[data-project-card]').evaluateAll((cards) => cards.map((card) => ({
  title: card.querySelector('h3')?.textContent?.trim() || '',
  industry: card.getAttribute('data-project-industry') || '',
  tech: (card.getAttribute('data-project-tech') || '').split('|').filter(Boolean),
  place: card.getAttribute('data-project-place') || '',
  start: Number(card.getAttribute('data-project-start') || 0),
  duration: Number(card.getAttribute('data-project-duration') || 0),
  searchText: (card.getAttribute('data-project-search') || '').toLowerCase(),
})));

const visibleProjectNumbers = async (page, attribute) => page.locator('[data-project-card]:visible').evaluateAll(
  (cards, attr) => cards.map((card) => Number(card.getAttribute(attr) || 0)),
  attribute,
);

const expectSortedAscending = (values) => {
  expect(values).toEqual([...values].sort((a, b) => a - b));
};

const expectSortedDescending = (values) => {
  expect(values).toEqual([...values].sort((a, b) => b - a));
};

test.describe('production engineer skill sheet', () => {
  test('loads all core content, assets, and accessibility basics', async ({ page, request }) => {
    const { assertNoBrowserDiagnostics } = await loadSkillSheet(page);

    await expect(page).toHaveTitle("弊社エンジニアの詳細 | 株式会社 It's Automatic");
    await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /ソフトウェアエンジニアのスキルシート/,
    );

    await expect(page.locator('[data-tab-panel="profile"]')).toBeVisible();
    await expect(page.locator('[data-tab-panel="skills"]')).toBeHidden();
    await expect(page.locator('[data-tab-panel="career"]')).toBeHidden();
    await expect(page.locator('.strength-card')).toHaveCount(strengths.length);
    await expect(page.locator('[data-skill-card]')).toHaveCount(skills.length);
    await expect(page.locator('[data-project-card]')).toHaveCount(projects.length);
    await expect(page.locator('[data-project-count]')).toHaveText(String(projects.length));
    await expect(page.getByRole('heading', { name: /フロントからバックエンド/ })).toBeVisible();
    await expect(page.getByText('Go / Python / TypeScriptを主軸')).toBeVisible();
    await expect(page.getByRole('button', { name: 'PDF出力' })).toBeVisible();
    await expectNoHorizontalOverflow(page);

    const duplicateIds = await page.evaluate(() => {
      const ids = Array.from(document.querySelectorAll('[id]')).map((node) => node.id);
      return ids.filter((id, index) => ids.indexOf(id) !== index);
    });
    expect(duplicateIds, 'IDs should be unique').toEqual([]);

    const namelessButtons = await page.locator('button').evaluateAll((buttons) => buttons
      .filter((button) => !(button.textContent?.trim() || button.getAttribute('aria-label') || button.title))
      .map((button) => button.outerHTML));
    expect(namelessButtons, 'Every button needs an accessible name').toEqual([]);

    const unsafeBlankLinks = await page.locator('a[target="_blank"]').evaluateAll((links) => links
      .filter((link) => {
        const rel = (link.getAttribute('rel') || '').split(/\s+/);
        return !(rel.includes('noopener') && rel.includes('noreferrer'));
      })
      .map((link) => link.href));
    expect(unsafeBlankLinks, 'target="_blank" links need noopener noreferrer').toEqual([]);

    const sameOriginAssetUrls = await page.evaluate(() => Array.from(
      document.querySelectorAll('link[rel="stylesheet"][href], script[src], img[src^="/"]'),
      (node) => new URL(node.getAttribute(node.tagName === 'LINK' ? 'href' : 'src'), window.location.href).href,
    ));
    for (const assetUrl of sameOriginAssetUrls) {
      const assetResponse = await request.get(assetUrl);
      expect(assetResponse.status(), `Expected asset to load: ${assetUrl}`).toBeLessThan(400);
    }

    const brokenImages = await page.locator('img:visible').evaluateAll((images) => images
      .filter((image) => !image.complete || image.naturalWidth <= 0 || image.naturalHeight <= 0)
      .map((image) => image.currentSrc || image.src));
    expect(brokenImages, 'All currently visible images should load').toEqual([]);

    assertNoBrowserDiagnostics();
  });

  test('supports profile, skills, and career navigation flows', async ({ page }) => {
    const { assertNoBrowserDiagnostics } = await loadSkillSheet(page);

    await page.locator('[data-tab-target="skills"]').click();
    await expect(page.locator('[data-path-label]')).toHaveText('skills.yaml');
    await expect(page.locator('[data-tab-panel="skills"]')).toBeVisible();

    await page.locator('[data-tab-target="career"]').click();
    await expect(page.locator('[data-path-label]')).toHaveText('career.log');
    await expect(page.locator('[data-tab-panel="career"]')).toBeVisible();

    await page.locator('[data-tab-target="profile"]').click();
    await expect(page.locator('[data-path-label]')).toHaveText('profile.md');
    await expect(page.locator('[data-tab-panel="profile"]')).toBeVisible();

    const firstRelatedStrength = strengths.find((strength) => strength.related.length > 0);
    await page.locator('[data-highlight-skills]').first().click();
    await expect(page.locator('[data-tab-panel="skills"]')).toBeVisible();
    await expect(page.locator('[data-path-label]')).toHaveText('skills.yaml');
    await expect(page.locator('[data-skill-filter="all"]')).toHaveClass(/is-active/);
    await expect(page.locator('[data-skill-card].is-highlighted')).toHaveCount(firstRelatedStrength.related.length);

    assertNoBrowserDiagnostics();
  });

  test('filters every skill category against source data', async ({ page }) => {
    const { assertNoBrowserDiagnostics } = await loadSkillSheet(page);

    await page.locator('[data-tab-target="skills"]').click();
    await expect(page.locator('[data-tab-panel="skills"]')).toBeVisible();

    const actualFilterLabels = await page.locator('[data-skill-filter]').evaluateAll((buttons) => buttons.map((button) => ({
      key: button.getAttribute('data-skill-filter'),
      label: button.textContent.trim(),
    })));
    expect(actualFilterLabels).toEqual(expectedSkillFilters.map((key) => ({
      key,
      label: skillCategoryLabels[key],
    })));

    for (const filterKey of expectedSkillFilters) {
      await page.locator(`[data-skill-filter="${filterKey}"]`).click();
      const expectedCount = filterKey === 'all'
        ? skills.length
        : skills.filter((skill) => skill.cat === filterKey).length;

      await expect(page.locator(`[data-skill-filter="${filterKey}"]`)).toHaveClass(/is-active/);
      await expectVisibleCount(page.locator('[data-skill-card]'), expectedCount);

      const visibleCategories = await page.locator('[data-skill-card]:visible').evaluateAll((cards) => (
        Array.from(new Set(cards.map((card) => card.getAttribute('data-skill-cat'))))
      ));
      if (filterKey !== 'all') {
        expect(visibleCategories).toEqual([filterKey]);
      }
    }

    assertNoBrowserDiagnostics();
  });

  test('filters, sorts, clears, and opens project records', async ({ page }) => {
    const { assertNoBrowserDiagnostics } = await loadSkillSheet(page);

    await page.locator('[data-tab-target="career"]').click();
    await expect(page.locator('[data-tab-panel="career"]')).toBeVisible();
    await expectVisibleCount(page.locator('[data-project-card]'), projects.length);
    await expect(page.locator('[data-project-summary]')).toHaveText('全件表示中');

    const projectCards = await getProjectCardData(page);
    const keyword = projectCards[0].title.split(' — ')[0];
    const normalizedKeyword = normalizeSearchText(keyword);
    await page.locator('input[data-project-search]').fill(keyword);
    await expectVisibleCount(
      page.locator('[data-project-card]'),
      projectCards.filter((project) => project.searchText.includes(normalizedKeyword)).length,
    );
    await expect(page.locator('[data-project-summary]')).toContainText(`検索: ${keyword}`);
    await expect(page.locator('[data-project-filter-reset]')).toBeEnabled();

    await page.locator('[data-project-filter-reset]').click();
    await expectVisibleCount(page.locator('[data-project-card]'), projects.length);
    await expect(page.locator('[data-project-filter-reset]')).toBeDisabled();

    const industry = projectCards.find((project) => project.industry).industry;
    await page.locator('select[data-project-industry]').selectOption(industry);
    await expectVisibleCount(
      page.locator('[data-project-card]'),
      projectCards.filter((project) => project.industry === industry).length,
    );
    await expect(page.locator('[data-project-summary]')).toContainText('業種:');

    await page.locator('[data-project-filter-reset]').click();
    const tech = projectCards.find((project) => project.tech.length > 0).tech[0];
    await page.locator('select[data-project-tech]').selectOption(tech);
    await expectVisibleCount(
      page.locator('[data-project-card]'),
      projectCards.filter((project) => project.tech.includes(tech)).length,
    );
    await expect(page.locator('[data-project-summary]')).toContainText('技術:');

    await page.locator('[data-project-filter-reset]').click();
    const place = projectCards.find((project) => project.place).place;
    await page.locator('select[data-project-place]').selectOption(place);
    await expectVisibleCount(
      page.locator('[data-project-card]'),
      projectCards.filter((project) => project.place === place).length,
    );
    await expect(page.locator('[data-project-summary]')).toContainText('勤務形態:');

    await page.locator('[data-project-filter-reset]').click();
    await page.locator('input[data-project-search]').fill('__not_a_real_project_keyword__');
    await expectVisibleCount(page.locator('[data-project-card]'), 0);
    await expect(page.locator('[data-project-empty]')).toBeVisible();

    await page.locator('[data-project-filter-reset]').click();
    await page.locator('select[data-project-sort]').selectOption('oldest');
    expectSortedAscending(await visibleProjectNumbers(page, 'data-project-start'));
    await expect(page.locator('[data-project-filter-reset]')).toBeEnabled();

    await page.locator('select[data-project-sort]').selectOption('duration-desc');
    expectSortedDescending(await visibleProjectNumbers(page, 'data-project-duration'));

    const firstVisibleProject = page.locator('[data-project-card]:visible').first();
    await expect(firstVisibleProject.locator('[data-project-detail]')).toBeHidden();
    await firstVisibleProject.locator('[data-project-toggle]').click();
    await expect(firstVisibleProject.locator('[data-project-detail]')).toBeVisible();
    await expect(firstVisibleProject.locator('[data-project-toggle]')).toHaveAttribute('aria-expanded', 'true');
    await expect(firstVisibleProject.locator('[data-project-toggle] span')).toHaveText('閉じる');
    await firstVisibleProject.locator('[data-project-toggle]').click();
    await expect(firstVisibleProject.locator('[data-project-detail]')).toBeHidden();

    const previewLink = page.locator('.project-card__links a').first();
    if (await previewLink.count()) {
      await previewLink.hover();
      await expect(page.locator('.project-link-preview').first()).toBeVisible();
      const previewImageLoaded = await page.locator('.project-link-preview img').first().evaluate((image) => (
        new Promise((resolveImage) => {
          if (image.complete) {
            resolveImage(image.naturalWidth > 0 && image.naturalHeight > 0);
            return;
          }

          image.addEventListener('load', () => resolveImage(image.naturalWidth > 0 && image.naturalHeight > 0), { once: true });
          image.addEventListener('error', () => resolveImage(false), { once: true });
        })
      ));
      expect(previewImageLoaded, 'Project link preview image should load when displayed').toBe(true);
    }

    assertNoBrowserDiagnostics();
  });

  test('handles themes, PDF export, and floating chat UI', async ({ page }) => {
    const { assertNoBrowserDiagnostics, chatRequests } = await loadSkillSheet(page, { mockChat: true });

    for (const theme of ['teal', 'charcoal', 'snow']) {
      await page.locator(`[data-theme="${theme}"]`).click();
      await expect(page.locator('body')).toHaveAttribute('data-theme-mode', theme);
      await expect(page.locator(`[data-theme="${theme}"]`)).toHaveClass(/is-active/);
    }

    await page.locator('[data-pdf-export]').click();
    await expect.poll(() => page.evaluate(() => window.__skillSheetPrintCalls)).toBe(1);
    await expect(page.locator('[data-pdf-export]')).toHaveAttribute('aria-busy', 'false');

    await expect(page.locator('[data-floating-chat-panel]')).toBeHidden();
    await page.locator('[data-floating-chat-launcher]').click();
    await expect(page.locator('[data-floating-chat-panel]')).toBeVisible();
    await expect(page.locator('[data-floating-chat-launcher]')).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('[data-floating-chat-label]')).toHaveText('×');

    await page.locator('[data-floating-chat-question]').first().click();
    await expect.poll(() => chatRequests.length).toBe(1);
    expect(chatRequests[0]).toMatchObject({
      turnstileToken: 'test-turnstile-token',
    });
    expect(chatRequests[0].message).toContain('Go');
    await expect(page.locator('[data-floating-chat-message]')).toHaveCount(2);
    await expect(page.locator('[data-floating-chat-message]').last()).toContainText('テスト回答:');
    await expect(page.locator('[data-floating-chat-clear]')).toBeVisible();
    await expect(page.locator('[data-floating-chat-send]')).toBeEnabled();

    await page.locator('[data-floating-chat-clear]').click();
    await expect(page.locator('[data-floating-chat-message]')).toHaveCount(0);
    await expect(page.locator('[data-floating-chat-empty]')).toBeVisible();
    await expect.poll(() => page.evaluate(() => window.localStorage.getItem('engineerSkillChatSessionId'))).toBe(null);

    await page.locator('[data-floating-chat-close]').click();
    await expect(page.locator('[data-floating-chat-panel]')).toBeHidden();

    assertNoBrowserDiagnostics();
  });

  test('keeps the mobile sidebar and layout usable', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const { assertNoBrowserDiagnostics } = await loadSkillSheet(page);

    await expectNoHorizontalOverflow(page);
    await expect(page.locator('[data-sidebar]')).toHaveAttribute('aria-hidden', 'true');
    await expect(page.locator('[data-sidebar-toggle]')).toHaveAttribute('aria-expanded', 'false');

    await page.locator('[data-sidebar-toggle]').click();
    await expect(page.locator('.skill-sheet-page')).toHaveClass(/is-sidebar-open/);
    await expect(page.locator('[data-sidebar]')).toHaveAttribute('aria-hidden', 'false');
    await expect(page.locator('[data-sidebar-toggle]')).toHaveAttribute('aria-expanded', 'true');

    await page.locator('[data-tab-target="skills"]').click();
    await expect(page.locator('[data-path-label]')).toHaveText('skills.yaml');
    await expect(page.locator('[data-sidebar]')).toHaveAttribute('aria-hidden', 'true');
    await expect(page.locator('[data-sidebar-toggle]')).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('[data-tab-panel="skills"]')).toBeVisible();

    assertNoBrowserDiagnostics();
  });
});

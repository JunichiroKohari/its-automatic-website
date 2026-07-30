#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import * as yaml from 'js-yaml';

import { renderPugDocument } from '../src/lib/renderLegacyDocument.mjs';

const projectRoot = process.cwd();
const loadYaml = async (relativePath) => {
  const raw = await readFile(resolve(projectRoot, relativePath), 'utf8');
  const loader = yaml.load || yaml.safeLoad;
  return loader(raw);
};

const errors = [];

const addError = (message) => {
  errors.push(message);
};

const isHttpUrl = (value) => {
  try {
    const url = new URL(`${value || ''}`.trim());
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
};

const isSafePreviewImageUrl = (value) => {
  const url = `${value || ''}`.trim();
  return !url || (url.startsWith('/') && !url.startsWith('//')) || isHttpUrl(url);
};

const normalizeProjectLinks = (project) => {
  const items = Array.isArray(project.link) ? project.link : [project.link];

  return items.flatMap((item) => {
    if (!item) {
      return [];
    }

    if (typeof item === 'string') {
      return [{ url: item }];
    }

    if (item.url) {
      return [item];
    }

    return Object.values(item).flatMap((value) => {
      if (!value) {
        return [];
      }

      return typeof value === 'string' ? [{ url: value }] : [value];
    });
  });
};

const validateProjects = (projects) => {
  if (!Array.isArray(projects) || projects.length === 0) {
    addError('projects.yaml must contain at least one project.');
    return;
  }

  projects.forEach((project, index) => {
    const prefix = `projects[${index}]`;
    ['company', 'title', 'industry', 'phase', 'engagement'].forEach((field) => {
      if (!`${project[field] || ''}`.trim()) {
        addError(`${prefix}.${field} is required.`);
      }
    });

    if (!project.dates?.start) {
      addError(`${prefix}.dates.start is required.`);
    }

    if (!Array.isArray(project.tech) || project.tech.length === 0) {
      addError(`${prefix}.tech must contain at least one item.`);
    }

    normalizeProjectLinks(project).forEach((link, linkIndex) => {
      if (!isHttpUrl(link.url)) {
        addError(`${prefix}.link[${linkIndex}].url must be http or https.`);
      }

      const previewImage = link.image || link.thumbnail || link.thumbnailUrl || link.ogImage || '';
      if (!isSafePreviewImageUrl(previewImage)) {
        addError(`${prefix}.link[${linkIndex}].image has an unsafe URL.`);
      }
    });
  });
};

const validateSkills = (skills) => {
  if (!Array.isArray(skills) || skills.length === 0) {
    addError('skills.yaml must contain at least one skill.');
    return;
  }

  skills.forEach((skill, index) => {
    if (!skill.name || !skill.cat || !skill.years) {
      addError(`skills[${index}] is missing name, cat, or years.`);
    }

    if (!Number.isInteger(skill.level) || skill.level < 1 || skill.level > 5) {
      addError(`skills[${index}].level must be an integer from 1 to 5.`);
    }
  });
};

const [projects, skills, strengths] = await Promise.all([
  loadYaml('src/data/engineer-skill-sheet/projects.yaml'),
  loadYaml('src/data/engineer-skill-sheet/skills.yaml'),
  loadYaml('src/data/engineer-skill-sheet/strengths.yaml'),
]);

validateProjects(projects);
validateSkills(skills);

if (!Array.isArray(strengths) || strengths.length === 0) {
  addError('strengths.yaml must contain at least one strength group.');
}

const rendered = renderPugDocument('src/features/legacy-pug/businesses/engineer_skill_sheet.pug', {
  rootAssets: true,
});

if (!rendered.head.includes('弊社エンジニアの詳細')) {
  addError('Rendered head is missing the expected page title.');
}

if (!rendered.body.includes('AIに質問')) {
  addError('Rendered body is missing the floating chat launcher.');
}

if (errors.length) {
  errors.forEach((error) => {
    console.error(`- ${error}`);
  });
  process.exit(1);
}

console.log(`Validated engineer_skill_sheet with ${projects.length} projects and ${skills.length} skills.`);

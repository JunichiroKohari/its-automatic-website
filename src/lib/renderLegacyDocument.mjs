import fs from 'node:fs';
import path from 'node:path';

import pug from 'pug';
import * as yaml from 'js-yaml';

const projectRoot = process.cwd();

const loadYamlFile = (relativePath) => {
  const raw = fs.readFileSync(path.resolve(projectRoot, relativePath), 'utf8');
  const loader = yaml.load || yaml.safeLoad;
  return loader(raw);
};

const getTemplateData = () => ({
  skillSheet: {
    skills: loadYamlFile('src/data/engineer-skill-sheet/skills.yaml'),
    strengths: loadYamlFile('src/data/engineer-skill-sheet/strengths.yaml'),
    projects: loadYamlFile('src/data/engineer-skill-sheet/projects.yaml'),
  },
});

const parseAttributes = (source = '') => {
  const attrs = {};
  const pattern = /([:@\w.-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>`]+)))?/g;
  let match = pattern.exec(source);

  while (match) {
    const [, name, doubleQuoted, singleQuoted, bare] = match;
    attrs[name] = doubleQuoted ?? singleQuoted ?? bare ?? true;
    match = pattern.exec(source);
  }

  return attrs;
};

const parseDocument = (html) => {
  const htmlMatch = html.match(/<html([^>]*)>/i);
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  const bodyMatch = html.match(/<body([^>]*)>([\s\S]*?)<\/body>/i);

  if (!headMatch || !bodyMatch) {
    throw new Error('Legacy document must contain <head> and <body> elements.');
  }

  return {
    htmlAttrs: parseAttributes(htmlMatch?.[1] || ''),
    head: headMatch[1],
    bodyAttrs: parseAttributes(bodyMatch[1]),
    body: bodyMatch[2],
  };
};

const normalizeRootAssetPaths = (html) => html
  .replace(/(["'])\.\.\/img\//g, '$1img/')
  .replace(/(["'])\.\.\/\.\.\/img\//g, '$1img/');

const stripLegacyBundleScript = (html) => html
  .replace(/<script\s+defer\s+src=["']bundle\.js["']><\/script>/i, '');

export const renderPugDocument = (relativeTemplatePath, options = {}) => {
  const templatePath = path.resolve(projectRoot, relativeTemplatePath);
  let html = pug.renderFile(templatePath, {
    ...getTemplateData(),
    filename: templatePath,
  });

  if (options.rootAssets) {
    html = normalizeRootAssetPaths(html);
  }

  return parseDocument(html);
};

export const renderHtmlDocument = (relativeTemplatePath, options = {}) => {
  const templatePath = path.resolve(projectRoot, relativeTemplatePath);
  let html = fs.readFileSync(templatePath, 'utf8');

  if (options.stripBundleScript) {
    html = stripLegacyBundleScript(html);
  }

  return parseDocument(html);
};

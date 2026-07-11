# AGENTS.md

## Project overview

- This repository builds a static multi-page site with Astro.
- Source files live under `src/`.
- `dist/` is generated output and should be refreshed from source changes instead of hand-edited.

## Setup and validation

- Install dependencies with `npm ci` in fresh cloud environments.
- Start the dev server with `npm start`.
- Build production output with `npm run build`.
- There is no automated test suite in this repo right now. The required validation step is a successful production build.
- `favicons`, `image-webpack-loader`, and Webpack are intentionally not part of the active toolchain.

## Editing guidelines

- Astro route files live under `src/pages/`.
- Shared legacy Pug templates live under `src/features/legacy-pug/`.
- For the real-estate case study site, edit files under `src/features/case-sites/ai-website-case-01/`.
- Listing/detail data is published from `public/ai-website-case-01/assets/data/`; keep the source copy under `src/features/case-sites/ai-website-case-01/assets/data/` in sync when changing it.
- Case-site scripts are published from `public/ai-website-case-01/assets/js/`; keep the source copy under `src/features/case-sites/ai-website-case-01/assets/js/` in sync when changing it.
- React landing page source lives under `src/features/landings/`.
- When source files change, rebuild so `dist/` stays in sync.
- `npm start` and `npm run build` run `tools/sync-public-assets.mjs` first so fixed public assets stay aligned with `src/`.
- Avoid unrelated churn in generated files and large media assets unless the task requires it.

## Review guidelines

- Preserve relative asset paths for files emitted under `dist/ai-website-case-01/`.
- If you add a new HTML page, add the corresponding Astro route under `src/pages/`.
- Keep Japanese copy and existing page/link structure intact unless the task explicitly asks for content changes.

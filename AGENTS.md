# AGENTS.md

## Project overview

- This repository builds a static multi-page site with Webpack.
- Source files live under `src/`.
- `dist/` is generated output and should be refreshed from source changes instead of hand-edited.

## Setup and validation

- Install dependencies with `npm ci --ignore-scripts` in fresh cloud environments.
- Start the dev server with `npm start`.
- Build production output with `npm run build`.
- There is no automated test suite in this repo right now. The required validation step is a successful production build.
- `favicons` and `image-webpack-loader` are intentionally not part of the active toolchain.

## Editing guidelines

- For the real-estate case study site, edit files under `src/html/businesses/ai-website-case-01/`.
- Listing/detail data lives in `src/html/businesses/ai-website-case-01/assets/data/`.
- Case-site scripts live in `src/html/businesses/ai-website-case-01/assets/js/`.
- When source files change, rebuild so `dist/` stays in sync.
- Avoid unrelated churn in generated files and large media assets unless the task requires it.

## Review guidelines

- Preserve relative asset paths for files emitted under `dist/ai-website-case-01/`.
- If you add a new HTML page to `src/html/businesses/ai-website-case-01/`, make sure the existing `caseSitePages` discovery in `webpack.config.js` still emits it correctly.
- Keep Japanese copy and existing page/link structure intact unless the task explicitly asks for content changes.

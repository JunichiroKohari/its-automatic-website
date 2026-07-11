# portfolio

Static website project built with Astro. The editable source lives in `src/`, and the generated site is emitted to `dist/`.

## Local commands

```bash
npm ci
npm start
npm run build
```

## Codex cloud setup

1. Push this repository to GitHub.
2. Open [Codex](https://chatgpt.com/codex) and connect your GitHub account.
3. In Codex settings, create a cloud environment for `JunichiroKohari/its-automatic-website`.
4. Use the default `universal` image and pin `Node.js` to `22`.
5. Set the setup step to `npm ci`.
6. Keep agent internet access off unless a task truly needs it.

This repository does not currently require any `.env` file or runtime secret for build/edit tasks.
## What Codex should edit

- Main source: `src/`
- Generated output: `dist/`
- Astro routes: `src/pages/`
- Legacy Pug templates: `src/features/legacy-pug/`
- Real-estate case-study pages: `src/features/case-sites/ai-website-case-01/`
- React landing pages: `src/features/landings/`
- Public static assets: `public/`

After source edits, run:

```bash
npm run build
```

That rebuild syncs fixed public assets, then keeps `dist/` aligned with the checked-in source.

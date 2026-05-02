# portfolio

Static website project built with Webpack. The editable source lives in `src/`, and the generated site is emitted to `dist/`.

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
5. Set the setup step to `npm ci --ignore-scripts --legacy-peer-deps`.
6. Keep agent internet access off unless a task truly needs it.

This repository does not currently require any `.env` file or runtime secret for build/edit tasks.
The `--ignore-scripts` flag is intentional for Codex cloud setup because the repo no longer needs the old native image install steps that tend to fail in fresh Linux containers.
The `--legacy-peer-deps` flag is a compatibility workaround for cloud environments that still resolve stale `node-sass` peer metadata during setup.

## What Codex should edit

- Main source: `src/`
- Generated output: `dist/`
- Real-estate case-study pages: `src/html/businesses/ai-website-case-01/`

After source edits, run:

```bash
npm run build
```

That rebuild keeps `dist/` aligned with the checked-in source.

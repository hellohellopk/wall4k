# Technical Debt & Engineering Follow-ups

This file tracks known engineering gaps that are separate from the
user-facing feature/UI checklist in `todo.md`. See the tracking issue for
discussion and status.

## 1. `server/` directory purpose is unclear

The app is described in `README.md` as a static React + Vite site deployed
to GitHub Pages via `build:pages` (`vite build` only). However, the
top-level `build` script also bundles `server/index.ts` with esbuild, and a
`server/` directory exists with a small (~900 byte) Express-style entry
point.

Open questions to resolve before making a change:

- Is `server/` actually used in any deployed environment, or is it a
  leftover from an earlier scaffold?
- If it's unused, the `build` script, `server/` directory, and any
  server-only dependencies can be removed to simplify the build and reduce
  install size.
- If a server is planned (e.g. for saving custom templates), that intent
  should be documented in `README.md` / `ideas.md` so contributors don't
  assume it's dead code.

**Suggested next step:** confirm usage, then either delete `server/` and the
related build step, or document its purpose.

## 2. No automated tests for pattern-generation logic

All wallpaper pattern math (color generation, wave-path construction,
geometry parameters) currently lives inline in `client/src/pages/Home.tsx`
(~32 KB, single file) with no unit test coverage. Verification has so far
been manual (see `verification.md`): selecting each pattern in the browser
and visually confirming the preview updates.

**Suggested next step:** incrementally extract pure, side-effect-free
helper functions (color math, path builders, parameter clamping) out of
`Home.tsx` into `client/src/lib/`, following the pattern started in
`patternMath.ts`, and add `vitest` coverage for each as it's extracted.

## 3. No CI check for GitHub Pages base-path regressions

`preview-diagnostics.md` records two real incidents: a stale preview server
returning 404s under `/wall4k/`, and a rebuilt preview rendering a blank
page. Commit history shows three separate follow-up fixes for pnpm setup,
Pages routing, and the base path. This is exactly the class of regression
that's cheap to catch automatically.

**Suggested next step:** the `verify-pages-build.yml` workflow added
alongside this file builds the project and checks that all local asset
references in `dist/index.html` are prefixed with the configured Vite
`base` path, failing CI before a broken deploy reaches Pages.

## 4. Documentation is Chinese-only

`README.md`, `ideas.md`, `todo.md`, and the diagnostics/verification notes
are all written in Chinese only. That's fine for solo development, but adds
friction if the project is shared publicly or a contributor doesn't read
Chinese.

**Suggested next step:** add a short English summary section to
`README.md` covering what the tool does, the tech stack, and how to run it
locally — no need to translate the planning docs.

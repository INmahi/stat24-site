# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

IRIS 34 — a Next.js 16 (App Router, Turbopack) site for SUST Statistics Batch 34. Three pages: `/` (home placeholder), `/curriculum` (placeholder), and `/calculator` (the actual product — semester GPA entry, CGPA overview, AI advisor). The repo lives in this directory (`web/`) and deploys to Netlify on every push to `main`. The legacy vanilla-HTML calculator at `../Project/` is unrelated and not part of this deploy.

## Quick Start

```bash
cp .env.example .env.local
# Paste your free Groq API key from https://console.groq.com/keys
npm install
npm run dev
```

Open http://localhost:3000/calculator. See [web/project.md](project.md) for a beginner-friendly walkthrough of the entire codebase.

## Commands

- `npm run dev` — Turbopack dev server with hot-reload (http://localhost:3000)
- `npm run build` — Production build; catches TypeScript errors
- `npm run start` — Run locally the same way Netlify will serve it
- `npm run lint` — Run eslint

**No test suite.** Build catches TS errors; lint runs `eslint`.

**Secrets:** `GROQ_API_KEY` goes in `.env.local` (gitignored) locally. In Netlify, set it in Site settings → Environment variables. Never commit `.env.local` or `GROQ_API_KEY`.

## Architecture

**Two persisted maps in localStorage**, both lazily hydrated by `useCgpaStore` in [lib/storage.ts](lib/storage.ts):
- `sta-cgpa:history:v1` — semester-name → `{ gpa, credits, updatedAt }`. Drives the CGPA overview's "Load from memory" and the dropdown's saved-GPA badge.
- `sta-cgpa:course-grades:v1` — semester-name → course-code → `{ marks?, gpa?, letter? }`. Auto-persisted on every keystroke once a semester is selected; hydrated when the user re-opens that semester.

`remove(semester)` clears both maps for that semester to keep them consistent.

**Curriculum is static JSON.** [data/contents.json](data/contents.json) is the source of truth (8 semesters, ~50 courses, content summaries, main texts). [lib/curriculum.ts](lib/curriculum.ts) just re-exports it as `Curriculum`. Don't duplicate this data — every consumer (chat system prompt, calculator dropdown, CGPA section, course detail dialog) reads from `curriculum`.

**Chat pipeline.** [components/chat-panel.tsx](components/chat-panel.tsx) is mounted globally in `app/layout.tsx`. It listens for the `iris:open-chat` custom event (`OPEN_CHAT_EVENT` constant) so the nav "Ask AI" button and the CGPA "comeback strategy" button can pop it open without prop-drilling. On send, it builds a per-request `context` string via [lib/chat-context.ts](lib/chat-context.ts) (CGPA summary + per-semester GPAs + per-course grades) and sends it as a `body.context` field. **On `/curriculum`, context is suppressed** so the advisor stays general. The server route [app/api/chat/route.ts](app/api/chat/route.ts) appends `body.context` to the static `SYSTEM_PROMPT` and streams via `streamText` (Groq Llama 3.3 70B). The system prompt has explicit "no sugar-coating, redirect any usage question to the info button" rules — keep that posture if you edit it.

**Ambient layers** (mounted once in `app/layout.tsx`, not per page):
- `ParticleBackground` — Canvas 2D, fast left-to-right neon-cyan/mint flow at z-index -10.
- `CustomCursor` — toggles `html.custom-cursor-active` (CSS in `globals.css`); fine-pointer only.
- `ClickSpill` — statistical-symbol spill on every pointerdown. **Currently disabled** via `const ENABLED = false` at the top of [components/click-spill.tsx](components/click-spill.tsx). Flip to `true` to re-enable; it short-circuits to a `null` render with no listeners attached.

**shadcn/ui is built on `@base-ui/react`, not Radix.** This matters: `Select.Item`'s `label` prop does NOT drive the trigger display in this version, so [components/semester-calculator.tsx](components/semester-calculator.tsx) bypasses `SelectValue` entirely and renders the trigger label from `semesterIndex` state directly. Don't "simplify" it back to `<SelectValue />` — the dropdown will fall back to showing the raw index.

**Fonts.** Titillium Web is bound to `--font-sans` via `next/font/google` in `app/layout.tsx`; the serif utility (`@utility font-serif` in `globals.css`) is reserved for hero numerals and section headers. Mono uses Geist Mono. Don't add other Google Fonts unless asked — keeps CLS predictable.

**Palette.** Defined in `app/globals.css` `.dark` block. Near-black `#08090d` background, `#12141b` cards, `#5df2c5` neon mint accent, `#3abd96` darker teal for stat values, `#3e99c2` blue for valid-GPA semester pills, `#a25edd` purple for course code chips. Sections use `bg-[color-mix(in_oklab,var(--card)_55%,transparent)]` so the particle field shows through.

## Deployment

Netlify reads `netlify.toml` at the repo root (no `base` — repo root is already this `web/` directory). The `@netlify/plugin-nextjs` plugin is auto-injected. Pushing to `main` triggers a build; PRs get preview deploys. The Groq key is set in Netlify env vars, never in the repo.

## Common Issues

**Page is blank / white screen:**
1. Check browser DevTools Console for errors (F12 → Console).
2. Verify `.env.local` has a valid `GROQ_API_KEY`.
3. Hard refresh (Ctrl-Shift-R) to clear cache.

**Changes not showing up:**
1. Check the dev-server terminal for Turbopack errors.
2. For server-component edits, sometimes a hard refresh is needed.
3. Favicons are aggressively cached — use incognito or DevTools → Application → Clear storage.

**Build fails locally:**
- Run `npm run build` to see the exact error. Usually a TypeScript type mismatch or an undefined import.

## Editing posture (project-specific)

- This is a personal student project, not a team codebase. Prefer minimal, in-place edits over new abstractions.
- The owner iterates fast on visual details. Don't add comments explaining what the code does — only ones that explain *why* something non-obvious exists (e.g. the `ENABLED` toggle, the `SelectValue` bypass).
- No automated tests, so: verify with `npm run build` before pushing. The owner often asks to "build and run locally" — `npm run dev` in the background and let them eyeball the change before commit.
- The user has explicitly authorized git pushes to `origin main` for this repo when they say so. Respect that scope; don't push unprompted.

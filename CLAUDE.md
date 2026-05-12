# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## IMPORTANT: Always Read Docs First

Before writing any code, **always** check the `/docs` directory for a relevant guide. Read the applicable file(s) there before generating any implementation. The docs directory contains authoritative references for libraries, APIs, and conventions used in this project — do not rely on training data when a doc file is available.

- /docs/ui.md
- /docs/data-fetching.md
- /docs/data-mutations.md
- /docs/auth.md

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run ESLint
```

No test runner is configured yet.

## Architecture

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript 5 (strict) · Tailwind CSS 4

All application code lives in `app/` using the Next.js App Router — no `src/` directory, no Pages Router. React Server Components are the default; mark client components explicitly with `"use client"`.

**Path alias:** `@/` resolves to the project root (e.g. `@/app/components/...`).

**Styling:** Tailwind CSS 4 via `@import "tailwindcss"` in `globals.css`. CSS variables for `--background`, `--foreground`, and font families are defined there and support light/dark modes via `prefers-color-scheme`.

**Fonts:** Geist Sans and Geist Mono loaded via `next/font/google` in `app/layout.tsx` and injected as CSS variables.

This is a greenfield project — no API routes, database, or state management are set up yet.

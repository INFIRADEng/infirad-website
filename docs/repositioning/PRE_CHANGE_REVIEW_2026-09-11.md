# INFIRAD Website Repositioning - Pre-change Review

Date: 2026-09-11

## Authority and baseline

- User authority: redesign and rewrite the INFIRAD public website to reflect the approved repositioning discussed in the originating Codex task.
- Repository: `alhuwaidias-arch/infirad-website`
- Baseline branch: `main`
- Baseline commit: `35897be13a0f7ab0b0f9032a229e6f7c4377f247`
- Working branch: `feat/2026-09-11-brand-repositioning`
- Baseline worktree state: clean and aligned with `origin/main` before branch creation.

## Problem statement

The published site consistently presents INFIRAD as a strategic engineering or venture-engineering partner. AI is shown as one supporting capability and is explicitly limited to engineering decision support. This no longer matches the intended company definition: a Saudi applied-AI company that builds specialized agents and intelligent work systems for complex professional and technical work, with engineering, simulation, and R&D as its deepest current domain expertise.

## Approved positioning direction

INFIRAD is an applied-AI company for specialized work. Engineering remains the flagship domain and proof of rigor, not the company's market boundary.

The website will preserve three separately marketable client paths:

1. Specialized AI agents and automation.
2. Engineering, simulation, and R&D.
3. INSYAB traffic simulation.

The homepage may map these paths under one corporate identity, but it must not package them as a single client service or imply that every client receives all three.

## Claims and safeguards

- Do not claim that INFIRAD replaces qualified professional judgment.
- Do not present legal, financial, engineering, or other professional agents as autonomous authorities.
- Describe human review, defined permissions, organization-owned sources, and traceable outputs.
- Do not claim validated commercial performance for SolarCool/Nasma Shams; it may only be described as an R&D program in development if included.
- Do not claim measured INSYAB outcomes not evidenced on the site.
- Replace absolute marketing statistics such as `0% vendor bias` and `100% decision autonomy` with precise independence language.
- Preserve existing contact details and the established `From Idea to Certainty` signature.

## In-scope implementation

- Rebuild the homepage narrative and information hierarchy.
- Update Arabic and English copy together.
- Preserve the existing language toggle, contact actions, responsive behavior, and GitHub Pages build path.
- Replace expiring externally hosted decorative image URLs with code-native visual treatment and existing local brand assets.
- Introduce clear, independent routes/sections for the three client paths without inventing unimplemented service-detail pages.
- Improve mobile readability, accessibility labels, contrast, focus states, and reduced-motion behavior.
- Update page title and description metadata to match the new positioning.

## Explicit exclusions

- No push to GitHub, pull request, merge, or production deployment before user review and approval.
- No change to DNS, `CNAME`, GitHub Actions permissions, hosting settings, analytics, or external accounts.
- No new lead form, CRM, authentication, database, tracking, or third-party integration.
- No changes to the separate `INFIRAD_AI_Team` repository or its runtime state.
- No public LinkedIn edits in this change.

## Expected source changes

- `client/src/pages/Home.tsx`
- `client/src/components/Navigation.tsx`
- Existing homepage section components, with additions or replacements kept within `client/src/components/`
- `client/src/index.css`
- `client/index.html` metadata where required

Package manifests and the lockfile should remain unchanged unless an implementation blocker proves a dependency change necessary.

## Verification gates

1. TypeScript check passes.
2. Production build passes using the existing package scripts.
3. Arabic and English versions contain equivalent positioning and all major sections.
4. Desktop and mobile layouts have no clipping or unintended horizontal scrolling.
5. Navigation, language toggle, email action, WhatsApp link, and LinkedIn link work.
6. The first viewport communicates applied AI, specialized agents, and engineering depth without presenting INFIRAD as a generic chatbot or automation agency.
7. The three client paths remain visibly independent.
8. No unsupported performance, client, certification, or readiness claim is introduced.

## Baseline verification

- TypeScript check: PASS.
- Production build: PASS.
- Existing build warnings: the optional `VITE_ANALYTICS_ENDPOINT` and `VITE_ANALYTICS_WEBSITE_ID` placeholders are undefined, and the corresponding non-module script cannot be bundled. These warnings predate the repositioning change and are not a release blocker for the current static site.
- Dependency installation required the repository-declared pnpm 10.4.1 because the bundled pnpm 11 rejects the older lockfile configuration. The lockfile and package manifest were not changed.

## Recovery

The complete pre-change state is recoverable from baseline commit `35897be13a0f7ab0b0f9032a229e6f7c4377f247`. All implementation work is isolated on the named feature branch until approved.

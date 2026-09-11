# INFIRAD website repositioning — post-change verification

Date: 2026-09-11
Branch: `feat/2026-09-11-brand-repositioning`
Baseline: `35897be13a0f7ab0b0f9032a229e6f7c4377f247`

## Implemented positioning

The home page now presents INFIRAD as a Saudi applied-AI company that builds specialized agents and intelligent work systems for complex professional and technical work.

The message preserves engineering depth without limiting the company to engineering. It explicitly presents three independent client paths under one disciplined method:

1. Specialized agents and automation.
2. Engineering, simulation, and R&D.
3. INSYAB traffic simulation.

Each path has its own problem statement, deliverables, and entry point. The page does not imply that clients must buy the three paths as one bundle.

## Claim and responsibility safeguards

- The copy avoids unsupported performance, accuracy, customer, or market-leadership claims.
- It states that AI executes and documents while professional judgment and responsibility remain with qualified experts.
- It describes engineering and simulation as INFIRAD's deepest current expertise, not its only permitted market.
- It recommends beginning with one bounded, measurable task and scaling only when evidence supports it.

## Changed surface

- Home-page metadata and search description.
- Navigation and bilingual labels.
- Hero message and code-native specialist-agent workflow visual.
- Differentiation section.
- Three independent work-path cards.
- Delivery methodology.
- Engagement and contact call to action.
- Footer definition.
- Responsive and reduced-motion styling.

No package manifest, lockfile, deployment workflow, domain configuration, contact destination, or credential was changed.

## Verification results

- TypeScript check: PASS (`pnpm@10.4.1 check`).
- Production build: PASS (`pnpm@10.4.1 build`).
- Git whitespace/error check: PASS (`git diff --check`).
- Responsive layout: PASS at 390 px, 768 px, and 1440 px.
- Arabic-to-English language switch: PASS at all three viewport widths.
- Mobile navigation open and language action: PASS.
- Horizontal overflow: none in Arabic or English at all tested widths.
- Visual review: PASS for the Arabic desktop hero, English desktop hero, work-path section, full Arabic mobile page, and full English mobile page.

The production build retains the repository's pre-existing warnings for undefined optional analytics placeholders (`VITE_ANALYTICS_ENDPOINT` and `VITE_ANALYTICS_WEBSITE_ID`). They do not fail the build and were not introduced or altered by this change.

## Release state

The implementation is local only. It has not been pushed, merged, deployed, or published. The live domain and LinkedIn page remain unchanged pending review and approval.

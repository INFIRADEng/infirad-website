# INFIRAD website typography readability review

Date: 2026-09-11
Branch: `feat/2026-09-11-brand-repositioning`
Parent implementation: `f0497fb`

## User feedback addressed

The visible type was increased for the hero eyebrow, the complete specialist-agent workflow panel, the hero proof-point row, section eyebrows, engineering-depth callouts, the internal-method callout, all four differentiation cards, and all similarly sized text below those sections.

## Scale applied

- Repeated section labels and high-value metadata: 18 px on narrow screens and 20 px on wider screens.
- Card descriptions, navigation, lists, start points, buttons, and footer details: 18 px or larger where space permits.
- Primary explanatory copy inside cards and callouts: 20 px.
- Line height and contrast were increased where the larger type required more breathing room.
- Other section headline sizes were preserved to maintain hierarchy.

## Methodology-section refinement

- The main methodology heading now scales from 48 px on mobile to 72 px on desktop.
- The methodology introduction is 24 px.
- Phase titles are 30 px and phase descriptions scale from 20 px to 24 px.
- Phase numbers, card padding, line height, and contrast were increased with the text scale.

## Scope safeguards

- No wording, service definition, contact destination, package manifest, lockfile, deployment workflow, or domain configuration was changed.
- The change is limited to typography, spacing directly associated with type, and supporting text contrast.

## Verification

- TypeScript check: PASS.
- Production build: PASS.
- Responsive widths: PASS at 390 px, 768 px, and 1440 px.
- Arabic and English layouts: PASS at all tested widths.
- Mobile navigation and language switching: PASS.
- Horizontal overflow after type enlargement: none.
- Git whitespace/error check: PASS.

The repository's existing optional analytics-placeholder warnings remain unchanged and do not fail the build.

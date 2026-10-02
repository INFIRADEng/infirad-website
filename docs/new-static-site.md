# INFIRAD website (static, 2026-10-02)

A static, two-page company website that replaces the current Manus-built site at
`infiradev.com`. It has no build step and no framework. One small script
(`assets/picker.js`, no dependencies) opens the service panels; without JavaScript
every panel stays visible, so no content depends on it.

```
website/
├── index.html        Arabic page (RTL, Western numerals by CEO decision): the default
├── en/index.html     English page (LTR, Western numerals)
├── assets/
│   ├── site.css      one stylesheet for both directions (CSS logical properties)
│   ├── picker.js     opens one service panel at a time; reads #svc-eng / #svc-sim / #svc-agents
│   ├── logo-bilingual.png  logo_ar_en_w.png from Brand System v2 project/assets (header, both pages)
│   ├── logo-ar.png   logo_ar_w.png from the same folder (Arabic footer)
│   ├── logo-en.png   logo_en_w.png from the same folder (English footer)
│   ├── icon.png      icon_T.png (favicon)
│   ├── og-ar.png     1200×630 link preview, Arabic
│   └── og-en.png     1200×630 link preview, English
├── robots.txt
└── sitemap.xml       both pages, with hreflang alternates
```

## Decisions it follows (CEO, 2026-10-01)

- **Positioning:** a strategic partner specialized in three capabilities of equal
  weight: **engineering, simulation and AI agents** (CEO, revised the same day after
  a draft that led with agents alone).
- **Page structure:** the hero states the three capabilities, and directly beneath it
  three options sit side by side. Clicking one opens a panel with the service
  description, and its request button at the foot:
  - Engineering → "Request an engineering consultation" / "Request an engineering design"
  - Simulation → "Request a simulation to test your idea"
  - AI agents → "Request an agent for your work or organization"

  Each button opens WhatsApp with a pre-filled message naming the service. Projects,
  selected work, method, engagement models and contact follow. AI agents remain a
  first-class offer (the CEO's view: the strongest current demand and the nearest
  revenue to fund INFIRAD's programmes), with fields, trust controls and build steps
  inside their panel.
- **Project names:** the solar-cooling project is **نسمة شمس** on the Arabic page and
  **SolarCool** on the English page.
- **Brand System v2.1, strictly** (navy `#0A2463`, gray-blue `#8D99AE`, white and
  black, plus the derived UI surface/border/muted tokens from `colors_and_type.css`;
  Arial only, two weights; no shadows, gradients or animation; no letter-spacing on
  Arabic; monochrome icons; one language per page, bilingual tagline only in the
  footer), **with one deliberate exception: Western digits (0-9) on the Arabic page
  too.** The CEO chose them for readability, the WhatsApp number above all. Spec
  §6 asks for Arabic-Indic digits on Arabic output; this site overrides that by
  CEO decision of 2026-10-01.
- **Type is set large for reading on screen** (CEO, 2026-10-02): body 21px,
  descriptions and list points 20px, lead up to 26px, short labels 17px. Measured on
  the rendered page, no text is below 17px.
- **Evidence shown:** selected work (its introduction says it was completed earlier
  by the engineers who deliver INFIRAD's services) and the two projects,
  نسمة شمس / SolarCool and انسياب / INSYAB. Credentials and the tool list are
  deliberately left out. By CEO decision (2026-10-02) the separate disclaimer under
  selected work and the line about development-programme applications for
  نسمة شمس were removed.
- **Logos:** the bilingual lockup in the header of both pages (CEO decision,
  2026-10-02; spec §5.2 reserves it for brand moments), and the single-language
  logo in each page's footer.
- **LinkedIn** is shown as the word «لينكدإن» / "LinkedIn" linking to the company
  page, not as a bare URL.
- **Contact:** `+966 530 151 525` and `info@infiradeng.com`.

Copy comes from `profile/INFIRAD_Capability_Statement_AR.md`,
`profile/services/INFIRAD_EN_copy_deck.md` and the current site. Two statements
come from INFIRAD's own records rather than marketing material, and should be
confirmed before publishing:

1. *"The company's daily work in engineering, simulation, finance and research is
   run by a team of specialized agents under human oversight"*: the INFIRAD AI team
   in this repository.
2. The agent controls ("works on your library", "documents every output", "sends
   nothing outside the organization without human approval", "measured before it
   runs"): the design of `agent_kernel`, the base client agents are built on.

## What changed against the current site

| | current infiradev.com | this proposal |
|---|---|---|
| Positioning | "applied AI company" | strategic partner in engineering, simulation and AI agents, each with its own panel and request button |
| Evidence | none | three selected works, two programmes |
| Rendering | client-side React; the HTML has no content without JS | static HTML; crawlers and link previews read it directly |
| Link previews | no Open Graph tags | OG + Twitter card + 1200×630 images per language |
| Search | no robots.txt, no sitemap, no structured data | robots, sitemap with hreflang, schema.org `Organization` |
| Zoom | `maximum-scale=1` blocks pinch-zoom | zoom allowed |
| Brand | 57 gradients, 42 shadows, 84 animations | none |
| Languages | one page toggling languages | two monolingual pages, cross-linked |

## Deploying

In this repository the site lives in `site/`, and `.github/workflows/deploy.yml`
publishes that folder to GitHub Pages on every push to `main`, with no build step.
The custom domain `infiradev.com` is set in the repository's Pages settings and in
`site/CNAME`.

1. Merging the pull request to `main` publishes the site.
2. **Redirect `infiradeng.com` and `www.infiradeng.com` to `https://infiradev.com/`
   (301)** at the domain registrar. Today that domain, the one in every company
   email address, shows a Squarespace "Coming Soon" page.
3. Check the link preview with LinkedIn Post Inspector after deploying.

**Rolling back:** the previous React/Vite app is untouched in `client/` and
`server/`. Revert the workflow change (restore the pnpm install and build steps
and set the artifact path back to `./dist/public`) and push to `main`.

## Open items

- **Font licensing.** The brand mandates Arial. The pages use the visitor's
  installed Arial (Windows, macOS, iOS have it). Android has no Arial and falls back
  to its system sans. Self-hosting the Arial files from the brand package on a
  public site needs a Monotype web-font licence, so they are not embedded.
- The language link reads "English" on the Arabic page and «العربية» on the
  English page. That is the usual convention for a language switch, and it is the
  only text in the other language outside the footer tagline.

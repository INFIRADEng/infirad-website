#!/usr/bin/env python3
"""Build the service and project pages, in Arabic and English, from the home pages.

    python3 scripts/build_pages.py

Every page body is taken from its language's home page (site/index.html,
site/en/index.html): a service page is its panel, a project page is its card.
A service or project is therefore described in ONE place per language, and its
page cannot drift from the home page. Edit the home page, then re-run this
script. Only the page title, meta description and H1, which search engines read
first, are defined here, in PAGES below.

Each Arabic page and its English counterpart declare each other with hreflang,
and the language link in the header goes to the counterpart page. The script
also rewrites sitemap.xml from the full page list, so a page cannot be built
without being listed.

The output is committed. GitHub Pages publishes site/ as it is, with no build
step.
"""
from __future__ import annotations

import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "site"
ORIGIN = "https://infiradev.com"
ORG_ID = ORIGIN + "/#organization"
LASTMOD = "2026-10-02"

LANGS = {
    "ar": {
        "home_file": "index.html",
        "prefix": "/",
        "home": "الرئيسية",
        "projects": "المشاريع",
        "crumbs_label": "مسار الصفحة",
        "related": "ذو صلة:",
        "service_link": "الصفحة الكاملة للخدمة",
        "project_link": "صفحة المشروع",
        "lang_href": 'href="en/"',
    },
    "en": {
        "home_file": "en/index.html",
        "prefix": "/en/",
        "home": "Home",
        "projects": "Projects",
        "crumbs_label": "Breadcrumb",
        "related": "Related:",
        "service_link": "Full service page",
        "project_link": "Project page",
        "lang_href": 'href="../"',
    },
}

# One entry per page pair. "source" is the panel id (service) or the card's
# heading per language (project); "related" names another entry by key.
PAGES = {
    "engineering": {
        "kind": "service",
        "panel": "svc-eng",
        "service_type": "Engineering Services Provider (ESP): process design and independent engineering review",
        # Shown on the page itself, beside the H1, in both languages (CEO, 2026-10-03).
        "tag": "Engineering Services Provider (ESP)",
        "ar": {
            "slug": "engineering/",
            "crumb": "الهندسة",
            "title": "مقدّم خدمات هندسية (ESP): تصميم العمليات ومراجعة P&ID | انفراد",
            "h1": "الهندسة: مقدّم خدمات هندسية لتصميم العمليات والمراجعة المستقلة",
            "description": "انفراد مقدّم خدمات هندسية (Engineering Services Provider – ESP) في الرياض: تصميم العمليات من المفهوم حتى التعريف التقني، وتطوير مخطّطات PFD وP&ID ومراجعتها، ومراجعة هندسية مستقلة ومهندس المالك.",
        },
        "en": {
            "slug": "engineering/",
            "crumb": "Engineering",
            "title": "Engineering Services Provider (ESP): Process Design and P&ID Review | INFIRAD",
            "h1": "Engineering: an engineering services provider for process design and independent review",
            "description": "INFIRAD is an engineering services provider (ESP) in Riyadh, Saudi Arabia: process design from concept to technical definition, PFD and P&ID development and review, independent engineering review and owner's engineer support.",
        },
    },
    "simulation": {
        "kind": "service",
        "panel": "svc-sim",
        "service_type": "Process simulation, CFD and thermal analysis",
        "ar": {
            "slug": "simulation/",
            "crumb": "المحاكاة",
            "title": "محاكاة العمليات وديناميكا الموائع الحاسوبية CFD والتحليل الحراري | انفراد",
            "h1": "المحاكاة: محاكاة العمليات وديناميكا الموائع الحاسوبية (CFD)",
            "description": "انفراد تنمذج العمليات والأنظمة لتقيس الأداء والتكلفة وتقارن البدائل: محاكاة العمليات، وتكامل الحرارة، وديناميكا الموائع الحاسوبية CFD، والتحليل الحراري. الرياض، المملكة العربية السعودية.",
        },
        "en": {
            "slug": "simulation/",
            "crumb": "Simulation",
            "title": "Process Simulation, Computational Fluid Dynamics (CFD) and Thermal Analysis | INFIRAD",
            "h1": "Simulation: process simulation and computational fluid dynamics (CFD)",
            "description": "INFIRAD models processes and systems to measure performance and cost and compare alternatives: process simulation, heat integration, computational fluid dynamics (CFD) and thermal analysis. Riyadh, Saudi Arabia.",
        },
    },
    "agents": {
        "kind": "service",
        "panel": "svc-agents",
        "service_type": "Specialized AI agents",
        "ar": {
            "slug": "agents/",
            "crumb": "وكلاء الذكاء الاصطناعي",
            "title": "وكلاء ذكاء اصطناعي متخصصون للشركات والجهات المهنية | انفراد",
            "h1": "وكلاء ذكاء اصطناعي متخصصون لمجال عملك",
            "description": "انفراد تبني وكلاء ذكاء اصطناعي متخصصين للهندسة والمحاماة والمالية والبحث والعمليات، داخل بيئة عمل الجهة وعلى مصادرها، مع توثيق كل مُخرج وموافقة بشرية. الرياض، المملكة العربية السعودية.",
        },
        "en": {
            "slug": "agents/",
            "crumb": "AI agents",
            "title": "Specialized AI Agents for Companies and Professional Organizations | INFIRAD",
            "h1": "AI agents specialized in your field of work",
            "description": "INFIRAD builds AI agents specialized for engineering, law, finance, research and operations, inside the organization's working environment and on its own sources, with every output documented and human approval. Riyadh, Saudi Arabia.",
        },
    },
    "solar-cooling": {
        "kind": "project",
        "related": "simulation",
        # Line illustrations, not photographs: the project is at the simulation
        # stage, and a photo of real panels would read as INFIRAD's own system.
        "figure": {"src": "/assets/illustration-solar-thermal.svg", "side": "end",
                   "ar": "رسم توضيحي: ألواح تجميع حراري شمسي",
                   "en": "Illustration: solar thermal collector panels"},
        "ar": {
            "slug": "projects/nasma-shams/",
            "card": "نسمة شمس",
            "related_text": "خدمة المحاكاة",
            "crumb": "نسمة شمس",
            "title": "نسمة شمس: تبريد بالامتزاز بالطاقة الشمسية الحرارية | انفراد",
            "h1": "نسمة شمس: تبريد بالامتزاز بالطاقة الشمسية الحرارية",
            "description": "نسمة شمس مشروع من انفراد: منظومة تبريد تستخدم مُدخلاً شمسياً حرارياً لتشغيل دورة امتزاز، لتطبيقات يكون فيها الطلب الكهربائي وذروة الحمل القيدَ الحاكم.",
        },
        "en": {
            "slug": "projects/solarcool/",
            "card": "SolarCool",
            "related_text": "Simulation service",
            "crumb": "SolarCool",
            "title": "SolarCool: Solar-Thermal Adsorption Cooling | INFIRAD",
            "h1": "SolarCool: solar-thermal adsorption cooling",
            "description": "SolarCool is an INFIRAD project: a cooling system that uses solar thermal input to drive an adsorption cycle, for applications where electrical demand and peak load are the governing constraint.",
        },
    },
    "traffic": {
        "kind": "project",
        "related": "simulation",
        "figure": {"src": "/assets/illustration-road-network.svg", "side": "start",
                   "ar": "رسم توضيحي: شبكة طرق بتقاطعات ودوّار",
                   "en": "Illustration: a road network with junctions and a roundabout"},
        "ar": {
            "slug": "projects/insiyab/",
            "card": "انسياب",
            "related_text": "خدمة المحاكاة",
            "crumb": "انسياب",
            "title": "انسياب: محاكاة مرورية لاختبار القرارات قبل التنفيذ | انفراد",
            "h1": "انسياب: محاكاة مرورية لاختبار القرارات قبل التنفيذ",
            "description": "انسياب مشروع من انفراد ينمذج الشبكة المرورية ويعايرها على السلوك المرصود، ثم يحاكي التعديل المقترح ويقيس أثره ويقارن البدائل قبل التنفيذ.",
        },
        "en": {
            "slug": "projects/insyab/",
            "card": "INSYAB",
            "related_text": "Simulation service",
            "crumb": "INSYAB",
            "title": "INSYAB: Traffic Simulation to Test Decisions Before They Are Built | INFIRAD",
            "h1": "INSYAB: traffic simulation to test decisions before they are built",
            "description": "INSYAB is an INFIRAD project that models the traffic network, calibrates it to observed behavior, then simulates a proposed change, measures its effect and compares alternatives before construction.",
        },
    },
}


def read(p: Path) -> str:
    return p.read_text(encoding="utf-8")


def write(p: Path, s: str) -> None:
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(s, encoding="utf-8", newline="\n")


def url_of(lang: str, slug: str = "") -> str:
    return ORIGIN + LANGS[lang]["prefix"] + slug


def path_of(lang: str, slug: str = "") -> str:
    return LANGS[lang]["prefix"] + slug


def root_assets(s: str) -> str:
    """Root-relative asset paths work at any depth."""
    return re.sub(r'(href|src)="(?:\.\./)?assets/', r'\1="/assets/', s)


def panel_inner(home: str, panel_id: str, lang: str) -> str:
    m = re.search(rf'<section class="svc-panel" id="{panel_id}"[^>]*>(.*?)\n        </section>', home, re.S)
    if not m:
        raise SystemExit(f"panel {panel_id} not found in the {lang} home page")
    inner = m.group(1)
    # The panel's link to this very page is not repeated on it.
    inner = re.sub(r'\s*<p class="panel-more">.*?</p>', "", inner, flags=re.S)
    # One H1 per page: the panel's lead heading becomes the page's first H2.
    inner = inner.replace("<h3>", "<h2>", 1).replace("</h3>", "</h2>", 1)
    # An in-page link to a project card points at the project's own page.
    for key, cfg in PAGES.items():
        if cfg["kind"] == "project":
            p = cfg[lang]
            inner = inner.replace(f'href="#programs">{p["card"]}</a>', f'href="{path_of(lang, p["slug"])}">{p["card"]}</a>')
    return inner


def program_card(home: str, name: str, lang: str) -> str:
    for art in re.findall(r'<article class="program">.*?</article>', home, re.S):
        if f"<h3>{name}</h3>" in art:
            art = re.sub(r'\s*<p class="program-more">.*?</p>', "", art, flags=re.S)
            # One H1 per page: the card's heading becomes the page's first H2.
            return art.replace("<h3>", "<h2>").replace("</h3>", "</h2>")
    raise SystemExit(f"project card {name} not found in the {lang} home page")


def page_head(home: str, lang: str, url: str, alternates: dict, cfg: dict, graph: list) -> str:
    head = home[: home.index("</head>")]
    head = re.sub(r"<title>.*?</title>", f"<title>{html.escape(cfg['title'], quote=False)}</title>", head)
    head = re.sub(r'<meta name="description" content="[^"]*">',
                  f'<meta name="description" content="{html.escape(cfg["description"])}">', head)
    head = re.sub(r'<link rel="canonical" href="[^"]*">', f'<link rel="canonical" href="{url}">', head)
    head = re.sub(r'<link rel="alternate" hreflang="[^"]*" href="[^"]*">\n', "", head)
    alt_links = "".join(f'<link rel="alternate" hreflang="{code}" href="{href}">\n' for code, href in alternates.items())
    head = head.replace(f'<link rel="canonical" href="{url}">\n', f'<link rel="canonical" href="{url}">\n{alt_links}')
    head = re.sub(r'<meta property="og:url" content="[^"]*">', f'<meta property="og:url" content="{url}">', head)
    head = re.sub(r'<meta property="og:title" content="[^"]*">',
                  f'<meta property="og:title" content="{html.escape(cfg["title"])}">', head)
    head = re.sub(r'<meta property="og:description" content="[^"]*">',
                  f'<meta property="og:description" content="{html.escape(cfg["description"])}">', head)
    head = root_assets(head)
    ld = json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, separators=(",", ":"))
    head = re.sub(r'(<script type="application/ld\+json">\n).*?(\n</script>)', lambda m: m.group(1) + ld + m.group(2), head, flags=re.S)
    return head + "</head>\n"


def page_header(home: str, lang: str, counterpart: str) -> str:
    header = re.search(r'<header class="site-header">.*?</header>', home, re.S).group(0)
    header = root_assets(header).replace('href="./"', f'href="{path_of(lang)}"')
    targets = {"#svc-eng": "engineering", "#svc-sim": "simulation", "#svc-agents": "agents"}
    for anchor, key in targets.items():
        header = header.replace(f'href="{anchor}"', f'href="{path_of(lang, PAGES[key][lang]["slug"])}"')
    for anchor in ("#programs", "#contact"):
        header = header.replace(f'href="{anchor}"', f'href="{path_of(lang)}{anchor}"')
    # The language link goes to this page in the other language, not to the other home page.
    return header.replace(LANGS[lang]["lang_href"], f'href="{counterpart}"')


def footer(home: str) -> str:
    return root_assets(re.search(r'<footer class="site-footer">.*?</footer>', home, re.S).group(0))


def skip_link(home: str) -> str:
    return re.search(r'<a class="skip"[^>]*>.*?</a>', home).group(0)


def org_node(home: str) -> dict:
    ld = json.loads(re.search(r'ld\+json">\n(.*?)\n</script>', home, re.S).group(1))
    return next(n for n in ld["@graph"] if n.get("@type") == "Organization")


def build_page(key: str, lang: str, homes: dict) -> str:
    entry, cfg, L = PAGES[key], PAGES[key][lang], LANGS[lang]
    home = homes[lang]
    other = "en" if lang == "ar" else "ar"
    url = url_of(lang, cfg["slug"])
    alternates = {"ar": url_of("ar", entry["ar"]["slug"]), "en": url_of("en", entry["en"]["slug"]),
                  "x-default": url_of("ar", entry["ar"]["slug"])}
    crumbs = [(L["home"], url_of(lang))]
    if entry["kind"] == "project":
        crumbs.append((L["projects"], url_of(lang) + "#programs"))
    crumbs.append((cfg["crumb"], url))
    graph = [
        org_node(home),
        {"@type": "WebPage", "@id": url + "#webpage", "url": url, "name": cfg["title"], "inLanguage": lang,
         "isPartOf": {"@id": url_of(lang) + "#website"}, "about": {"@id": ORG_ID},
         "breadcrumb": {"@id": url + "#breadcrumb"}},
        {"@type": "BreadcrumbList", "@id": url + "#breadcrumb", "itemListElement": [
            {"@type": "ListItem", "position": i + 1, "name": n, "item": u} for i, (n, u) in enumerate(crumbs)]},
    ]
    if entry["kind"] == "service":
        graph.append({"@type": "Service", "@id": url + "#service", "name": cfg["h1"], "serviceType": entry["service_type"],
                      "description": cfg["description"], "url": url, "provider": {"@id": ORG_ID}})
    sep = ' <span aria-hidden="true">‹</span> ' if lang == "ar" else ' <span aria-hidden="true">›</span> '
    crumb_html = sep.join(
        f'<a href="{u[len(ORIGIN):]}">{html.escape(n, quote=False)}</a>' if i < len(crumbs) - 1
        else f'<span aria-current="page">{html.escape(n, quote=False)}</span>'
        for i, (n, u) in enumerate(crumbs))
    # No lead line under the H1: the home page's one-line summary repeats the H1 almost word for word.
    # A service may carry a label shown beside its H1, in English on both pages.
    tag = (f'      <p class="page-tag" lang="en" dir="ltr">{html.escape(entry["tag"], quote=False)}</p>\n'
           if entry.get("tag") else "")
    hero = (
        '  <section class="hero page-hero" aria-labelledby="page-title">\n    <div class="wrap">\n'
        f'      <nav class="crumbs label" aria-label="{L["crumbs_label"]}">{crumb_html}</nav>\n'
        f'      <h1 id="page-title">{html.escape(cfg["h1"], quote=False)}</h1>\n'
        f'{tag}'
        '    </div>\n  </section>\n'
    )
    if entry["kind"] == "service":
        body = (
            '  <section class="section page-body">\n    <div class="wrap">\n'
            f'      <div class="svc-panel">{panel_inner(home, entry["panel"], lang)}\n      </div>\n'
            '    </div>\n  </section>\n'
        )
    else:
        rel = PAGES[entry["related"]][lang]
        fig = entry["figure"]
        body = (
            '  <section class="section on-navy page-body">\n    <div class="wrap">\n'
            f'      <div class="project-layout figure-{fig["side"]}">\n      <div class="programs">\n'
            f'        {program_card(home, cfg["card"], lang)}\n      </div>\n'
            f'      <figure class="project-figure"><img src="{fig["src"]}" alt="{html.escape(fig[lang])}" width="480" height="360" loading="lazy"></figure>\n'
            '      </div>\n'
            f'      <p class="related">{L["related"]} <a href="{path_of(lang, rel["slug"])}">{html.escape(cfg["related_text"], quote=False)}</a></p>\n'
            '    </div>\n  </section>\n'
        )
    page = (page_head(home, lang, url, alternates, cfg, graph) + "<body>\n"
            + skip_link(home) + "\n\n"
            + page_header(home, lang, path_of(other, entry[other]["slug"])) + '\n\n<main id="main">\n\n'
            + hero + "\n" + body + "\n</main>\n\n" + footer(home) + "\n</body>\n</html>\n")
    write(SITE / L["prefix"].lstrip("/") / cfg["slug"] / "index.html", page)
    return url


def link_home_to_pages(lang: str) -> None:
    """Give each panel and project card on a home page a link to its page (idempotent)."""
    path = SITE / LANGS[lang]["home_file"]
    home = read(path)
    for key, entry in PAGES.items():
        cfg = entry[lang]
        if entry["kind"] == "service":
            m = re.search(rf'(<section class="svc-panel" id="{entry["panel"]}".*?)(\n          <div class="panel-foot">)', home, re.S)
            if 'class="panel-more"' not in m.group(1)[-400:]:
                link = f'\n          <p class="panel-more"><a href="{cfg["slug"]}">{LANGS[lang]["service_link"]}</a></p>'
                home = home[: m.end(1)] + link + home[m.end(1):]
        else:
            m = re.search(rf'(<article class="program">\s*<span class="status">[^<]*</span>\s*<h3>{re.escape(cfg["card"])}</h3>.*?)(\n        </article>)', home, re.S)
            if 'class="program-more"' not in m.group(1):
                link = f'\n          <p class="program-more"><a href="{cfg["slug"]}">{LANGS[lang]["project_link"]}</a></p>'
                home = home[: m.end(1)] + link + home[m.end(1):]
    write(path, home)


def write_sitemap() -> None:
    """The sitemap is generated from the page list, so every built page is listed with its alternates."""
    groups = [{"ar": url_of("ar"), "en": url_of("en")}]
    groups += [{"ar": url_of("ar", e["ar"]["slug"]), "en": url_of("en", e["en"]["slug"])} for e in PAGES.values()]
    out = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">']
    for g in groups:
        for lang in ("ar", "en"):
            out += ["  <url>", f"    <loc>{g[lang]}</loc>", f"    <lastmod>{LASTMOD}</lastmod>"]
            out += [f'    <xhtml:link rel="alternate" hreflang="{c}" href="{g[c]}"/>' for c in ("ar", "en")]
            out.append("  </url>")
    out.append("</urlset>")
    write(SITE / "sitemap.xml", "\n".join(out) + "\n")


if __name__ == "__main__":
    for lang in LANGS:
        link_home_to_pages(lang)
    homes = {lang: read(SITE / LANGS[lang]["home_file"]) for lang in LANGS}
    built = [build_page(key, lang, homes) for key in PAGES for lang in LANGS]
    write_sitemap()
    print("\n".join(built))

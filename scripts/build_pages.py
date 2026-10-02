#!/usr/bin/env python3
"""Build the Arabic service and project pages from the home page.

    python3 scripts/build_pages.py

Every page body is taken from site/index.html: a service page is its panel, a
project page is its card. A service or project is therefore described in ONE
place, and its page cannot drift from the home page. Edit the home page, then
re-run this script. Only the page title, meta description and H1, which
search engines read first, are defined here, in PAGES below.

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

# slug -> where the body comes from on the home page, and what search reads first.
PAGES = {
    "engineering/": {
        "source": ("panel", "svc-eng"),
        "kind": "service",
        "crumb": "الهندسة",
        "title": "تصميم العمليات ومراجعة P&ID والمراجعة الهندسية المستقلة | انفراد",
        "h1": "الهندسة: تصميم العمليات ومراجعة هندسية مستقلة",
        "description": "انفراد تصمّم العمليات من المفهوم حتى التعريف التقني، وتطوّر مخطّطات PFD وP&ID وتراجعها، وتقدّم مراجعة هندسية مستقلة ومهندس المالك. الرياض، المملكة العربية السعودية.",
        "service_type": "Process design and independent engineering review",
    },
    "simulation/": {
        "source": ("panel", "svc-sim"),
        "kind": "service",
        "crumb": "المحاكاة",
        "title": "محاكاة العمليات وديناميكا الموائع الحاسوبية CFD والتحليل الحراري | انفراد",
        "h1": "المحاكاة: محاكاة العمليات وديناميكا الموائع الحاسوبية (CFD)",
        "description": "انفراد تنمذج العمليات والأنظمة لتقيس الأداء والتكلفة وتقارن البدائل: محاكاة العمليات، وتكامل الحرارة، وديناميكا الموائع الحاسوبية CFD، والتحليل الحراري. الرياض، المملكة العربية السعودية.",
        "service_type": "Process simulation, CFD and thermal analysis",
    },
    "agents/": {
        "source": ("panel", "svc-agents"),
        "kind": "service",
        "crumb": "وكلاء الذكاء الاصطناعي",
        "title": "وكلاء ذكاء اصطناعي متخصصون للشركات والجهات المهنية | انفراد",
        "h1": "وكلاء ذكاء اصطناعي متخصصون لمجال عملك",
        "description": "انفراد تبني وكلاء ذكاء اصطناعي متخصصين للهندسة والمحاماة والمالية والبحث والعمليات، داخل بيئة عمل الجهة وعلى مصادرها، مع توثيق كل مُخرج وموافقة بشرية. الرياض، المملكة العربية السعودية.",
        "service_type": "Specialized AI agents",
    },
    "projects/nasma-shams/": {
        "source": ("program", "نسمة شمس"),
        "kind": "project",
        "crumb": "نسمة شمس",
        "title": "نسمة شمس: تبريد بالامتزاز بالطاقة الشمسية الحرارية | انفراد",
        "h1": "نسمة شمس: تبريد بالامتزاز بالطاقة الشمسية الحرارية",
        "description": "نسمة شمس مشروع من انفراد: منظومة تبريد تستخدم مُدخلاً شمسياً حرارياً لتشغيل دورة امتزاز، لتطبيقات يكون فيها الطلب الكهربائي وذروة الحمل القيدَ الحاكم.",
        "related": ("simulation/", "خدمة المحاكاة"),
    },
    "projects/insiyab/": {
        "source": ("program", "انسياب"),
        "kind": "project",
        "crumb": "انسياب",
        "title": "انسياب: محاكاة مرورية لاختبار القرارات قبل التنفيذ | انفراد",
        "h1": "انسياب: محاكاة مرورية لاختبار القرارات قبل التنفيذ",
        "description": "انسياب مشروع من انفراد ينمذج الشبكة المرورية ويعايرها على السلوك المرصود، ثم يحاكي التعديل المقترح ويقيس أثره ويقارن البدائل قبل التنفيذ.",
        "related": ("simulation/", "خدمة المحاكاة"),
    },
}

# Text the home page needs so that a reader (and a crawler) can reach each page.
SERVICE_LINK_TEXT = "الصفحة الكاملة للخدمة"
PROJECT_LINK_TEXT = "صفحة المشروع"


def read(p: Path) -> str:
    return p.read_text(encoding="utf-8")


def write(p: Path, s: str) -> None:
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(s, encoding="utf-8", newline="\n")


def panel_inner(home: str, panel_id: str) -> str:
    m = re.search(rf'<section class="svc-panel" id="{panel_id}"[^>]*>(.*?)\n        </section>', home, re.S)
    if not m:
        raise SystemExit(f"panel {panel_id} not found in site/index.html")
    inner = m.group(1)
    # The panel's own link back to the home page, if the home page carries one, is not repeated.
    inner = re.sub(r'\s*<p class="panel-more">.*?</p>', "", inner, flags=re.S)
    # One H1 per page: the panel's lead heading becomes the page's first H2.
    inner = inner.replace("<h3>", "<h2>", 1).replace("</h3>", "</h2>", 1)
    inner = inner.replace('href="#programs">انسياب</a>', 'href="/projects/insiyab/">انسياب</a>')
    return inner


def program_card(home: str, name: str) -> str:
    for art in re.findall(r'<article class="program">.*?</article>', home, re.S):
        if f"<h3>{name}</h3>" in art:
            art = re.sub(r'\s*<p class="program-more">.*?</p>', "", art, flags=re.S)
            # One H1 per page: the card's heading becomes the page's first H2.
            return art.replace("<h3>", "<h2>").replace("</h3>", "</h2>")
    raise SystemExit(f"program {name} not found in site/index.html")


def head_and_header(home: str) -> tuple[str, str]:
    head = home[: home.index("</head>")]
    header = re.search(r'<header class="site-header">.*?</header>', home, re.S).group(0)
    return head, header


def page_head(home: str, url: str, cfg: dict, graph: list) -> str:
    head, _ = head_and_header(home)
    head = re.sub(r"<title>.*?</title>", f"<title>{html.escape(cfg['title'], quote=False)}</title>", head)
    head = re.sub(r'<meta name="description" content="[^"]*">',
                  f'<meta name="description" content="{html.escape(cfg["description"])}">', head)
    head = re.sub(r'<link rel="canonical" href="[^"]*">', f'<link rel="canonical" href="{url}">', head)
    # The service and project pages exist in Arabic only for now, so they declare no language alternates.
    head = re.sub(r'<link rel="alternate" hreflang="[^"]*" href="[^"]*">\n', "", head)
    head = re.sub(r'<meta property="og:url" content="[^"]*">', f'<meta property="og:url" content="{url}">', head)
    head = re.sub(r'<meta property="og:title" content="[^"]*">',
                  f'<meta property="og:title" content="{html.escape(cfg["title"])}">', head)
    head = re.sub(r'<meta property="og:description" content="[^"]*">',
                  f'<meta property="og:description" content="{html.escape(cfg["description"])}">', head)
    # Root-relative asset paths work at any depth.
    head = head.replace('href="assets/', 'href="/assets/')
    ld = json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, separators=(",", ":"))
    head = re.sub(r'(<script type="application/ld\+json">\n).*?(\n</script>)', lambda m: m.group(1) + ld + m.group(2), head, flags=re.S)
    return head + "</head>\n"


def page_header(home: str) -> str:
    _, header = head_and_header(home)
    header = header.replace('href="./"', 'href="/"').replace('src="assets/', 'src="/assets/')
    for anchor, page in (("#svc-eng", "/engineering/"), ("#svc-sim", "/simulation/"), ("#svc-agents", "/agents/"),
                         ("#programs", "/#programs"), ("#contact", "/#contact")):
        header = header.replace(f'href="{anchor}"', f'href="{page}"')
    return header.replace('href="en/"', 'href="/en/"')


def footer(home: str) -> str:
    f = re.search(r'<footer class="site-footer">.*?</footer>', home, re.S).group(0)
    return f.replace('src="assets/', 'src="/assets/')


def org_node(home: str) -> dict:
    ld = json.loads(re.search(r'ld\+json">\n(.*?)\n</script>', home, re.S).group(1))
    return next(n for n in ld["@graph"] if n.get("@type") == "Organization")


def build() -> list[str]:
    home = read(SITE / "index.html")
    org = org_node(home)
    built = []
    for slug, cfg in PAGES.items():
        url = f"{ORIGIN}/{slug}"
        crumbs = [("الرئيسية", f"{ORIGIN}/")]
        if cfg["kind"] == "project":
            crumbs.append(("المشاريع", f"{ORIGIN}/#programs"))
        crumbs.append((cfg["crumb"], url))
        graph = [
            org,
            {"@type": "WebPage", "@id": url + "#webpage", "url": url, "name": cfg["title"], "inLanguage": "ar",
             "isPartOf": {"@id": f"{ORIGIN}/#website"}, "about": {"@id": ORG_ID},
             "breadcrumb": {"@id": url + "#breadcrumb"}},
            {"@type": "BreadcrumbList", "@id": url + "#breadcrumb", "itemListElement": [
                {"@type": "ListItem", "position": i + 1, "name": n, "item": u} for i, (n, u) in enumerate(crumbs)]},
        ]
        if cfg["kind"] == "service":
            graph.append({"@type": "Service", "@id": url + "#service", "name": cfg["h1"], "serviceType": cfg["service_type"],
                          "description": cfg["description"], "url": url, "provider": {"@id": ORG_ID}})
        crumb_html = " <span aria-hidden=\"true\">‹</span> ".join(
            f'<a href="{u[len(ORIGIN):]}">{n}</a>' if i < len(crumbs) - 1 else f'<span aria-current="page">{n}</span>'
            for i, (n, u) in enumerate(crumbs))
        # No lead line under the H1: the home page's one-line summary repeats the H1 almost word for word.
        lead = ""
        hero = (
            '  <section class="hero page-hero" aria-labelledby="page-title">\n    <div class="wrap">\n'
            f'      <nav class="crumbs label" aria-label="مسار الصفحة">{crumb_html}</nav>\n'
            f'      <h1 id="page-title">{html.escape(cfg["h1"], quote=False)}</h1>{lead}\n'
            '    </div>\n  </section>\n'
        )
        if cfg["kind"] == "service":
            body = (
                '  <section class="section page-body">\n    <div class="wrap">\n'
                f'      <div class="svc-panel">{panel_inner(home, cfg["source"][1])}\n      </div>\n'
                '    </div>\n  </section>\n'
            )
        else:
            rel_slug, rel_name = cfg["related"]
            body = (
                '  <section class="section on-navy page-body">\n    <div class="wrap">\n      <div class="programs">\n'
                f'        {program_card(home, cfg["source"][1])}\n      </div>\n'
                f'      <p class="related">ذو صلة: <a href="/{rel_slug}">{rel_name}</a></p>\n'
                '    </div>\n  </section>\n'
            )
        page = (page_head(home, url, cfg, graph) + "<body>\n"
                '<a class="skip" href="#main">انتقل إلى المحتوى</a>\n\n'
                + page_header(home) + '\n\n<main id="main">\n\n' + hero + "\n" + body + "\n</main>\n\n"
                + footer(home) + "\n</body>\n</html>\n")
        write(SITE / slug / "index.html", page)
        built.append(url)
    return built


def link_home_to_pages() -> None:
    """Give each panel and project card on the home page a link to its page (idempotent)."""
    path = SITE / "index.html"
    home = read(path)
    for slug, cfg in PAGES.items():
        kind, key = cfg["source"]
        if kind == "panel":
            m = re.search(rf'(<section class="svc-panel" id="{key}".*?)(\n          <div class="panel-foot">)', home, re.S)
            if 'class="panel-more"' not in m.group(1)[-400:]:
                link = f'\n          <p class="panel-more"><a href="{slug}">{SERVICE_LINK_TEXT}</a></p>'
                home = home[: m.end(1)] + link + home[m.end(1):]
        else:
            m = re.search(rf'(<article class="program">\s*<span class="status">[^<]*</span>\s*<h3>{key}</h3>.*?)(\n        </article>)', home, re.S)
            if 'class="program-more"' not in m.group(1):
                link = f'\n          <p class="program-more"><a href="{slug}">{PROJECT_LINK_TEXT}</a></p>'
                home = home[: m.end(1)] + link + home[m.end(1):]
    write(path, home)


def update_sitemap(urls: list[str]) -> None:
    path = SITE / "sitemap.xml"
    sm = read(path)
    lastmod = re.search(r"<lastmod>(.*?)</lastmod>", sm).group(1)
    for url in urls:
        if f"<loc>{url}</loc>" not in sm:
            sm = sm.replace("</urlset>", f"  <url>\n    <loc>{url}</loc>\n    <lastmod>{lastmod}</lastmod>\n  </url>\n</urlset>")
    write(path, sm)


if __name__ == "__main__":
    link_home_to_pages()
    urls = build()
    update_sitemap(urls)
    print("\n".join(urls))

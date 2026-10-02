#!/usr/bin/env python3
"""Search-visibility checks for the static site in site/.

Standard library only, so it runs anywhere Python 3.9+ runs.

    python3 scripts/check_seo.py           # check the files in site/
    python3 scripts/check_seo.py --live    # also fetch https://infiradev.com and check what is served

Exit code 0 = every check passed, 1 = at least one failed. Each failure says
what is wrong and where. It checks the technical layer only (indexability,
canonical/hreflang, sitemap, structured data, icons). It never judges the
page copy.
"""
from __future__ import annotations

import json
import re
import struct
import sys
import urllib.error
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent / "site"
ORIGIN = "https://infiradev.com"
ORG_ID = ORIGIN + "/#organization"
# The spellings people actually type. A search for the Arabic brand name is
# usually typed without diacritics, so the plain form must be declared.
REQUIRED_ORG_NAMES = {"INFIRAD", "انفراد", "انفِراد"}
HOMES = {ORIGIN + "/", ORIGIN + "/en/"}


def sitemap_pages() -> dict:
    """Every page the sitemap lists, mapped to its file in site/."""
    sm = (SITE / "sitemap.xml").read_text(encoding="utf-8")
    return {f"site/{u[len(ORIGIN):].lstrip('/')}index.html": u for u in re.findall(r"<loc>(.*?)</loc>", sm)}


PAGES = sitemap_pages()

failures: list[str] = []
passes: list[str] = []


def check(ok: bool, what: str) -> None:
    (passes if ok else failures).append(what)


class Head(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: list[dict] = []
        self.metas: list[dict] = []
        self.ldjson: list[str] = []
        self.html_attrs: dict = {}
        self._in_ld = False

    def handle_starttag(self, tag, attrs):
        a = {k: (v or "") for k, v in attrs}
        if tag == "html":
            self.html_attrs = a
        elif tag == "link":
            self.links.append(a)
        elif tag == "meta":
            self.metas.append(a)
        elif tag == "script" and a.get("type") == "application/ld+json":
            self._in_ld = True
            self.ldjson.append("")

    def handle_endtag(self, tag):
        if tag == "script":
            self._in_ld = False

    def handle_data(self, data):
        if self._in_ld:
            self.ldjson[-1] += data


def png_size(path: Path) -> tuple[int, int]:
    head = path.read_bytes()[:24]
    if head[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError(f"{path} is not a PNG")
    return struct.unpack(">II", head[16:24])


def resolve(page_url: str, href: str) -> Path:
    """Map a link on a page to the file in site/ that GitHub Pages serves for it."""
    if href.startswith(ORIGIN):
        href = href[len(ORIGIN):]
    if href.startswith("/"):
        rel = href.lstrip("/")
    else:
        base = page_url[len(ORIGIN):].lstrip("/")
        rel = str(Path(base) / href) if base else href
        parts: list[str] = []
        for p in rel.split("/"):
            if p == "..":
                parts.pop()
            elif p not in ("", "."):
                parts.append(p)
        rel = "/".join(parts)
    return SITE / rel


def check_pages() -> dict:
    org_nodes = {}
    hreflang_maps = {}
    for rel, url in PAGES.items():
        path = SITE.parent / rel
        text = path.read_text(encoding="utf-8")
        h = Head()
        h.feed(text)

        robots = [m.get("content", "") for m in h.metas if m.get("name", "").lower() == "robots"]
        check(not any("noindex" in r.lower() for r in robots), f"{rel}: no noindex")

        canon = [l["href"] for l in h.links if l.get("rel") == "canonical"]
        check(canon == [url], f"{rel}: one canonical, equal to {url} (found {canon})")

        alts = {l.get("hreflang"): l.get("href") for l in h.links if l.get("rel") == "alternate" and l.get("hreflang")}
        if alts or url in HOMES:
            hreflang_maps[url] = alts
            check(alts.get(h.html_attrs.get("lang")) == url,
                  f"{rel}: hreflang for its own language ({h.html_attrs.get('lang')}) points to itself")
            check("x-default" in alts, f"{rel}: has hreflang x-default")

        title = re.search(r"<title>(.*?)</title>", text, re.S)
        check(bool(title and title.group(1).strip()), f"{rel}: has a <title>")
        desc = [m for m in h.metas if m.get("name") == "description" and m.get("content")]
        check(len(desc) == 1, f"{rel}: one meta description")

        icons = [l for l in h.links if l.get("rel") in ("icon", "apple-touch-icon")]
        check(bool(icons), f"{rel}: declares icons")
        for l in icons:
            f = resolve(url, l["href"])
            if not f.exists():
                check(False, f"{rel}: icon {l['href']} exists ({f})")
                continue
            if f.suffix == ".png":
                w, hgt = png_size(f)
                check(w == hgt, f"{rel}: icon {l['href']} is square ({w}x{hgt})")
                if l.get("rel") == "icon":
                    # Google Search shows a favicon only if it is square and a multiple of 48px.
                    check(w % 48 == 0, f"{rel}: icon {l['href']} is a multiple of 48px ({w})")
        check((SITE / "favicon.ico").exists(), "site/favicon.ico exists (fallback that crawlers and browsers request)")

        check(len(h.ldjson) == 1, f"{rel}: exactly one JSON-LD block")
        try:
            data = json.loads(h.ldjson[0])
        except (IndexError, json.JSONDecodeError) as e:
            check(False, f"{rel}: JSON-LD parses ({e})")
            continue
        nodes = data.get("@graph", [data])
        by_type = {}
        for n in nodes:
            by_type.setdefault(n.get("@type"), []).append(n)
        orgs = by_type.get("Organization", [])
        check(len(orgs) == 1, f"{rel}: one Organization node")
        if orgs:
            o = orgs[0]
            org_nodes[rel] = o
            check(o.get("@id") == ORG_ID, f"{rel}: Organization @id is {ORG_ID}")
            names = {o.get("name")} | set(o.get("alternateName") or [])
            check(REQUIRED_ORG_NAMES <= names,
                  f"{rel}: Organization names include {sorted(REQUIRED_ORG_NAMES)} (missing {sorted(REQUIRED_ORG_NAMES - names)})")
            logo = o.get("logo", {})
            logo_url = logo.get("url") if isinstance(logo, dict) else logo
            lf = resolve(url, logo_url or "")
            check(lf.exists(), f"{rel}: Organization logo exists ({logo_url})")
            if lf.exists() and lf.suffix == ".png":
                w, hgt = png_size(lf)
                check(min(w, hgt) >= 112, f"{rel}: logo is at least 112px on each side ({w}x{hgt})")
            check(bool(o.get("sameAs")), f"{rel}: Organization has sameAs profiles")
        pages = by_type.get("WebPage", [])
        check(len(pages) == 1 and pages[0].get("url") == url, f"{rel}: one WebPage node whose url is the page")
        if url in HOMES:
            sites = by_type.get("WebSite", [])
            check(len(sites) == 1 and sites[0].get("url") == url,
                  f"{rel}: one WebSite node whose url is the page ({url})")
            if sites:
                check(sites[0].get("inLanguage") == h.html_attrs.get("lang"),
                      f"{rel}: WebSite inLanguage matches <html lang>")
        else:
            crumbs = by_type.get("BreadcrumbList", [])
            items = crumbs[0].get("itemListElement", []) if crumbs else []
            check(bool(items) and items[-1].get("item") == url and items[0].get("item") in HOMES
                  and (items[0]["item"] == ORIGIN + "/en/") == (h.html_attrs.get("lang") == "en"),
                  f"{rel}: breadcrumb runs from its own language's home page to this page")
            h1 = re.findall(r"<h1[^>]*>", text)
            check(len(h1) == 1, f"{rel}: exactly one <h1> ({len(h1)})")

    # The two pages must describe ONE company, or a search engine may see two.
    keys = ("@id", "name", "url", "alternateName", "logo", "telephone", "email", "sameAs")
    vals = [{k: o.get(k) for k in keys} for o in org_nodes.values()]
    check(len(vals) == len(PAGES) and all(v == vals[0] for v in vals),
          "Organization identity is identical on every page")

    # hreflang must be reciprocal: every alternate a page names must name the same set back.
    for url, alts in hreflang_maps.items():
        for code, href in alts.items():
            if code == "x-default":
                continue
            check(hreflang_maps.get(href) == alts,
                  f"hreflang on {url} is returned identically by its {code} alternate {href}")
    return hreflang_maps


def check_sitemap_and_robots(hreflang_maps: dict) -> None:
    robots = (SITE / "robots.txt").read_text(encoding="utf-8")
    check(f"Sitemap: {ORIGIN}/sitemap.xml" in robots, "robots.txt names the sitemap")
    check(not re.search(r"^\s*Disallow:\s*/\s*$", robots, re.M), "robots.txt does not disallow the whole site")
    sm = (SITE / "sitemap.xml").read_text(encoding="utf-8")
    locs = re.findall(r"<loc>(.*?)</loc>", sm)
    check(all((SITE.parent / f).exists() for f in PAGES), "every sitemap URL has a page in site/")
    for loc in locs:
        block = sm[sm.index(f"<loc>{loc}</loc>"):].split("</url>")[0]
        alts = dict(re.findall(r'hreflang="([^"]+)" href="([^"]+)"', block))
        if loc not in hreflang_maps:
            check(not alts, f"sitemap declares no hreflang for {loc}, which declares none itself")
            continue
        page_alts = {k: v for k, v in hreflang_maps.get(loc, {}).items() if k != "x-default"}
        check(alts == page_alts, f"sitemap hreflang for {loc} matches the page's <link> tags")


def check_coverage_and_links() -> None:
    on_disk = {str(p.relative_to(SITE.parent)) for p in SITE.rglob("index.html")}
    check(on_disk == set(PAGES), f"sitemap covers every page on disk (missing {sorted(on_disk - set(PAGES))})")
    for rel, url in PAGES.items():
        text = (SITE.parent / rel).read_text(encoding="utf-8")
        for href in re.findall(r'<a [^>]*href="([^"#]*)(?:#[^"]*)?"', text):
            if not href or href.startswith(("http", "mailto:", "tel:")):
                continue
            target = resolve(url, href)
            if target.is_dir() or not target.suffix:
                target = target / "index.html"
            check(target.exists(), f"{rel}: internal link {href} resolves")


def fetch(url: str, follow: bool = True):
    class NoRedirect(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, *a, **k):
            return None
    opener = urllib.request.build_opener() if follow else urllib.request.build_opener(NoRedirect)
    req = urllib.request.Request(url, headers={"User-Agent": "infirad-seo-check/1.0"})
    try:
        r = opener.open(req, timeout=20)
        return r.status, r.geturl(), r.read(), dict(r.headers)
    except urllib.error.HTTPError as e:
        return e.code, url, e.read() if hasattr(e, "read") else b"", dict(e.headers or {})


def check_live() -> None:
    for rel, url in PAGES.items():
        status, final, body, _ = fetch(url)
        check(status == 200 and final == url, f"live {url}: 200 at the same URL (got {status} at {final})")
        local = (SITE.parent / rel).read_bytes()
        check(body == local, f"live {url}: served bytes equal site/ (if not, the deploy has not run yet)")
    for path in ("/robots.txt", "/sitemap.xml", "/favicon.ico", "/assets/favicon-192.png"):
        status, *_ = fetch(ORIGIN + path)
        check(status == 200, f"live {path}: 200 (got {status})")
    status, final, *_ = fetch("https://www.infiradev.com/")
    check(final == ORIGIN + "/", f"live www.infiradev.com ends at {ORIGIN}/ (got {final})")
    # The email domain. Reported, not failed: fixing it is a registrar task (see docs/seo/SEO_ROADMAP_AR.md).
    status, final, body, headers = fetch("https://infiradeng.com/", follow=False)
    loc = headers.get("Location", "")
    if status in (301, 308) and loc.rstrip("/").startswith(ORIGIN):
        passes.append(f"live infiradeng.com: {status} -> {loc}")
    else:
        print(f"PENDING  infiradeng.com is not a permanent redirect to {ORIGIN} yet "
              f"(status {status}, Location '{loc}'). Roadmap step P0-3.")


def main() -> int:
    maps = check_pages()
    check_sitemap_and_robots(maps)
    check_coverage_and_links()
    if "--live" in sys.argv:
        check_live()
    for p in passes:
        print("ok       " + p)
    for f in failures:
        print("FAIL     " + f)
    print(f"\n{len(passes)} passed, {len(failures)} failed")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())

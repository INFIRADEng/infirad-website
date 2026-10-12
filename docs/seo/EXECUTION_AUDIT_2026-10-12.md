# Search execution audit — 2026-10-12 (Asia/Riyadh)

## Repository and publication

- Reviewed baseline: 2499df872bffbb1c5ce7cdbd97655e880b46b734.
- Improvement PR: https://github.com/INFIRADEng/infirad-website/pull/9.
- Deployed merge: 616735e633dd80694c5b5075b1b475681918336c.
- SEO CI passed; deploy run 38237023387 completed successfully.
- Live verification: 568 passed, 0 failed. Google HTML verification file served exact downloaded content with HTTP 200.
- Arabic desktop and 390px mobile, plus English mobile, inspected. Generated output reproduced without a diff after rebuilding.
- GitHub connector read worked; connector PR creation returned permission error 403. Existing authenticated local Git/GitHub CLI completed branch push, PR and merge; no new credentials or access grants.

## Google Search Console

- Active owner account verified URL-prefix property https://infiradev.com/ using Google's HTML file. Domain-wide DNS verification was not performed.
- Initial inspection: Arabic home indexed. Six service pages, English home and Arabic project pages reported unknown to Google. This establishes an actual discovery gap; earlier public search tests alone did not prove it.
- Submitted https://infiradev.com/sitemap.xml. Google acknowledged submission but the sitemap report displayed Couldn't fetch (0 discovered pages). One resubmission did not immediately clear it.
- Diagnostic live test of the sitemap at 13:38 Riyadh: URL available to Google; Crawl allowed Yes; Page fetch Successful; Indexing allowed Yes. Local fetch also returned 200/application/xml; robots allows all. This does not prove sitemap processing succeeded. No duplicate sitemap aliases or DNS edits introduced.
- Performance/aggregate indexing reports are processing data. No ranking or traffic baseline is available yet.

### URL inspection and indexing requests

All 12 sitemap URLs were inspected. Arabic home was already indexed. The remaining 11 URLs initially reported unknown to Google; each request returned the visible **Indexing requested** confirmation (added to priority crawl queue):

- /en/
- /engineering/ and /en/engineering/
- /simulation/ and /en/simulation/
- /agents/ and /en/agents/
- /projects/nasma-shams/ and /en/projects/solarcool/
- /projects/insiyab/ and /en/projects/insyab/

Requests are confirmed, indexing is not. No CAPTCHA challenge was solved and no indexing quota error appeared. Final sitemap report still displayed Couldn't fetch despite the successful live diagnostic. Recheck after processing; do not assume either completion or a permanent host fault.

## Next review

Recheck sitemap report and requested URLs after Google processing; inspect chosen canonical and crawl date. Investigate persistent fetch failure rather than repeatedly resubmitting. Official troubleshooting: https://support.google.com/webmasters/answer/7451001.

Ranking improvement remains unmeasured. Next content work needs approved evidence and publishable case-study details. Google Business Profile eligibility and Bing registration remain separate external tasks. No advertising, paid links, third-party outreach, mail/DNS changes or invented client results were performed.

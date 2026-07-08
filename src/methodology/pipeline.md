---
title: "Methodology: Pipeline"
permalink: /methodology/pipeline.html
skip_chartjs: true
---

The pipeline is orchestrated by a [stage dependency graph](https://github.com/ReproDB/reprodb-pipeline/blob/main/src/stages.py) and runs monthly (on the 1st of each month) via [GitHub Actions](https://github.com/ReproDB/reprodb-pipeline/actions). The graph currently includes 17 stages, with several optional stages that only run when their inputs or caches are available:

1. **Extract DBLP data** — download and parse the DBLP XML database (~3 GB compressed) for author-paper mappings and affiliations
2. **Generate statistics** — scrape artifact evaluation results from sysartifacts/secartifacts websites and USENIX technical session pages
3. **Collect repository statistics** — gather GitHub stars/forks and archive download counts for artifact repositories
4. **Check artifact URL availability** — run monthly liveness checks over artifact URLs
5. **Generate AE participation statistics** — compare AE participation with DBLP publication counts
6. **Compute author statistics** — match papers to DBLP authors, filter by AE-active years, and compute per-author metrics
7. **Integrate ArtiFinder-discovered links** — ingest automatically discovered artifact links from the [ArtiFinder-Data](https://github.com/DistriNet/ArtiFinder-Data) dataset
8. **Generate area-specific author data** — separate systems, security, and combined stats
9. **Aggregate committee statistics** — compile AE membership and chair roles from scraped data
10. **Compute combined rankings** — apply weighted scoring formula, enforce minimum threshold, assign ranks with dense tie-breaking; ArtiFinder-discovered links are reported separately and do not affect scores
11. **Aggregate institution rankings** — sum across affiliated authors and classify institution roles
12. **Build author profiles** — generate per-author detail records
13. **Build search index** — generate the searchable data set and mark automatically discovered ArtiFinder links in search/profile views
14. **Record ranking history** — snapshot current rankings for trend tracking
15. **Generate visualizations** — build SVG charts for the methodology pages and summaries
16. **Collect paper citations via DOI** — fetch citation counts from OpenAlex/Semantic Scholar
17. **Collect baseline citations** — fetch citation counts for non-AE papers for comparison

Independent stages run in parallel where the dependency graph allows. ArtiFinder links are unverified and excluded from all AE-based rankings; they are surfaced separately in search and the dedicated ArtiFinder page. Optional stages may be skipped when their prerequisites are unavailable or their caches are still valid. All output data structures are formally defined in the [Data Schemas](https://reprodb.github.io/data-schemas/) documentation.

The complete pipeline takes ~30 minutes and processes {{ site.data.summary.total_artifacts }}+ artifact papers.

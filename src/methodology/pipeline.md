---
title: "Methodology: Pipeline"
permalink: /methodology/pipeline.html
skip_chartjs: true
---

## Pipeline

The pipeline is orchestrated by a [stage dependency graph](https://github.com/ReproDB/reprodb-pipeline/blob/main/src/stages.py) and runs monthly (1st of each month) via [GitHub Actions](https://github.com/ReproDB/reprodb-pipeline/actions):

1. **Extract DBLP data** — download and parse the DBLP XML database (~3 GB compressed) for author-paper mappings and affiliations
2. **Scrape artifact results** from sysartifacts/secartifacts websites and USENIX technical session pages
3. **Collect repository statistics** (GitHub stars/forks, Zenodo/Figshare downloads) and check artifact URL availability
4. **Compute author statistics** — match papers to DBLP authors, filter by AE-active years, compute per-author metrics
5. **Generate area-specific author data** — separate systems, security, and combined stats
6. **Aggregate committee statistics** — compile AE membership and chair roles from scraped data
7. **Compute combined rankings** — apply weighted scoring formula, enforce minimum threshold, assign ranks with dense tie-breaking
8. **Aggregate institution rankings** — sum across affiliated authors, classify institution roles
9. **Build author profiles and search index** — generate per-author detail records
10. **Record ranking history** — snapshot current rankings for trend tracking
11. **Export data** (JSON/YAML) to this website

Independent stages run in parallel where the dependency graph allows. All output data structures are formally defined in the [Data Schemas](https://reprodb.github.io/data-schemas/) documentation.

The complete pipeline takes ~30 minutes and processes {{ site.data.summary.total_artifacts }}+ artifact papers.

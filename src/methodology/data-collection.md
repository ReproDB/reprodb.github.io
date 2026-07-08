---
title: "Methodology: Data Collection"
permalink: /methodology/data-collection.html
skip_chartjs: true
---

We scrape artifact evaluation results from sysartifacts/secartifacts websites, extract paper titles, authors, badges (Available, Functional, Reproducible, Reusable) and repository URLs. For USENIX conferences (ATC, FAST) we also scrape badge data from technical session pages. AE committee data is gathered from sysartifacts/secartifacts plus direct scraping (USENIX, CHES, PETS websites).

In addition to AE results, we ingest **automatically-discovered** artifact links from [ArtiFinder](https://github.com/DistriNet/ArtiFinder) (via the [ArtiFinder-Data](https://github.com/DistriNet/ArtiFinder-Data) dataset) and match them to papers by normalized title and author list. These links are **unverified**, carry no badges, and are **excluded from every score**; see [ArtiFinder-Discovered Artifacts](#artifinder-discovered-artifacts) below.

Repository statistics (GitHub stars/forks, Zenodo/Figshare downloads) are collected via their public APIs. Artifact URLs are checked monthly for availability (HTTP HEAD requests).

Author names are matched to [DBLP](https://dblp.org) for disambiguation and total-publication counts. Author affiliations are enriched using a priority cascade:
1. **Author Index** (canonical enriched source, when available)
2. **DBLP** person pages (`<www>` tags)
3. **CSRankings** faculty records
4. **OpenAlex** API
5. **Semantic Scholar** API (fallback)
6. **AE committee data** (last resort)

Affiliation names are normalized to canonical forms (e.g., "MIT" -> "Massachusetts Institute of Technology").

All scripts are in the [reprodb-pipeline](https://github.com/ReproDB/reprodb-pipeline) repository. Full CLI reference, API documentation, and data model definitions are in the [pipeline documentation](https://reprodb.github.io/reprodb-pipeline/).

---

## ArtiFinder-Discovered Artifacts

[ArtiFinder](https://github.com/DistriNet/ArtiFinder) scrapes conference papers directly to discover links to their artifacts, independently of any artifact-evaluation process. ReproDB ingests the published [ArtiFinder-Data](https://github.com/DistriNet/ArtiFinder-Data) set and integrates it as follows:

- **Matching.** Each ArtiFinder link is matched to a ReproDB paper by **normalised title + author list** (ArtiFinder uses DBLP author names, as we do), requiring the same conference and year. When author lists are known on both sides, at least one author must overlap to guard against title collisions.
- **No badges, no scores.** ArtiFinder links are **not manually verified** and carry **no badges**. They **never** contribute to the Artifact Rate, Reproducibility Rate, combined score, or any author/institution ranking. The list also contains many papers that never went through artifact evaluation; these do not count towards any denominator either.
- **Configurable start year.** Only editions from **2017 onwards** (the start of the AE era) are ingested by default; this is configurable in the pipeline (`artifinder_min_year`).
- **Repository-statistics exception.** When ArtiFinder discovers a **GitHub** repository for a paper that *did* go through AE, that repository *may* be counted in the [repository statistics](/methodology/repository-statistics.html), since those stats are descriptive and separate from scoring.
- **Display.** Wherever an ArtiFinder link appears in search results or profiles it is marked with an **Artifinder** sign indicating it was found automatically and has not been manually verified. A dedicated [ArtiFinder discovery page](/methodology/artifinder.html) reports discovery counts and rates over time.

Throughout the site, statistics focus on **AE-evaluated** artifacts; ArtiFinder figures are reported separately (here and on the ArtiFinder page) and are always distinguished from AE results.

## Data Sources

- **[sysartifacts.github.io](https://sysartifacts.github.io)** — Systems conference artifact evaluation results ({{ site.data.summary.systems_conferences | join: ", " }})
- **[secartifacts.github.io](https://secartifacts.github.io)** — Security conference artifact evaluation results ({{ site.data.summary.security_conferences | join: ", " }})
- **[ArtiFinder-Data](https://github.com/DistriNet/ArtiFinder-Data)** — Automatically discovered artifact links (unverified, no badges, excluded from all scores)
- **[usenix.org](https://www.usenix.org)** — Badge information and AE committee data for USENIX conferences
- **[DBLP](https://dblp.org)** — Author name matching, disambiguation, and total publication counts
- **[OpenAlex](https://openalex.org)** — Author affiliation enrichment
- **[Semantic Scholar](https://www.semanticscholar.org)** — Author affiliation fallback lookup
- **[CSRankings](https://csrankings.org)** — Faculty affiliation data
- **[GitHub](https://docs.github.com/en/rest)**, **[GitLab](https://docs.gitlab.com/ee/api/)** — Repository statistics (stars, forks)
- **[Zenodo](https://developers.zenodo.org)**, **[Figshare](https://docs.figshare.com)** — Archive statistics (downloads, views)
- **[Data Schemas](https://reprodb.github.io/data-schemas/)** — JSON Schema definitions for all data structures used by this site (versioned; see [all schema versions](https://reprodb.github.io/data-schemas/))

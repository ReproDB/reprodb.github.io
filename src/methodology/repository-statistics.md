---
title: "Methodology: Repository Statistics"
permalink: /methodology/repository-statistics.html
skip_chartjs: true
---

For artifacts with GitHub/GitLab repositories or Zenodo/Figshare archives, we collect engagement metrics as supplementary signals of community uptake:

### GitHub/GitLab Metrics
- **Stars**: Number of users who starred the repository
- **Forks**: Number of times the repository was forked

### Zenodo/Figshare Metrics
- **Downloads**: Total download count from the archive platform
- **Views**: Number of views/visits to the artifact page

**Important notes:**
- Repository statistics are **displayed separately** and do not contribute to the combined score
- These metrics reflect external reuse signals but are subject to biases:
  - Age effects (older artifacts accumulate more stars)
  - Repository type differences (libraries vs. experiment code)
  - Discovery algorithm effects (GitHub trending, recommendation systems)
- We report these as observational data, not as quality judgments

---

## Artifact Citations (Experimental)

We attempted to track academic citations to artifact DOIs using [OpenAlex](https://openalex.org), querying citation counts for artifact DOIs (Zenodo and Figshare).

### Why Citation Data Is Not Included in Rankings

OpenAlex reported 14 artifacts with a total of 43 citing DOIs. We verified each citing DOI by checking [Crossref](https://www.crossref.org/) publisher-submitted reference lists for the actual artifact DOI, and detected self-citations by comparing author lists between the artifact and the citing paper.

**Result: zero genuine third-party artifact citations.** All 43 were:
- **36 false positives** - the citing paper's bibliography contains the *paper* DOI, not the artifact DOI. OpenAlex conflates these when the artifact and paper share a title.
- **6 self-citations** - the paper cites its own artifact (same authors).
- **1 unknown** - an arXiv preprint whose references could not be resolved.

Because current bibliographic indexes do not reliably distinguish artifact citations from paper citations, **citation counts are excluded from the combined score and ranking tables**. The citation collection pipeline remains available as an optional, experimental module for future use as citation infrastructure matures.

See the [verification scripts and detailed results](https://github.com/ReproDB/reprodb-pipeline) for the full analysis.

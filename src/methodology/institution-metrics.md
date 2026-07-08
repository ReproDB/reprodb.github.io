---
title: "Methodology: Institution Metrics"
permalink: /methodology/institution-metrics.html
skip_chartjs: true
---

Institution-level statistics aggregate contributions from all authors affiliated with that institution. Affiliations are determined from DBLP person pages and CSRankings faculty data.

### How Institution Data is Aggregated

All metrics are **summed across affiliated authors**:

- **Artifacts**: Total artifacts from all affiliated authors
- **Total Papers**: Total papers from all affiliated authors (AE-active years only)
- **AE Memberships**: Total committee memberships from all affiliated authors
- **Combined Score**: Sum of all affiliated authors' combined scores
- **Researchers**: Count of unique authors affiliated with the institution

**Artifact Rate and Reproducibility Rate** are then computed from these aggregated totals:

- **Institution AR%** = (Total artifacts / Total papers) x 100
- **Institution RR%** = (Total reproduced badges / Total artifacts) x 100

### Institution Role Classification

Each institution is classified based on its Artifact:Evaluation ratio (artifact_score / ae_score):

- **Artifact-focused** (Producer): A:E ratio > 2.0, or artifact-only (no AE service)
- **Evaluation-focused** (Consumer): A:E ratio < 0.5, or AE-only (no artifacts)
- **Balanced**: 0.5 <= A:E ratio <= 2.0

### Cross-Area Aggregation

For institution rankings broken down by area (systems vs. security):

- **Systems rankings**: Include only artifacts, papers, and AE service from systems conferences
- **Security rankings**: Include only artifacts, papers, and AE service from security conferences
- **Overall rankings**: Sum of systems + security contributions

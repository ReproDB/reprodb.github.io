---
title: "Methodology: Author Metrics"
permalink: /methodology/author-metrics.html
skip_chartjs: true
---

Individual author statistics are computed by matching artifact papers to DBLP records. Each metric is calculated as follows:

## Badge Definitions

We rely on each conference's official badge definitions. We treat the same badge name as comparable across venues (e.g., Available in one venue is assumed to mean the same or similar level of availability in another). We make the same assumption for Functional. For the highest tier, Reproduced (security) and Reusable (systems) are treated as equivalent.

### Artifacts
The total number of evaluated artifacts (papers with at least one badge) authored by this person across all tracked conferences.

### Total Papers
The total number of papers this author published at tracked conferences, **counting only years when that conference was conducting artifact evaluation**. For example:
- If ACSAC started AE in 2017, only papers from 2017-present are counted
- If an author published at ACSAC in 2010-2024, only 2017-2024 papers contribute to the denominator
- This prevents artificial deflation of Artifact Rate by excluding pre-AE papers

The paper count is determined by matching author names to DBLP records and filtering by conference and year.

**Clamping rule:** If DBLP undercounts papers (i.e., artifact_count > total_papers due to incomplete DBLP records), total_papers is clamped to equal artifact_count. This guarantees that Artifact Rate <= 100%.

### Artifact Rate (AR%)
The percentage of an author's papers (at AE-active conferences) that have artifact badges: **AR% = (Artifacts / Total Papers) x 100**.

**Key point:** The denominator includes only papers from years when the venue had artifact evaluation. This ensures the rate reflects artifact adoption within the relevant time window, avoiding both over-inflation (counting only artifact papers) and under-inflation (counting all historical publications).

**Cross-area handling:** For authors active in both systems and security, contributions are **summed**. If an author has 10 systems papers and 5 security papers (all in AE-active years), the denominator is 15. This additive approach is correct because systems and security conferences are disjoint publication venues.

### Reproducibility Rate (RR%)
Among papers with artifacts, the percentage achieving the highest-tier badge (Reproduced or Reusable): **RR% = (Reproduced badges / Total artifacts) x 100**.
This measures the depth of reproducibility beyond mere artifact availability.

### Artifact:Evaluation Ratio (A:E)

The A:E ratio characterizes the balance between artifact production and evaluation service: **A:E = Artifact Score / AE Score**, where:
- **Artifact Score** = sum of badge points (Available+1, Functional+1, Reproduced+1 per artifact)
- **AE Score** = committee service points (member=3, chair=5)

### AE Memberships
The number of times this author served on an artifact evaluation committee across all tracked conferences.

### Chair Count
The number of times this author served as an AE chair or co-chair.

### Combined Score

A composite metric balancing artifact production, artifact quality, and AE service: **Combined Score = Sum_i(A_i + F_i + R_i) + Sum_j(3 + B_j x 2)**, summing over *n* artifacts and *m* AE terms, where:
- **First sum** (per artifact *i*):
  - A_i = 1 if artifact *i* is Available, 0 otherwise
  - F_i = 1 if artifact *i* is Functional, 0 otherwise
  - R_i = 1 if artifact *i* is Reproduced/Reusable, 0 otherwise
  - **Maximum per artifact: 3 points** (all three badges)

- **Second sum** (committee service, per AE term *j*):
  - Each committee membership contributes **3 points**
  - B_j = 1 if term *j* is a chair role, 0 otherwise - chairs receive a **+2 bonus** for a total of **5 points** per chair term

**Minimum Score Threshold:** Only individuals and institutions with combined score >= 3 are included in rankings. Institutions with placeholder affiliations ("Unknown", etc.) are excluded.

**Ranking Method:** Dense ranking with ties - authors with the same combined score receive the same rank; the next rank is incremented by the number of tied entries.

**Why These Weights?**
- **Additive badge scoring (1 point each)** reflects that each badge level requires distinct effort (availability, functionality, reproducibility)
- **AE membership = 3 points** estimates the substantial time investment (~50 hours per evaluation cycle)
- **Chair role = 5 points** recognizes leadership and coordination responsibilities
- This formula balances artifact producers and evaluators, countering the traditional invisibility of evaluation labor in academic metrics

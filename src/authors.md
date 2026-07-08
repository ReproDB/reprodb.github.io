---
title: "Artifact Authors"
permalink: /authors.html
skip_chartjs: true
---

# Artifact Authors

Authors ranked by number of evaluated artifacts, split by research area. Click any column header to re-sort.

{% if site.data.author_summary %}
| | |
|---|---|
| **Total Authors** | {{ site.data.author_summary.total_authors }} |
{% endif %}

- [Systems Authors]({{ '/combined_rankings.html' | relative_url }}?area=systems&contrib=artifacts) — Authors at systems conferences
- [Security Authors]({{ '/combined_rankings.html' | relative_url }}?area=security&contrib=artifacts) — Authors at security conferences

---

{% include data_footer.html %}

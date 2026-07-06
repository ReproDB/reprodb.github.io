---
title: "ArtiFinder — Automatically Discovered Artifacts"
permalink: /artifinder.html
---

[ArtiFinder](https://github.com/DistriNet/ArtiFinder) scrapes conference papers directly and identifies links to their artifacts, independently of any artifact-evaluation (AE) process. This page summarises the ArtiFinder links that ReproDB ingests from the [ArtiFinder-Data](https://github.com/DistriNet/ArtiFinder-Data) repository and how they have grown over time.

ArtiFinder and its underlying longitudinal study are described by Vansteenhuyse et al., *[Not All Those Who Share Are Lost: Analyzing 25 Years of Cybersecurity Artifact Sharing Practices Through Automated Discovery](https://github.com/DistriNet/ArtiFinder)* (USENIX Security 2026).

{: .artifinder-note}
**These links are _not_ manually verified.** ArtiFinder-discovered artifacts carry **no badges** and are **excluded from every ReproDB score** (artifact rate, reproducibility rate, combined score, institution and author rankings). They are shown for discovery purposes only, marked with an <img src="{{ '/assets/images/artifinder-logo.svg' | relative_url }}" alt="" style="height:1em;vertical-align:-0.15em"> **Artifinder** sign wherever they appear in search and profiles. The one exception is repository statistics: when ArtiFinder finds a GitHub repository for a paper that _did_ go through AE, that repository may be counted in the repository stats.

{% if site.data.artifinder_summary %}

## High-Level Summary

<div class="rdb-cards">
  <div class="rdb-card">
    <div class="rdb-card-value">{{ site.data.artifinder_summary.total_discovered }}</div>
    <div class="rdb-card-label">Discovered Artifacts</div>
  </div>
  <div class="rdb-card">
    <div class="rdb-card-value">{{ site.data.artifinder_summary.total_matched_ae }}</div>
    <div class="rdb-card-label">Matched to AE Papers</div>
  </div>
  <div class="rdb-card">
    <div class="rdb-card-value">{{ site.data.artifinder_summary.github_count }}</div>
    <div class="rdb-card-label">GitHub Links</div>
  </div>
  <div class="rdb-card">
    <div class="rdb-card-value">{{ site.data.artifinder_summary.discovery_pct }}%</div>
    <div class="rdb-card-label">Discovery Rate</div>
  </div>
  <div class="rdb-card">
    <div class="rdb-card-value">{{ site.data.artifinder_summary.year_range }}</div>
    <div class="rdb-card-label">Years Included</div>
  </div>
</div>

<p class="rdb-scatter-caption">Across {{ site.data.artifinder_summary.total_papers }} scanned papers in {{ site.data.artifinder_summary.conferences | join: ", " }}, ArtiFinder discovered {{ site.data.artifinder_summary.total_discovered }} artifact links. ArtiFinder data last updated {{ site.data.artifinder_summary.data_updated }} (only editions from {{ site.data.artifinder_summary.year_range | split: "\u2013" | first }} onward are included).</p>

---

## Discovered Artifacts Over Time

Number of ArtiFinder-discovered artifact links per year, split by whether the paper also went through artifact evaluation (AE) in ReproDB. Papers that never went through AE make up the bulk of ArtiFinder's coverage.

<div class="rdb-chart-wide rdb-chart-wrap--lg">
  <div id="afDiscoveredChart" style="width:100%;height:100%"></div>
</div>

## Discovery Rate Over Time

Share of scanned papers for which ArtiFinder found an artifact link, per year. This is a coverage measure of ArtiFinder itself, not an artifact-evaluation rate.

<div class="rdb-chart-wide rdb-chart-wrap--lg">
  <div id="afRateChart" style="width:100%;height:100%"></div>
</div>

## By Conference

Discovered artifact links per conference, and how many were matched to an AE paper tracked by ReproDB.

<div class="rdb-chart-wide rdb-chart-wrap--lg">
  <div id="afConfChart" style="width:100%;height:100%"></div>
</div>

## Conference Timeline Heatmap

Discovered artifact links by conference and year. Darker cells indicate more discovered artifacts that year.

<div class="rdb-chart-wide">
  <div id="afHeatmap" style="height:360px"></div>
</div>

{% else %}

*ArtiFinder statistics are being generated. Please check back soon.*

{% endif %}

<!-- Data blob: Liquid injects site data, JS reads it -->
<script id="artifinder-data" type="application/json">
{
  "years": [{% for y in site.data.artifinder_by_year %}{{ y.year }}{% unless forloop.last %},{% endunless %}{% endfor %}],
  "discovered": [{% for y in site.data.artifinder_by_year %}{{ y.discovered }}{% unless forloop.last %},{% endunless %}{% endfor %}],
  "matched": [{% for y in site.data.artifinder_by_year %}{{ y.matched_ae }}{% unless forloop.last %},{% endunless %}{% endfor %}],
  "totalPapers": [{% for y in site.data.artifinder_by_year %}{{ y.total_papers }}{% unless forloop.last %},{% endunless %}{% endfor %}],
  "conferences": [
    {% for c in site.data.artifinder_by_conference %}
    { "name": "{{ c.name }}", "category": "{{ c.category }}", "total_papers": {{ c.total_papers }}, "discovered": {{ c.discovered }}, "matched_ae": {{ c.matched_ae }},
      "years_data": [{% for yd in c.years %}{ "year": {{ yd.year }}, "discovered": {{ yd.discovered }} }{% unless forloop.last %},{% endunless %}{% endfor %}] }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  ]
}
</script>
<script src="{{ '/assets/js/reprodb-artifinder.js' | relative_url }}"></script>

---
title: "Methodology"
permalink: /methodology.html
skip_chartjs: true
---

The following pages explain how we collect, process, and analyze artifact evaluation data, including detailed calculation formulas for all metrics displayed on this site. ReproDB also includes automatically discovered artifact links from [ArtiFinder](/methodology/artifinder.html), documented on the dedicated ArtiFinder page below.

- [Data Collection](/methodology/data-collection.html)
- [Pipeline](/methodology/pipeline.html)
- [Author Metrics](/methodology/author-metrics.html)
- [Institution Metrics](/methodology/institution-metrics.html)
- [Repository Statistics](/methodology/repository-statistics.html)
- [Search Keywords](/methodology/search-keywords.html)
- [ArtiFinder Discovery](/methodology/artifinder.html)

{% if site.data.summary %}
{% assign af = site.data.artifinder_summary %}

## Overview

<table class="page__content">
<tr><th></th><th>AE-evaluated</th><th>ArtiFinder-discovered</th></tr>
<tr><td><strong>Data Schema Version</strong></td><td>{{ site.data.summary.schema_version }}</td><td>&mdash;</td></tr>
<tr><td><strong>Artifacts / discovered links</strong></td><td>{{ site.data.summary.total_artifacts }}</td><td>{{ af.total_discovered | default: "&mdash;" }}</td></tr>
<tr><td><strong>Conferences</strong></td><td>{{ site.data.summary.total_conferences }} ({{ site.data.summary.conferences_list | join: ", " }})</td><td>{% if af %}{{ af.conferences | size }} ({{ af.conferences | join: ", " }}){% else %}&mdash;{% endif %}</td></tr>
<tr><td><strong>Years Covered</strong></td><td>{{ site.data.summary.year_range }}</td><td>{{ af.year_range | default: "&mdash;" }}</td></tr>
<tr><td><strong>Authors</strong></td><td>{{ site.data.author_summary.total_authors }}</td><td>{{ af.author_count | default: "&mdash;" }}</td></tr>
<tr><td><strong>AE Committee Members</strong></td><td>{{ site.data.committee_stats.total_members }} ({{ site.data.committee_stats.unique_members }} unique)</td><td>&mdash;</td></tr>
<tr><td><strong>Badges / scores</strong></td><td>Yes</td><td>No (unverified)</td></tr>
<tr><td><strong>Last Updated</strong></td><td><a href="https://github.com/ReproDB/reprodb-pipeline-results">{{ site.data.summary.last_updated }}</a></td><td>{{ af.data_updated | default: "&mdash;" }}</td></tr>
</table>

{% endif %}

## Conferences Covered

Data is collected from conferences tracked by [sysartifacts](https://sysartifacts.github.io) and [secartifacts](https://secartifacts.github.io):

- **Systems**: {{ site.data.summary.systems_conferences | join: ", " }}
- **Security**: {{ site.data.summary.security_conferences | join: ", " }}

---

## API Access

The full artifact dataset is available as a public JSON endpoint for programmatic access:

```
GET {{ site.url }}{{ site.baseurl }}/assets/data/search_data.json
```

Returns an array of all {{ site.data.summary.total_artifacts }} artifacts with title, authors, affiliations, conference, year, badges, and repository/artifact URLs. No authentication required.

Example using `curl`:

```bash
# Get all artifacts
curl -s {{ site.url }}{{ site.baseurl }}/assets/data/search_data.json | python3 -c "
import sys, json
data = json.load(sys.stdin)
# Filter: fuzzing papers from 2024
results = [a for a in data if 'fuzz' in a['title'].lower() and a['year'] == 2024]
print(json.dumps(results, indent=2))
"
```
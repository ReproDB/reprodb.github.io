---
title: "About"
permalink: /about.html
skip_chartjs: true
---

ReproDB and its underlying methodology are described in [*ReproDB: An Open Platform for Discovering Research Artifacts and Analyzing their Evaluation in Security and Systems*](https://vahldiek.github.io/files/acmrep26-reprodb.pdf) by Vahldiek-Oberwagner, Bognar, and Signorello (ACM REP 2026).

If you use ReproDB in your research, please cite:

```bibtex
@inproceedings{vahldiek2026reprodb,
 author = {Vahldiek-Oberwagner, Anjo and Bognar, Marton and Signorello, Salvatore},
 title = {ReproDB: An Open Platform for Discovering Research Artifacts and Analyzing their Evaluation in Security and Systems},
 booktitle = {Proceedings of the ACM Conference on Reproducibility and Replicability (ACM REP)},
 year = {2026}
}
```

### Acknowledgements

This project celebrates the work of **artifact authors** who go the extra mile to make research reproducible, and **artifact evaluation committees** (AE chairs and members) who invest time reviewing and certifying artifacts. Their contributions strengthen our scientific record. We thank the communities maintaining [sysartifacts](https://sysartifacts.github.io/) and [secartifacts](https://secartifacts.github.io/) for publishing detailed evaluation results. Inspired by [Systems Circus](https://nebelwelt.net/pubstats/) and [csrankings.org](https://csrankings.org/).

### Report Issues or Fix Bugs

Found incorrect data, a broken page, or a scraping bug? Open an issue or pull request on the relevant repository:

- [reprodb-pipeline](https://github.com/ReproDB/reprodb-pipeline) — scraping, analysis, and data generation
- [reprodb-pipeline-results](https://github.com/ReproDB/reprodb-pipeline-results) — archived outputs from each pipeline run
- [reprodb.github.io](https://github.com/ReproDB/reprodb.github.io) — this website

### Add Conference Data

AE results and committee lists live in the upstream community sites. Contribute new conferences or corrections there:

- [sysartifacts.github.io](https://github.com/sysartifacts/sysartifacts.github.io) — systems conferences (OSDI, SOSP, ATC, EuroSys, FAST, …)
- [secartifacts.github.io](https://github.com/secartifacts/secartifacts.github.io) — security conferences (USENIX Security, CCS, NDSS, S&P, …)
- [ArtiFinder-Data](https://github.com/DistriNet/ArtiFinder-Data) — automatically discovered artifact links (open to manual corrections via pull requests). These links are unverified, carry no badges, and never affect ReproDB scores; see the [ArtiFinder discovery page](/methodology/artifinder.html) and [methodology](/methodology/data-collection.html#artifinder-discovered-artifacts).

### Suggest New Analyses

Have an idea for a new statistic, visualization, or ranking? [Open a discussion](https://github.com/ReproDB/reprodb-pipeline/issues) and tell us what you'd like to see.

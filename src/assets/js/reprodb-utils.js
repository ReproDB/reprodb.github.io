/**
 * reprodb-utils.js — Shared utility functions for ReproDB website.
 *
 * Provides: window.ReproDB.escHtml, .fetchJSON, .isDark, .themeColors,
 *           .echartsTheme, .onThemeChange, .assignDenseRanks, .rankChangeHtml,
 *           .createTable (Tabulator wrapper)
 */
(function() {
  'use strict';
  var R = window.ReproDB = window.ReproDB || {};

  /** Escape HTML to prevent XSS. */
  R.escHtml = function(s) {
    if (!s) return '';
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(s));
    return d.innerHTML;
  };

  /** Fetch JSON with consistent error handling. */
  R.fetchJSON = function(url) {
    return fetch(url).then(function(r) {
      if (!r.ok) throw new Error('HTTP ' + r.status + ' for ' + url);
      return r.json();
    });
  };

  /* ─── Dark-mode theme helpers ─────────────────────────────────────── */

  R.isDark = function() {
    var t = document.documentElement.getAttribute('data-theme');
    if (t === 'dark') return true;
    if (t === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  R.themeColors = function() {
    var dark = R.isDark();
    return {
      text:       dark ? '#d6d9dc' : '#333',
      textMuted:  dark ? '#aab0b8' : '#666',
      line:       dark ? '#d6d9dc' : '#333',
      grid:       dark ? '#383c43' : '#e0e0e0',
      border:     dark ? '#4a4f57' : '#ddd',
      bg:         dark ? '#1e2127' : '#fff',
      totalLine:  dark ? '#aab0b8' : '#333',
      totalBar:   dark ? 'rgba(170,176,184,0.7)' : 'rgba(51,51,51,0.7)',
      combined:   dark ? '#7fb3d3' : '#2c3e50',
      separator:  dark ? '#6b7280' : '#999'
    };
  };

  /** Build an ECharts theme object for the current light/dark mode. */
  R.echartsTheme = function() {
    var tc = R.themeColors();
    return {
      backgroundColor: 'transparent',
      textStyle: { color: tc.text },
      title: { textStyle: { color: tc.text }, subtextStyle: { color: tc.textMuted } },
      legend: { textStyle: { color: tc.text } },
      categoryAxis: {
        axisLine: { lineStyle: { color: tc.grid } },
        axisTick: { lineStyle: { color: tc.grid } },
        axisLabel: { color: tc.text },
        splitLine: { lineStyle: { color: tc.grid } }
      },
      valueAxis: {
        axisLine: { lineStyle: { color: tc.grid } },
        axisTick: { lineStyle: { color: tc.grid } },
        axisLabel: { color: tc.text },
        splitLine: { lineStyle: { color: tc.grid } }
      },
      tooltip: {
        backgroundColor: R.isDark() ? '#2a2d34' : '#fff',
        borderColor: tc.border,
        textStyle: { color: tc.text }
      }
    };
  };

  /** Convenience: init an ECharts instance with theme and auto-resize. */
  R.initEChart = function(el) {
    if (typeof el === 'string') el = document.getElementById(el);
    if (!el) return null;
    var chart = echarts.init(el, null, { renderer: 'canvas' });

    // Wrap setOption so every call automatically re-applies theme text
    // colors to title and legend.  ECharts replaces (rather than deep-
    // merges) textStyle inside title/legend components, so any caller
    // that sets e.g. { title: { textStyle: { fontSize: 14 } } } would
    // otherwise wipe the color.
    var _origSetOption = chart.setOption.bind(chart);
    chart.setOption = function(opts, notMerge, lazyUpdate) {
      _origSetOption(opts, notMerge, lazyUpdate);
      var tc = R.themeColors();
      var patch = {};
      var cur = chart.getOption();
      if (cur.legend && cur.legend.length) {
        patch.legend = cur.legend.map(function() { return { textStyle: { color: tc.text } }; });
      }
      if (cur.title && cur.title.length) {
        patch.title = cur.title.map(function() {
          return { textStyle: { color: tc.text }, subtextStyle: { color: tc.textMuted } };
        });
      }
      if (patch.legend || patch.title) _origSetOption(patch);
    };

    // Apply theme colors so first render matches current light/dark mode
    var theme = R.echartsTheme();
    _origSetOption({
      textStyle: theme.textStyle,
      title: theme.title,
      legend: theme.legend,
      tooltip: theme.tooltip
    });
    // Auto-resize (debounced to avoid cascading layout thrashing)
    var resizeTimer;
    var ro = new ResizeObserver(function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() { chart.resize(); }, 100);
    });
    ro.observe(el);
    return chart;
  };

  /* ─── Theme change listener ───────────────────────────────────────── */

  var themeCallbacks = [];
  R.onThemeChange = function(fn) { themeCallbacks.push(fn); };
  var echartsInstances = [];
  R.registerEChart = function(chart) {
    echartsInstances.push(chart);
  };

  window.addEventListener('reprodb-theme-change', function() {
    // Update ECharts instances
    var theme = R.echartsTheme();
    echartsInstances.forEach(function(chart) {
      if (chart && !chart.isDisposed()) {
        var opt = chart.getOption();
        // Merge theme colors into existing options
        chart.setOption({
          textStyle: theme.textStyle,
          title: opt.title ? [theme.title] : undefined,
          legend: opt.legend ? (opt.legend).map(function(l) {
            return { textStyle: theme.legend.textStyle };
          }) : undefined,
          tooltip: theme.tooltip,
          xAxis: (opt.xAxis || []).map(function() {
            return { axisLine: theme.categoryAxis.axisLine, axisTick: theme.categoryAxis.axisTick,
                     axisLabel: theme.categoryAxis.axisLabel, splitLine: theme.categoryAxis.splitLine };
          }),
          yAxis: (opt.yAxis || []).map(function() {
            return { axisLine: theme.valueAxis.axisLine, axisTick: theme.valueAxis.axisTick,
                     axisLabel: theme.valueAxis.axisLabel, splitLine: theme.valueAxis.splitLine };
          })
        });
      }
    });
    // Fire page-specific callbacks
    themeCallbacks.forEach(function(fn) { fn(); });
  });

  /* ─── Ranking helpers (used by ranking table formatters) ──────────── */

  R.assignDenseRanks = function(items, nameKey) {
    var sorted = items.slice();
    sorted.sort(function(a, b) {
      var av = a.combined_score || 0, bv = b.combined_score || 0;
      if (av > bv) return -1;
      if (av < bv) return 1;
      var an = (a[nameKey] || '').toLowerCase();
      var bn = (b[nameKey] || '').toLowerCase();
      if (an < bn) return -1;
      if (an > bn) return 1;
      return 0;
    });
    var rank = 1;
    for (var i = 0; i < sorted.length; i++) {
      if (i > 0 && (sorted[i].combined_score || 0) < (sorted[i - 1].combined_score || 0)) rank++;
      sorted[i]._baseRank = rank;
    }
  };

  R.rankChangeHtml = function(baseRank, oldRank) {
    if (!baseRank || oldRank == null) return '';
    var diff = oldRank - baseRank;
    if (diff > 0) return '<span class="rdb-rank-up" title="Up ' + diff + ' from #' + oldRank + '">\u25B2' + diff + '</span>';
    if (diff < 0) return '<span class="rdb-rank-down" title="Down ' + (-diff) + ' from #' + oldRank + '">\u25BC' + (-diff) + '</span>';
    return '<span class="rank-unchanged" title="Unchanged">\u2013</span>';
  };

  /* ─── Tabulator helper ────────────────────────────────────────────── */

  /**
   * Create a Tabulator instance with ReproDB default settings.
   *
   * @param {string|HTMLElement} el - selector or element
   * @param {object} opts - Tabulator options (columns, data, etc.)
   * @returns {Tabulator}
   */
  R.createTable = function(el, opts) {
    var defaults = {
      layout: 'fitColumns',
      pagination: true,
      paginationSize: opts.paginationSize || 50,
      paginationSizeSelector: [10, 25, 50, 100],
      paginationCounter: 'rows',
      movableColumns: false,
      placeholder: 'No data available',
      headerSortClickElement: 'header'
    };
    var merged = Object.assign({}, defaults, opts);
    return new Tabulator(el, merged);
  };
})();

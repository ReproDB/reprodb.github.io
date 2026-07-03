/**
 * reprodb-artifinder.js — Chart logic for the ArtiFinder discovery page.
 *
 * Depends on: ECharts 5 (loaded globally via head/custom.html).
 * Reads inline JSON from <script id="artifinder-data" type="application/json">.
 */
(function() {
  'use strict';

  var SEC_COLOR = ReproDB.COLORS.security;
  var AF_COLOR = '#4a5aa8';      // ArtiFinder brand-ish indigo
  var MATCHED_COLOR = '#e08a2b'; // matched-to-AE accent

  document.addEventListener('DOMContentLoaded', function() {
    var dataEl = document.getElementById('artifinder-data');
    if (!dataEl) return;
    var D;
    try { D = JSON.parse(dataEl.textContent); } catch (e) { return; }

    var years = D.years || [];

    /* ===== 1. Discovered artifacts over time (matched vs. unmatched) ===== */
    var discEl = document.getElementById('afDiscoveredChart');
    if (discEl && years.length) {
      var matched = D.matched || [];
      var unmatched = (D.discovered || []).map(function(d, i) {
        return Math.max(0, (d || 0) - (matched[i] || 0));
      });
      var chart = ReproDB.initEChart(discEl);
      chart.setOption({
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { bottom: 0, data: ['Not evaluated (no AE)', 'Matched to AE paper'] },
        grid: { containLabel: true, left: 40, right: 20, bottom: 50, top: 30 },
        xAxis: { type: 'category', data: years },
        yAxis: { type: 'value', name: 'Discovered links', min: 0 },
        series: [
          { name: 'Not evaluated (no AE)', type: 'bar', stack: 'af', data: unmatched, itemStyle: { color: AF_COLOR } },
          { name: 'Matched to AE paper', type: 'bar', stack: 'af', data: matched, itemStyle: { color: MATCHED_COLOR } }
        ]
      });
      ReproDB.registerEChart(chart);
    }

    /* ===== 2. Discovery rate over time ===== */
    var rateEl = document.getElementById('afRateChart');
    if (rateEl && years.length) {
      var rate = (D.discovered || []).map(function(d, i) {
        var tot = (D.totalPapers || [])[i] || 0;
        return tot ? Math.round((d / tot) * 1000) / 10 : 0;
      });
      var chart2 = ReproDB.initEChart(rateEl);
      chart2.setOption({
        tooltip: {
          trigger: 'axis',
          valueFormatter: function(v) { return v + '%'; }
        },
        grid: { containLabel: true, left: 40, right: 20, bottom: 30, top: 30 },
        xAxis: { type: 'category', data: years },
        yAxis: { type: 'value', name: 'Discovery rate (%)', min: 0, max: 100 },
        series: [
          { name: 'Discovery rate', type: 'line', data: rate, smooth: true,
            itemStyle: { color: SEC_COLOR }, lineStyle: { width: 2 }, symbolSize: 6,
            areaStyle: { color: 'rgba(74,90,168,0.12)' } }
        ]
      });
      ReproDB.registerEChart(chart2);
    }

    /* ===== 3. Per-conference discovered vs. matched ===== */
    var confEl = document.getElementById('afConfChart');
    var confs = D.conferences || [];
    if (confEl && confs.length) {
      var names = confs.map(function(c) { return c.name; });
      var disc = confs.map(function(c) { return c.discovered; });
      var mAE = confs.map(function(c) { return c.matched_ae; });
      var chart3 = ReproDB.initEChart(confEl);
      chart3.setOption({
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { bottom: 0, data: ['Discovered', 'Matched to AE'] },
        grid: { containLabel: true, left: 40, right: 20, bottom: 50, top: 30 },
        xAxis: { type: 'category', data: names },
        yAxis: { type: 'value', name: 'Links', min: 0 },
        series: [
          { name: 'Discovered', type: 'bar', data: disc, itemStyle: { color: AF_COLOR } },
          { name: 'Matched to AE', type: 'bar', data: mAE, itemStyle: { color: MATCHED_COLOR } }
        ]
      });
      ReproDB.registerEChart(chart3);
    }

    /* ===== 4. Conference timeline heatmap (year x conference = discovered) ===== */
    var hmEl = document.getElementById('afHeatmap');
    if (hmEl && confs.length && years.length) {
      var hmConfs = confs.slice().sort(function(a, b) { return a.name.localeCompare(b.name); });
      var confNames = hmConfs.map(function(c) { return c.name; });
      var rawHeat = [];
      var maxVal = 0;
      hmConfs.forEach(function(c, ci) {
        var yrs = {};
        (c.years_data || []).forEach(function(yd) { yrs[yd.year] = yd.discovered; });
        years.forEach(function(y, yi) {
          var v = yrs[y] || 0;
          rawHeat.push([yi, ci, v]);
          if (v > maxVal) maxVal = v;
        });
      });

      function afCellColor(v) {
        var dark = ReproDB.isDark();
        if (v === 0) return dark ? 'rgba(50,55,65,0.5)' : 'rgba(220,220,220,0.3)';
        var t = maxVal > 0 ? v / maxVal : 0;
        return dark
          ? 'rgb(' + Math.round(40 + 60 * t) + ',' + Math.round(50 + 60 * t) + ',' + Math.round(90 + 120 * t) + ')'
          : 'rgba(74,90,168,' + (0.15 + t * 0.75) + ')';
      }
      function afLabelColor(v) {
        var dark = ReproDB.isDark();
        var t = maxVal > 0 ? v / maxVal : 0;
        return (v > 0 && t > (dark ? 0.25 : 0.6)) ? '#fff' : ReproDB.themeColors().text;
      }

      var hmChart = ReproDB.initEChart(hmEl);
      function setAfHeatmap() {
        var dark = ReproDB.isDark();
        hmChart.setOption({
          tooltip: { formatter: function(p) { return confNames[p.value[1]] + ' (' + years[p.value[0]] + '): ' + p.value[2] + ' discovered'; } },
          grid: { containLabel: true, left: 20, right: 20, bottom: 20, top: 30 },
          xAxis: { type: 'category', data: years, splitArea: { show: false } },
          yAxis: { type: 'category', data: confNames, splitArea: { show: false }, inverse: true },
          series: [{
            type: 'heatmap',
            data: rawHeat.map(function(d) { return { value: d, itemStyle: { color: afCellColor(d[2]) }, label: { color: afLabelColor(d[2]) } }; }),
            label: { show: true, fontSize: 10, formatter: function(p) { return p.value[2] > 0 ? p.value[2] : ''; } },
            itemStyle: { borderColor: dark ? '#333' : '#fff', borderWidth: 1 }
          }]
        });
      }
      setAfHeatmap();
      ReproDB.registerEChart(hmChart);
      ReproDB.onThemeChange(setAfHeatmap);
    }
  });
})();

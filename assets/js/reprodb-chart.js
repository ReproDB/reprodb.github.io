/**
 * reprodb-chart.js — lightweight Chart.js dark-mode adapter
 *
 * Sets Chart.js global defaults for text, grid, and tick colors based on the
 * active theme (light/dark).  Listens for theme toggles and re-renders.
 */
(function () {
  'use strict';

  var LIGHT = {
    text: '#333',
    grid: 'rgba(0,0,0,0.1)',
    tick: '#666'
  };
  var DARK = {
    text: '#d6d9dc',
    grid: 'rgba(255,255,255,0.12)',
    tick: '#a0a4aa'
  };

  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ||
      (!document.documentElement.getAttribute('data-theme') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
  }

  function applyChartDefaults() {
    if (typeof Chart === 'undefined') return;
    var c = isDark() ? DARK : LIGHT;
    Chart.defaults.color = c.text;
    Chart.defaults.borderColor = c.grid;
    if (Chart.defaults.scale) {
      Chart.defaults.scale.grid = Chart.defaults.scale.grid || {};
      Chart.defaults.scale.grid.color = c.grid;
      Chart.defaults.scale.ticks = Chart.defaults.scale.ticks || {};
      Chart.defaults.scale.ticks.color = c.tick;
    }
    // Re-render all existing charts
    if (Chart.instances) {
      Object.values(Chart.instances).forEach(function (chart) {
        if (chart && chart.options) {
          var scales = chart.options.scales || {};
          Object.keys(scales).forEach(function (axis) {
            scales[axis].grid = scales[axis].grid || {};
            scales[axis].grid.color = c.grid;
            scales[axis].ticks = scales[axis].ticks || {};
            scales[axis].ticks.color = c.tick;
            if (scales[axis].title) {
              scales[axis].title.color = c.text;
            }
          });
          if (chart.options.plugins && chart.options.plugins.title) {
            chart.options.plugins.title.color = c.text;
          }
          if (chart.options.plugins && chart.options.plugins.legend &&
              chart.options.plugins.legend.labels) {
            chart.options.plugins.legend.labels.color = c.text;
          }
          chart.update('none');
        }
      });
    }
  }

  // Apply on initial load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyChartDefaults);
  } else {
    applyChartDefaults();
  }

  // Re-apply when theme is toggled (observe data-theme attribute changes)
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      if (m.attributeName === 'data-theme') {
        applyChartDefaults();
      }
    });
  });
  observer.observe(document.documentElement, { attributes: true });

  // Also re-apply on OS theme change
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyChartDefaults);
})();

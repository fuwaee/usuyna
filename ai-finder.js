(function () {
  'use strict';

  var BADGES = [
    ['coding', 'Coding'],
    ['agentic', 'Agentic'],
    ['writing', 'Writing'],
    ['analysis', 'Analysis'],
    ['reasoning', 'Reasoning'],
    ['multimodal', 'Multimodal'],
    ['search', 'Search'],
    ['speed', 'Speed'],
    ['memory', 'Memory'],
    ['humanlike', 'Human-like'],
    ['privacy', 'Privacy'],
    ['opensource', 'Open-Source']
  ];

  // Each model only lists the badges it is made for, with its score on each.
  // b: array of [badgeId, score] pairs.
  var MODELS = [
    { name: 'DeepSeek V4 Flash 0731', vendor: 'DeepSeek', price: 0, added: '2026-08-26', url: 'https://chat.deepseek.com/', b: [['agentic', 88], ['coding', 87], ['opensource']] },
    { name: 'DeepSeek V4 Pro 0813', vendor: 'DeepSeek', price: 0, added: '2026-08-26', url: 'https://chat.deepseek.com/', b: [['agentic', 89], ['coding', 87], ['opensource']] }
  ];

  function scoreMap(m) {
    var map = {};
    m.b.forEach(function (p) { map[p[0]] = p.length > 1 ? p[1] : -1; });
    return map;
  }

  function overall(m) {
    var scored = m.b.filter(function (p) { return p.length > 1; });
    if (!scored.length) return 0;
    return Math.round(scored.reduce(function (a, p) { return a + p[1]; }, 0) / scored.length * 10) / 10;
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function matchScore(m) {
    if (!state.badges.length) return overall(m);
    var map = scoreMap(m);
    var vals = state.badges.filter(function (b) { return map[b] > 0; });
    if (!vals.length) return -1; // does not carry any selected badge
    return Math.round(vals.reduce(function (a, b) { return a + map[b]; }, 0) / vals.length);
  }

  var state = { badges: [], priceMin: 0, priceMax: 50, sort: 'match' };

  var badgeBox = document.getElementById('badge-filters');
  var listBox = document.getElementById('model-list');
  var countBox = document.getElementById('results-count');
  var minInput = document.getElementById('price-min');
  var maxInput = document.getElementById('price-max');
  var fill = document.getElementById('range-fill');
  var rangeLabel = document.getElementById('price-range-label');

  BADGES.forEach(function (b) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip';
    btn.dataset.badge = b[0];
    btn.textContent = b[1];
    btn.addEventListener('click', function () {
      var i = state.badges.indexOf(b[0]);
      if (i === -1) state.badges.push(b[0]); else state.badges.splice(i, 1);
      btn.classList.toggle('is-active', i === -1);
      render();
    });
    badgeBox.appendChild(btn);
  });

  function updateRange() {
    var min = Math.min(+minInput.value, +maxInput.value);
    var max = Math.max(+minInput.value, +maxInput.value);
    state.priceMin = min;
    state.priceMax = max;
    fill.style.left = (min / 50 * 100) + '%';
    fill.style.right = (100 - max / 50 * 100) + '%';
    rangeLabel.innerHTML = '$' + min + ' &#8211; $' + max;
    render();
  }

  minInput.addEventListener('input', updateRange);
  maxInput.addEventListener('input', updateRange);

  document.getElementById('sort-select').addEventListener('change', function (e) {
    state.sort = e.target.value;
    render();
  });

  document.getElementById('reset-filters').addEventListener('click', function () {
    state = { badges: [], priceMin: 0, priceMax: 50, sort: 'match' };
    document.querySelectorAll('.badge-filters .chip').forEach(function (x) { x.classList.remove('is-active'); });
    minInput.value = 0;
    maxInput.value = 50;
    document.getElementById('sort-select').value = 'match';
    updateRange();
  });

  function priceLabel(p) { return p === 0 ? 'Free' : '$' + p + '/mo'; }

  function badgeName(id) {
    var found = BADGES.filter(function (b) { return b[0] === id; });
    return found.length ? found[0][1] : id;
  }

  function render() {
    var list = MODELS.filter(function (m) {
      return m.price >= state.priceMin && m.price <= state.priceMax;
    });

    list.forEach(function (m) {
      var sc = matchScore(m);
      m._score = sc === -1 ? 0 : sc;
      m._overall = overall(m);
      m._hasMatch = sc !== -1;
    });

    if (state.badges.length) {
      list = list.filter(function (m) { return m._hasMatch; });
    }

    list.sort(function (a, b) {
      if (state.sort === 'price') return (a.price - b.price) || (b._score - a._score);
      if (state.sort === 'overall') return b._overall - a._overall || a.price - b.price;
      return b._score - a._score || a.price - b.price;
    });

    countBox.textContent = list.length + ' model' + (list.length > 1 ? 's' : '') +
      (state.badges.length
        ? ' matching your selected badge' + (state.badges.length > 1 ? 's' : '')
        : '');

    listBox.innerHTML = '';
    if (!list.length) {
      countBox.textContent = 'No models yet';
      var empty = document.createElement('p');
      empty.className = 'empty-note';
      empty.textContent = 'Models are coming soon \u2014 the ranking will appear here.';
      listBox.appendChild(empty);
      return;
    }

    list.forEach(function (m, idx) {
      var card = document.createElement('article');
      card.className = 'model-row';

      var pillsHtml = m.b
        .slice()
        .sort(function (x, y) { return y[1] - x[1]; })
        .map(function (p) {
          return '<span class="badge-pill">' + esc(badgeName(p[0])) + (p.length > 1 ? ' <b>' + esc(p[1]) + '</b>' : '') + '</span>';
        }).join('');

      card.innerHTML =
        '<div class="row-topline"><span class="row-rank">#' + (idx + 1) + '</span><span class="row-score">' + m._score + '</span></div>' +
        '<div class="row-head"><h3>' + esc(m.name) + '</h3><span class="model-vendor">' + esc(m.vendor) + '</span></div>' +
        '<div class="row-meta"><span class="row-price">' + priceLabel(m.price) + '</span><span class="row-overall">Overall ' + m._overall.toFixed(1) + '/100</span>' +
        (m.added ? '<span class="row-added">Benchmarked ' + esc(m.added.split('-').reverse().join('/')) + '</span>' : '') + '</div>' +
        '<div class="badge-pills">' + pillsHtml + '</div>' +
        (m.url ? '<a class="model-link" href="' + esc(m.url) + '" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">Try ' + esc(m.name) + ' &#8594;</a>' : '');
      listBox.appendChild(card);
    });
  }

  updateRange();
  render();
})();


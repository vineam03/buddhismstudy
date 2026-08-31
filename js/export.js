/* Compiles the whole site into one printable document.
   Static pages are fetched and their <main> content inlined;
   the data-driven libraries (suttas, vinaya) are rendered fully expanded. */
(function () {
  "use strict";

  var root = document.getElementById("book-root");
  var status = document.getElementById("build-status");

  var PAGES = [
    { url: "curriculum.html", title: "Part I — The Four-Stage Curriculum" },
    { url: "study.html", title: "Part II — Guided Study Sequence" },
    { url: "canon.html", title: "Part III — The Canon, Cover to Cover" },
    { url: "themes.html", title: "Part V — Modern Life Lenses" },
    { url: "journey.html", title: "Part VI — Journey to the West" }
  ];

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function sectionHeader(title) {
    return '<h1 style="color:var(--gold); font-size:1.8rem; margin:3rem 0 1rem; ' +
      'border-bottom:3px solid var(--dark-yellow); padding-bottom:.4rem; break-before: page;">' +
      esc(title) + "</h1>";
  }

  function suttaBlock(s) {
    var hist = (window.SUTTA_HISTORY || {})[s.id];
    return '<details class="rule" open><summary><span class="rule-num">' + esc(s.ref) +
      '</span><span class="rule-title">' + esc(s.title) +
      (s.pali ? ' <span class="pali">· ' + esc(s.pali) + "</span>" : "") + "</span></summary>" +
      '<div class="rule-body"><h4>The gist</h4><p>' + esc(s.gist) + "</p>" +
      (hist ? '<h4>Historical context</h4><p class="dim">' + esc(hist) + "</p>" : "") +
      "<h4>On truth &amp; human nature</h4><p>" + esc(s.truth) + "</p>" +
      "<h4>In daily life</h4><p>" + esc(s.life) + "</p></div></details>";
  }

  function ruleBlock(r) {
    return '<details class="rule" open><summary><span class="rule-num">' + esc(r.label) + " " +
      r.n + '</span><span class="rule-title">' + esc(r.title) +
      (r.pali ? ' <span class="pali">· ' + esc(r.pali) + "</span>" : "") + "</span></summary>" +
      '<div class="rule-body"><h4>The rule</h4><p>' + esc(r.rule) + "</p>" +
      '<h4>Origin story</h4><p class="dim">' + esc(r.origin) + "</p></div></details>";
  }

  function renderSuttas() {
    var cats = [
      { key: "dn", name: "Dīgha Nikāya" }, { key: "mn", name: "Majjhima Nikāya" },
      { key: "sn", name: "Saṁyutta Nikāya" }, { key: "an", name: "Aṅguttara Nikāya" },
      { key: "kn", name: "Khuddaka Nikāya" }
    ];
    var html = sectionHeader("Part IV — The Sutta Library (" + (window.SUTTAS || []).length + " texts)");
    cats.forEach(function (c) {
      var list = (window.SUTTAS || []).filter(function (s) { return s.cat === c.key; });
      if (!list.length) return;
      html += '<h2 style="color:var(--orange); margin:1.5rem 0 .6rem;">' + esc(c.name) + "</h2>" +
        list.map(suttaBlock).join("");
    });
    return html;
  }

  function renderVinaya() {
    var cats = [
      { key: "parajika", name: "Pārājika (4)" }, { key: "sanghadisesa", name: "Saṅghādisesa (13)" },
      { key: "aniyata", name: "Aniyata (2)" }, { key: "nissaggiya", name: "Nissaggiya Pācittiya (30)" },
      { key: "pacittiya", name: "Pācittiya (92)" }, { key: "patidesaniya", name: "Pāṭidesanīya (4)" },
      { key: "sekhiya", name: "Sekhiya (75)" }, { key: "adhikarana", name: "Adhikaraṇasamatha (7)" }
    ];
    var html = sectionHeader("Part VII — The 227 Pātimokkha Rules with Origin Stories");
    cats.forEach(function (c) {
      var list = (window.VINAYA || []).filter(function (r) { return r.cat === c.key; });
      if (!list.length) return;
      html += '<h2 style="color:var(--orange); margin:1.5rem 0 .6rem;">' + esc(c.name) + "</h2>" +
        list.map(ruleBlock).join("");
    });
    return html;
  }

  function fetchMain(page) {
    return fetch(page.url).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.text();
    }).then(function (html) {
      var doc = new DOMParser().parseFromString(html, "text/html");
      var main = doc.querySelector("main");
      if (!main) return "";
      main.querySelectorAll(".controls, .no-print, script, input").forEach(function (el) { el.remove(); });
      return sectionHeader(page.title) + main.innerHTML;
    }).catch(function () {
      return sectionHeader(page.title) +
        '<p class="dim">This section could not be assembled automatically (open this page over ' +
        'http, not as a local file). Print it from <a href="' + page.url + '">its own page</a> instead.</p>';
    });
  }

  Promise.all(PAGES.map(fetchMain)).then(function (parts) {
    var cover =
      '<div style="text-align:center; padding:3rem 0 1rem;">' +
      '<div style="font-size:3rem; color:var(--orange);">☸</div>' +
      '<h1 style="font-size:2.2rem; color:var(--gold); margin:.5rem 0;">Buddhism Study</h1>' +
      '<p class="dim">A four-stage curriculum · the complete canon in contemporary English · ' +
      "67 sutta study guides with historical context · the 227 Pātimokkha rules and their origin " +
      "stories · modern life lenses · the Journey to the West allegory</p>" +
      '<p class="dim">Compiled ' + new Date().toLocaleDateString() + "</p></div>";
    root.innerHTML = cover +
      parts[0] + parts[1] + parts[2] +
      renderSuttas() +
      parts[3] + parts[4] +
      renderVinaya();
    if (status) status.textContent = "ready — " + (window.SUTTAS || []).length + " suttas + " +
      (window.VINAYA || []).length + " rules + 5 sections assembled.";
  });

  window.addEventListener("beforeprint", function () {
    document.querySelectorAll("details").forEach(function (d) { d.open = true; });
  });
})();

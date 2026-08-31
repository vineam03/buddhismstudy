/* Renders the sutta study library with search, collection filters, and hash deep-links. */
(function () {
  "use strict";

  var COLLECTIONS = [
    { key: "dn", name: "Dīgha Nikāya", blurb: "The long discourses — set-piece narratives and debates." },
    { key: "mn", name: "Majjhima Nikāya", blurb: "The middle-length discourses — the working core of the teaching." },
    { key: "sn", name: "Saṁyutta Nikāya", blurb: "The linked discourses — short texts sorted by theme." },
    { key: "an", name: "Aṅguttara Nikāya", blurb: "The numbered discourses — the practical, lay-facing collection." },
    { key: "kn", name: "Khuddaka Nikāya", blurb: "The minor collection — the canon's oldest poetry and best-loved short texts." }
  ];

  var suttas = window.SUTTAS || [];
  var activeCat = "all";
  var query = "";

  var root = document.getElementById("suttas-root");
  var searchBox = document.getElementById("search");
  var filterBar = document.getElementById("cat-filters");
  var countEl = document.getElementById("result-count");

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function buildFilters() {
    var frag = document.createDocumentFragment();
    var all = document.createElement("button");
    all.textContent = "All (" + suttas.length + ")";
    all.dataset.cat = "all";
    all.className = "on";
    frag.appendChild(all);
    COLLECTIONS.forEach(function (c) {
      var n = suttas.filter(function (s) { return s.cat === c.key; }).length;
      var b = document.createElement("button");
      b.textContent = c.name + " (" + n + ")";
      b.dataset.cat = c.key;
      frag.appendChild(b);
    });
    filterBar.appendChild(frag);
    filterBar.addEventListener("click", function (e) {
      if (e.target.tagName !== "BUTTON") return;
      activeCat = e.target.dataset.cat;
      Array.prototype.forEach.call(filterBar.children, function (b) {
        b.classList.toggle("on", b === e.target);
      });
      render();
    });
  }

  function matches(s) {
    if (activeCat !== "all" && s.cat !== activeCat) return false;
    if (!query) return true;
    var hay = (s.id + " " + s.title + " " + s.pali + " " + s.gist + " " + s.truth + " " + s.life).toLowerCase();
    return query.split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; });
  }

  function badges(s) {
    if (!s.stages || !s.stages.length) return "";
    return '<div class="stage-badges">' + s.stages.map(function (n) {
      return '<span class="stage-badge' + (n > 1 ? " s" + n : "") + '">Stage ' + n + "</span>";
    }).join("") + "</div>";
  }

  function card(s) {
    var hist = (window.SUTTA_HISTORY || {})[s.id];
    var open = query ? " open" : "";
    return '<details class="rule" id="' + esc(s.id) + '"' + open + ">" +
      '<summary><span class="rule-num">' + esc(s.ref) + "</span>" +
      '<span class="rule-title">' + esc(s.title) +
      (s.pali ? ' <span class="pali">· ' + esc(s.pali) + "</span>" : "") +
      "</span></summary>" +
      '<div class="rule-body">' +
      badges(s) +
      "<h4>The gist</h4><p>" + esc(s.gist) + "</p>" +
      (hist ? '<h4>Historical context</h4><p class="dim">' + esc(hist) + "</p>" : "") +
      "<h4>On truth &amp; human nature</h4><p>" + esc(s.truth) + "</p>" +
      "<h4>In daily life</h4><p>" + esc(s.life) + "</p>" +
      (s.sc ? '<a class="sclink" href="https://suttacentral.net/' + esc(s.sc) +
        '/en/sujato" target="_blank" rel="noopener">Full text →</a>' : "") +
      "</div></details>";
  }

  function render() {
    var shown = 0;
    var html = "";
    COLLECTIONS.forEach(function (c) {
      var list = suttas.filter(function (s) { return s.cat === c.key && matches(s); });
      if (!list.length) return;
      shown += list.length;
      html += '<section class="cat-section"><h2>' + esc(c.name) + "</h2>" +
        '<p class="cat-meta">' + esc(c.blurb) + "</p>" +
        list.map(card).join("") + "</section>";
    });
    root.innerHTML = html || '<p class="cat-meta">Nothing matches your search.</p>';
    countEl.textContent = "Showing " + shown + " of " + suttas.length + " texts";
  }

  function openFromHash() {
    var id = decodeURIComponent(location.hash.replace(/^#/, ""));
    if (!id) return;
    var el = document.getElementById(id);
    if (el && el.tagName === "DETAILS") {
      el.open = true;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  searchBox.addEventListener("input", function () {
    query = searchBox.value.trim().toLowerCase();
    render();
  });
  window.addEventListener("hashchange", openFromHash);
  window.addEventListener("beforeprint", function () {
    document.querySelectorAll("details").forEach(function (d) { d.open = true; });
  });

  buildFilters();
  render();
  openFromHash();
})();

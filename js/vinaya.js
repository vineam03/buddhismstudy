/* Renders the 227 Pātimokkha rules with search + category filtering. */
(function () {
  "use strict";

  var CATEGORIES = [
    { key: "parajika", name: "Pārājika", count: 4,
      penalty: "Defeat — permanent expulsion from the Sangha",
      blurb: "The four gravest offenses. A monk who commits one is no longer a monk and cannot re-ordain in this life." },
    { key: "sanghadisesa", name: "Saṅghādisesa", count: 13,
      penalty: "Formal meeting of the Sangha — probation, penance (mānatta), and rehabilitation before at least twenty monks",
      blurb: "Serious offenses requiring the community's formal involvement from beginning to end." },
    { key: "aniyata", name: "Aniyata", count: 2,
      penalty: "Indeterminate — the charge depends on what a trustworthy witness reports",
      blurb: "Two cases of sitting alone with a woman where the offense class cannot be fixed in advance." },
    { key: "nissaggiya", name: "Nissaggiya Pācittiya", count: 30,
      penalty: "Forfeiture of the object plus confession",
      blurb: "Offenses involving possessions — robes, bowls, money, medicines — where the improperly obtained item must be given up." },
    { key: "pacittiya", name: "Pācittiya", count: 92,
      penalty: "Confession to another monk",
      blurb: "The largest class: lies, insults, mistreatment of living things, food violations, conduct with women and nuns, and more." },
    { key: "patidesaniya", name: "Pāṭidesanīya", count: 4,
      penalty: "Verbal acknowledgment: “Friend, I have done a blameworthy thing…”",
      blurb: "Four food-related offenses to be acknowledged." },
    { key: "sekhiya", name: "Sekhiya", count: 75,
      penalty: "A training to be observed — wrongdoing (dukkaṭa) if breached out of disrespect",
      blurb: "Rules of deportment: how to dress, walk, eat, teach, and relieve oneself. Nearly all were prompted by the group-of-six monks." },
    { key: "adhikarana", name: "Adhikaraṇa­samatha", count: 7,
      penalty: "Not offenses — procedures",
      blurb: "Seven methods for settling disputes, accusations, and other legal issues in the community." }
  ];

  var rules = window.VINAYA || [];
  var activeCat = "all";
  var query = "";

  var root = document.getElementById("rules-root");
  var searchBox = document.getElementById("search");
  var filterBar = document.getElementById("cat-filters");
  var countEl = document.getElementById("result-count");

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function buildFilters() {
    var frag = document.createDocumentFragment();
    var all = document.createElement("button");
    all.textContent = "All (227)";
    all.dataset.cat = "all";
    all.className = "on";
    frag.appendChild(all);
    CATEGORIES.forEach(function (c) {
      var b = document.createElement("button");
      b.textContent = c.name + " (" + c.count + ")";
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

  function matches(r) {
    if (activeCat !== "all" && r.cat !== activeCat) return false;
    if (!query) return true;
    var hay = (r.title + " " + r.pali + " " + r.rule + " " + r.origin).toLowerCase();
    return query.split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; });
  }

  function ruleCard(r, idx) {
    var open = query ? " open" : "";
    return '<details class="rule"' + open + '>' +
      '<summary><span class="rule-num">' + esc(r.label) + " " + r.n + "</span>" +
      '<span class="rule-title">' + esc(r.title) +
      (r.pali ? ' <span class="pali">· ' + esc(r.pali) + "</span>" : "") +
      "</span></summary>" +
      '<div class="rule-body">' +
      "<h4>The rule</h4><p>" + esc(r.rule) + "</p>" +
      '<div class="origin"><h4>Origin story</h4><p>' + esc(r.origin) + "</p></div>" +
      (r.sc ? '<a class="sclink" href="https://suttacentral.net/pli-tv-bu-vb-' + r.sc +
        '/en/brahmali" target="_blank" rel="noopener">Read the full text at SuttaCentral →</a>' : "") +
      "</div></details>";
  }

  function render() {
    var shown = 0;
    var html = "";
    CATEGORIES.forEach(function (c) {
      var catRules = rules.filter(function (r) { return r.cat === c.key && matches(r); });
      if (!catRules.length) return;
      shown += catRules.length;
      html += '<section class="cat-section"><h2>' + esc(c.name) + "</h2>" +
        '<p class="cat-meta"><strong>Penalty:</strong> ' + esc(c.penalty) + "<br>" + esc(c.blurb) + "</p>" +
        catRules.map(ruleCard).join("") + "</section>";
    });
    root.innerHTML = html || '<p class="cat-meta">No rules match your search.</p>';
    countEl.textContent = "Showing " + shown + " of " + rules.length + " rules";
  }

  searchBox.addEventListener("input", function () {
    query = searchBox.value.trim().toLowerCase();
    render();
  });

  buildFilters();
  render();
})();

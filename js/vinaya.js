/* Renders the 227 Pātimokkha rules with search + category filtering.
   Game layer (docs/GAME_CONTRACT.md, section 2): inside each open rule there is an
   "I have read this story" button. A click on it is the only thing on this page that logs
   an activity (rule:<cat>-<n>, for example rule:pacittiya-51). Opening a rule, a search that
   opens many rules at once, and printing log nothing. Only the first 50 stories add points;
   after that the buttons work the same and show no points.
   Rules are redrawn from strings on every search and filter change, so the buttons are
   handled by one listener on the list root and their state is rebuilt from window.Game. */
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

  /* Every word the game layer adds to this page. */
  var TEXT = {
    read: "I have read this story",
    readDone: "You have read this story.",
    readMark: "Read",
    count: " stories read."
  };

  var rules = window.VINAYA || [];
  var activeCat = "all";
  var query = "";

  var root = document.getElementById("rules-root");
  var searchBox = document.getElementById("search");
  var filterBar = document.getElementById("cat-filters");
  var countEl = document.getElementById("result-count");
  var readNoteEl = document.getElementById("read-note");
  var readCountEl = document.getElementById("read-count");

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* ---------- game helpers (all safe when the engine is missing) ---------- */

  function game() {
    var G = window.Game;
    return G && typeof G.award === "function" && typeof G.has === "function" ? G : null;
  }

  /* The part of the activity id after "rule:", for example "pacittiya-51". */
  function ruleKey(r) {
    return r.cat + "-" + r.n;
  }

  function pointsWord(n) {
    if (window.Site && typeof window.Site.pointsWord === "function") { return window.Site.pointsWord(n); }
    return n + (n === 1 ? " point" : " points");
  }

  /* Points a new story would add right now: 2 for the first 50 stories, then nothing,
     and never past the overall cap. The engine applies the same rule when it logs one. */
  function storyPoints() {
    var G = game(), cfg = window.GAME_CONFIG || {}, xp = cfg.xp || {}, caps = cfg.caps || {}, pay, room;
    if (!G) { return 0; }
    pay = typeof xp.rule === "number" && xp.rule > 0 ? Math.floor(xp.rule) : 0;
    if (typeof caps.rules === "number" && G.count("rule:") >= caps.rules) { pay = 0; }
    if (typeof caps.xp === "number") {
      room = caps.xp - G.xp();
      if (room < 0) { room = 0; }
      if (pay > room) { pay = room; }
    }
    return pay;
  }

  function tickHtml() {
    return '<span class="card-tick" aria-hidden="true">✓</span> ';
  }

  /* "done", or "open-<points a click would add>". Used to redraw only what changed. */
  function gameState(key) {
    var G = game();
    if (!G) { return ""; }
    return G.has("rule:" + key) ? "done" : "open-" + storyPoints();
  }

  function gameInner(state) {
    var pts;
    if (state === "done") {
      return '<p class="card-done" tabindex="-1">' + tickHtml() + TEXT.readDone + "</p>";
    }
    pts = parseInt(state.slice(5), 10);
    return '<button type="button" class="award-btn" data-act="read">' +
      '<span class="award-label">' + TEXT.read + "</span>" +
      (pts > 0 ? ' <span class="points">· ' + esc(pointsWord(pts)) + "</span>" : "") +
      "</button>";
  }

  function gameArea(key) {
    var state = gameState(key);
    if (!state) { return ""; }
    return '<div class="card-game no-print" data-state="' + state + '">' + gameInner(state) + "</div>";
  }

  function readMark(key) {
    var G = game();
    if (!G) { return ""; }
    return '<span class="read-mark no-print"' + (G.has("rule:" + key) ? "" : " hidden") + ">" +
      tickHtml() + TEXT.readMark + "</span>";
  }

  /* Brings one drawn rule up to date with the engine. */
  function paintCard(card) {
    var G = game(), key = card.getAttribute("data-rule"), area, mark, state;
    if (!G || !key) { return; }
    mark = card.querySelector(".read-mark");
    if (mark) {
      if (G.has("rule:" + key)) { mark.removeAttribute("hidden"); } else { mark.setAttribute("hidden", ""); }
    }
    area = card.querySelector(".card-game");
    state = gameState(key);
    if (area && area.getAttribute("data-state") !== state) {
      area.setAttribute("data-state", state);
      area.innerHTML = gameInner(state);
    }
  }

  function paintCount() {
    var G = game(), n;
    if (!G) {
      /* No engine, no buttons: the line that points at them would only confuse. */
      if (readNoteEl) { readNoteEl.setAttribute("hidden", ""); }
      return;
    }
    if (!readCountEl) { return; }
    n = G.count("rule:");
    readCountEl.textContent = n > 0 ? n + " of " + rules.length + TEXT.count : "";
  }

  function paintAll() {
    var cards = root.querySelectorAll("details.rule"), i;
    for (i = 0; i < cards.length; i++) { paintCard(cards[i]); }
    paintCount();
  }

  /* ---------- the rules themselves ---------- */

  function buildFilters() {
    var frag = document.createDocumentFragment();
    var all = document.createElement("button");
    all.type = "button";
    all.textContent = "All (227)";
    all.dataset.cat = "all";
    all.className = "on";
    all.setAttribute("aria-pressed", "true");
    frag.appendChild(all);
    CATEGORIES.forEach(function (c) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = c.name + " (" + c.count + ")";
      b.dataset.cat = c.key;
      b.setAttribute("aria-pressed", "false");
      frag.appendChild(b);
    });
    filterBar.appendChild(frag);
    filterBar.addEventListener("click", function (e) {
      if (e.target.tagName !== "BUTTON") return;
      activeCat = e.target.dataset.cat;
      Array.prototype.forEach.call(filterBar.children, function (b) {
        b.classList.toggle("on", b === e.target);
        b.setAttribute("aria-pressed", b === e.target ? "true" : "false");
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
    var key = ruleKey(r);
    return '<details class="rule" data-rule="' + esc(key) + '"' + open + '>' +
      '<summary><span class="rule-num">' + esc(r.label) + " " + r.n + "</span>" +
      '<span class="rule-title">' + esc(r.title) +
      (r.pali ? ' <span class="pali">· ' + esc(r.pali) + "</span>" : "") +
      "</span>" + readMark(key) + "</summary>" +
      '<div class="rule-body">' +
      "<h3>The rule</h3><p>" + esc(r.rule) + "</p>" +
      '<div class="origin"><h3>Origin story</h3><p>' + esc(r.origin) + "</p></div>" +
      (r.sc ? '<a class="sclink" href="https://suttacentral.net/pli-tv-bu-vb-' + r.sc +
        '/en/brahmali" target="_blank" rel="noopener">Read the full text at SuttaCentral →</a>' : "") +
      gameArea(key) +
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
    paintCount();
  }

  /* ---------- the one click that logs a story (one listener, on the list root) ---------- */

  function upTo(node, test) {
    while (node && node !== root) {
      if (node.nodeType === 1 && test(node)) { return node; }
      node = node.parentNode;
    }
    return null;
  }

  root.addEventListener("click", function (e) {
    var G = game(), btn, card, key, done;
    btn = upTo(e.target, function (n) { return n.getAttribute("data-act") === "read"; });
    if (!G || !btn) { return; }
    card = upTo(btn, function (n) { return n.tagName === "DETAILS"; });
    key = card ? card.getAttribute("data-rule") : "";
    if (!key) { return; }
    G.award("rule:" + key);
    paintAll();
    /* The button is gone. Put the reader on the line that took its place. */
    done = card.querySelector(".card-done");
    if (done) {
      try { done.focus(); } catch (err) { /* focus is a help, never a need */ }
    }
  });

  searchBox.addEventListener("input", function () {
    query = searchBox.value.trim().toLowerCase();
    render();
  });
  window.addEventListener("beforeprint", function () {
    /* Opening a rule logs nothing, so printing logs nothing. */
    document.querySelectorAll("details").forEach(function (d) { d.open = true; });
  });

  buildFilters();
  render();

  /* Another tab or a restored backup can change what is read. */
  if (game() && typeof game().on === "function") { game().on("change", paintAll); }
})();

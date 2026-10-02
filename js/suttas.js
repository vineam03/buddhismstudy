/* Renders the sutta study library with search, collection filters, and hash deep-links.
   Game layer (docs/GAME_CONTRACT.md, sections 2 and 9): each open card starts with its
   plain-words line and ends with an "I have read this" button and one check question.
   Cards are redrawn from strings on every search and filter change, so the buttons are
   handled by one listener on the list root and their state is rebuilt from window.Game.
   The only things that log an activity are a click on "I have read this" (sutta:<id>) and
   a right pick on the question (suttaq:<id>). Opening, searching and printing log nothing. */
(function () {
  "use strict";

  var COLLECTIONS = [
    { key: "dn", name: "Dīgha Nikāya", blurb: "The long discourses — set-piece narratives and debates." },
    { key: "mn", name: "Majjhima Nikāya", blurb: "The middle-length discourses — the working core of the teaching." },
    { key: "sn", name: "Saṁyutta Nikāya", blurb: "The linked discourses — short texts sorted by theme." },
    { key: "an", name: "Aṅguttara Nikāya", blurb: "The numbered discourses — the practical, lay-facing collection." },
    { key: "kn", name: "Khuddaka Nikāya", blurb: "The minor collection — the canon's oldest poetry and best-loved short texts." }
  ];

  /* Every word the game layer adds to this page. */
  var TEXT = {
    plainHead: "In plain words",
    read: "I have read this",
    readDone: "You have read this.",
    readMark: "Read",
    qHead: "One short question",
    right: "Right.",
    notQuite: "Not quite. Here is the idea again:",
    tried: " (tried already)",
    count: " cards read."
  };

  var suttas = window.SUTTAS || [];
  var activeCat = "all";
  var query = "";

  var root = document.getElementById("suttas-root");
  var searchBox = document.getElementById("search");
  var filterBar = document.getElementById("cat-filters");
  var countEl = document.getElementById("result-count");
  var readCountEl = document.getElementById("read-count");

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* ---------- game helpers (all safe when the engine or the easy data is missing) ---------- */

  function game() {
    var G = window.Game;
    return G && typeof G.award === "function" && typeof G.has === "function" ? G : null;
  }

  function easyFor(id) {
    var all = window.SUTTA_EASY, e = all && Object.prototype.hasOwnProperty.call(all, id) ? all[id] : null;
    return e && typeof e === "object" ? e : null;
  }

  function plainFor(id) {
    var e = easyFor(id);
    return e && typeof e.plain === "string" && e.plain ? e.plain : "";
  }

  /* The card's check question, or null when the entry is absent or not usable. */
  function questionFor(id) {
    var e = easyFor(id), i;
    if (!e || typeof e.q !== "string" || !e.q) { return null; }
    if (Object.prototype.toString.call(e.options) !== "[object Array]" || e.options.length < 2) { return null; }
    for (i = 0; i < e.options.length; i++) {
      if (typeof e.options[i] !== "string" || !e.options[i]) { return null; }
    }
    if (typeof e.answer !== "number" || e.answer < 0 || e.answer >= e.options.length ||
        Math.floor(e.answer) !== e.answer) { return null; }
    return e;
  }

  function pointsWord(n) {
    if (window.Site && typeof window.Site.pointsWord === "function") { return window.Site.pointsWord(n); }
    return n + (n === 1 ? " point" : " points");
  }

  /* Points this id would add right now: nothing once logged, and never past the overall cap.
     The engine applies the same rule when it logs the activity. */
  function pointsNow(actId) {
    var G = game(), cfg = window.GAME_CONFIG || {}, xp = cfg.xp || {}, caps = cfg.caps || {};
    var kind = actId.slice(0, actId.indexOf(":")), pay, room;
    if (!G || G.has(actId)) { return 0; }
    pay = typeof xp[kind] === "number" && xp[kind] > 0 ? Math.floor(xp[kind]) : 0;
    if (typeof caps.xp === "number") {
      room = caps.xp - G.xp();
      if (room < 0) { room = 0; }
      if (pay > room) { pay = room; }
    }
    return pay;
  }

  function pointsHtml(n) {
    return n > 0 ? ' <span class="points">· ' + esc(pointsWord(n)) + "</span>" : "";
  }

  function tickHtml() {
    return '<span class="card-tick" aria-hidden="true">✓</span> ';
  }

  /* Which of the four states the foot of a card is in. Used to redraw only what changed. */
  function gameState(id) {
    var G = game();
    if (!G) { return ""; }
    if (!G.has("sutta:" + id)) { return "open-" + pointsNow("sutta:" + id); }
    if (!questionFor(id)) { return "read"; }
    if (G.has("suttaq:" + id)) { return "answered"; }
    return "ask-" + pointsNow("suttaq:" + id);
  }

  function gameInner(id, state) {
    var q, html, i;
    if (state.indexOf("open-") === 0) {
      return '<button type="button" class="award-btn" data-act="read">' +
        '<span class="award-label">' + TEXT.read + "</span>" +
        pointsHtml(parseInt(state.slice(5), 10)) + "</button>";
    }
    html = '<p class="card-done" tabindex="-1">' + tickHtml() + TEXT.readDone + "</p>";
    if (state === "read") { return html; }
    q = questionFor(id);
    if (state === "answered") {
      return html + "<h3>" + TEXT.qHead + "</h3>" +
        '<div class="card-q-done" tabindex="-1">' +
        '<p class="card-q-text">' + esc(q.q) + "</p>" +
        '<div class="card-q-right"><p>' + tickHtml() + "<strong>" + TEXT.right + "</strong> " +
        esc(q.options[q.answer]) + "</p>" +
        (typeof q.why === "string" && q.why ? "<p>" + esc(q.why) + "</p>" : "") +
        "</div></div>";
    }
    html += "<h3>" + TEXT.qHead + pointsHtml(parseInt(state.slice(4), 10)) + "</h3>" +
      '<fieldset class="card-q" tabindex="-1"><legend>' + esc(q.q) + "</legend>" +
      '<div class="card-q-opts">';
    for (i = 0; i < q.options.length; i++) {
      html += '<button type="button" class="btn btn-plain card-q-opt" data-act="pick" data-opt="' + i + '">' +
        esc(q.options[i]) + "</button>";
    }
    return html + '</div><div class="card-q-say" aria-live="polite"></div></fieldset>';
  }

  function gameArea(id) {
    var state = gameState(id);
    if (!state) { return ""; }
    return '<div class="card-game no-print" data-state="' + state + '">' + gameInner(id, state) + "</div>";
  }

  function readMark(id) {
    var G = game();
    if (!G) { return ""; }
    return '<span class="read-mark no-print"' + (G.has("sutta:" + id) ? "" : " hidden") + ">" +
      tickHtml() + TEXT.readMark + "</span>";
  }

  /* Brings one drawn card up to date with the engine. Leaves it alone when nothing changed,
     so a question the learner is in the middle of is never redrawn under them. */
  function paintCard(card) {
    var G = game(), id = card.id, area, mark, state;
    if (!G || !id) { return; }
    mark = card.querySelector(".read-mark");
    if (mark) {
      if (G.has("sutta:" + id)) { mark.removeAttribute("hidden"); } else { mark.setAttribute("hidden", ""); }
    }
    area = card.querySelector(".card-game");
    state = gameState(id);
    if (area && area.getAttribute("data-state") !== state) {
      area.setAttribute("data-state", state);
      area.innerHTML = gameInner(id, state);
    }
  }

  function paintCount() {
    var G = game(), n;
    if (!readCountEl) { return; }
    n = G ? G.count("sutta:") : 0;
    readCountEl.textContent = n > 0 ? n + " of " + suttas.length + TEXT.count : "";
  }

  function paintAll() {
    var cards = root.querySelectorAll("details.rule"), i;
    for (i = 0; i < cards.length; i++) { paintCard(cards[i]); }
    paintCount();
  }

  /* ---------- the library itself ---------- */

  function buildFilters() {
    var frag = document.createDocumentFragment();
    var all = document.createElement("button");
    all.type = "button";
    all.textContent = "All (" + suttas.length + ")";
    all.dataset.cat = "all";
    all.className = "on";
    all.setAttribute("aria-pressed", "true");
    frag.appendChild(all);
    COLLECTIONS.forEach(function (c) {
      var n = suttas.filter(function (s) { return s.cat === c.key; }).length;
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = c.name + " (" + n + ")";
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

  function matches(s) {
    if (activeCat !== "all" && s.cat !== activeCat) return false;
    if (!query) return true;
    var hay = (s.id + " " + s.title + " " + s.pali + " " + s.gist + " " + s.truth + " " + s.life +
      " " + plainFor(s.id)).toLowerCase();
    return query.split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; });
  }

  function badges(s) {
    if (!s.stages || !s.stages.length) return "";
    return '<div class="stage-badges">' + s.stages.map(function (n) {
      return '<span class="stage-badge' + (n > 1 ? " s" + n : "") + '">Stage ' + n + "</span>";
    }).join("") + "</div>";
  }

  function plainBlock(s) {
    var plain = plainFor(s.id);
    if (!plain) return "";
    return '<div class="plain-words"><h3>' + TEXT.plainHead + "</h3><p>" + esc(plain) + "</p></div>";
  }

  function card(s) {
    var hist = (window.SUTTA_HISTORY || {})[s.id];
    var open = query ? " open" : "";
    return '<details class="rule" id="' + esc(s.id) + '"' + open + ">" +
      '<summary><span class="rule-num">' + esc(s.ref) + "</span>" +
      '<span class="rule-title">' + esc(s.title) +
      (s.pali ? ' <span class="pali">· ' + esc(s.pali) + "</span>" : "") +
      "</span>" + readMark(s.id) + "</summary>" +
      '<div class="rule-body">' +
      plainBlock(s) +
      badges(s) +
      "<h3>The gist</h3><p>" + esc(s.gist) + "</p>" +
      (hist ? '<h3>Historical context</h3><p class="dim">' + esc(hist) + "</p>" : "") +
      "<h3>On truth &amp; human nature</h3><p>" + esc(s.truth) + "</p>" +
      "<h3>In daily life</h3><p>" + esc(s.life) + "</p>" +
      (s.sc ? '<a class="sclink" href="https://suttacentral.net/' + esc(s.sc) +
        '/en/sujato" target="_blank" rel="noopener">Full text →</a>' : "") +
      gameArea(s.id) +
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
    countEl.textContent = "Showing " + shown + " of " + suttas.length + " cards";
    paintCount();
  }

  /* True when the reader has asked the device for less movement. */
  function calmMotion() {
    return !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function openFromHash() {
    var id = decodeURIComponent(location.hash.replace(/^#/, ""));
    if (!id) return;
    var el = document.getElementById(id);
    var bar = document.querySelector(".controls");
    if (el && el.tagName === "DETAILS") {
      el.open = true;
      /* The search bar stays at the top and is taller on a narrow screen.
         Land the card just below it, whatever its height is. */
      if (bar) { el.style.scrollMarginTop = Math.ceil(bar.getBoundingClientRect().height + 16) + "px"; }
      el.scrollIntoView({ behavior: calmMotion() ? "auto" : "smooth", block: "start" });
    }
  }

  /* ---------- clicks and keys inside the cards (one listener each, on the list root) ---------- */

  /* The nearest element with data-act between the click and the list root. */
  function actionTarget(node) {
    while (node && node !== root) {
      if (node.nodeType === 1 && node.getAttribute("data-act")) { return node; }
      node = node.parentNode;
    }
    return null;
  }

  function cardOf(node) {
    while (node && node !== root) {
      if (node.nodeType === 1 && node.tagName === "DETAILS") { return node; }
      node = node.parentNode;
    }
    return null;
  }

  function focusOn(el) {
    if (!el) { return; }
    try { el.focus(); } catch (e) { /* focus is a help, never a need */ }
  }

  function markRead(cardEl) {
    var G = game(), id = cardEl.id, area;
    if (!G || !id) { return; }
    G.award("sutta:" + id);
    paintCard(cardEl);
    paintCount();
    /* The button is gone. Put the reader on what took its place. */
    area = cardEl.querySelector(".card-game");
    focusOn(area && (area.querySelector("fieldset.card-q") || area.querySelector(".card-done")));
  }

  function pick(cardEl, btn) {
    var G = game(), id = cardEl.id, q = questionFor(id), area, say, i;
    if (!G || !id || !q || !G.has("sutta:" + id)) { return; }
    i = parseInt(btn.getAttribute("data-opt"), 10);
    area = cardEl.querySelector(".card-game");
    if (i === q.answer) {
      G.award("suttaq:" + id);
      paintCard(cardEl);
      focusOn(area && area.querySelector(".card-q-done"));
      return;
    }
    /* Any other pick: the idea again, kindly, and the learner picks again. Nothing is logged. */
    if (!/\bis-tried\b/.test(btn.className)) {
      btn.className += " is-tried";
      btn.insertAdjacentHTML("beforeend", '<span class="sr-only">' + TEXT.tried + "</span>");
    }
    say = area ? area.querySelector(".card-q-say") : null;
    if (say) {
      say.innerHTML = "";
      say.innerHTML = '<div class="card-q-note"><p><strong>' + TEXT.notQuite + "</strong></p>" +
        (typeof q.again === "string" && q.again ? "<p>" + esc(q.again) + "</p>" : "") + "</div>";
    }
  }

  root.addEventListener("click", function (e) {
    var target = actionTarget(e.target), cardEl, act;
    if (!target) { return; }
    cardEl = cardOf(target);
    if (!cardEl) { return; }
    act = target.getAttribute("data-act");
    if (act === "read") { markRead(cardEl); } else if (act === "pick") { pick(cardEl, target); }
  });

  /* Arrow keys move between the answers of a question. Tab still works as usual. */
  root.addEventListener("keydown", function (e) {
    var key = e.key, t = e.target, opts, i, at = -1, step;
    if (!t || t.nodeType !== 1 || t.getAttribute("data-act") !== "pick") { return; }
    if (key === "ArrowDown" || key === "ArrowRight" || key === "Down" || key === "Right") {
      step = 1;
    } else if (key === "ArrowUp" || key === "ArrowLeft" || key === "Up" || key === "Left") {
      step = -1;
    } else {
      return;
    }
    opts = t.parentNode.querySelectorAll("button[data-act=pick]");
    for (i = 0; i < opts.length; i++) { if (opts[i] === t) { at = i; } }
    if (at === -1) { return; }
    e.preventDefault();
    focusOn(opts[(at + step + opts.length) % opts.length]);
  });

  searchBox.addEventListener("input", function () {
    query = searchBox.value.trim().toLowerCase();
    render();
  });
  window.addEventListener("hashchange", openFromHash);
  window.addEventListener("beforeprint", function () {
    /* Opening a card logs nothing, so printing logs nothing. */
    document.querySelectorAll("details").forEach(function (d) { d.open = true; });
  });

  buildFilters();
  render();
  openFromHash();

  /* A Guided Study tick, another tab, or a restored backup can change what is read. */
  if (game() && typeof game().on === "function") { game().on("change", paintAll); }
})();

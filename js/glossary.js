/* Renders the plain-English glossary: a word list with search, and flashcard practice.
   Data: js/data/glossary.js (window.GLOSSARY). Contract: docs/GAME_CONTRACT.md, section 10.
   glossary.html#<id> opens that word. glossary.html#cards opens the flashcards.
   The only activity this page logs is gloss:<id>, on the first flip of a word's card. */
(function () {
  "use strict";

  /* ---------- the groups, in the order they are shown ---------- */

  var GROUPS = [
    { kind: "Trail word", id: "group-trail", title: "Words the Trail teaches",
      note: "You meet these on the Trail. They are in the order the Trail teaches them." },
    { kind: "What the library calls it", id: "group-library-names", title: "What the library calls it",
      note: "Ideas you know from the Trail, under the names the library uses." },
    { kind: "Library word", id: "group-library", title: "More library words",
      note: "Words you meet when you read on in the library." },
    { kind: "Person", id: "group-people", title: "People",
      note: "Names the library keeps coming back to." },
    { kind: "Place or thing", id: "group-things", title: "Places and things",
      note: "" }
  ];
  var FIRST_KIND = "Trail word";

  /* Pages an entry's optional "page" field may point to, with the names the navigation uses. */
  var PAGES = {
    "curriculum.html": "Curriculum",
    "study.html": "Guided Study",
    "canon.html": "The Canon",
    "suttas.html": "Sutta Library",
    "vinaya.html": "Monks\u2019 Rules",
    "themes.html": "Modern Life",
    "journey.html": "Journey West"
  };

  /* ---------- every word this file shows to the learner ---------- */

  var TEXT = {
    sayIt: "Say it: ",
    oldWord: "The old word is ",
    more: "More",
    less: "Less",
    about: " about ",
    onTrail: "On the Trail: ",
    inLibrary: "In the library (harder reading): ",
    onPage: "A library page (harder reading): ",
    all: "Showing all {n} words.",
    one: "1 word matches \u201c{q}\u201d.",
    many: "{n} words match \u201c{q}\u201d.",
    none: "No word matches \u201c{q}\u201d.",
    noData: "The word list could not load. Reloading the page may help.",
    seen: "{s} of {n} words seen",
    firstLook: "{p} for your first look at this word.",
    pointsNote: "Each word gives {p} once, on your first look. Flipping again is free practice.",
    allSeenNote: "You have seen every word. Flipping a card again is free practice.",
    endAll: "You have seen all {n} words.",
    endSome: "You have seen {s} of {n} words."
  };

  var ACT = "gloss:";
  var CARDS_HASH = "cards";
  var FOOT_LINK_FROM = 8;
  var TRAIL_PAGE = "trail.html#";
  var LIBRARY_PAGE = "suttas.html#";
  var ICON_TRAIL = "img/brand/path-tile.svg";
  var ICON_BOOK = "img/brand/book.svg";

  var data = Object.prototype.toString.call(window.GLOSSARY) === "[object Array]" ? window.GLOSSARY : [];
  var config = window.GAME_CONFIG && typeof window.GAME_CONFIG === "object" ? window.GAME_CONFIG : {};

  var app = document.getElementById("gloss-app");
  var listView = document.getElementById("gloss-list-view");
  var cardsView = document.getElementById("gloss-cards-view");
  var root = document.getElementById("gloss-root");
  var searchBox = document.getElementById("gloss-search");
  var countEl = document.getElementById("gloss-count");
  var noneEl = document.getElementById("gloss-none");
  var practiceBtn = document.getElementById("gloss-practice");
  var toolsEl = document.getElementById("gloss-tools");
  var footEl = document.getElementById("gloss-foot");

  var items = [];          /* one per word: { g, top, hay, auto, node, head, btn, panel, sortKey } */
  var byId = {};
  var groupNodes = [];     /* { node, items } */
  var seenHere = {};       /* words flipped on this visit, used only when the engine is missing */

  if (!app || !listView || !cardsView || !root || !searchBox) { return; }

  /* ---------- small helpers ---------- */

  function game() {
    var G = window.Game;
    return G && typeof G.award === "function" && typeof G.has === "function" ? G : null;
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) { n.className = cls; }
    if (text !== undefined && text !== null) { n.appendChild(document.createTextNode(String(text))); }
    return n;
  }

  function clear(n) {
    while (n.firstChild) { n.removeChild(n.firstChild); }
  }

  function show(n, on) {
    if (!n) { return; }
    if (on) { n.removeAttribute("hidden"); } else { n.setAttribute("hidden", ""); }
  }

  function fill(template, values) {
    return template.replace(/\{(\w+)\}/g, function (m, key) {
      return values.hasOwnProperty(key) ? String(values[key]) : m;
    });
  }

  /* Lower case, no accent marks, no quote marks, hyphens as spaces: so the accented
     spelling of metta, plain "metta" and "not self" all find what the learner means. */
  function norm(s) {
    var out = String(s === undefined || s === null ? "" : s).toLowerCase();
    if (typeof out.normalize === "function") {
      out = out.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
    return out.replace(/[\u2018\u2019\u201c\u201d"']/g, "")
      .replace(/[\u2010-\u2015\-]/g, " ")
      .replace(/\s+/g, " ")
      .replace(/^ | $/g, "");
  }

  /* A picture with a fixed size. It is hidden if it has not arrived, so the layout never moves. */
  function icon(src) {
    var img = document.createElement("img");
    img.className = "icon-img gloss-link-icon";
    img.setAttribute("width", "24");
    img.setAttribute("height", "24");
    img.setAttribute("alt", "");
    img.onerror = function () {
      img.setAttribute("hidden", "");
      img.style.display = "none";
    };
    img.src = src;
    return img;
  }

  function focusOn(n) {
    if (!n) { return; }
    try { n.focus({ preventScroll: true }); } catch (e) {
      try { n.focus(); } catch (e2) { /* nothing to focus */ }
    }
  }

  /* Goes straight there, with no sliding: a jump across a long list is kinder than a ride. */
  function jumpTo(n) {
    if (!n || typeof n.scrollIntoView !== "function") { return; }
    try { n.scrollIntoView({ behavior: "instant", block: "start" }); } catch (e) { n.scrollIntoView(); }
  }

  function lessonTitle(id) {
    var worlds = config.worlds || [], i, j, lessons;
    for (i = 0; i < worlds.length; i++) {
      lessons = (worlds[i] && worlds[i].lessons) || [];
      for (j = 0; j < lessons.length; j++) {
        if (lessons[j] && lessons[j].id === id) { return lessons[j].title || ""; }
      }
    }
    return "";
  }

  function cardInfo(id) {
    var cards = config.cards || {};
    return Object.prototype.hasOwnProperty.call(cards, id) && cards[id] ? cards[id] : null;
  }

  function isSeen(id) {
    var G = game();
    return G ? G.has(ACT + id) : seenHere[id] === true;
  }

  function seenCount() {
    var n = 0, i;
    for (i = 0; i < items.length; i++) {
      if (isSeen(items[i].g.id)) { n += 1; }
    }
    return n;
  }

  function sortKey(term) {
    return norm(term).replace(/^the /, "");
  }

  function byTerm(a, b) {
    return a.sortKey < b.sortKey ? -1 : (a.sortKey > b.sortKey ? 1 : 0);
  }

  /* ---------- building one word ---------- */

  /* The word itself. Old-language words carry lang="pi" so screen readers do not guess. */
  function termNode(g) {
    var span = el("span", "gloss-term-text", g.term);
    if (g.lang) { span.setAttribute("lang", g.lang); }
    return span;
  }

  /* "Say it: DOOK-kah", or for a plain English term with an old word behind it:
     "The old word is metta. Say it: MET-tah". Returns null when there is nothing to say. */
  function sayNode(g, cls) {
    var p, old;
    if (!g.say && !g.old) { return null; }
    p = el("p", cls);
    if (g.old) {
      p.appendChild(el("span", "gloss-say-label", TEXT.oldWord));
      old = el("span", "gloss-old", g.old);
      old.setAttribute("lang", "pi");
      p.appendChild(old);
      p.appendChild(document.createTextNode(g.say ? ". " : "."));
    }
    if (g.say) {
      p.appendChild(el("span", "gloss-say-label", TEXT.sayIt));
      p.appendChild(el("span", "gloss-say-text", g.say));
    }
    return p;
  }

  function linkItem(href, iconSrc, lead, title, small) {
    var li = el("li"), a = el("a", "gloss-link"), words = el("span", "gloss-link-words");
    a.setAttribute("href", href);
    a.appendChild(icon(iconSrc));
    words.appendChild(el("span", "gloss-link-lead", lead));
    words.appendChild(el("span", "gloss-link-title", title));
    if (small) {
      words.appendChild(document.createTextNode(" "));
      words.appendChild(el("span", "gloss-shelf", small));
    }
    a.appendChild(words);
    li.appendChild(a);
    return li;
  }

  function setOpen(item, open) {
    show(item.panel, open);
    item.btn.setAttribute("aria-expanded", open ? "true" : "false");
    item.btnWord.nodeValue = open ? TEXT.less : TEXT.more;
    if (open) { item.node.classList.add("is-open"); } else { item.node.classList.remove("is-open"); }
  }

  function buildEntry(g) {
    var item = { g: g, sortKey: sortKey(g.term) };
    var node = el("article", "gloss-entry");
    var head = el("div", "gloss-head");
    var body = el("div", "gloss-body");
    var title = el("h3", "gloss-term");
    var say = sayNode(g, "gloss-say");
    var btn = el("button", "btn btn-link gloss-more-btn no-print");
    var panel = el("div", "gloss-more");
    var links = el("ul", "gloss-links");
    var lesson = g.lesson ? lessonTitle(g.lesson) : "";
    var card = g.card ? cardInfo(g.card) : null;
    var top = [g.term, g.old, g.say, g.plain];       /* what a closed entry shows */
    var hay = top.concat([g.more, lesson]);          /* and what "More" holds */

    node.id = g.id;
    title.setAttribute("tabindex", "-1");
    title.appendChild(termNode(g));
    head.appendChild(title);
    if (say) { head.appendChild(say); }

    body.appendChild(el("p", "gloss-plain", g.plain));

    btn.setAttribute("type", "button");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", "more-" + g.id);
    item.btnWord = document.createTextNode(TEXT.more);
    btn.appendChild(item.btnWord);
    btn.appendChild(el("span", "sr-only", TEXT.about + g.term));
    body.appendChild(btn);

    panel.id = "more-" + g.id;
    panel.setAttribute("hidden", "");
    if (g.more) { panel.appendChild(el("p", "gloss-more-text", g.more)); }
    if (lesson) {
      links.appendChild(linkItem(TRAIL_PAGE + g.lesson, ICON_TRAIL, TEXT.onTrail, lesson, ""));
    }
    if (card) {
      links.appendChild(linkItem(LIBRARY_PAGE + g.card, ICON_BOOK, TEXT.inLibrary, card.title, card.ref));
      hay.push(card.title, card.ref);
    }
    if (typeof g.page === "string" && Object.prototype.hasOwnProperty.call(PAGES, g.page)) {
      links.appendChild(linkItem(g.page, ICON_BOOK, TEXT.onPage, PAGES[g.page], ""));
      hay.push(PAGES[g.page]);
    }
    if (links.firstChild) { panel.appendChild(links); }
    body.appendChild(panel);

    node.appendChild(head);
    node.appendChild(body);

    item.node = node;
    item.head = title;
    item.btn = btn;
    item.panel = panel;
    item.top = norm(top.join(" "));
    item.hay = norm(hay.join(" "));
    item.auto = false;      /* true while a search, not the learner, has it open */
    btn.addEventListener("click", function () {
      item.auto = false;
      setOpen(item, btn.getAttribute("aria-expanded") !== "true");
    });
    return item;
  }

  /* ---------- building the list ---------- */

  function buildList() {
    var frag = document.createDocumentFragment();
    var i, j, g, item, group, section, heading, holder, list;
    var seenIds = {};
    for (i = 0; i < data.length; i++) {
      g = data[i];
      if (!g || typeof g.id !== "string" || !g.id || typeof g.term !== "string" || seenIds[g.id]) { continue; }
      seenIds[g.id] = true;
      item = buildEntry(g);
      items.push(item);
      byId[g.id] = item;
    }
    for (i = 0; i < GROUPS.length; i++) {
      group = GROUPS[i];
      list = [];
      for (j = 0; j < items.length; j++) {
        if (items[j].g.kind === group.kind) { list.push(items[j]); }
      }
      if (!list.length) { continue; }
      /* The Trail's words stay in Trail order. Every other group is in A to Z order. */
      if (group.kind !== FIRST_KIND) { list.sort(byTerm); }
      section = el("section", "gloss-group");
      section.id = group.id;
      section.setAttribute("aria-labelledby", group.id + "-title");
      heading = el("h2", "gloss-group-title", group.title);
      heading.id = group.id + "-title";
      section.appendChild(heading);
      if (group.note) { section.appendChild(el("p", "gloss-group-note", group.note)); }
      holder = el("div", "gloss-entries");
      for (j = 0; j < list.length; j++) { holder.appendChild(list[j].node); }
      section.appendChild(holder);
      frag.appendChild(section);
      groupNodes.push({ node: section, items: list });
    }
    root.appendChild(frag);
  }

  /* ---------- search ---------- */

  function matches(text, tokens) {
    var i;
    for (i = 0; i < tokens.length; i++) {
      if (text.indexOf(tokens[i]) === -1) { return false; }
    }
    return true;
  }

  /* A match may sit inside "More", where it cannot be seen. Then the search opens the
     entry, so the learner sees why it is listed, and closes it again when the search moves on.
     An entry the learner opened or closed by hand is left alone. */
  function showWhy(item, deep) {
    var open = item.btn.getAttribute("aria-expanded") === "true";
    if (deep && !open) {
      setOpen(item, true);
      item.auto = true;
    } else if (!deep && item.auto) {
      if (open) { setOpen(item, false); }
      item.auto = false;
    }
  }

  function applySearch() {
    var raw = searchBox.value.replace(/^\s+|\s+$/g, "");
    var q = norm(raw);
    var tokens = q ? q.split(" ") : [];
    var shown = 0, i, j, any, hit, item;
    /* The words as typed, together, come first. Only when no entry has them together
       does each typed word count on its own. */
    if (tokens.length > 1) {
      for (i = 0; i < items.length; i++) {
        if (items[i].hay.indexOf(q) !== -1) { tokens = [q]; break; }
      }
    }
    for (i = 0; i < groupNodes.length; i++) {
      any = false;
      for (j = 0; j < groupNodes[i].items.length; j++) {
        item = groupNodes[i].items[j];
        hit = !tokens.length || matches(item.hay, tokens);
        show(item.node, hit);
        showWhy(item, hit && tokens.length > 0 && !matches(item.top, tokens));
        if (hit) { any = true; shown += 1; }
      }
      show(groupNodes[i].node, any);
    }
    if (!items.length) {
      countEl.textContent = TEXT.noData;
    } else if (!tokens.length) {
      countEl.textContent = fill(TEXT.all, { n: items.length });
    } else if (shown === 0) {
      countEl.textContent = fill(TEXT.none, { q: raw });
    } else {
      countEl.textContent = fill(shown === 1 ? TEXT.one : TEXT.many, { n: shown, q: raw });
    }
    show(noneEl, items.length > 0 && tokens.length > 0 && shown === 0);
    show(footEl, shown > FOOT_LINK_FROM);   /* a short list needs no way back up */
  }

  /* The matches sit under the box. When they are off the bottom of the screen, the box
     moves to the top so that typing shows them. It moves once, not on every letter. */
  function onType() {
    var view = window.innerHeight || document.documentElement.clientHeight || 0;
    applySearch();
    if (searchBox.value && toolsEl && view && countEl.getBoundingClientRect().top > view * 0.6) {
      jumpTo(toolsEl);
    }
  }

  function clearSearch() {
    if (searchBox.value !== "") {
      searchBox.value = "";
      applySearch();
    }
  }

  /* ---------- the address: #<id> opens a word, #cards opens the flashcards ---------- */

  function hashId() {
    var h = String(window.location.hash || "").replace(/^#/, "");
    try { h = decodeURIComponent(h); } catch (e) { /* keep it as it is */ }
    return h;
  }

  function goTo(hash) {
    if (hashId() === hash) { route(); return; }
    try { window.location.hash = hash; } catch (e) { /* fall through */ }
    if (hashId() !== hash) { route(hash); }
  }

  function openWord(id) {
    var item = byId[id], i;
    if (!item) { return; }
    if (item.node.hasAttribute("hidden")) { clearSearch(); }
    for (i = 0; i < items.length; i++) { items[i].node.classList.remove("is-target"); }
    item.node.classList.add("is-target");
    item.auto = false;
    setOpen(item, true);
    focusOn(item.head);
    jumpTo(item.node);
  }

  function showList(fromCards) {
    show(cardsView, false);
    show(listView, true);
    if (fromCards) {
      focusOn(practiceBtn);
      jumpTo(toolsEl);
    }
  }

  function route(forced) {
    var id = typeof forced === "string" ? forced : hashId();
    var wasCards = !cardsView.hasAttribute("hidden");
    if (id === CARDS_HASH && items.length) {
      show(listView, false);
      show(cardsView, true);
      startCards();
      return;
    }
    showList(wasCards && !byId[id]);
    if (byId[id]) { openWord(id); }
  }

  /* ---------- flashcards ---------- */

  var order = [];
  var pos = 0;
  var flipped = false;

  var cardEl = document.getElementById("flash-card");
  var endEl = document.getElementById("flash-end");
  var kindEl = document.getElementById("flash-kind");
  var termEl = document.getElementById("flash-term");
  var sayEl = document.getElementById("flash-say");
  var frontEl = document.getElementById("flash-front");
  var firstEl = document.getElementById("flash-first");
  var backEl = document.getElementById("flash-back");
  var showBtn = document.getElementById("flash-show");
  var nextBtn = document.getElementById("flash-next");
  var moreLink = document.getElementById("flash-more");
  var prevBtn = document.getElementById("flash-prev");
  var noteEl = document.getElementById("cards-note");
  var progressEl = document.getElementById("cards-progress-text");
  var barEl = document.getElementById("cards-bar-fill");
  var cardsTitle = document.getElementById("cards-title");
  var endTitle = document.getElementById("flash-end-title");
  var endText = document.getElementById("flash-end-text");

  /* Trail words first, in Trail order. Then every other word from A to Z. Never shuffled. */
  function buildOrder() {
    var first = [], rest = [], i;
    for (i = 0; i < items.length; i++) {
      if (items[i].g.kind === FIRST_KIND) { first.push(items[i]); } else { rest.push(items[i]); }
    }
    rest.sort(byTerm);
    order = first.concat(rest);
  }

  function pointsWord(n) {
    var S = window.Site;
    if (S && typeof S.pointsWord === "function") { return S.pointsWord(n); }
    return n + (n === 1 ? " point" : " points");
  }

  /* Points a first flip would pay right now. 0 when the engine is missing or the cap is reached. */
  function payNow() {
    var G = game(), pay, room;
    if (!G || !config.xp || typeof config.xp.gloss !== "number") { return 0; }
    pay = config.xp.gloss > 0 ? Math.floor(config.xp.gloss) : 0;
    if (config.caps && typeof config.caps.xp === "number") {
      room = config.caps.xp - G.xp();
      if (room < 0) { room = 0; }
      if (pay > room) { pay = room; }
    }
    return pay;
  }

  function paintProgress() {
    var total = items.length, seen = seenCount();
    if (progressEl) { progressEl.textContent = fill(TEXT.seen, { s: seen, n: total }); }
    if (barEl) { barEl.style.width = (total ? Math.round(100 * seen / total) : 0) + "%"; }
  }

  function paintNote() {
    var total = items.length, seen = seenCount(), pay = payNow();
    if (!noteEl) { return; }
    if (total && seen >= total) {
      noteEl.className = "cards-note";
      noteEl.textContent = TEXT.allSeenNote;
      show(noteEl, true);
    } else if (pay > 0) {
      noteEl.className = "cards-note points";
      noteEl.textContent = fill(TEXT.pointsNote, { p: pointsWord(pay) });
      show(noteEl, true);
    } else {
      show(noteEl, false);
    }
  }

  /* The front of the card: the word and how to say it. The meaning waits for the button. */
  function paintFront() {
    var item = order[pos], g, say, pay;
    if (!item) { return; }
    g = item.g;
    flipped = false;
    show(endEl, false);
    show(cardEl, true);
    kindEl.textContent = g.kind || "";
    clear(termEl);
    termEl.appendChild(termNode(g));
    clear(sayEl);
    say = sayNode(g, "");
    if (say) {
      while (say.firstChild) { sayEl.appendChild(say.firstChild); }
    }
    clear(backEl);
    /* The points are printed on the thing that gives them, before it is tapped. */
    pay = isSeen(g.id) ? 0 : payNow();
    firstEl.textContent = pay > 0 ? fill(TEXT.firstLook, { p: pointsWord(pay) }) : "";
    show(firstEl, pay > 0);
    show(frontEl, true);
    show(showBtn, true);
    show(nextBtn, false);
    show(moreLink, false);
    moreLink.setAttribute("href", "#" + g.id);
    show(prevBtn, pos > 0);
  }

  /* The back: the plain meaning. The first flip of a word is logged, once. */
  function flip() {
    var item = order[pos], G = game(), res, pts = 0;
    if (!item || flipped) { return; }
    if (G) {
      if (!G.has(ACT + item.g.id)) {
        /* Silent: the points are shown small on the card itself, so no toast is needed.
           A new badge or title is still announced by js/site.js. */
        res = G.award(ACT + item.g.id, { silent: true });
        if (res && res.awarded && res.xp > 0) { pts = res.xp; }
      }
    } else {
      seenHere[item.g.id] = true;
    }
    flipped = true;
    show(frontEl, false);
    clear(backEl);
    backEl.appendChild(el("p", "flash-plain", item.g.plain));
    if (pts > 0) { backEl.appendChild(el("p", "points flash-points", pointsWord(pts) + ".")); }
    show(showBtn, false);
    show(nextBtn, true);
    show(moreLink, true);
    paintProgress();
    focusOn(nextBtn);
  }

  function showEnd() {
    var total = items.length, seen = seenCount();
    show(cardEl, false);
    show(endEl, true);
    endText.textContent = fill(seen >= total ? TEXT.endAll : TEXT.endSome, { s: seen, n: total });
    paintProgress();
    focusOn(endTitle);
  }

  function nextWord() {
    if (pos + 1 >= order.length) {
      pos = order.length;
      showEnd();
      return;
    }
    pos += 1;
    paintFront();
    focusOn(termEl);
  }

  function prevWord() {
    if (pos <= 0) { return; }
    pos -= 1;
    paintFront();
    focusOn(termEl);
  }

  function restart() {
    pos = 0;
    paintNote();
    paintFront();
    focusOn(termEl);
  }

  /* Starts at the first word not yet flipped, or at the first word when all have been. */
  function startCards() {
    var i;
    if (!order.length) { buildOrder(); }
    pos = 0;
    for (i = 0; i < order.length; i++) {
      if (!isSeen(order[i].g.id)) { pos = i; break; }
    }
    paintNote();
    paintProgress();
    paintFront();
    focusOn(cardsTitle);
    /* The card goes to the top of the screen, clear of the page header. */
    jumpTo(cardsView);
  }

  /* ---------- wiring ---------- */

  function wire() {
    var G = game(), opened = [];

    searchBox.addEventListener("input", onType);
    searchBox.addEventListener("search", applySearch);
    document.getElementById("gloss-clear").addEventListener("click", function () {
      clearSearch();
      focusOn(searchBox);
    });
    document.getElementById("gloss-to-top").addEventListener("click", function () {
      jumpTo(listView);
      focusOn(searchBox);
    });

    practiceBtn.addEventListener("click", function () { goTo(CARDS_HASH); });
    document.getElementById("cards-back").addEventListener("click", function () { goTo(""); });
    document.getElementById("flash-done").addEventListener("click", function () { goTo(""); });
    document.getElementById("flash-again").addEventListener("click", restart);
    showBtn.addEventListener("click", flip);
    nextBtn.addEventListener("click", nextWord);
    prevBtn.addEventListener("click", prevWord);

    window.addEventListener("hashchange", function () { route(); });

    /* On paper every word is open. Afterward the page goes back to how it was. */
    window.addEventListener("beforeprint", function () {
      var i;
      opened = [];
      for (i = 0; i < items.length; i++) {
        if (items[i].btn.getAttribute("aria-expanded") !== "true") {
          setOpen(items[i], true);
          opened.push(items[i]);
        }
      }
    });
    window.addEventListener("afterprint", function () {
      var i;
      for (i = 0; i < opened.length; i++) { setOpen(opened[i], false); }
      opened = [];
    });

    /* Another tab, a restored backup or Start Over: keep the count true. */
    if (G && typeof G.on === "function") {
      G.on("change", function () {
        if (!cardsView.hasAttribute("hidden")) { paintProgress(); }
      });
    }
  }

  buildList();
  buildOrder();
  wire();
  applySearch();
  show(practiceBtn, items.length > 0);
  show(app, true);
  route();
  /* Pictures and the strip under the header may settle after this script runs. */
  window.addEventListener("load", function () {
    var id = hashId();
    if (byId[id] && cardsView.hasAttribute("hidden")) { jumpTo(byId[id].node); }
  });
})();

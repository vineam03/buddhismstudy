/* My Journey (profile.html): days you showed up, the title now, all ten titles, the Trail
   world by world, every badge, counts across the site, the One Quiet Minute card, settings,
   saving to a file, loading from a file and starting over.
   Design: docs/game-spec.json (homepageFlow steps 10 to 14, humaneRules).
   Contract: docs/GAME_CONTRACT.md. Runs after js/game.js, js/site.js and js/daily.js.

   Nothing here logs an activity. The page only reads the engine, except for the settings
   switches, the name box, "Load progress from a file" and "Start over". */
(function () {
  "use strict";

  var G = window.Game && typeof window.Game.rank === "function" ? window.Game : null;
  var S = window.Site || null;
  var C = window.GAME_CONFIG && typeof window.GAME_CONFIG === "object" ? window.GAME_CONFIG : {};

  var CHECK = "img/brand/check.svg";
  var JOURNEY_EPISODES = 14;
  var MODERN_TOPICS = 14;
  var NBSP = String.fromCharCode(160);   /* a space that keeps "7 of 28" on one line */
  var NB_OF = NBSP + "of" + NBSP;
  var MAX_FILE = 2000000;       /* a saved file is far smaller than this */
  var TRAIL_HELD_KEY = "buddhismstudy-trail-held";   /* must match HELD_KEY in js/trail.js */

  /* ---------- every word this file shows to the learner ---------- */

  var TEXT = {
    noGame: "This page could not load. Every other page still works.",
    cannotSave: "Progress cannot be saved in this browser. Lessons still work.",   /* the same words as js/site.js */
    hello: "Hello, ",
    daysSome: "This number only goes up. Rest days take nothing away.",
    daysNone: "Your first day counts when you finish a lesson or mark something as read.",
    titleNow: "Your title now",
    youHave: "You have ",
    toNext: " to the next title, ",
    oneMore: "There is one more title, Lamp Keeper, for people who read on in the library. No hurry.",
    enough: "Enough.",
    cardsRead: " library cards read.",
    startsAt: "Starts at 0 points",
    at: "At ",
    reached: "Reached",
    now: "Your title now",
    world: "World ",
    lessonsDone: " lessons done.",
    lessonDone: " lesson done.",
    checkDone: "Check complete.",
    checkLater: "Check still to come.",
    trailSumLessons: " lessons done. ",
    trailSumChecks: " checks done.",
    badgeSum: "Here is every badge and how to earn it. There are no hidden ones. You have ",
    badgeSumEnd: ".",
    earned: "Earned ",
    notEarned: "Not earned yet",
    of: " of ",
    nameSaved: "Name saved.",
    nameRemoved: "Name removed.",
    on: "On",
    off: "Off",
    saved: "A file with your progress was saved. It is named ",
    savedEnd: ". Look where this browser keeps downloads.",
    cannotFile: "This browser cannot save a file from this page. Nothing was changed.",
    cannotRead: "This browser cannot read a file on this page. Nothing was changed.",
    loadOk: "Progress loaded from the file.",
    loadBad: "That file could not be read as saved progress. Nothing was changed.",
    loadKept: "Nothing was changed.",
    resetDone: "Everything is erased. You are at the start again.",
    resetKept: "Nothing was erased."
  };

  var SETTING_WORDS = {
    quiet: ["Quiet Mode is on.", "Quiet Mode is off."],
    large: ["Larger text is on.", "Larger text is off."],
    openAll: ["All lessons are open.", "Lessons open in order again."]
  };

  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August",
    "September", "October", "November", "December"];

  var pendingFile = null;       /* the text of a chosen file, waiting for "Yes, load the file" */

  /* ---------- small helpers ---------- */

  function byId(id) { return document.getElementById(id); }

  function isArray(v) { return Object.prototype.toString.call(v) === "[object Array]"; }

  function list(v) { return isArray(v) ? v : []; }

  function safely(fn) {
    try { return fn(); } catch (e) { return undefined; }
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

  function setText(n, text) {
    if (!n) { return; }
    clear(n);
    n.appendChild(document.createTextNode(String(text)));
  }

  function show(n, visible) {
    if (!n) { return; }
    if (visible) { n.removeAttribute("hidden"); } else { n.setAttribute("hidden", ""); }
  }

  /* A picture with a fixed size. One that has not arrived is hidden and moves nothing. */
  function picture(src, size, cls) {
    var img = document.createElement("img");
    img.className = "icon-img" + (cls ? " " + cls : "");
    img.setAttribute("width", size);
    img.setAttribute("height", size);
    img.setAttribute("alt", "");
    img.onerror = function () {
      img.setAttribute("hidden", "");
      img.style.display = "none";
    };
    img.src = src;
    return img;
  }

  function withCommas(n) {
    var s = String(n), out = "";
    while (s.length > 3) {
      out = "," + s.slice(-3) + out;
      s = s.slice(0, -3);
    }
    return s + out;
  }

  function pointsWord(n) {
    if (S && typeof S.pointsWord === "function") { return S.pointsWord(n); }
    return withCommas(n) + (n === 1 ? " point" : " points");
  }

  /* A time in milliseconds -> "October 1, 2026". */
  function dateWords(ms) {
    var d = new Date(ms);
    if (typeof ms !== "number" || isNaN(d.getTime())) { return ""; }
    return MONTHS[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  }

  function count(prefix) { return G.count(prefix); }

  function objectSize(o) {
    var n = 0, k;
    if (!o || typeof o !== "object") { return 0; }
    for (k in o) {
      if (Object.prototype.hasOwnProperty.call(o, k)) { n += 1; }
    }
    return n;
  }

  function cardTotal() { return objectSize(C.cards) || 67; }

  /* The Guided Study boxes that study.html draws as ticked: the same test that page uses,
     so the two pages show the same number. */
  function boxesTicked() {
    var study = C.study, n = 0, k;
    if (!study || typeof study !== "object" || typeof G.studyChecked !== "function") { return count("study:"); }
    for (k in study) {
      if (Object.prototype.hasOwnProperty.call(study, k) && G.studyChecked(k) === true) { n += 1; }
    }
    return n;
  }

  /* How many old Guided Study ticks were counted on the first visit. The engine keeps this
     in its state; Game.state() is used when it exists, the saved copy otherwise. */
  function migrated() {
    var st = null;
    if (typeof G.state === "function") { st = safely(function () { return G.state(); }); }
    if (!st || typeof st !== "object") {
      st = safely(function () { return JSON.parse(G.exportData()); });
    }
    return st && typeof st.migrated === "number" && st.migrated > 0 ? st.migrated : 0;
  }

  function hasProgress() {
    return count("") > 0;
  }

  /* ---------- 1. days, the title now, points in words ---------- */

  function renderTop() {
    var s = G.streak(), r = G.rank(), name = G.name();
    var hello = byId("j-hello"), box = byId("now-title"), text, p, last, total;

    if (hello) {
      setText(hello, name ? TEXT.hello + name + "." : "");
      show(hello, !!name);
    }
    total = s && typeof s.total === "number" ? s.total : 0;
    /* The count is never shown as zero. Before the first day only the words show. */
    setText(byId("days-n"), total > 0 ? withCommas(total) : "");
    show(byId("days-n"), total > 0);
    setText(byId("days-note"), total > 0 ? TEXT.daysSome : TEXT.daysNone);

    if (!box) { return; }
    clear(box);
    last = !r.next;
    box.appendChild(picture(r.icon, 96, "j-now-emblem"));
    text = el("div", "j-now-text");
    text.appendChild(el("p", "j-kicker", TEXT.titleNow));
    text.appendChild(el("p", "j-now-name", r.name));
    text.appendChild(el("p", "j-now-blurb", r.blurb));
    if (last) {
      /* The last title: one word, no number. Counts take the place of points. */
      text.appendChild(el("p", "j-enough", TEXT.enough));
      text.appendChild(el("p", "j-now-points", count("sutta:") + TEXT.of + cardTotal() + TEXT.cardsRead));
    } else {
      p = el("p", "j-now-points", TEXT.youHave + pointsWord(G.xp()) + ".");
      text.appendChild(p);
      if (typeof G.trailDone === "function" && G.trailDone()) {
        /* Once the Trail is finished there is no "points to go" line. */
        text.appendChild(el("p", "j-now-points", TEXT.oneMore));
      } else {
        text.appendChild(el("p", "j-now-points", pointsWord(r.toNext) + TEXT.toNext + r.next.name + "."));
      }
    }
    box.appendChild(text);
  }

  /* ---------- 2. all ten titles ---------- */

  function renderTitles() {
    var root = byId("title-list"), ranks = G.ranks(), cur = G.rank().index, i, r, li, head, mark, body;
    if (!root) { return; }
    clear(root);
    for (i = 0; i < ranks.length; i++) {
      r = ranks[i];
      li = el("li", "j-title" + (i <= cur ? " is-reached" : "") + (i === cur ? " is-now" : ""));
      li.appendChild(picture(r.icon, 56, "j-title-emblem"));
      body = el("div", "j-title-body");
      head = el("p", "j-title-head");
      head.appendChild(el("strong", "j-title-name", r.name));
      head.appendChild(document.createTextNode(" "));
      head.appendChild(el("span", "j-title-points", r.minXp > 0 ? TEXT.at + pointsWord(r.minXp) : TEXT.startsAt));
      body.appendChild(head);
      if (i <= cur) {
        mark = el("p", "j-mark-line");
        mark.appendChild(picture(CHECK, 20, "j-check"));
        mark.appendChild(el("span", "", i === cur ? TEXT.reached + ". " + TEXT.now + "." : TEXT.reached + "."));
        body.appendChild(mark);
      }
      body.appendChild(el("p", "j-title-blurb", r.blurb));
      li.appendChild(body);
      root.appendChild(li);
    }
  }

  /* ---------- 3. the Trail, world by world ---------- */

  function renderTrail() {
    var root = byId("world-list"), worlds = list(C.worlds), lessonsDone = 0, lessonsAll = 0, checks = 0;
    var i, j, w, p, li, body, marks, m, lessons, words, whole;
    if (!root) { return; }
    clear(root);
    for (i = 0; i < worlds.length; i++) {
      w = worlds[i];
      if (!w || !w.id) { continue; }
      p = G.worldProgress(w.id);
      lessons = list(w.lessons);
      lessonsDone += p.done;
      lessonsAll += p.total;
      if (p.bossDone) { checks += 1; }
      whole = p.allDone && p.bossDone;

      li = el("li", "j-world" + (whole ? " is-whole" : ""));
      li.appendChild(picture("img/worlds/" + w.id + ".svg", 64, "j-world-emblem"));
      body = el("div", "j-world-body");
      body.appendChild(el("h3", "j-world-name", TEXT.world + w.order + ": " + w.title));

      words = el("p", "j-world-words");
      if (whole) { words.appendChild(picture(CHECK, 20, "j-check")); }
      words.appendChild(el("span", "", p.done + TEXT.of + p.total +
        (p.total === 1 ? TEXT.lessonDone : TEXT.lessonsDone) + " " + (p.bossDone ? TEXT.checkDone : TEXT.checkLater)));
      body.appendChild(words);

      /* The same thing as small marks: one per lesson, then a square one for the check.
         A filled mark with a tick is done; an open dotted one is not. The words above carry
         the meaning, so the marks are hidden from screen readers. */
      marks = el("p", "j-marks");
      marks.setAttribute("aria-hidden", "true");
      for (j = 0; j < lessons.length; j++) {
        m = el("span", "j-dot" + (G.has("lesson:" + lessons[j].id) ? " is-done" : ""));
        marks.appendChild(m);
      }
      m = el("span", "j-dot j-dot-check" + (p.bossDone ? " is-done" : ""));
      marks.appendChild(m);
      body.appendChild(marks);

      li.appendChild(body);
      root.appendChild(li);
    }
    setText(byId("trail-sum"), lessonsDone + TEXT.of + lessonsAll + TEXT.trailSumLessons +
      checks + TEXT.of + worlds.length + TEXT.trailSumChecks);
  }

  /* ---------- 4. badges ---------- */

  function renderBadges() {
    var root = byId("badge-list"), all = G.badges(), have = 0, i, b, li, body, state, when;
    if (!root) { return; }
    clear(root);
    for (i = 0; i < all.length; i++) {
      b = all[i];
      if (b.earned) { have += 1; }
      li = el("li", "j-badge" + (b.earned ? " is-earned" : " is-open"));
      li.appendChild(picture(b.icon, 64, "j-badge-pic"));
      body = el("div", "j-badge-body");
      body.appendChild(el("h3", "j-badge-name", b.name));
      state = el("p", "j-mark-line");
      if (b.earned) {
        when = dateWords(b.when);
        state.appendChild(picture(CHECK, 20, "j-check"));
        state.appendChild(el("span", "", when ? TEXT.earned + when : TEXT.reached));
      } else {
        state.appendChild(el("span", "j-badge-open", TEXT.notEarned));
      }
      body.appendChild(state);
      body.appendChild(el("p", "j-badge-how", b.how));
      li.appendChild(body);
      root.appendChild(li);
    }
    setText(byId("badge-sum"), TEXT.badgeSum + have + NB_OF + all.length + TEXT.badgeSumEnd);
  }

  /* ---------- 5. counts across the site ---------- */

  function renderCounts() {
    var root = byId("count-list"), cards = cardTotal(), boxes = objectSize(C.study) || cards;
    var rows, i, r, li, inner, n;
    if (!root) { return; }
    rows = [
      { n: count("sutta:"), of: cards, many: "library cards read", href: "suttas.html" },
      { n: count("suttaq:"), of: cards, many: "card questions answered", href: "suttas.html" },
      { n: count("rule:"), many: "rule stories read", one: "rule story read", href: "vinaya.html" },
      { n: boxesTicked(), of: boxes, many: "Guided Study boxes ticked", href: "study.html" },
      { n: count("jw:"), of: JOURNEY_EPISODES, many: "Journey to the West episodes read", href: "journey.html" },
      { n: count("theme:"), of: MODERN_TOPICS, many: "Modern Life topics read", href: "themes.html" },
      { n: count("gloss:"), many: "glossary words flipped", one: "glossary word flipped", href: "glossary.html" },
      { n: count("daily:"), many: "quiet minutes done", one: "quiet minute done" }
    ];
    clear(root);
    for (i = 0; i < rows.length; i++) {
      r = rows[i];
      li = el("li", "j-count");
      inner = r.href ? el("a", "j-count-row") : el("div", "j-count-row");
      if (r.href) { inner.setAttribute("href", r.href); }
      n = withCommas(r.n) + (r.of ? TEXT.of + r.of : "");
      inner.appendChild(el("span", "j-count-n", n));
      inner.appendChild(document.createTextNode(" "));
      inner.appendChild(el("span", "j-count-words", r.n === 1 && !r.of && r.one ? r.one : r.many));
      li.appendChild(inner);
      root.appendChild(li);
    }
    show(byId("migrated-note"), migrated() > 0);
  }

  /* ---------- 7. settings ---------- */

  function paintSwitches() {
    var nodes = document.querySelectorAll(".j-switch[data-setting]"), i, on, state;
    for (i = 0; i < nodes.length; i++) {
      on = G.setting(nodes[i].getAttribute("data-setting")) === true;
      nodes[i].setAttribute("aria-pressed", on ? "true" : "false");
      state = nodes[i].querySelector(".j-switch-state");
      if (state) { setText(state, on ? TEXT.on : TEXT.off); }
    }
  }

  function wireSwitches() {
    var nodes = document.querySelectorAll(".j-switch[data-setting]"), i;
    function wire(btn) {
      btn.addEventListener("click", function () {
        var name = btn.getAttribute("data-setting");
        var on = G.setting(name) !== true;
        var before = btn.getBoundingClientRect().top, moved;
        G.setting(name, on);
        paintSwitches();
        if (SETTING_WORDS[name]) { setText(byId("settings-msg"), SETTING_WORDS[name][on ? 0 : 1]); }
        /* The page above may have grown or shrunk. Keep the pressed switch where it was in
           the window. "instant" because css/styles.css scrolls smoothly by default. */
        moved = btn.getBoundingClientRect().top - before;
        if (moved) {
          try { window.scrollBy({ top: moved, left: 0, behavior: "instant" }); }
          catch (e) { window.scrollBy(0, moved); }
        }
      });
    }
    for (i = 0; i < nodes.length; i++) { wire(nodes[i]); }
  }

  function paintName() {
    var input = byId("name-input");
    if (input && document.activeElement !== input) { input.value = G.name(); }
  }

  function wireName() {
    var form = byId("name-form"), input = byId("name-input");
    if (!form || !input) { return; }
    form.addEventListener("submit", function (e) {
      var saved;
      if (e && e.preventDefault) { e.preventDefault(); }
      saved = G.setName(input.value);
      input.value = saved;
      setText(byId("name-msg"), saved ? TEXT.nameSaved : TEXT.nameRemoved);
    });
  }

  /* ---------- save to a file, load from a file, start over ---------- */

  function message(text, takeFocus) {
    var msg = byId("backup-msg");
    if (!msg) { return; }
    setText(msg, text);
    if (takeFocus) { safely(function () { msg.focus(); }); }
  }

  function closeConfirms() {
    show(byId("load-confirm"), false);
    show(byId("reset-confirm"), false);
    pendingFile = null;
  }

  function saveToFile() {
    var name = "buddhism-study-progress-" + G.today() + ".json";
    var ok = safely(function () {
      var text = G.exportData(), blob, url, a, api;
      blob = new Blob([text], { type: "application/json" });
      if (window.navigator && typeof window.navigator.msSaveBlob === "function") {
        window.navigator.msSaveBlob(blob, name);
        return true;
      }
      api = window.URL || window.webkitURL;
      url = api.createObjectURL(blob);
      a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("download", name);
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.setTimeout(function () { safely(function () { api.revokeObjectURL(url); }); }, 2000);
      return true;
    });
    closeConfirms();
    message(ok === true ? TEXT.saved + name + TEXT.savedEnd : TEXT.cannotFile, false);
  }

  /* News the Trail was holding for its next reward card belongs to the progress that is
     going away. It must not be shown to the progress that takes its place. */
  function clearHeld() {
    try { window.localStorage.removeItem(TRAIL_HELD_KEY); } catch (e) { /* tried */ }
  }

  /* The same core test the engine uses on a save: v, points and the list of things done. */
  function looksSaved(text) {
    var o = safely(function () { return JSON.parse(text); });
    return !!o && typeof o === "object" && !isArray(o) && o.v === 1 &&
      typeof o.xp === "number" && isFinite(o.xp) && o.xp >= 0 &&
      !!o.done && typeof o.done === "object" && !isArray(o.done);
  }

  function loadNow(text) {
    var ok = safely(function () { return G.importData(text); }) === true;
    if (ok) { clearHeld(); }
    closeConfirms();
    message(ok ? TEXT.loadOk : TEXT.loadBad, true);
  }

  function fileChosen(input) {
    var file = input.files && input.files[0], reader;
    if (!file) { return; }
    if (typeof window.FileReader !== "function") {
      message(TEXT.cannotRead, true);
      return;
    }
    if (file.size > MAX_FILE) {
      input.value = "";
      message(TEXT.loadBad, true);
      return;
    }
    reader = new window.FileReader();
    reader.onerror = function () {
      input.value = "";
      message(TEXT.loadBad, true);
    };
    reader.onload = function () {
      var text = typeof reader.result === "string" ? reader.result : "";
      input.value = "";            /* so that the same file can be picked again */
      if (!looksSaved(text)) {     /* not saved progress: say so, and ask nothing */
        closeConfirms();
        message(TEXT.loadBad, true);
        return;
      }
      if (!hasProgress()) {
        loadNow(text);             /* nothing here to replace, so there is nothing to ask */
        return;
      }
      closeConfirms();
      pendingFile = text;
      message("", false);
      show(byId("load-confirm"), true);
      safely(function () { byId("load-confirm-text").focus(); });
    };
    reader.readAsText(file);
  }

  function startOver() {
    safely(function () { G.reset(); });
    clearHeld();
    if (window.Daily && typeof window.Daily.reset === "function") { window.Daily.reset(); }
    closeConfirms();
    message(TEXT.resetDone, true);
  }

  function wireBackup() {
    var saveBtn = byId("save-btn"), loadBtn = byId("load-btn"), input = byId("load-input");
    var resetBtn = byId("reset-btn");

    if (saveBtn) { saveBtn.addEventListener("click", saveToFile); }

    if (loadBtn && input) {
      loadBtn.addEventListener("click", function () {
        closeConfirms();
        message("", false);
        safely(function () { input.click(); });
      });
      input.addEventListener("change", function () { fileChosen(input); });
    }
    if (byId("load-yes")) {
      byId("load-yes").addEventListener("click", function () {
        var text = pendingFile;
        if (typeof text === "string") { loadNow(text); } else { closeConfirms(); }
      });
    }
    if (byId("load-no")) {
      byId("load-no").addEventListener("click", function () {
        closeConfirms();
        message(TEXT.loadKept, false);
        if (loadBtn) { loadBtn.focus(); }
      });
    }

    /* Start over asks once, in plain words, and "No" is as plain to find as "Yes". */
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        closeConfirms();
        message("", false);
        show(byId("reset-confirm"), true);
        safely(function () { byId("reset-confirm-text").focus(); });
      });
    }
    if (byId("reset-yes")) { byId("reset-yes").addEventListener("click", startOver); }
    if (byId("reset-no")) {
      byId("reset-no").addEventListener("click", function () {
        closeConfirms();
        message(TEXT.resetKept, false);
        if (resetBtn) { resetBtn.focus(); }
      });
    }
  }

  /* ---------- the privacy line and the notice when progress cannot be saved ---------- */

  function paintSaving() {
    var can = typeof G.canSave !== "function" || G.canSave() !== false;
    var note = byId("save-note");
    /* The strip under the header (js/site.js) says the same thing. Say it once. */
    var inStrip = !can && !!document.querySelector("#hud .hud-note");
    if (note) {
      setText(note, can || inStrip ? "" : TEXT.cannotSave);
      show(note, !can && !inStrip);
    }
    show(byId("privacy-line"), can);
  }

  /* ---------- everything ---------- */

  function renderAll() {
    safely(renderTop);
    safely(renderTitles);
    safely(renderTrail);
    safely(renderBadges);
    safely(renderCounts);
    safely(paintSwitches);
    safely(paintName);
    safely(paintSaving);
  }

  if (!G) {
    safely(function () {
      var note = byId("save-note");
      setText(note, TEXT.noGame);
      show(note, true);
    });
    return;
  }

  renderAll();
  safely(wireSwitches);
  safely(wireName);
  safely(wireBackup);
  if (S && typeof S.renderRun === "function") { S.renderRun(byId("j-run")); }
  if (window.Daily && typeof window.Daily.mount === "function") { window.Daily.mount(byId("daily")); }
  G.on("change", renderAll);
})();

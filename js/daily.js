/* The "One Quiet Minute" card: window.Daily.mount(element).
   Design: "dailyPractice" in docs/game-spec.json. Contract: docs/GAME_CONTRACT.md, section 1.

   Self-contained. It adds its own small <style> block once, and uses the site's colour
   variables and the shared classes in css/game.css (.panel, .btn, .points, .sr-only).
   Any page can use it: load js/data/trail-w0.js to trail-w7.js, js/data/game-config.js,
   js/game.js, js/site.js and this file, then call Daily.mount(element).
   Optional: data-heading-level="3" on the element makes the card's heading an <h3>.

   The card is optional and never blocks anything. It offers one try-it-now exercise a day,
   taken only from lessons already finished. The pick is fixed for the day and chosen by
   date, least recently practised first. There is no randomness, no reminder, no countdown
   and no sound. It never mentions a day that went by without a practice.

   The only thing it logs is "daily:<Game.today()>", when the learner taps "I did it".
   Its own small history lives in localStorage under "buddhismstudy-daily-v1":
     { v: 1, day, pick, chosen, did, didDay, last: { "<lessonId>": "YYYY-MM-DD" } }
   Nothing is kept about the "How was that?" answer. */
(function () {
  "use strict";

  var KEY = "buddhismstudy-daily-v1";
  var STYLE_ID = "daily-style";
  var RING_SECONDS = 60;
  var RING_R = 52;
  var RING_LENGTH = 326.73;            /* 2 x pi x 52 */
  var SVG_NS = "http://www.w3.org/2000/svg";
  var TRAIL_PAGE = "trail.html";
  var ICON = "img/icons/breath-wave.svg";
  var CHECK = "img/brand/check.svg";
  var DAY_MS = 86400000;

  /* ---------- every word this file shows to the learner ---------- */

  var TEXT = {
    title: "One Quiet Minute",
    sub: "One short practice for today. Only if you want to.",
    defaultPractice: "Take three slow breaths and feel your feet on the floor.",
    defaultName: "Three slow breaths",
    from: "From the lesson \u201c",
    fromEnd: "\u201d",
    start: "Start",
    pick: "Pick a different one",
    did: "I did it",
    notNow: "Not now",
    ringAlt: "about one minute",
    guide: "Take about one minute. The ring is only a guide. Stop early or go on longer, as you like.",
    guideFull: "That was about one minute. Stop now or carry on. Both are fine.",
    done: "Done for today. That is enough.",
    how: "How was that?",
    howSkip: "You can skip this.",
    answers: ["Calmer", "About the same", "Restless"],
    reply: "Good noticing.",
    lessonBefore: "This practice comes from the lesson ",
    lessonAfter: ".",
    trailBefore: "More short practices come with each lesson on ",
    trailLink: "the Trail",
    again: "A second practice today is welcome.",
    againPoints: "It gives no points.",
    more: "Do one more",
    listTitle: "Practices from lessons you have done",
    listNote: "Pick one to use today.",
    close: "Close the list",
    todays: "Today\u2019s pick",
    aDay: " a day for your first ",
    days: " days.",
    added: " added."
  };

  var CSS = [
    ".daily { margin: 1.5rem 0; }",
    ".daily-head { display: flex; align-items: center; gap: .8rem; margin-bottom: .7rem; }",
    ".daily-title { margin: 0; color: var(--gold); font-size: 1.3em; line-height: 1.25; }",
    ".daily-sub { margin: 0; color: var(--text); font-size: .9em; line-height: 1.45; }",
    ".daily-from { margin: 0 0 .25rem; color: var(--text-dim); font-size: .9em; }",
    ".daily-practice { max-width: 38rem; color: var(--text); }",
    ".daily-practice p + p, .daily-big p + p { margin-top: .55em; }",
    ".daily-points { margin-top: .7rem; color: var(--text); }",
    ".daily-note { margin-top: .7rem; color: var(--text); }",
    ".daily-note .points { color: var(--text); font-size: inherit; }",
    ".daily-actions { display: flex; flex-wrap: wrap; align-items: center; gap: .6rem 1rem; margin-top: .9rem; }",
    ".daily-run { display: flex; align-items: flex-start; gap: 1.4rem; }",
    ".daily-ring { display: block; flex: 0 0 auto; width: 112px; height: 112px; }",
    ".daily-ring-track { fill: none; stroke: var(--border); stroke-width: 8; }",
    ".daily-ring-fill { fill: none; stroke: var(--gold-soft); stroke-width: 8; stroke-linecap: round;",
    "  stroke-dasharray: " + RING_LENGTH + "; stroke-dashoffset: " + RING_LENGTH + "; opacity: .85;",
    "  animation: daily-fill " + RING_SECONDS + "s linear both; }",
    "@keyframes daily-fill { from { stroke-dashoffset: " + RING_LENGTH + "; } to { stroke-dashoffset: 0; } }",
    ".daily-run-text { flex: 1 1 auto; min-width: 0; max-width: 36rem; }",
    ".daily-big { color: var(--text); font-size: 1.35em; line-height: 1.5; }",
    ".daily-guide { margin-top: .8rem; color: var(--text); font-size: .9em; }",
    ".daily-done { display: flex; align-items: center; gap: .6rem; color: var(--text); font-size: 1.15em; font-weight: bold; line-height: 1.35; }",
    ".daily-how { min-width: 0; margin: 1rem 0 0; padding: 0; border: 0; }",
    ".daily-how legend { padding: 0; color: var(--text); font-weight: bold; }",
    ".daily-how legend span { font-weight: normal; }",
    ".daily-how .daily-actions { margin-top: .5rem; }",
    ".daily-reply { margin-top: 1rem; color: var(--gold); font-weight: bold; }",
    ".daily-lesson { margin-top: .6rem; color: var(--text); }",
    ".daily-lesson a { display: inline-flex; align-items: center; min-height: 48px; margin: 0;",
    "  text-decoration: underline; text-underline-offset: .2em; }",
    ".daily-actions > .btn-link, .daily-body > .btn-link { margin-left: -.4rem; }",
    ".daily-list-title { margin: 0 0 .45rem; color: var(--gold-soft); font-size: 1.1em; line-height: 1.3; }",
    ".daily-list-note { color: var(--text); font-size: .9em; }",
    ".daily-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr)); gap: .6rem;",
    "  margin: .8rem 0 .6rem; padding: 0; list-style: none; }",
    ".daily-choice { display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: .1rem;",
    "  width: 100%; height: 100%; padding: .5rem .9rem; font-size: 1em; font-weight: normal; text-align: left; }",
    ".daily-choice-note { color: var(--gold-soft); font-size: .85em; font-weight: bold; }",
    ".daily [tabindex=\"-1\"]:focus { outline: none; }",
    ".daily [tabindex=\"-1\"]:focus-visible { outline: 3px solid var(--orange); outline-offset: 5px; border-radius: 4px; }",
    "html.large-text .daily-ring { width: 128px; height: 128px; }",
    "html.large-text .daily-choice { font-size: 1em; }",
    "@media (max-width: 560px) {",
    "  .daily-run { flex-direction: column; align-items: center; gap: 1rem; }",
    "  .daily-run-text { width: 100%; }",
    "  .daily-actions .btn-primary { flex: 1 1 100%; }",
    "  .daily-list { grid-template-columns: 1fr; }",
    "}",
    "@media (prefers-reduced-motion: reduce) {",
    "  .daily-ring-fill { animation: none; stroke-dashoffset: 0; opacity: .45; }",
    "}",
    "@media print { .daily { display: none !important; } }"
  ].join("\n");

  var hasOwn = Object.prototype.hasOwnProperty;
  var instances = [];
  var store = null;          /* kept in memory when storage cannot be used */
  var storeRaw = null;       /* the saved text this page last read or wrote */
  var wired = false;
  var busy = false;          /* true while this file is logging its own activity */
  var nextId = 0;

  /* ---------- small helpers ---------- */

  function own(obj, key) { return !!obj && hasOwn.call(obj, key); }

  function isArray(v) { return Object.prototype.toString.call(v) === "[object Array]"; }

  function game() {
    var G = window.Game;
    return G && typeof G.award === "function" && typeof G.has === "function" ? G : null;
  }

  function config() {
    var c = window.GAME_CONFIG;
    return c && typeof c === "object" ? c : {};
  }

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

  function addClass(n, cls) {
    if ((" " + (n.className || "") + " ").indexOf(" " + cls + " ") === -1) {
      n.className = n.className ? n.className + " " + cls : cls;
    }
  }

  /* A picture with a fixed size. If it has not arrived it is hidden and nothing moves. */
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

  function button(cls, label, onClick) {
    var b = el("button", "btn " + cls, label);
    b.setAttribute("type", "button");
    b.addEventListener("click", onClick);
    return b;
  }

  function focusOn(node) {
    if (!node) { return; }
    safely(function () { node.focus(); });
  }

  /* Plain text with blank lines becomes paragraphs. A single line break stays a line break. */
  function paragraphs(parent, text) {
    var blocks = String(text).split(/\n\s*\n/), i, j, lines, p;
    for (i = 0; i < blocks.length; i++) {
      if (!blocks[i].replace(/\s+/g, "")) { continue; }
      p = document.createElement("p");
      lines = blocks[i].split("\n");
      for (j = 0; j < lines.length; j++) {
        if (j > 0) { p.appendChild(document.createElement("br")); }
        p.appendChild(document.createTextNode(lines[j]));
      }
      parent.appendChild(p);
    }
  }

  function pointsWord(n) {
    if (window.Site && typeof window.Site.pointsWord === "function") { return window.Site.pointsWord(n); }
    return n + (n === 1 ? " point" : " points");
  }

  /* ---------- dates ---------- */

  function pad2(n) { return (n < 10 ? "0" : "") + n; }

  function today() {
    var G = game(), d, t;
    t = G && typeof G.today === "function" ? safely(function () { return G.today(); }) : null;
    if (typeof t === "string" && t) { return t; }
    d = new Date();
    return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
  }

  /* "YYYY-MM-DD" -> a whole day number. 0 when the text is not a date. */
  function dayNumber(s) {
    var m = typeof s === "string" ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(s) : null;
    return m ? Math.round(Date.UTC(+m[1], +m[2] - 1, +m[3]) / DAY_MS) : 0;
  }

  function isDay(s) { return dayNumber(s) > 0; }

  /* ---------- this file's own small history (every use of storage is guarded) ---------- */

  function freshStore() {
    return { v: 1, day: "", pick: "", chosen: null, did: "", didDay: "", last: {} };
  }

  function cleanStore(o) {
    var s = freshStore(), k;
    if (!o || typeof o !== "object" || o.v !== 1) { return s; }
    if (isDay(o.day)) { s.day = o.day; }
    if (typeof o.pick === "string" && o.pick.length < 40) { s.pick = o.pick; }
    if (typeof o.chosen === "string" && o.chosen.length < 40) { s.chosen = o.chosen; }
    if (typeof o.did === "string" && o.did.length < 40) { s.did = o.did; }
    if (isDay(o.didDay)) { s.didDay = o.didDay; }
    if (o.last && typeof o.last === "object") {
      for (k in o.last) {
        if (own(o.last, k) && k !== "__proto__" && k.length < 40 && isDay(o.last[k])) { s.last[k] = o.last[k]; }
      }
    }
    return s;
  }

  function loadStore() {
    var raw = null;
    try { raw = window.localStorage ? window.localStorage.getItem(KEY) : null; } catch (e) { raw = null; }
    if (typeof raw !== "string") { return freshStore(); }
    storeRaw = raw;
    try { return cleanStore(JSON.parse(raw)); } catch (e2) { return freshStore(); }
  }

  function saveStore() {
    var raw;
    try {
      if (window.localStorage) {
        raw = JSON.stringify(store);
        window.localStorage.setItem(KEY, raw);
        storeRaw = raw;
      }
    } catch (e) { /* the card still works from memory */ }
  }

  /* Another tab may have saved a newer history. Take it, so that this page neither shows an
     old card nor writes an old history over the new one. When storage cannot be read, or
     holds only what this page last read or wrote, the history in memory stays as it is. */
  function reloadStore() {
    var raw = null, next = null;
    if (!store) { return; }                      /* not read yet: data() reads it fresh */
    try { raw = window.localStorage ? window.localStorage.getItem(KEY) : null; } catch (e) { raw = null; }
    if (typeof raw !== "string" || raw === storeRaw) { return; }
    try { next = JSON.parse(raw); } catch (e2) { return; }
    store = cleanStore(next);
    storeRaw = raw;
  }

  function data() {
    if (!store) { store = loadStore(); }
    return store;
  }

  /* ---------- the practices ---------- */

  /* Every try-it-now step on the Trail, in Trail order. Empty when window.TRAIL is missing. */
  function practices() {
    var worlds = isArray(window.TRAIL) ? window.TRAIL.slice() : [], out = [], i, j, k, lessons, steps, l;
    worlds.sort(function (a, b) { return ((a && a.order) || 0) - ((b && b.order) || 0); });
    for (i = 0; i < worlds.length; i++) {
      lessons = worlds[i] && isArray(worlds[i].lessons) ? worlds[i].lessons : [];
      for (j = 0; j < lessons.length; j++) {
        l = lessons[j];
        steps = l && isArray(l.steps) ? l.steps : [];
        for (k = 0; k < steps.length; k++) {
          if (steps[k] && steps[k].type === "try" && typeof steps[k].text === "string" && steps[k].text &&
              typeof l.id === "string" && l.id) {
            out.push({
              id: l.id,
              title: typeof l.title === "string" && l.title ? l.title : l.id,
              text: steps[k].text,
              quiet: typeof steps[k].quietText === "string" ? steps[k].quietText : ""
            });
            break;
          }
        }
      }
    }
    return out;
  }

  /* Only lessons the learner has finished, so nothing unfamiliar appears. */
  function finished() {
    var G = game(), all = practices(), out = [], i;
    if (!G) { return out; }
    for (i = 0; i < all.length; i++) {
      if (G.has("lesson:" + all[i].id)) { out.push(all[i]); }
    }
    return out;
  }

  function defaultPractice() {
    return { id: "", title: TEXT.defaultName, text: TEXT.defaultPractice, quiet: "" };
  }

  function findFinished(id) {
    var list = finished(), i;
    for (i = 0; i < list.length; i++) {
      if (list[i].id === id) { return list[i]; }
    }
    return null;
  }

  /* Chosen by date from the finished lessons, least recently practised first.
     Lessons in GAME_CONFIG.noAutoDaily are never picked here. Returns "" for the default. */
  function autoPick(day) {
    var never = isArray(config().noAutoDaily) ? config().noAutoDaily : [];
    var list = finished(), s = data(), pool = [], group = [], oldest = null, i, when;
    for (i = 0; i < list.length; i++) {
      if (never.indexOf(list[i].id) === -1) { pool.push(list[i]); }
    }
    if (!pool.length) { return ""; }
    for (i = 0; i < pool.length; i++) {
      when = own(s.last, pool[i].id) ? s.last[pool[i].id] : "";
      if (oldest === null || when < oldest) { oldest = when; }
    }
    for (i = 0; i < pool.length; i++) {
      when = own(s.last, pool[i].id) ? s.last[pool[i].id] : "";
      if (when === oldest) { group.push(pool[i]); }
    }
    return group[dayNumber(day) % group.length].id;
  }

  /* Today's pick. Worked out once a day and then kept, so it does not change during the day. */
  function todaysPick() {
    var s = data(), day = today();
    if (s.day === day && (s.pick === "" || findFinished(s.pick))) { return s.pick; }
    s.day = day;
    s.pick = autoPick(day);
    s.chosen = null;
    saveStore();
    return s.pick;
  }

  /* The practice on the card now: the learner's own choice for today, or today's pick. */
  function currentPractice() {
    var pick = todaysPick(), s = data(), id = pick, p;
    if (s.chosen !== null && (s.chosen === "" || findFinished(s.chosen))) { id = s.chosen; }
    p = id ? findFinished(id) : null;
    return p || defaultPractice();
  }

  function isQuiet() {
    var G = game();
    return !!G && typeof G.setting === "function" && safely(function () { return G.setting("quiet"); }) === true;
  }

  function practiceText(p) {
    return isQuiet() && p.quiet ? p.quiet : p.text;
  }

  function doneToday() {
    var G = game();
    if (G) { return G.has("daily:" + today()) === true; }
    return data().didDay === today();
  }

  /* What the card says about points, or "" when it says nothing.
     After the first 30 practice days, and once points have stopped, it says nothing. */
  function pointsLine(second) {
    var G = game(), cfg = config(), per, capDays;
    if (!G || !cfg.xp || !cfg.caps) { return ""; }
    per = cfg.xp.daily;
    capDays = cfg.caps.daily;
    if (!(per > 0) || !(capDays > 0)) { return ""; }
    if (G.count("daily:") >= capDays) { return ""; }
    if (typeof cfg.caps.xp === "number" && G.xp() >= cfg.caps.xp) { return ""; }
    if (second) { return TEXT.againPoints; }
    return pointsWord(per) + TEXT.aDay + capDays + TEXT.days;
  }

  /* ---------- drawing ---------- */

  function addStyle() {
    var style;
    if (document.getElementById(STYLE_ID)) { return; }
    style = document.createElement("style");
    style.id = STYLE_ID;
    style.appendChild(document.createTextNode(CSS));
    (document.head || document.documentElement).appendChild(style);
  }

  function ring(elapsed) {
    var svg = document.createElementNS(SVG_NS, "svg");
    var title = document.createElementNS(SVG_NS, "title");
    var track = document.createElementNS(SVG_NS, "circle");
    var fill = document.createElementNS(SVG_NS, "circle");
    svg.setAttribute("class", "daily-ring");
    svg.setAttribute("viewBox", "0 0 120 120");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", TEXT.ringAlt);
    svg.setAttribute("focusable", "false");
    title.appendChild(document.createTextNode(TEXT.ringAlt));
    svg.appendChild(title);
    track.setAttribute("class", "daily-ring-track");
    track.setAttribute("cx", "60");
    track.setAttribute("cy", "60");
    track.setAttribute("r", String(RING_R));
    svg.appendChild(track);
    fill.setAttribute("class", "daily-ring-fill");
    fill.setAttribute("cx", "60");
    fill.setAttribute("cy", "60");
    fill.setAttribute("r", String(RING_R));
    fill.setAttribute("transform", "rotate(-90 60 60)");
    /* Drawn again part-way through (a setting changed): carry on from where it was. */
    if (elapsed > 0) { fill.style.animationDelay = "-" + Math.min(elapsed, RING_SECONDS) + "s"; }
    svg.appendChild(fill);
    return svg;
  }

  function stopTimer(inst) {
    if (inst.timer !== null) {
      window.clearTimeout(inst.timer);
      inst.timer = null;
    }
  }

  function signature() {
    var s = data();
    return [isQuiet(), doneToday(), today(), pointsLine(false), finished().length,
      s.didDay, s.pick, s.chosen].join("|");
  }

  /* The practice itself, with the lesson it comes from. Returns the block, which can take focus. */
  function practiceBlock(p) {
    var block = el("div", "daily-practice");
    block.setAttribute("tabindex", "-1");
    if (p.id) { block.appendChild(el("p", "daily-from", TEXT.from + p.title + TEXT.fromEnd)); }
    paragraphs(block, practiceText(p));
    return block;
  }

  function drawIdle(inst) {
    var body = inst.body, p = currentPractice(), second = doneToday(), line, note, actions;
    inst.focusBlock = practiceBlock(p);
    body.appendChild(inst.focusBlock);

    line = pointsLine(second);
    if (second) {
      note = el("p", "daily-note", TEXT.again);
      if (line) {
        note.appendChild(document.createTextNode(" "));
        note.appendChild(el("span", "points", line));
      }
      body.appendChild(note);
    } else if (line) {
      body.appendChild(el("p", "daily-points points", line));
    }

    actions = el("div", "daily-actions");
    inst.startBtn = button("btn-primary", TEXT.start, function () {
      inst.view = "running";
      inst.startedAt = new Date().getTime();
      draw(inst);
      focusOn(inst.focusBlock);
    });
    actions.appendChild(inst.startBtn);
    inst.pickBtn = null;
    if (finished().length) {
      inst.pickBtn = button("btn-link", TEXT.pick, function () {
        inst.view = "list";
        draw(inst);
        focusOn(inst.focusBlock);
      });
      actions.appendChild(inst.pickBtn);
    }
    body.appendChild(actions);
  }

  function drawRunning(inst) {
    var body = inst.body, p = currentPractice();
    var elapsed = (new Date().getTime() - inst.startedAt) / 1000;
    var run = el("div", "daily-run"), text = el("div", "daily-run-text"), big, guide, actions, left;
    if (!(elapsed > 0)) { elapsed = 0; }
    run.appendChild(ring(elapsed));

    big = el("div", "daily-big");
    big.setAttribute("tabindex", "-1");
    paragraphs(big, practiceText(p));
    text.appendChild(big);
    inst.focusBlock = big;

    guide = el("p", "daily-guide", elapsed >= RING_SECONDS ? TEXT.guideFull : TEXT.guide);
    guide.setAttribute("aria-live", "polite");
    text.appendChild(guide);

    actions = el("div", "daily-actions");
    actions.appendChild(button("btn-primary", TEXT.did, function () { complete(inst); }));
    actions.appendChild(button("btn-link", TEXT.notNow, function () {
      inst.view = "idle";
      draw(inst);
      focusOn(inst.startBtn);
    }));
    text.appendChild(actions);
    run.appendChild(text);
    body.appendChild(run);

    /* When the ring is full the words say so, quietly. Nothing else happens. */
    left = RING_SECONDS - elapsed;
    if (left > 0) {
      inst.timer = window.setTimeout(function () {
        inst.timer = null;
        if (inst.view === "running" && guide.parentNode) {
          clear(guide);
          guide.appendChild(document.createTextNode(TEXT.guideFull));
        }
      }, Math.ceil(left * 1000));
    }
  }

  function drawDone(inst) {
    var body = inst.body, s = data(), line, how, legend, skip, actions, i, p, a, note, extra, more;

    line = el("p", "daily-done");
    line.setAttribute("tabindex", "-1");
    line.appendChild(picture(CHECK, 26, "daily-check"));
    line.appendChild(el("span", "", TEXT.done));
    body.appendChild(line);
    inst.focusBlock = line;

    if (inst.paid > 0) {
      body.appendChild(el("p", "daily-points points", pointsWord(inst.paid) + TEXT.added));
    }

    /* One optional tap. Every answer gets the same reply, and nothing is kept about it. */
    if (inst.ask) {
      how = el("fieldset", "daily-how");
      legend = el("legend", "", TEXT.how + " ");
      skip = el("span", "", TEXT.howSkip);
      legend.appendChild(skip);
      how.appendChild(legend);
      actions = el("div", "daily-actions");
      for (i = 0; i < TEXT.answers.length; i++) {
        actions.appendChild(button("btn-plain", TEXT.answers[i], function () {
          inst.ask = false;
          inst.replied = true;
          draw(inst);
          focusOn(inst.replyLine);
        }));
      }
      how.appendChild(actions);
      body.appendChild(how);
    } else if (inst.replied) {
      inst.replyLine = el("p", "daily-reply", TEXT.reply);
      inst.replyLine.setAttribute("tabindex", "-1");
      body.appendChild(inst.replyLine);
    }

    /* One line linking the practice to its lesson. */
    if (s.didDay === today()) {
      p = s.did ? findFinished(s.did) : null;
      note = el("p", "daily-lesson");
      a = document.createElement("a");
      if (p) {
        note.appendChild(document.createTextNode(TEXT.lessonBefore));
        a.setAttribute("href", TRAIL_PAGE + "#" + p.id);
        a.appendChild(document.createTextNode(p.title));
        note.appendChild(a);
        note.appendChild(document.createTextNode(TEXT.lessonAfter));
      } else {
        note.appendChild(document.createTextNode(TEXT.trailBefore));
        a.setAttribute("href", TRAIL_PAGE);
        a.appendChild(document.createTextNode(TEXT.trailLink));
        note.appendChild(a);
        note.appendChild(document.createTextNode(TEXT.lessonAfter));
      }
      body.appendChild(note);
    }

    /* A second practice is welcome. It is offered, never pushed. */
    extra = el("div", "daily-actions");
    more = button("btn-link", TEXT.more, function () {
      inst.view = "idle";
      inst.again = true;
      inst.ask = false;
      inst.replied = false;
      inst.paid = 0;
      draw(inst);
      focusOn(inst.focusBlock);
    });
    extra.appendChild(more);
    body.appendChild(extra);
  }

  function drawList(inst) {
    var body = inst.body, list = finished(), pick = todaysPick(), level = inst.level + 1;
    var title, ul, li, b, i, all;

    title = el("h" + (level > 6 ? 6 : level), "daily-list-title", TEXT.listTitle);
    title.setAttribute("tabindex", "-1");
    body.appendChild(title);
    inst.focusBlock = title;
    body.appendChild(el("p", "daily-list-note", TEXT.listNote));

    all = [defaultPractice()].concat(list);
    ul = el("ul", "daily-list");
    function choice(p) {
      var btn = el("button", "btn btn-plain daily-choice");
      btn.setAttribute("type", "button");
      btn.appendChild(el("span", "daily-choice-title", p.title));
      if (p.id === pick) {
        btn.appendChild(document.createTextNode(" "));       /* so the two are read as two phrases */
        btn.appendChild(el("span", "daily-choice-note", TEXT.todays));
      }
      btn.addEventListener("click", function () {
        var s = data();
        todaysPick();
        s.chosen = p.id;
        saveStore();
        inst.view = "idle";
        draw(inst);
        focusOn(inst.focusBlock);
      });
      return btn;
    }
    for (i = 0; i < all.length; i++) {
      li = document.createElement("li");
      b = choice(all[i]);
      li.appendChild(b);
      ul.appendChild(li);
    }
    body.appendChild(ul);

    body.appendChild(button("btn-link", TEXT.close, function () {
      inst.view = "idle";
      draw(inst);
      focusOn(inst.pickBtn || inst.startBtn);
    }));
  }

  function draw(inst) {
    stopTimer(inst);
    clear(inst.body);
    inst.focusBlock = null;
    inst.replyLine = null;
    if (inst.view === "running") {
      drawRunning(inst);
    } else if (inst.view === "list") {
      drawList(inst);
    } else if (inst.view === "done") {
      drawDone(inst);
    } else {
      inst.view = "idle";
      drawIdle(inst);
    }
    inst.sig = signature();
  }

  /* "I did it": honest self-report, early or late. Logs the day once and remembers which
     practice it was, so that the least recently practised one comes first another day. */
  function complete(inst) {
    var G = game(), s = data(), day = today(), p = currentPractice(), res = null;
    busy = true;
    if (G) { res = safely(function () { return G.award("daily:" + day); }); }
    busy = false;
    todaysPick();
    s.did = p.id;
    s.didDay = day;
    if (p.id) { s.last[p.id] = day; }
    saveStore();
    inst.paid = res && res.awarded && res.xp > 0 ? res.xp : 0;
    inst.view = "done";
    inst.again = false;
    inst.ask = true;
    inst.replied = false;
    draw(inst);
    focusOn(inst.focusBlock);
    refreshOthers(inst);
  }

  /* Puts the card in the right state for today. A new day starts fresh, with today's
     practice and no word about the day before. A day already logged shows "Done for today". */
  function settle(inst) {
    var done = doneToday(), day = today();
    if (inst.day !== day) {
      inst.day = day;
      inst.again = false;
      inst.ask = false;
      inst.replied = false;
      inst.paid = 0;
      if (inst.view !== "running") { inst.view = done ? "done" : "idle"; }
    }
    if (inst.view === "idle" && done && !inst.again) { inst.view = "done"; }
    if (inst.view === "done" && !done) {
      inst.view = "idle";
      inst.ask = false;
      inst.replied = false;
      inst.paid = 0;
    }
    if (inst.view === "list" && !finished().length) { inst.view = "idle"; }
    if (!done) { inst.again = false; }
  }

  /* Something changed elsewhere (a setting, a lesson, Start over). Draw again only if it matters. */
  function refresh(inst) {
    var inside;
    if (!inst.root.parentNode && !document.documentElement.contains(inst.root)) { return; }
    if (signature() === inst.sig) { return; }
    settle(inst);
    inside = !!document.activeElement && inst.body.contains(document.activeElement);
    draw(inst);
    if (inside) { focusOn(inst.focusBlock); }
  }

  function refreshOthers(except) {
    var i;
    for (i = 0; i < instances.length; i++) {
      if (instances[i] !== except) { safely(function () { refresh(instances[i]); }); }
    }
  }

  function wire() {
    var G = game();
    if (wired) { return; }
    wired = true;
    if (G && typeof G.on === "function") {
      G.on("change", function () {
        if (busy) { return; }
        refreshOthers(null);
      });
    }
    /* A page left open overnight shows today's practice when the learner comes back to it. */
    window.addEventListener("focus", function () {
      reloadStore();
      refreshOthers(null);
    });
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) {
        reloadStore();
        refreshOthers(null);
      }
    });
    /* Another tab wrote this file's history (or cleared all storage). */
    window.addEventListener("storage", function (e) {
      if (e && (e.key === KEY || e.key === null)) {
        if (e.newValue === null) {
          store = freshStore();                  /* erased there ("Start over"): forget it here too */
          storeRaw = null;
        } else {
          reloadStore();
        }
        refreshOthers(null);
      }
    });
  }

  /* ---------- the public object ---------- */

  function mount(element) {
    var inst, i, head, words, level, id;
    if (!element || element.nodeType !== 1) { return null; }
    for (i = 0; i < instances.length; i++) {
      if (instances[i].root === element) {
        settle(instances[i]);
        draw(instances[i]);
        return instances[i].root;
      }
    }
    addStyle();
    wire();

    level = parseInt(element.getAttribute("data-heading-level"), 10);
    if (!(level >= 2 && level <= 5)) { level = 2; }
    nextId += 1;
    id = "daily-title-" + nextId;

    clear(element);
    addClass(element, "daily");
    addClass(element, "panel");
    element.setAttribute("role", "region");
    element.setAttribute("aria-labelledby", id);

    head = el("div", "daily-head");
    head.appendChild(picture(ICON, 44, "daily-icon"));
    words = el("div", "daily-head-text");
    words.appendChild(el("h" + level, "daily-title", TEXT.title));
    words.firstChild.id = id;
    words.appendChild(el("p", "daily-sub", TEXT.sub));
    head.appendChild(words);
    element.appendChild(head);

    inst = {
      root: element, body: el("div", "daily-body"), level: level, day: today(),
      view: doneToday() ? "done" : "idle",
      again: false, ask: false, replied: false, paid: 0,
      startedAt: 0, timer: null, sig: "",
      focusBlock: null, replyLine: null, startBtn: null, pickBtn: null
    };
    element.appendChild(inst.body);
    instances.push(inst);
    draw(inst);
    return element;
  }

  /* Used by "Start over" on My Journey: forgets this file's own small history too. */
  function reset() {
    var i;
    store = freshStore();
    storeRaw = null;
    try {
      if (window.localStorage) { window.localStorage.removeItem(KEY); }
    } catch (e) { /* tried */ }
    for (i = 0; i < instances.length; i++) {
      instances[i].view = doneToday() ? "done" : "idle";
      instances[i].again = false;
      instances[i].ask = false;
      instances[i].replied = false;
      instances[i].paid = 0;
      draw(instances[i]);
    }
  }

  window.Daily = {
    mount: function (element) {
      var out = safely(function () { return mount(element); });
      return out || null;
    },
    reset: function () { safely(reset); }
  };
})();

/* Shared page chrome: the two-row navigation, the strip under the header (the HUD), toasts,
   award buttons, the settings classes on <html> and the run display.
   The contract is docs/GAME_CONTRACT.md, section 5. Runs on every page after js/game.js.
   It is safe everywhere: a feature whose element is missing is skipped quietly, and when
   window.Game is missing only the navigation is drawn.
   Nothing in this file logs an activity unless the learner clicks an award button. */
(function () {
  "use strict";

  /* ---------- the one list the navigation is built from ---------- */

  var NAV = [
    { label: "Start here", cls: "nav-row-start", links: [
      ["index.html", "Home"],
      ["trail.html", "The Trail"],
      ["profile.html", "My Journey"],
      ["glossary.html", "Glossary"]
    ] },
    { label: "Library", cls: "nav-row-library", fold: true, links: [
      ["curriculum.html", "Curriculum"],
      ["study.html", "Guided Study"],
      ["canon.html", "The Canon"],
      ["suttas.html", "Sutta Library"],
      ["vinaya.html", "Monks\u2019 Rules"],
      ["themes.html", "Modern Life"],
      ["journey.html", "Journey West"],
      ["everything.html", "Save as PDF"]
    ] }
  ];

  /* Pages that show the full strip: emblem, bar, run display and Continue. */
  var FULL_HUD = ["index.html", "trail.html", "profile.html", "glossary.html"];

  /* ---------- every word this file shows to the learner ---------- */

  var TEXT = {
    navLabel: "Site",
    hudLabel: "Your progress",
    yourTitle: "Your title",
    toNext: " to the next title",
    enough: "Enough.",
    cont: "Continue",
    theTrail: "The Trail",
    noSave: "Progress cannot be saved in this browser. Lessons still work.",
    runBefore: "Recent days (rest days are fine)",
    runAfter: "In Tune",
    hereToday: "Here today.",
    restingBefore: "Resting. That is fine.",
    tuneToday: "In tune today.",
    restingAfter: "Resting. Still in tune.",
    away: "Welcome back. Your days are all still here. A new run starts whenever you like.",
    read: "I have read this",
    readTopic: "I have read this topic",
    done: "Done",
    newBadge: "New badge: ",
    newBadges: " new badges.",
    newTitle: "New title: "
  };

  /* The first words of a toast, by kind of activity. */
  var DONE_WORDS = {
    lesson: "Lesson done.",
    boss: "Check complete.",
    sutta: "Marked as read.",
    suttaq: "Question answered.",
    rule: "Story marked as read.",
    jw: "Marked as read.",
    theme: "Topic marked as read.",
    gloss: "New word card.",
    daily: "One Quiet Minute done.",
    other: "Done."
  };

  var NAV_ROW_ID = "site-nav-row-";
  var RUN_LINK = "suttas.html#an6.55";
  var RUN_LESSON = "lesson:w5-l1";
  var TRAIL_PAGE = "trail.html";
  var LOTUS = "img/brand/lotus.svg";
  var AWAY_DAYS = 4;
  var MAX_BADGE_NAMES = 2;

  var hasOwn = Object.prototype.hasOwnProperty;
  var wired = false;
  var watching = false;
  var scanTimer = null;
  var toastTimer = null;
  var pending = { awards: [], badges: [], rank: null, hush: false };
  var headsUpSeen = {};
  var hudSig = null;
  var sayRegion = null;
  var sayTimer = null;

  /* ---------- small helpers ---------- */

  function own(obj, key) { return !!obj && hasOwn.call(obj, key); }

  function game() {
    var G = window.Game;
    return G && typeof G.award === "function" && typeof G.has === "function" ? G : null;
  }

  function config() {
    var c = window.GAME_CONFIG;
    return c && typeof c === "object" ? c : {};
  }

  function list(v) { return Object.prototype.toString.call(v) === "[object Array]" ? v : []; }

  function safely(fn) {
    try { return fn(); } catch (e) { return undefined; }   /* one feature must never stop a page */
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

  function hasClass(n, cls) {
    return (" " + (n.className || "") + " ").indexOf(" " + cls + " ") !== -1;
  }

  function addClass(n, cls) {
    if (!hasClass(n, cls)) { n.className = n.className ? n.className + " " + cls : cls; }
  }

  function removeClass(n, cls) {
    n.className = (" " + (n.className || "") + " ").split(" " + cls + " ").join(" ").replace(/^\s+|\s+$/g, "");
  }

  function hideImage(img) {
    img.setAttribute("hidden", "");
    img.style.display = "none";
  }

  /* A picture with a fixed size, so one that has not arrived never moves the layout.
     It is hidden if it cannot load. The words next to it carry the meaning. */
  function iconImg(src, size, cls) {
    var img = document.createElement("img");
    img.className = "icon-img" + (cls ? " " + cls : "");
    img.setAttribute("width", size);
    img.setAttribute("height", size);
    img.setAttribute("alt", "");
    img.onerror = function () { hideImage(img); };
    img.src = src;
    return img;
  }

  function kindOf(id) {
    var s = String(id), i = s.indexOf(":");
    return i === -1 ? s : s.slice(0, i);
  }

  function withCommas(n) {
    var s = String(n), out = "";
    while (s.length > 3) {
      out = "," + s.slice(-3) + out;
      s = s.slice(0, -3);
    }
    return s + out;
  }

  /* "1 point", "30 points", "1,000 points". */
  function pointsWord(n) {
    var v = typeof n === "number" && isFinite(n) ? Math.floor(n) : parseInt(n, 10);
    if (!isFinite(v) || v < 0) { v = 0; }
    return withCommas(v) + (v === 1 ? " point" : " points");
  }

  /* The file name of this page, in lower case. An optional data-page on <html> overrides it. */
  function currentPage() {
    var forced = document.documentElement.getAttribute("data-page");
    var p;
    if (forced) { return String(forced).toLowerCase(); }
    p = String(window.location.pathname || "");
    p = p.slice(p.lastIndexOf("/") + 1);
    try { p = decodeURIComponent(p); } catch (e) { /* keep it as it is */ }
    p = p.toLowerCase();
    return p === "" ? "index.html" : p;
  }

  function isQuiet() {
    var G = game();
    return !!G && safely(function () { return G.setting("quiet"); }) === true;
  }

  /* ---------- 1. navigation ---------- */

  /* The button that shows or hides a folded row. On wide screens the button is not drawn and
     the row is always shown (css/game.css), so the state only matters on narrow screens. */
  function setFold(btn, row, open) {
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) { removeClass(row, "is-folded"); } else { addClass(row, "is-folded"); }
  }

  function foldButton(row, text, open) {
    var btn = el("button", "nav-fold"), pill = el("span", "nav-pill", text), mark = el("span", "nav-fold-mark");
    btn.setAttribute("type", "button");
    btn.setAttribute("aria-controls", row.id);
    mark.setAttribute("aria-hidden", "true");      /* the state is in aria-expanded */
    pill.appendChild(mark);
    btn.appendChild(pill);
    setFold(btn, row, open);
    btn.addEventListener("click", function () {
      setFold(btn, row, btn.getAttribute("aria-expanded") !== "true");
    });
    return btn;
  }

  function buildNav() {
    var nav = document.querySelector("nav.site-nav");
    var page, i, j, group, row, label, link, a, here;
    if (!nav || nav.getAttribute("data-site-nav") === "1") { return; }
    page = currentPage();
    clear(nav);
    addClass(nav, "nav-rows");
    nav.setAttribute("aria-label", TEXT.navLabel);
    for (i = 0; i < NAV.length; i++) {
      group = NAV[i];
      row = el("div", "nav-row " + group.cls);
      row.setAttribute("role", "group");
      row.setAttribute("aria-labelledby", "site-nav-label-" + i);
      label = el("span", "nav-label", group.label);
      label.id = "site-nav-label-" + i;
      row.appendChild(label);
      here = false;
      for (j = 0; j < group.links.length; j++) {
        link = group.links[j];
        a = document.createElement("a");
        a.setAttribute("href", link[0]);
        a.appendChild(el("span", "nav-pill", link[1]));
        if (link[0] === page) {
          a.className = "active";
          a.setAttribute("aria-current", "page");
          here = true;
        }
        row.appendChild(document.createTextNode(" "));     /* lets the row wrap between pills */
        row.appendChild(a);
      }
      if (group.fold) {
        /* Folded away to begin with, unless this page is one of the row's own. */
        row.id = NAV_ROW_ID + i;
        nav.appendChild(foldButton(row, group.label, here));
      }
      nav.appendChild(row);
    }
    nav.setAttribute("data-site-nav", "1");
  }

  /* ---------- 5. settings classes on <html> ---------- */

  function applySettings() {
    var G = game(), root = document.documentElement;
    if (!G || typeof G.setting !== "function") { return; }
    if (G.setting("quiet") === true) { addClass(root, "quiet"); } else { removeClass(root, "quiet"); }
    if (G.setting("large") === true) { addClass(root, "large-text"); } else { removeClass(root, "large-text"); }
  }

  /* ---------- 6. the run display ---------- */

  /* What to draw, worked out now from the days since the last logged day.
     null means draw nothing: Quiet Mode, or no day logged yet (a run is never shown as zero). */
  function runInfo() {
    var G = game(), s, n, cap;
    if (!G || typeof G.streak !== "function" || isQuiet()) { return null; }
    s = G.streak();
    if (!s || typeof s.daysSince !== "number") { return null; }
    if (s.daysSince >= AWAY_DAYS) { return { away: true }; }
    cap = config().caps && config().caps.runShown > 0 ? Math.floor(config().caps.runShown) : 7;
    n = typeof s.current === "number" && s.current >= 1 ? Math.floor(s.current) : 1;
    return {
      away: false,
      cap: cap,
      lit: n > cap ? cap : n,
      more: n >= cap,
      today: s.daysSince <= 0,
      tuned: G.has(RUN_LESSON)
    };
  }

  function fillRun(element) {
    var info = runInfo(), label, link, line, strings, i, words;
    clear(element);
    addClass(element, "run");
    removeClass(element, "run-away");
    if (!info) { return; }
    if (info.away) {
      addClass(element, "run-away");
      element.appendChild(el("span", "run-words", TEXT.away));
      return;
    }
    label = el("span", "run-label");
    if (info.tuned) {
      link = el("a", "run-link", TEXT.runAfter);
      link.setAttribute("href", RUN_LINK);
      label.appendChild(link);
    } else {
      label.appendChild(document.createTextNode(TEXT.runBefore));
    }
    element.appendChild(label);

    line = el("span", "run-line");
    strings = el("span", "run-strings");
    strings.setAttribute("aria-hidden", "true");
    for (i = 0; i < info.cap; i++) {
      strings.appendChild(el("span", i < info.lit ? "run-string is-lit" : "run-string"));
    }
    line.appendChild(strings);
    words = info.more ? info.cap + " days or more" : info.lit + (info.lit === 1 ? " day" : " days");
    words += ". ";
    if (info.tuned) {
      words += info.today ? TEXT.tuneToday : TEXT.restingAfter;
    } else {
      words += info.today ? TEXT.hereToday : TEXT.restingBefore;
    }
    line.appendChild(el("span", "run-words", words));
    element.appendChild(line);
  }

  function renderRun(element) {
    if (!element || element.nodeType !== 1) { return; }
    element.setAttribute("data-site-run", "1");      /* so it is kept up to date */
    safely(function () { fillRun(element); });
  }

  function repaintRuns() {
    var nodes = document.querySelectorAll("[data-site-run]"), i;
    for (i = 0; i < nodes.length; i++) { fillRun(nodes[i]); }
  }

  /* ---------- 2. the strip under the header (HUD) ---------- */

  function stepTitle(step) {
    var worlds = list(config().worlds), i, j, lessons;
    for (i = 0; i < worlds.length; i++) {
      if (!worlds[i] || worlds[i].id !== step.world) { continue; }
      if (step.type === "boss") { return worlds[i].bossTitle || ""; }
      lessons = list(worlds[i].lessons);
      for (j = 0; j < lessons.length; j++) {
        if (lessons[j] && lessons[j].id === step.id) { return lessons[j].title || ""; }
      }
    }
    return "";
  }

  /* The words and the target of the Continue link: the next lesson, the next check,
     or the Trail itself when every step is done. */
  function continueInfo() {
    var G = game(), step = null, title, hash;
    if (G && typeof G.nextStep === "function") { step = G.nextStep(); }
    if (!step) { return { text: TEXT.theTrail, href: TRAIL_PAGE }; }
    title = stepTitle(step);
    if (step.type === "boss" && step.world) {
      hash = "#check-" + step.world;
    } else if (step.type === "lesson" && step.id) {
      hash = "#" + step.id;
    } else {
      hash = "#next";
    }
    return { text: title ? TEXT.cont + ": " + title : TEXT.cont, href: TRAIL_PAGE + hash };
  }

  function continueLink(info) {
    var a = el("a", "hud-continue", info.text);
    a.setAttribute("href", info.href);
    return a;
  }

  function renderHud(force) {
    var G = game(), hud = document.getElementById("hud");
    var header, variant, rank, cont, canSave, trailDone, last, sig, inner, block, text, bar, fill, run, hadFocus, link;
    if (!G) { return; }
    /* A visitor with nothing logged sees no strip at all. It appears with the first activity. */
    if (typeof G.count === "function" && G.count("") === 0) {
      if (hud) {
        clear(hud);
        hud.setAttribute("hidden", "");
        hudSig = null;
      }
      return;
    }
    if (!hud) {
      header = document.querySelector("header.site-header");
      if (!header || !header.parentNode) { return; }
      hud = el("div", "hud no-print");
      hud.id = "hud";
      header.parentNode.insertBefore(hud, header.nextSibling);
      hudSig = null;
    }
    if (hud.hasAttribute("hidden")) {
      hud.removeAttribute("hidden");
      hudSig = null;
    }

    variant = isQuiet() ? "quiet" : (FULL_HUD.indexOf(currentPage()) !== -1 ? "full" : "compact");
    rank = G.rank() || {};
    cont = continueInfo();
    canSave = typeof G.canSave !== "function" || G.canSave() !== false;
    trailDone = typeof G.trailDone === "function" && G.trailDone() === true;
    last = !rank.next;

    sig = JSON.stringify([variant, rank.id, G.xp(), rank.toNext, rank.pct, last, trailDone,
      cont.text, cont.href, canSave, variant === "full" ? runInfo() : null]);
    if (!force && sig === hudSig && hud.firstChild) { return; }
    hudSig = sig;

    hadFocus = !!document.activeElement && hud.contains(document.activeElement) &&
      hasClass(document.activeElement, "hud-continue");

    clear(hud);
    addClass(hud, "hud");
    addClass(hud, "no-print");
    hud.setAttribute("role", "region");
    hud.setAttribute("aria-label", TEXT.hudLabel);
    inner = el("div", "hud-inner hud-" + variant);

    if (variant === "full" && rank.name) {
      block = el("div", "hud-title game-only");
      if (rank.icon) { block.appendChild(iconImg(rank.icon, 48, "hud-emblem")); }
      text = el("div", "hud-title-text");
      text.appendChild(el("span", "sr-only", TEXT.yourTitle + ": "));
      text.appendChild(el("strong", "hud-rank", rank.name));
      /* At the last title the number is hidden. */
      if (!last) { text.appendChild(el("span", "hud-total points", pointsWord(G.xp()))); }
      block.appendChild(text);
      inner.appendChild(block);

      if (last) {
        /* The bar gives way to one word. */
        block = el("div", "hud-progress game-only");
        block.appendChild(el("p", "hud-enough", TEXT.enough));
        inner.appendChild(block);
      } else if (!trailDone) {
        /* Once the Trail is finished there is no bar and no "points to go" line. */
        block = el("div", "hud-progress game-only");
        bar = el("div", "hud-bar");
        bar.setAttribute("aria-hidden", "true");
        fill = el("span", "hud-bar-fill");
        fill.style.width = (rank.pct > 0 ? (rank.pct > 100 ? 100 : rank.pct) : 0) + "%";
        bar.appendChild(fill);
        block.appendChild(bar);
        block.appendChild(el("p", "hud-words", pointsWord(rank.toNext) + TEXT.toNext));
        inner.appendChild(block);
      }

      run = el("div", "hud-run game-only");
      fillRun(run);
      inner.appendChild(run);
    } else if (variant === "compact" && rank.name) {
      block = el("p", "hud-title game-only");
      block.appendChild(el("span", "hud-kicker", TEXT.yourTitle + ": "));
      block.appendChild(el("strong", "hud-rank", rank.name));
      inner.appendChild(block);
    }

    link = continueLink(cont);
    inner.appendChild(link);
    hud.appendChild(inner);

    if (!canSave) { hud.appendChild(el("p", "hud-note", TEXT.noSave)); }
    if (hadFocus) { safely(function () { link.focus(); }); }
  }

  /* ---------- 3. toasts ---------- */

  function toastRegion() {
    var region = document.querySelector(".toast-region");
    if (region) { return region; }
    if (!document.body) { return null; }
    region = el("div", "toast-region no-print");
    region.setAttribute("aria-live", "polite");
    region.setAttribute("aria-atomic", "false");
    document.body.appendChild(region);
    return region;
  }

  /* One calm line. It is also read out, politely, by screen readers.
     Returns true when the toast was shown. Quiet Mode shows no toasts. */
  function toast(text, iconUrl) {
    var region, t, life;
    text = text === undefined || text === null ? "" : String(text);
    if (!text || isQuiet()) { return false; }
    region = toastRegion();
    if (!region) { return false; }
    while (region.children.length >= 3) { region.removeChild(region.firstChild); }
    t = el("div", "toast");
    if (iconUrl) { t.appendChild(iconImg(String(iconUrl), 28, "toast-icon")); }
    t.appendChild(el("span", "toast-text", text));
    region.appendChild(t);
    life = 5000 + text.length * 70;       /* long enough to read slowly */
    if (life > 12000) { life = 12000; }
    window.setTimeout(function () {
      addClass(t, "is-leaving");
      window.setTimeout(function () {
        if (t.parentNode) { t.parentNode.removeChild(t); }
      }, 600);
    }, life);
    return true;
  }

  /* Heads-up lessons carry no badge or title news on their own reward. */
  function headsUpSnapshot() {
    var G = game(), ids = list(config().headsUp), out = {}, i;
    if (!G) { return out; }
    for (i = 0; i < ids.length; i++) { out[ids[i]] = G.has("lesson:" + ids[i]); }
    return out;
  }

  function headsUpJustDone() {
    var now = headsUpSnapshot(), hit = false, k;
    for (k in now) {
      if (own(now, k) && now[k] === true && headsUpSeen[k] !== true) { hit = true; }
    }
    headsUpSeen = now;
    return hit;
  }

  /* True while a heads-up lesson is the open page of the Trail. Asked when the news arrives,
     because the address may have moved on by the time the toast is drawn. */
  function onHeadsUpLesson() {
    var id;
    if (currentPage() !== TRAIL_PAGE) { return false; }
    id = String(window.location.hash || "").replace(/^#/, "");
    try { id = decodeURIComponent(id); } catch (e) { /* keep it as it is */ }
    id = id.split("/")[0];
    return id !== "" && list(config().headsUp).indexOf(id) !== -1;
  }

  /* A name closes its own sentence: "Why That Rule?" gets no full stop after it. */
  function sentence(text) {
    var s = String(text).replace(/\s+$/, "");
    return /[.?!…]["'’”)\]]*$/.test(s) ? s : s + ".";
  }

  /* Everything one award caused becomes one line: "Lesson done. 30 points. New badge: First Step." */
  function flushToasts() {
    var p = pending, total = 0, kind = null, mixed = false, parts = [], icon = "", i, k;
    pending = { awards: [], badges: [], rank: null, hush: false };
    toastTimer = null;
    if (isQuiet()) { return; }
    for (i = 0; i < p.awards.length; i++) {
      total += p.awards[i].xp;
      k = kindOf(p.awards[i].id);
      if (kind === null) { kind = k; } else if (kind !== k) { mixed = true; }
    }
    if (total > 0) {
      parts.push((mixed || !own(DONE_WORDS, kind) ? DONE_WORDS.other : DONE_WORDS[kind]) + " " + pointsWord(total) + ".");
      icon = LOTUS;
    }
    if (!p.hush) {
      if (p.badges.length > MAX_BADGE_NAMES) {
        /* Many at once (a restored backup, say): one short count, not a long list. */
        parts.push(p.badges.length + TEXT.newBadges);
      } else {
        for (i = 0; i < p.badges.length; i++) {
          parts.push(sentence(TEXT.newBadge + p.badges[i].name));
          if (p.badges[i].icon) { icon = p.badges[i].icon; }
        }
      }
      if (p.rank) {
        parts.push(sentence(TEXT.newTitle + p.rank.name));
        if (p.rank.icon) { icon = p.rank.icon; }
      }
    }
    if (parts.length) { toast(parts.join(" "), icon); }
  }

  function scheduleToast() {
    if (toastTimer === null) { toastTimer = window.setTimeout(flushToasts, 0); }
  }

  /* ---------- 4. award buttons ---------- */

  /* Points this id would pay right now: the kind's points, then the rule cap, the daily
     cap and the overall cap. The engine applies the same rule when it logs the activity. */
  function pointsNow(id) {
    var G = game(), xp = config().xp, caps = config().caps || {}, kind = kindOf(id), pay, room;
    if (!G) { return 0; }
    pay = own(xp, kind) && typeof xp[kind] === "number" && xp[kind] > 0 ? Math.floor(xp[kind]) : 0;
    if (kind === "rule" && typeof caps.rules === "number" && G.count("rule:") >= caps.rules) { pay = 0; }
    if (kind === "daily" && typeof caps.daily === "number" && G.count("daily:") >= caps.daily) { pay = 0; }
    if (typeof caps.xp === "number") {
      room = caps.xp - G.xp();
      if (room < 0) { room = 0; }
      if (pay > room) { pay = room; }
    }
    return pay;
  }

  function paintAward(btn) {
    var G = game(), id = btn.getAttribute("data-award-id"), label, done, pts, state, tick;
    if (!G || !id) { return; }
    done = G.has(id);
    pts = done ? 0 : pointsNow(id);
    state = done ? "done" : "open-" + pts;
    if (btn.getAttribute("data-award-state") === state) { return; }
    btn.setAttribute("data-award-state", state);
    clear(btn);
    if (done) {
      tick = el("span", "award-tick", "\u2713");
      tick.setAttribute("aria-hidden", "true");
      btn.appendChild(tick);
      btn.appendChild(document.createTextNode(" "));
      btn.appendChild(el("span", "award-label", TEXT.done));
      if (document.activeElement === btn) {
        /* The button just pressed keeps the focus, so it is only marked as disabled.
           It is disabled for real when the focus moves on. */
        btn.setAttribute("aria-disabled", "true");
        if (btn.getAttribute("data-award-settle") !== "1") {
          btn.setAttribute("data-award-settle", "1");
          btn.addEventListener("blur", function () { settleAward(btn); });
        }
      } else {
        btn.removeAttribute("aria-disabled");
        btn.disabled = true;
      }
      return;
    }
    label = btn.getAttribute("data-award-label") || TEXT.read;
    btn.appendChild(el("span", "award-label", label));
    /* A 0-point case shows no points text. */
    if (pts > 0) {
      btn.appendChild(document.createTextNode(" "));
      btn.appendChild(el("span", "points", "\u00b7 " + pointsWord(pts)));
    }
    btn.disabled = false;
    btn.removeAttribute("aria-disabled");
  }

  function settleAward(btn) {
    var G = game(), id = btn.getAttribute("data-award-id");
    if (btn.getAttribute("aria-disabled") !== "true") { return; }
    btn.removeAttribute("aria-disabled");
    if (G && id && G.has(id)) { btn.disabled = true; }
  }

  /* A line that is only read out, for when no toast will be: Quiet Mode, or a 0-point marker.
     It never mentions points and nothing is drawn. */
  function sayRegionNode() {
    if (sayRegion && sayRegion.parentNode) { return sayRegion; }
    if (!document.body) { return null; }
    sayRegion = el("div", "sr-only site-say");
    sayRegion.setAttribute("role", "status");
    sayRegion.setAttribute("aria-live", "polite");
    document.body.appendChild(sayRegion);
    return sayRegion;
  }

  function say(text) {
    var region = sayRegionNode();
    if (!region) { return; }
    if (sayTimer !== null) { window.clearTimeout(sayTimer); }
    clear(region);
    /* Written a moment later, so the same word twice in a row is still read out. */
    sayTimer = window.setTimeout(function () {
      clear(region);
      region.appendChild(document.createTextNode(text));
      sayTimer = window.setTimeout(function () {
        sayTimer = null;
        clear(region);
      }, 4000);
    }, 100);
  }

  /* Turns a button into an award button. The only place an activity is logged is its click. */
  function wireAward(btn, id, label) {
    btn.setAttribute("type", "button");
    addClass(btn, "award-btn");
    addClass(btn, "no-print");
    btn.setAttribute("data-award-id", id);
    btn.setAttribute("data-award-label", label || TEXT.read);
    btn.removeAttribute("data-award-state");
    if (btn.getAttribute("data-award-wired") !== "1") {
      btn.setAttribute("data-award-wired", "1");
      btn.addEventListener("click", function () {
        var G = game(), now = btn.getAttribute("data-award-id"), res;
        if (!G || !now || btn.disabled || btn.getAttribute("aria-disabled") === "true") { return; }
        res = G.award(now);
        paintAward(btn);
        /* No toast will be read out: say the one word instead, with no points wording. */
        if (isQuiet() || !res || !(res.xp > 0)) { safely(function () { say(TEXT.done); }); }
      });
    }
    paintAward(btn);
  }

  function findAward(container, id) {
    var kids = container.children, i;
    for (i = 0; i < kids.length; i++) {
      if (kids[i].tagName === "BUTTON" && kids[i].getAttribute("data-award-id") === id) { return kids[i]; }
    }
    return null;
  }

  function awardButton(container, id, label) {
    var btn;
    if (!game() || !container || container.nodeType !== 1 || typeof id !== "string" || !id) { return null; }
    btn = findAward(container, id);
    if (btn) { return btn; }
    btn = document.createElement("button");
    wireAward(btn, id, label === undefined || label === null || label === "" ? TEXT.read : String(label));
    container.appendChild(btn);
    return btn;
  }

  /* Any element with data-award="<id>" (and an optional data-label) gets a button inside it.
     A <button data-award="..."> becomes the award button itself. */
  function scanAwards() {
    var nodes, i, n, id, label;
    if (!game()) { return; }
    nodes = document.querySelectorAll("[data-award]");
    for (i = 0; i < nodes.length; i++) {
      n = nodes[i];
      id = n.getAttribute("data-award");
      label = n.getAttribute("data-label") || TEXT.read;
      if (!id) { continue; }
      if (n.tagName === "BUTTON") {
        if (n.getAttribute("data-award-id") !== id) { wireAward(n, id, label); }
      } else if (!findAward(n, id)) {
        awardButton(n, id, label);
      }
    }
  }

  /* Modern Life: one button per topic. Journey West: one per numbered episode, by its number. */
  function pageAwards() {
    var page = currentPage(), nodes, i, heading, m, n;
    if (!game()) { return; }
    if (page === "themes.html") {
      nodes = document.querySelectorAll("section.canon-book[id]");
      for (i = 0; i < nodes.length; i++) {
        if (nodes[i].id) { awardButton(nodes[i], "theme:" + nodes[i].id, TEXT.readTopic); }
      }
    } else if (page === "journey.html") {
      nodes = document.querySelectorAll(".canon-book");
      for (i = 0; i < nodes.length; i++) {
        heading = nodes[i].querySelector("h2, h3, h4");
        m = heading ? /^\s*(\d{1,2})\s*\./.exec(heading.textContent || "") : null;
        n = m ? parseInt(m[1], 10) : 0;
        if (n >= 1 && n <= 14) { awardButton(nodes[i], "jw:" + n, TEXT.read); }
      }
    }
  }

  function repaintAwards() {
    var nodes = document.querySelectorAll("button[data-award-id]"), i;
    for (i = 0; i < nodes.length; i++) { paintAward(nodes[i]); }
  }

  /* Pages draw their content after this file runs, and may draw it again (a search, a filter).
     Watching the page means a new data-award element is wired without the page asking. */
  function watch() {
    if (watching || !game() || typeof MutationObserver === "undefined" || !document.body) { return; }
    watching = true;
    new MutationObserver(function () {
      if (scanTimer !== null) { return; }
      scanTimer = window.setTimeout(function () {
        scanTimer = null;
        safely(scanAwards);
      }, 0);
    }).observe(document.body, { childList: true, subtree: true });
  }

  /* ---------- keeping everything up to date ---------- */

  function refresh(force) {
    safely(applySettings);
    safely(function () { renderHud(force === true); });
    safely(repaintRuns);
    safely(scanAwards);
    safely(repaintAwards);
  }

  function wireGame() {
    var G = game();
    if (wired || !G || typeof G.on !== "function") { return; }
    wired = true;
    headsUpSeen = headsUpSnapshot();

    /* Never a toast for a 0-point marker. */
    G.on("award", function (a) {
      if (a && typeof a.xp === "number" && a.xp > 0) {
        pending.awards.push(a);
        scheduleToast();
      }
    });
    G.on("badge", function (b) {
      if (b && b.name) {
        pending.badges.push(b);
        /* No badge or title news while a heads-up lesson is open, whatever earned it. */
        if (onHeadsUpLesson()) { pending.hush = true; }
        scheduleToast();
      }
    });
    G.on("rank", function (r) {
      if (r && r.name) {
        pending.rank = r;
        if (onHeadsUpLesson()) { pending.hush = true; }
        scheduleToast();
      }
    });
    G.on("change", function () {
      var hit = headsUpJustDone();
      if (hit && toastTimer !== null) { pending.hush = true; }
      refresh(false);
    });

    /* Another tab saved, or this page came back from the browser's page store. */
    window.addEventListener("storage", function () {
      if (typeof G._sync === "function") { safely(function () { G._sync(); }); }
    });
    window.addEventListener("pageshow", function (e) {
      if (e && e.persisted) {
        if (typeof G._sync === "function") { safely(function () { G._sync(); }); }
        refresh(true);
      }
    });
  }

  function setup() {
    safely(buildNav);
    safely(wireGame);
    safely(applySettings);
    safely(function () { renderHud(false); });
    safely(function () { if (game()) { toastRegion(); sayRegionNode(); } });
    safely(pageAwards);
    safely(scanAwards);
    safely(watch);
    safely(checkIcons);
  }

  /* Any icon picture on the page that cannot load is hidden, so it leaves no gap or mark. */
  safely(function () {
    document.addEventListener("error", function (e) {
      var t = e && e.target;
      if (t && t.tagName === "IMG" && hasClass(t, "icon-img")) { hideImage(t); }
    }, true);
  });

  /* A picture may have given up before this file ran. One that is finished but has no size
     is asked for once more, off the page, and hidden if that fails too. */
  function checkIcons() {
    var imgs = document.querySelectorAll("img.icon-img"), i;
    function probe(img) {
      var p = new Image();
      p.onerror = function () { hideImage(img); };
      p.src = img.currentSrc || img.src;
    }
    for (i = 0; i < imgs.length; i++) {
      if (imgs[i].complete && imgs[i].naturalWidth === 0 && imgs[i].getAttribute("src") &&
          !imgs[i].hasAttribute("hidden") && imgs[i].getAttribute("data-site-icon") !== "1") {
        imgs[i].setAttribute("data-site-icon", "1");
        probe(imgs[i]);
      }
    }
  }

  /* ---------- 7. the public object ---------- */

  window.Site = {
    toast: function (text, iconUrl) { return safely(function () { return toast(text, iconUrl); }) === true; },
    refresh: function () { setup(); refresh(true); },
    awardButton: function (container, id, label) {
      var btn = safely(function () { return awardButton(container, id, label); });
      return btn || null;
    },
    renderRun: function (element) { renderRun(element); },
    pointsWord: pointsWord
  };

  setup();
  /* The page's own script runs after this file. Look once more when the page is ready. */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setup);
  }
})();

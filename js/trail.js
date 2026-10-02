/* The Trail page: the map, the lesson player and the world checks.
   Contract: docs/GAME_CONTRACT.md, section 7. Design: docs/game-spec.json (homepageFlow 4 to 10 and 13).

   One view is drawn at a time inside #trail-view, chosen by the hash:
     (none) or #map        the map
     #<lessonId>           that lesson, at the card the learner left it on
     #<lessonId>/<n>       that lesson at card n (1-based)
     #check-<worldId>      that world's check
     #next                 whatever Game.nextStep() returns
     #complete             the "Trail complete" screen (only once every check is done)

   Lesson data is plain text. It is only ever put on the page as text nodes, never as HTML. */
(function () {
  "use strict";

  var view = document.getElementById("trail-view");
  var dailyBox = document.getElementById("trail-daily");
  var settingsBox = null;
  var G = window.Game;
  var CFG = window.GAME_CONFIG && typeof window.GAME_CONFIG === "object" ? window.GAME_CONFIG : {};
  if (!view) { return; }

  var SVG_NS = "http://www.w3.org/2000/svg";
  var HELD_KEY = "buddhismstudy-trail-held";
  var CHECK_ICON = "img/brand/check.svg";
  var LOTUS = "img/brand/lotus.svg";
  var RING_R = 44;
  var PLENTY = 3;                           /* lessons in one day before the gentle note */
  var FOLD_WORLDS = { w0: true, w1: true }; /* go-deeper links are folded here */
  var BANNER_LESSON = "w3-l6";

  /* Words from the old language. They carry lang="pi" so screen readers do not mangle them. */
  var OLD_WORDS = { buddha: 1, sutta: 1, dukkha: 1, karma: 1, nirvana: 1, metta: 1, sangha: 1, dhamma: 1 };

  /* ---------- every word this file shows to the learner ---------- */

  var TEXT = {
    mapTitle: "The Trail map",
    mapLede1: " short lessons in ",
    mapLede2: " worlds. One step at a time. You can read the whole route before you walk it.",
    legendTitle: "The four questions",
    legendLede: "A doctor asks 4 questions. The Trail takes them one at a time.",
    here: "You are here",
    showPlace: "Show my place on the map",
    done: "Done",
    open: "Open",
    comesAfter: "Comes after ",
    aside: "Set aside. Here when you want it.",
    start: "Start",
    carryOn: "Carry on",
    world: "World ",
    lessonWord: "Lesson ",
    lessonsDone: " lessons done",
    checkComplete: "Check complete",
    checkSub: " short questions. No score.",
    checkSubOne: "Short questions. No score.",
    showLessons: "Show the lessons",
    hideLessons: "Hide the lessons",
    unwritten: "This world is still being written.",
    laterNote: "That one comes after ",
    laterNoteEnd: " One step at a time.",
    banner: "Question 3: Can it stop? Yes.",
    wheelTitle: "The training plan as a wheel",
    wheelCaption: "A spoke lights up when you finish its lesson. This is a picture, not a list to learn.",
    wheelNone: "No spokes are lit yet.",
    wheelLit: " of 8 spokes are lit.",
    wheelLitOne: " of 8 spokes is lit.",
    wheelAlt: "A wheel with 8 spokes: ",
    settings: "Settings",
    setLarge: "Larger text",
    setQuiet: "Quiet Mode",
    setOpen: "Open all lessons",
    on: "on",
    off: "off",
    settingsHelp: "Quiet Mode hides points, titles and badges. Open all lessons is for people who already know the basics.",
    saved: "To save your progress to a file, or to start over, go to ",
    savedLink: "My Journey",
    doneTitle: "Trail complete",
    doneShort: "You have finished every world and every check.",
    doneKicker: "All 8 worlds",
    doneLink: "See what comes next",

    leave: "Leave lesson",
    leaveCheck: "Leave the check",
    toMap: "Back to the Trail map",
    card: "Card ",
    of: " of ",
    back: "Back",
    next: "Next",
    aboutMinutes: "about ",
    minutes: " minutes",
    noSave: "Progress cannot be saved in this browser. Lessons still work.",
    bigIdea: "The big idea",
    tryIt: "Try it now",
    newWord: "A new word",
    sayIt: "Say it: ",
    oldWord: "The old word is ",
    means: "What it means",
    readAloud: "Read aloud",
    stopReading: "Stop reading",
    ringStart: "Start the ring",
    ringStop: "Stop the ring",
    ringAgain: "Start the ring again",
    ringGuide: ". The ring is only a guide. Go on whenever you like.",
    ringFull: "The ring is full. Go on whenever you like.",
    ringHalf: "Take about half a minute",
    ringMost: "Take a little less than one minute",
    ringOne: "Take about one minute",
    ringAltHalf: "about half a minute",
    ringAltMost: "a little less than one minute",
    ringAltOne: "about one minute",

    quick: "Quick question ",
    lookBack: "A look back",
    fromLesson: "From the lesson ",
    pickOne: "Pick one answer.",
    right: "Right.",
    rightTag: "Right",
    triedTag: "Tried",
    notQuite: "Not quite. Here is the idea again:",
    pickAgain: "Now pick again.",
    seeLesson: "See the lesson again: ",

    headsUpTitle: "Before you start",
    startLesson: "Start the lesson",
    setAside: "Set aside for now",
    asideHelp: "If you set it aside, the Trail carries on. The lesson stays here for whenever you want it.",

    lessonDone: "Lesson done",
    firstReward: "Points only count the steps you have done. You cannot lose them.",
    newBadge: "New badge: ",
    newTitle: "New title: ",
    plenty: "That is plenty for one day. Rest helps it sink in. Stop here or carry on, both are fine.",
    nextLesson: "Next lesson",
    nextCheck: "Next: the check",
    enough: "That is enough for today",
    enoughSmall: "Back to the Trail map",
    goDeeper: "Go deeper (optional reading)",

    deeperTitle: "Go deeper",
    deeperHard: "These pages are harder reading. They are for later. You lose nothing by skipping them.",
    deeperToggle: "Optional, harder reading",
    shelfMark: " is a shelf mark, like a library book number. You never need to remember it.",
    shelfDefault: "MN 26",
    inLibrary: "In the library: ",

    startCheck: "Start the check",
    question: "Question ",
    oneMore: "One more look",
    finished: "You have finished ",
    nextComes: "Next comes",
    startWorld: "Start World ",
    goodNews: "Good news ahead: the hurt has a cause, and World 3 asks whether it can stop. Short answer: yes.",
    tenTitles: "There are 10 titles. All ten are listed on My Journey. The last one, Lamp Keeper, is for people who read on in the library.",
    checkLater: "This check comes after the lessons in this world.",

    stepTitle: "One step at a time",
    lessonLater: "This lesson comes after ",
    stepNext: "Go to my next step",
    seeMap: "See the map",
    stepOpenAll: "If you already know the basics, the map has a switch called Open all lessons.",
    unwrittenTitle: "Not ready yet",

    completeLede: "You have walked through all 8 worlds. The skills go with you. Keep using them.",
    chooseTitle: "Choose your own next step",
    chooseLede: "There is no next lesson now. Here are 3 ideas. Pick any, or none.",
    lampKeeper: "There is one more title, Lamp Keeper, for people who read on in the library. No hurry.",
    leftTitle: "What this Trail left out",
    leftLede: "The Trail kept things short. It left out 4 big things. The library has them when you want them.",
    studyLabel: "Guided Study",
    studyUnit: "Guided Study, Unit ",
    studySmall: "The library as a course, one reading at a time",
    libraryLabel: "The Sutta Library",
    librarySmall: "67 cards of old talks, each with a plain first line",
    topicsLabel: "Modern Life topics",
    topicsSmall: "The teaching aimed at work, money, family and more",
    noGame: "The Trail could not start in this browser. Every other page still works. A good place to read on is ",
    noGameLink: "Guided Study"
  };

  /* The question each world answers, for the preview after a check. */
  var QUESTION = {
    w1: "What hurts?", w2: "Why does it hurt?", w3: "Can it stop?",
    w4: "The treatment, part 1", w5: "The treatment, part 2", w6: "The treatment, part 3",
    w7: "In your own words"
  };

  var LEGEND = [
    { n: "", label: "Start here", worlds: ["w0"], where: "World 0" },
    { n: "1", label: "What hurts?", worlds: ["w1"], where: "World 1" },
    { n: "2", label: "Why?", worlds: ["w2"], where: "World 2" },
    { n: "3", label: "Can it stop?", worlds: ["w3"], where: "World 3" },
    { n: "4", label: "What is the treatment?", worlds: ["w4", "w5", "w6"], where: "Worlds 4, 5 and 6 (parts 1, 2 and 3)" },
    { n: "", label: "In your own words", worlds: ["w7"], where: "World 7" }
  ];

  /* The training wheel shown once, in World 4. Each spoke lights up when its lesson is done. */
  var WHEEL_WORLD = "w4";
  var SPOKES = [
    { words: ["seeing", "clearly"], lesson: "w4-l1" },
    { words: ["kind", "aims"], lesson: "w4-l2" },
    { words: ["kind", "words"], lesson: "w4-l5" },
    { words: ["kind", "actions"], lesson: "w4-l3" },
    { words: ["honest", "work"], lesson: "w4-l6" },
    { words: ["balanced", "effort"], lesson: "w5-l1" },
    { words: ["noticing"], lesson: "w5-l4" },
    { words: ["a steady", "mind"], lesson: "w5-l5" }
  ];

  /* What the Trail left out, with a place in the library for each. */
  var LEFT_OUT = [
    { label: "Rebirth (life after life) and other worlds", href: "suttas.html#mn135" },
    { label: "The full life of the monks and nuns", href: "vinaya.html" },
    { label: "The eight steps, by name", href: "suttas.html#mn141" },
    { label: "The different schools of Buddhism", href: "canon.html" }
  ];

  /* Cards and topics about death and grief are never picked for the learner (the home page
     keeps the same lists). They stay one tap away in the library. */
  var GENTLE_CARDS = ["an5.57", "thig10.1", "mn87", "sn15.3", "dn16"];
  var GENTLE_TOPICS = ["health", "loss"];

  /* Small print for library pages that are not sutta cards. */
  var PAGE_NAMES = {
    "themes.html": "a Modern Life topic",
    "curriculum.html": "the Curriculum",
    "glossary.html": "the Glossary, a plain-English word list",
    "journey.html": "Journey to the West",
    "vinaya.html": "the monks’ rules, each with its story",
    "canon.html": "the Canon, the full bookshelf of old texts",
    "study.html": "Guided Study"
  };

  /* ---------- state ---------- */

  var WORLDS = [];        /* worlds in Trail order */
  var WORLD = {};         /* id -> world */
  var LESSON = {};        /* id -> lesson */
  var ORDER = [];         /* lessons in Trail order */
  var cur = null;         /* the view on screen */
  var run = null;         /* this run through a lesson */
  var chk = null;         /* this run through a check */
  var openWorlds = {};    /* finished worlds the learner has unfolded on the map */
  var openWord = null;    /* the taught-word panel that is open, if any */
  var speech = null;
  var speaking = null;
  var speakToken = 0;
  var ringTimer = null;
  var heldMemory = null;
  var uid = 0;
  var lastQuiet = false;
  var dailyMounted = false;
  var routing = false;

  /* ---------- small helpers ---------- */

  function list(v) { return Object.prototype.toString.call(v) === "[object Array]" ? v : []; }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) { n.className = cls; }
    if (text !== undefined && text !== null && text !== "") { n.appendChild(document.createTextNode(String(text))); }
    return n;
  }

  function txt(s) { return document.createTextNode(String(s)); }

  function clear(n) {
    while (n.firstChild) { n.removeChild(n.firstChild); }
  }

  function nextId(prefix) {
    uid += 1;
    return prefix + "-" + uid;
  }

  /* A picture with a fixed size, hidden if it has not arrived. The words beside it carry the meaning. */
  function pic(src, size, cls) {
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

  function button(label, cls) {
    var b = el("button", cls, label);
    b.setAttribute("type", "button");
    return b;
  }

  function linkTo(label, href, cls) {
    var a = el("a", cls, label);
    a.setAttribute("href", href);
    return a;
  }

  function pointsWord(n) {
    if (window.Site && typeof window.Site.pointsWord === "function") { return window.Site.pointsWord(n); }
    return n + (n === 1 ? " point" : " points");
  }

  function isQuiet() { return G.setting("quiet") === true; }

  function reducedMotion() {
    try {
      return !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (e) { return false; }
  }

  function safeNext() {
    try { return G.nextStep(); } catch (e) { return null; }
  }

  /* The full stop after a title, unless the title ends in its own mark ("Who's the Boss?"). */
  function endStop(title) { return /[?!.]$/.test(String(title)) ? "" : "."; }

  function scrollToTop(node) {
    var y;
    if (!node || !node.getBoundingClientRect) { return; }
    y = node.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop || 0) - 8;
    if (y < 0) { y = 0; }
    try { window.scrollTo({ top: y, left: 0, behavior: "instant" }); } catch (e) { window.scrollTo(0, y); }
  }

  /* Brings a node into view with the smallest move that shows it. */
  function reveal(node) {
    if (!node || !node.scrollIntoView) { return; }
    try { node.scrollIntoView({ block: "nearest", inline: "nearest" }); } catch (e) { /* older browsers: leave the page where it is */ }
  }

  function focusOn(node) {
    if (!node) { return; }
    if (!node.hasAttribute("tabindex") && !/^(A|BUTTON|INPUT|SUMMARY)$/.test(node.tagName)) {
      node.setAttribute("tabindex", "-1");
    }
    try { node.focus({ preventScroll: true }); } catch (e) {
      try { node.focus(); } catch (e2) { /* nothing to do */ }
    }
  }

  /* ---------- the Trail, in order ---------- */

  function buildIndex() {
    var cfgWorlds = list(CFG.worlds), trail = list(window.TRAIL), byId = {}, i, j, cw, data, w, cl, dl, k, L, src;
    for (i = 0; i < trail.length; i++) {
      if (trail[i] && trail[i].id) { byId[trail[i].id] = trail[i]; }
    }
    if (!cfgWorlds.length) {
      cfgWorlds = trail.slice().sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
    }
    for (i = 0; i < cfgWorlds.length; i++) {
      cw = cfgWorlds[i];
      if (!cw || !cw.id) { continue; }
      data = byId[cw.id] || null;
      w = {
        id: cw.id,
        n: typeof cw.order === "number" ? cw.order : i,
        index: WORLDS.length,
        title: (data && data.title) || cw.title || "",
        tagline: (data && data.tagline) || cw.tagline || "",
        icon: (data && data.icon) || "img/worlds/" + cw.id + ".svg",
        bossTitle: (data && data.boss && data.boss.title) || cw.bossTitle || "",
        data: data,
        lessons: []
      };
      dl = {};
      src = data ? list(data.lessons) : [];
      for (k = 0; k < src.length; k++) {
        if (src[k] && src[k].id) { dl[src[k].id] = src[k]; }
      }
      cl = list(cw.lessons);
      for (j = 0; j < cl.length; j++) {
        if (!cl[j] || !cl[j].id) { continue; }
        k = dl[cl[j].id] || null;
        L = {
          id: cl[j].id,
          n: j + 1,
          pos: ORDER.length,
          title: (k && k.title) || cl[j].title || "",
          icon: (k && k.icon) || (String(cl[j].icon || "").indexOf("/") === -1 ? "img/icons/" + cl[j].icon + ".svg" : cl[j].icon),
          minutes: k && k.minutes > 0 ? k.minutes : 0,
          data: k && list(k.steps).length ? k : null,
          world: w
        };
        w.lessons.push(L);
        LESSON[L.id] = L;
        ORDER.push(L);
      }
      WORLDS.push(w);
      WORLD[w.id] = w;
    }
  }

  function isHeadsUp(L) {
    return list(CFG.headsUp).indexOf(L.id) !== -1 || !!(L.data && L.data.headsUp);
  }

  /* What a later stone "comes after": the lesson before it, or the check before its world. */
  function previousTitle(L) {
    var before;
    if (L.n > 1) { return L.world.lessons[L.n - 2].title; }
    before = WORLDS[L.world.index - 1];
    return before ? before.bossTitle || before.title : "";
  }

  function lessonState(L, step) {
    if (G.has("lesson:" + L.id)) { return "done"; }
    if (step && step.type === "lesson" && step.id === L.id) { return "here"; }
    if (G.isSetAside(L.id)) { return "aside"; }
    return G.isUnlocked(L.id) ? "open" : "later";
  }

  /* ---------- taught words ---------- */

  function wordInfo(w) {
    var L = LESSON[w.lesson], steps = L && L.data ? list(L.data.steps) : [], i, means = w.means, say = w.say, old = w.old;
    for (i = 0; i < steps.length; i++) {
      if (steps[i].type === "word") {
        means = steps[i].means || means;
        say = steps[i].say || say;
        old = steps[i].old || old;
      }
    }
    return { term: w.term, say: say || "", old: old || "", means: means || "", pos: L ? L.pos : 9999 };
  }

  /* The words taught in lessons before position "pos", with one pattern that finds them all. */
  function taughtBefore(pos) {
    var words = list(CFG.words), byKey = {}, alts = [], i, info;
    function add(key) {
      key = String(key).toLowerCase();
      if (key && !byKey[key]) {
        byKey[key] = info;
        alts.push(key.replace(/[\\^$.*+?()[\]{}|\/-]/g, "\\$&"));
      }
    }
    for (i = 0; i < words.length; i++) {
      if (!words[i] || !words[i].term) { continue; }
      info = wordInfo(words[i]);
      if (info.pos >= pos) { continue; }
      add(info.term);
      if (info.old) { add(info.old); }
    }
    if (!alts.length) { return null; }
    alts.sort(function (a, b) { return b.length - a.length; });
    return { byKey: byKey, source: "(^|[^A-Za-z0-9])(" + alts.join("|") + ")(s?)(?![A-Za-z0-9])", used: {} };
  }

  function closeWord(refocus) {
    var w = openWord;
    if (!w) { return; }
    openWord = null;
    if (w.panel.parentNode) { w.panel.parentNode.removeChild(w.panel); }
    w.btn.setAttribute("aria-expanded", "false");
    if (refocus) { focusOn(w.btn); }
  }

  function markOld(node, word) {
    if (OLD_WORDS[String(word).toLowerCase()] === 1) { node.setAttribute("lang", "pi"); }
    return node;
  }

  /* Plain text into "node". Any old-language word in it is wrapped so that it carries
     lang="pi"; nothing here becomes a button. */
  function fillOld(node, text) {
    var keys = [], k, re, m, last = 0, start;
    text = String(text === undefined || text === null ? "" : text);
    for (k in OLD_WORDS) {
      if (Object.prototype.hasOwnProperty.call(OLD_WORDS, k)) { keys.push(k); }
    }
    re = new RegExp("(^|[^A-Za-z0-9])(" + keys.join("|") + ")(s?)(?![A-Za-z0-9])", "gi");
    m = keys.length ? re.exec(text) : null;
    while (m) {
      start = m.index + m[1].length;
      if (start > last) { node.appendChild(txt(text.slice(last, start))); }
      node.appendChild(el("span", "", m[2] + m[3]));
      node.lastChild.setAttribute("lang", "pi");
      last = start + m[2].length + m[3].length;
      if (re.lastIndex <= m.index) { re.lastIndex = m.index + 1; }
      m = re.exec(text);
    }
    if (last < text.length) { node.appendChild(txt(text.slice(last))); }
    return node;
  }

  /* Opens the plain meaning in place, right after the block of text the word sits in. */
  function toggleWord(btn, info, block) {
    var panel, head, close, id;
    if (openWord && openWord.btn === btn) { closeWord(true); return; }
    closeWord(false);
    id = nextId("word");
    panel = el("div", "word-panel");
    panel.id = id;
    panel.setAttribute("role", "group");
    panel.setAttribute("aria-label", info.term);
    panel.setAttribute("tabindex", "-1");
    head = el("p", "word-panel-head");
    head.appendChild(markOld(el("strong", "word-panel-term", info.term), info.term));
    if (info.old) {
      head.appendChild(txt(" "));
      head.appendChild(el("span", "word-panel-say", "(" + TEXT.oldWord));
      head.lastChild.appendChild(markOld(el("span", "", info.old), info.old));
      head.lastChild.appendChild(txt(")"));
    }
    if (info.say) {
      head.appendChild(txt(" "));
      head.appendChild(el("span", "word-panel-say", TEXT.sayIt + info.say));
    }
    panel.appendChild(head);
    panel.appendChild(fillOld(el("p", "word-panel-means"), info.means));
    close = button("Close", "btn btn-link word-close");
    close.addEventListener("click", function () { closeWord(true); });
    panel.appendChild(close);
    if (block.nextSibling) { block.parentNode.insertBefore(panel, block.nextSibling); } else { block.parentNode.appendChild(panel); }
    btn.setAttribute("aria-expanded", "true");
    btn.setAttribute("aria-controls", id);
    openWord = { btn: btn, panel: panel };
    focusOn(panel);
  }

  /* Puts one run of plain text into "block". The first time a taught word appears on a card
     it becomes a small button. Everything else is a text node. */
  function fillLine(block, text, taught) {
    var re, m, last = 0, key, info, start, b;
    text = String(text);
    if (!taught) { block.appendChild(txt(text)); return; }
    re = new RegExp(taught.source, "gi");
    m = re.exec(text);
    while (m) {
      key = m[2].toLowerCase();
      info = taught.byKey[key];
      if (info && !taught.used[info.term]) {
        taught.used[info.term] = true;
        start = m.index + m[1].length;
        if (start > last) { block.appendChild(txt(text.slice(last, start))); }
        b = button(m[2] + m[3], "word-btn");
        markOld(b, m[2]);
        b.setAttribute("aria-expanded", "false");
        (function (btn, word) {
          btn.addEventListener("click", function () { toggleWord(btn, word, block); });
        })(b, info);
        block.appendChild(b);
        last = start + m[2].length + m[3].length;
      }
      if (re.lastIndex <= m.index) { re.lastIndex = m.index + 1; }
      m = re.exec(text);
    }
    if (last < text.length) { block.appendChild(txt(text.slice(last))); }
  }

  /* Plain text with blank-line paragraph breaks -> <p> elements. */
  function fillText(box, text, taught) {
    var parts = String(text === undefined || text === null ? "" : text).split(/\n\s*\n/), i, p, s;
    for (i = 0; i < parts.length; i++) {
      s = parts[i].replace(/^\s+|\s+$/g, "");
      if (!s) { continue; }
      p = el("p");
      fillLine(p, s, taught);
      box.appendChild(p);
    }
  }

  /* ---------- read aloud ---------- */

  function speechReady() {
    if (speech) { return speech; }
    try {
      if (window.speechSynthesis && typeof window.SpeechSynthesisUtterance === "function") { speech = window.speechSynthesis; }
    } catch (e) { speech = null; }
    return speech;
  }

  /* The words on the button say what a press will do, so it carries no pressed state. */
  function paintSpeak(btn, on) {
    if (on) { btn.classList.add("is-reading"); } else { btn.classList.remove("is-reading"); }
    clear(btn);
    btn.appendChild(txt(on ? TEXT.stopReading : TEXT.readAloud));
  }

  function stopSpeech() {
    speakToken += 1;
    if (speaking) { paintSpeak(speaking, false); }
    speaking = null;
    if (speech) {
      try { speech.cancel(); } catch (e) { /* nothing to stop */ }
    }
  }

  function startSpeech(btn, lines) {
    var token, i, u, last = null;
    if (!speechReady()) { return; }
    if (speaking === btn) { stopSpeech(); return; }
    stopSpeech();
    token = speakToken;
    function finished() {
      if (token === speakToken) {
        if (speaking) { paintSpeak(speaking, false); }
        speaking = null;
      }
    }
    try {
      for (i = 0; i < lines.length; i++) {
        if (!lines[i]) { continue; }
        u = new window.SpeechSynthesisUtterance(String(lines[i]));
        u.lang = document.documentElement.lang || "en";
        u.rate = 0.95;
        u.onerror = finished;
        last = u;
        speech.speak(u);
      }
      if (last) {
        last.onend = finished;
        speaking = btn;
        paintSpeak(btn, true);
      }
    } catch (e) { finished(); }
  }

  /* The button reads only its own card, only when pressed. A second press stops it. */
  function speakButton(getLines) {
    var b;
    if (!speechReady()) { return null; }
    b = button(TEXT.readAloud, "btn btn-link speak-btn no-print");
    b.addEventListener("click", function () { startSpeech(b, getLines()); });
    return b;
  }

  /* ---------- news held back from a heads-up lesson ---------- */

  function readHeld() {
    var raw = null, o;
    try { raw = window.localStorage.getItem(HELD_KEY); } catch (e) { raw = null; }
    if (typeof raw === "string") {
      try { o = JSON.parse(raw); } catch (e2) { o = null; }
      if (o && typeof o === "object") { return { badges: list(o.badges), rank: typeof o.rank === "string" ? o.rank : "" }; }
    }
    return heldMemory || { badges: [], rank: "" };
  }

  function writeHeld(h) {
    heldMemory = h;
    try {
      if (h) { window.localStorage.setItem(HELD_KEY, JSON.stringify(h)); } else { window.localStorage.removeItem(HELD_KEY); }
    } catch (e) { /* kept in memory instead */ }
  }

  function newsFrom(res, extraBadges) {
    var out = { badges: [], rank: "" }, i, b;
    b = list(extraBadges).concat(res ? list(res.newBadges) : []);
    for (i = 0; i < b.length; i++) {
      if (b[i] && b[i].id && out.badges.indexOf(b[i].id) === -1) { out.badges.push(b[i].id); }
    }
    if (res && res.rankUp && res.rankUp.id) { out.rank = res.rankUp.id; }
    return out;
  }

  function holdNews(news) {
    var h = readHeld(), i;
    for (i = 0; i < news.badges.length; i++) {
      if (h.badges.indexOf(news.badges[i]) === -1) { h.badges.push(news.badges[i]); }
    }
    if (news.rank) { h.rank = news.rank; }
    if (h.badges.length || h.rank) { writeHeld(h); }
  }

  function takeHeld(news) {
    var h = readHeld(), i;
    for (i = h.badges.length - 1; i >= 0; i--) {
      if (news.badges.indexOf(h.badges[i]) === -1) { news.badges.unshift(h.badges[i]); }
    }
    if (!news.rank && h.rank) { news.rank = h.rank; }
    if (h.badges.length || h.rank) { writeHeld(null); }
    return news;
  }

  /* One still picture and one line for each new badge or title. Hidden in Quiet Mode.
     Held news is only shown while it is still true (not after "Start over" or a loaded file). */
  function newsList(news) {
    var ul, all, ranks, i, j, li, now;
    if (!news || (!news.badges.length && !news.rank)) { return null; }
    ul = el("ul", "reward-news game-only");
    all = G.badges();
    for (i = 0; i < news.badges.length; i++) {
      for (j = 0; j < all.length; j++) {
        if (all[j].id === news.badges[i] && all[j].earned === true) {
          li = el("li", "reward-news-item");
          li.appendChild(pic(all[j].icon, 44));
          li.appendChild(el("span", "", TEXT.newBadge + all[j].name));
          ul.appendChild(li);
        }
      }
    }
    if (news.rank) {
      ranks = G.ranks();
      now = G.rank();
      for (j = 0; j < ranks.length; j++) {
        if (ranks[j].id === news.rank && now && now.index >= (typeof ranks[j].index === "number" ? ranks[j].index : j)) {
          li = el("li", "reward-news-item");
          li.appendChild(pic(ranks[j].icon, 44));
          li.appendChild(el("span", "", TEXT.newTitle + ranks[j].name));
          ul.appendChild(li);
        }
      }
    }
    return ul.firstChild ? ul : null;
  }

  function pointsLine(res) {
    var p;
    if (!res || !res.awarded || !(res.xp > 0)) { return null; }
    p = el("p", "reward-points game-only");
    p.appendChild(pic(LOTUS, 28));
    p.appendChild(el("span", "", "+" + pointsWord(res.xp)));
    return p;
  }

  /* ---------- leaving a view ---------- */

  function stopRing() {
    if (ringTimer !== null) {
      window.clearTimeout(ringTimer);
      ringTimer = null;
    }
  }

  function tidy() {
    stopSpeech();
    stopRing();
    closeWord(false);
  }

  /* Every view calls this as it is drawn. The heads-up marker is cleared here and set again
     only by a heads-up lesson, so it is never left behind on the map, a note or a check. */
  function setFocusMode(on) {
    var body = document.body;
    body.removeAttribute("data-heads-up");
    if (on) { body.classList.add("trail-focus"); } else { body.classList.remove("trail-focus"); }
    if (dailyBox) {
      if (on) { dailyBox.setAttribute("hidden", ""); } else { dailyBox.removeAttribute("hidden"); }
    }
    if (settingsBox) {
      if (on) { settingsBox.setAttribute("hidden", ""); } else { settingsBox.removeAttribute("hidden"); }
    }
  }

  /* ---------- the hash ---------- */

  function hashText() {
    var h = String(window.location.hash || "").replace(/^#/, "");
    try { h = decodeURIComponent(h); } catch (e) { /* keep it as it is */ }
    return h;
  }

  /* Changes the address without adding a step to the browser's history. */
  function replaceHash(h) {
    try {
      window.history.replaceState(null, "", "#" + h);
      return true;
    } catch (e) { return false; }
  }

  function go(h, replace) {
    var target = "#" + h;
    if (replace) {
      if (replaceHash(h)) { route(false); } else { window.location.replace(target); }
      return;
    }
    if (window.location.hash === target) { route(false); } else { window.location.hash = target; }
  }

  function route(first) {
    var h, m, step;
    if (routing) { return; }
    routing = true;
    try {
      h = hashText();
      if (h === "next") {
        step = safeNext();
        routing = false;
        if (step && step.type === "boss") {
          go("check-" + step.world, true);
        } else if (step && step.id) {
          go(step.id, true);
        } else {
          go(G.trailDone() ? "complete" : "map", true);
        }
        return;
      }
      if (h === "complete" && G.trailDone()) {
        showComplete(null, first);
      } else if ((m = /^check-(.+)$/.exec(h)) && WORLD[m[1]]) {
        showCheck(WORLD[m[1]], first);
      } else if ((m = /^([^\/]+)(?:\/(\d+))?$/.exec(h)) && LESSON[m[1]]) {
        showLesson(LESSON[m[1]], m[2] ? parseInt(m[2], 10) : 0, first);
      } else {
        showMap(first);
      }
    } finally {
      routing = false;
    }
  }

  /* ==================================================================== */
  /* The map                                                              */
  /* ==================================================================== */

  function stateMark(kind) {
    var s = el("span", "state-ico state-" + kind);
    s.setAttribute("aria-hidden", "true");
    return s;
  }

  function showLaterNote(li, words) {
    var old = view.querySelectorAll(".stone-note"), i, note;
    for (i = 0; i < old.length; i++) { clear(old[i]); }
    note = li.querySelector(".stone-note");
    if (note) { note.appendChild(txt(words)); }
  }

  function minutesWords(L) {
    return L.minutes ? TEXT.aboutMinutes + L.minutes + TEXT.minutes : "";
  }

  function lessonStone(L, step) {
    var st = lessonState(L, step), li = el("li", "stone-item is-" + st), node, mark, body, line, num, state, words, note, r, before;
    if (L.id === BANNER_LESSON) { li.appendChild(el("p", "stone-banner", TEXT.banner)); }
    if (st === "later") {
      node = button("", "stone");
    } else {
      node = linkTo("", "#" + L.id, "stone");
    }
    mark = el("span", "stone-mark");
    mark.appendChild(pic(L.icon, 36));
    if (st === "done") { mark.appendChild(pic(CHECK_ICON, 16, "stone-tick")); }
    node.appendChild(mark);

    body = el("span", "stone-body");
    line = el("span", "stone-line");
    num = el("span", "stone-num");
    num.appendChild(el("span", "sr-only", TEXT.lessonWord));
    num.appendChild(txt(L.n));
    line.appendChild(num);
    line.appendChild(el("span", "stone-title", L.title));
    line.appendChild(el("span", "sr-only", ". "));
    body.appendChild(line);

    before = previousTitle(L);
    if (st === "done") {
      words = TEXT.done;
    } else if (st === "here") {
      words = TEXT.here + (L.minutes ? " · " + minutesWords(L) : "");
    } else if (st === "aside") {
      words = TEXT.aside;
    } else if (st === "open") {
      words = TEXT.open + (L.minutes ? " · " + minutesWords(L) : "");
    } else {
      words = before ? TEXT.comesAfter + before : TEXT.open;
    }
    state = el("span", "stone-state");
    state.appendChild(stateMark(st));
    state.appendChild(el("span", "stone-state-words", words));
    body.appendChild(state);
    node.appendChild(body);

    if (st === "here") {
      r = G.resume();
      node.appendChild(el("span", "sr-only", ". "));
      node.appendChild(el("span", "stone-go", r && r.lesson === L.id && r.card > 1 ? TEXT.carryOn : TEXT.start));
      node.id = "stone-here";
    }
    li.appendChild(node);

    if (st === "later") {
      note = el("p", "stone-note");
      note.setAttribute("role", "status");
      li.appendChild(note);
      node.addEventListener("click", function () {
        showLaterNote(li, TEXT.laterNote + before + endStop(before) + TEXT.laterNoteEnd);
      });
    }
    return li;
  }

  /* The questions a check will ask: the same count as newCheck, so set-aside lessons are left out. */
  function checkCount(w) {
    var qs = w.data && w.data.boss ? list(w.data.boss.questions) : [], n = 0, i;
    for (i = 0; i < qs.length; i++) {
      if (qs[i] && !(qs[i].lesson && G.isSetAside(qs[i].lesson))) { n += 1; }
    }
    return n;
  }

  function checkStone(w, wp, step) {
    var here = !wp.bossDone && step && step.type === "boss" && step.world === w.id;
    var st = wp.bossDone ? "done" : (here ? "here" : "open");
    var li = el("li", "stone-item stone-check is-" + st), node, mark, body, state, n = checkCount(w);
    node = linkTo("", "#check-" + w.id, "stone");
    mark = el("span", "stone-mark");
    mark.appendChild(pic(w.icon, 40));
    if (st === "done") { mark.appendChild(pic(CHECK_ICON, 16, "stone-tick")); }
    node.appendChild(mark);
    body = el("span", "stone-body");
    body.appendChild(el("span", "stone-line"));
    body.firstChild.appendChild(el("span", "stone-title", w.bossTitle));
    body.firstChild.appendChild(el("span", "sr-only", ". "));
    state = el("span", "stone-state");
    state.appendChild(stateMark(st));
    state.appendChild(el("span", "stone-state-words",
      st === "done" ? TEXT.done : (st === "here" ? TEXT.here + " · " : "") + (n > 1 ? n + TEXT.checkSub : TEXT.checkSubOne)));
    body.appendChild(state);
    node.appendChild(body);
    if (st === "here") {
      node.appendChild(el("span", "sr-only", ". "));
      node.appendChild(el("span", "stone-go", TEXT.start));
      node.id = "stone-here";
    }
    li.appendChild(node);
    return li;
  }

  function svg(tag, attrs) {
    var n = document.createElementNS(SVG_NS, tag), k;
    for (k in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, k)) { n.setAttribute(k, attrs[k]); }
    }
    return n;
  }

  /* The training wheel: eight spokes with plain-word labels. A lit spoke is thick and solid
     with a filled end; one not yet lit is thin and dotted with a hollow end.
     The picture box is cut close to the labels so they stay readable on a narrow screen, and
     the gaps between a label's lines are in em, so css/trail.css can make the labels bigger. */
  function wheelFigure() {
    var fig = el("figure", "spoke-wheel"), pic1, cx = 160, cy = 126, r = 56, i, a, x, y, lit, n = 0, names = [], all = [], lx, ly, anchor, t, j, cos, sin, cap, up;
    pic1 = svg("svg", { viewBox: "10 14 284 224", "class": "wheel-svg", role: "img", focusable: "false" });
    pic1.appendChild(svg("circle", { cx: cx, cy: cy, r: r, "class": "wheel-rim" }));
    for (i = 0; i < SPOKES.length; i++) {
      a = (-90 + i * 45) * Math.PI / 180;
      cos = Math.round(Math.cos(a) * 1000) / 1000;
      sin = Math.round(Math.sin(a) * 1000) / 1000;
      x = cx + r * cos;
      y = cy + r * sin;
      lit = G.has("lesson:" + SPOKES[i].lesson);
      all.push(SPOKES[i].words.join(" "));
      if (lit) {
        n += 1;
        names.push(SPOKES[i].words.join(" "));
      }
      pic1.appendChild(svg("line", { x1: cx, y1: cy, x2: x, y2: y, "class": lit ? "wheel-spoke is-lit" : "wheel-spoke" }));
      pic1.appendChild(svg("circle", { cx: x, cy: y, r: lit ? 6 : 4.5, "class": lit ? "wheel-end is-lit" : "wheel-end" }));
      anchor = cos > 0.1 ? "start" : (cos < -0.1 ? "end" : "middle");
      lx = cx + (r + 13) * cos;
      ly = cy + (r + 13) * sin;
      /* "up" is how far the first line is lifted, in lines: a label above the wheel ends
         just over it, one at the side is centred on its spoke, one below starts under it. */
      if (anchor === "middle") {
        ly = sin < 0 ? cy - r - 14 : cy + r + 26;
        up = sin < 0 ? SPOKES[i].words.length - 1 : 0;
      } else {
        ly = ly + 5 + (sin > 0.1 ? 8 : (sin < -0.1 ? -8 : 0));
        up = (SPOKES[i].words.length - 1) / 2;
      }
      t = svg("text", { x: lx, y: ly, "text-anchor": anchor, "class": lit ? "wheel-label is-lit" : "wheel-label" });
      for (j = 0; j < SPOKES[i].words.length; j++) {
        t.appendChild(svg("tspan", { x: lx, dy: (j === 0 ? -1.2 * up : 1.2) + "em" }));
        t.lastChild.appendChild(txt(SPOKES[i].words[j]));
      }
      pic1.appendChild(t);
    }
    pic1.appendChild(svg("circle", { cx: cx, cy: cy, r: 9, "class": "wheel-hub" }));
    pic1.setAttribute("aria-label", TEXT.wheelAlt + all.join(", ") + ". " + (n ? "Lit so far: " + names.join(", ") + "." : TEXT.wheelNone));
    fig.appendChild(pic1);
    cap = el("figcaption", "wheel-caption");
    cap.appendChild(el("strong", "", TEXT.wheelTitle + ". "));
    cap.appendChild(txt(TEXT.wheelCaption + " " + (n ? n + (n === 1 ? TEXT.wheelLitOne : TEXT.wheelLit) : TEXT.wheelNone)));
    fig.appendChild(cap);
    return fig;
  }

  function worldBlock(w, step) {
    var wp = G.worldProgress(w.id), here = !!step && step.world === w.id;
    var folded = wp.bossDone && wp.complete && !here;
    var box = el(folded ? "details" : "section", "world" + (here ? " world-here" : "") + (wp.bossDone ? " world-done" : ""));
    var head = el(folded ? "summary" : "div", "world-head"), text = el("div", "world-text"), h3, prog, stones, i, inner, tog;
    box.id = "world-" + w.id;
    head.appendChild(pic(w.icon, 64, "world-emblem"));
    text.appendChild(el("p", "world-kicker", TEXT.world + w.n));
    h3 = el("h3", "world-title", w.title);
    text.appendChild(h3);
    if (w.tagline) { text.appendChild(el("p", "world-tagline", w.tagline)); }
    prog = el("p", "world-progress");
    if (wp.bossDone) { prog.appendChild(pic(CHECK_ICON, 16, "world-tick")); }
    prog.appendChild(txt(wp.done + TEXT.of + wp.total + TEXT.lessonsDone + (wp.bossDone ? ". " + TEXT.checkComplete + "." : "")));
    text.appendChild(prog);
    if (folded) {
      tog = el("span", "world-toggle");
      tog.appendChild(el("span", "world-toggle-show", TEXT.showLessons));
      tog.appendChild(el("span", "world-toggle-hide", TEXT.hideLessons));
      text.appendChild(tog);
    }
    head.appendChild(text);
    box.appendChild(head);

    inner = el("div", "world-body");
    if (w.id === WHEEL_WORLD) { inner.appendChild(wheelFigure()); }
    if (!w.data) {
      inner.appendChild(el("p", "world-unwritten", TEXT.unwritten));
    } else {
      stones = el("ol", "stones");
      for (i = 0; i < w.lessons.length; i++) { stones.appendChild(lessonStone(w.lessons[i], step)); }
      if ((wp.complete || wp.bossDone) && w.data.boss) { stones.appendChild(checkStone(w, wp, step)); }
      inner.appendChild(stones);
    }
    box.appendChild(inner);

    if (folded) {
      if (openWorlds[w.id]) { box.setAttribute("open", ""); }
      box.addEventListener("toggle", function () { openWorlds[w.id] = box.open === true; });
    }
    return box;
  }

  function legendBlock(step) {
    var box = el("section", "legend panel"), ol = el("ol", "legend-list"), i, j, row, li, here, done, q, where, jump;
    box.setAttribute("aria-labelledby", "legend-h");
    box.appendChild(el("h3", "legend-title", TEXT.legendTitle));
    box.lastChild.id = "legend-h";
    box.appendChild(el("p", "legend-lede", TEXT.legendLede));
    for (i = 0; i < LEGEND.length; i++) {
      row = LEGEND[i];
      here = false;
      done = true;
      for (j = 0; j < row.worlds.length; j++) {
        if (step && step.world === row.worlds[j]) { here = true; }
        if (!G.has("boss:" + row.worlds[j])) { done = false; }
      }
      li = el("li", "legend-row" + (here ? " is-here" : "") + (done ? " is-done" : ""));
      q = el("span", "legend-q");
      if (row.n) { q.appendChild(el("span", "legend-n", row.n)); }
      q.appendChild(el("span", "legend-label", row.label));
      li.appendChild(q);
      where = el("span", "legend-where", row.where);
      li.appendChild(where);
      if (done) {
        li.appendChild(el("span", "legend-mark legend-done"));
        li.lastChild.appendChild(pic(CHECK_ICON, 14));
        li.lastChild.appendChild(txt(TEXT.done));
      } else if (here) {
        li.appendChild(el("span", "legend-mark legend-here"));
        li.lastChild.appendChild(stateMark("here"));
        li.lastChild.appendChild(txt(TEXT.here));
      }
      ol.appendChild(li);
    }
    box.appendChild(ol);
    if (step) {
      jump = button(TEXT.showPlace, "btn btn-link legend-jump");
      jump.id = "legend-jump";
      jump.addEventListener("click", function () {
        var target = document.getElementById("stone-here");
        if (target) {
          try { target.scrollIntoView({ block: "center" }); } catch (e) { target.scrollIntoView(); }
          focusOn(target);
        }
      });
      box.appendChild(jump);
    }
    return box;
  }

  function settingButton(name, label) {
    var b = button("", "btn btn-plain setting-btn"), on = G.setting(name) === true;
    b.id = "set-" + name;
    b.setAttribute("aria-pressed", on ? "true" : "false");
    b.appendChild(txt(label + ": "));
    b.appendChild(el("strong", "", on ? TEXT.on : TEXT.off));
    /* The change is heard at once and the whole map is drawn again, at a new height. The page
       is then moved by the same amount, so the switch that was pressed stays under the finger. */
    b.addEventListener("click", function () {
      var top0 = b.getBoundingClientRect().top, back, delta;
      G.setting(name, !(G.setting(name) === true));
      back = document.getElementById(b.id);
      if (!back || back === b) { return; }
      delta = back.getBoundingClientRect().top - top0;
      if (Math.abs(delta) < 1) { return; }
      try { window.scrollBy({ top: delta, left: 0, behavior: "instant" }); } catch (e) { window.scrollBy(0, delta); }
    });
    return b;
  }

  /* Drawn in its own box under the One Quiet Minute card, so that card is never redrawn. */
  function renderSettings() {
    var active = document.activeElement, keepId, back;
    if (!settingsBox) {
      settingsBox = el("div", "trail-settings-box");
      if (dailyBox && dailyBox.parentNode) {
        dailyBox.parentNode.insertBefore(settingsBox, dailyBox.nextSibling);
      } else {
        view.parentNode.insertBefore(settingsBox, view.nextSibling);
      }
    }
    keepId = active && settingsBox.contains(active) ? active.id : "";
    clear(settingsBox);
    settingsBox.appendChild(settingsBlock());
    if (keepId) {
      back = document.getElementById(keepId);
      if (back) { focusOn(back); }
    }
  }

  function settingsBlock() {
    var box = el("section", "trail-settings no-print"), row = el("div", "setting-row"), p;
    box.setAttribute("aria-labelledby", "settings-h");
    box.appendChild(el("h3", "settings-title", TEXT.settings));
    box.lastChild.id = "settings-h";
    row.appendChild(settingButton("large", TEXT.setLarge));
    row.appendChild(settingButton("quiet", TEXT.setQuiet));
    row.appendChild(settingButton("openAll", TEXT.setOpen));
    box.appendChild(row);
    box.appendChild(el("p", "settings-help", TEXT.settingsHelp));
    p = el("p", "settings-help", TEXT.saved);
    p.appendChild(linkTo(TEXT.savedLink, "profile.html", ""));
    p.appendChild(txt("."));
    box.appendChild(p);
    return box;
  }

  function renderMap() {
    var active = document.activeElement, keepId = active && view.contains(active) ? active.id : "";
    var step = safeNext(), map = el("div", "map"), h, i, worlds, donePanel, back;
    clear(view);
    h = el("h2", "map-title", TEXT.mapTitle);
    h.id = "map-h";
    h.setAttribute("tabindex", "-1");
    map.appendChild(h);
    map.appendChild(el("p", "map-lede", ORDER.length + TEXT.mapLede1 + WORLDS.length + TEXT.mapLede2));
    if (!step && G.trailDone()) {
      donePanel = el("div", "panel panel-gold map-done");
      donePanel.appendChild(el("p", "map-done-title", TEXT.doneTitle));
      donePanel.appendChild(el("p", "", TEXT.doneShort));
      donePanel.appendChild(linkTo(TEXT.doneLink, "#complete", "btn btn-primary"));
      map.appendChild(donePanel);
    }
    map.appendChild(legendBlock(step));
    worlds = el("div", "worlds");
    for (i = 0; i < WORLDS.length; i++) { worlds.appendChild(worldBlock(WORLDS[i], step)); }
    map.appendChild(worlds);
    view.appendChild(map);
    renderSettings();
    if (keepId) {
      back = document.getElementById(keepId);
      if (back) { focusOn(back); }
    }
    return h;
  }

  function mountDaily() {
    if (dailyMounted || !dailyBox) { return; }
    dailyMounted = true;
    try {
      if (window.Daily && typeof window.Daily.mount === "function") { window.Daily.mount(dailyBox); }
    } catch (e) { /* the card is optional */ }
  }

  function showMap(first) {
    var h;
    tidy();
    cur = { type: "map" };
    setFocusMode(false);
    h = renderMap();
    mountDaily();
    if (!first) {
      scrollToTop(view);
      focusOn(h);
    }
  }

  /* ==================================================================== */
  /* A short note in place of a lesson or check that is not open yet      */
  /* ==================================================================== */

  function showNote(title, lines, withSwitchHint) {
    var box = el("div", "lesson"), panel = el("section", "panel lesson-card"), h, i, row;
    tidy();
    cur = { type: "note" };
    setFocusMode(true);
    clear(view);
    h = el("h2", "card-h", title);
    panel.appendChild(h);
    for (i = 0; i < lines.length; i++) { panel.appendChild(el("p", "", lines[i])); }
    if (withSwitchHint) { panel.appendChild(el("p", "card-small", TEXT.stepOpenAll)); }
    row = el("div", "choice-row");
    if (safeNext()) { row.appendChild(linkTo(TEXT.stepNext, "#next", "btn btn-primary")); }
    row.appendChild(linkTo(TEXT.seeMap, "#map", "btn btn-plain"));
    panel.appendChild(row);
    box.appendChild(panel);
    view.appendChild(box);
    scrollToTop(box);
    focusOn(h);
  }

  /* ==================================================================== */
  /* Questions: shared by the quick check and the world checks            */
  /* ==================================================================== */

  /* st = { tried: [option indexes], solved: true or false }
     opts = { taught, onPick(index, right, firstPick), missExtra(): node or null }
     Returns { node, lines() } where lines() is what "Read aloud" reads. */
  function questionBlock(q, st, opts) {
    var wrap = el("div", "quiz"), field = el("fieldset", "quiz-field"), legend = el("legend", "quiz-q");
    var hint = el("p", "quiz-hint", TEXT.pickOne), box = el("div", "quiz-options"), fb = el("div", "quiz-feedback");
    var options = list(q.options), buttons = [], i, lastMiss = -1;

    fb.setAttribute("role", "status");
    fb.setAttribute("aria-live", "polite");
    fillLine(legend, q.q, opts.taught);
    field.appendChild(legend);
    field.appendChild(hint);

    function paintOption(i) {
      var b = buttons[i], right = st.solved && i === q.answer, tried = st.tried.indexOf(i) !== -1 && i !== q.answer, tag;
      b.className = "quiz-opt" + (right ? " is-right" : "") + (tried ? " is-tried" : "") + (st.solved && !right ? " is-closed" : "");
      clear(b);
      tag = el("span", "opt-mark");
      tag.setAttribute("aria-hidden", "true");
      if (right) { tag.appendChild(pic(CHECK_ICON, 18)); }
      b.appendChild(tag);
      b.appendChild(el("span", "opt-text", options[i]));
      if (right) { b.appendChild(el("span", "opt-tag", TEXT.rightTag)); }
      if (tried) { b.appendChild(el("span", "opt-tag", TEXT.triedTag)); }
      if (st.solved || tried) { b.setAttribute("aria-disabled", "true"); } else { b.removeAttribute("aria-disabled"); }
    }

    function paintFeedback(announce) {
      var p, extra;
      clear(fb);
      fb.className = "quiz-feedback";
      hint.style.display = st.solved ? "none" : "";
      if (st.solved) {
        fb.className = "quiz-feedback is-right";
        p = el("p", "fb-line");
        p.appendChild(pic(CHECK_ICON, 22, "fb-icon"));
        p.appendChild(el("strong", "fb-word", TEXT.right));
        p.appendChild(txt(" " + (q.why || "")));
        fb.appendChild(p);
      } else if (lastMiss !== -1 || (announce !== true && st.tried.length)) {
        fb.className = "quiz-feedback is-again";
        p = el("p", "fb-line fb-word");
        p.appendChild(el("span", "fb-mark"));          /* the same open, dashed circle as a tried answer */
        p.firstChild.setAttribute("aria-hidden", "true");
        p.appendChild(txt(TEXT.notQuite));
        fb.appendChild(p);
        fb.appendChild(el("p", "fb-again", q.again || ""));
        extra = opts.missExtra ? opts.missExtra() : null;
        if (extra) { fb.appendChild(extra); }
        fb.appendChild(el("p", "fb-small", TEXT.pickAgain));
      }
    }

    function pick(i) {
      var first, right;
      if (st.solved) { return; }
      closeWord(false);
      right = i === q.answer;
      first = st.tried.length === 0;
      if (st.tried.indexOf(i) === -1) { st.tried.push(i); }
      if (right) { st.solved = true; } else { lastMiss = i; }
      for (i = 0; i < buttons.length; i++) { paintOption(i); }
      paintFeedback(true);
      reveal(fb);
      opts.onPick(right, first);
    }

    function wire(b, i) {
      b.addEventListener("click", function () { pick(i); });
      b.addEventListener("keydown", function (e) {
        var k = e.key || "", to = -1;
        if (k === "ArrowDown" || k === "ArrowRight" || k === "Down" || k === "Right") { to = (i + 1) % buttons.length; }
        if (k === "ArrowUp" || k === "ArrowLeft" || k === "Up" || k === "Left") { to = (i + buttons.length - 1) % buttons.length; }
        if (to !== -1) {
          e.preventDefault();
          focusOn(buttons[to]);
        }
      });
    }

    for (i = 0; i < options.length; i++) {
      buttons.push(button("", "quiz-opt"));
      wire(buttons[i], i);
      box.appendChild(buttons[i]);
      paintOption(i);
    }
    field.appendChild(box);
    wrap.appendChild(field);
    wrap.appendChild(fb);
    paintFeedback(false);

    return {
      node: wrap,
      lines: function () {
        var out = [q.q], j;
        for (j = 0; j < options.length; j++) { out.push(options[j] + "."); }
        if (st.solved) { out.push(TEXT.right + " " + (q.why || "")); } else if (st.tried.length) { out.push(TEXT.notQuite + " " + (q.again || "")); }
        return out;
      }
    };
  }

  /* ==================================================================== */
  /* The lesson player                                                    */
  /* ==================================================================== */

  /* The quick-check questions that are asked. A look-back to a lesson that was set aside is
     left out, so nothing on the card names a lesson the learner chose not to open. */
  function quizFor(L) {
    var all = list(L.data.quiz), out = [], i;
    for (i = 0; i < all.length; i++) {
      if (all[i] && all[i].lookBack && G.isSetAside(all[i].lookBack)) { continue; }
      out.push(all[i]);
    }
    return out;
  }

  function cardsFor(L) {
    var steps = list(L.data.steps), quiz = quizFor(L), out = [], i;
    for (i = 0; i < steps.length; i++) {
      if (steps[i] && steps[i].type) { out.push({ kind: steps[i].type, step: steps[i] }); }
    }
    for (i = 0; i < quiz.length; i++) { out.push({ kind: "q", qi: i, q: quiz[i], count: quiz.length }); }
    out.push({ kind: "reward" });
    out.push({ kind: "deeper" });
    return out;
  }

  function newRun(L) {
    var r = G.resume(), quiz = quizFor(L), i;
    run = { id: L.id, q: [], tried: [], missed: [], gate: !isHeadsUp(L), reported: false, rewarded: false, award: null, firstEver: false, quizBadges: [], news: null };
    for (i = 0; i < quiz.length; i++) {
      run.q.push(0);
      run.tried.push([]);
      run.missed.push(false);
    }
    if (r && r.lesson === L.id) {
      /* A bookmark means the lesson was started, so the heads-up card is not shown twice.
         The one exception: an unfinished lesson left on its first card shows it again. */
      if (r.card > 1 || G.has("lesson:" + L.id)) { run.gate = true; }
      if (list(r.q).length === run.q.length) {
        for (i = 0; i < run.q.length; i++) {
          run.q[i] = r.q[i] === 1 || r.q[i] === 2 ? r.q[i] : 0;
          run.missed[i] = r.q[i] === 2 || r.q[i] === 3;
        }
      }
    }
  }

  /* Kept with the bookmark: 0 not answered, 1 right on the first pick, 2 right after
     another pick, 3 picked but not yet right. */
  function quizMarks() {
    var out = [], i;
    for (i = 0; i < run.q.length; i++) { out.push(run.q[i] > 0 ? run.q[i] : (run.missed[i] ? 3 : 0)); }
    return out;
  }

  function saveResume(L, card, n) {
    var r = G.resume();
    if (card.kind === "reward" || card.kind === "deeper") {
      if (r && r.lesson === L.id) { G.resume(null); }
      return;
    }
    /* Re-reading a finished lesson never replaces the bookmark of an unfinished one. */
    if (G.has("lesson:" + L.id) && r && r.lesson !== L.id && LESSON[r.lesson] && !G.has("lesson:" + r.lesson)) { return; }
    G.resume({ lesson: L.id, card: n, q: quizMarks() });
  }

  /* Every question answered in this run: tell the engine once. A full score on first picks
     logs the quiet quiz marker there (0 points, no fanfare). */
  function reportQuiz(L) {
    var i, score = 0, res;
    if (run.reported) { return; }
    for (i = 0; i < run.q.length; i++) {
      if (run.q[i] === 0) { return; }
      if (run.q[i] === 1) { score += 1; }
    }
    run.reported = true;
    res = G.quizResult(L.id, score, run.q.length);
    if (res && list(res.newBadges).length) { run.quizBadges = res.newBadges; }
  }

  /* Reaching the reward card is what logs the lesson. It happens once per run.
     A heads-up lesson reports its quick check here, not on the last answer, so that any
     badge it brings is in the same batch as the lesson and is kept quiet with it. */
  function reachReward(L) {
    var before, news;
    if (run.rewarded) { return; }
    run.rewarded = true;
    if (isHeadsUp(L)) { reportQuiz(L); }
    before = G.count("lesson:");
    if (before === 0) { writeHeld(null); }      /* a fresh start never inherits old news */
    run.award = G.award("lesson:" + L.id);
    run.firstEver = run.award.awarded && before === 0;
    news = newsFrom(run.award, run.quizBadges);
    if (isHeadsUp(L)) {
      holdNews(news);           /* it waits for the next reward card */
      run.news = null;
    } else {
      run.news = takeHeld(news);
    }
  }

  /* Where "Next lesson" goes: the lesson after this one when it is open and not yet done,
     this world's check when it is ready, or else the learner's own next step. */
  function afterLesson(L) {
    var w = L.world, nxt = w.lessons[L.n] || null, wp, step;
    if (nxt && nxt.data && G.isUnlocked(nxt.id) && !G.isPassed(nxt.id)) {
      return { href: "#" + nxt.id, label: TEXT.nextLesson, small: nxt.title };
    }
    wp = G.worldProgress(w.id);
    if (!nxt && wp.bossReady && w.data && w.data.boss) {
      return { href: "#check-" + w.id, label: TEXT.nextCheck, small: w.bossTitle };
    }
    step = safeNext();
    if (step && step.type === "boss" && WORLD[step.world]) {
      return { href: "#check-" + step.world, label: TEXT.nextCheck, small: WORLD[step.world].bossTitle };
    }
    if (step && step.id && LESSON[step.id] && step.id !== L.id) {
      return { href: "#" + step.id, label: TEXT.nextLesson, small: LESSON[step.id].title };
    }
    return null;
  }

  /* Two equal buttons. Neither is styled as the better choice. */
  function choiceRow(first, second) {
    var row = el("div", "choice-row"), i, items = [first, second], a;
    for (i = 0; i < items.length; i++) {
      if (!items[i]) { continue; }
      a = linkTo("", items[i].href, "btn btn-plain choice-btn");
      a.appendChild(el("span", "choice-label", items[i].label));
      if (items[i].small) {
        a.appendChild(el("span", "sr-only", ": "));
        a.appendChild(el("span", "choice-small", items[i].small));
      }
      row.appendChild(a);
    }
    return row;
  }

  function lessonChoices(L) {
    var nxt = afterLesson(L);
    return choiceRow(nxt, { href: "#map", label: TEXT.enough, small: nxt ? TEXT.enoughSmall : "" });
  }

  function kicker(words, icon) {
    var p = el("p", "card-kicker");
    if (icon) { p.appendChild(pic(icon, 20)); }
    p.appendChild(txt(words));
    return p;
  }

  function ringWords(seconds) {
    if (seconds <= 35) { return { guide: TEXT.ringHalf, alt: TEXT.ringAltHalf }; }
    if (seconds <= 50) { return { guide: TEXT.ringMost, alt: TEXT.ringAltMost }; }
    return { guide: TEXT.ringOne, alt: TEXT.ringAltOne };
  }

  /* A soft ring that fills over the step's seconds. No numbers. It is only a guide. */
  function ringBlock(seconds) {
    var box = el("div", "ring-box"), words = ringWords(seconds), still = reducedMotion();
    var pic1 = svg("svg", { viewBox: "0 0 100 100", "class": "ring", role: "img", "aria-label": words.alt, focusable: "false" });
    var fill = svg("circle", { cx: 50, cy: 50, r: RING_R, "class": "ring-fill", transform: "rotate(-90 50 50)" });
    var side = el("div", "ring-side"), note = el("p", "ring-note", words.guide + TEXT.ringGuide), live = el("p", "ring-live"), btn, running = false;
    pic1.appendChild(svg("circle", { cx: 50, cy: 50, r: RING_R, "class": "ring-track" }));
    pic1.appendChild(fill);
    box.appendChild(pic1);
    side.appendChild(note);
    live.setAttribute("role", "status");
    live.setAttribute("aria-live", "polite");

    function label(s) {
      clear(btn);
      btn.appendChild(txt(s));
    }
    function reset() {
      stopRing();
      running = false;
      fill.setAttribute("class", "ring-fill");
    }
    if (!still) {
      btn = button(TEXT.ringStart, "btn btn-plain ring-btn");
      btn.addEventListener("click", function () {
        clear(live);
        if (running) {
          reset();
          label(TEXT.ringStart);
          return;
        }
        reset();
        running = true;
        label(TEXT.ringStop);
        fill.getBoundingClientRect();           /* let the reset take hold before the slow fill */
        fill.style.animationDuration = seconds + "s";
        fill.setAttribute("class", "ring-fill is-running");
        ringTimer = window.setTimeout(function () {
          ringTimer = null;
          running = false;
          label(TEXT.ringAgain);
          live.appendChild(txt(TEXT.ringFull));
        }, seconds * 1000);
      });
      side.appendChild(btn);
    }
    side.appendChild(live);
    box.appendChild(side);
    return box;
  }

  function wordCard(panel, step) {
    var h = markOld(el("h3", "card-h word-term", step.term), step.term), p;
    panel.appendChild(kicker(TEXT.newWord));
    panel.appendChild(h);
    if (step.old) {
      p = el("p", "word-say", TEXT.oldWord);
      p.appendChild(markOld(el("strong", "", step.old), step.old));
      p.appendChild(txt(". " + (step.say ? TEXT.sayIt + step.say : "")));
      panel.appendChild(p);
    } else if (step.say) {
      p = el("p", "word-say", TEXT.sayIt);
      p.appendChild(el("strong", "", step.say));
      panel.appendChild(p);
    }
    panel.appendChild(el("p", "card-kicker word-means-label", TEXT.means));
    panel.appendChild(fillOld(el("p", "word-means"), step.means));
    return {
      heading: h,
      lines: function () {
        return [TEXT.newWord + ": " + step.term + ".", step.old ? TEXT.oldWord + step.old + "." : "", step.means];
      }
    };
  }

  function stepText(step) {
    return isQuiet() && step.quietText ? step.quietText : step.text;
  }

  function rewardCard(panel, L) {
    var h = el("h3", "card-h can-now", L.data.canNow || TEXT.lessonDone), quiet = isQuiet(), node, lines = [TEXT.lessonDone + ".", L.data.canNow || ""];
    panel.className += " card-reward";
    panel.appendChild(kicker(TEXT.lessonDone, CHECK_ICON));
    panel.appendChild(h);
    if (!quiet) {
      node = pointsLine(run.award);
      if (node) {
        panel.appendChild(node);
        lines.push(pointsWord(run.award.xp) + ".");
      }
      if (run.firstEver) {
        panel.appendChild(el("p", "reward-note game-only", TEXT.firstReward));
        lines.push(TEXT.firstReward);
      }
      node = newsList(run.news);
      if (node) { panel.appendChild(node); }
    }
    if (G.lessonsToday() >= PLENTY) {
      panel.appendChild(el("p", "reward-plenty", TEXT.plenty));
      lines.push(TEXT.plenty);
    }
    panel.appendChild(lessonChoices(L));
    return { heading: h, lines: function () { return lines; } };
  }

  function linkSmallPrint(href) {
    var m = /^suttas\.html#(.+)$/.exec(href), card, page;
    if (m) {
      card = CFG.cards && CFG.cards[m[1]];
      return card ? { text: TEXT.inLibrary + card.title + " (" + card.ref + ")", ref: card.ref } : { text: TEXT.inLibrary + TEXT.libraryLabel, ref: "" };
    }
    page = String(href).split("#")[0];
    return { text: PAGE_NAMES[page] ? TEXT.inLibrary + PAGE_NAMES[page] : "", ref: "" };
  }

  function deeperLink(item) {
    var li = el("li", "deeper-item"), a = linkTo("", item.href, "deeper-link"), small = item.small || linkSmallPrint(item.href).text;
    a.appendChild(el("span", "deeper-label", item.label));
    if (small) {
      a.appendChild(el("span", "sr-only", ". "));
      a.appendChild(el("span", "deeper-small", small));
    }
    li.appendChild(a);
    return li;
  }

  function deeperCard(panel, L) {
    var h = el("h3", "card-h", TEXT.deeperTitle), links = list(L.data.deeper), ul = el("ul", "deeper-list"), i, ref = "", info, tog, id;
    var lines = [TEXT.deeperTitle + ".", TEXT.deeperHard], fold = null, mark;
    panel.appendChild(h);
    panel.appendChild(el("p", "", TEXT.deeperHard));
    for (i = 0; i < links.length; i++) {
      if (!links[i] || !links[i].href) { continue; }
      info = linkSmallPrint(links[i].href);
      if (!ref && info.ref) { ref = info.ref; }
      ul.appendChild(deeperLink(links[i]));
      lines.push(links[i].label + ".");
    }
    mark = el("p", "card-small", (ref || TEXT.shelfDefault) + TEXT.shelfMark);
    if (FOLD_WORLDS[L.world.id] === true) {
      /* The links and the line about shelf marks fold away together, so the line never
         explains a code that is not on screen. */
      id = nextId("deeper");
      fold = el("div", "deeper-fold");
      fold.id = id;
      fold.setAttribute("hidden", "");
      tog = button(TEXT.deeperToggle, "btn btn-plain deeper-toggle");
      tog.setAttribute("aria-expanded", "false");
      tog.setAttribute("aria-controls", id);
      tog.addEventListener("click", function () {
        var open = tog.getAttribute("aria-expanded") === "true";
        tog.setAttribute("aria-expanded", open ? "false" : "true");
        if (open) { fold.setAttribute("hidden", ""); } else { fold.removeAttribute("hidden"); }
      });
      panel.appendChild(tog);
      fold.appendChild(ul);
      fold.appendChild(mark);
      panel.appendChild(fold);
    } else {
      panel.appendChild(ul);
      panel.appendChild(mark);
    }
    lines.push((ref || TEXT.shelfDefault) + TEXT.shelfMark);
    panel.appendChild(lessonChoices(L));
    return { heading: h, lines: function () { return lines; } };
  }

  /* Builds one card. Returns { node, heading, solved } where node holds the panel and its buttons. */
  function buildCard(L, card, n, total) {
    var wrap = el("div", "card-wrap"), panel = el("section", "panel lesson-card card-" + card.kind);
    var taught = taughtBefore(L.pos), step = card.step, h, body, made = null, lines, speak, nav, back, next, deeper, st, block, title, sub;
    var hid = nextId("card");

    if (card.kind === "story" || card.kind === "example") {
      panel.appendChild(kicker(step.label || ""));
      h = el("h3", "card-h", step.title || step.label || "");
      panel.appendChild(h);
      body = el("div", "card-text");
      fillText(body, stepText(step), taught);
      panel.appendChild(body);
      lines = function () { return [(step.label || "") + ".", (step.title || "") + "."].concat(String(stepText(step)).split(/\n\s*\n/)); };
    } else if (card.kind === "idea") {
      h = el("h3", "card-h", TEXT.bigIdea);
      panel.appendChild(h);
      body = el("div", "card-text idea-text");
      fillText(body, stepText(step), taught);
      panel.appendChild(body);
      lines = function () { return [TEXT.bigIdea + "."].concat(String(stepText(step)).split(/\n\s*\n/)); };
    } else if (card.kind === "try") {
      h = el("h3", "card-h", TEXT.tryIt);
      panel.appendChild(h);
      body = el("div", "card-text");
      fillText(body, stepText(step), taught);
      panel.appendChild(body);
      panel.appendChild(ringBlock(step.seconds > 0 ? step.seconds : 45));
      lines = function () { return [TEXT.tryIt + "."].concat(String(stepText(step)).split(/\n\s*\n/)); };
    } else if (card.kind === "word") {
      made = wordCard(panel, step);
    } else if (card.kind === "q") {
      st = { tried: run.tried[card.qi], solved: run.q[card.qi] > 0 };
      title = card.q.lookBack ? TEXT.lookBack : TEXT.quick + (card.qi + 1) + TEXT.of + card.count;
      h = el("h3", "card-h quiz-h", title);
      panel.appendChild(h);
      if (card.q.lookBack && LESSON[card.q.lookBack]) {
        sub = el("p", "card-kicker quiz-from", TEXT.fromLesson + "“" + LESSON[card.q.lookBack].title + "”");
        panel.appendChild(sub);
      }
      block = questionBlock(card.q, st, {
        taught: taught,
        onPick: function (right, first) {
          if (!right) {
            run.missed[card.qi] = true;
            saveResume(L, card, n);
          }
          if (right) {
            run.q[card.qi] = first && !run.missed[card.qi] ? 1 : 2;
            if (!isHeadsUp(L)) { reportQuiz(L); }      /* a heads-up lesson reports at its reward card */
            saveResume(L, card, n);
            if (next) {
              next.removeAttribute("hidden");
              reveal(next);
              focusOn(next);
            }
          }
        }
      });
      panel.appendChild(block.node);
      lines = function () { return [title + "."].concat(block.lines()); };
    } else if (card.kind === "reward") {
      made = rewardCard(panel, L);
    } else if (card.kind === "deeper") {
      made = deeperCard(panel, L);
    } else {
      h = el("h3", "card-h", step && step.title ? step.title : L.title);
      panel.appendChild(h);
      body = el("div", "card-text");
      fillText(body, step ? stepText(step) : "", taught);
      panel.appendChild(body);
      lines = function () { return [String(step ? stepText(step) : "")]; };
    }
    if (made) {
      h = made.heading;
      lines = made.lines;
    }
    h.id = hid;
    panel.setAttribute("aria-labelledby", hid);

    speak = speakButton(lines);
    if (speak) { panel.appendChild(speak); }
    wrap.appendChild(panel);

    nav = el("div", "lesson-nav");
    if (n > 1) {
      back = button(TEXT.back, "btn btn-plain nav-back");
      back.addEventListener("click", function () { go(L.id + "/" + (n - 1)); });
      nav.appendChild(back);
    } else {
      nav.appendChild(el("span", "nav-gap"));
    }
    if (card.kind === "reward") {
      deeper = button(TEXT.goDeeper, "btn btn-link nav-deeper");
      deeper.addEventListener("click", function () { go(L.id + "/" + (n + 1)); });
      nav.appendChild(deeper);
    } else if (n < total) {
      next = button(TEXT.next, "btn btn-primary nav-next");
      next.addEventListener("click", function () { go(L.id + "/" + (n + 1)); });
      if (card.kind === "q" && !(run.q[card.qi] > 0)) { next.setAttribute("hidden", ""); }
      nav.appendChild(next);
    }
    wrap.appendChild(nav);
    return { node: wrap, heading: h };
  }

  function gateCard(L) {
    var wrap = el("div", "card-wrap"), panel = el("section", "panel lesson-card card-gate"), h = el("h3", "card-h", TEXT.headsUpTitle);
    var row = el("div", "choice-row"), start = button(TEXT.startLesson, "btn btn-plain choice-btn"), aside = button(TEXT.setAside, "btn btn-plain choice-btn");
    var done = G.has("lesson:" + L.id), text = (L.data && L.data.headsUp) || "", speak;
    panel.appendChild(h);
    panel.appendChild(el("p", "gate-text", text));
    start.addEventListener("click", function () {
      run.gate = true;
      renderLesson(true);
    });
    row.appendChild(start);
    if (done) {
      row.appendChild(linkTo(TEXT.toMap, "#map", "btn btn-plain choice-btn"));
    } else {
      aside.addEventListener("click", function () {
        G.skip(L.id);
        go("map");
      });
      row.appendChild(aside);
      panel.appendChild(el("p", "card-small", TEXT.asideHelp));
    }
    panel.appendChild(row);
    speak = speakButton(function () { return [TEXT.headsUpTitle + ".", text, done ? "" : TEXT.asideHelp]; });
    if (speak) { panel.appendChild(speak); }
    wrap.appendChild(panel);
    return { node: wrap, heading: h };
  }

  function largeToggle() {
    var b = button("", "btn btn-link top-setting no-print"), on = G.setting("large") === true;
    b.setAttribute("aria-pressed", on ? "true" : "false");
    b.appendChild(txt(TEXT.setLarge + ": " + (on ? TEXT.on : TEXT.off)));
    b.addEventListener("click", function () {
      var now = !(G.setting("large") === true);
      G.setting("large", now);
      b.setAttribute("aria-pressed", now ? "true" : "false");
      clear(b);
      b.appendChild(txt(TEXT.setLarge + ": " + (now ? TEXT.on : TEXT.off)));
    });
    return b;
  }

  function topBar(leaveWords) {
    var bar = el("div", "lesson-bar no-print");
    bar.appendChild(linkTo(leaveWords, "#map", "btn btn-link leave-btn"));
    bar.appendChild(largeToggle());
    return bar;
  }

  function dots(n, total) {
    var box = el("span", "card-dots"), i;
    box.setAttribute("aria-hidden", "true");
    for (i = 1; i <= total; i++) { box.appendChild(el("span", i < n ? "card-dot is-past" : (i === n ? "card-dot is-now" : "card-dot"))); }
    return box;
  }

  function lessonTop(L, n, total) {
    var top = el("div", "lesson-top"), head = el("div", "lesson-head"), words = el("div", "lesson-head-text"), count, row, aside;
    top.appendChild(topBar(TEXT.leave));
    /* A heads-up lesson can be set aside from any card until it is done, not only from its
       first screen. The reward card logs the lesson before this is drawn, so it is not shown there. */
    if (n > 0 && isHeadsUp(L) && !G.has("lesson:" + L.id)) {
      row = el("div", "lesson-bar lesson-aside no-print");
      aside = button(TEXT.setAside, "btn btn-link aside-btn");
      aside.addEventListener("click", function () {
        var r;
        G.skip(L.id);
        r = G.resume();
        if (r && r.lesson === L.id) { G.resume(null); }     /* set aside before, then opened again */
        go("map");
      });
      row.appendChild(aside);
      top.appendChild(row);
    }
    if (!G.canSave()) { top.appendChild(el("p", "lesson-note", TEXT.noSave)); }
    head.appendChild(pic(L.icon, 44, "lesson-icon"));
    words.appendChild(el("p", "lesson-kicker", TEXT.world + L.world.n + " · " + TEXT.lessonWord + L.n + TEXT.of + L.world.lessons.length));
    words.appendChild(el("h2", "lesson-title", L.title));
    head.appendChild(words);
    top.appendChild(head);
    if (n > 0) {
      count = el("p", "card-count");
      count.appendChild(el("span", "card-count-words", TEXT.card + n + TEXT.of + total));
      count.appendChild(dots(n, total));
      top.appendChild(count);
    }
    return top;
  }

  function renderLesson(focus) {
    var L = cur.lesson, n = cur.n, total = cur.cards.length, card = cur.cards[n - 1];
    var gate = !run.gate && n === 1, wrap = el("div", "lesson"), built;
    tidy();
    setFocusMode(true);
    /* While a heads-up lesson is on screen the page carries this mark, so that the shared
       toasts (js/site.js) can keep badge and title news out of it. */
    if (isHeadsUp(L)) { document.body.setAttribute("data-heads-up", ""); }
    if (!gate && card.kind === "reward") { reachReward(L); }
    clear(view);
    wrap.appendChild(lessonTop(L, gate ? 0 : n, total));
    built = gate ? gateCard(L) : buildCard(L, card, n, total);
    wrap.appendChild(built.node);
    view.appendChild(wrap);
    if (!gate) { saveResume(L, card, n); }
    lastQuiet = isQuiet();
    if (focus) {
      scrollToTop(wrap);
      focusOn(built.heading);
    }
  }

  function showLesson(L, n, first) {
    var same = !!cur && cur.type === "lesson" && cur.lesson === L && !!run && run.id === L.id;
    var cards, r, before, i;
    if (!L.data) {
      showNote(TEXT.unwrittenTitle, [TEXT.unwritten], false);
      return;
    }
    if (!G.isUnlocked(L.id)) {
      before = previousTitle(L);
      showNote(TEXT.stepTitle, [TEXT.lessonLater + before + endStop(before)], true);
      return;
    }
    /* A new run also starts when the questions to ask have changed under this one (a lesson
       was set aside or done in another tab), so cards and marks always line up. */
    if (!same || run.q.length !== quizFor(L).length) { newRun(L); }
    cards = cardsFor(L);
    if (!n) {
      r = G.resume();
      n = r && r.lesson === L.id && r.card >= 1 ? Math.floor(r.card) : 1;
      if (n > cards.length) { n = 1; }
      if (!replaceHash(L.id + "/" + n)) {
        window.location.replace("#" + L.id + "/" + n);
        return;
      }
    }
    if (n < 1) { n = 1; }
    if (n > cards.length) { n = cards.length; }
    /* A card number in the address cannot jump past a quick-check question that is still
       open, so the reward card of a lesson not yet done is only reached through its questions. */
    if (!G.has("lesson:" + L.id)) {
      for (i = 0; i < cards.length; i++) {
        if (cards[i].kind === "q" && !(run.q[cards[i].qi] > 0)) {
          if (n > i + 1) {
            n = i + 1;
            replaceHash(L.id + "/" + n);
          }
          break;
        }
      }
    }
    if (n > 1) { run.gate = true; }
    cur = { type: "lesson", lesson: L, cards: cards, n: n };
    renderLesson(true);
  }

  /* ==================================================================== */
  /* The world checks                                                     */
  /* ==================================================================== */

  function newCheck(w) {
    var qs = list(w.data.boss.questions), queue = [], i;
    for (i = 0; i < qs.length; i++) {
      if (!qs[i] || (qs[i].lesson && G.isSetAside(qs[i].lesson))) { continue; }   /* set-aside lessons are left out */
      queue.push({ q: qs[i], again: false });
    }
    chk = { world: w, queue: queue, total: queue.length, i: -1, st: null, missed: false, done: false, award: null, news: null };
  }

  function checkTop(w, words) {
    var top = el("div", "lesson-top"), head = el("div", "lesson-head"), text = el("div", "lesson-head-text");
    top.appendChild(topBar(TEXT.leaveCheck));
    head.appendChild(pic(w.icon, 52, "lesson-icon"));
    text.appendChild(el("p", "lesson-kicker", TEXT.world + w.n + ": " + w.title));
    text.appendChild(el("h2", "lesson-title", w.bossTitle));
    head.appendChild(text);
    top.appendChild(head);
    if (words) { top.appendChild(el("p", "card-count", words)); }
    return top;
  }

  function nextWorldOf(w) { return WORLDS[w.index + 1] || null; }

  function checkDoneCard(w) {
    var panel = el("section", "panel lesson-card card-reward"), h = el("h3", "card-h can-now", TEXT.checkComplete), quiet = isQuiet();
    var nxt = nextWorldOf(w), node, box, first;
    panel.appendChild(kicker(TEXT.world + w.n + ": " + w.title, CHECK_ICON));
    panel.appendChild(h);
    panel.appendChild(el("p", "", TEXT.finished + TEXT.world + w.n + ": " + w.title + endStop(w.title)));
    if (!quiet) {
      node = pointsLine(chk.award);
      if (node) { panel.appendChild(node); }
      node = newsList(chk.news);
      if (node) { panel.appendChild(node); }
    }
    if (nxt) {
      box = el("div", "preview");
      box.appendChild(pic(nxt.icon, 64, "preview-emblem"));
      node = el("div", "preview-text");
      node.appendChild(el("p", "card-kicker", TEXT.nextComes));
      node.appendChild(el("p", "preview-title", TEXT.world + nxt.n + ": " + (QUESTION[nxt.id] || nxt.title)));
      if (nxt.tagline) { node.appendChild(el("p", "preview-tagline", nxt.tagline)); }
      box.appendChild(node);
      panel.appendChild(box);
      if (w.id === "w1" || w.id === "w2") { panel.appendChild(el("p", "", TEXT.goodNews)); }
      if (w.id === "w0") { panel.appendChild(el("p", "card-small game-only", TEXT.tenTitles)); }
      first = nxt.lessons[0];
      panel.appendChild(choiceRow(
        first && nxt.data ? { href: "#" + first.id, label: TEXT.startWorld + nxt.n, small: first.title } : null,
        { href: "#map", label: TEXT.enough, small: TEXT.enoughSmall }
      ));
    }
    return { node: panel, heading: h };
  }

  function finishCheck() {
    var w = chk.world;
    chk.done = true;
    chk.award = G.award("boss:" + w.id);
    chk.news = takeHeld(newsFrom(chk.award, []));
    renderCheck(true);
  }

  function renderCheck(focus) {
    var w = chk.world, wrap = el("div", "lesson"), panel, h, item, block, nav, next, built, words, hid = nextId("card"), speak, lines;
    tidy();
    setFocusMode(true);
    clear(view);
    lastQuiet = isQuiet();

    if (chk.done) {
      built = checkDoneCard(w);
      if (!nextWorldOf(w)) {
        showComplete(built.node, false, w);
        return;
      }
      wrap.appendChild(checkTop(w, ""));
      wrap.appendChild(built.node);
      view.appendChild(wrap);
      if (focus) {
        scrollToTop(wrap);
        focusOn(built.heading);
      }
      return;
    }

    panel = el("section", "panel lesson-card");
    if (chk.i < 0) {
      wrap.appendChild(checkTop(w, ""));
      h = el("h3", "card-h", w.bossTitle);
      panel.appendChild(h);
      fillText(panel, (w.data.boss.intro || ""), null);
      lines = function () { return [w.bossTitle + ".", w.data.boss.intro || ""]; };
      nav = el("div", "lesson-nav");
      nav.appendChild(el("span", "nav-gap"));
      next = button(TEXT.startCheck, "btn btn-primary nav-next");
      next.addEventListener("click", function () {
        chk.i = 0;
        chk.st = null;
        if (!chk.queue.length) { finishCheck(); } else { renderCheck(true); }
      });
      nav.appendChild(next);
    } else {
      item = chk.queue[chk.i];
      if (!chk.st) {
        chk.st = { tried: [], solved: false };
        chk.missed = false;
      }
      words = item.again ? TEXT.oneMore : TEXT.question + (chk.i + 1) + TEXT.of + chk.total;
      wrap.appendChild(checkTop(w, ""));
      h = el("h3", "card-h quiz-h", words);
      panel.appendChild(h);
      nav = el("div", "lesson-nav");
      nav.appendChild(el("span", "nav-gap"));
      next = button(TEXT.next, "btn btn-primary nav-next");
      if (!chk.st.solved) { next.setAttribute("hidden", ""); }
      next.addEventListener("click", function () {
        chk.i += 1;
        chk.st = null;
        if (chk.i >= chk.queue.length) { finishCheck(); } else { renderCheck(true); }
      });
      nav.appendChild(next);
      block = questionBlock(item.q, chk.st, {
        taught: taughtBefore(w.lessons.length ? w.lessons[w.lessons.length - 1].pos + 1 : 0),
        onPick: function (right) {
          if (!right && !chk.missed) {
            chk.missed = true;
            if (!item.again) { chk.queue.push({ q: item.q, again: true }); }   /* it comes round once more */
          }
          if (right) {
            next.removeAttribute("hidden");
            reveal(next);
            focusOn(next);
          }
        },
        missExtra: function () {
          var L = item.q.lesson ? LESSON[item.q.lesson] : null, p;
          if (!L) { return null; }
          p = el("p", "fb-link");
          p.appendChild(linkTo(TEXT.seeLesson + L.title, "#" + L.id + "/1", "btn btn-link"));
          return p;
        }
      });
      panel.appendChild(block.node);
      lines = function () { return [words + "."].concat(block.lines()); };
    }
    h.id = hid;
    panel.setAttribute("aria-labelledby", hid);
    speak = speakButton(lines);
    if (speak) { panel.appendChild(speak); }
    wrap.appendChild(panel);
    wrap.appendChild(nav);
    view.appendChild(wrap);
    if (focus) {
      scrollToTop(wrap);
      focusOn(h);
    }
  }

  function showCheck(w, first) {
    var wp = G.worldProgress(w.id);
    if (!w.data || !w.data.boss || !list(w.data.boss.questions).length) {
      showNote(TEXT.unwrittenTitle, [TEXT.unwritten], false);
      return;
    }
    if (!wp.complete && !wp.bossDone && G.setting("openAll") !== true) {
      showNote(TEXT.stepTitle, [TEXT.checkLater], false);
      return;
    }
    /* A check that was left part-way (to read a lesson again, say) carries on where it was. */
    if (!(chk && chk.world === w && !chk.done)) { newCheck(w); }
    cur = { type: "check", world: w };
    renderCheck(true);
  }

  /* ==================================================================== */
  /* Trail complete                                                       */
  /* ==================================================================== */

  /* The first Guided Study unit that still has an open box. 0 when every box is ticked. */
  function nextUnit() {
    var study = CFG.study && typeof CFG.study === "object" ? CFG.study : {}, k, m;
    for (k in study) {
      if (!Object.prototype.hasOwnProperty.call(study, k) || G.studyChecked(k)) { continue; }
      m = /^u(\d+)-/.exec(k);
      if (m) { return parseInt(m[1], 10); }
    }
    return 0;
  }

  function suggestions() {
    var out = [], i, j, links, m, card = null, topic = null, id, cards = CFG.cards || {}, unit = 0;
    for (i = 0; i < ORDER.length; i++) {
      links = ORDER[i].data ? list(ORDER[i].data.deeper) : [];
      for (j = 0; j < links.length; j++) {
        if (!links[j] || !links[j].href) { continue; }
        m = /^suttas\.html#(.+)$/.exec(links[j].href);
        if (m && !card && GENTLE_CARDS.indexOf(m[1]) === -1 && !G.has("sutta:" + m[1])) { card = links[j]; }
        m = /^themes\.html#(.+)$/.exec(links[j].href);
        if (m && !topic && GENTLE_TOPICS.indexOf(m[1]) === -1 && !G.has("theme:" + m[1])) { topic = links[j]; }
      }
    }
    if (!card) {
      for (id in cards) {
        if (Object.prototype.hasOwnProperty.call(cards, id) && GENTLE_CARDS.indexOf(id) === -1 && !G.has("sutta:" + id)) {
          card = { label: cards[id].title, href: "suttas.html#" + id };
          break;
        }
      }
    }
    out.push(card || { label: TEXT.libraryLabel, href: "suttas.html", small: TEXT.librarySmall });
    try { unit = nextUnit(); } catch (e) { unit = 0; }
    out.push({ label: unit ? TEXT.studyUnit + unit : TEXT.studyLabel, href: "study.html", small: TEXT.studySmall });
    out.push(topic || { label: TEXT.topicsLabel, href: "themes.html", small: TEXT.topicsSmall });
    return out;
  }

  /* "above" is the "Check complete" card when the learner has only just finished the last check. */
  function showComplete(above, first, w) {
    var wrap = el("div", "lesson complete"), panel = el("section", "panel panel-gold lesson-card"), h = el("h2", "card-h complete-title", TEXT.doneTitle);
    var ul, items, i, left, rank, focusTarget = h;
    tidy();
    cur = { type: "complete" };
    setFocusMode(true);
    clear(view);
    wrap.appendChild(above && w ? checkTop(w, "") : topBarOnly());
    if (above) {
      wrap.appendChild(above);
      focusTarget = above.querySelector(".card-h") || h;
    }
    panel.appendChild(kicker(TEXT.doneKicker, CHECK_ICON));
    panel.appendChild(h);
    panel.appendChild(el("p", "", TEXT.completeLede));
    panel.appendChild(el("h3", "complete-sub", TEXT.chooseTitle));
    panel.appendChild(el("p", "", TEXT.chooseLede));
    ul = el("ul", "deeper-list");
    items = suggestions();
    for (i = 0; i < items.length; i++) { ul.appendChild(deeperLink(items[i])); }
    panel.appendChild(ul);
    rank = G.rank();
    if (rank && rank.next && !isQuiet()) { panel.appendChild(el("p", "card-small game-only", TEXT.lampKeeper)); }
    wrap.appendChild(panel);

    left = el("section", "panel lesson-card left-out");
    left.appendChild(el("h3", "complete-sub", TEXT.leftTitle));
    left.appendChild(el("p", "", TEXT.leftLede));
    ul = el("ul", "deeper-list");
    for (i = 0; i < LEFT_OUT.length; i++) { ul.appendChild(deeperLink(LEFT_OUT[i])); }
    left.appendChild(ul);
    left.appendChild(el("p", "card-small", TEXT.deeperHard));
    wrap.appendChild(left);

    wrap.appendChild(el("div", "lesson-nav"));
    wrap.lastChild.appendChild(linkTo(TEXT.toMap, "#map", "btn btn-plain"));
    view.appendChild(wrap);
    lastQuiet = isQuiet();
    if (!first || above) { scrollToTop(wrap); }
    focusOn(focusTarget);
  }

  function topBarOnly() {
    var top = el("div", "lesson-top");
    top.appendChild(topBar(TEXT.toMap));
    return top;
  }

  /* ==================================================================== */
  /* Start                                                                */
  /* ==================================================================== */

  if (!G || typeof G.nextStep !== "function" || typeof G.award !== "function") {
    view.appendChild(el("p", "panel", TEXT.noGame));
    view.lastChild.appendChild(linkTo(TEXT.noGameLink, "study.html", ""));
    view.lastChild.appendChild(txt("."));
    return;
  }

  buildIndex();
  lastQuiet = isQuiet();
  /* News is only ever held after a lesson. With no lesson done (a first visit, or after
     "Start over") anything still in that key is left over, and is dropped. */
  if (G.count("lesson:") === 0) { writeHeld(null); }

  /* Progress or a setting changed, here or in another tab. */
  G.on("change", function () {
    var quiet = isQuiet();
    if (routing || !cur) { return; }
    if (cur.type === "map") {
      renderMap();
    } else if (quiet !== lastQuiet) {
      /* Quiet Mode swaps a card's wording, so the card on screen is drawn again. */
      if (cur.type === "lesson") { renderLesson(false); }
      if (cur.type === "check" && chk) { renderCheck(false); }
    }
    lastQuiet = quiet;
  });

  window.addEventListener("hashchange", function () { route(false); });

  document.addEventListener("keydown", function (e) {
    var k = e.key || "";
    if ((k === "Escape" || k === "Esc") && openWord) {
      e.preventDefault();
      closeWord(true);
    }
  });

  /* Reading stops when the page is left. It never starts by itself. */
  window.addEventListener("pagehide", stopSpeech);

  route(true);
})();

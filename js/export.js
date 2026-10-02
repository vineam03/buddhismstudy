/* Compiles the whole site into one printable document.
   Static pages are fetched and their <main> content inlined;
   the data-driven parts (the Trail, the glossary, suttas, vinaya) are rendered fully expanded.
   The Trail and the glossary come first, then the seven library parts.
   Nothing here logs an activity, and no game control (button, strip, toast) is drawn:
   this file only reads data. Each data part is skipped quietly if its data is missing. */
(function () {
  "use strict";

  var root = document.getElementById("book-root");
  var status = document.getElementById("build-status");

  var PAGES = [
    { url: "curriculum.html", id: "part-1", title: "Part I — The Four-Stage Curriculum" },
    { url: "study.html", id: "part-2", title: "Part II — Guided Study Sequence" },
    { url: "canon.html", id: "part-3", title: "Part III — The Canon, Cover to Cover" },
    { url: "themes.html", id: "part-5", title: "Part V — Modern Life Topics" },
    { url: "journey.html", id: "part-6", title: "Part VI — Journey to the West" }
  ];

  /* Words for the two beginner parts. Plain, short sentences (docs/game-spec.json, writingRules). */
  var TEXT = {
    trailTitle: "The Trail: ",
    trailTitleEnd: " short lessons",
    trailIntro: "The Trail is where a beginner starts. Each lesson has a short story, one big idea, " +
      "an everyday example and something to try. On the website each lesson also has three short questions.",
    world: "World ",
    lesson: "Lesson ",
    idea: "The big idea",
    tryIt: "Try it now",
    word: "New word",
    say: "say: ",
    old: "old word: ",
    glossTitle: "Plain-English Glossary",
    glossIntro: " words from the Trail and the library, each with a plain meaning.",
    plainHead: "In plain words",
    contents: "What is inside"
  };

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function isArray(v) {
    return Object.prototype.toString.call(v) === "[object Array]";
  }

  function text(v) {
    return typeof v === "string" ? v : "";
  }

  function sectionHeader(title, id) {
    return '<h2 class="part-head"' + (id ? ' id="' + esc(id) + '"' : "") + ">" + esc(title) + "</h2>";
  }

  function subHeader(title) {
    return '<h3 class="part-sub">' + esc(title) + "</h3>";
  }

  /* Plain text to paragraphs. A blank line starts a new paragraph. */
  function paras(s) {
    var bits = text(s).split(/\n\s*\n/), html = "", i, p;
    for (i = 0; i < bits.length; i++) {
      p = bits[i].replace(/^\s+|\s+$/g, "");
      if (p) { html += "<p>" + esc(p) + "</p>"; }
    }
    return html;
  }

  /* A small picture beside a heading. It has a fixed size and is hidden if it cannot load. */
  function picture(src, size) {
    if (!text(src)) { return ""; }
    return '<img class="icon-img" src="' + esc(src) + '" width="' + size + '" height="' + size +
      '" alt="" onerror="this.style.display=\'none\'">';
  }

  /* ---------- the Trail ---------- */

  function trailWorlds() {
    var all = isArray(window.TRAIL) ? window.TRAIL.slice() : [];
    all = all.filter(function (w) { return w && typeof w === "object" && isArray(w.lessons); });
    all.sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
    return all;
  }

  function trailLessonCount() {
    var n = 0;
    trailWorlds().forEach(function (w) { n += w.lessons.length; });
    return n;
  }

  /* Old-language words carry lang="pi". The glossary knows which terms those are. */
  function isOldWord(term) {
    var list = isArray(window.GLOSSARY) ? window.GLOSSARY : [], i;
    for (i = 0; i < list.length; i++) {
      if (list[i] && list[i].term === term) { return list[i].lang === "pi"; }
    }
    return false;
  }

  function termHtml(term, old) {
    return "<strong" + (old ? ' lang="pi"' : "") + ">" + esc(term) + "</strong>";
  }

  /* "(say: MET-tah)" or "(old word: metta, say: MET-tah)", or nothing. */
  function sayHtml(say, old) {
    var bits = [];
    if (text(old)) { bits.push(TEXT.old + '<span lang="pi">' + esc(old) + "</span>"); }
    if (text(say)) { bits.push(TEXT.say + esc(say)); }
    return bits.length ? ' <span class="say">(' + bits.join(", ") + ")</span>" : "";
  }

  function stepLabel(label, title) {
    return '<h5><span class="step-label">' + esc(label) + "</span>" +
      (text(title) ? ' <span class="step-title">' + esc(title) + "</span>" : "") + "</h5>";
  }

  function stepBlock(step, quiet) {
    var body;
    if (!step || typeof step !== "object") { return ""; }
    /* With Quiet Mode on, a step that talks about points uses its other wording. */
    body = quiet && text(step.quietText) ? step.quietText : step.text;
    if (step.type === "story" || step.type === "example") {
      return '<div class="trail-step">' + stepLabel(text(step.label) || "Story", step.title) + paras(body) + "</div>";
    }
    if (step.type === "idea") {
      return '<div class="trail-step trail-idea">' + stepLabel(TEXT.idea) + paras(body) + "</div>";
    }
    if (step.type === "try") {
      return '<div class="trail-step">' + stepLabel(TEXT.tryIt) + paras(body) + "</div>";
    }
    if (step.type === "word" && text(step.term)) {
      return '<div class="trail-step trail-word">' + stepLabel(TEXT.word) +
        "<p>" + termHtml(step.term, isOldWord(step.term)) + sayHtml(step.say, step.old) + "</p>" +
        paras(step.means) + "</div>";
    }
    return "";
  }

  function lessonBlock(lesson, n, quiet) {
    var steps = isArray(lesson.steps) ? lesson.steps : [];
    return '<article class="trail-lesson">' +
      '<h4 class="trail-lesson-head">' + picture(lesson.icon, 32) +
      "<span>" + TEXT.lesson + n + ": " + esc(text(lesson.title)) + "</span></h4>" +
      (text(lesson.headsUp) ? '<div class="trail-step trail-note">' + paras(lesson.headsUp) + "</div>" : "") +
      steps.map(function (s) { return stepBlock(s, quiet); }).join("") +
      (text(lesson.canNow) ? '<p class="trail-cannow">' + esc(lesson.canNow) + "</p>" : "") +
      "</article>";
  }

  function worldBlock(w, quiet) {
    var n = 0;
    return '<section class="trail-world">' +
      '<div class="trail-world-head">' + picture(w.icon, 56) +
      "<div><h3>" + (typeof w.order === "number" ? TEXT.world + w.order + ": " : "") + esc(text(w.title)) + "</h3>" +
      (text(w.tagline) ? '<p class="trail-tagline">' + esc(w.tagline) + "</p>" : "") + "</div></div>" +
      (text(w.intro) ? '<div class="trail-world-intro">' + paras(w.intro) + "</div>" : "") +
      w.lessons.map(function (l) {
        if (!l || typeof l !== "object") { return ""; }
        n += 1;
        return lessonBlock(l, n, quiet);
      }).join("") +
      "</section>";
  }

  function renderTrail() {
    var worlds = trailWorlds(), total = trailLessonCount(), quiet = false;
    if (!worlds.length || !total) { return ""; }
    try {
      quiet = !!window.Game && typeof window.Game.setting === "function" && window.Game.setting("quiet") === true;
    } catch (e) { quiet = false; }
    return sectionHeader(TEXT.trailTitle + total + TEXT.trailTitleEnd, "part-trail") +
      '<p class="trail-book-intro">' + TEXT.trailIntro + "</p>" +
      worlds.map(function (w) { return worldBlock(w, quiet); }).join("");
  }

  /* ---------- the glossary ---------- */

  function glossaryList() {
    var list = isArray(window.GLOSSARY) ? window.GLOSSARY : [];
    list = list.filter(function (g) { return g && typeof g === "object" && text(g.term); });
    list.sort(function (a, b) {
      var x = a.term.toLowerCase(), y = b.term.toLowerCase();
      return x < y ? -1 : (x > y ? 1 : 0);
    });
    return list;
  }

  function renderGlossary() {
    var list = glossaryList();
    if (!list.length) { return ""; }
    return sectionHeader(TEXT.glossTitle, "part-glossary") +
      '<p class="trail-book-intro">' + list.length + TEXT.glossIntro + "</p>" +
      '<dl class="gloss-list">' +
      list.map(function (g) {
        return '<div class="gloss-item"><dt>' + termHtml(g.term, g.lang === "pi") + sayHtml(g.say, g.old) +
          (text(g.kind) ? ' <span class="gloss-kind">' + esc(g.kind) + "</span>" : "") + "</dt>" +
          "<dd>" + (text(g.plain) ? "<p>" + esc(g.plain) + "</p>" : "") +
          (text(g.more) ? '<p class="gloss-more">' + esc(g.more) + "</p>" : "") + "</dd></div>";
      }).join("") + "</dl>";
  }

  /* ---------- suttas and vinaya ---------- */

  function plainBlock(id) {
    var all = window.SUTTA_EASY, e = all && Object.prototype.hasOwnProperty.call(all, id) ? all[id] : null;
    if (!e || typeof e !== "object" || !text(e.plain)) { return ""; }
    return '<div class="plain-words"><h4>' + TEXT.plainHead + "</h4><p>" + esc(e.plain) + "</p></div>";
  }

  /* True when at least one sutta card has its plain-words line loaded. */
  function hasPlainWords() {
    return (window.SUTTAS || []).some(function (s) { return plainBlock(s.id) !== ""; });
  }

  function suttaBlock(s) {
    var hist = (window.SUTTA_HISTORY || {})[s.id];
    return '<details class="rule" open><summary><span class="rule-num">' + esc(s.ref) +
      '</span><span class="rule-title">' + esc(s.title) +
      (s.pali ? ' <span class="pali">· ' + esc(s.pali) + "</span>" : "") + "</span></summary>" +
      '<div class="rule-body">' + plainBlock(s.id) + "<h4>The gist</h4><p>" + esc(s.gist) + "</p>" +
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
    var html = sectionHeader("Part IV — The Sutta Library (" + (window.SUTTAS || []).length + " cards)", "part-4");
    cats.forEach(function (c) {
      var list = (window.SUTTAS || []).filter(function (s) { return s.cat === c.key; });
      if (!list.length) return;
      html += subHeader(c.name) + list.map(suttaBlock).join("");
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
    var html = sectionHeader("Part VII — The 227 Pātimokkha Rules with Origin Stories", "part-7");
    cats.forEach(function (c) {
      var list = (window.VINAYA || []).filter(function (r) { return r.cat === c.key; });
      if (!list.length) return;
      html += subHeader(c.name) + list.map(ruleBlock).join("");
    });
    return html;
  }

  /* ---------- the static pages ---------- */

  function missingPart(page) {
    return {
      ok: false,
      html: sectionHeader(page.title, page.id) +
        '<p class="part-missing">This part could not be added here. That happens when the site is ' +
        'opened from a folder on this computer and not from a web address. You can print it from <a href="' +
        page.url + '">its own page</a>.</p>'
    };
  }

  function fetchMain(page) {
    return fetch(page.url).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.text();
    }).then(function (html) {
      var doc = new DOMParser().parseFromString(html, "text/html");
      var main = doc.querySelector("main");
      if (!main) return { ok: true, html: "" };
      /* Page controls and every game element stay out of the book. */
      main.querySelectorAll(".controls, .no-print, script, style, noscript, input, button, " +
        ".game-only, .hud, .award-btn, .toast-region, .points").forEach(function (el) { el.remove(); });
      return { ok: true, html: sectionHeader(page.title, page.id) + main.innerHTML };
    }).catch(function () {
      return missingPart(page);
    });
  }

  /* ---------- putting the book together ---------- */

  /* One part that cannot be drawn must never stop the others. */
  function safePart(fn) {
    try { return fn() || ""; } catch (e) { return ""; }
  }

  function contentsList(items) {
    var html = '<div class="book-contents"><p class="contents-head">' + TEXT.contents + "</p><ol>";
    items.forEach(function (it) {
      html += '<li><a href="#' + esc(it.id) + '">' + esc(it.title) + "</a></li>";
    });
    return html + "</ol></div>";
  }

  function assemble(parts) {
    var lessons = trailLessonCount();
    var words = glossaryList().length;
    var nSuttas = (window.SUTTAS || []).length;
    var nRules = (window.VINAYA || []).length;
    var trail = safePart(renderTrail);
    var gloss = safePart(renderGlossary);
    var loaded = parts.filter(function (p) { return p.ok; }).length;
    var contents = [];
    var line = [];
    var ready = [];
    var cover;

    if (trail) {
      contents.push({ id: "part-trail", title: TEXT.trailTitle + lessons + TEXT.trailTitleEnd });
      line.push("The Trail: " + lessons + " short lessons for beginners");
      ready.push(lessons + " Trail lessons");
    }
    if (gloss) {
      contents.push({ id: "part-glossary", title: TEXT.glossTitle });
      line.push("a plain-English glossary of " + words + " words");
      ready.push(words + " glossary words");
    }
    contents.push({ id: "part-1", title: PAGES[0].title }, { id: "part-2", title: PAGES[1].title },
      { id: "part-3", title: PAGES[2].title },
      { id: "part-4", title: "Part IV — The Sutta Library (" + nSuttas + " cards)" },
      { id: "part-5", title: PAGES[3].title }, { id: "part-6", title: PAGES[4].title },
      { id: "part-7", title: "Part VII — The 227 Pātimokkha Rules with Origin Stories" });
    line.push("a four-stage curriculum", "the complete canon in contemporary English",
      nSuttas + " sutta study guides with " + (hasPlainWords() ? "plain-words summaries and " : "") +
      "historical context",
      "the " + nRules + " Pātimokkha rules and their origin stories",
      "modern life topics", "the Journey to the West allegory");
    line[0] = line[0].charAt(0).toUpperCase() + line[0].slice(1);
    ready.push(nSuttas + " sutta cards", nRules + " rules");

    cover =
      '<div class="book-cover">' +
      '<div class="cover-wheel" aria-hidden="true">☸</div>' +
      '<p class="cover-title">Buddhism Study</p>' +
      '<p class="dim">' + esc(line.join(" · ")) + "</p>" +
      '<p class="dim">Compiled ' + esc(new Date().toLocaleDateString()) + "</p>" +
      contentsList(contents) + "</div>";

    root.innerHTML = cover +
      trail + gloss +
      parts[0].html + parts[1].html + parts[2].html +
      safePart(renderSuttas) +
      parts[3].html + parts[4].html +
      safePart(renderVinaya);

    if (status) {
      status.textContent = "Ready. In place: " + ready.join(", ") + " and " + loaded + " of " +
        parts.length + " other parts." +
        (loaded < parts.length ? " The other parts are added when this page is opened from a web address." : "");
    }
  }

  if (typeof window.fetch === "function" && typeof window.Promise === "function") {
    Promise.all(PAGES.map(fetchMain)).then(assemble);
  } else {
    assemble(PAGES.map(missingPart));
  }

  window.addEventListener("beforeprint", function () {
    document.querySelectorAll("details").forEach(function (d) { d.open = true; });
  });
})();

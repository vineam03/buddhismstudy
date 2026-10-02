/* Validates all game data against docs/GAME_CONTRACT.md and docs/game-spec.json.
   Usage:
     node tools/validate.js               everything (missing files are errors)
     node tools/validate.js trail w1      one world file
     node tools/validate.js trail         all world files
     node tools/validate.js easy [cat]    sutta easy data (cat: dn mn1 mn2 sn an kn)
     node tools/validate.js glossary
     node tools/validate.js svg [folder]  graphics (folder: icons worlds ranks badges brand)
     node tools/validate.js svgfile <path> [viewBox]   lint one SVG
   Exit code 1 if any error is found. */
"use strict";
var fs = require("fs");
var path = require("path");
var vm = require("vm");

var root = path.join(__dirname, "..");
function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function read(rel) { return fs.readFileSync(path.join(root, rel), "utf8"); }

var spec = JSON.parse(read("docs/game-spec.json"));
var errors = [];
var warnings = [];
function err(where, msg) { errors.push(where + ": " + msg); }
function warn(where, msg) { warnings.push(where + ": " + msg); }

function runFiles(files) {
  var win = {};
  var sandbox = { window: win, console: console };
  sandbox.global = sandbox;
  var ctx = vm.createContext(sandbox);
  files.forEach(function (f) {
    try { vm.runInContext(read(f), ctx, { filename: f }); }
    catch (e) { err(f, "does not run: " + e.message); }
  });
  if (sandbox.GAME_CONFIG && !win.GAME_CONFIG) win.GAME_CONFIG = sandbox.GAME_CONFIG;
  return win;
}

var CONFIG = exists("js/data/game-config.js") ? runFiles(["js/data/game-config.js"]).GAME_CONFIG : null;
if (!CONFIG) { console.log("ERROR js/data/game-config.js missing: run node tools/build-config.js"); process.exit(1); }

/* ---------- text helpers ---------- */
function words(s) { return String(s || "").trim().split(/\s+/).filter(Boolean).length; }
function sentences(s) {
  return String(s || "").split(/(?<=[.!?…])[”’)]*\s+|\n+/).map(function (x) { return x.trim(); }).filter(Boolean);
}
var BANNED = /\b(simply|obviously|of course|easy|as everyone knows|you must|you should|buddhists believe)\b/i;
var HARSH = /\b(wrong|incorrect|fail|failed)\b/i;
function checkText(where, s, max, min, optional) {
  if (typeof s !== "string" || !s.trim()) { if (!optional) err(where, "missing or empty text"); return; }
  if (/<[a-zA-Z\/][^>]*>/.test(s)) err(where, "contains an HTML tag");
  if (/\*\*|__|^#+\s/m.test(s)) err(where, "contains Markdown");
  if (s.indexOf('"') !== -1) err(where, "contains a straight double quote; use curly quotes");
  var n = words(s);
  if (max && n > max) err(where, "too long: " + n + " words (max " + max + ")");
  if (min && n < min) err(where, "too short: " + n + " words (min " + min + ")");
  var b = BANNED.exec(s);
  if (b) err(where, "uses a banned word or phrase: “" + b[0] + "”");
}

var SUTTA_IDS = Object.keys(CONFIG.cards);
var THEME_IDS = [];
(read("themes.html").match(/<section class="canon-book" id="([a-z]+)"/g) || []).forEach(function (m) {
  THEME_IDS.push(/id="([a-z]+)"/.exec(m)[1]);
});
var SHELF_MARK = /\b(MN|SN|DN|AN|Snp|Ud|Iti|Dhp|Khp|Thag|Thig|Mil)\s?\d/;

function checkHref(where, href) {
  var m;
  if ((m = /^suttas\.html#(.+)$/.exec(href))) {
    if (SUTTA_IDS.indexOf(m[1]) === -1) err(where, "link to unknown library card: " + href);
  } else if (/^curriculum\.html#stage[1-4]$/.test(href)) {
    /* ok */
  } else if ((m = /^themes\.html#(.+)$/.exec(href))) {
    if (THEME_IDS.indexOf(m[1]) === -1) err(where, "link to unknown Modern Life section: " + href);
  } else if (["journey.html", "vinaya.html", "canon.html", "study.html", "glossary.html",
    "curriculum.html", "themes.html", "suttas.html"].indexOf(href) === -1) {
    err(where, "link target not allowed: " + href);
  }
}

function checkQuestion(where, q, nOptions) {
  if (!q || typeof q !== "object") { err(where, "missing question"); return; }
  checkText(where + ".q", q.q, 32);
  if (!Array.isArray(q.options) || q.options.length !== (nOptions || 3)) {
    err(where, "needs exactly " + (nOptions || 3) + " options");
    return;
  }
  q.options.forEach(function (o, i) { checkText(where + ".options[" + i + "]", o, 14); });
  var seen = {};
  q.options.forEach(function (o) {
    var k = String(o).trim().toLowerCase();
    if (seen[k]) err(where, "duplicate option: " + o);
    seen[k] = true;
    if (/\b(all|none) of the above\b/i.test(o)) err(where, "no “all/none of the above” options");
  });
  if (typeof q.answer !== "number" || q.answer % 1 !== 0 || q.answer < 0 || q.answer >= q.options.length) {
    err(where, "answer index out of range");
  }
  checkText(where + ".why", q.why, 32);
  checkText(where + ".again", q.again, 32);
  [["why", q.why], ["again", q.again]].forEach(function (p) {
    var h = HARSH.exec(p[1] || "");
    if (h) err(where + "." + p[0], "feedback must not say “" + h[0] + "”");
  });
  if (/\bwhich (one )?is not\b/i.test(q.q || "")) err(where, "no “which is NOT” questions");
  if (typeof q.answer === "number" && q.options[q.answer]) {
    var right = words(q.options[q.answer]);
    var maxOther = Math.max.apply(null, q.options.filter(function (o, i) { return i !== q.answer; }).map(words));
    if (right > maxOther * 2 + 2) warn(where, "right answer is much longer than the others (gives it away)");
  }
}

/* ---------- trail ---------- */
function trailOrder() {
  var out = [];
  CONFIG.worlds.forEach(function (w) { w.lessons.forEach(function (l) { out.push(l.id); }); });
  return out;
}
function validateTrail(only) {
  var order = trailOrder();
  var iconNames = spec.icons.map(function (i) { return i.name; });
  var specWorlds = spec.worlds.slice().sort(function (a, b) { return a.order - b.order; });
  specWorlds.forEach(function (sw) {
    if (only && sw.id !== only) return;
    var file = "js/data/trail-" + sw.id + ".js";
    if (!exists(file)) { err(file, "file is missing"); return; }
    var win = runFiles([file]);
    var list = win.TRAIL || [];
    if (list.length !== 1) { err(file, "must push exactly one world onto window.TRAIL"); return; }
    var w = list[0];
    var W = file;
    if (w.id !== sw.id) err(W, "id should be " + sw.id);
    if (w.order !== sw.order) err(W, "order should be " + sw.order);
    if (w.title !== sw.title) err(W, "title should be exactly: " + sw.title);
    if (w.stage !== sw.stage) err(W, "stage should be " + sw.stage);
    if (w.icon !== "img/worlds/" + sw.id + ".svg") err(W, "icon should be img/worlds/" + sw.id + ".svg");
    checkText(W + ".tagline", w.tagline, 24);
    checkText(W + ".goal", w.goal, 45);
    checkText(W + ".intro", w.intro, 60);
    if (!Array.isArray(w.lessons) || w.lessons.length !== sw.lessons.length) {
      err(W, "should have " + sw.lessons.length + " lessons");
      return;
    }
    w.lessons.forEach(function (l, i) {
      var sl = sw.lessons[i];
      var L = file + " " + sl.id;
      if (l.id !== sl.id) err(L, "id should be " + sl.id + " (got " + l.id + ")");
      if (l.title !== sl.title) err(L, "title should be exactly: " + sl.title);
      if (l.icon !== "img/icons/" + sl.icon + ".svg") err(L, "icon should be img/icons/" + sl.icon + ".svg");
      if (iconNames.indexOf(sl.icon) === -1) err(L, "spec icon not in icon list: " + sl.icon);
      if (typeof l.minutes !== "number" || l.minutes < 2 || l.minutes > 6) err(L, "minutes should be 2 to 6");
      checkText(L + ".objective", l.objective, 50);
      checkText(L + ".canNow", l.canNow, 25);
      if (typeof l.canNow === "string" && l.canNow.indexOf("You can now") !== 0) err(L, "canNow must start with “You can now”");

      var isHeadsUp = CONFIG.headsUp.indexOf(sl.id) !== -1;
      if (isHeadsUp) checkText(L + ".headsUp", l.headsUp, 30);
      else if (l.headsUp) err(L, "headsUp is only for " + CONFIG.headsUp.join(", "));

      var steps = l.steps || [];
      var types = steps.map(function (s) { return s.type; });
      var base = ["story", "idea", "example", "try"];
      var word = CONFIG.words.filter(function (x) { return x.lesson === sl.id; })[0];
      var expected = word ? base.concat(["word"]) : base;
      if (types.join(",") !== expected.join(",")) {
        err(L, "steps should be [" + expected.join(", ") + "] but are [" + types.join(", ") + "]");
      }
      var allText = [];
      steps.forEach(function (s) {
        var S = L + " step:" + s.type;
        checkText(S + ".quietText", s.quietText, 100, 0, true);
        if (s.type === "story") {
          if (["An old story", "The Buddha said", "Our example"].indexOf(s.label) === -1) err(S, "label must be “An old story”, “The Buddha said” or “Our example”");
          checkText(S + ".title", s.title, 10); checkText(S, s.text, 100, 40); allText.push(s.text);
        } else if (s.type === "idea") {
          checkText(S, s.text, 45); allText.push(s.text);
          if (sentences(s.text).length > 3) err(S, "the big idea is at most 3 sentences");
        } else if (s.type === "example") {
          if (["Our example", "An old story", "The Buddha said"].indexOf(s.label) === -1) err(S, "label must be “Our example” (or an old-story label)");
          checkText(S + ".title", s.title, 10); checkText(S, s.text, 70, 25); allText.push(s.text);
        } else if (s.type === "try") {
          checkText(S, s.text, 60, 15); allText.push(s.text);
          if (typeof s.seconds !== "number" || s.seconds < 20 || s.seconds > 60) err(S, "seconds should be 20 to 60");
        } else if (s.type === "word" && word) {
          if (String(s.term).toLowerCase() !== word.term.toLowerCase()) err(S, "term should be “" + word.term + "” (got “" + s.term + "”)");
          if ((s.say || "") !== word.say) err(S, "say should be “" + word.say + "” (got “" + (s.say || "") + "”)");
          if ((s.old || "") !== word.old) err(S, "old should be “" + word.old + "” (got “" + (s.old || "") + "”)");
          checkText(S + ".means", s.means, 40);
        }
      });
      var sents = allText.reduce(function (a, t) { return a.concat(sentences(t)); }, []);
      if (sents.length) {
        var total = sents.reduce(function (n, s) { return n + words(s); }, 0);
        var avg = total / sents.length;
        if (avg > 13) err(L, "average sentence length " + avg.toFixed(1) + " words (max 13)");
        sents.forEach(function (s) {
          if (words(s) > 22) err(L, "sentence over 22 words: “" + s.slice(0, 80) + "…”");
        });
      }

      if (!Array.isArray(l.quiz) || l.quiz.length !== 3) err(L, "quiz must have exactly 3 questions");
      else {
        l.quiz.forEach(function (q, qi) { checkQuestion(L + " quiz[" + qi + "]", q, 3); });
        var pos = l.quiz.map(function (q) { return q.answer; });
        if (pos[0] === pos[1] && pos[1] === pos[2]) err(L, "right answer is in the same position for all 3 questions");
        var idx = order.indexOf(sl.id);
        var lb = l.quiz[2] && l.quiz[2].lookBack;
        if (idx === 0) {
          if (lb) err(L, "the first lesson has no look-back question");
        } else {
          var allowed = order.slice(Math.max(0, idx - 2), idx);
          if (allowed.indexOf(lb) === -1) err(L, "quiz[2].lookBack must be one of " + allowed.join(", ") + " (got " + lb + ")");
        }
        if ((l.quiz[0] && l.quiz[0].lookBack) || (l.quiz[1] && l.quiz[1].lookBack)) err(L, "only the third question is a look back");
      }
      if (!Array.isArray(l.deeper) || l.deeper.length < 1 || l.deeper.length > 3) err(L, "deeper needs 1 to 3 links");
      else {
        var hitsSource = false;
        l.deeper.forEach(function (d, di) {
          checkText(L + " deeper[" + di + "].label", d.label, 14);
          if (SHELF_MARK.test(d.label || "")) err(L + " deeper[" + di + "]", "label must not contain a shelf mark");
          checkHref(L + " deeper[" + di + "]", d.href);
          sl.sources.forEach(function (s) { if (d.href === "suttas.html#" + s) hitsSource = true; });
        });
        if (!hitsSource) err(L, "at least one deeper link must go to a source card: " + sl.sources.join(", "));
      }
    });

    if (!w.boss || !Array.isArray(w.boss.questions) || w.boss.questions.length !== 5) {
      err(W, "boss must have exactly 5 questions");
    } else {
      if (w.boss.title !== sw.bossTitle) err(W, "boss.title should be exactly: " + sw.bossTitle);
      checkText(W + " boss.intro", w.boss.intro, 40);
      var wanted = sw.lessons.map(function (l) { return l.id; }).filter(function (id) { return CONFIG.noBossQuestion.indexOf(id) === -1; });
      var got = [];
      w.boss.questions.forEach(function (q, qi) {
        checkQuestion(W + " boss[" + qi + "]", q, 3);
        got.push(q.lesson);
      });
      if (got.slice().sort().join(",") !== wanted.slice().sort().join(",")) {
        err(W, "boss questions must cover exactly these lessons, once each: " + wanted.join(", ") + " (got " + got.join(", ") + ")");
      }
      var counts = {};
      w.boss.questions.forEach(function (q) { counts[q.answer] = (counts[q.answer] || 0) + 1; });
      Object.keys(counts).forEach(function (k) {
        if (counts[k] >= 4) err(W, "boss: right answer is in position " + k + " for " + counts[k] + " of 5 questions");
      });
    }
  });
}

/* ---------- sutta easy ---------- */
function validateEasy(only) {
  ["dn", "mn1", "mn2", "sn", "an", "kn"].forEach(function (c) {
    if (only && c !== only) return;
    var file = "js/data/suttas-easy-" + c + ".js";
    if (!exists(file)) { err(file, "file is missing"); return; }
    var easy = runFiles([file]).SUTTA_EASY || {};
    var ids = (runFiles(["js/data/suttas-" + c + ".js"]).SUTTAS || []).map(function (s) { return s.id; });
    ids.forEach(function (id) {
      var e = easy[id];
      var E = file + " " + id;
      if (!e) { err(E, "no entry for this card"); return; }
      checkText(E + ".plain", e.plain, 40, 10);
      sentences(e.plain).forEach(function (s) { if (words(s) > 22) err(E, "plain: sentence over 22 words"); });
      checkQuestion(E, e, 3);
    });
    Object.keys(easy).forEach(function (id) {
      if (ids.indexOf(id) === -1) err(file, "entry for a card that is not in suttas-" + c + ".js: " + id);
    });
    var pos = {};
    ids.forEach(function (id) { if (easy[id]) pos[easy[id].answer] = (pos[easy[id].answer] || 0) + 1; });
    Object.keys(pos).forEach(function (k) {
      if (ids.length >= 6 && pos[k] > ids.length * 0.55) err(file, "right answer is in position " + k + " for most questions");
    });
  });
}

/* ---------- glossary ---------- */
function validateGlossary() {
  var file = "js/data/glossary.js";
  if (!exists(file)) { err(file, "file is missing"); return; }
  var list = runFiles([file]).GLOSSARY;
  if (!Array.isArray(list) || list.length < 45) { err(file, "window.GLOSSARY should be an array of at least 45 terms"); return; }
  var KINDS = ["Trail word", "What the library calls it", "Library word", "Person", "Place or thing"];
  var seen = {};
  var lessons = trailOrder();
  list.forEach(function (g, i) {
    var G = file + " [" + i + "] " + (g && g.id);
    if (!g || !/^[a-z0-9-]+$/.test(g.id || "")) { err(G, "id must be lowercase ASCII (a-z, 0-9, -)"); return; }
    if (seen[g.id]) err(G, "duplicate id");
    seen[g.id] = g;
    checkText(G + ".term", g.term, 6);
    checkText(G + ".say", g.say, 8, 0, true);
    if (KINDS.indexOf(g.kind) === -1) err(G, "kind must be one of: " + KINDS.join(" | "));
    checkText(G + ".plain", g.plain, 25);
    checkText(G + ".more", g.more, 60);
    if (g.lang && g.lang !== "pi") err(G, "lang may only be “pi”");
    if (g.lesson && lessons.indexOf(g.lesson) === -1) err(G, "unknown lesson: " + g.lesson);
    if (g.card && SUTTA_IDS.indexOf(g.card) === -1) err(G, "unknown card: " + g.card);
  });
  CONFIG.words.forEach(function (wd) {
    var hit = list.filter(function (g) { return String(g.term).toLowerCase() === wd.term.toLowerCase(); })[0];
    if (!hit) { err(file, "missing the Trail word “" + wd.term + "” (" + wd.lesson + ")"); return; }
    if ((hit.say || "") !== wd.say && !wd.old) err(file, "“" + wd.term + "” say should be “" + wd.say + "” (got “" + (hit.say || "") + "”)");
    if (hit.kind !== "Trail word") err(file, "“" + wd.term + "” kind should be “Trail word”");
    if (hit.lesson !== wd.lesson) err(file, "“" + wd.term + "” lesson should be " + wd.lesson);
  });
}

/* ---------- svg ---------- */
var PALETTE = ["#ffd700", "#e6b422", "#b8860b", "#ff8c00", "#e67e22", "#f3e5c0", "#2b2012", "#1a1208"];
function lintSvg(rel, viewBox, maxBytes) {
  if (!exists(rel)) { err(rel, "file is missing"); return; }
  var s = read(rel);
  var bytes = Buffer.byteLength(s, "utf8");
  if (bytes > maxBytes) err(rel, "too large: " + bytes + " bytes (max " + maxBytes + ")");
  if (!/^\s*<svg[\s>]/.test(s.replace(/^﻿/, "").replace(/^<\?xml[^>]*\?>\s*/, ""))) err(rel, "must start with <svg");
  if (s.indexOf('xmlns="http://www.w3.org/2000/svg"') === -1) err(rel, "missing xmlns");
  var vb = /viewBox="([^"]+)"/.exec(s);
  if (!vb) err(rel, "missing viewBox");
  else if (viewBox && vb[1].trim() !== viewBox) err(rel, "viewBox should be " + viewBox + " (got " + vb[1] + ")");
  if (!/role="img"/.test(s)) err(rel, "missing role=\"img\"");
  if (!/<title>[^<]+<\/title>/.test(s)) err(rel, "missing <title>");
  ["text", "script", "image", "foreignObject", "style", "use"].forEach(function (t) {
    if (new RegExp("<" + t + "[\\s>]").test(s)) err(rel, "must not contain <" + t + ">");
  });
  if (/href\s*=\s*"(?!#)/.test(s)) err(rel, "must not reference external resources");
  (s.match(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g) || []).forEach(function (c) {
    if (PALETTE.indexOf(c.toLowerCase()) === -1 && !new RegExp('id="' + c.slice(1) + '"').test(s) && !/url\(/.test(c)) {
      if (!new RegExp("url\\(" + c + "\\)").test(s)) err(rel, "colour outside the palette: " + c);
    }
  });
  (s.match(/(?:fill|stroke|stop-color)="([a-zA-Z]+)"/g) || []).forEach(function (a) {
    var v = /"([a-zA-Z]+)"/.exec(a)[1];
    if (["none", "currentColor"].indexOf(v) === -1) err(rel, "named colour not allowed: " + v);
  });
  var stack = [];
  var re = /<\/?([a-zA-Z][\w:-]*)((?:"[^"]*"|[^>"])*)>/g, m;
  var body = s.replace(/<\?xml[^>]*\?>/, "").replace(/<!--[\s\S]*?-->/g, "");
  while ((m = re.exec(body))) {
    var closing = m[0].charAt(1) === "/";
    var selfClose = /\/\s*$/.test(m[2]);
    if (closing) {
      if (stack.pop() !== m[1]) { err(rel, "mismatched closing tag </" + m[1] + ">"); break; }
    } else if (!selfClose) stack.push(m[1]);
  }
  if (stack.length) err(rel, "unclosed element(s): " + stack.join(", "));
}
function validateSvg(only) {
  var sets = {
    icons: function () { spec.icons.forEach(function (i) { lintSvg("img/icons/" + i.name + ".svg", "0 0 64 64", 5000); }); },
    worlds: function () { spec.worlds.forEach(function (w) { lintSvg("img/worlds/" + w.id + ".svg", "0 0 96 96", 5000); }); },
    ranks: function () { spec.ranks.forEach(function (r) { lintSvg("img/ranks/" + r.id + ".svg", "0 0 96 96", 5000); }); },
    badges: function () { spec.badges.forEach(function (b) { lintSvg("img/badges/" + b.id + ".svg", "0 0 64 64", 5000); }); },
    brand: function () {
      ["wheel", "lotus", "path-tile", "check", "book"].forEach(function (n) { lintSvg("img/brand/" + n + ".svg", "0 0 64 64", 5000); });
      lintSvg("img/brand/hero.svg", "0 0 800 320", 12000);
      if (!exists("img/LICENSE.md")) err("img/LICENSE.md", "file is missing");
    }
  };
  Object.keys(sets).forEach(function (k) { if (!only || only === k) sets[k](); });
}

/* ---------- spec sanity ---------- */
function validateSpec() {
  var ids = {};
  var icons = spec.icons.map(function (i) { return i.name; });
  spec.worlds.forEach(function (w) {
    w.lessons.forEach(function (l) {
      if (ids[l.id]) err("spec", "duplicate lesson id " + l.id);
      ids[l.id] = true;
      if (!new RegExp("^w" + w.order + "-l\\d+$").test(l.id)) err("spec", "lesson id " + l.id + " does not match world order " + w.order);
      if (icons.indexOf(l.icon) === -1) err("spec", l.id + " icon not in icon list: " + l.icon);
      l.sources.forEach(function (s) { if (SUTTA_IDS.indexOf(s) === -1) err("spec", l.id + " unknown source " + s); });
    });
  });
  var episodes = (read("journey.html").match(/<h3>\d+\.\s/g) || []).length;
  spec.badges.forEach(function (b) {
    if (b.id === "whole-shelf" && b.ruleN !== SUTTA_IDS.length) err("spec", "whole-shelf should need " + SUTTA_IDS.length + " cards");
    if (b.id === "all-the-way-west" && b.ruleN !== episodes) err("spec", "all-the-way-west should need " + episodes + " episodes");
    if (b.id === "zero-to-hero" && b.ruleN !== spec.worlds.length) err("spec", "zero-to-hero should need " + spec.worlds.length + " checks");
  });
}

/* ---------- main ---------- */
var mode = process.argv[2] || "all";
var arg = process.argv[3];
if (mode === "svgfile") {
  lintSvg(arg, process.argv[4] || null, arg.indexOf("hero") !== -1 ? 12000 : 5000);
} else {
  validateSpec();
  if (mode === "all" || mode === "trail") validateTrail(arg);
  if (mode === "all" || mode === "easy") validateEasy(arg);
  if (mode === "all" || mode === "glossary") validateGlossary();
  if (mode === "all" || mode === "svg") validateSvg(arg);
}

warnings.forEach(function (w) { console.log("WARN  " + w); });
errors.forEach(function (e) { console.log("ERROR " + e); });
console.log((errors.length ? "FAILED" : "OK") + ": " + errors.length + " error(s), " + warnings.length + " warning(s).");
process.exit(errors.length ? 1 : 0);

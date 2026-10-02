/* Unit tests for the game engine (js/game.js). Plain Node, no test framework.
   Usage: node tools/test-game.js
   Prints one line per test (PASS or FAIL and the test's name) and exits 1 if any test fails.
   Every test starts from Game.reset() with an empty fake localStorage and a fixed clock. */
"use strict";
var path = require("path");

var ROOT = path.join(__dirname, "..");
var CONFIG_PATH = path.join(ROOT, "js", "data", "game-config.js");
var GAME_PATH = path.join(ROOT, "js", "game.js");
var KEY = "buddhismstudy-game-v1";
var OLD_KEY = "buddhismstudy-progress";

/* ---------- a fake localStorage ---------- */

function makeStorage(seed) {
  var data = {};
  var k;
  var store = {
    getItem: function (key) { return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null; },
    setItem: function (key, value) { data[key] = String(value); },
    removeItem: function (key) { delete data[key]; },
    clear: function () { data = {}; },
    keys: function () { return Object.keys(data); }
  };
  if (seed) { for (k in seed) { if (Object.prototype.hasOwnProperty.call(seed, k)) { data[k] = String(seed[k]); } } }
  return store;
}

function useStorage(store) {
  Object.defineProperty(global, "localStorage", { value: store, configurable: true, writable: true, enumerable: true });
}

function removeStorage() { delete global.localStorage; }

/* ---------- a clock the tests control ---------- */

var clock = 0;
function at(dayOffset, hour, minute) {
  return new Date(2026, 9, 1 + dayOffset, hour === undefined ? 12 : hour, minute || 0, 0, 0).getTime();
}
function setDay(dayOffset) { clock = at(dayOffset); }
function dayName(dayOffset) {
  var d = new Date(at(dayOffset));
  function two(n) { return (n < 10 ? "0" : "") + n; }
  return d.getFullYear() + "-" + two(d.getMonth() + 1) + "-" + two(d.getDate());
}
function fakeNow() { return clock; }

/* ---------- loading ---------- */

useStorage(makeStorage());
require(CONFIG_PATH);
var C = global.GAME_CONFIG;
var Game = require(GAME_PATH);
var REAL_NOW = Game._now;

/* Loads a second, separate copy of the engine, the way a new page load would. */
function loadGame(keepRealClock) {
  var G;
  delete require.cache[require.resolve(GAME_PATH)];
  G = require(GAME_PATH);
  if (!keepRealClock) { G._now = fakeNow; }
  return G;
}

/* ---------- tiny test kit ---------- */

var results = { run: 0, failed: 0 };
var cleanups = [];

function check(cond, msg) { if (!cond) { throw new Error(msg || "check was false"); } }

function same(actual, expected, msg) {
  var a = JSON.stringify(actual), e = JSON.stringify(expected);
  if (a !== e) { throw new Error((msg ? msg + ": " : "") + "got " + a + ", wanted " + e); }
}

function listen(G, event, fn) { cleanups.push(G.on(event, fn)); }

function test(name, fn) {
  var i;
  results.run += 1;
  useStorage(makeStorage());
  setDay(0);
  Game._now = fakeNow;
  Game.reset();
  try {
    fn();
    console.log("PASS " + name);
  } catch (e) {
    results.failed += 1;
    console.log("FAIL " + name + ": " + (e && e.message ? e.message : e));
  }
  for (i = 0; i < cleanups.length; i++) { try { cleanups[i](); } catch (e2) { /* ignore */ } }
  cleanups = [];
  delete global.window;
}

/* ---------- helpers that play the Trail ---------- */

var LAST_RANK = C.ranks[C.ranks.length - 1];

function allLessons() {
  var out = [];
  C.worlds.forEach(function (w) { w.lessons.forEach(function (l) { out.push(l.id); }); });
  return out;
}

function doLessons(G, world, except) {
  world.lessons.forEach(function (l) {
    if (except && except.indexOf(l.id) !== -1) { return; }
    G.award("lesson:" + l.id);
  });
}

function doWorld(G, world) {
  doLessons(G, world);
  G.award("boss:" + world.id);
}

function badge(G, id) {
  return G.badges().filter(function (b) { return b.id === id; })[0];
}

function ids(list) { return list.map(function (b) { return b.id; }); }

function stored() {
  var raw = global.localStorage.getItem(KEY);
  return raw === null ? null : JSON.parse(raw);
}

/* =====================================================================
   The tests
   ===================================================================== */

test("config is loaded and has what the engine needs", function () {
  check(C && C.ranks.length === 10, "10 titles");
  check(C.worlds.length === 8, "8 worlds");
  check(allLessons().length === 46, "46 lessons");
  check(C.caps.xp === LAST_RANK.minXp, "caps.xp is the last title's threshold");
  check(C.caps.rules === 50 && C.caps.daily === 30, "rule and daily caps");
});

test("API: every call in the contract table exists", function () {
  ["award", "has", "count", "xp", "ranks", "rank", "badges", "streak", "lessonsToday", "skip",
    "isSetAside", "isPassed", "isUnlocked", "worldProgress", "nextStep", "trailDone", "quizResult",
    "studyTick", "studyChecked", "setting", "resume", "name", "setName", "on", "today", "canSave",
    "exportData", "importData", "reset", "_now"].forEach(function (n) {
    check(typeof Game[n] === "function", "Game." + n + " is missing");
  });
});

test("Node: exported as a module, with no window and no document", function () {
  check(typeof window === "undefined" && typeof document === "undefined", "no DOM here");
  check(require(GAME_PATH) === Game, "module.exports is Game");
  check(global.Game === Game, "global.Game is set when there is no window");
});

test("browser-like: reads window.GAME_CONFIG and sets window.Game", function () {
  var G;
  global.window = { GAME_CONFIG: C };
  G = loadGame();
  check(global.window.Game === G, "window.Game");
  check(G.award("lesson:w0-l1").xp === 30, "config was read from window");
  delete global.window;
  loadGame();
});

test("fresh state: nothing done, first title, first step is w0-l1", function () {
  same(Game.xp(), 0);
  same(Game.count(""), 0);
  same(Game.rank().id, C.ranks[0].id);
  same(Game.badges().filter(function (b) { return b.earned; }).length, 0);
  same(Game.streak(), { current: 0, best: 0, activeToday: false, daysSince: null, total: 0 });
  same(Game.nextStep(), { type: "lesson", id: "w0-l1", world: "w0" });
  same(Game.resume(), null);
  same(Game.name(), "");
  same(Game.lessonsToday(), 0);
  same(Game.trailDone(), false);
  same(Game.canSave(), true);
  same(stored(), null, "nothing is written before the learner does something");
});

test("award: return shape of a first award", function () {
  var r = Game.award("lesson:w0-l1");
  same(r.awarded, true);
  same(r.xp, 30);
  same(ids(r.newBadges), ["first-step"]);
  same(r.rankUp, null);
  check(Game.has("lesson:w0-l1"), "logged");
  same(stored().done["lesson:w0-l1"], { xp: 30, t: clock }, "saved shape");
  same(stored().v, 1);
});

test("award: logging the same id twice does nothing", function () {
  var before, r;
  Game.award("lesson:w0-l1");
  before = Game.exportData();
  setDay(1);
  r = Game.award("lesson:w0-l1");
  same(r, { awarded: false, xp: 0, newBadges: [], rankUp: null });
  same(Game.exportData(), before, "state unchanged");
  same(Game.xp(), 30);
  same(Game.streak().total, 1, "no new day recorded");
  r = Game.award("lesson:w0-l1", 500);
  same(r.awarded, false);
  same(Game.xp(), 30);
});

test("award: default points for every kind in the config", function () {
  var want = { lesson: 30, quiz: 0, boss: 50, sutta: 10, suttaq: 5, rule: 2, study: 0, jw: 10, theme: 10, gloss: 2, daily: 5, skip: 0 };
  same(Object.keys(C.xp).sort(), Object.keys(want).sort(), "kinds in config");
  Object.keys(want).forEach(function (kind) {
    var r;
    Game.reset();
    r = Game.award(kind + ":sample");
    same(r.awarded, true, kind);
    same(r.xp, want[kind], kind + " points");
    same(r.xp, C.xp[kind], kind + " matches config");
    same(Game.xp(), want[kind], kind + " total");
  });
});

test("award: kind is the text before the first colon; unknown kinds pay 0", function () {
  same(Game.award("sutta:a:b:c").xp, 10, "first colon only");
  same(Game.award("mystery:1").xp, 0, "unknown kind");
  same(Game.award("nocolon").xp, 0, "no colon");
  same(Game.award("lessons:w0-l1").xp, 0, "near miss is unknown");
  check(Game.has("mystery:1") && Game.has("nocolon"), "still logged");
  same(Game.xp(), 10);
});

test("award: an explicit number overrides the default and is tidied", function () {
  same(Game.award("sutta:a", 7).xp, 7);
  same(Game.award("mystery:a", 12).xp, 12, "unknown kind with a number");
  same(Game.award("sutta:b", -50).xp, 0, "never negative");
  same(Game.award("sutta:c", 2.9).xp, 2, "whole points");
  same(Game.award("sutta:d", NaN).xp, 10, "not a number: default");
  same(Game.award("sutta:e", "99").xp, 10, "text is not a number: default");
  same(Game.xp(), 7 + 12 + 0 + 2 + 10 + 10);
});

test("award: bad ids are refused without throwing", function () {
  var bad = [undefined, null, "", 42, {}, [], true, "__proto__", new Array(400).join("x")];
  bad.forEach(function (id) {
    same(Game.award(id), { awarded: false, xp: 0, newBadges: [], rankUp: null }, String(id).slice(0, 12));
    same(Game.has(id), false);
  });
  same(Game.count(""), 0);
});

test("award: ids that look like built-in property names are safe", function () {
  same(Game.has("constructor"), false);
  same(Game.has("toString"), false);
  same(Game.award("constructor:1").xp, 0, "kind 'constructor' has no points");
  same(Game.award("toString").awarded, true);
  same(Game.has("toString"), true);
  same(Game.isUnlocked("constructor"), false);
  same(Game.isPassed("hasOwnProperty"), false);
  same(Game.studyChecked("constructor"), false);
  same(Game.worldProgress("toString").total, 0);
  same(Game.setting("__proto__"), undefined);
  same(Game.setting("constructor"), undefined);
});

test("has and count", function () {
  Game.award("sutta:dhp");
  Game.award("sutta:mn10");
  Game.award("suttaq:dhp");
  Game.award("rule:pacittiya-51");
  same(Game.has("sutta:dhp"), true);
  same(Game.has("sutta:dn1"), false);
  same(Game.count("sutta:"), 2, "sutta: does not count suttaq:");
  same(Game.count("suttaq:"), 1);
  same(Game.count("rule:"), 1);
  same(Game.count("jw:"), 0);
  same(Game.count("study:"), 1, "dhp is the only card of box u1-5, so that box got its marker");
  same(Game.count(""), 5);
  same(Game.count(), 5);
});

test("cap: rule stories pay for the first 50 only, and are still logged", function () {
  var i, r;
  for (i = 1; i <= C.caps.rules; i++) {
    r = Game.award("rule:pacittiya-" + i);
    same(r.xp, 2, "story " + i);
  }
  same(Game.xp(), 100);
  r = Game.award("rule:sekhiya-1");
  same(r.awarded, true, "story 51 is logged");
  same(r.xp, 0, "story 51 pays nothing");
  r = Game.award("rule:sekhiya-2", 2);
  same(r.xp, 0, "an explicit number does not get round the cap");
  same(Game.count("rule:"), 52);
  same(Game.xp(), 100);
  same(stored().done["rule:sekhiya-1"].xp, 0);
});

test("cap: One Quiet Minute pays for the first 30 days only", function () {
  var i, r;
  for (i = 0; i < C.caps.daily; i++) {
    setDay(i);
    r = Game.award("daily:" + Game.today());
    same(r.xp, 5, "day " + (i + 1));
  }
  same(Game.xp(), 150);
  setDay(30);
  r = Game.award("daily:" + Game.today());
  same(r.awarded, true);
  same(r.xp, 0, "day 31 pays nothing");
  same(Game.count("daily:"), 31);
  same(Game.xp(), 150);
});

test("cap: total points never pass caps.xp; the award is trimmed, later ones pay 0", function () {
  var top = C.caps.xp, r;
  Game.award("test:big", top - 10);
  same(Game.xp(), top - 10);
  r = Game.award("lesson:w0-l1");
  same(r.awarded, true);
  same(r.xp, 10, "trimmed to fit");
  same(Game.xp(), top);
  r = Game.award("sutta:dhp");
  same(r.awarded, true, "still logged");
  same(r.xp, 0, "pays nothing at the cap");
  same(ids(r.newBadges), ["library-card"], "badges still arrive at the cap");
  r = Game.award("boss:w0", 5000);
  same(r.xp, 0);
  same(Game.xp(), top);
  same(Game.count(""), 5, "four awards and the 0-point marker of the dhp box");
  same(stored().xp, top);
});

test("cap: one huge award stops at caps.xp and gives the last title", function () {
  var r = Game.award("test:huge", 99999999);
  same(r.xp, C.caps.xp);
  same(Game.xp(), C.caps.xp);
  same(r.rankUp.id, LAST_RANK.id);
  same(Game.rank().id, LAST_RANK.id);
  same(Game.rank().next, null);
  same(Game.rank().toNext, 0);
  same(Game.rank().pct, 100);
});

test("rank: boundaries for every title threshold", function () {
  C.ranks.forEach(function (rank, i) {
    var r, info;
    if (i === 0) { return; }
    Game.reset();
    r = Game.award("test:a", rank.minXp - 1);
    info = Game.rank();
    same(info.id, C.ranks[i - 1].id, "one point below " + rank.name);
    same(info.index, i - 1);
    same(info.toNext, 1, "one point to go for " + rank.name);
    same(info.next, { name: rank.name, minXp: rank.minXp });
    check(info.pct < 100, "pct stays under 100 below " + rank.name);
    r = Game.award("test:b", 1);
    same(r.rankUp && r.rankUp.id, rank.id, "rankUp at " + rank.minXp);
    info = Game.rank();
    same(info.id, rank.id, "exactly at " + rank.name);
    same(info.index, i);
    same(info.minXp, rank.minXp);
    r = Game.award("test:c", 0);
    same(r.rankUp, null, "no rankUp without crossing");
  });
});

test("rank: shape, pct and toNext", function () {
  var info = Game.rank(), second = C.ranks[1];
  same(Object.keys(info).sort(), ["blurb", "icon", "id", "index", "minXp", "name", "next", "pct", "toNext"]);
  same(info.index, 0);
  same(info.minXp, 0);
  same(info.icon, "img/ranks/" + C.ranks[0].id + ".svg");
  same(info.blurb, C.ranks[0].blurb);
  same(info.pct, 0);
  same(info.toNext, second.minXp);
  Game.award("test:half", second.minXp / 2);
  same(Game.rank().pct, 50);
  same(Game.rank().toNext, second.minXp / 2);
});

test("rank: jumping several titles at once reports the title reached", function () {
  var r = Game.award("test:jump", C.ranks[3].minXp + 5);
  same(r.rankUp.id, C.ranks[3].id);
  same(r.rankUp.index, 3);
  same(r.rankUp.next.name, C.ranks[4].name);
});

test("ranks() lists all ten titles with icons", function () {
  var list = Game.ranks();
  same(list.length, 10);
  list.forEach(function (r, i) {
    same(r.id, C.ranks[i].id);
    same(r.name, C.ranks[i].name);
    same(r.minXp, C.ranks[i].minXp);
    same(r.icon, "img/ranks/" + r.id + ".svg");
    same(r.index, i);
  });
  list[0].name = "changed";
  same(Game.ranks()[0].name, C.ranks[0].name, "config is not touched");
});

test("badges() lists every badge with icon, earned and when", function () {
  var list;
  Game.award("lesson:w0-l1");
  list = Game.badges();
  same(list.length, C.badges.length);
  list.forEach(function (b, i) {
    same(Object.keys(b).sort(), ["earned", "how", "icon", "id", "name", "when"]);
    same(b.id, C.badges[i].id);
    same(b.icon, "img/badges/" + b.id + ".svg");
    if (b.id === "first-step") {
      same(b.earned, true);
      same(b.when, clock);
    } else {
      same(b.earned, false, b.id);
      same(b.when, null, b.id);
    }
  });
});

test("today() formats the LOCAL date", function () {
  Game._now = function () { return new Date(2026, 0, 5, 23, 59, 30).getTime(); };
  same(Game.today(), "2026-01-05", "just before local midnight");
  Game._now = function () { return new Date(2026, 0, 6, 0, 0, 30).getTime(); };
  same(Game.today(), "2026-01-06", "just after local midnight");
  Game._now = function () { return new Date(2026, 11, 31, 12, 0, 0).getTime(); };
  same(Game.today(), "2026-12-31");
  Game._now = function () { return new Date(2028, 1, 29, 8, 0, 0).getTime(); };
  same(Game.today(), "2028-02-29");
});

test("_now: every date goes through it, and a broken one falls back to the real clock", function () {
  Game._now = function () { return at(40); };
  Game.award("sutta:dhp");
  same(stored().done["sutta:dhp"].t, at(40));
  same(stored().days, [dayName(40)]);
  Game._now = function () { throw new Error("no clock"); };
  check(/^\d{4}-\d{2}-\d{2}$/.test(Game.today()), "still a date");
  Game._now = null;
  check(/^\d{4}-\d{2}-\d{2}$/.test(Game.today()), "still a date");
  check(typeof REAL_NOW() === "number" && Math.abs(REAL_NOW() - Date.now()) < 5000, "default is the real clock");
});

test("run: gaps of 0, 1, 2 and 3 days keep it going; 4 starts again; best is kept", function () {
  function run() { var s = Game.streak(); return [s.current, s.best]; }
  setDay(0);
  Game.award("t:1");
  same(run(), [1, 1], "first day");
  Game.award("t:2");
  same(run(), [1, 1], "gap 0: no change");
  setDay(1);
  Game.award("t:3");
  same(run(), [2, 2], "gap 1");
  Game.award("t:4");
  same(run(), [2, 2], "gap 0 again");
  setDay(3);
  Game.award("t:5");
  same(run(), [3, 3], "gap 2");
  setDay(6);
  Game.award("t:6");
  same(run(), [4, 4], "gap 3");
  setDay(10);
  Game.award("t:7");
  same(run(), [1, 4], "gap 4: run is 1, best stays");
  setDay(11);
  Game.award("t:8");
  same(run(), [2, 4], "building again");
  setDay(40);
  Game.award("t:9");
  same(run(), [1, 4], "a long gap");
  same(stored().run, { current: 1, best: 4, last: dayName(40) });
});

test("run: best grows past the old best", function () {
  var i;
  for (i = 0; i < 3; i++) { setDay(i); Game.award("a:" + i); }
  setDay(20);
  Game.award("b:0");
  same(Game.streak().best, 3);
  for (i = 21; i < 26; i++) { setDay(i); Game.award("b:" + i); }
  same(Game.streak().current, 6);
  same(Game.streak().best, 6);
});

test("run: a clock that goes backwards changes nothing and never throws", function () {
  setDay(5);
  Game.award("t:1");
  setDay(6);
  Game.award("t:2");
  same(Game.streak().current, 2);
  setDay(2);
  Game.award("t:3");
  same(Game.streak().current, 2, "negative gap: no change");
  same(Game.streak().best, 2);
  same(Game.streak().daysSince, 0);
  same(stored().days, [dayName(2), dayName(5), dayName(6)], "days stay sorted");
});

test("run: an activity logged while the clock was behind does not restart the run", function () {
  var i;
  setDay(5);
  Game.award("t:1");
  setDay(6);
  Game.award("t:2");
  setDay(2);
  Game.award("t:3");
  setDay(7);
  same(Game.streak().daysSince, 1, "counted from day 6, the latest logged day");
  Game.award("t:4");
  same([Game.streak().current, Game.streak().best], [3, 3], "day 7 follows day 6");
  same(stored().run.last, dayName(7));
  setDay(6);
  Game.award("t:5");
  same(Game.streak().current, 3, "a day already logged changes nothing");
  setDay(10);
  Game.award("t:6");
  same(Game.streak().current, 4, "gap 3 from day 7, not 4 from day 6");

  Game.reset();
  for (i = 1; i <= 3; i++) { setDay(i); Game.award("a:" + i); }
  for (i = 10; i <= 12; i++) { setDay(i); Game.award("a:" + i); }
  same([Game.streak().current, Game.streak().best], [3, 3]);
  setDay(7);
  Game.award("b:1");
  same(Game.streak().current, 3, "an earlier day, 4 days after an old one, does not start the run again");
  setDay(13);
  Game.award("b:2");
  same(Game.streak().current, 4);
});

test("run: an activity logged while the clock was ahead does not hold the run still", function () {
  var i;
  for (i = 1; i <= 3; i++) { setDay(i); Game.award("a:" + i); }
  setDay(400);
  Game.award("b:1");
  same([Game.streak().current, Game.streak().best], [1, 3]);
  setDay(4);
  same(Game.streak().daysSince, 1, "counted from day 3, not from a day that has not come yet");
  same(Game.streak().activeToday, false);
  Game.award("b:2");
  same(Game.streak().current, 2);
  same(Game.streak().daysSince, 0);
  setDay(5);
  Game.award("b:3");
  same([Game.streak().current, Game.streak().best], [3, 3], "the run grows again on real days");
});

test("run: a save with a run but no days still measures from run.last", function () {
  same(Game.importData({ v: 1, xp: 0, done: {}, days: [], run: { current: 2, best: 2, last: dayName(0) } }), true);
  setDay(1);
  same(Game.streak().daysSince, 1);
  Game.award("t:1");
  same([Game.streak().current, Game.streak().best], [3, 3]);
});

test("streak(): activeToday, daysSince and total are real numbers", function () {
  var i;
  for (i = 0; i < 9; i++) { setDay(i); Game.award("t:" + i); }
  same(Game.streak(), { current: 9, best: 9, activeToday: true, daysSince: 0, total: 9 }, "no cap at 7 in the engine");
  setDay(9);
  same(Game.streak(), { current: 9, best: 9, activeToday: false, daysSince: 1, total: 9 });
  setDay(11);
  same(Game.streak().daysSince, 3);
  setDay(30);
  same(Game.streak().daysSince, 22);
  same(Game.streak().current, 9, "reading never changes the run");
  same(Game.streak().total, 9);
});

test("days: each local day is recorded once, in order", function () {
  setDay(3);
  Game.award("t:1");
  Game.award("t:2");
  setDay(1);
  Game.award("t:3");
  setDay(3);
  Game.award("t:4");
  setDay(2);
  Game.skip("w1-l4");
  same(stored().days, [dayName(1), dayName(2), dayName(3)]);
  same(Game.streak().total, 3);
});

test("days: an award late at night and one after midnight are two days", function () {
  clock = at(0, 23, 58);
  Game.award("t:1");
  clock = at(1, 0, 3);
  Game.award("t:2");
  same(Game.streak().total, 2);
  same(Game.streak().current, 2);
});

test("lessonsToday counts only lessons logged today", function () {
  Game.award("lesson:w0-l1");
  Game.award("lesson:w0-l2");
  Game.award("sutta:dhp");
  Game.award("boss:w0");
  same(Game.lessonsToday(), 2);
  setDay(1);
  same(Game.lessonsToday(), 0);
  Game.award("lesson:w0-l3");
  same(Game.lessonsToday(), 1);
});

test("badge rule 'has': earned when that id is logged", function () {
  var r = Game.award("lesson:w0-l2");
  same(r.newBadges, []);
  r = Game.award("lesson:w0-l1");
  same(ids(r.newBadges), ["first-step"]);
  same(r.newBadges[0].earned, true);
  same(r.newBadges[0].when, clock);
  same(r.newBadges[0].icon, "img/badges/first-step.svg");
  same(Game.award("sutta:an6.55").newBadges.length, 2, "library-card and lute-player together");
});

test("badge rule 'count': earned exactly at n", function () {
  var cards = Object.keys(C.cards), i, r;
  for (i = 0; i < 9; i++) {
    r = Game.award("sutta:" + cards[i]);
    same(ids(r.newBadges), i === 0 ? ["library-card"] : [], "card " + (i + 1));
  }
  same(badge(Game, "ten-talks").earned, false);
  r = Game.award("sutta:" + cards[9]);
  same(ids(r.newBadges), ["ten-talks"]);
  same(badge(Game, "ten-talks").earned, true);
});

test("badge rule 'streak': 3 days in one run, rest days allowed", function () {
  setDay(0);
  Game.award("t:1");
  setDay(2);
  same(Game.award("t:2").newBadges, []);
  setDay(5);
  same(ids(Game.award("t:3").newBadges), ["three-good-days"], "third day, with rest days between");
  same(badge(Game, "seven-good-days").earned, false);
});

test("badge rule 'streak': not earned when the days are too far apart", function () {
  var i;
  for (i = 0; i < 6; i++) {
    setDay(i * 4);
    Game.award("t:" + i);
  }
  same(Game.streak().total, 6);
  same(Game.streak().best, 1);
  same(badge(Game, "three-good-days").earned, false);
});

test("badge rule 'streak': kept for good once earned", function () {
  var i;
  for (i = 0; i < 7; i++) { setDay(i); Game.award("t:" + i); }
  same(badge(Game, "seven-good-days").earned, true);
  setDay(60);
  Game.award("t:later");
  same(Game.streak().current, 1);
  same(badge(Game, "seven-good-days").earned, true, "never removed");
  same(badge(Game, "three-good-days").earned, true);
});

test("badge rule 'xp': earned when the total reaches n", function () {
  var r = Game.award("test:a", 999);
  same(ids(r.newBadges), []);
  r = Game.award("test:b", 1);
  same(ids(r.newBadges), ["thousand-steps"]);
});

test("badge rule 'world': needs every lesson in the world done", function () {
  var w0 = C.worlds[0], last = w0.lessons[w0.lessons.length - 1].id, r;
  doLessons(Game, w0, [last]);
  same(badge(Game, "starting-gate").earned, false);
  r = Game.award("boss:w0");
  same(ids(r.newBadges), [], "the check alone does not give the world badge");
  r = Game.award("lesson:" + last);
  same(ids(r.newBadges), ["starting-gate"]);
});

test("badge rule 'world': NOT earned when a lesson is only set aside", function () {
  var w1 = C.worlds[1], r;
  doWorld(Game, C.worlds[0]);
  same(Game.skip("w1-l4"), true);
  doLessons(Game, w1, ["w1-l4"]);
  Game.award("boss:w1");
  same(Game.worldProgress("w1").complete, true, "world is passed");
  same(badge(Game, "clear-eyes").earned, false, "badge waits");
  r = Game.award("lesson:w1-l4");
  same(r.xp, 30, "the set-aside lesson still pays its 30 points");
  same(ids(r.newBadges), ["clear-eyes"], "badge arrives when the lesson is done");
});

test("every badge in the config: earned exactly when its rule is first met", function () {
  var types = {};
  C.badges.forEach(function (b) {
    var rule = b.rule, i, r, world, lessons;
    types[rule.type] = true;
    Game.reset();
    setDay(0);
    if (rule.type === "count") {
      for (i = 1; i < rule.n; i++) { Game.award(rule.prefix + "item-" + i, 0); }
      same(badge(Game, b.id).earned, false, b.id + " one short");
      r = Game.award(rule.prefix + "item-" + rule.n, 0);
    } else if (rule.type === "has") {
      same(badge(Game, b.id).earned, false, b.id + " before");
      r = Game.award(rule.id);
    } else if (rule.type === "xp") {
      Game.award("test:a", rule.n - 1);
      same(badge(Game, b.id).earned, false, b.id + " one short");
      r = Game.award("test:b", 1);
    } else if (rule.type === "streak") {
      for (i = 0; i < rule.n - 1; i++) { setDay(i); Game.award("t:" + i); }
      same(badge(Game, b.id).earned, false, b.id + " one short");
      setDay(rule.n - 1);
      r = Game.award("t:last");
    } else if (rule.type === "world") {
      world = C.worlds.filter(function (w) { return w.id === rule.id; })[0];
      check(world, b.id + " names a real world");
      lessons = world.lessons;
      for (i = 0; i < lessons.length - 1; i++) { Game.award("lesson:" + lessons[i].id); }
      same(badge(Game, b.id).earned, false, b.id + " one short");
      r = Game.award("lesson:" + lessons[lessons.length - 1].id);
    } else {
      throw new Error("unknown rule type in config: " + rule.type);
    }
    check(ids(r.newBadges).indexOf(b.id) !== -1, b.id + " should be in newBadges");
    same(badge(Game, b.id).earned, true, b.id);
  });
  same(Object.keys(types).sort(), ["count", "has", "streak", "world", "xp"], "all five rule types are used");
});

test("playthrough: a scripted learner reaches every badge in the config", function () {
  var cards = Object.keys(C.cards), i, unearned;
  C.worlds.forEach(function (w, n) {
    setDay(n);
    w.lessons.forEach(function (l) {
      Game.quizResult(l.id, 3, 3);
      Game.award("lesson:" + l.id);
    });
    Game.award("boss:" + w.id);
    Game.award("daily:" + Game.today());
  });
  setDay(8);
  cards.forEach(function (id, n) {
    Game.award("sutta:" + id);
    if (n < 10) { Game.award("suttaq:" + id); }
  });
  for (i = 1; i <= 50; i++) { Game.award("rule:pacittiya-" + i); }
  Object.keys(C.study).slice(0, 10).forEach(function (k) { Game.studyTick(k, true); });
  for (i = 1; i <= 14; i++) { Game.award("jw:" + i); }
  ["career", "money", "loss"].forEach(function (t) { Game.award("theme:" + t); });
  C.words.slice(0, 10).forEach(function (w, n) { Game.award("gloss:word-" + n); });

  unearned = Game.badges().filter(function (b) { return !b.earned; });
  same(ids(unearned), [], "badges not reached");
  same(Game.badges().length, C.badges.length);
  Game.badges().forEach(function (b) { check(typeof b.when === "number", b.id + " has a time"); });
  same(Game.trailDone(), true);
  same(Game.nextStep(), null);
  same(Game.xp(), C.caps.xp, "points stopped at the cap");
  same(Game.rank().id, LAST_RANK.id);
  same(cards.length, 67);
});

test("playthrough: the Trail alone is 1780 points", function () {
  C.worlds.forEach(function (w) { doWorld(Game, w); });
  same(Game.xp(), 46 * 30 + 8 * 50);
  same(Game.xp(), 1780);
  same(Game.rank().id, C.ranks[8].id);
  same(Game.trailDone(), true);
  same(Game.nextStep(), null);
});

test("playthrough: with all three heads-up lessons set aside, each world still brings a title", function () {
  C.worlds.forEach(function (w, n) {
    var r;
    w.lessons.forEach(function (l) {
      check(Game.isUnlocked(l.id), l.id + " should be open");
      same(Game.nextStep(), { type: "lesson", id: l.id, world: w.id });
      if (C.headsUp.indexOf(l.id) !== -1) { Game.skip(l.id); } else { Game.award("lesson:" + l.id); }
    });
    same(Game.nextStep(), { type: "boss", world: w.id });
    r = Game.award("boss:" + w.id);
    same(Game.rank().index, n + 1, "title after world " + n);
    check(r.rankUp && r.rankUp.index === n + 1, "the check of world " + n + " brings the title");
  });
  same(Game.xp(), 1780 - 90);
  same(Game.trailDone(), true);
  same(Game.nextStep(), null, "set-aside lessons are never brought up again");
  same(badge(Game, "zero-to-hero").earned, true);
  same(badge(Game, "clear-eyes").earned, false);
  same(badge(Game, "homecoming").earned, false);
  same(badge(Game, "starting-gate").earned, true);
  same(Game.count("skip:"), 3);
});

test("isUnlocked: lessons open one after another inside a world", function () {
  same(Game.isUnlocked("w0-l1"), true, "the first lesson is always open");
  same(Game.isUnlocked("w0-l2"), false);
  same(Game.isUnlocked("w0-l3"), false);
  same(Game.isUnlocked("w1-l1"), false);
  same(Game.isUnlocked("w7-l5"), false);
  same(Game.isUnlocked("nope"), false, "unknown lesson");
  Game.award("lesson:w0-l1");
  same(Game.isUnlocked("w0-l1"), true, "a done lesson stays open");
  same(Game.isUnlocked("w0-l2"), true);
  same(Game.isUnlocked("w0-l3"), false);
});

test("isUnlocked and nextStep across a world boundary", function () {
  var w0 = C.worlds[0];
  doLessons(Game, w0);
  same(Game.isUnlocked("w1-l1"), false, "next world waits for the check");
  same(Game.nextStep(), { type: "boss", world: "w0" });
  same(Game.worldProgress("w0").bossReady, true);
  Game.award("boss:w0");
  same(Game.isUnlocked("w1-l1"), true, "the check opens the next world");
  same(Game.isUnlocked("w1-l2"), false);
  same(Game.isUnlocked("w2-l1"), false);
  same(Game.nextStep(), { type: "lesson", id: "w1-l1", world: "w1" });
  same(Game.worldProgress("w0").bossReady, false);
  same(Game.worldProgress("w0").bossDone, true);
});

test("nextStep walks the whole Trail in order", function () {
  var steps = [], guard = 0, s;
  while ((s = Game.nextStep()) && guard < 200) {
    guard += 1;
    if (s.type === "lesson") {
      check(Game.isUnlocked(s.id), s.id + " is the next step, so it must be open");
      steps.push(s.id);
      Game.award("lesson:" + s.id);
    } else {
      steps.push("check-" + s.world);
      Game.award("boss:" + s.world);
    }
  }
  var want = [];
  C.worlds.forEach(function (w) {
    w.lessons.forEach(function (l) { want.push(l.id); });
    want.push("check-" + w.id);
  });
  same(steps, want);
  same(Game.nextStep(), null);
});

test("set aside: a heads-up lesson is passed, and the Trail carries on", function () {
  var p;
  doWorld(Game, C.worlds[0]);
  ["w1-l1", "w1-l2", "w1-l3"].forEach(function (id) { Game.award("lesson:" + id); });
  same(Game.nextStep(), { type: "lesson", id: "w1-l4", world: "w1" });
  same(Game.isUnlocked("w1-l5"), false);
  same(Game.skip("w1-l4"), true);
  same(Game.has("skip:w1-l4"), true);
  same(Game.isSetAside("w1-l4"), true);
  same(Game.isPassed("w1-l4"), true);
  same(Game.has("lesson:w1-l4"), false);
  same(Game.isUnlocked("w1-l5"), true, "the next lesson opens");
  same(Game.isUnlocked("w1-l4"), true, "the set-aside lesson stays open too");
  same(Game.nextStep(), { type: "lesson", id: "w1-l5", world: "w1" });
  same(Game.xp(), 5 * 30 + 50 + 3 * 30, "setting aside gives no points");
  Game.skip("w1-l5");
  same(Game.nextStep(), { type: "lesson", id: "w1-l6", world: "w1" });
  Game.award("lesson:w1-l6");
  p = Game.worldProgress("w1");
  same(p, { done: 4, setAside: 2, total: 6, complete: true, allDone: false, bossDone: false, bossReady: true });
  same(Game.nextStep(), { type: "boss", world: "w1" });
  Game.award("boss:w1");
  same(Game.isUnlocked("w2-l1"), true, "the next world opens");
  same(Game.nextStep(), { type: "lesson", id: "w2-l1", world: "w2" });
  Game.award("lesson:w1-l4");
  same(Game.isSetAside("w1-l4"), false, "done now, so no longer set aside");
  same(Game.isPassed("w1-l4"), true);
  same(Game.worldProgress("w1"), { done: 5, setAside: 1, total: 6, complete: true, allDone: false, bossDone: true, bossReady: false });
});

test("skip: works for every heads-up lesson in the config", function () {
  same(C.headsUp, ["w1-l4", "w1-l5", "w7-l5"]);
  C.headsUp.forEach(function (id) {
    same(Game.skip(id), true, id);
    same(Game.isSetAside(id), true, id);
    same(Game.skip(id), true, id + " twice is fine");
  });
  same(Game.count("skip:"), 3);
  same(Game.xp(), 0);
});

test("skip: ignored for a normal lesson, an unknown lesson and a finished lesson", function () {
  same(Game.skip("w0-l1"), false);
  same(Game.has("skip:w0-l1"), false);
  same(Game.isSetAside("w0-l1"), false);
  same(Game.isPassed("w0-l1"), false);
  same(Game.isUnlocked("w0-l2"), false, "nothing opened");
  same(Game.skip("w6-l6"), false, "not a heads-up lesson");
  same(Game.skip("nope"), false);
  same(Game.skip(undefined), false);
  same(Game.count(""), 0, "nothing was logged");
  same(Game.streak().total, 0);
  Game.award("lesson:w1-l4");
  same(Game.skip("w1-l4"), false, "already done");
  same(Game.has("skip:w1-l4"), false);
});

test("skip: fires no points, and counts as a day the learner showed up", function () {
  var seen = [];
  listen(Game, "award", function (a) { seen.push(a); });
  Game.skip("w7-l5");
  same(seen, [{ id: "skip:w7-l5", xp: 0 }]);
  same(Game.streak().total, 1);
});

test("settings.openAll opens every lesson", function () {
  same(Game.setting("openAll"), false);
  same(Game.isUnlocked("w5-l3"), false);
  same(Game.setting("openAll", true), true);
  allLessons().forEach(function (id) { same(Game.isUnlocked(id), true, id); });
  same(Game.isUnlocked("nope"), false, "a lesson that does not exist is never open");
  same(Game.nextStep(), { type: "lesson", id: "w0-l1", world: "w0" }, "the next step does not change");
  Game.setting("openAll", false);
  same(Game.isUnlocked("w5-l3"), false);
});

test("nextStep with lessons done out of order (Open all lessons)", function () {
  Game.setting("openAll", true);
  doLessons(Game, C.worlds[3]);
  same(Game.worldProgress("w3").bossReady, true);
  same(Game.nextStep(), { type: "lesson", id: "w0-l1", world: "w0" }, "first step in Trail order");
  doWorld(Game, C.worlds[0]);
  same(Game.nextStep(), { type: "lesson", id: "w1-l1", world: "w1" });
  Game.setting("openAll", false);
  same(Game.isUnlocked("w3-l2"), true, "a lesson already done can still be opened");
  same(Game.isUnlocked("w4-l1"), false);
});

test("worldProgress: shape and counts", function () {
  same(Game.worldProgress("w0"), { done: 0, setAside: 0, total: 5, complete: false, allDone: false, bossDone: false, bossReady: false });
  Game.award("lesson:w0-l1");
  Game.award("lesson:w0-l3");
  same(Game.worldProgress("w0").done, 2);
  doLessons(Game, C.worlds[0]);
  same(Game.worldProgress("w0"), { done: 5, setAside: 0, total: 5, complete: true, allDone: true, bossDone: false, bossReady: true });
  Game.award("boss:w0");
  same(Game.worldProgress("w0"), { done: 5, setAside: 0, total: 5, complete: true, allDone: true, bossDone: true, bossReady: false });
  same(Game.worldProgress("w1").total, 6);
  same(Game.worldProgress("nope"), { done: 0, setAside: 0, total: 0, complete: false, allDone: false, bossDone: false, bossReady: false });
});

test("trailDone: true only when every world check is done", function () {
  C.worlds.forEach(function (w, n) {
    same(Game.trailDone(), false, "before check " + n);
    Game.award("boss:" + w.id);
  });
  same(Game.trailDone(), true);
  same(badge(Game, "zero-to-hero").earned, true);
});

test("quizResult: keeps the best score and counts tries", function () {
  var r = Game.quizResult("w0-l1", 2, 3);
  same(r.best, 2);
  same(r.tries, 1);
  same(r.perfect, false);
  same(Game.has("quiz:w0-l1"), false);
  r = Game.quizResult("w0-l1", 1, 3);
  same([r.best, r.tries], [2, 2], "best never goes down");
  r = Game.quizResult("w0-l1", 3, 3);
  same([r.best, r.tries, r.perfect], [3, 3, true]);
  same(Game.has("quiz:w0-l1"), true, "a clean run logs the quiet marker");
  r = Game.quizResult("w0-l1", 0, 3);
  same([r.best, r.tries], [3, 4]);
  same(stored().quiz, { "w0-l1": { best: 3, tries: 4 } });
  same(Game.xp(), 0, "no points for quick checks");
  same(Game.quizResult("", 3, 3), null);
  same(Game.quizResult("w0-l2", 9, 3).best, 3, "score cannot pass the total");
  same(Game.quizResult("w0-l3", "x", undefined).best, 0, "odd input is tidied");
  same(Game.has("quiz:w0-l3"), false);
});

test("quizResult: ten clean checks bring the badge", function () {
  var lessons = allLessons(), i, r;
  for (i = 0; i < 9; i++) { r = Game.quizResult(lessons[i], 3, 3); same(r.newBadges, []); }
  r = Game.quizResult(lessons[9], 3, 3);
  same(ids(r.newBadges), ["ten-clean-checks"]);
});

test("studyTick: logs the box and every card it stands for", function () {
  var r;
  same(C.study["u7-7"], ["mn10", "dn22"]);
  r = Game.studyTick("u7-7", true);
  same(r.awarded, true);
  same(r.xp, 20);
  same(ids(r.newBadges), ["library-card"]);
  same(Game.has("study:u7-7"), true);
  same(Game.has("sutta:mn10"), true);
  same(Game.has("sutta:dn22"), true);
  same(Game.xp(), 20);
  same(stored().ticks, { "u7-7": true });
  r = Game.studyTick("u6-10", true);
  same(C.study["u6-10"], []);
  same(r.xp, 0, "a box with no card pays nothing");
  same(Game.has("study:u6-10"), true);
  same(Game.count("sutta:"), 2);
});

test("studyTick: never pays twice", function () {
  var r, before;
  Game.studyTick("u1-1", true);
  same(Game.xp(), 10);
  r = Game.studyTick("u1-1", true);
  same(r, { awarded: false, xp: 0, newBadges: [], rankUp: null }, "second tick");
  same(Game.xp(), 10);
  before = Game.count("");
  Game.studyTick("u1-1", false);
  same(Game.count(""), before, "un-ticking removes nothing");
  same(Game.has("study:u1-1"), true);
  same(Game.has("sutta:sn56.11"), true);
  same(Game.xp(), 10);
  same(stored().ticks, { "u1-1": false });
  r = Game.studyTick("u1-1", true);
  same(r.xp, 0, "ticking again pays nothing");
  same(Game.xp(), 10);
  same(Game.count(""), before);
});

test("studyTick: a card already read in the library is not paid again", function () {
  var r;
  same(Game.award("sutta:sn36.6").xp, 10);
  same(Game.has("study:u1-2"), true, "the read ticked the box and logged its marker");
  r = Game.studyTick("u1-2", true);
  same(r, { awarded: false, xp: 0, newBadges: [], rankUp: null }, "so ticking it by hand adds nothing");
  same(Game.xp(), 10);
  same(Game.count("sutta:"), 1);
  same(Game.count("study:"), 1);
  same(Game.award("sutta:sn36.6").awarded, false, "and the library cannot pay again either");
  Game.award("sutta:mn10");
  r = Game.studyTick("u7-7", true);
  same(r.awarded, true, "a box with one card still to read: the marker and the other card are new");
  same(r.xp, 10, "only the unread card pays");
  same(Game.xp(), 30);
});

test("library read: the last card of a Guided Study box ticks it and logs its marker", function () {
  var r, awards = [];
  listen(Game, "award", function (a) { awards.push(a.id + " " + a.xp); });
  r = Game.award("sutta:sn56.11");
  same(r.awarded, true);
  same(r.xp, 10, "the marker adds 0 points");
  same(ids(r.newBadges), ["library-card"]);
  same(Game.has("study:u1-1"), true);
  same(stored().done["study:u1-1"], { xp: 0, t: clock }, "saved with 0 points");
  same(stored().ticks, { "u1-1": true });
  same(Game.xp(), 10);
  same(awards, ["sutta:sn56.11 10", "study:u1-1 0"]);
  same(C.study["u7-7"], ["mn10", "dn22"]);
  Game.award("sutta:mn10");
  same(Game.has("study:u7-7"), false, "a box with two cards waits for both");
  same(stored().ticks, { "u1-1": true });
  Game.award("sutta:dn22");
  same(Game.has("study:u7-7"), true, "the second card brings the marker");
  same(stored().ticks, { "u1-1": true, "u7-7": true });
  same(Game.count("study:"), 2);
  same(Game.xp(), 30);
  Game.award("suttaq:sn36.6");
  same(Game.has("study:u1-2"), false, "a check question is not a read");
  Game.award("sutta:not-a-card");
  same(Game.count("study:"), 2, "a card in no box changes no box");
  same(C.study["u6-10"], []);
  same(Game.has("study:u6-10"), false, "a box with no cards is never touched");
});

test("library read: a box un-ticked by hand stays un-ticked and gets no marker", function () {
  Game.studyTick("u1-1", false);
  same(Game.award("sutta:sn56.11").xp, 10);
  same(Game.has("study:u1-1"), false, "no marker");
  same(Game.studyChecked("u1-1"), false, "still un-ticked");
  same(stored().ticks, { "u1-1": false });
  Game.studyTick("u7-7", false);
  Game.award("sutta:mn10");
  Game.award("sutta:dn22");
  same(Game.has("study:u7-7"), false);
  same(Game.studyChecked("u7-7"), false);
  same(Game.count("study:"), 0);
  same(Game.studyTick("u1-1", true).awarded, true, "ticking it by hand logs the marker");
  same(Game.has("study:u1-1"), true);
});

test("library read: ten boxes ticked by reading bring the Study Buddy badge", function () {
  var keys = Object.keys(C.study).filter(function (k) { return C.study[k].length === 1; }).slice(0, 10);
  var badges = [], r;
  same(keys.length, 10);
  listen(Game, "badge", function (b) { badges.push(b.id); });
  keys.forEach(function (k, n) {
    r = Game.award("sutta:" + C.study[k][0], { silent: true });
    same(Game.count("study:"), n + 1, "box " + k);
    same(Game.studyChecked(k), true, "box " + k);
    if (n < 9) { check(ids(r.newBadges).indexOf("study-buddy") === -1, "not before the tenth read"); }
  });
  check(ids(r.newBadges).indexOf("study-buddy") !== -1, "the badge is in the tenth read's result");
  check(badges.indexOf("study-buddy") !== -1, "and the badge event fired");
  same(badge(Game, "study-buddy").earned, true);
  same(r.xp, 10);
  same(Game.xp(), 100, "ten reads, and the markers add nothing");
  same(loadGame().count("study:"), 10, "saved");
});

test("studyTick: ten ticks bring the Study Buddy badge; events fire", function () {
  var keys = Object.keys(C.study).slice(0, 10), awards = [], changes = 0, r;
  listen(Game, "award", function (a) { awards.push(a.id); });
  listen(Game, "change", function () { changes += 1; });
  keys.forEach(function (k, n) {
    r = Game.studyTick(k, true);
    if (n === 0) { same(awards, ["study:" + k, "sutta:" + C.study[k][0]]); }
  });
  check(ids(r.newBadges).indexOf("study-buddy") !== -1, "badge on the tenth tick");
  same(changes, 10, "one change per tick");
  Game.studyTick(keys[0], true);
  same(changes, 10, "no change when nothing changed");
  Game.studyTick(keys[0], false);
  same(changes, 11);
});

test("studyTick: bad keys are ignored", function () {
  same(Game.studyTick("", true).awarded, false);
  same(Game.studyTick(null, true).awarded, false);
  same(Game.studyTick("__proto__", true).awarded, false);
  same(Game.count(""), 0);
});

test("studyChecked: derived from the cards until the box itself is touched", function () {
  same(Game.studyChecked("u1-1"), false);
  Game.award("sutta:sn56.11");
  same(Game.studyChecked("u1-1"), true, "read in the library, so the box shows ticked");
  same(Game.has("study:u1-1"), true, "and the box marker is logged with it");
  same(Game.studyChecked("u7-7"), false);
  Game.award("sutta:mn10");
  same(Game.studyChecked("u7-7"), false, "needs both cards");
  Game.award("sutta:dn22");
  same(Game.studyChecked("u7-7"), true);
  same(Game.studyChecked("u6-10"), false, "a box with no cards is not derived");
  Game.studyTick("u6-10", true);
  same(Game.studyChecked("u6-10"), true);
  Game.studyTick("u1-1", false);
  same(Game.studyChecked("u1-1"), false, "an un-tick wins over the cards");
  Game.studyTick("u1-1", true);
  same(Game.studyChecked("u1-1"), true);
  same(Game.studyChecked("nope"), false);
  same(Game.studyChecked(undefined), false);
});

test("setting: get, set, saved, and only the three known names", function () {
  var changes = 0, G;
  listen(Game, "change", function () { changes += 1; });
  same([Game.setting("quiet"), Game.setting("large"), Game.setting("openAll")], [false, false, false]);
  same(Game.setting("quiet", true), true);
  same(Game.setting("quiet"), true);
  same(Game.setting("large", 1), true, "truthy becomes true");
  same(changes, 2);
  Game.setting("quiet", true);
  same(changes, 2, "no change event when the value is the same");
  same(Game.setting("volume"), undefined);
  same(Game.setting("volume", 11), undefined);
  same(stored().settings, { quiet: true, large: true, openAll: false });
  G = loadGame();
  same([G.setting("quiet"), G.setting("large"), G.setting("openAll")], [true, true, false], "after a reload");
  Game.setting("quiet", false);
  same(Game.setting("quiet"), false);
});

test("resume: get, set, clear, and a safe copy", function () {
  var got, G;
  same(Game.resume(), null);
  Game.resume({ lesson: "w1-l2", card: 3 });
  got = Game.resume();
  same(got, { lesson: "w1-l2", card: 3 });
  got.card = 99;
  same(Game.resume().card, 3, "callers cannot change the saved copy");
  G = loadGame();
  same(G.resume(), { lesson: "w1-l2", card: 3 }, "after a reload");
  Game.resume(null);
  same(Game.resume(), null);
  same(stored().resume, null);
  Game.resume("nonsense");
  same(Game.resume(), null);
});

test("resume: cleared when its own lesson is awarded, kept for any other", function () {
  Game.resume({ lesson: "w0-l2", card: 4 });
  Game.award("lesson:w0-l1");
  same(Game.resume(), { lesson: "w0-l2", card: 4 }, "another lesson");
  Game.award("sutta:dhp");
  same(Game.resume(), { lesson: "w0-l2", card: 4 }, "another kind");
  Game.award("lesson:w0-l2");
  same(Game.resume(), null, "its own lesson");
  same(stored().resume, null);
  Game.resume({ lesson: "w1-l4", card: 0 });
  Game.skip("w1-l4");
  same(Game.resume(), null, "setting the lesson aside clears it too");
});

test("name and setName", function () {
  same(Game.name(), "");
  same(Game.setName("  Vin  "), "Vin");
  same(Game.name(), "Vin");
  same(loadGame().name(), "Vin", "after a reload");
  same(Game.setName(new Array(100).join("a")).length, 40, "kept short");
  same(Game.setName(null), "");
  same(Game.setName(12), "12");
  same(Game.setName("line\nbreak"), "line break");
});

test("events: award, badge, rank and change, in that order", function () {
  var log = [];
  listen(Game, "award", function (a) { log.push("award " + a.id + " " + a.xp); });
  listen(Game, "badge", function (b) { log.push("badge " + b.id); });
  listen(Game, "rank", function (r) { log.push("rank " + r.id); });
  listen(Game, "change", function (x) { log.push("change" + (x === undefined ? "" : "?")); });
  Game.award("lesson:w0-l1");
  same(log, ["award lesson:w0-l1 30", "badge first-step", "change"]);
  log.length = 0;
  Game.award("lesson:w0-l1");
  same(log, [], "a repeat fires nothing");
  Game.award("test:big", 170);
  same(log, ["award test:big 170", "rank " + C.ranks[1].id, "change"]);
});

test("events: opts.silent hides the award event only", function () {
  var log = [];
  listen(Game, "award", function (a) { log.push("award " + a.id); });
  listen(Game, "badge", function (b) { log.push("badge " + b.id); });
  listen(Game, "rank", function (r) { log.push("rank " + r.id); });
  listen(Game, "change", function () { log.push("change"); });
  Game.award("lesson:w0-l1", undefined, { silent: true });
  same(log, ["badge first-step", "change"]);
  log.length = 0;
  Game.award("test:big", 200, { silent: true });
  same(log, ["rank " + C.ranks[1].id, "change"]);
  log.length = 0;
  Game.award("sutta:dhp", { silent: true });
  same(log, ["badge library-card", "change"], "opts may be the second argument");
  same(Game.xp(), 240);
  log.length = 0;
  Game.studyTick("u1-1", true, { silent: true });
  same(log, ["change"], "a silent study tick");
});

test("events: fired after the state is saved", function () {
  var seen = null;
  listen(Game, "award", function (a) {
    var s = stored();
    seen = { saved: !!(s && s.done[a.id]), xp: s ? s.xp : -1, has: Game.has(a.id) };
  });
  Game.award("sutta:dhp");
  same(seen, { saved: true, xp: 10, has: true });
});

test("events: on() returns a way to stop listening; odd input is ignored", function () {
  var n = 0, off = Game.on("change", function () { n += 1; });
  Game.award("t:1");
  same(n, 1);
  off();
  off();
  Game.award("t:2");
  same(n, 1);
  check(typeof Game.on("change", "not a function") === "function", "no throw");
  check(typeof Game.on(null, function () {}) === "function", "no throw");
  Game.award("t:3");
});

test("events: a listener that throws does not break the engine", function () {
  var calls = [], r;
  listen(Game, "award", function () { throw new Error("boom in award"); });
  listen(Game, "award", function (a) { calls.push(a.id); });
  listen(Game, "badge", function () { throw new Error("boom in badge"); });
  listen(Game, "rank", function () { throw new Error("boom in rank"); });
  listen(Game, "change", function () { throw new Error("boom in change"); });
  listen(Game, "change", function () { calls.push("change"); });
  r = Game.award("lesson:w0-l1");
  same(r.awarded, true);
  same(r.xp, 30);
  same(calls, ["lesson:w0-l1", "change"], "later listeners still run");
  r = Game.award("test:big", 400);
  same(r.rankUp.id, C.ranks[2].id);
  same(Game.xp(), 430);
  same(stored().xp, 430, "and the state was saved");
  Game.setting("quiet", true);
  Game.studyTick("u1-1", true);
  Game.skip("w1-l4");
  Game.setName("A");
  Game.reset();
  same(Game.xp(), 0);
});

test("persistence: a new page load sees the same state", function () {
  var G, a, b;
  Game.award("lesson:w0-l1");
  setDay(1);
  Game.award("sutta:dhp");
  Game.quizResult("w0-l1", 3, 3);
  Game.studyTick("u2-1", true);
  Game.setName("Ananda");
  a = Game.exportData();
  G = loadGame();
  b = G.exportData();
  same(b, a);
  same(G.xp(), 50);
  same(G.rank().id, C.ranks[0].id);
  same(G.streak().current, 2);
  same(badge(G, "first-step").earned, true);
  same(G.award("lesson:w0-l1").awarded, false, "still logged after the reload");
});

test("migration: old Guided Study ticks are counted once, quietly", function () {
  var G, G2, total;
  useStorage(makeStorage({ "buddhismstudy-progress": JSON.stringify({ "u1-1": true, "u1-2": true, "u7-7": true, "u2-1": false, "u6-10": true }) }));
  G = loadGame(true);
  same(G.has("study:u1-1"), true);
  same(G.has("study:u1-2"), true);
  same(G.has("study:u7-7"), true);
  same(G.has("study:u6-10"), true);
  same(G.has("study:u2-1"), false, "a false tick is not counted");
  same(G.has("sutta:sn56.11"), true);
  same(G.has("sutta:sn36.6"), true);
  same(G.has("sutta:mn10"), true);
  same(G.has("sutta:dn22"), true);
  same(G.has("sutta:mn87"), false);
  same(G.xp(), 40);
  same(stored().migrated, 4, "migrated says how many old ticks were counted");
  same(G.studyChecked("u1-1"), true);
  same(G.studyChecked("u7-7"), true);
  same(G.studyChecked("u2-1"), false);
  same(badge(G, "library-card").earned, true);
  same(G.streak().total, 1);
  same(G.streak().current, 1);
  same(G.nextStep(), { type: "lesson", id: "w0-l1", world: "w0" }, "lesson 1 is still the next step");
  check(global.localStorage.getItem(OLD_KEY) !== null, "the old key is left alone");
  total = G.count("");
  G2 = loadGame(true);
  same(G2.xp(), 40, "not counted again on the next load");
  same(G2.count(""), total);
  same(stored().migrated, 4);
  same(G2.studyTick("u1-1", true).xp, 0, "and ticking the box again pays nothing");
  loadGame();
});

test("migration: skipped when a save already exists; odd old data is harmless", function () {
  var G;
  Game.award("lesson:w0-l1");
  global.localStorage.setItem(OLD_KEY, JSON.stringify({ "u1-1": true }));
  G = loadGame();
  same(G.has("study:u1-1"), false, "an existing save is not migrated into");
  same(G.xp(), 30);
  same(stored().migrated, 0);
  ["{broken", "[]", "null", "7", "\"text\"", JSON.stringify({ "u1-1": "yes", "u1-2": 1, "__proto__x": true })].forEach(function (old, n) {
    useStorage(makeStorage({ "buddhismstudy-progress": old }));
    G = loadGame();
    same(G.xp(), 0, "old data " + n);
    same(G.count("sutta:"), 0, "old data " + n);
  });
  loadGame();
});

test("backup: export, start over, import brings everything back", function () {
  var json, G;
  doWorld(Game, C.worlds[0]);
  setDay(1);
  Game.award("lesson:w1-l1");
  Game.skip("w1-l4");
  setDay(3);
  Game.award("sutta:dhp");
  Game.award("rule:pacittiya-51");
  Game.award("daily:" + Game.today());
  Game.quizResult("w0-l1", 3, 3);
  Game.quizResult("w0-l2", 1, 3);
  Game.studyTick("u7-7", true);
  Game.studyTick("u1-1", true);
  Game.studyTick("u1-1", false);
  Game.setting("quiet", true);
  Game.setting("large", true);
  Game.setName("Kisa");
  Game.resume({ lesson: "w1-l2", card: 3 });
  json = Game.exportData();
  check(typeof json === "string" && JSON.parse(json).v === 1, "export is JSON text of the state");
  same(Object.keys(JSON.parse(json)).sort(),
    ["badges", "days", "done", "migrated", "name", "quiz", "resume", "run", "settings", "ticks", "v", "xp"]);

  Game.reset();
  same(Game.xp(), 0);
  same(Game.count(""), 0);
  same(Game.name(), "");

  same(Game.importData(json), true);
  same(Game.exportData(), json, "the round trip is exact");
  same(Game.xp(), 200 + 30 + 10 + 2 + 5 + 20 + 10);
  same(Game.name(), "Kisa");
  same(Game.setting("quiet"), true);
  same(Game.resume(), { lesson: "w1-l2", card: 3 });
  same(Game.isSetAside("w1-l4"), true);
  same(Game.studyChecked("u1-1"), false);
  same(Game.streak().total, 3);
  same(badge(Game, "starting-gate").earned, true);
  same(Game.rank().id, C.ranks[1].id);
  same(global.localStorage.getItem(KEY), json, "and it is saved");
  G = loadGame();
  same(G.exportData(), json, "after a reload");
});

test("backup: import fires change, and accepts an object as well as text", function () {
  var changes = 0, json;
  Game.award("lesson:w0-l1");
  json = Game.exportData();
  Game.reset();
  listen(Game, "change", function () { changes += 1; });
  same(Game.importData(JSON.parse(json)), true);
  same(changes, 1);
  same(Game.exportData(), json);
});

test("backup: importData refuses garbage, returns false and never throws", function () {
  var before, trap = {};
  var bad = [undefined, null, 42, true, "", "not json", "{", "[]", "null", "42", "\"text\"", "{}",
    "{\"v\":1}", "{\"v\":1,\"xp\":0}", "{\"v\":2,\"xp\":0,\"done\":{}}", "{\"v\":\"1\",\"xp\":0,\"done\":{}}",
    "{\"v\":1,\"xp\":\"10\",\"done\":{}}", "{\"v\":1,\"xp\":-5,\"done\":{}}", "{\"v\":1,\"xp\":null,\"done\":{}}",
    "{\"v\":1,\"xp\":0,\"done\":[]}", "{\"v\":1,\"xp\":0,\"done\":null}", "{\"v\":1,\"xp\":0,\"done\":\"x\"}",
    [], {}, { v: 1 }, { v: 1, xp: 0, done: [] }, function () {}, new Date(0)];
  Object.defineProperty(trap, "v", { get: function () { throw new Error("trap"); }, enumerable: true });
  bad.push(trap);
  Game.award("lesson:w0-l1");
  Game.setName("Still here");
  before = Game.exportData();
  bad.forEach(function (input, n) {
    var out;
    try { out = Game.importData(input); } catch (e) { throw new Error("input " + n + " threw: " + e.message); }
    check(out === false, "input " + n + " (" + String(input).slice(0, 20) + ") should return false");
    same(Game.exportData(), before, "state untouched after input " + n);
  });
  same(Game.xp(), 30);
});

test("backup: a save with small damage is repaired, not thrown on", function () {
  /* "PROTO" is swapped for "__proto__" in the text, because only parsed JSON can carry that key. */
  var text = JSON.stringify({
    v: 1, xp: 99999, name: 7,
    done: { "lesson:w0-l1": { xp: 30, t: at(0) }, "sutta:dhp": { xp: 10, t: at(2) }, "bad:1": "yes", "bad:2": { xp: -4 }, "PROTO": { xp: 5, t: 1 } },
    badges: { "first-step": at(0), "odd": "x" },
    days: [dayName(2), dayName(0), dayName(0), "nope", 5, "2026-13-40"],
    run: "broken", quiz: [], ticks: { "u1-1": true, "u1-2": "yes" }, settings: null, resume: 5, migrated: -3
  }).replace("\"PROTO\"", "\"__proto__\"");
  var ok;
  check(text.indexOf("\"__proto__\"") !== -1, "the test save carries a __proto__ key");
  ok = Game.importData(text);
  same(ok, true);
  same({}.xp, undefined, "nothing leaked onto every object");
  same(Game.xp(), 40, "points are added up again from what is logged");
  same(Game.name(), "");
  same(Game.count(""), 2);
  same(Game.has("bad:1"), false);
  same(stored().days, [dayName(0), dayName(2)]);
  same(stored().run, { current: 2, best: 2, last: dayName(2) }, "the run is worked out again from the days");
  same(stored().badges, { "first-step": at(0) });
  same(stored().ticks, { "u1-1": true });
  same(stored().settings, { quiet: false, large: false, openAll: false });
  same(stored().resume, null);
  same(stored().migrated, 0);
  same(stored().quiz, {});
  same(Game.award("sutta:mn10").xp, 10, "and the engine carries on");
});

test("corrupted save: bad JSON or a wrong shape gives a fresh state, without throwing", function () {
  var bad = ["{not json", "", "[]", "null", "42", "\"text\"", "{}", "{\"v\":1}", "{\"v\":3,\"xp\":10,\"done\":{}}",
    "{\"v\":1,\"xp\":0,\"done\":\"x\"}", "{\"v\":1,\"xp\":\"many\",\"done\":{}}", "undefined", "{\"v\":1,\"xp\":0,\"done\":{}"];
  bad.forEach(function (raw, n) {
    var G, seed = {};
    seed[KEY] = raw;
    useStorage(makeStorage(seed));
    try { G = loadGame(); } catch (e) { throw new Error("save " + n + " threw on load: " + e.message); }
    same(G.xp(), 0, "save " + n);
    same(G.count(""), 0, "save " + n);
    same(G.rank().id, C.ranks[0].id, "save " + n);
    same(G.nextStep(), { type: "lesson", id: "w0-l1", world: "w0" }, "save " + n);
    same(G.streak(), { current: 0, best: 0, activeToday: false, daysSince: null, total: 0 }, "save " + n);
    same(G.award("lesson:w0-l1").xp, 30, "save " + n + " still works");
    same(stored().done["lesson:w0-l1"].xp, 30, "save " + n + " is replaced by a good one");
    same(G.canSave(), true, "save " + n);
  });
  loadGame();
});

test("corrupted save: the right core with wrong-typed parts still loads", function () {
  var G, seed = {};
  seed[KEY] = JSON.stringify({ v: 1, xp: 30, done: { "lesson:w0-l1": { xp: 30, t: at(0) } }, days: "x", run: 5,
    badges: [], quiz: 3, ticks: "no", settings: "loud", resume: [1], name: null });
  useStorage(makeStorage(seed));
  G = loadGame();
  same(G.xp(), 30);
  same(G.has("lesson:w0-l1"), true);
  same(G.streak().total, 0);
  same(G.setting("quiet"), false);
  same(G.resume(), null);
  same(G.name(), "");
  same(G.award("lesson:w0-l2").xp, 30);
  same(G.streak().current, 1);
  loadGame();
});

test("storage that throws on setItem: canSave is false and the engine still works", function () {
  var store = makeStorage(), G, good;
  store.setItem = function () { throw new Error("QuotaExceededError"); };
  useStorage(store);
  Game.reset();
  same(Game.award("lesson:w0-l1").xp, 30);
  same(Game.canSave(), false);
  same(Game.has("lesson:w0-l1"), true);
  same(Game.award("lesson:w0-l2").xp, 30);
  same(Game.xp(), 60, "kept in memory");
  same(Game.rank().toNext, C.ranks[1].minXp - 60);
  same(Game.skip("w1-l4"), true);
  same(Game.setting("quiet", true), true);
  same(Game.setName("Memory"), "Memory");
  Game.resume({ lesson: "w0-l3", card: 1 });
  same(Game.resume(), { lesson: "w0-l3", card: 1 });
  same(Game.studyTick("u1-1", true).xp, 10);
  same(Game.importData("nope"), false);
  same(Game.xp(), 70);
  same(Game.nextStep(), { type: "lesson", id: "w0-l3", world: "w0" });
  same(Game.canSave(), false);

  G = loadGame();
  same(G.canSave(), false, "a new page load notices at once");
  same(G.award("sutta:dhp").xp, 10);
  same(G.xp(), 10);

  good = makeStorage();
  useStorage(good);
  Game.award("sutta:mn10");
  same(Game.canSave(), true, "saving works again once storage does");
  same(stored().xp, 80, "and what was held in memory is written");
  loadGame();
});

test("storage that throws on every call: still no throw", function () {
  var G;
  function boom() { throw new Error("SecurityError"); }
  useStorage({ getItem: boom, setItem: boom, removeItem: boom });
  G = loadGame();
  same(G.canSave(), false);
  same(G.award("lesson:w0-l1").xp, 30);
  same(G.xp(), 30);
  G.reset();
  same(G.xp(), 0);
  same(G.importData("{\"v\":1,\"xp\":0,\"done\":{}}"), true);
  check(typeof G.exportData() === "string", "export still works");
  loadGame();
});

test("storage that silently keeps nothing: progress stays in memory", function () {
  var G;
  useStorage({ getItem: function () { return null; }, setItem: function () {}, removeItem: function () {} });
  G = loadGame();
  same(G.canSave(), false);
  G.award("lesson:w0-l1");
  G.award("lesson:w0-l2");
  same(G.canSave(), false);
  same(G.xp(), 60, "not wiped by the empty storage");
  same(G.has("lesson:w0-l1"), true);
  loadGame();
});

test("no localStorage at all, or one that throws when touched", function () {
  var G;
  removeStorage();
  check(typeof localStorage === "undefined", "storage is gone");
  G = loadGame();
  same(G.canSave(), false);
  same(G.award("lesson:w0-l1").xp, 30);
  same(G.setting("large", true), true);
  G.reset();
  same(G.xp(), 0);
  same(G.setting("large"), false);

  Object.defineProperty(global, "localStorage", { get: function () { throw new Error("SecurityError"); }, configurable: true });
  G = loadGame();
  same(G.canSave(), false);
  same(G.award("lesson:w0-l1").xp, 30);
  same(G.xp(), 30);
  useStorage(makeStorage());
  loadGame();
});

test("reset clears everything, settings and old ticks included", function () {
  var changes = 0, G;
  doWorld(Game, C.worlds[0]);
  Game.setting("quiet", true);
  Game.setting("large", true);
  Game.setting("openAll", true);
  Game.setName("Vin");
  Game.resume({ lesson: "w1-l1", card: 2 });
  Game.quizResult("w0-l1", 3, 3);
  Game.studyTick("u1-1", true);
  global.localStorage.setItem(OLD_KEY, JSON.stringify({ "u1-1": true }));
  listen(Game, "change", function () { changes += 1; });
  Game.reset();
  same(changes, 1, "reset fires change");
  same(Game.xp(), 0);
  same(Game.count(""), 0);
  same(Game.name(), "");
  same(Game.resume(), null);
  same([Game.setting("quiet"), Game.setting("large"), Game.setting("openAll")], [false, false, false]);
  same(Game.badges().filter(function (b) { return b.earned; }).length, 0);
  same(Game.streak(), { current: 0, best: 0, activeToday: false, daysSince: null, total: 0 });
  same(Game.studyChecked("u1-1"), false);
  same(Game.isUnlocked("w0-l2"), false);
  same(global.localStorage.getItem(KEY), null, "the save is erased");
  same(global.localStorage.getItem(OLD_KEY), null, "old ticks are erased, so they are not counted again");
  G = loadGame();
  same(G.xp(), 0, "and a new page load starts fresh");
  same(G.count(""), 0);
  same(Game.award("lesson:w0-l1").xp, 30, "points are paid again after starting over");
});

test("two open pages do not overwrite each other", function () {
  var A = Game, B = loadGame(), fresh;
  A.award("lesson:w0-l1");
  B.award("sutta:dhp");
  same(B.has("lesson:w0-l1"), true, "page B picked up page A's lesson before saving");
  same(B.xp(), 40);
  A.award("sutta:dhp");
  same(A.xp(), 40, "page A sees B's card as already read, and does not pay twice");
  fresh = loadGame();
  same(fresh.xp(), 40);
  same(fresh.count(""), 3, "the lesson, the card, and the marker of the card's Guided Study box");
  A.reset();
  same(B.award("gloss:dukkha").xp, 2);
  same(B.xp(), 2, "starting over on one page reaches the other");
  same(B.has("lesson:w0-l1"), false);
  loadGame();
});

test("a save damaged while the page is open does not wipe what is in memory", function () {
  Game.award("lesson:w0-l1");
  global.localStorage.setItem(KEY, "{damaged");
  same(Game.award("lesson:w0-l2").xp, 30);
  same(Game.has("lesson:w0-l1"), true, "the earlier lesson is still there");
  same(Game.xp(), 60);
  same(stored().xp, 60, "and a good save is written back");
  global.localStorage.setItem(KEY, "[]");
  same(Game._sync(), false);
  same(Game.xp(), 60);
});

test("_sync: a page can pick up another page's save and hear a change", function () {
  var A = Game, B = loadGame(), changes = 0;
  cleanups.push(B.on("change", function () { changes += 1; }));
  same(B._sync(), false, "nothing new yet");
  A.award("lesson:w0-l1");
  same(B.xp(), 0);
  same(B._sync(), true);
  same(B.xp(), 30);
  same(changes, 1);
  same(B._sync(), false);
  same(changes, 1);
  loadGame();
});

test("the engine works without a config (wrong script order must not throw)", function () {
  var saved = global.GAME_CONFIG, G, r, err = null;
  global.GAME_CONFIG = undefined;
  try {
    G = loadGame();
    r = G.award("lesson:w0-l1");
    same(r.awarded, true);
    same(r.xp, 0);
    same(G.badges(), []);
    same(G.ranks(), []);
    same(G.rank().pct, 100);
    same(G.nextStep(), null);
    same(G.trailDone(), false);
    same(G.isUnlocked("w0-l1"), false);
    same(G.skip("w1-l4"), false);
    same(G.studyChecked("u1-1"), false);
    same(G.worldProgress("w0").total, 0);
  } catch (e) { err = e; }
  global.GAME_CONFIG = saved;
  loadGame();
  if (err) { throw err; }
});

/* ---------- summary ---------- */

console.log("");
console.log(results.run + " tests, " + (results.run - results.failed) + " passed, " + results.failed + " failed");
process.exit(results.failed ? 1 : 0);

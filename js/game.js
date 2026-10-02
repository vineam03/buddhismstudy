/* The game engine: points, titles, badges, the run and the learner's place on the Trail.
   It has no DOM access and no words of its own, so the same file runs in the browser and
   under Node (tools/test-game.js). The contract is docs/GAME_CONTRACT.md, section 4. */
var Game = (function () {
  "use strict";

  var KEY = "buddhismstudy-game-v1";
  var OLD_KEY = "buddhismstudy-progress";
  var PROBE_KEY = "buddhismstudy-game-probe";
  var DAY_MS = 86400000;
  var SETTING_NAMES = ["quiet", "large", "openAll"];
  var MAX_NAME = 40;
  var MAX_KEY = 200;

  var Game = {};
  var state = null;
  var lastRaw = null;      /* the JSON text last read from, or written to, storage */
  var saveOk = false;
  var listeners = {};
  var indexedWorlds = null;
  var lessonAt = {};
  var worldAt = {};

  var hasOwn = Object.prototype.hasOwnProperty;
  var toStr = Object.prototype.toString;

  /* ---------- small helpers ---------- */

  function own(obj, key) { return !!obj && hasOwn.call(obj, key); }
  function isObject(v) { return !!v && typeof v === "object" && toStr.call(v) === "[object Object]"; }
  function isArray(v) { return toStr.call(v) === "[object Array]"; }
  function isNum(v) { return typeof v === "number" && isFinite(v); }
  function whole(v) { return isNum(v) && v > 0 ? Math.floor(v) : 0; }
  function copy(v) { return JSON.parse(JSON.stringify(v)); }

  /* Ids and keys are used as property names, so "__proto__" is never accepted. */
  function goodKey(k) {
    return typeof k === "string" && k.length > 0 && k.length <= MAX_KEY && k !== "__proto__";
  }

  function kindOf(id) {
    var i = id.indexOf(":");
    return i === -1 ? id : id.slice(0, i);
  }

  /* ---------- config ---------- */

  function config() {
    var c = null;
    if (typeof window !== "undefined" && window && window.GAME_CONFIG) {
      c = window.GAME_CONFIG;
    } else if (typeof global !== "undefined" && global && global.GAME_CONFIG) {
      c = global.GAME_CONFIG;
    }
    return isObject(c) ? c : {};
  }

  function list(name) {
    var v = config()[name];
    return isArray(v) ? v : [];
  }

  function table(name) {
    var v = config()[name];
    return isObject(v) ? v : {};
  }

  function cap(name) {
    var caps = table("caps");
    return own(caps, name) && isNum(caps[name]) && caps[name] >= 0 ? caps[name] : Infinity;
  }

  /* Looks up lessons and worlds by id. Rebuilt only if the config's world list is replaced. */
  function index() {
    var ws = list("worlds"), i, j, w, ls;
    if (ws === indexedWorlds) { return; }
    lessonAt = {};
    worldAt = {};
    for (i = 0; i < ws.length; i++) {
      w = ws[i];
      if (!w || !goodKey(w.id)) { continue; }
      ls = isArray(w.lessons) ? w.lessons : [];
      worldAt[w.id] = { world: w, w: i, lessons: ls };
      for (j = 0; j < ls.length; j++) {
        if (ls[j] && goodKey(ls[j].id)) { lessonAt[ls[j].id] = { world: w, w: i, l: j, lessons: ls }; }
      }
    }
    indexedWorlds = ws;
  }

  /* ---------- dates ---------- */

  function now() {
    var t;
    try { t = typeof Game._now === "function" ? Game._now() : NaN; } catch (e) { t = NaN; }
    return isNum(t) ? t : new Date().getTime();
  }

  function pad(n, width) {
    var s = String(n);
    while (s.length < width) { s = "0" + s; }
    return s;
  }

  /* Milliseconds -> the LOCAL calendar day, "YYYY-MM-DD". */
  function dateOf(ms) {
    var d = new Date(ms);
    return pad(d.getFullYear(), 4) + "-" + pad(d.getMonth() + 1, 2) + "-" + pad(d.getDate(), 2);
  }

  /* "YYYY-MM-DD" -> a whole day number, so two days can be subtracted without any
     trouble from clock changes. NaN when the text is not a date. */
  function dayNumber(s) {
    var m = typeof s === "string" ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(s) : null;
    var month, day;
    if (!m) { return NaN; }
    month = +m[2];
    day = +m[3];
    if (month < 1 || month > 12 || day < 1 || day > 31) { return NaN; }
    return Math.round(Date.UTC(+m[1], month - 1, day) / DAY_MS);
  }

  function isDay(s) { return !isNaN(dayNumber(s)); }

  /* ---------- state ---------- */

  function fresh() {
    return {
      v: 1, xp: 0, name: "",
      done: {}, badges: {}, days: [],
      run: { current: 0, best: 0, last: null },
      quiz: {}, ticks: {},
      settings: { quiet: false, large: false, openAll: false },
      resume: null,
      migrated: 0
    };
  }

  /* The run rule. Called once for every logged activity, with that activity's local day and
     the days logged before it. The gap is measured from the latest logged day before this
     one, not from the day logged last, so an activity logged while the device clock was
     behind cannot make the next real day look like a long absence. A day already logged,
     or one earlier than every logged day, changes nothing; a day that is earlier than some
     logged day never starts the run again. */
  function stepRun(run, days, day) {
    var n = dayNumber(day), prev = NaN, later = false, i, d;
    var known = days.length ? days : (run.last ? [run.last] : []);
    if (!known.length) {
      run.current = 1;
    } else if (known.indexOf(day) === -1) {
      for (i = 0; i < known.length; i++) {
        d = dayNumber(known[i]);
        if (d > n) { later = true; } else if (isNaN(prev) || d > prev) { prev = d; }
      }
      if (n - prev >= 4) {
        if (!later) { run.current = 1; }
      } else if (n - prev >= 1) {
        run.current += 1;
      }
    }
    if (run.current < 1) { run.current = 1; }
    if (run.current > run.best) { run.best = run.current; }
    run.last = day;
  }

  /* The latest logged day that is not after the given one, or null. */
  function lastDayBy(day) {
    var n = dayNumber(day), best = null, i, d;
    for (i = 0; i < state.days.length; i++) {
      d = dayNumber(state.days[i]);
      if (d <= n && (best === null || d > dayNumber(best))) { best = state.days[i]; }
    }
    return best;
  }

  function cleanName(s) {
    var out = String(s === null || s === undefined ? "" : s);
    out = out.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").replace(/^ | $/g, "");
    return out.slice(0, MAX_NAME);
  }

  /* Checks a parsed save and returns a clean copy, or null when the shape is wrong.
     The core (v, xp, done) must be right. Smaller damage is repaired, never thrown on. */
  function normalize(o) {
    var s, k, e, i, total = 0, r;
    if (!isObject(o) || o.v !== 1 || !isNum(o.xp) || o.xp < 0 || !isObject(o.done)) { return null; }
    s = fresh();

    for (k in o.done) {
      if (!own(o.done, k) || !goodKey(k)) { continue; }
      e = o.done[k];
      if (!isObject(e) || !isNum(e.xp) || e.xp < 0) { continue; }
      s.done[k] = { xp: Math.floor(e.xp), t: isNum(e.t) ? e.t : 0 };
      total += s.done[k].xp;
    }
    s.xp = Math.min(total, cap("xp"));

    if (typeof o.name === "string") { s.name = cleanName(o.name); }

    if (isObject(o.badges)) {
      for (k in o.badges) {
        if (own(o.badges, k) && goodKey(k) && isNum(o.badges[k])) { s.badges[k] = o.badges[k]; }
      }
    }

    if (isArray(o.days)) {
      for (i = 0; i < o.days.length; i++) {
        if (isDay(o.days[i]) && s.days.indexOf(o.days[i]) === -1) { s.days.push(o.days[i]); }
      }
      s.days.sort();
    }

    r = o.run;
    if (isObject(r) && isDay(r.last) && isNum(r.current) && isNum(r.best) &&
        r.current >= 1 && r.best >= r.current) {
      s.run = { current: Math.floor(r.current), best: Math.floor(r.best), last: r.last };
    } else {
      /* Missing or damaged: work the run out again from the days themselves. */
      for (i = 0; i < s.days.length; i++) { stepRun(s.run, s.days.slice(0, i), s.days[i]); }
    }

    if (isObject(o.quiz)) {
      for (k in o.quiz) {
        e = o.quiz[k];
        if (own(o.quiz, k) && goodKey(k) && isObject(e)) {
          s.quiz[k] = { best: whole(e.best), tries: whole(e.tries) };
        }
      }
    }

    if (isObject(o.ticks)) {
      for (k in o.ticks) {
        if (own(o.ticks, k) && goodKey(k) && typeof o.ticks[k] === "boolean") { s.ticks[k] = o.ticks[k]; }
      }
    }

    if (isObject(o.settings)) {
      for (i = 0; i < SETTING_NAMES.length; i++) {
        s.settings[SETTING_NAMES[i]] = o.settings[SETTING_NAMES[i]] === true;
      }
    }

    if (isObject(o.resume)) { s.resume = copy(o.resume); }
    s.migrated = whole(o.migrated);
    return s;
  }

  function parseState(raw) {
    try { return normalize(JSON.parse(raw)); } catch (e) { return null; }
  }

  /* ---------- storage (every use is guarded) ---------- */

  function storage() {
    try {
      if (typeof localStorage !== "undefined" && localStorage) { return localStorage; }
    } catch (e) { /* blocked: fall through */ }
    return null;
  }

  /* Returns the stored text, null when the key is absent, undefined when storage cannot be read. */
  function readKey(key) {
    var s = storage(), v;
    if (!s) { return undefined; }
    try { v = s.getItem(key); } catch (e) { return undefined; }
    return typeof v === "string" ? v : null;
  }

  function probe() {
    var s = storage(), ok = false;
    if (!s) { return false; }
    try {
      s.setItem(PROBE_KEY, "1");
      ok = s.getItem(PROBE_KEY) === "1";
      s.removeItem(PROBE_KEY);
    } catch (e) { ok = false; }
    return ok;
  }

  function save() {
    var s = storage(), raw, back;
    try { raw = JSON.stringify(state); } catch (e) { saveOk = false; return false; }
    if (!s) { saveOk = false; return false; }
    try {
      s.setItem(KEY, raw);
      back = s.getItem(KEY);
    } catch (e2) { saveOk = false; return false; }
    if (back === raw) {
      lastRaw = raw;
      saveOk = true;
    } else {
      /* Storage took the call but did not keep the text. Carry on in memory. */
      lastRaw = typeof back === "string" ? back : null;
      saveOk = false;
    }
    return saveOk;
  }

  /* Picks up a save written by another tab, so that two open pages never overwrite each
     other's progress. Runs before every change. Returns true when the state was replaced. */
  function sync() {
    var raw = readKey(KEY), st;
    if (raw === undefined || raw === lastRaw) { return false; }
    if (raw === null) {
      state = fresh();
      lastRaw = null;
      return true;
    }
    st = parseState(raw);
    if (!st) { return false; }
    state = st;
    lastRaw = raw;
    return true;
  }

  /* ---------- events ---------- */

  function emit(event, payload) {
    var fns = own(listeners, event) ? listeners[event].slice() : [], i;
    for (i = 0; i < fns.length; i++) {
      try { fns[i](payload); } catch (e) { /* a listener must never stop the engine */ }
    }
  }

  /* Fires the events for a batch of awards, after the state has been saved. */
  function announce(items, silent) {
    var i, j, res;
    for (i = 0; i < items.length; i++) {
      res = items[i].res;
      if (!res.awarded) { continue; }
      if (!silent) { emit("award", { id: items[i].id, xp: res.xp }); }
      for (j = 0; j < res.newBadges.length; j++) { emit("badge", res.newBadges[j]); }
      if (res.rankUp) { emit("rank", res.rankUp); }
    }
    emit("change");
  }

  /* ---------- reading the state ---------- */

  function has(id) { return goodKey(id) && own(state.done, id); }

  function count(prefix) {
    var p = prefix === undefined || prefix === null ? "" : String(prefix), n = 0, k;
    for (k in state.done) {
      if (own(state.done, k) && k.indexOf(p) === 0) { n += 1; }
    }
    return n;
  }

  function rankIndex(xp) {
    var ranks = list("ranks"), at = 0, i;
    for (i = 0; i < ranks.length; i++) {
      if (ranks[i] && isNum(ranks[i].minXp) && ranks[i].minXp <= xp) { at = i; }
    }
    return at;
  }

  function rankIcon(id) { return "img/ranks/" + id + ".svg"; }

  function rankInfo(xp) {
    var ranks = list("ranks"), i = rankIndex(xp);
    var cur = ranks[i] || { index: 0, id: "", name: "", minXp: 0, blurb: "" };
    var nxt = ranks[i + 1] || null;
    var span = nxt ? nxt.minXp - cur.minXp : 0;
    var pct = 100;
    if (nxt) {
      pct = span > 0 ? Math.floor(100 * (xp - cur.minXp) / span) : 0;
      if (pct < 0) { pct = 0; }
      if (pct > 100) { pct = 100; }
    }
    return {
      index: isNum(cur.index) ? cur.index : i,
      id: cur.id, name: cur.name, minXp: cur.minXp, blurb: cur.blurb,
      icon: rankIcon(cur.id),
      next: nxt ? { name: nxt.name, minXp: nxt.minXp } : null,
      toNext: nxt ? Math.max(0, nxt.minXp - xp) : 0,
      pct: pct
    };
  }

  function badgeView(b) {
    var earned = own(state.badges, b.id);
    return {
      id: b.id, name: b.name, how: b.how,
      icon: "img/badges/" + b.id + ".svg",
      earned: earned,
      when: earned ? state.badges[b.id] : null
    };
  }

  function isPassed(lessonId) { return has("lesson:" + lessonId) || has("skip:" + lessonId); }

  function worldLessonsDone(worldId) {
    var at, i;
    index();
    if (!own(worldAt, worldId)) { return false; }
    at = worldAt[worldId];
    if (!at.lessons.length) { return false; }
    for (i = 0; i < at.lessons.length; i++) {
      if (!at.lessons[i] || !has("lesson:" + at.lessons[i].id)) { return false; }
    }
    return true;
  }

  function ruleMet(rule) {
    if (!isObject(rule)) { return false; }
    switch (rule.type) {
      case "count": return isNum(rule.n) && typeof rule.prefix === "string" && count(rule.prefix) >= rule.n;
      case "has": return has(rule.id);
      case "streak": return isNum(rule.n) && Math.max(state.run.current, state.run.best) >= rule.n;
      case "xp": return isNum(rule.n) && state.xp >= rule.n;
      case "world": return worldLessonsDone(rule.id);
      default: return false;
    }
  }

  /* Badges are only ever added. Returns the ones earned just now. */
  function checkBadges(t) {
    var all = list("badges"), fresh1 = [], i, b;
    for (i = 0; i < all.length; i++) {
      b = all[i];
      if (!b || !goodKey(b.id) || own(state.badges, b.id)) { continue; }
      if (ruleMet(b.rule)) {
        state.badges[b.id] = t;
        fresh1.push(badgeView(b));
      }
    }
    return fresh1;
  }

  /* ---------- changing the state ---------- */

  function blank() { return { awarded: false, xp: 0, newBadges: [], rankUp: null }; }

  /* Points this id would pay right now: the default for its kind (or the number given),
     then the rule cap, the daily cap and the overall cap. */
  function pointsFor(kind, xp) {
    var xpTable = table("xp"), pay, room;
    if (isNum(xp)) {
      pay = xp;
    } else {
      pay = own(xpTable, kind) && isNum(xpTable[kind]) ? xpTable[kind] : 0;
    }
    pay = whole(pay);
    if (kind === "rule" && count("rule:") >= cap("rules")) { pay = 0; }
    if (kind === "daily" && count("daily:") >= cap("daily")) { pay = 0; }
    room = cap("xp") - state.xp;
    if (room < 0) { room = 0; }
    return pay > room ? room : pay;
  }

  /* Logs one activity in memory. Saving and events are left to the caller. */
  function logOne(id, xp) {
    var res = blank(), t, day, kind, pay, before;
    if (!goodKey(id) || own(state.done, id)) { return res; }
    t = now();
    day = dateOf(t);
    kind = kindOf(id);
    pay = pointsFor(kind, xp);
    before = rankIndex(state.xp);

    state.done[id] = { xp: pay, t: t };
    state.xp += pay;
    stepRun(state.run, state.days, day);
    if (state.days.indexOf(day) === -1) {
      state.days.push(day);
      state.days.sort();
    }
    if (kind === "lesson" && state.resume && state.resume.lesson === id.slice(kind.length + 1)) {
      state.resume = null;
    }

    res.awarded = true;
    res.xp = pay;
    res.newBadges = checkBadges(t);
    if (rankIndex(state.xp) > before) { res.rankUp = rankInfo(state.xp); }
    return res;
  }

  /* Ticks one Guided Study box in memory: the marker, then each card it stands for. */
  function tickOn(key) {
    var study = table("study"), cards = own(study, key) && isArray(study[key]) ? study[key] : [];
    var items = [], i, id;
    state.ticks[key] = true;
    id = "study:" + key;
    items.push({ id: id, res: logOne(id) });
    for (i = 0; i < cards.length; i++) {
      id = "sutta:" + cards[i];
      items.push({ id: id, res: logOne(id) });
    }
    return items;
  }

  /* A library card has just been read. A Guided Study box whose cards are now all read shows
     as ticked, so it gets its marker as well (the badge counts markers). A box the learner
     un-ticked by hand stays un-ticked, and a box with no cards is never touched. */
  function tickFromCard(card, items) {
    var study = table("study"), key, cards, i, all, id;
    for (key in study) {
      if (!own(study, key) || !goodKey(key)) { continue; }
      cards = isArray(study[key]) ? study[key] : [];
      id = "study:" + key;
      if (cards.indexOf(card) === -1 || has(id)) { continue; }
      if (own(state.ticks, key) && state.ticks[key] === false) { continue; }
      all = true;
      for (i = 0; i < cards.length; i++) {
        if (!has("sutta:" + cards[i])) { all = false; }
      }
      if (!all) { continue; }
      state.ticks[key] = true;
      items.push({ id: id, res: logOne(id) });
    }
  }

  /* Folds several award results into one, in the same shape as a single award. */
  function fold(items) {
    var out = blank(), i, res;
    for (i = 0; i < items.length; i++) {
      res = items[i].res;
      if (!res.awarded) { continue; }
      out.awarded = true;
      out.xp += res.xp;
      out.newBadges = out.newBadges.concat(res.newBadges);
      if (res.rankUp) { out.rankUp = res.rankUp; }
    }
    return out;
  }

  /* Old Guided Study ticks, from before the game: { "u1-1": true }. Counted once, quietly. */
  function migrateOld() {
    var raw = readKey(OLD_KEY), old, k, n = 0;
    if (typeof raw !== "string") { return; }
    try { old = JSON.parse(raw); } catch (e) { return; }
    if (!isObject(old)) { return; }
    for (k in old) {
      if (own(old, k) && old[k] === true && goodKey(k)) {
        tickOn(k);
        n += 1;
      }
    }
    if (n > 0) {
      state.migrated = n;
      save();
    }
  }

  function load() {
    var raw = readKey(KEY);
    var st = typeof raw === "string" ? parseState(raw) : null;
    saveOk = probe();
    lastRaw = typeof raw === "string" ? raw : null;
    if (st) {
      state = st;
      return;
    }
    /* Nothing saved, or a save that cannot be read: start fresh and never throw. */
    state = fresh();
    migrateOld();
  }

  /* ---------- the public API ---------- */

  Game._now = function () { return new Date().getTime(); };

  Game.today = function () { return dateOf(now()); };

  Game.canSave = function () { return saveOk; };

  Game.award = function (id, xp, opts) {
    var res, items;
    if (isObject(xp) && opts === undefined) { opts = xp; xp = undefined; }
    if (!goodKey(id)) { return blank(); }
    sync();
    res = logOne(id, xp);
    if (!res.awarded) { return res; }
    items = [{ id: id, res: res }];
    if (kindOf(id) === "sutta") { tickFromCard(id.slice(6), items); }
    save();
    announce(items, !!(opts && opts.silent));
    return fold(items);
  };

  Game.has = function (id) { return has(id); };

  Game.count = function (prefix) { return count(prefix); };

  Game.xp = function () { return state.xp; };

  Game.ranks = function () {
    var ranks = list("ranks"), out = [], i, r;
    for (i = 0; i < ranks.length; i++) {
      r = ranks[i];
      if (!r) { continue; }
      out.push({ index: r.index, id: r.id, name: r.name, minXp: r.minXp, blurb: r.blurb, icon: rankIcon(r.id) });
    }
    return out;
  };

  Game.rank = function () { return rankInfo(state.xp); };

  Game.badges = function () {
    var all = list("badges"), out = [], i;
    for (i = 0; i < all.length; i++) {
      if (all[i] && goodKey(all[i].id)) { out.push(badgeView(all[i])); }
    }
    return out;
  };

  Game.streak = function () {
    var day = Game.today(), last = lastDayBy(day) || state.run.last;
    return {
      current: state.run.current,
      best: state.run.best,
      activeToday: state.days.indexOf(day) !== -1,
      daysSince: last ? Math.max(0, dayNumber(day) - dayNumber(last)) : null,
      total: state.days.length
    };
  };

  Game.lessonsToday = function () {
    var day = Game.today(), n = 0, k;
    for (k in state.done) {
      if (own(state.done, k) && k.indexOf("lesson:") === 0 && dateOf(state.done[k].t) === day) { n += 1; }
    }
    return n;
  };

  Game.skip = function (lessonId) {
    var id, res;
    if (!goodKey(lessonId) || list("headsUp").indexOf(lessonId) === -1) { return false; }
    sync();
    if (has("lesson:" + lessonId)) { return false; }
    id = "skip:" + lessonId;
    if (has(id)) { return true; }
    if (state.resume && state.resume.lesson === lessonId) { state.resume = null; }
    res = logOne(id, 0);
    save();
    announce([{ id: id, res: res }], false);
    return true;
  };

  Game.isSetAside = function (lessonId) {
    return has("skip:" + lessonId) && !has("lesson:" + lessonId);
  };

  Game.isPassed = function (lessonId) { return isPassed(lessonId); };

  Game.isUnlocked = function (lessonId) {
    var at, ws;
    index();
    if (!goodKey(lessonId) || !own(lessonAt, lessonId)) { return false; }
    if (state.settings.openAll === true) { return true; }
    if (has("lesson:" + lessonId)) { return true; }       /* a finished lesson can always be replayed */
    at = lessonAt[lessonId];
    if (at.l > 0) { return isPassed(at.lessons[at.l - 1].id); }
    if (at.w === 0) { return true; }
    ws = list("worlds");
    return !!ws[at.w - 1] && has("boss:" + ws[at.w - 1].id);
  };

  Game.worldProgress = function (worldId) {
    var out = { done: 0, setAside: 0, total: 0, complete: false, allDone: false, bossDone: false, bossReady: false };
    var at, i, id;
    index();
    if (!goodKey(worldId) || !own(worldAt, worldId)) { return out; }
    at = worldAt[worldId];
    out.total = at.lessons.length;
    for (i = 0; i < at.lessons.length; i++) {
      id = at.lessons[i].id;
      if (has("lesson:" + id)) { out.done += 1; } else if (has("skip:" + id)) { out.setAside += 1; }
    }
    out.complete = out.total > 0 && out.done + out.setAside === out.total;
    out.allDone = out.total > 0 && out.done === out.total;
    out.bossDone = has("boss:" + worldId);
    out.bossReady = out.complete && !out.bossDone;
    return out;
  };

  Game.nextStep = function () {
    var ws = list("worlds"), i, j, w, ls;
    for (i = 0; i < ws.length; i++) {
      w = ws[i];
      if (!w || !goodKey(w.id)) { continue; }
      ls = isArray(w.lessons) ? w.lessons : [];
      for (j = 0; j < ls.length; j++) {
        if (!isPassed(ls[j].id)) { return { type: "lesson", id: ls[j].id, world: w.id }; }
      }
      if (!has("boss:" + w.id)) { return { type: "boss", world: w.id }; }
    }
    return null;
  };

  Game.trailDone = function () {
    var ws = list("worlds"), i;
    if (!ws.length) { return false; }
    for (i = 0; i < ws.length; i++) {
      if (!ws[i] || !has("boss:" + ws[i].id)) { return false; }
    }
    return true;
  };

  /* Stores the best score and the number of tries. A full score on the first picks also
     logs the quiet "quiz:<lessonId>" marker (0 points) that one badge counts. */
  Game.quizResult = function (lessonId, score, total) {
    var sc = whole(score), tot = whole(total), q, res = blank(), perfect, id;
    if (!goodKey(lessonId)) { return null; }
    if (tot > 0 && sc > tot) { sc = tot; }
    sync();
    q = own(state.quiz, lessonId) ? state.quiz[lessonId] : { best: 0, tries: 0 };
    q = { best: Math.max(q.best, sc), tries: q.tries + 1 };
    state.quiz[lessonId] = q;
    perfect = tot > 0 && sc >= tot;
    id = "quiz:" + lessonId;
    if (perfect) { res = logOne(id); }
    save();
    announce([{ id: id, res: res }], false);
    return { best: q.best, tries: q.tries, perfect: perfect, newBadges: res.newBadges, rankUp: res.rankUp };
  };

  Game.studyTick = function (key, checked, opts) {
    var items = [], changed = false, out;
    if (!goodKey(key)) { return blank(); }
    sync();
    if (checked) {
      changed = !(own(state.ticks, key) && state.ticks[key] === true);
      items = tickOn(key);
    } else {
      changed = !(own(state.ticks, key) && state.ticks[key] === false);
      state.ticks[key] = false;       /* only the tick is cleared; nothing is removed */
    }
    out = fold(items);
    if (changed || out.awarded) {
      save();
      announce(items, !!(opts && opts.silent));
    }
    return out;
  };

  Game.studyChecked = function (key) {
    var study = table("study"), cards, i;
    if (!goodKey(key)) { return false; }
    if (own(state.ticks, key)) { return state.ticks[key] === true; }
    cards = own(study, key) && isArray(study[key]) ? study[key] : [];
    if (!cards.length) { return false; }
    for (i = 0; i < cards.length; i++) {
      if (!has("sutta:" + cards[i])) { return false; }
    }
    return true;
  };

  Game.setting = function (name, value) {
    var v;
    if (SETTING_NAMES.indexOf(name) === -1) { return undefined; }
    if (arguments.length < 2) { return state.settings[name] === true; }
    v = !!value;
    sync();
    if (state.settings[name] !== v) {
      state.settings[name] = v;
      save();
      emit("change");
    }
    return v;
  };

  /* A bookmark, not progress: it is saved, but it does not fire "change". */
  Game.resume = function (obj) {
    var next = null;
    if (arguments.length === 0) { return state.resume ? copy(state.resume) : null; }
    if (isObject(obj)) {
      try { next = copy(obj); } catch (e) { next = null; }
    }
    sync();
    if (JSON.stringify(next) !== JSON.stringify(state.resume)) {
      state.resume = next;
      save();
    }
    return next ? copy(next) : null;
  };

  Game.name = function () { return state.name; };

  Game.setName = function (s) {
    var n = cleanName(s);
    sync();
    if (state.name !== n) {
      state.name = n;
      save();
      emit("change");
    }
    return n;
  };

  /* Events: "change", "award" ({ id, xp }), "badge" (badge), "rank" (rank).
     Returns a function that removes the listener again. */
  Game.on = function (event, fn) {
    if (typeof event !== "string" || event === "__proto__" || typeof fn !== "function") {
      return function () {};
    }
    if (!own(listeners, event)) { listeners[event] = []; }
    listeners[event].push(fn);
    return function () {
      var i = own(listeners, event) ? listeners[event].indexOf(fn) : -1;
      if (i !== -1) { listeners[event].splice(i, 1); }
    };
  };

  Game.exportData = function () {
    sync();
    return JSON.stringify(state);
  };

  Game.importData = function (json) {
    var st = null;
    try {
      st = normalize(typeof json === "string" ? JSON.parse(json) : json);
    } catch (e) { st = null; }
    if (!st) { return false; }
    state = st;
    save();
    emit("change");
    return true;
  };

  /* Start over: clears everything, settings included, and the old Guided Study ticks too,
     so that they are not counted a second time on the next visit. */
  Game.reset = function () {
    var s = storage();
    state = fresh();
    if (s) {
      try { s.removeItem(KEY); } catch (e) { /* tried */ }
      try { s.removeItem(OLD_KEY); } catch (e2) { /* tried */ }
    }
    if (typeof readKey(KEY) === "string") { save(); } else { lastRaw = null; }
    emit("change");
  };

  /* Not part of the contract table. A page may call this when another tab has saved
     (the browser's "storage" or "pageshow" event) to show that tab's progress at once. */
  Game._sync = function () {
    var replaced = sync();
    if (replaced) { emit("change"); }
    return replaced;
  };

  load();

  if (typeof window !== "undefined" && window) {
    window.Game = Game;
  } else if (typeof global !== "undefined" && global) {
    global.Game = Game;
  }

  return Game;
})();

if (typeof module !== "undefined" && module.exports) { module.exports = Game; }

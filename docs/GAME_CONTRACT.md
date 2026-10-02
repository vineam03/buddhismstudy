# Game layer contract

How the "zero to hero" game layer fits together. Two documents govern it:

- [game-spec.json](game-spec.json) is the **design**: worlds, lessons, titles, badges, points,
  the streak rule, the home-page flow, the writing, accessibility and humane-design rules.
- This file is the **technical contract**: file names, data shapes, the engine API.
  Where the two differ on a technical detail, this file wins.

`js/data/game-config.js` is generated from the spec by `node tools/build-config.js`.
Never edit it by hand.

The site is static: plain HTML, CSS and JavaScript, no build step, no dependencies, and it must
work when opened from disk (`file://`) as well as over http. That is why data lives in `.js`
files that set `window.*` globals rather than in fetched JSON. Use ES5 syntax only (`var`,
`function`, no arrow functions, no template literals, no `let`/`const`), matching the existing
`js/suttas.js` and `js/vinaya.js`.

## 0. Words the learner sees

| Internal name | The learner always sees |
|---|---|
| path, world map | **the Trail** ("path" is kept for the Buddha's training) |
| XP | **points** |
| rank | **title** |
| boss | **check** (for example "The Starting Gate Check") |
| streak | "Recent days", later "In Tune" (drawn as lute strings, never a flame) |
| lens (Modern Life) | **topic** |

## 1. Files

| File | Purpose |
|---|---|
| `css/game.css` | Shared game styles: buttons, panels, HUD, toasts, award buttons, run display, Quiet Mode and Larger Text rules, print rules. |
| `css/trail.css`, `css/profile.css`, `css/glossary.css` | Page styles. Each page links `css/styles.css`, then `css/game.css`, then its own file. |
| `js/data/game-config.js` | Generated. `window.GAME_CONFIG`. See section 3. |
| `js/game.js` | The engine, `window.Game`. No DOM access, so it runs under Node for tests. |
| `js/site.js` | Shared page chrome: navigation, HUD, toasts, award buttons, settings classes. |
| `js/daily.js` | The "One Quiet Minute" card, `window.Daily.mount(element)`. |
| `js/data/trail-w0.js` … `trail-w7.js` | One file per world: lessons and checks. |
| `trail.html`, `js/trail.js` | The Trail: map, lesson player, world checks. |
| `profile.html`, `js/profile.js` | "My Journey": titles, badges, counts, settings, backup, start over. |
| `glossary.html`, `js/glossary.js`, `js/data/glossary.js` | Plain-English word list and flashcards. |
| `js/data/suttas-easy-<dn|mn1|mn2|sn|an|kn>.js` | A plain-words line and one check question per library card. |
| `img/` | Original SVG graphics, CC0. See section 8. |
| `tools/validate.js` | Checks all game data and graphics. Must pass before any commit. |
| `tools/test-game.js` | Node unit tests for the engine. |
| `tools/shot.js` | Headless screenshot of any page: `node tools/shot.js trail.html out.png 420 900`. |

Script order on every page: page data files, then `js/data/game-config.js`, `js/game.js`,
`js/site.js`, then the page's own script.

## 2. Activity ids

Everything a learner can do has one id. Logging the same id twice does nothing.

| Id | Logged when | Points |
|---|---|---|
| `lesson:<lessonId>` | The learner reaches a lesson's reward card. | 30 |
| `skip:<lessonId>` | A heads-up lesson is set aside. Marker only. | 0 |
| `quiz:<lessonId>` | All 3 quick-check questions answered right on the first pick in one run. Marker for a badge. | 0 |
| `boss:<worldId>` | The world check is finished. | 50 |
| `sutta:<cardId>` | "I have read this" on a library card, or the matching Guided Study box. | 10 |
| `suttaq:<cardId>` | That card's check question answered right (unlimited retries). | 5 |
| `rule:<cat>-<n>` | "I have read this story" inside an open Vinaya rule, e.g. `rule:pacittiya-51`. Never by merely opening a rule. | 2 for the first 50, then 0 |
| `study:<key>` | A Guided Study box is ticked; `<key>` is its `data-r` value. Marker. | 0 |
| `jw:<n>` | "I have read this" on a numbered Journey to the West episode, `n` = 1 to 14 from the heading number. | 10 |
| `theme:<sectionId>` | "I have read this" on a Modern Life topic, e.g. `theme:career`. | 10 |
| `gloss:<termId>` | A glossary flashcard is flipped for the first time. | 2 |
| `daily:<YYYY-MM-DD>` | One Quiet Minute done that local day. | 5 for the first 30 days, then 0 |

The part before the first colon is the *kind*. Default points per kind are in `GAME_CONFIG.xp`.
Points are never added past `GAME_CONFIG.caps.xp` (the last title's threshold).

## 3. `window.GAME_CONFIG` (generated)

```js
{
  ranks:  [{ index, id, name, minXp, blurb }],             // 10 titles
  xp:     { lesson: 30, quiz: 0, boss: 50, sutta: 10, suttaq: 5, rule: 2, study: 0, jw: 10, theme: 10, gloss: 2, daily: 5, skip: 0 },
  caps:   { xp: 2200, rules: 50, daily: 30, runShown: 7 },
  badges: [{ id, name, how, rule }],                        // rule: see section 4
  worlds: [{ id, order, title, tagline, stage, goal, bossTitle,
             lessons: [{ id, title, icon, objective }] }],  // in Trail order
  words:  [{ lesson, term, say, old, means }],              // the 20 words the Trail teaches
  headsUp:     ["w1-l4", "w1-l5", "w7-l5"],                 // may be set aside
  noAutoDaily: ["w1-l4", "w1-l5", "w6-l6", "w7-l3"],        // never auto-picked as daily practice
  cards:  { "<cardId>": { ref: "SN 36.6", title: "The Two Arrows" } },   // all 67 library cards
  study:  { "<data-r key>": ["<cardId>", ...] },            // Guided Study box -> library cards
  noBossQuestion: ["w1-l5", ...],                           // lessons with no question in their world check
  streakRule, dailyPractice                                 // text from the spec
}
```

## 4. The engine: `window.Game` (js/game.js)

State is one JSON object in `localStorage` under `buddhismstudy-game-v1`:

```js
{ v: 1, xp: 0, name: "",
  done:   { "<activityId>": { xp: 30, t: 1759300000000 } },
  badges: { "<badgeId>": 1759300000000 },
  days:   ["2026-10-01"],                       // every local day with at least one logged activity
  run:    { current: 1, best: 1, last: "2026-10-01" },
  quiz:   { "<lessonId>": { best: 3, tries: 2 } },
  ticks:  { "<study key>": true },              // visual state of Guided Study boxes
  settings: { quiet: false, large: false, openAll: false },
  resume: { lesson: "w1-l2", card: 3 },         // where the learner left a lesson, or null
  migrated: 0 }                                 // number of old Guided Study ticks counted
```

If `localStorage` is missing, full or throws, the engine keeps state in memory, still works, and
`Game.canSave()` returns `false`. A corrupted save must never throw: fall back to a fresh state.
On first load it migrates the old key `buddhismstudy-progress` (`{ "u1-1": true }`): each true key
is passed through `studyTick`, silently, and `migrated` records how many.

| Call | Returns / does |
|---|---|
| `Game.award(id, xp, opts)` | Logs once. `xp` optional: default from `GAME_CONFIG.xp[kind]`, with the rule and daily caps and the global cap applied. `opts.silent` suppresses the `award` event (badge and title events still fire). Updates the run. Returns `{ awarded, xp, newBadges: [badge], rankUp: rank or null }`. |
| `Game.has(id)` | `true` if logged. |
| `Game.count(prefix)` | Number of logged ids starting with `prefix`. |
| `Game.xp()` | Total points. |
| `Game.ranks()` | `GAME_CONFIG.ranks`, each with `icon` (`img/ranks/<id>.svg`). |
| `Game.rank()` | `{ index, id, name, minXp, blurb, icon, next: { name, minXp } or null, toNext, pct }`. `pct` is 0 to 100 toward the next title (100 at the last). |
| `Game.badges()` | Every badge `{ id, name, how, icon, earned, when }`, `icon` = `img/badges/<id>.svg`. |
| `Game.streak()` | `{ current, best, activeToday, daysSince, total }`. Real numbers; the cap at 7 is applied only when displayed. `daysSince` is whole days since the last logged day (`null` if none), `total` is `days.length`. |
| `Game.lessonsToday()` | Number of `lesson:` ids logged today. |
| `Game.skip(lessonId)` | Sets a heads-up lesson aside (`skip:` marker). Ignored for other lessons. |
| `Game.isSetAside(lessonId)` | Skipped and not yet done. |
| `Game.isPassed(lessonId)` | Done or set aside. |
| `Game.isUnlocked(lessonId)` | `true` if `settings.openAll`. Else: the first lesson of w0 is open; a later lesson in the same world opens when the lesson before it is passed; the first lesson of the next world opens when the previous world's check (`boss:`) is done. |
| `Game.worldProgress(worldId)` | `{ done, setAside, total, complete, allDone, bossDone, bossReady }`. `complete` = every lesson passed; `allDone` = every lesson done; `bossReady` = `complete && !bossDone`. |
| `Game.nextStep()` | `{ type: "lesson", id, world }`, `{ type: "boss", world }`, or `null` when the whole Trail and all checks are done. Walks the Trail in order and returns the first lesson not passed, or the first check that is ready. |
| `Game.trailDone()` | `true` when every world check is done. |
| `Game.quizResult(lessonId, score, total)` | Stores best score and number of tries. |
| `Game.studyTick(key, checked)` | Sets `ticks[key]`. When checked: logs `study:<key>` and `sutta:<cardId>` for each card in `GAME_CONFIG.study[key]`. Un-ticking removes nothing. |
| `Game.studyChecked(key)` | `ticks[key]` if set, else `true` when the key has cards and all are read. |
| `Game.setting(name, value)` | Get (one argument) or set a setting: `quiet`, `large`, `openAll`. |
| `Game.resume(obj)` | Get (no argument) or set the resume point; pass `null` to clear. |
| `Game.name()`, `Game.setName(s)` | Optional display name. |
| `Game.on(event, fn)` | Events: `change`, `award` (`{ id, xp }`), `badge` (badge), `rank` (rank). |
| `Game.today()` | Local date `YYYY-MM-DD`. Tests override `Game._now = function () { return ms; }`. |
| `Game.canSave()` | `false` when storage is unavailable. |
| `Game.exportData()`, `Game.importData(json)` | Backup and restore. Import validates the shape and returns `true` or `false`; it never throws. |
| `Game.reset()` | Clears everything, including settings. |

**Run (streak) rule**, run whenever an activity is logged on local day D: no earlier day, run = 1.
Otherwise gap = D minus `run.last` in days. Gap 0 or negative: no change. Gap 1, 2 or 3: run + 1.
Gap 4 or more: run = 1. Then `best = max(best, current)` and `last = D`. Streak badges are checked
against `max(current, best)`.

**Badge rules** (`GAME_CONFIG.badges[i].rule`), re-checked after every award, never removed:
`{ type: "count", prefix, n }`, `{ type: "has", id }`, `{ type: "streak", n }`, `{ type: "xp", n }`,
`{ type: "world", id }` (every lesson in that world *done*, not merely set aside).

`js/game.js` must work under Node: read config from `window.GAME_CONFIG` or `global.GAME_CONFIG`,
guard every `localStorage` use, and end with
`if (typeof module !== "undefined" && module.exports) { module.exports = Game; }`.

Decisions made while building the engine, where the table above was silent:

- The rule, daily and overall caps apply whether the points come from the default or from a
  number passed in. Negative numbers become 0; fractions are floored.
- `Game.quizResult` logs the `quiz:<lessonId>` marker itself when `score >= total`, and returns
  `{ best, tries, perfect, newBadges, rankUp }`. Pages do not award the marker separately.
- `Game.resume(obj)` saves without firing `change` (so the lesson player does not redraw in a
  loop) and keeps any extra fields on the object. `Game.skip` clears a resume point on that lesson.
- `Game.reset()` also removes the old `buddhismstudy-progress` key, so "Start over" is not undone
  by the migration on the next page load.
- A lesson that is already done is always open, so it can be replayed. An unknown lesson id is
  never open, even with `openAll`.
- Load and import require `v === 1`, a non-negative numeric `xp` and a plain-object `done`;
  smaller damage is repaired (points re-added from `done`, days de-duplicated, the run rebuilt).
- Two open tabs: before every change the engine re-reads storage if another tab has saved.
  `Game._sync()` does the same on demand.
- `Game.on()` returns a function that removes the listener. `Game.studyTick` accepts
  `opts.silent` and returns a combined `{ awarded, xp, newBadges, rankUp }`.
- There is no `Game.state()`, `Game.revoke()` or `Game.nextLesson()`; use `exportData()`,
  `reset()` / `importData()` and `nextStep()`.
- Reading the last library card of a Guided Study box also logs `study:<key>` and sets
  `ticks[key]`, unless the learner explicitly un-ticked that box. So the Guided Study page,
  My Journey and the Study Buddy badge always agree.
- Run rule, exact form: nothing logged yet, run = 1. Day D already logged, or earlier than
  every logged day: no change. Otherwise gap = D minus the latest logged day before D; the
  run never moves `last` backwards when the clock goes back.

## 5. Shared chrome: `window.Site` (js/site.js) and css/game.css

Runs on every page after `game.js`.

1. **Navigation.** Replaces the contents of `nav.site-nav` from one list, so pages never need
   their nav edited again. Two labelled rows. *Start here*: Home (`index.html`), The Trail
   (`trail.html`), My Journey (`profile.html`), Glossary (`glossary.html`). *Library*: Curriculum,
   Guided Study, The Canon, Sutta Library, Monks’ Rules (`vinaya.html`), Modern Life, Journey West,
   Save as PDF (`everything.html`).
   The current page gets `class="active"` and `aria-current="page"`.
2. **HUD.** Inserts `<div class="hud no-print" id="hud">` directly after `header.site-header`.
   On `index.html`, `trail.html`, `profile.html`, `glossary.html`: title emblem and name, a slim
   bar with words ("120 points to the next title"), the run display, and a "Continue" link to
   `trail.html`. On every other page: only the title name and the "Continue" link. In Quiet Mode:
   only the "Continue" link. At the last title the bar is replaced by the word "Enough." and the
   number is hidden.
3. **Toasts.** One `aria-live="polite"` region, calm, one line: "Lesson done. 30 points.",
   "New badge: First Step.", "New title: Trail Finder." Never a toast for a 0-point marker.
   No toasts in Quiet Mode. No animation under `prefers-reduced-motion: reduce`.
4. **Award buttons.** `Site.awardButton(container, id, label)` appends
   `<button class="award-btn no-print">` showing the label and, small, the points
   ("I have read this · 10 points"); once logged it shows "✓ Done" and is disabled. On
   `themes.html` every `section.canon-book[id]` gets one for `theme:<id>`; on `journey.html`
   only cards whose heading starts with a number ("7. …") get one for `jw:<that number>`.
   Any element with `data-award="<id>"` and optional `data-label` is wired the same way.
5. **Settings classes.** Sets `quiet` and `large-text` classes on `<html>` from the engine's
   settings and keeps them in sync.
6. **Run display.** `Site.renderRun(element)` draws the lute strings and the words, following
   the streak rule in the spec (cap at 7, never zero, never "lost", "broken", "missed", "failed").
7. `window.Site = { toast(text, iconUrl), refresh(), awardButton(container, id, label), renderRun(element), pointsWord(n) }`.
   `pointsWord(1)` is "1 point", `pointsWord(30)` is "30 points".

Decisions made while building the chrome:

- The "Continue" link goes straight to the next step (`trail.html#<lessonId>` or
  `trail.html#check-<worldId>`), and to plain `trail.html` when the Trail is done.
- A visitor with nothing logged sees no progress strip at all; it appears with the first
  logged activity.
- After the Trail is finished and before the last title, the strip shows the title, the total,
  the run and "The Trail" link, with no bar and no "points to go".
- With no day logged the run display draws nothing. After a gap of four or more days it shows
  only the "Welcome back" line.
- One award produces one toast. More than two new badges at once read "3 new badges."
  A heads-up lesson's toast carries only the points line. `Site.toast` returns `false` in Quiet Mode.
- A `<button data-award>` becomes the award button; any other `[data-award]` element gets a
  button appended. Wiring also runs on DOMContentLoaded and through a MutationObserver, so
  re-rendered lists are wired without calling `Site.refresh()`.
- On narrow screens the Library row of the navigation sits behind a "Library" button.
- While a heads-up lesson is open, every badge or title toast is held back, not only the one
  from the lesson award itself.
- A just-pressed award button uses `aria-disabled` until it loses focus (so keyboard focus is
  not dropped), and says "Done" to screen readers when no toast is shown.
- The One Quiet Minute card keeps its own small history under `buddhismstudy-daily-v1`, and
  the Trail keeps held-back news under `buddhismstudy-trail-held`. "Start over" clears both.
- The picture license has its own page, `license.html`; `img/LICENSE.md` is the repository copy.
- The Sutta Library and Monks' Rules pages render their own read buttons (class `award-btn`)
  by delegation, because their lists are re-rendered from strings on every search.

Shared classes defined in `css/game.css`, which other pages may rely on:

| Class | What |
|---|---|
| `.btn` | Base button or link-button: at least 48 px tall, 18 px text, rounded, visible 3 px orange focus ring. |
| `.btn-primary` | Gold filled, dark text. One per card. |
| `.btn-plain` | Outlined, cream text. Equal size to primary. |
| `.btn-link` | Looks like a link, still 48 px target. |
| `.panel` | Dark-brown card with a border and 12 px radius. |
| `.panel-gold` | The same with a gold left edge, for the main call to action. |
| `.points` | Small points text; hidden by `html.quiet`. |
| `.game-only` | Anything about points, titles, badges or the run; hidden by `html.quiet`. |
| `.award-btn`, `.hud`, `.toast-region`, `.toast`, `.run`, `.run-string`, `.icon-img` | As described above. |
| `.sr-only` | Visually hidden, read by screen readers. |

`html.large-text` raises Trail and My Journey text size and spacing and switches card text to a
system sans-serif. Print rules hide `.hud`, `.toast-region`, `.award-btn`, `.game-only`,
`.no-print`. Colours come from the CSS variables already defined in `css/styles.css`
(`--bg`, `--bg-soft`, `--card`, `--border`, `--gold`, `--gold-soft`, `--dark-yellow`, `--orange`,
`--orange-deep`, `--text`, `--text-dim`, `--text-faint`). Body reading text uses `--text`.

## 6. Trail data: js/data/trail-w<N>.js

```js
window.TRAIL = window.TRAIL || [];
window.TRAIL.push({
  id: "w1", order: 1, title: "What Hurts?", tagline: "…", stage: 1, goal: "…",
  icon: "img/worlds/w1.svg",
  intro: "Two or three short sentences that say what this world is about.",
  lessons: [{
    id: "w1-l2", title: "Two Arrows", minutes: 4, icon: "img/icons/two-arrows.svg",
    objective: "…",                       // from the spec, may be lightly reworded
    headsUp: "",                          // only for w1-l4, w1-l5, w7-l5: one gentle line
    steps: [
      { type: "story",   label: "An old story", title: "…", text: "…" },
      { type: "idea",    text: "…" },
      { type: "example", label: "Our example", title: "…", text: "…" },
      { type: "try",     text: "…", seconds: 45, quietText: "" },
      { type: "word",    term: "dukkha", say: "DOOK-kah", old: "", means: "…" }
    ],
    quiz: [
      { q: "…", options: ["…", "…", "…"], answer: 0, why: "…", again: "…" },
      { q: "…", options: ["…", "…", "…"], answer: 2, why: "…", again: "…" },
      { q: "…", options: ["…", "…", "…"], answer: 1, why: "…", again: "…", lookBack: "w1-l1" }
    ],
    canNow: "You can now tell the first arrow from the second.",
    deeper: [ { label: "The two arrows, in the Buddha's words", href: "suttas.html#sn36.6" } ]
  }],
  boss: { title: "The Weather Check", intro: "…",
          questions: [ { q: "…", options: ["…", "…", "…"], answer: 1, why: "…", again: "…", lesson: "w1-l1" } ] }
});
```

Rules the validator enforces:

- World `id`, `order`, `title`, `stage`, `icon`; lesson `id`, `title`, `icon`; and `boss.title`
  match the spec exactly.
- `steps` are, in this order: `story`, `idea`, `example`, `try`, then one `word` exactly when
  the spec gives the lesson a key term. The word card's `term` equals the spec's term (the text
  before " (" or " =" in `keyTerm`) and its `say` equals the spec's say-it guide (empty string
  when the spec gives none). `old` holds an old-language word when the spec names one
  (for example term "goodwill", old "metta", say "MET-tah").
- `story.label` is "An old story", "The Buddha said" or "Our example"; `example.label` is
  "Our example" unless the example is itself from a source card.
- `quiz` has exactly 3 questions with exactly 3 options each. The third carries
  `lookBack: "<lessonId>"` naming one of the two lessons before it in Trail order (in `w0-l1`
  all three are about the lesson itself and none has `lookBack`). The right answer must not
  sit in the same position for all three.
- `boss.questions` has exactly 5, each with `lesson` naming a lesson of that world, and the
  lessons the spec says have no check question must not be used. Not all right answers in
  the same position.
- `why` is shown after a right pick: one sentence saying why it is right. `again` is shown
  after any other pick: the idea restated kindly in one sentence, without naming the right
  option. Neither uses "wrong", "incorrect" or "fail".
- `headsUp` is a non-empty line for `w1-l4`, `w1-l5`, `w7-l5` and absent or empty elsewhere.
- `canNow` starts with "You can now".
- All text is plain text. No HTML tags, no Markdown. Paragraph break = `\n\n`.
- Length limits in words: story 40 to 100; idea at most 45 (and at most 3 sentences);
  example 25 to 70; try 15 to 60; `means` at most 40; `canNow` at most 25; quiz `q` at most 32;
  each option at most 14; `why` and `again` at most 32; `intro` at most 60; `headsUp` at most 30.
- Sentences: average at most 13 words per lesson, none over 22.
- `deeper` has 1 to 3 links with plain labels (at most 14 words, no shelf marks such as
  "MN 26", no Pali), each to a real target: `suttas.html#<card id>`, `curriculum.html#stage1`
  to `#stage4`, `themes.html#<section id>`, `journey.html`, `vinaya.html`, `canon.html`,
  `study.html` or `glossary.html`. At least one link goes to one of the lesson's source cards.
- Inside strings use curly quotes (“ ” ‘ ’) for quotations, never a straight `"`.
- Banned anywhere: simply, obviously, of course, easy, as everyone knows, you must,
  you should, Buddhists believe.

The writing rules in the spec (`writingRules`) apply to every word the learner reads.

## 7. Trail page behaviour (trail.html, js/trail.js)

Follows `homepageFlow` steps 4 to 10 and 13 in the spec. In short:

- `trail.html` shows the map. `trail.html#<lessonId>` opens that lesson; `trail.html#check-<worldId>`
  opens that world's check; `trail.html#next` opens whatever `Game.nextStep()` returns.
- Map: a four-question legend, then eight worlds as a vertical trail of stepping stones. Every
  stone shows its icon, its number and its title. States by icon, word and shape, never colour
  alone: done ("Done"), next ("You are here"), later ("Comes after <previous title>"), set
  aside ("Set aside. Here when you want it."). No padlocks. Exactly one highlighted next step.
- Lesson player: one card at a time, "Card 2 of 8", "Back" and one gold "Next". Order: story,
  idea, example, try, word (if any), three quick questions (one per card), reward, go deeper.
  Focus moves to the new card's heading. The position is saved with `Game.resume` so leaving
  and returning lands on the same card.
- Quick check: real buttons in a `fieldset` with the question as `legend`. A right pick shows
  "Right" and `why`, then "Next". Any other pick shows "Not quite. Here is the idea again:" and
  `again`, and the learner picks again. Question 3 is labelled "A look back" with its lesson title.
- Reward: `canNow` first, then smaller "+30 points" (only the first time), any new badge or
  title, and two equal buttons: "Next lesson" and "That is enough for today". After 3 lessons in
  one day add the "That is plenty for one day" note. Heads-up lessons show no badge or title news.
- Heads-up lessons open with `headsUp` and a "Set aside for now" button (`Game.skip`).
- World check: the 5 questions (minus any whose lesson is set aside), no score; a missed
  question shows `again` with a link to its lesson and comes round again; ends "Check complete"
  and previews the next world.
- Taught words: any word in `GAME_CONFIG.words` taught in an earlier lesson is tappable in card
  text and opens its plain meaning in place (keyboard reachable, Escape closes).
- "Read aloud" on each card uses `window.speechSynthesis` when it exists; hidden otherwise.
- Quiet Mode uses a step's `quietText` when present, and hides points.

Decisions made while building the page:

- The reward card has two equal outlined buttons ("Next lesson", "That is enough for today") and
  a link-style "Go deeper (optional reading)"; the go-deeper card repeats the two buttons.
- Only the first occurrence of a taught word on a card is a button, to keep tab stops down.
- A look-back question is left out when the lesson it looks back to was set aside.
- Badge or title news earned on a heads-up lesson is held (key `buddhismstudy-trail-held`) and
  shown on the next ordinary reward card.
- The resume object carries a `q` array so a reload cannot turn a "not quite" into a first pick.
- Lessons and checks hide the big header, navigation and progress strip; "Leave lesson" brings
  them back. Finished worlds fold on the map. A check left part-way carries on where it stopped.
- `glossary.html#cards` opens the flashcards. The glossary has about 75 words, so glossary,
  rule and daily points together come to 400, still under the 420 the last title needs beyond
  the Trail. Keep the glossary under 85 words so library reading stays necessary.

## 8. Graphics: original SVG, CC0

All graphics are drawn for this project and dedicated to the public domain under CC0 1.0.
Nothing is downloaded or copied from elsewhere. `img/LICENSE.md` states this.

| Folder | What | Canvas |
|---|---|---|
| `img/icons/<name>.svg` | One per icon name in the spec (40). Line style. | `viewBox="0 0 64 64"` |
| `img/worlds/<worldId>.svg` | One emblem per world (8). | `viewBox="0 0 96 96"` |
| `img/ranks/<rankId>.svg` | One emblem per title (10): ten different pictures of **equal** visual weight; they do not grow grander. | `viewBox="0 0 96 96"` |
| `img/badges/<badgeId>.svg` | One medal per badge (28). | `viewBox="0 0 64 64"` |
| `img/brand/` | `wheel.svg`, `lotus.svg`, `path-tile.svg`, `check.svg`, `book.svg` (all `0 0 64 64`) and `hero.svg` (`0 0 800 320`: a dotted gold trail from a gateway, past eight small markers, to a lamp on a hill). | as noted |

Style, so the whole set reads as one family:

- Palette only: gold `#ffd700`, soft gold `#e6b422`, dark yellow `#b8860b`, orange `#ff8c00`,
  deep orange `#e67e22`, cream `#f3e5c0`, dark brown `#2b2012`, near-black `#1a1208`.
  They are shown on a `#1a1208` page, so dark colours are for fills inside lighter shapes only.
- Simple geometry: circles, arcs, straight lines, rounded rectangles, a few smooth paths.
  Each picture must be recognisable at 32 px. No fine detail, no faces with features, no
  letters or numbers, no sacred emblems used as decoration (no wheel-marked palm, no Buddha
  face). People are simple round-head-and-body shapes.
- Icons: transparent background, strokes `stroke-width="3"` with round caps and joins in soft
  gold, `fill="none"` unless a small accent; at most one orange accent shape. Keep artwork
  inside a 6-unit margin.
- Badges: a ring (`cx="32" cy="32" r="29"`, dark-yellow stroke 3, dark-brown fill) with the
  picture inside in gold and orange.
- World and title emblems: a dark-brown disc (`r="45"`) with a soft-gold rim (stroke 3) and a
  bold, mostly filled picture.
- Every file: `xmlns="http://www.w3.org/2000/svg"`, the `viewBox`, `role="img"`, a `<title>`.
  No `<text>`, `<script>`, `<image>`, `<style>`, `<use>`, `<foreignObject>`, no external
  references. Gradients only as `<linearGradient>` or `<radialGradient>` inside the same file.
  Each file under 5 KB (hero under 12 KB).

House-style reference, to copy the frame and line weight from:

```svg
<!-- icon: line style, one orange accent -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" fill="none" stroke="#e6b422" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
  <title>Falling leaf</title>
  <path d="M44 12c-16 2-26 12-26 26 0 3 1 6 2 8 14 0 26-10 26-26 0-3-1-6-2-8z"/>
  <path d="M20 46 40 22"/>
  <path d="M14 55c3-1 5-4 6-9" stroke="#ff8c00"/>
</svg>

<!-- badge: ring frame, picture inside r=20 -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img">
  <title>First Step</title>
  <circle cx="32" cy="32" r="29" fill="#2b2012" stroke="#b8860b" stroke-width="3"/>
  <ellipse cx="27" cy="36" rx="6" ry="10" fill="#ffd700" transform="rotate(-12 27 36)"/>
  <circle cx="37" cy="22" r="3" fill="#ff8c00"/>
</svg>

<!-- world or title emblem: disc frame, bold filled picture inside r=34 -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" role="img">
  <title>Start Here</title>
  <circle cx="48" cy="48" r="45" fill="#2b2012" stroke="#e6b422" stroke-width="3"/>
  <path d="M30 70V38a18 18 0 0 1 36 0v32" fill="none" stroke="#ffd700" stroke-width="5" stroke-linecap="round"/>
  <circle cx="48" cy="66" r="4" fill="#ff8c00"/>
</svg>
```

## 9. Sutta "easy" data: js/data/suttas-easy-*.js

```js
window.SUTTA_EASY = window.SUTTA_EASY || {};
window.SUTTA_EASY["sn36.6"] = {
  plain: "One or two short sentences saying what this text is about, 10 to 40 words.",
  q: "One check question, at most 32 words.",
  options: ["…", "…", "…"], answer: 2,
  why: "One kind sentence, at most 32 words.",
  again: "The idea again, kindly, at most 32 words."
};
```

Every card id in the matching `suttas-<cat>.js` must have an entry. Same writing rules.

## 10. Glossary data: js/data/glossary.js

```js
window.GLOSSARY = [
  { id: "dukkha", term: "dukkha", say: "DOOK-kah", lang: "pi", kind: "Trail word",
    plain: "At most 25 words.", more: "At most 60 words.", lesson: "w1-l1", card: "sn56.11" }
];
```

`id` is lowercase ASCII (`a-z`, `0-9`, `-`) and unique. `say` may be empty for plain English
terms. `lang` is `"pi"` for old-language words, else omitted. `kind` is one of "Trail word",
"What the library calls it", "Library word", "Person", "Place or thing". `lesson` and `card`
are optional but must be real ids. All 20 Trail words must appear with exactly the Trail's
`term` and `say`. At least 45 entries.

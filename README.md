# Buddhism Study

A personal study website that grows as I learn more about Buddhism. It now has
two layers: a beginner game layer called **the Trail**, which starts at zero, and
the **library** it leads into. Every page is open to everyone from the first
visit; nothing is locked behind the Trail.

## Start here: the game layer

- **Home** ([index.html](index.html)) — the front door. A first visit shows one
  welcome panel and one button ("Take the first step"). Later visits show a
  Continue panel with the next lesson, and, once the Trail is done, three
  suggestions for reading on in the library. Below that sit the section cards,
  grouped as *Start here*, *When you are ready* and *Deep study*.
- **The Trail** ([trail.html](trail.html)) — 8 worlds, 46 short lessons and 8
  end-of-world checks, built on one spine: the doctor's four questions (what
  hurts, why, can it stop, what is the treatment). Each lesson is a stack of
  cards: a story, one idea, an everyday example, a one-minute "try it", at most
  one new word, three quick questions, what you can now do, and optional links
  into the library. The Trail teaches 20 words in all.
- **My Journey** ([profile.html](profile.html)) — days you showed up, all ten
  titles, the badges, reading counts, and the settings: Quiet Mode, Larger text,
  Open all lessons, save progress to a file, load it back, and Start over.
- **Glossary** ([glossary.html](glossary.html)) — a plain-English word list with
  how to say each word, and flashcards. It holds every Trail word plus the words
  the library uses.
- **One Quiet Minute** — an optional daily card on Home, the Trail and My
  Journey. It offers one "try it" exercise from a lesson already finished, with a
  soft ring as a guide and an honest "I did it" button.

**Points, titles and badges, and the humane-design rules.** Learners collect
*points* (30 per lesson, 50 per world check, 10 per library card, topic or
Journey episode, 5 per card question and per daily minute, 2 per glossary card
and per rule story), which add up to ten *titles* (Curious Visitor to Lamp
Keeper) and 28 *badges*. The game is built not to train the craving the lessons
teach about: every reward is fixed, small, printed on the thing that gives it
and paid once; nothing is ever taken away; every source of points has a cap and
points stop at the last title (2,200), which just says "Enough."; there are no
random rewards, countdowns, reminders, leaderboards, lives or fail screens; the
run of recent days is drawn as lute strings, forgives two rest days, stops
counting at seven and never says "lost" or "broken"; hard lessons carry a
heads-up and can be set aside without blocking anything; stopping for the day is
always an equal choice; and Quiet Mode hides points, titles, badges and the run
display everywhere. Progress lives only in the browser's localStorage: no
accounts, no tracking, no analytics. The full rules are `humaneRules`,
`streakRule`, `writingRules` and `accessibilityRules` in
[docs/game-spec.json](docs/game-spec.json).

## The library

- **Guided Study** ([study.html](study.html)) — the whole library as a nine-unit
  course in logical sequence. Ticking a reading also marks its library card as
  read (and the other way round), so one reading is counted once.
- **Modern Life** ([themes.html](themes.html)) — fourteen topics aiming the canon
  at career, love, family, friendship, money, digital life, conflict, health,
  loss, identity, decisions, ethics, status, and universal truths. Each topic
  ends with an "I have read this topic" button.
- **Journey to the West** ([journey.html](journey.html)) — the Xiyouji allegory
  read pilgrim-by-pilgrim and in 14 numbered episodes against the site's
  principles. Each numbered episode has an "I have read this" button.
- **Save as PDF** ([everything.html](everything.html)) — compiles every library
  section into one printable document (browser print → Save as PDF); every page
  also prints cleanly on its own via the shared `@media print` rules, which hide
  all game elements. Printing never logs an activity.
- **The Curriculum** ([curriculum.html](curriculum.html)) — a four-stage study
  path (the universal predicament → psychological mechanics → the systematic
  path → relational living) with canonical anchors and lost-in-translation notes.
- **The Canon** ([canon.html](canon.html)) — every division of the Tipiṭaka in
  contemporary English, tagged to the curriculum stages.
- **The Sutta Library** ([suttas.html](suttas.html)) — study notes for 67 key
  texts: the gist, what each teaches about truth and human nature, and daily-life
  application. Each card opens with one plain sentence and has one check
  question (`js/data/suttas-easy-*.js`). Data in `js/data/suttas-*.js`, rendered
  by `js/suttas.js`; supports search, collection filters, and `#id` deep links
  (e.g. `suttas.html#sn36.6`).
- **The Pātimokkha** ([vinaya.html](vinaya.html)) — all 227 rules of the bhikkhu
  Pātimokkha from the Vinaya Piṭaka, organized by category (Pārājika,
  Saṅghādisesa, Aniyata, Nissaggiya Pācittiya, Pācittiya, Pāṭidesanīya,
  Sekhiya, Adhikaraṇasamatha), each with a summary of the rule and the origin
  story from the Suttavibhaṅga that prompted the Buddha to lay it down.
  Searchable and filterable; each rule links to the full canonical text at
  SuttaCentral.

**Possible later sections** — core concepts and reading notes.

## Running locally

It's a static site with no build step and no dependencies — open `index.html`
in a browser (it works from `file://`), or serve it:

```
python -m http.server 8123
```

then visit http://localhost:8123.

## Where things live

| What | Where |
|---|---|
| The design: worlds, lessons, titles, badges, points, the run rule, the home-page flow, the writing, accessibility and humane-design rules | [docs/game-spec.json](docs/game-spec.json) |
| The technical contract: file names, data shapes, activity ids, the engine API, shared classes, graphics style | [docs/GAME_CONTRACT.md](docs/GAME_CONTRACT.md) |
| Trail lessons and checks, one file per world | `js/data/trail-w0.js` … `js/data/trail-w7.js` |
| Generated config (`window.GAME_CONFIG`); never edit by hand | `js/data/game-config.js` |
| The engine (`window.Game`): points, titles, badges, the run, saving. No DOM, so it runs under Node | `js/game.js` |
| Shared page chrome (`window.Site`): navigation, the strip under the header, toasts, "I have read this" buttons | `js/site.js`, `css/game.css` |
| One Quiet Minute (`window.Daily`) | `js/daily.js` |
| Glossary words; plain lines and check questions for library cards | `js/data/glossary.js`, `js/data/suttas-easy-*.js` |
| Library data: sutta cards and the 227 rules | `js/data/suttas-*.js`, the other `js/data/*.js` files (`window.VINAYA`) |
| Graphics | `img/` (see below) |

Progress is one JSON object in localStorage under `buddhismstudy-game-v1`.
Old Guided Study ticks (`buddhismstudy-progress`) are counted once, quietly, on
the first load.

`index.html` also reads that object in a small inline script in its `<head>`,
before the first paint, and sets the classes `has-progress`, `quiet` and
`large-text` on `<html>`. A returning learner therefore never sees the
first-visit panel while the scripts at the foot of the page load. It is only a
first guess: `js/site.js` and the home-page script then ask the engine, which
has the last word.

## Tools

All tools are plain Node scripts; there are no npm packages to install.

```
node tools/build-config.js   # regenerate js/data/game-config.js from docs/game-spec.json
node tools/validate.js       # check all game data and graphics against the spec and contract
node tools/test-game.js      # unit tests for the engine (js/game.js)
node tools/shot.js index.html out.png 420 900   # headless-browser screenshot of any page
```

Run `validate.js` and `test-game.js` before any commit. `shot.js` needs Edge or
Chrome installed; a `#hash` may follow the page name (`"trail.html#w0-l1"`).

## Graphics

Every picture in `img/` is an original SVG drawn for this site and released as
CC0 (public domain): lesson icons, world emblems, title emblems, badges, and the
home-page banner. Nothing is downloaded or copied from elsewhere, and the site
loads no outside fonts, scripts or images. See [img/LICENSE.md](img/LICENSE.md).

## Adding content

- **A new section page** reuses `css/styles.css`, then `css/game.css`, and ends
  with `js/data/game-config.js`, `js/game.js` and `js/site.js`. The navigation
  is drawn by `js/site.js` from one list, so add the page there, and give it a
  card in `index.html`.
- **Rules** live in `js/data/*.js` as plain objects pushed onto `window.VINAYA`.
- **Trail lessons** live in `js/data/trail-w*.js`. Change the design in
  `docs/game-spec.json` first, run `node tools/build-config.js`, then
  `node tools/validate.js`. Every word a learner reads follows `writingRules`.
- JavaScript is ES5 (`var`, `function`), in the style of `js/suttas.js`, so the
  site runs from disk with no build step.

## Sources

Summaries are condensed from the Suttavibhaṅga of the Pali Vinaya Piṭaka.
Full translations: [SuttaCentral](https://suttacentral.net) (Bhikkhu Brahmali)
and [The Buddhist Monastic Code](https://www.dhammatalks.org/vinaya/bmc/Section0001.html)
(Ṭhānissaro Bhikkhu).

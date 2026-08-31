# Buddhism Study

A personal study website that grows as I learn more about Buddhism.

**Current sections**

- **Guided Study** ([study.html](study.html)) — the whole site as a nine-unit
  course in logical sequence, with checkbox progress tracking (localStorage).
- **Modern Life** ([themes.html](themes.html)) — the canon aimed at career,
  love, money, conflict, loss, identity, and universal truths.
- **Journey to the West** ([journey.html](journey.html)) — the Xiyouji allegory
  read pilgrim-by-pilgrim and episode-by-episode against the site's principles.
- **Export PDF** ([everything.html](everything.html)) — compiles every section
  into one printable document (browser print → Save as PDF); every page also
  prints cleanly on its own via the shared `@media print` stylesheet.
- **The Curriculum** ([curriculum.html](curriculum.html)) — a four-stage study
  path (the universal predicament → psychological mechanics → the systematic
  path → relational living) with canonical anchors and lost-in-translation notes.
- **The Canon** ([canon.html](canon.html)) — every division of the Tipiṭaka in
  contemporary English, tagged to the curriculum stages.
- **The Sutta Library** ([suttas.html](suttas.html)) — study notes for 67 key
  texts: the gist, what each teaches about truth and human nature, and daily-life
  application. Data in `js/data/suttas-*.js`, rendered by `js/suttas.js`;
  supports search, collection filters, and `#id` deep links (e.g.
  `suttas.html#sn36.6`).
- **The Pātimokkha** ([vinaya.html](vinaya.html)) — all 227 rules of the bhikkhu
  Pātimokkha from the Vinaya Piṭaka, organized by category (Pārājika,
  Saṅghādisesa, Aniyata, Nissaggiya Pācittiya, Pācittiya, Pāṭidesanīya,
  Sekhiya, Adhikaraṇasamatha), each with a summary of the rule and the origin
  story from the Suttavibhaṅga that prompted the Buddha to lay it down.
  Searchable and filterable; each rule links to the full canonical text at
  SuttaCentral.

**Planned sections** — Sutta Piṭaka notes, Abhidhamma, core concepts,
history of the canon, and reading notes.

## Running locally

It's a static site — open `index.html` in a browser, or serve it:

```
python -m http.server 8123
```

then visit http://localhost:8123.

## Adding content

Rule data lives in `js/data/*.js` as plain objects pushed onto
`window.VINAYA`. New site sections get a card in `index.html` and their own
page reusing `css/styles.css`.

## Sources

Summaries are condensed from the Suttavibhaṅga of the Pali Vinaya Piṭaka.
Full translations: [SuttaCentral](https://suttacentral.net) (Bhikkhu Brahmali)
and [The Buddhist Monastic Code](https://www.dhammatalks.org/vinaya/bmc/Section0001.html)
(Ṭhānissaro Bhikkhu).

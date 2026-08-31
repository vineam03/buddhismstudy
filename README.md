# Buddhism Study

A personal study website that grows as I learn more about Buddhism.

**Current sections**

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

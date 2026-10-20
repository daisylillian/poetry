# The Improbable Press — hand-off

Prepared: 20 October 2026  
Purpose: resume the visual overhaul of the existing blackout-poetry maker without losing its working behaviour.  
Companion: [implementation roadmap](Improbable_Press_ROADMAP.md)

## Start here

The base maker works and has been merged. The richer illustrated design is specified but has not been implemented. Continue from current `main` in a fresh branch. First reconcile the supplied texts; then prove one original illustrated page in both the live editor and its downloaded PNG before producing the complete artwork family.

The detailed design authority is **Improbable_Press_Visual_Language_and_Implementation_Brief.md**, prepared 20 October 2026. It contains the reference analysis, asset specifications, interaction details, technical approach, acceptance criteria and complete 80-entry heading manifest. This hand-off gives the current state and the decisions a new builder needs; the roadmap turns those decisions into sequenced work.

## 1. Verified project state

| Item | State |
|---|---|
| Repository | [daisylillian/poetry](https://github.com/daisylillian/poetry) |
| Baseline PR | [PR #1](https://github.com/daisylillian/poetry/pull/1), merged |
| Main commit | `85c38ff043cc00af4e8deee17c76371ce7f6ac14`, confirmed through GitHub during this hand-off |
| Earlier feature commit | `14fb20c902fb5476995467450830d0dc6712281a`; implementation tree matched the merged baseline when the brief was prepared |
| Existing maker | Previously deployed private Site; obtain its current URL through the authorised hosting project. |
| Last recorded publication | Version 1, active; owner-only custom access, no external visitors |
| Hosting configuration | `.openai/hosting.json`; static directory `dist` |
| Current redesign status | Design brief completed; new corpus library, illustration family and editions remain proposed |

Re-read the hosting configuration and current access policy before any future deployment. Preserve this Site identity and audience. A merged PR is historical context, not a branch to resume. Do not reset existing branches or recreate the Site.

### What already works

- Pasted text and local UTF-8 `.txt` files, staged before an explicit **Use this text** action.
- Per-occurrence word buttons, stable word identity, punctuation and whitespace preservation.
- Click/tap toggling; keyboard navigation and activation; visible focus.
- Undo and redo, including source replacement, styling and recoverable **Restore all**.
- Paper, ink, type and mask choices without discarding selections.
- Locally rendered PNG export with source credit and measured page geometry.
- A credited Kenneth Grahame sample from *The Wind in the Willows* (1908), Project Gutenberg ebook 289. Its initial worked poem leaves 45 of 142 words visible.

The current design has warm paper, a small stamp and floret, and a readable central sheet. It does not yet contain the proposed illustrated source browser, four new editions or the complete supplied anthology.

## 2. Product and visual decisions to carry forward

**Direction:** A living commonplace book.  
**Promise:** Find a page. Leave a poem.

Make a disciplined reading page surrounded by patterned bindings, original cut-paper details and small observations of ordinary human life. Put humanity in posture, gesture and carefully observed drawing. Let the act of removing words remain the main event.

The reference document contains 45 embedded images. All were reviewed through contact sheets; images 14, 23, 27 and 37 were also viewed enlarged. The useful methods are patterned ownership, ordered collecting, paper construction, affectionate figures and erasure as image. Artist identities and reproduction permissions were not established. Develop original work from those methods; do not trace the reference figures or reuse their pictures.

### Visual system

| Element | Decision |
|---|---|
| Surround and sheet | Sage studio `#D9E6DD`, cream default paper `#F4ECDD`; central live HTML reading field |
| Principal colours | Ink `#24252B`, cobalt `#273C70`, moss `#245D51`; vermilion `#B74432` as a controlled accent |
| Other papers | Chalk `#FAF7F0`, rose `#F3DEE0`, mist `#E3ECEB` |
| Decorative accents | Ochre `#C59B39`, plum `#3E334D`; no texture through readable words |
| Proposed type | Self-hosted Source Serif 4 and Source Sans 3, with OFL notices; restrained typewriter alternative and dependable fallbacks |
| First screen | Field book edition: cream sheet, cobalt ink, serif text, original botanical plate below the source credit |
| Original artwork | One reader/book vignette; four related collection covers, repeat tiles and page frames/plates; a small consistent icon family |
| Authored irregularity | Fixed cut edges, sparse contour strokes and seeded ink geometry; no new random position on resize or render |
| Decoration policy | Studio-only decoration may stay out of export; page artwork must appear in both editor and PNG |

Proposed editions are **Print**, **Field book**, **After dark** and **Paper theatre**. They are atomic appearance presets, adjustable through **Paper**, **Ink**, **Type**, **Mask** and **Frame**. After dark keeps a readable light text field; it is not a global dark-mode project. A passage's collection must not force the poem's style.

All artwork and fonts above are specifications, not delivered assets. Asset provenance, licence, hash, intrinsic bounds, export inclusion and fallback belong in a registry.

### Experience

Keep one studio and one reversible command history. Put editable words early on a phone. Use a compact mobile header and a bottom toolbar for Undo, Redo, Style and Export, with safe-area clearance and comfortable targets.

Use one native Style dialog: a side panel on desktop and a bounded bottom sheet on phones, with Done, Escape and focus return. Optional title and byline commit once on blur or Enter; they must not replace the source attribution.

The collection dialog offers all 80 passages, four groups of 20, search and a full-text preview. Selecting a row only previews it. **Use this text** replaces source and credit atomically, clears blackouts for that new source and preserves appearance; Undo restores the previous composition. Closing a dialog must preserve uncommitted drafts.

Hover, keyboard focus and committed blackout must look different. Conceal immediately with an opaque mask; surface texture cannot expose removed letters. Do not cover adjacent surviving punctuation. A small contextual hint and actual changes to the page provide sufficient feedback.

Motion is brief and functional. No drifting words, looping decoration, parallax, confetti or automatic praise. Reduced-motion users get the settled state.

## 3. Source materials and editorial state

| Input | Coverage established | Remaining work |
|---|---|---|
| Darkness, Dread and the Uncanny | 20 headings inventoried | Reconcile complete text and metadata; review rights |
| Magic, Wonder and Adventures | 20 headings inventoried | Same; retain Peter Pan as a separately flagged rights review |
| Gardens, Weather and Wild Places | 20 headings inventoried | Reconcile verse, punctuation and metadata |
| Love, Time and Human Lives | 20 headings inventoried | Reconcile complete text and metadata |
| `visual_reference.docx` | 45 embedded PNGs analysed | Produce an original, documented asset family |

**Inventory is not integration.** All 80 headings are listed in the brief, but full passage bodies have not been editorially reconciled, converted into application records or cleared for release.

Retain original inputs, hashes and section boundaries. Parse passage bodies separately from notes and metadata. Preserve apostrophes, punctuation, paragraphs, verse line breaks and word order. Log each deliberate normalisation. Do not deduplicate by title.

Each future passage record needs a stable passage ID, theme, title, author, work/location, exact text, source URL, originating filename and heading index, raw/canonical hashes, topics, any editorial year guidance and rights status. A passage ID identifies a library record; source revision and offsets identify the actual word occurrences in the editor.

The brief flags `wonder-02` (*Peter Pan*) for a UK-specific rights check. This is an unresolved release question, not a determination that the exact supplied passage cannot be used or that a payment is due. Preserve the record in the 80-entry inventory, record the outcome separately and allow unrelated work to proceed.

### Resume input retrieval

Locate the detailed brief and the five original inputs by the exact filenames above through the authorised file connection. Do not rely on an earlier scratch path. The complete 80-entry heading inventory is in the brief; restore the original anthology files before preparing passage bodies.

Use the existing repository hosting configuration to resolve the Site through the authorised hosting connection. Treat file-service identifiers, live private URLs and hosting credentials as session-local operational information.

## 4. Architecture and invariants

This is a static application with semantic HTML, CSS and native ES modules. There are no runtime package dependencies. **`dist/` is the served source**, not generated output to delete.

| File | Responsibility |
|---|---|
| `dist/index.html` | Semantic studio markup and controls |
| `dist/style.css` | Layout, typography, focus, states and responsive presentation |
| `dist/core.js` | Tokenisation, source identity, composition snapshots and history |
| `dist/app.js` | DOM rendering, import, keyboard and user actions |
| `dist/export.js` | Measured glyph geometry, masks and Canvas PNG |
| `test/core.test.js`, `test/export.test.js` | Existing behavioural and export tests |
| `docs/browser-checks.md`, `docs/review.md` | Historical verification and review |
| `test/viewport.html` | Existing narrow-screen inspection harness |
| `.openai/hosting.json` | Existing Site identity and static directory |

Preserve these invariants:

1. Word IDs derive from source revision and UTF-16 offset, never word spelling or layout position. Repeated words remain independent.
2. Source text/tokens and hidden IDs remain separate from presentation. Restyling, reflow and exporting do not retokenise a source or reset selection.
3. History snapshots keep immutable source references and cloned hidden sets. New actions clear redo. Search, focus and draft typing stay outside composition history.
4. Render user text as text, never HTML. Keep processing local. The existing CSP uses `connect-src 'none'`; prefer self-hosted imported data modules over introducing JSON fetch without an explicit CSP decision.
5. SVG/live overlays and Canvas use the same mask geometry, artwork identifiers, bounds, clipping and pattern seed. An opaque base always covers removed glyphs.
6. Wait for required fonts/assets, then capture the current coherent state and measure/draw synchronously. The earlier export race was fixed by capturing state after fonts and two animation frames. Do not reintroduce a stale pre-await snapshot.
7. If composition or asset dependencies change during preparation, retry within a bounded policy or give a recoverable error. Never silently export a different page.
8. Fallback art/type must be the same visible choice in editor and PNG. Allocation failures leave the poem intact.

Proposed additions include a corpus module, `library.js`, shared `scene.js`, original assets/licences and an optional offline corpus-preparation script. These filenames are proposals, not existing files. Keep the architecture small and update syntax checks when modules are added.

Current limits: 12,000 UTF-16 code units per source; 60,000-byte text files with fatal UTF-8 decoding; PNG scale 1–2, maximum edge 16,384 px and maximum area 32 million pixels. Work is memory-only and disappears on refresh. Do not silently add autosave or raise limits without evidence.

### Local commands

From a refreshed repository checkout:

```sh
npm test
npm run check
python3 -m http.server 8000 --directory dist
```

Open `http://localhost:8000`. No build step is required at the baseline. Node 24.19.0 was used for the earlier test run; no minimum supported Node version has been established. The current check script checks only the three existing JS modules. No baseline CI configuration was recorded.

## 5. Evidence and open verification

**Historical evidence from the implementation reports:** eight automated tests passed; syntax and diff checks passed; Chrome exercised paste → blackout → undo → restyle → PNG. Checks included repeated words, curly/straight apostrophes, punctuation, verse, source replacement/reset undo, keyboard activation, 961 words, a 190-character single word and resize preservation.

The browser report includes desktop and narrow iframe checks, actual PNG downloads and visual comparisons. A normal top-level file chooser successfully staged and committed a six-word file after an initial iframe file-chooser timeout. A narrow-screen whitespace issue and the export timing race were fixed. See repository reports for exact procedures and limitations.

**Still unverified:** physical phone touch accuracy, screen-reader behaviour, forced colours, Safari/Firefox, representative teenage/adult usability, and actual reduced-motion/hover emulation. CSS inspection alone does not establish those results. An iframe is not a physical-device test.

**For these hand-off documents:** the saved brief was read and GitHub's current main was confirmed. Application tests and browser checks were not rerun; no fresh visual or accessibility result is claimed.

Aim for WCAG 2.2 AA and measure the finished interface. Keep non-colour state cues, meaningful labels, readable surviving words, two-tone visible focus, zoom/reflow and text-spacing support. Design toolbar targets around 48 px. The inline-target exception does not prove tiny words are comfortable on a phone.

## 6. Next builder's first actions

Use task IDs from the [roadmap](Improbable_Press_ROADMAP.md).

1. Complete **P1.1–P1.2**: refresh the baseline, read repository instructions and stage/hash the five supplied inputs.
2. Complete **P1.3–P1.4**: produce all 80 records, reconcile them against originals and record release questions separately.
3. Complete **P2.1–P2.3**: establish tokens/fonts and one original Field book plate; prove editor/PNG parity before expanding the artwork.
4. Continue through source discovery, responsive composition and bounded release checks. Record evidence against the relevant task rather than marking features complete from code inspection.

Keep the scope to choosing text, concealing words, recovering actions, styling a finished page and exporting it. Accounts, sharing dashboards, music, automatic poem generation, arbitrary word positioning and autosave are outside this overhaul.

The next release needs a fresh reviewable change, current evidence and the existing private Site identity. This hand-off does not authorise merging a future change, widening access or publishing an unfinished redesign.

# The Improbable Press — implementation roadmap

Prepared: 20 October 2026  
Status: sequenced implementation plan; redesign tasks below are not yet complete.  
Companion: [project hand-off](Improbable_Press_HANDOFF.md)

## Outcome and delivery rule

Deliver an illustrated, accessible blackout-poetry studio where people can choose from the supplied texts or add their own, conceal individual word occurrences, undo, restyle and download the page they see.

The base maker is already working. Extend its state model and measured export. Prove one complete illustrated composition before multiplying assets and surface controls.

The detailed design authority is **Improbable_Press_Visual_Language_and_Implementation_Brief.md**. The hand-off records repository/Site identity, input identifiers, commands and historical evidence. This roadmap defines sequence, dependencies and the evidence needed to finish.

### Status at hand-off

- [x] Base maker merged in PR #1; current main confirmed as `85c38ff043cc00af4e8deee17c76371ce7f6ac14`.
- [x] Existing version 1 recorded as active with owner-only access.
- [x] Detailed visual language, reference analysis and implementation brief completed.
- [x] All 45 visual references reviewed; 80 passage headings inventoried, 20 per group.
- [ ] Complete passage bodies reconciled, structured and reviewed for release.
- [ ] Original illustration/font asset family produced and integrated.
- [ ] Source browser, four new editions and mobile workspace implemented.
- [ ] Redesigned editor/export/accessibility journey verified.

Checked items describe completed baseline or planning work. They do not certify the proposed redesign. Historical tests are not fresh tests.

## 1. Priorities, ownership and sequence

| Priority | Meaning |
|---|---|
| **P0** | Protect source fidelity, state/history, reliable export and access; a failure blocks the affected release |
| **P1** | Required product and visual experience for this overhaul |
| **P2** | Finishing refinement after the complete journey works; not an excuse to defer core accessibility |

Roles below describe responsibility, not a requirement to use multiple people or agents. One builder may own several roles. The builder integrates code; an editorial owner reconciles supplied text; an art/design owner creates original assets; a reviewer records bounded evidence. Daisy decides any later merge, publication or audience change outside the authorised scope.

The dependency sequence is:

1. **Phase 1:** establish the exact baseline and trustworthy source records.
2. **Phase 2:** prove the new visual language on one editor/PNG composition.
3. **Phases 3–4:** complete source discovery and the responsive working studio.
4. **Phase 5:** close integration, export and accessibility risks.
5. **Phase 6:** supply review evidence and a release-ready hand-off.

Do not give calendar promises before the corpus and illustrated export proof are assessed. Estimate remaining work after those two gates, using measured effort and actual unresolved issues.

## 2. Phase 1 — baseline and complete source records

**Exit:** the existing maker is reproducible; all 80 entries have traceable text records and explicit release status.

| ID | Priority / owner | Dependency | Work | Done when |
|---|---|---|---|---|
| P1.1 | P0 · builder | None | Refresh main; read repository instructions and current hosting/access; open a fresh branch; run baseline commands. | Commit/Site/version/access recorded; baseline checks have dated results; existing failures are described before edits. |
| P1.2 | P0 · editorial + builder | P1.1 | Stage the four anthology markdowns and visual DOCX; record filenames, hashes and structural inventory. | Five originals traceable; four groups of 20 unique record IDs; 45 reference images accounted for; original files remain intact. |
| P1.3 | P0 · builder | P1.2 | Implement section-aware extraction and a data schema; separate passage bodies, credit, notes and editorial guidance. | 80 importable records validate; IDs are independent of titles; exact text and source locations survive the conversion. |
| P1.4 | P0 · editorial | P1.3 | Compare every complete passage and metadata record with its supplied original; log intentional normalisation. | A reconciliation ledger covers 80/80 records, including paragraph and verse breaks, curly apostrophes, punctuation and attribution; discrepancies resolved or explicitly blocked. |
| P1.5 | P0 · editorial | P1.2; finalise after P1.4 | Record provenance and release status per entry, including the specific Peter Pan question. | Prepared vs releasable counts are explicit; no inferred rights clearance; a restricted item cannot silently enter the released chooser. |

**Gate G1:** record counts alone do not pass. Every text body must be compared, and release status must be separate from the 80-entry inventory. An unresolved record need not block parser work, art or unrelated entries. Do not announce an all-80 release while one is withheld.

**Useful checks:** repeated titles/authors do not collapse records; Markdown headings/notes do not leak into body text; UTF-8 characters, verse and credits round-trip. Reuse behavioural tests where possible. Add meaningful parser/schema checks rather than snapshots that merely repeat the implementation.

## 3. Phase 2 — one illustrated page, proved end to end

**Exit:** one original Field book composition looks right, remains readable and exports faithfully at desktop and phone widths.

| ID | Priority / owner | Dependency | Work | Done when |
|---|---|---|---|---|
| P2.1 | P1 · design + builder | P1.1 | Apply role-based colour/type/spacing tokens; self-host selected font faces with licences and fallbacks. | Palette, text states and focus are measured; no small vermilion text on rose/mist; DOM and Canvas use matching font metrics. |
| P2.2 | P1 · art/design | P1.2 | Create one original botanical plate and reader/book vignette; define registry/provenance and studio-vs-page policy. | Artwork is original and legible at intended size; bounds, hash, licence, fallback and export inclusion are documented. |
| P2.3 | P0 · builder | P2.1–P2.2 | Implement shared scene/mask/art geometry and integrate one Field book page using an existing credited sample. | Same composition, glyph coverage, credit, art and bounds appear in editor and PNG at wide/narrow widths; selections and history survive reflow. |
| P2.4 | P1 · art/design + builder | G2 | Expand to four collection covers, four repeat tiles, four coordinated page frames/plates and the small icon family. | Assets form one coherent family, work at phone size and meet the registry/export policy; decorative artwork stays away from reading and controls. |

**Gate G2:** inspect the live page and actual downloaded images side by side. Include a short poem, multiline verse and a long source. Check transparent edges, baselines, clipping, credits, density of ink and the integrity of surviving punctuation. A screenshot of the editor alone is insufficient.

Do not produce the full asset family before P2.3 passes. Asset failure/fallback must already be coherent; export may not silently drop a plate.

## 4. Phase 3 — a useful, complete source browser

**Exit:** someone can find, preview and load a passage without losing an existing poem by accident.

| ID | Priority / owner | Dependency | Work | Done when |
|---|---|---|---|---|
| P3.1 | P1 · builder + design | G1, P2.4 | Build the collection dialog with four illustrated groups, all eligible records, search and full preview. | Title/author/work/topics search works; verse and credit remain exact; counts distinguish prepared and released records; empty results offer a clear recovery. |
| P3.2 | P0 · builder | P3.1 | Connect explicit Use this text to one source-replacement command. | Preview is read-only; commit replaces source/credit/blackouts atomically and preserves style; Undo restores the prior composition and Redo reapplies it. |
| P3.3 | P0 · builder | P3.1 | Integrate paste/file staging into the same source flow; preserve drafts on close and ignore stale file reads. | Paste and UTF-8 file paths both work; invalid/oversized/undecodable inputs leave the poem intact; cancelling loses neither poem nor draft. |
| P3.4 | P1 · builder + reviewer | P3.1–P3.3 | Finish desktop and phone dialog navigation, search state, Back behaviour and focus return. | Reopening/back retains intended filter, query and scroll; Escape/Done return focus; keyboard and narrow-screen journeys complete without coaching. |

A collection choice does not select an edition. Editorial year guidance is not a tested reading-age assessment. Do not show unverified claims about suitability or rights.

## 5. Phase 4 — responsive studio and expressive finishing

**Exit:** source → blackout → undo → restyle → export feels direct on desktop and a narrow screen.

| ID | Priority / owner | Dependency | Work | Done when |
|---|---|---|---|---|
| P4.1 | P1 · design + builder | G2 | Recompose header, central sheet and mobile bottom toolbar; bring editable lines into the first phone screen. | Natural page scrolling, safe-area clearance and scroll padding work; controls do not cover the final lines; reflow works at 320 CSS px. |
| P4.2 | P0 · builder | P4.1 | Preserve native word buttons, stable IDs, roving keyboard navigation and distinct hover/focus/committed masks. | Repeated occurrences toggle independently; Left/Right/Home/End and Space/Enter work; Tab leaves; scrolling on touch does not accidentally mark words. |
| P4.3 | P1 · builder + design | P2.4, P4.1 | Build one Style dialog and four editions: Print, Field book, After dark, Paper theatre. | Presets are one undoable action; Paper/Ink/Type/Mask/Frame are useful, labelled adjustments; Frame None works; source and hidden IDs never change. |
| P4.4 | P0 · builder | P4.3 | Add solid, brush and patterned masks using opaque shared geometry and a stable seed/phase. | Hidden glyphs remain covered at every style/width; surviving words/punctuation remain readable; texture matches in PNG; hover never reveals committed ink. |
| P4.5 | P1 · builder | P4.3 | Add optional title/byline with single-commit history and clear source attribution. | Blur/Enter commits once; cancelled edits do not corrupt history; title/byline and source credit render/export with predictable wrapping. |
| P4.6 | P2 · design + builder | P4.1–P4.5 | Refine contextual hint, status feedback, artwork placement and restrained transitions. | No layout jump on toggling; blackout commits immediately; reduced-motion state is static; the first screen feels illustrated without delaying the page. |

Appearance changes are composition edits. Search, hover, focus and unsaved input keystrokes are interface state. Keep that boundary consistent through Undo/Redo and source replacement.

## 6. Phase 5 — integration and accessibility evidence

**Exit:** known critical failures are closed, and remaining limits are honestly described.

| ID | Priority / owner | Dependency | Work | Done when |
|---|---|---|---|---|
| P5.1 | P0 · builder | P3.2, P4.3–P4.5 | Extend export preparation for fonts/assets, coherent revision capture, bounded retry, allocation and failure recovery. | Mid-preparation edits cannot export stale/mixed state; missing art/font and oversized PNG errors preserve work; fallbacks match the visible page. |
| P5.2 | P0 · builder + reviewer | P3–P4, P5.1 | Run focused state/import/export regression checks and the complete UI journey. | Actual commands, environment, commit and results recorded; duplicate IDs, source/history/style branching and geometry cases pass or have documented blockers. |
| P5.3 | P0 · reviewer + builder | P4, P5.1 | Check keyboard, focus/dialogs, contrast, reflow, text spacing, forced colours and available assistive technology. | Keyboard-only journey passes; no clipped/obscured content at 320 px and 400% zoom; measured failures fixed; unavailable checks remain labelled unverified. |
| P5.4 | P1 · reviewer + design | P5.1–P5.3 | Inspect desktop/phone compositions and actual PNGs; test physical touch and additional browsers when available. | Export comparison and viewport/device/browser matrix recorded; short-word accuracy assessed on a physical phone if available; no device claims from emulation alone. |
| P5.5 | P1 · reviewer | P3–P5 | Observe representative teenagers/adults if available, without coaching; inspect performance on available representative hardware. | Report source discovery, toggling, recovery, styling and export observations; record actual timing/device details; lack of participants/hardware is explicit. |

### Required evidence matrix

| Case | Required observation |
|---|---|
| Repeated words | Hide one occurrence; others and their IDs remain unchanged through undo, restyle and resize. |
| Curly/straight apostrophes and punctuation | Source round-trips; masks conceal letters without covering adjacent retained marks. |
| Verse and paragraphs | Import, preview, editor and PNG preserve meaningful breaks and order. |
| Long passage and long token | Natural wrapping; no horizontal trap, clipped credit or uncontrolled Canvas allocation. |
| Undo/Redo branching | Source change, Restore all, edition and title edits restore the complete correct composition; new actions clear Redo. |
| Stale import or export | Deferred file reads cannot overwrite a newer draft; export captures a coherent current composition. |
| Narrow screen and zoom | Accessible controls, no content obscured by toolbar/dialog, stable selection and readable text. |
| Assets and type | Load/decode failure yields a visible shared fallback or recoverable error; no silent PNG omission. |
| Actual PNG | Composition, credit, masks, plate, type and seed match the settled page; no focus, hover or editor controls. |
| Accessibility | Labels/pressed state, focus, non-colour state cues, contrast and reduced motion are verified by appropriate methods. |

Use browser automation where available, plus visual inspection and manual keyboard/touch checks. Automation does not establish screen-reader quality or comfortable physical touch. Proposed initial compressed payload under 500 KiB and roughly 100 ms interaction feedback are targets to measure, not existing benchmarks.

**Gate G3:** no unresolved source corruption, cross-occurrence selection, history loss, concealed-text leakage, essential keyboard failure or misleading export. Distinguish an environment-blocked check from a passed check. Do not state full accessibility conformance from a partial audit.

## 7. Phase 6 — reviewable delivery

**Exit:** another maintainer can reproduce, review and continue the result.

| ID | Priority / owner | Dependency | Work | Done when |
|---|---|---|---|---|
| P6.1 | P1 · builder + reviewer | G3 | Update README, browser/review reports, asset/provenance notices, source reconciliation/release ledger and module checks. | Documents describe the final implementation and actual evidence; stale screenshots/claims removed; new modules included in checks. |
| P6.2 | P0 · builder | P6.1 | Prepare a fresh reviewable change from current main and verify the existing Site/access before any authorised preview update. | Final commit/diff and any preview version are traceable; no duplicate Site, access expansion or unrequested publication; baseline remains recoverable. |
| P6.3 | P1 · builder | P6.2 | Refresh this hand-off and roadmap with completed task IDs, remaining issues and next action. | Next maintainer has exact code/version/input locations, evidence, limitations and a small ordered follow-up list. |

The current documents request does not itself authorise implementing this roadmap, merging a future PR or widening the Site's audience. Preserve existing access. Any later deployment must follow the user's actual authorisation and the applicable Sites workflow.

## 8. Risks and scope decisions

| Risk | Response |
|---|---|
| 80 headings mistaken for 80 integrated texts | G1 requires full-body reconciliation and distinct prepared/released counts. |
| Rich art breaks export parity | G2 proves one shared live/PNG scene before asset expansion. |
| Restyling or layout remounts word identities | Preserve revision/offset IDs; verify exact selected IDs before/after change. |
| Texture exposes hidden text or covers punctuation | Use opaque masks, shared geometry, stable phase and close inspection. |
| New assets reintroduce stale export state | Await dependencies, capture current coherent state, measure/paint synchronously; test delayed resources and concurrent edits. |
| Tiny word targets work in automation but fail on phones | Real-device observation when available; keep the page readable; do not treat inline-target exceptions as usability evidence. |
| Rights uncertainty spreads into unrelated work | Keep a per-record ledger and isolated release hold; continue safe preparation and unrelated implementation. |
| Scope grows into a stationery dashboard | Keep one studio, one history, progressive controls and natural page scroll. |

**Deferred:** accounts, sharing dashboards, social features, timelines, music, generated poems, free-positioned words, autosave and a plain-reading extraction mode. No extra feature should displace source fidelity, accessible controls, original artwork or a matching export.

## 9. Resume checklist

- [ ] Read the hand-off and detailed brief; inspect current main and repository instructions.
- [ ] Record fresh baseline results and stage/hash original inputs.
- [ ] Complete the 80-record reconciliation and release ledger.
- [ ] Prove one illustrated live page and PNG.
- [ ] Complete source discovery, mobile studio and four editions.
- [ ] Run bounded checks; record actual failures, fixes and unverified areas.
- [ ] Prepare the reviewable result and refresh the hand-off.

Next concrete work: **P1.1 → P1.2 → P1.3**, with P1.5 provenance research and P2.2 original asset exploration following staged inputs. The first substantive review should examine reconciled source records and the single illustrated editor/PNG proof.

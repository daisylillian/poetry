# Browser checks — 20 October 2026

Tested the local supervisor preview in the supported Chrome cloud browser. Native viewport was 1363×936. Reusable `test/viewport.html` supplies normal UI buttons and a same-origin app iframe at 1280px and 390px; scrollbar client widths were 1265px and 375px. The temporary served copy was removed. These are simulated CSS viewports and mouse/keyboard checks, not real-device touch or Safari/Firefox validation.

## Journey and results

- Default proof: cohesive paper/ink literary treatment, legible source credit/link, no horizontal overflow. Native and 1280px proof inspected visually once.
- Local source: pasted `River, river; river! Don’t don't don’t.\n\nA line stays—here.\nAnother line: sea & sky.`. All 14 independent words appeared. Blacked out only word 2 and word 4: other repeats remained. Straight/curly apostrophes remained inside independent words; punctuation, blank paragraph and single verse line stayed visible.
- History: Undo/Redo restored each toggle. Restore all then Undo recovered masks. Replaced source with a three-word page, then Undo recovered the exact 14-word source, four hidden IDs, paper, ink, type and treatment.
- Keyboard: ArrowRight moved one word without changing masks; Home/End reached ends; Space/Enter toggled independently; only one word had tabindex 0. Tab left the word collection (default source credit link; custom text to document). Focus showed a solid red outline distinct from the committed ink block. CSS supplies dashed hover, solid focus and opaque ink; hover-only simulation is not exposed by this browser API.
- Appearance: Blush/Midnight/Typescript/Soft edge preserved hidden IDs 2,4,5,14. PNG preview visually matched the page's words, punctuation, verse, colours, type, mask geometry, heading, rules and credit without editing controls or focus. Actual PNG 1684×1240, download event completed and synchronised to a nonempty host PNG (file signature verified).
- 390px: staged local verse, blacked out second repeated word, Undo/Redo, Chalk/Oxide/Plainspoken/Clean cut, exported PNG. Preview 670×1000 fit the narrow modal with visible save link, line breaks and mask. No horizontal overflow (375px client/scroll width); sample word line box about 38px high. This confirms simulated narrow mouse interaction, not touch ergonomics on a physical phone.
- Long content: 961 words including a 190-character single word. Narrow scrollWidth stayed 375px; the long word wrapped within the 291px poem width and could be blacked out. Switching to 1280px retained hidden word 961 and no horizontal overflow (1265px client/scroll width).
- Local `.txt` chooser: an initial attempt through the iframe timed out and reset the browser kernel. A subsequent top-level run through the normal documented file chooser succeeded with a UTF-8 fixture containing punctuation, a curly apostrophe, and a blank paragraph. The app staged the text as a draft without changing the poem; Use This Text committed the exact text and produced 6/6 words. Undo restored the original sample (45 of 142 words remaining) and its source credit.

- After the independent export-timing fix, the main thread reloaded the app and checked the normal export once: the default sample produced a matching 1684×1310 PNG preview with its source credit and visible download link. The full browser sweep was not repeated.

## Actual failure and focused fix

At 390px hidden `<br>` elements joined intro and privacy copy (`hidingin`, `meaning.Click`, `browser.Refreshing`). Added separating whitespace before those line breaks in `dist/index.html`. Reloaded only affected 390px copy and visually verified normal word separation. No state/architecture changes.

## Evidence

The reviewed default-page screenshot is retained in git as `docs/preview.jpg`. Other screenshots and the downloaded PNG were session evidence and are not retained in the repository.

Final browser returned to `/` default sample with export closed. These checks did not publish the site or write to GitHub. Browser screenshot service occasionally returned a frame from immediately before the latest action; final evidence was captured after settled DOM observations. No reduced-motion emulation capability; relevant CSS limits animation to no-preference and was inspected, not emulated. No dark mode or Calm mode exists.

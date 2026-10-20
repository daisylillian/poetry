import { SAMPLE_TEXT, DEFAULT_STYLE, PALETTES, INKS, TYPES, TREATMENTS, makeSource, createHistory, readPlainTextFile } from './core.js';
import { printableText, paintInkSVG, renderPNG } from './export.js';

const $ = selector => document.querySelector(selector);
const poem = $('#poem');
const sheet = $('#sheet');
const sourceInput = $('#source-input');
const sourceError = $('#source-error');
const status = $('#status');
let revision = 1;
let renderedSource = null;
let rovingId = null;
let inkFrame = 0;
let draftVersion = 0;
let imageURL = null;
let exporting = false;

const source = makeSource(SAMPLE_TEXT, `page-${revision}`, true);
// A worked proof invites the first click. Restore all words reveals the full passage.
const keepPhrases = ['Never', 'a river', 'sleek, sinuous', 'animal', 'chasing and chuckling', 'leaving', 'a laugh', 'fresh playmates', 'free', 'All', 'glints and gleams and sparkles', 'rustle and swirl', 'bewitched, entranced, fascinated', 'the river still chattered', 'the best stories in the world', 'the heart of the earth', 'the insatiable sea'];
const keptOffsets = new Set();
for (const phrase of keepPhrases) {
  const start = SAMPLE_TEXT.indexOf(phrase);
  if (start >= 0) for (const token of source.tokens) if (token.kind === 'word' && token.offset >= start && token.offset < start + phrase.length) keptOffsets.add(token.offset);
}
const history = createHistory({ source, hidden: new Set(source.tokens.filter(token => token.kind === 'word' && !keptOffsets.has(token.offset)).map(token => token.id)), style: DEFAULT_STYLE });
sourceInput.value = SAMPLE_TEXT;
for (const element of sheet.querySelectorAll('[data-print]')) printableText(element, element.textContent);

function announce(message) {
  status.textContent = '';
  requestAnimationFrame(() => { status.textContent = message; });
}

function scheduleInk() {
  cancelAnimationFrame(inkFrame);
  inkFrame = requestAnimationFrame(() => {
    const svg = poem.querySelector('svg');
    if (svg) paintInkSVG(svg, poem, history.current);
  });
}

function render() {
  const state = history.current;
  const words = state.source.tokens.filter(token => token.kind === 'word');
  if (renderedSource !== state.source.id) {
    const fragment = document.createDocumentFragment();
    rovingId = words[0]?.id;
    let wordIndex = 0;
    for (const token of state.source.tokens) {
      if (token.kind === 'space') {
        fragment.append(document.createTextNode(token.text));
      } else {
        const element = document.createElement(token.kind === 'word' ? 'button' : 'span');
        if (token.kind === 'word') {
          element.type = 'button';
          element.className = 'word';
          element.dataset.id = token.id;
          element.dataset.offset = String(token.offset);
          element.dataset.word = token.text;
          element.dataset.index = String(++wordIndex);
          element.tabIndex = token.id === rovingId ? 0 : -1;
          if (token.text.length > 32) element.classList.add('long-word');
        }
        printableText(element, token.text);
        fragment.append(element);
      }
    }
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('ink-layer');
    svg.setAttribute('aria-hidden', 'true');
    fragment.append(svg);
    poem.replaceChildren(fragment);
    const credit = $('#credit');
    if (state.source.sample) {
      const title = document.createElement('span');
      printableText(title, 'Kenneth Grahame · The Wind in the Willows, 1908');
      const link = document.createElement('a');
      link.href = 'https://www.gutenberg.org/ebooks/289';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', 'Public domain source: The Wind in the Willows at Project Gutenberg (opens a new tab)');
      printableText(link, 'Public domain · gutenberg.org/ebooks/289');
      credit.replaceChildren(title, document.createElement('br'), link);
    } else {
      printableText(credit, 'Source text supplied by you.\nMade at The Improbable Press.');
    }
    renderedSource = state.source.id;
  }
  sheet.style.setProperty('--paper', PALETTES[state.style.paper].colour);
  sheet.style.setProperty('--text', PALETTES[state.style.paper].text);
  sheet.style.setProperty('--ink', INKS[state.style.ink].colour);
  poem.dataset.type = state.style.type;
  for (const button of poem.querySelectorAll('.word')) {
    const hidden = state.hidden.has(button.dataset.id);
    button.setAttribute('aria-pressed', String(hidden));
    button.setAttribute('aria-label', `${hidden ? 'Restore' : 'Black out'} “${button.dataset.word}”, word ${button.dataset.index} of ${words.length}`);
  }
  $('#undo').disabled = !history.canUndo;
  $('#redo').disabled = !history.canRedo;
  $('#restore').disabled = state.hidden.size === 0;
  $('#word-count').textContent = `${words.length - state.hidden.size} / ${words.length} words remain`;
  for (const input of document.querySelectorAll('input[name="paper"],input[name="ink"]')) input.checked = state.style[input.name] === input.value;
  $('#type-select').value = state.style.type;
  $('#treatment-select').value = state.style.treatment;
  scheduleInk();
}

function changeHistory(direction) {
  if (direction === 'undo' ? !history.canUndo : !history.canRedo) return;
  const previousSource = history.current.source.id;
  const pageHadFocus = poem.contains(document.activeElement);
  history[direction]();
  render();
  if (pageHadFocus && previousSource !== history.current.source.id) poem.querySelector('.word')?.focus();
  announce(direction === 'undo' ? 'Last change undone.' : 'Change redone.');
}

poem.addEventListener('click', event => {
  const button = event.target.closest('.word');
  if (!button) return;
  const state = history.current;
  const id = button.dataset.id;
  const wasHidden = state.hidden.has(id);
  if (wasHidden) state.hidden.delete(id); else state.hidden.add(id);
  history.commit(state);
  roveTo(button, false);
  render();
  announce(`“${button.dataset.word}” ${wasHidden ? 'restored' : 'blacked out'}.`);
});

function roveTo(button, focus = true) {
  const previous = poem.querySelector('.word[tabindex="0"]');
  if (previous) previous.tabIndex = -1;
  button.tabIndex = 0;
  rovingId = button.dataset.id;
  if (focus) button.focus({ preventScroll: true });
}

poem.addEventListener('keydown', event => {
  const current = event.target.closest('.word');
  if (!current || event.altKey || event.ctrlKey || event.metaKey) return;
  const buttons = [...poem.querySelectorAll('.word')];
  const index = buttons.indexOf(current);
  const target = event.key === 'ArrowRight' ? buttons[Math.min(index + 1, buttons.length - 1)] : event.key === 'ArrowLeft' ? buttons[Math.max(0, index - 1)] : event.key === 'Home' ? buttons[0] : event.key === 'End' ? buttons.at(-1) : null;
  if (target) {
    event.preventDefault();
    roveTo(target);
    target.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }
});

$('#undo').addEventListener('click', () => changeHistory('undo'));
$('#redo').addEventListener('click', () => changeHistory('redo'));
$('#restore').addEventListener('click', () => {
  const state = history.current;
  if (!state.hidden.size) return;
  state.hidden.clear();
  history.commit(state);
  render();
  announce('All words restored. You can undo this change.');
});

document.addEventListener('keydown', event => {
  if (!(event.ctrlKey || event.metaKey) || event.altKey || event.target.closest('input,textarea,select,[contenteditable="true"]') || $('#export-dialog').open) return;
  const key = event.key.toLowerCase();
  if (key === 'z' || key === 'y') {
    event.preventDefault();
    changeHistory(key === 'y' || event.shiftKey ? 'redo' : 'undo');
  }
});

sourceInput.addEventListener('input', () => { draftVersion++; sourceError.textContent = ''; $('#file-name').textContent = ''; });
$('#source-file').addEventListener('change', async event => {
  const file = event.target.files[0];
  if (!file) return;
  const version = ++draftVersion;
  sourceError.textContent = '';
  try {
    const text = await readPlainTextFile(file);
    if (version !== draftVersion) return;
    sourceInput.value = text;
    $('#file-name').textContent = `${file.name} is ready. Choose “Use this text” to replace the page.`;
    announce('File ready in the source editor. Your poem has not changed.');
  } catch (error) {
    if (version === draftVersion) sourceError.textContent = error.message;
  } finally {
    event.target.value = '';
  }
});

$('#use-source').addEventListener('click', () => {
  try {
    const nextSource = makeSource(sourceInput.value, `page-${++revision}`);
    draftVersion++;
    const state = history.current;
    history.commit({ ...state, source: nextSource, hidden: new Set() });
    sourceError.textContent = '';
    render();
    $('#source-details').open = false;
    poem.querySelector('.word')?.focus();
    announce('New source text is on the page. Undo returns to the previous poem.');
  } catch (error) {
    sourceError.textContent = error.message;
  }
});

$('#appearance-details').addEventListener('change', event => {
  const input = event.target;
  const groups = { paper: PALETTES, ink: INKS, type: TYPES, treatment: TREATMENTS };
  if (!groups[input.name]?.[input.value]) return;
  const state = history.current;
  if (state.style[input.name] === input.value) return;
  state.style[input.name] = input.value;
  history.commit(state);
  render();
  announce('Page appearance updated. Word choices are unchanged.');
});

$('#export').addEventListener('click', async () => {
  if (exporting) return;
  exporting = true;
  const button = $('#export');
  button.disabled = true;
  button.textContent = 'Preparing your page…';
  try {
    const result = await renderPNG(sheet, () => history.current);
    if (imageURL) URL.revokeObjectURL(imageURL);
    imageURL = URL.createObjectURL(result.blob);
    $('#export-preview').src = imageURL;
    $('#download').href = imageURL;
    $('#export-preview').alt = `Your blackout poem, exported at ${result.width} by ${result.height} pixels.`;
    $('#export-dialog').showModal();
    announce('PNG ready. Preview your page and choose Download PNG.');
  } catch (error) {
    announce(`Export failed. ${error.message}`);
    sourceError.textContent = `Export failed. ${error.message}`;
    $('#source-details').open = true;
  } finally {
    exporting = false;
    button.disabled = false;
    button.replaceChildren(document.createTextNode('Export PNG '));
    const arrow = document.createElement('span');
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '↓';
    button.append(arrow);
  }
});
$('#close-export').addEventListener('click', () => $('#export-dialog').close());
$('#export-dialog').addEventListener('close', () => $('#export').focus());
window.addEventListener('beforeunload', () => { if (imageURL) URL.revokeObjectURL(imageURL); });
new ResizeObserver(scheduleInk).observe(poem);
document.fonts.ready.then(scheduleInk);
render();

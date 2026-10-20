export const MAX_CHARACTERS = 12000;
export const MAX_FILE_BYTES = 60000;
export const MAX_EXPORT_EDGE = 16384;
export const MAX_EXPORT_PIXELS = 32000000;

export const SAMPLE_TEXT = `Never in his life had he seen a river before—this sleek, sinuous, full-bodied animal, chasing and chuckling, gripping things with a gurgle and leaving them with a laugh, to fling itself on fresh playmates that shook themselves free, and were caught and held again. All was a-shake and a-shiver—glints and gleams and sparkles, rustle and swirl, chatter and bubble.

The Mole was bewitched, entranced, fascinated. By the side of the river he trotted as one trots, when very small, by the side of a man who holds one spell-bound by exciting stories; and when tired at last, he sat on the bank, while the river still chattered on to him, a babbling procession of the best stories in the world, sent from the heart of the earth to be told at last to the insatiable sea.`;

export const PALETTES = {
  cream: { label: 'Ivory', colour: '#f5f0e5', text: '#211c19' },
  white: { label: 'Chalk', colour: '#faf9f5', text: '#211c19' },
  rose: { label: 'Blush', colour: '#f1ded5', text: '#211c19' },
};
export const INKS = {
  black: { label: 'Carbon', colour: '#211c19' },
  blue: { label: 'Midnight', colour: '#233c51' },
  red: { label: 'Oxide', colour: '#8b332c' },
};
export const TYPES = {
  book: { label: 'Bookish', family: 'Georgia, "Times New Roman", serif' },
  typewriter: { label: 'Typescript', family: '"Courier New", Courier, monospace' },
  sans: { label: 'Plainspoken', family: 'Arial, Helvetica, sans-serif' },
};
export const TREATMENTS = { solid: 'Clean cut', brush: 'Dry brush', rounded: 'Soft edge' };
export const DEFAULT_STYLE = Object.freeze({ paper: 'cream', ink: 'black', type: 'book', treatment: 'brush' });

// Offsets refer to the untouched source, so repeated words never share an identity.
export function tokenise(text, revision = 'source') {
  const pattern = /[\p{L}\p{N}\p{M}]+(?:['’ʼ][\p{L}\p{N}\p{M}]+)*|\s+|[^\p{L}\p{N}\p{M}\s]+/gu;
  return [...text.matchAll(pattern)].map(match => ({
    id: `${revision}:${match.index}`,
    offset: match.index,
    text: match[0],
    kind: /^[\p{L}\p{N}\p{M}]/u.test(match[0]) ? 'word' : /^\s/u.test(match[0]) ? 'space' : 'punctuation',
  }));
}

export function validateText(text) {
  if (typeof text !== 'string') throw new Error('Choose a plain-text file or paste your words.');
  // Preserve line endings, punctuation and spacing exactly as supplied.
  if (!text.trim()) throw new Error('Add some words before bringing the page to press.');
  if (text.length > MAX_CHARACTERS) throw new Error(`Keep your text to ${MAX_CHARACTERS.toLocaleString('en-GB')} characters or fewer.`);
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(text)) throw new Error('This looks like a non-text file. Choose a UTF-8 .txt file.');
  if (!tokenise(text).some(token => token.kind === 'word')) throw new Error('Include at least one word in your source text.');
  return text;
}

export async function readPlainTextFile(file) {
  if (!file) throw new Error('Choose a .txt file to import.');
  if (!/\.txt$/i.test(file.name)) throw new Error('Choose a plain-text file ending in .txt.');
  if (file.size > MAX_FILE_BYTES) throw new Error('Choose a .txt file smaller than 60 KB.');
  let text;
  try {
    const bytes = await file.arrayBuffer();
    text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    throw new Error('The file could not be read as UTF-8 plain text. Try pasting its words instead.');
  }
  return validateText(text);
}

export function makeSource(text, revision, sample = false) {
  return Object.freeze({ id: revision, text: validateText(text), sample, tokens: Object.freeze(tokenise(text, revision).map(Object.freeze)) });
}

function snapshot(state) {
  return { source: state.source, hidden: new Set(state.hidden), style: { ...state.style } };
}

// Full composition snapshots make source replacement, reset and style changes undoable.
export function createHistory(initial) {
  let present = snapshot(initial);
  const past = [];
  const future = [];
  return {
    get current() { return snapshot(present); },
    get canUndo() { return past.length > 0; },
    get canRedo() { return future.length > 0; },
    commit(next) {
      past.push(present);
      present = snapshot(next);
      future.length = 0;
      return this.current;
    },
    undo() {
      if (!past.length) return this.current;
      future.push(present);
      present = past.pop();
      return this.current;
    },
    redo() {
      if (!future.length) return this.current;
      past.push(present);
      present = future.pop();
      return this.current;
    },
  };
}

export function exportDimensions(width, height, requestedScale = 2) {
  if (![width, height, requestedScale].every(Number.isFinite) || width <= 0 || height <= 0 || requestedScale <= 0) throw new Error('The page could not be measured. Please try again.');
  const scale = Math.min(requestedScale, MAX_EXPORT_EDGE / width, MAX_EXPORT_EDGE / height, Math.sqrt(MAX_EXPORT_PIXELS / (width * height)));
  if (scale < 1) throw new Error('This page is too long to export safely. Shorten the source text, then try again.');
  return { width: Math.floor(width * scale), height: Math.floor(height * scale), scale };
}

// The SVG on the page and the canvas export use exactly the same polygon.
export function maskPoints(x, y, width, height, treatment, seed = 0) {
  const left = x - 1.2;
  const right = x + width + 1.2;
  const top = y - 1;
  const bottom = y + height + 1;
  if (treatment !== 'brush') return [[left, top], [right, top], [right, bottom], [left, bottom]];
  const shift = (seed % 7) * 0.18;
  return [[left + 0.7, top + 1.2], [left + width * 0.24, top + shift], [left + width * 0.61, top + 0.7], [right - 0.4, top], [right, bottom - 0.8], [left + width * 0.72, bottom - shift], [left + width * 0.29, bottom], [left, bottom - 0.5]];
}

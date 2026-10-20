import test from 'node:test';
import assert from 'node:assert/strict';
import { tokenise, validateText, readPlainTextFile, makeSource, createHistory, DEFAULT_STYLE, SAMPLE_TEXT, exportDimensions, MAX_EXPORT_PIXELS, MAX_EXPORT_EDGE, maskPoints } from '../dist/core.js';

test('tokenisation roundtrips punctuation, verse, tabs, CRLF and Unicode', () => {
  for (const text of [SAMPLE_TEXT, '“Don’t,” she said—don’t.\r\n\r\n  River\tRiver\nfin.', "l'amour o’er café e\u0301lan 🦋 42", 'word'.repeat(300)]) {
    const tokens = tokenise(text, 'r1');
    assert.equal(tokens.map(token => token.text).join(''), text);
    assert.equal(new Set(tokens.map(token => token.id)).size, tokens.length);
  }
  const repeated = tokenise('river river river', 'r1').filter(token => token.kind === 'word');
  assert.deepEqual(repeated.map(token => token.id), ['r1:0', 'r1:6', 'r1:12']);
  assert.deepEqual(tokenise("don't don’t o’er", 'r').filter(token => token.kind === 'word').map(token => token.text), ["don't", 'don’t', 'o’er']);
});

test('source identity changes even when the replacement words match', () => {
  const a = makeSource('same same', 'a');
  const b = makeSource('same same', 'b');
  assert.notEqual(a.tokens[0].id, b.tokens[0].id);
  assert.ok(Object.isFrozen(a.tokens[0]));
});

test('history undoes source replacement, reset, styles and branches without losing selections', () => {
  const source = makeSource('river river', 'old');
  const hidden = new Set([source.tokens[0].id]);
  const history = createHistory({ source, hidden, style: DEFAULT_STYLE });
  hidden.clear();
  assert.equal(history.current.hidden.size, 1, 'input sets are copied');
  const next = history.current;
  next.style.ink = 'red';
  history.commit(next);
  const replacement = makeSource('new\npage', 'new');
  history.commit({ source: replacement, hidden: new Set(), style: next.style });
  history.undo();
  assert.equal(history.current.source, source);
  assert.deepEqual([...history.current.hidden], ['old:0']);
  assert.equal(history.current.style.ink, 'red');
  history.redo();
  assert.equal(history.current.source, replacement);
  history.undo();
  const reset = history.current;
  reset.hidden.clear();
  history.commit(reset);
  assert.equal(history.canRedo, false);
  assert.equal(history.current.hidden.size, 0);
  history.undo();
  assert.equal(history.current.hidden.size, 1);
  history.undo();
  assert.equal(history.current.style.ink, 'black');
  assert.equal(history.canUndo, false);
});

test('source text rejects empty, over-limit, binary and wordless input safely', () => {
  for (const text of ['', '   \n', 'x'.repeat(12001), 'hello\0world', '—!?']) assert.throws(() => validateText(text));
  const literal = '<script>alert(1)</script>\n& text';
  assert.equal(validateText(literal), literal);
  assert.equal(validateText('x'.repeat(12000)).length, 12000);
});

test('file import validates extension, byte size, UTF-8 and unchanged line endings', async () => {
  const file = (name, text) => ({ name, size: new TextEncoder().encode(text).length, arrayBuffer: async () => new TextEncoder().encode(text).buffer });
  assert.equal(await readPlainTextFile(file('poem.TXT', 'A\r\nB\n\nC')), 'A\r\nB\n\nC');
  await assert.rejects(readPlainTextFile(file('image.png', 'text')), /\.txt/);
  await assert.rejects(readPlainTextFile({ ...file('large.txt', 'word'), size: 60001 }), /60 KB/);
  await assert.rejects(readPlainTextFile({ name: 'binary.txt', size: 2, arrayBuffer: async () => new Uint8Array([0xc0, 0xaf]).buffer }), /UTF-8/);
  await assert.rejects(readPlainTextFile(file('empty.txt', '')), /some words/);
  await assert.rejects(readPlainTextFile(null), /Choose/);
});

test('PNG allocation stays within edge/area limits and rejects impossible pages', () => {
  assert.deepEqual(exportDimensions(600, 800), { width: 1200, height: 1600, scale: 2 });
  for (const [width, height] of [[1000, 10000], [700, 16000], [6000, 5000]]) {
    const result = exportDimensions(width, height);
    assert.ok(result.width * result.height <= MAX_EXPORT_PIXELS);
    assert.ok(Math.max(result.width, result.height) <= MAX_EXPORT_EDGE);
  }
  for (const values of [[0, 10], [NaN, 1], [800, 17000], [8000, 8000]]) assert.throws(() => exportDimensions(...values));
});

test('shared mask primitives are deterministic and stay opaque closed polygons', () => {
  assert.deepEqual(maskPoints(10, 20, 30, 15, 'brush', 8), maskPoints(10, 20, 30, 15, 'brush', 8));
  assert.equal(maskPoints(10, 20, 30, 15, 'brush', 8).length, 8);
  assert.equal(maskPoints(10, 20, 30, 15, 'solid', 8).length, 4);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { renderPNG } from '../dist/export.js';
import { DEFAULT_STYLE, PALETTES, INKS } from '../dist/core.js';

test('PNG captures matching live state and layout after asynchronous preparation', async t => {
  let releaseFonts;
  let finishImage;
  const frames = [];
  const fills = [];
  const textDraws = [];
  const context = {
    scale() {},
    fillRect(...rect) { fills.push({ colour: this.fillStyle, rect }); },
    fillText(...text) { textDraws.push(text); },
    beginPath() {}, moveTo() {}, lineTo() {}, closePath() {},
    fill() { fills.push({ colour: this.fillStyle }); },
  };
  const canvas = { getContext: () => context, toBlob: callback => { finishImage = callback; } };
  const rect = { left: 10, top: 20, right: 40, width: 30, height: 18 };
  const node = { nodeType: 3, data: 'new' };
  const word = { dataset: { id: 'new:0', offset: '0' } };
  const glyph = { firstChild: node, previousElementSibling: { getBoundingClientRect: () => ({ top: 34 }) }, closest: () => word };
  let phase = 'waiting';
  const sheet = {
    getBoundingClientRect() {
      assert.equal(phase, 'captured', 'layout is measured immediately after the state capture');
      return { left: 0, top: 0, width: 100, height: 100 };
    },
    querySelectorAll: selector => selector === '[data-glyph]' ? [glyph] : [],
  };
  let state = { hidden: new Set(['old:0']), style: { ...DEFAULT_STYLE } };
  let captures = 0;
  const originals = new Map(['document', 'requestAnimationFrame', 'getComputedStyle', 'Node'].map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  t.after(() => {
    for (const [key, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  });
  Object.assign(globalThis, {
    document: {
      fonts: { ready: new Promise(resolve => { releaseFonts = resolve; }) },
      createElement: () => canvas,
      createRange: () => ({ setStart() {}, setEnd() {}, getBoundingClientRect: () => rect }),
    },
    requestAnimationFrame: callback => frames.push(callback),
    getComputedStyle: () => ({ fontStyle: 'normal', fontWeight: '400', fontSize: '18px', fontFamily: 'serif', letterSpacing: 'normal', color: '#211c19' }),
    Node: { TEXT_NODE: 3 },
  });

  const pending = renderPNG(sheet, () => {
    captures++;
    assert.equal(phase, 'ready');
    phase = 'captured';
    return state;
  });
  assert.equal(captures, 0);
  releaseFonts();
  await Promise.resolve();
  frames.shift()();
  // A source/appearance edit between readiness frames must be included as one page.
  state = { hidden: new Set(['new:0']), style: { ...DEFAULT_STYLE, paper: 'rose', ink: 'blue', treatment: 'solid' } };
  phase = 'ready';
  frames.shift()();
  await Promise.resolve();
  assert.equal(captures, 1);
  assert.equal(fills[0].colour, PALETTES.rose.colour);
  assert.equal(fills[1].colour, INKS.blue.colour);
  assert.equal(textDraws.length, 0, 'the new word is masked rather than accidentally restored');
  // Once canvas painting is complete, later edits do not alter the queued image.
  state = { hidden: new Set(), style: { ...DEFAULT_STYLE } };
  finishImage(new Blob(['png'], { type: 'image/png' }));
  const result = await pending;
  assert.equal(result.width, 200);
  assert.equal(result.height, 200);
  assert.equal(result.blob.type, 'image/png');
});

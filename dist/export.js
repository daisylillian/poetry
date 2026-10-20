import { exportDimensions, maskPoints, PALETTES, INKS } from './core.js';

export function printableText(element, text) {
  const baseline = document.createElement('span');
  baseline.className = 'baseline';
  baseline.setAttribute('aria-hidden', 'true');
  const glyph = document.createElement('span');
  glyph.className = 'glyph';
  glyph.dataset.glyph = '';
  glyph.textContent = text;
  element.replaceChildren(baseline, glyph);
}

// Read browser line fragments; neither the preview nor the PNG reflows the source.
export function measureGlyph(glyph, origin) {
  const node = glyph.firstChild;
  if (!node || node.nodeType !== Node.TEXT_NODE) return [];
  const text = node.data;
  const range = document.createRange();
  const fragments = [];
  let run = null;
  let firstTop = null;
  const marker = glyph.previousElementSibling;
  const markerY = marker?.getBoundingClientRect().top;
  for (let index = 0; index < text.length; index++) {
    range.setStart(node, index);
    range.setEnd(node, index + 1);
    const rect = range.getBoundingClientRect();
    if (text[index] === '\n' || text[index] === '\r' || !rect.height) { run = null; continue; }
    if (firstTop === null) firstTop = rect.top;
    if (!run || Math.abs(run.top - rect.top) > .5) {
      run = { text: '', x: rect.left - origin.left, y: rect.top - origin.top, top: rect.top, width: 0, height: rect.height, baseline: markerY - origin.top + rect.top - firstTop };
      fragments.push(run);
    }
    run.text += text[index];
    run.width = Math.max(run.width, rect.right - origin.left - run.x);
  }
  return fragments;
}

export function paintInkSVG(svg, poem, state) {
  const origin = poem.getBoundingClientRect();
  svg.setAttribute('viewBox', `0 0 ${origin.width} ${origin.height}`);
  svg.replaceChildren();
  const colour = INKS[state.style.ink].colour;
  for (const word of poem.querySelectorAll('.word[aria-pressed="true"]')) {
    const glyph = word.querySelector('[data-glyph]');
    for (const rect of measureGlyph(glyph, origin)) {
      const shape = document.createElementNS('http://www.w3.org/2000/svg', state.style.treatment === 'rounded' ? 'rect' : 'polygon');
      if (state.style.treatment === 'rounded') {
        for (const [key, value] of Object.entries({ x: rect.x - 1.2, y: rect.y - 1, width: rect.width + 2.4, height: rect.height + 2, rx: 2.5 })) shape.setAttribute(key, String(value));
      } else {
        shape.setAttribute('points', maskPoints(rect.x, rect.y, rect.width, rect.height, state.style.treatment, Number(word.dataset.offset)).map(point => point.join(',')).join(' '));
      }
      shape.setAttribute('fill', colour);
      svg.append(shape);
    }
  }
}

function canvasFont(style) {
  return `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
}

export async function renderPNG(sheet, getState) {
  await document.fonts.ready;
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  // Capture state only once the page is ready. Measurement and painting below
  // run together, so edits during preparation cannot mix two compositions.
  const state = getState();
  const origin = sheet.getBoundingClientRect();
  const dimensions = exportDimensions(origin.width, origin.height);
  const canvas = document.createElement('canvas');
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Your browser could not create the image. Please try another browser.');
  context.scale(dimensions.scale, dimensions.scale);
  context.fillStyle = PALETTES[state.style.paper].colour;
  context.fillRect(0, 0, origin.width, origin.height);
  for (const rule of sheet.querySelectorAll('[data-print-rule]')) {
    const rect = rule.getBoundingClientRect();
    context.fillStyle = PALETTES[state.style.paper].text;
    context.globalAlpha = .5;
    context.fillRect(rect.left - origin.left, rect.top - origin.top, rect.width, rect.height);
  }
  context.globalAlpha = 1;
  context.textBaseline = 'alphabetic';
  for (const glyph of sheet.querySelectorAll('[data-glyph]')) {
    const word = glyph.closest('.word');
    const hidden = word && state.hidden.has(word.dataset.id);
    const style = getComputedStyle(glyph);
    context.font = canvasFont(style);
    if ('letterSpacing' in context) context.letterSpacing = style.letterSpacing === 'normal' ? '0px' : style.letterSpacing;
    context.fillStyle = hidden ? INKS[state.style.ink].colour : style.color;
    for (const rect of measureGlyph(glyph, origin)) {
      if (!hidden) {
        context.fillText(rect.text, rect.x, rect.baseline);
      } else if (state.style.treatment === 'rounded') {
        context.beginPath();
        context.roundRect(rect.x - 1.2, rect.y - 1, rect.width + 2.4, rect.height + 2, 2.5);
        context.fill();
      } else {
        const points = maskPoints(rect.x, rect.y, rect.width, rect.height, state.style.treatment, Number(word.dataset.offset));
        context.beginPath();
        points.forEach(([x, y], index) => index ? context.lineTo(x, y) : context.moveTo(x, y));
        context.closePath();
        context.fill();
      }
    }
  }
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('The image could not be saved. Try a shorter page.');
  return { blob, width: canvas.width, height: canvas.height };
}

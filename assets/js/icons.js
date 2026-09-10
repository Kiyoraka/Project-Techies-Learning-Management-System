/* ==========================================================================
   icons.js — the complete icon set
   --------------------------------------------------------------------------
   Every path here was extracted from the design canvas, not redrawn. The
   template holds 80 inline SVGs which reduce to the 29 distinct glyphs below.

   House style, matching the canvas exactly:
       viewBox="0 0 24 24"  fill="none"  stroke="currentColor"
       stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"

   Icons inherit colour from their parent via currentColor, so a hover rule
   that changes `color` recolours the glyph with it.
   ========================================================================== */

'use strict';

const ICONS = {

  /* --- Sidebar navigation ------------------------------------------------ */
  dash:      'M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z',
  chat:      'M21 11.5a8.4 8.4 0 0 1-9 8.4 8.4 8.4 0 0 1-3.6-.8L3 21l1.9-5.4A8.4 8.4 0 0 1 3 11.5a8.4 8.4 0 0 1 9-8.4 8.4 8.4 0 0 1 9 8.4z',
  act:       'M22 12h-4l-3 9L9 3l-3 9H2',
  users:     'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  book:      'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5V4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z',
  gear:      'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1',
  grad:      'M22 10L12 5 2 10l10 5 10-5zM6 12v5c3 3 9 3 12 0v-5',
  eye:       'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',

  /* --- Chrome and navigation --------------------------------------------- */
  search:    'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
  bell:      'M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0',
  logout:    'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  menu:      'M3 6h18M3 12h18M3 18h18',
  grid:      'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',

  /* --- Direction ---------------------------------------------------------- */
  chevronDown:  'M6 9l6 6 6-6',
  chevronLeft:  'M15 18l-6-6 6-6',
  arrowRight:   'M5 12h14M13 6l6 6-6 6',
  close:        'M18 6L6 18M6 6l12 12',

  /* --- Actions ------------------------------------------------------------ */
  check:     'M20 6L9 17l-5-5',
  plus:      'M12 5v14M5 12h14',
  edit:      'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z',
  trash:     'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6',
  drag:      'M9 6h.01M9 12h.01M9 18h.01M15 6h.01M15 12h.01M15 18h.01',
  share:     'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13',
  link:      'M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1',
  image:     'M3 5h18v14H3zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5L5 19',
  paperclip: 'M21.4 11.1l-9.2 9.2a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5',
  thumbsUp:  'M14 9V5a3 3 0 0 0-6 0v4H4l1.5 11h11L19 9h-5zM7 9v11',
  comment:   'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',

  /* --- Lesson types and status -------------------------------------------- */
  video:     'M6 4l14 8-14 8V4z',
  play:      'M5 3l14 9-14 9V3z',
  file:      'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6',
  quiz:      'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01',
  clock:     'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2',
  lock:      'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4',
  alert:     'M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z',
  user:      'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'
};

/* Lesson type to icon name, used by the curriculum tree and the builder. */
const LESSON_TYPE_ICON = {
  Video: 'video',
  PDF: 'file',
  Text: 'file',
  Quiz: 'quiz'
};

/**
 * Build an inline SVG string for a named icon.
 *
 *   icon('search')                    -> 24px, currentColor
 *   icon('check', 12, { stroke: '#fff', width: 3 })
 *   icon('bell', 20, { className: 'topbar-bell' })
 *
 * Returns '' for an unknown name rather than throwing, so a typo degrades to
 * a missing glyph instead of a blank page.
 */
function icon(name, size, opts) {
  const d = ICONS[name];
  if (!d) {
    return '';
  }
  const o = opts || {};
  const px = size || 24;
  return '<svg width="' + px + '" height="' + px + '" viewBox="0 0 24 24"' +
    ' fill="' + (o.fill || 'none') + '"' +
    ' stroke="' + (o.stroke || 'currentColor') + '"' +
    ' stroke-width="' + (o.width || 2) + '"' +
    ' stroke-linecap="round" stroke-linejoin="round"' +
    (o.className ? ' class="' + o.className + '"' : '') +
    (o.style ? ' style="' + o.style + '"' : '') +
    '><path d="' + d + '"></path></svg>';
}

/**
 * The overflow menu glyph. Three filled circles, not a stroked path, so it
 * cannot go through icon() above.
 */
function iconDots(size) {
  const px = size || 18;
  return '<svg width="' + px + '" height="' + px + '" viewBox="0 0 24 24" fill="currentColor">' +
    '<circle cx="5" cy="12" r="1.8"></circle>' +
    '<circle cx="12" cy="12" r="1.8"></circle>' +
    '<circle cx="19" cy="12" r="1.8"></circle>' +
    '</svg>';
}

/**
 * The Google G, used only on the sign-in button and the student's connected
 * account row. Four brand-coloured paths on a 48-unit grid; never restyled.
 */
function iconGoogle(size) {
  const px = size || 18;
  return '<svg width="' + px + '" height="' + px + '" viewBox="0 0 48 48">' +
    '<path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.5 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.3l7.9 6.1C12.4 13.7 17.7 9.5 24 9.5z"></path>' +
    '<path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.7 6c4.5-4.2 6.9-10.3 6.9-17.7z"></path>' +
    '<path fill="#FBBC05" d="M10.5 28.6A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.1.8-4.6l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.7l7.9-6.1z"></path>' +
    '<path fill="#34A853" d="M24 48c6.3 0 11.7-2.1 15.6-5.7l-7.7-6c-2.1 1.4-4.8 2.3-7.9 2.3-6.3 0-11.6-4.2-13.5-9.9l-7.9 6.1C6.5 42.6 14.6 48 24 48z"></path>' +
    '</svg>';
}

/**
 * Star rating as a plain string, matching how the design renders it.
 *   stars(4.8) -> '★★★★★'
 */
function stars(rating) {
  return '★'.repeat(Math.round(rating || 0));
}

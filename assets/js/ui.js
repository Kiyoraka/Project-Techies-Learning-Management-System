/* ==========================================================================
   ui.js — shared behaviour for the interactive primitives
   --------------------------------------------------------------------------
   Appearance lives in components.css. This file only flips state: classes,
   aria attributes and data attributes. Nothing here writes inline colour.

   Every initialiser is delegated and idempotent, so it is safe to call again
   after a page script injects new markup.

   Requires tokens.css, icons.js.
   ========================================================================== */

'use strict';

/* --------------------------------------------------------------------------
   Tiny DOM helpers
   -------------------------------------------------------------------------- */

function qs(selector, root) {
  return (root || document).querySelector(selector);
}

function qsa(selector, root) {
  return Array.prototype.slice.call((root || document).querySelectorAll(selector));
}

/** Delegated listener. Survives markup being replaced. */
function on(root, eventName, selector, handler) {
  (root || document).addEventListener(eventName, function (event) {
    const match = event.target.closest(selector);
    if (match && (root || document).contains(match)) {
      handler(event, match);
    }
  });
}

/** Escape text destined for an innerHTML string. */
function esc(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* --------------------------------------------------------------------------
   Formatting
   -------------------------------------------------------------------------- */

/** 1240 -> "1,240", matching the design's toLocaleString calls. */
function formatCount(n) {
  return Number(n || 0).toLocaleString('en-US');
}

/**
 * Initials from a name, dropping Malay honorifics so that
 * "Puan Aisyah Rahman" resolves to AR, not PA.
 */
function initialsOf(name) {
  return String(name || '')
    .split(' ')
    .filter(function (word) { return HONORIFICS.indexOf(word) === -1; })
    .map(function (word) { return word.charAt(0); })
    .slice(0, 2)
    .join('');
}

/* --------------------------------------------------------------------------
   Toast
   Bottom-centre pill, emerald check badge, 2600ms life. One at a time: a
   second call replaces the message and restarts the timer, exactly as the
   design's clearTimeout-then-setTimeout does.
   -------------------------------------------------------------------------- */

let _toastTimer = null;

function toast(message) {
  if (!message) {
    return;
  }
  let host = qs('#toast');
  if (!host) {
    host = document.createElement('div');
    host.id = 'toast';
    host.className = 'toast';
    host.setAttribute('role', 'status');
    host.setAttribute('aria-live', 'polite');
    (qs('#overlays') || document.body).appendChild(host);
  }

  host.innerHTML =
    '<span class="toast-badge">' +
    icon('check', 12, { stroke: '#fff', width: 3 }) +
    '</span><span class="toast-text"></span>';
  qs('.toast-text', host).textContent = message;

  host.classList.remove('is-visible');
  void host.offsetWidth; /* restart the entry animation */
  host.classList.add('is-visible');

  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(function () {
    host.classList.remove('is-visible');
  }, 2600);
}

/** Wire every [data-toast] element to fire its message on click. */
function initToasts(root) {
  on(root || document, 'click', '[data-toast]', function (event, el) {
    event.preventDefault();
    const key = el.getAttribute('data-toast');
    toast(TOASTS[key] || key);
  });
}

/* --------------------------------------------------------------------------
   Toggle switch
   Markup:
     <button class="toggle" data-toggle role="switch" aria-checked="true"></button>
   CSS reads aria-checked for the track colour and knob offset.
   -------------------------------------------------------------------------- */

function initToggles(root) {
  on(root || document, 'click', '[data-toggle]', function (event, el) {
    event.preventDefault();
    const next = el.getAttribute('aria-checked') !== 'true';
    el.setAttribute('aria-checked', String(next));
    el.dispatchEvent(new CustomEvent('toggle:change', {
      bubbles: true,
      detail: { on: next, key: el.getAttribute('data-toggle') }
    }));
  });
}

/* --------------------------------------------------------------------------
   Tab group
   Markup:
     <div class="tabs" data-tabs="settings">
       <button class="tab is-active" data-tab="General">General</button>
       ...
     </div>
     <div data-tab-panel="settings:General"> ... </div>

   Panels are optional. A group with no panels still emits tab:change, which
   is how the filtered tables (user management, quiz and assignment) listen.
   -------------------------------------------------------------------------- */

function initTabs(root) {
  on(root || document, 'click', '[data-tab]', function (event, el) {
    event.preventDefault();
    const group = el.closest('[data-tabs]');
    if (!group) {
      return;
    }
    const groupName = group.getAttribute('data-tabs');
    const value = el.getAttribute('data-tab');

    qsa('[data-tab]', group).forEach(function (tab) {
      tab.classList.toggle('is-active', tab === el);
      tab.setAttribute('aria-selected', String(tab === el));
    });

    qsa('[data-tab-panel^="' + groupName + ':"]').forEach(function (panel) {
      panel.hidden = panel.getAttribute('data-tab-panel') !== groupName + ':' + value;
    });

    group.dispatchEvent(new CustomEvent('tab:change', {
      bubbles: true,
      detail: { group: groupName, value: value }
    }));
  });
}

/* --------------------------------------------------------------------------
   Accordion
   Markup:
     <div class="accordion-item is-open">
       <button data-accordion>Module title</button>
       <div class="accordion-body"> ... </div>
     </div>
   Independent by default; add data-accordion-single on a wrapper to make
   opening one close its siblings.
   -------------------------------------------------------------------------- */

function initAccordions(root) {
  on(root || document, 'click', '[data-accordion]', function (event, el) {
    event.preventDefault();
    const item = el.closest('.accordion-item');
    if (!item) {
      return;
    }
    const opening = !item.classList.contains('is-open');
    const single = item.closest('[data-accordion-single]');
    if (single && opening) {
      qsa('.accordion-item', single).forEach(function (sibling) {
        sibling.classList.remove('is-open');
      });
    }
    item.classList.toggle('is-open', opening);
    el.setAttribute('aria-expanded', String(opening));
  });
}

/* --------------------------------------------------------------------------
   Filter pills
   Markup:
     <div class="pills" data-pills="feed">
       <button class="pill is-active" data-pill="All">All</button>
     </div>
   Emits pill:change. Used by the feed categories and the enrolled filter.
   -------------------------------------------------------------------------- */

function initPills(root) {
  on(root || document, 'click', '[data-pill]', function (event, el) {
    event.preventDefault();
    const group = el.closest('[data-pills]');
    if (!group) {
      return;
    }
    qsa('[data-pill]', group).forEach(function (pill) {
      pill.classList.toggle('is-active', pill === el);
    });
    group.dispatchEvent(new CustomEvent('pill:change', {
      bubbles: true,
      detail: { group: group.getAttribute('data-pills'), value: el.getAttribute('data-pill') }
    }));
  });
}

/* --------------------------------------------------------------------------
   Progress ring
   Two sizes exist in the design and both are reproduced exactly:
     course card   r 24, stroke 6,  circumference 150.8, box 56
     quiz result   r 52, stroke 10, circumference 326.7, box 120
   -------------------------------------------------------------------------- */

const RING_PRESETS = {
  card:   { box: 56,  cx: 28, cy: 28, r: 24, width: 6,  circumference: 150.8 },
  result: { box: 120, cx: 60, cy: 60, r: 52, width: 10, circumference: 326.7 }
};

/**
 * progressRing(68)            -> 56px card ring, 68 percent filled
 * progressRing(83, 'result')  -> 120px result ring
 */
function progressRing(percent, preset, colour) {
  const p = RING_PRESETS[preset || 'card'];
  const pct = Math.max(0, Math.min(100, Number(percent) || 0));
  const filled = (pct / 100 * p.circumference).toFixed(1);

  return '<svg class="ring" width="' + p.box + '" height="' + p.box + '"' +
    ' viewBox="0 0 ' + p.box + ' ' + p.box + '">' +
    '<circle cx="' + p.cx + '" cy="' + p.cy + '" r="' + p.r + '"' +
      ' stroke="var(--border)" stroke-width="' + p.width + '" fill="none"></circle>' +
    '<circle cx="' + p.cx + '" cy="' + p.cy + '" r="' + p.r + '"' +
      ' stroke="' + (colour || 'var(--primary)') + '" stroke-width="' + p.width + '"' +
      ' fill="none" stroke-linecap="round"' +
      ' stroke-dasharray="' + filled + ' ' + p.circumference + '"' +
      ' transform="rotate(-90 ' + p.cx + ' ' + p.cy + ')"></circle>' +
    '</svg>';
}

/** Linear progress bar used on course cards and student tables. */
function progressBar(percent, colour) {
  const pct = Math.max(0, Math.min(100, Number(percent) || 0));
  return '<div class="bar"><span class="bar-fill" style="width:' + pct + '%' +
    (colour ? ';background:' + colour : '') + '"></span></div>';
}

/* --------------------------------------------------------------------------
   Chips
   -------------------------------------------------------------------------- */

/** Role chip. `variant` of 'feed' picks the feed's lighter student fill. */
function roleChip(role, variant) {
  const cls = 'chip chip-role chip-' + String(role).toLowerCase() +
    (variant === 'feed' ? ' chip-feed' : '');
  return '<span class="' + cls + '">' + esc(role) + '</span>';
}

/** Course status chip: Published, Draft or Pending review. */
function statusChip(status) {
  const key = String(status).toLowerCase().replace(/\s+/g, '-');
  return '<span class="chip chip-status chip-' + key + '">' + esc(status) + '</span>';
}

/** Category chip used on post cards and course cards. */
function categoryChip(category) {
  return '<span class="chip chip-category">' + esc(category) + '</span>';
}

/** Circular avatar with initials on a data-driven background. */
function avatar(initials, colour, size) {
  const px = size || 40;
  return '<span class="avatar" style="width:' + px + 'px;height:' + px + 'px' +
    (colour ? ';background:' + colour : '') + '">' + esc(initials) + '</span>';
}

/* --------------------------------------------------------------------------
   Empty state
   -------------------------------------------------------------------------- */

function emptyState(title, hint, glyph) {
  return '<div class="empty">' +
    '<span class="empty-badge">' + icon(glyph || 'comment', 24, { stroke: 'var(--primary)' }) + '</span>' +
    '<div class="empty-title">' + esc(title) + '</div>' +
    '<div class="empty-hint">' + esc(hint) + '</div>' +
    '</div>';
}

/* --------------------------------------------------------------------------
   Side panel and drawer
   Markup: any element with [data-panel-open="id"] opens #id, and
   [data-panel-close] or the backdrop closes the nearest open panel.
   -------------------------------------------------------------------------- */

function openPanel(id) {
  const panel = document.getElementById(id);
  if (panel) {
    panel.classList.add('is-open');
    document.body.classList.add('has-panel');
  }
}

function closePanel(panel) {
  const target = panel || qs('.panel.is-open, .drawer.is-open');
  if (target) {
    target.classList.remove('is-open');
  }
  if (!qs('.panel.is-open, .drawer.is-open')) {
    document.body.classList.remove('has-panel');
  }
}

function initPanels(root) {
  on(root || document, 'click', '[data-panel-open]', function (event, el) {
    event.preventDefault();
    openPanel(el.getAttribute('data-panel-open'));
  });
  on(root || document, 'click', '[data-panel-close], .panel-backdrop', function (event, el) {
    event.preventDefault();
    closePanel(el.closest('.panel, .drawer'));
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closePanel();
    }
  });
}

/* --------------------------------------------------------------------------
   Boot
   Called once by shell.js after the chrome is injected.
   -------------------------------------------------------------------------- */

function initUI(root) {
  initToasts(root);
  initToggles(root);
  initTabs(root);
  initAccordions(root);
  initPills(root);
  initPanels(root);
}

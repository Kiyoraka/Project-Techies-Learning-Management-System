/* ==========================================================================
   brand.js — the only place the product name appears
   --------------------------------------------------------------------------
   Every wordmark, footer line and page title across all 29 pages reads from
   this object. Rebranding the prototype is a two-string edit.

   When this build is copied into the Brilliant LMS repo, change only:
       short: 'Brilliant LMS'
       full:  'Brilliant Learning Management System'

   Loaded first on every page, before shell.js.
   ========================================================================== */

'use strict';

const BRAND = Object.freeze({

  /* Wordmark beside the logo slot — sidebar, landing nav, footer, sign-in. */
  short: 'Techies LMS',

  /* Full legal-ish name — footer blurb and copyright line only. */
  full: 'Techies Learning Management System',

  /* The design ships a 40x40 logo slot with no artwork yet, drawn as a
     rounded emerald square holding this text. Replace with an <img> when the
     client supplies a mark. */
  logo: 'LOGO',

  /* Placeholder domain used in sample community posts and settings fields. */
  domain: 'techieslms.my'
});

/**
 * Fill every [data-brand] element on the page.
 *
 *   <span data-brand="short"></span>   ->  Techies LMS
 *   <span data-brand="full"></span>    ->  Techies Learning Management System
 *   <span data-brand="logo"></span>    ->  LOGO
 *
 * Called once by shell.js on DOMContentLoaded. Safe to call again after
 * injecting markup — it simply rewrites the same nodes.
 */
function applyBrand(root) {
  const scope = root || document;
  scope.querySelectorAll('[data-brand]').forEach(function (el) {
    const key = el.getAttribute('data-brand');
    if (Object.prototype.hasOwnProperty.call(BRAND, key)) {
      el.textContent = BRAND[key];
    }
  });
}

/**
 * Set the browser tab title as "Page name — Techies LMS".
 * Pages that want a bare brand title pass no argument.
 */
function brandTitle(pageName) {
  document.title = pageName ? pageName + ' — ' + BRAND.short : BRAND.short;
}

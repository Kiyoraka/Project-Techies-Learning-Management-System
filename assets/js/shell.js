/* ==========================================================================
   shell.js — page chrome injection
   --------------------------------------------------------------------------
   Each page declares its identity once, on the body tag:

     <body data-role="student" data-route="stu.dashboard" data-title="Dashboard">
     <body data-role="public"  data-route="home">

   From those three attributes this file renders the sidebar, topbar, landing
   nav, footer and overlay layer. The chrome therefore exists in ONE place
   rather than being copy-pasted across 22 dashboard pages, while every page
   still opens standalone from file:// with no server and no build step.

   Screen content stays hardcoded in each page. Only the chrome lives here.

   Load order: brand.js, data.js, icons.js, ui.js, shell.js
   ========================================================================== */

'use strict';

const SIDEBAR_STORAGE_KEY = 'tlms.sidebar.collapsed';

/* --------------------------------------------------------------------------
   Navigation definitions, one per role.
   `also` lists routes that should light the same item — the lesson player,
   quiz and results all belong under Enrolled.
   `hash` distinguishes the two children that share one file.
   -------------------------------------------------------------------------- */

const NAV = {
  admin: [
    { label: 'Dashboard',        route: 'admin.dashboard', icon: 'dash' },
    { label: 'Community',        route: 'admin.community', icon: 'chat' },
    { label: 'Activity Log',     route: 'admin.activity',  icon: 'act' },
    { label: 'User Management',  route: 'admin.users',     icon: 'users' },
    { label: 'Course Oversight', route: 'admin.oversight', icon: 'eye' },
    { label: 'Settings',         route: 'admin.settings',  icon: 'gear' }
  ],
  instructor: [
    { label: 'Dashboard', route: 'inst.dashboard', icon: 'dash' },
    { label: 'Community', route: 'inst.community', icon: 'chat' },
    {
      label: 'Course Management', key: 'cm', icon: 'book', children: [
        { label: 'All Courses',   route: 'inst.courses' },
        { label: 'Create Course', route: 'inst.create' },
        { label: 'Quiz',          route: 'inst.qa', hash: 'quiz' },
        { label: 'Assignment',    route: 'inst.qa', hash: 'assignment' }
      ]
    },
    { label: 'Student Management', route: 'inst.students', icon: 'grad' },
    { label: 'Settings',           route: 'inst.settings', icon: 'gear' }
  ],
  student: [
    { label: 'Dashboard', route: 'stu.dashboard', icon: 'dash' },
    { label: 'Community', route: 'stu.community', icon: 'chat' },
    {
      label: 'My Courses', key: 'mc', icon: 'book', children: [
        { label: 'Enrolled',       route: 'stu.enrolled', also: ['stu.player', 'stu.quiz', 'stu.result'] },
        { label: 'Browse Catalog', route: 'stu.catalog' },
        { label: 'Certificates',   route: 'stu.certs' }
      ]
    },
    { label: 'Settings', route: 'stu.settings', icon: 'gear' }
  ]
};

/* Landing top navigation. Courses stays lit while viewing a course detail. */
const SITE_LINKS = [
  { label: 'Home',      route: 'home' },
  { label: 'Courses',   route: 'courses', also: ['detail'] },
  { label: 'Community', route: 'community' }
];

const FOOTER_COLUMNS = [
  { title: 'Learn',     links: [{ label: 'All courses', route: 'courses' }, { label: 'Programming' }, { label: 'Robotics' }, { label: 'Business' }] },
  { title: 'Community', links: [{ label: 'Feed', route: 'community' }, { label: 'Events' }, { label: 'Competitions' }] },
  { title: 'Company',   links: [{ label: 'About' }, { label: 'Become an instructor' }, { label: 'Contact' }] }
];

/* --------------------------------------------------------------------------
   Helpers
   -------------------------------------------------------------------------- */

function hrefFor(route, hash) {
  const entry = ROUTES[route];
  if (!entry) {
    return '#';
  }
  return entry.file + (hash ? '#' + hash : '');
}

function currentHash() {
  return (window.location.hash || '').replace('#', '');
}

/** Does this nav entry own the current route? */
function isCurrent(item, route) {
  if (item.route !== route) {
    return (item.also || []).indexOf(route) !== -1;
  }
  /* Same file, two children: the hash decides which one is lit. */
  if (item.hash) {
    const active = currentHash() || 'quiz';
    return item.hash === active;
  }
  return true;
}

/* --------------------------------------------------------------------------
   Sidebar
   -------------------------------------------------------------------------- */

function renderSidebar(role, route) {
  const items = NAV[role] || [];

  const nav = items.map(function (item) {
    if (!item.children) {
      const active = isCurrent(item, route);
      return '<a class="nav-item' + (active ? ' is-active' : '') + '"' +
        ' href="' + hrefFor(item.route) + '" title="' + esc(item.label) + '">' +
        icon(item.icon, 20) +
        '<span class="nav-label">' + esc(item.label) + '</span>' +
        '</a>';
    }

    const childMarkup = item.children.map(function (child) {
      const active = isCurrent(child, route);
      return '<a class="nav-child' + (active ? ' is-active' : '') + '"' +
        ' href="' + hrefFor(child.route, child.hash) + '">' +
        '<span class="nav-dot"></span>' + esc(child.label) +
        '</a>';
    }).join('');

    const anyChildActive = item.children.some(function (child) {
      return isCurrent(child, route);
    });

    /* A group holding the current page starts expanded. */
    return '<div class="nav-group' + (anyChildActive ? ' is-open' : '') + '">' +
      '<button class="nav-item' + (anyChildActive ? ' is-parent-active' : '') + '"' +
      ' data-accordion-nav aria-expanded="' + anyChildActive + '" title="' + esc(item.label) + '">' +
      icon(item.icon, 20) +
      '<span class="nav-label">' + esc(item.label) + '</span>' +
      '<span class="nav-chevron">' + icon('chevronDown', 16) + '</span>' +
      '</button>' +
      '<div class="nav-children">' + childMarkup + '</div>' +
      '</div>';
  }).join('');

  return '<div class="sidebar-head">' +
      '<a class="brand brand-on-dark" href="' + hrefFor('home') + '">' +
        '<span class="brand-logo" data-brand="logo"></span>' +
        '<span class="brand-name" data-brand="short"></span>' +
      '</a>' +
      '<button class="sidebar-collapse" data-collapse title="Collapse sidebar">' +
        icon('chevronLeft', 18) +
      '</button>' +
    '</div>' +
    '<nav class="sidebar-nav">' + nav + '</nav>' +
    '<div class="sidebar-foot">' +
      '<a class="logout" href="' + hrefFor('home') + '" title="Logout">' +
        icon('logout', 20) +
        '<span class="logout-label">Logout</span>' +
      '</a>' +
    '</div>';
}

/* --------------------------------------------------------------------------
   Topbar
   -------------------------------------------------------------------------- */

function renderTopbar(role, title) {
  const who = SESSION_USER[role] || { name: '', initials: '', title: '' };

  return '<h1 class="topbar-title">' + esc(title) + '</h1>' +
    '<div class="topbar-search">' +
      '<div class="topbar-search-field">' +
        icon('search', 16, { stroke: 'var(--text-muted)' }) +
        '<input class="input input-search" type="search" placeholder="Search courses, people, posts">' +
      '</div>' +
    '</div>' +
    '<div class="topbar-right">' +
      '<button class="topbar-bell" title="Notifications">' + icon('bell', 20) + '</button>' +
      '<div class="topbar-user">' +
        avatar(who.initials, 'var(--sidebar-active)', 34) +
        '<div class="topbar-user-meta">' +
          '<div class="topbar-user-name">' + esc(who.name) + '</div>' +
          '<div class="topbar-user-role">' + esc(who.title) + '</div>' +
        '</div>' +
        icon('chevronDown', 14, { stroke: 'var(--text-muted)' }) +
      '</div>' +
    '</div>';
}

/* --------------------------------------------------------------------------
   Landing chrome
   -------------------------------------------------------------------------- */

function renderSiteNav(route) {
  const links = SITE_LINKS.map(function (link) {
    const active = link.route === route || (link.also || []).indexOf(route) !== -1;
    return '<a class="site-link' + (active ? ' is-active' : '') + '"' +
      ' href="' + hrefFor(link.route) + '">' + esc(link.label) + '</a>';
  }).join('');

  return '<div class="site-nav-inner">' +
      '<a class="brand" href="' + hrefFor('home') + '">' +
        '<span class="brand-logo" data-brand="logo"></span>' +
        '<span class="brand-name" data-brand="short"></span>' +
      '</a>' +
      '<nav class="site-links">' + links + '</nav>' +
      '<a class="btn btn-primary" href="' + hrefFor('signin') + '">Sign In</a>' +
    '</div>';
}

function renderFooter() {
  const columns = FOOTER_COLUMNS.map(function (col) {
    const links = col.links.map(function (link) {
      return '<a href="' + (link.route ? hrefFor(link.route) : '#') + '">' + esc(link.label) + '</a>';
    }).join('');
    return '<div>' +
      '<div class="footer-col-title">' + esc(col.title) + '</div>' +
      '<div class="footer-col-links">' + links + '</div>' +
      '</div>';
  }).join('');

  return '<div class="site-footer-inner">' +
      '<div>' +
        '<div class="brand brand-on-dark">' +
          '<span class="brand-logo" data-brand="logo"></span>' +
          '<span class="brand-name" data-brand="short"></span>' +
        '</div>' +
        '<p class="footer-blurb">' + esc(BRAND.full) +
          '. Practical training for Malaysian learners. Cyberjaya, Selangor.</p>' +
      '</div>' + columns +
    '</div>' +
    '<div class="site-footer-base">' +
      '<div class="site-footer-base-inner">' +
        '<span>&copy; 2026 ' + esc(BRAND.full) + '. All rights reserved.</span>' +
        '<span>Privacy &middot; Terms</span>' +
      '</div>' +
    '</div>';
}

/* --------------------------------------------------------------------------
   Screen index — the prototype's own navigation, linking real files
   -------------------------------------------------------------------------- */

function renderScreenIndex(route) {
  const groups = ROUTE_GROUPS.map(function (groupName) {
    const links = Object.keys(ROUTES)
      .filter(function (key) { return ROUTES[key].group === groupName; })
      .map(function (key) {
        const active = key === route;
        return '<a class="index-link' + (active ? ' is-active' : '') + '"' +
          ' href="' + ROUTES[key].file + '">' + esc(ROUTES[key].title) + '</a>';
      }).join('');
    return '<div>' +
      '<div class="index-group-title">' + esc(groupName) + '</div>' +
      '<div class="index-links">' + links + '</div>' +
      '</div>';
  }).join('');

  return '<div class="index-dock">' +
      '<div class="index-panel" id="index-panel" hidden>' +
        '<div class="index-head">' +
          '<div>' +
            '<div class="index-title">All screens</div>' +
            '<div class="index-hint">Jump anywhere in the prototype</div>' +
          '</div>' +
          '<button class="icon-btn" data-index-toggle>' + icon('close', 16) + '</button>' +
        '</div>' +
        '<div class="index-grid">' + groups + '</div>' +
      '</div>' +
      '<button class="btn btn-dark index-btn" data-index-toggle title="All screens">' +
        icon('grid', 16) + '<span>Screens</span>' +
      '</button>' +
    '</div>';
}

/* --------------------------------------------------------------------------
   Sidebar collapse — persisted so it survives the page hop that the
   one-file-per-screen shape introduces.
   -------------------------------------------------------------------------- */

function readCollapsed() {
  try {
    return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === '1';
  } catch (err) {
    return false;
  }
}

function writeCollapsed(value) {
  try {
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, value ? '1' : '0');
  } catch (err) {
    /* Private mode or blocked storage; collapse simply stops persisting. */
  }
}

/* --------------------------------------------------------------------------
   Boot
   -------------------------------------------------------------------------- */

function initShell() {
  const body = document.body;
  const role = body.getAttribute('data-role') || 'public';
  const route = body.getAttribute('data-route') || 'home';
  const entry = ROUTES[route] || { title: '' };
  const title = body.getAttribute('data-title') || entry.title;

  const sidebar = qs('#sidebar');
  const topbar = qs('#topbar');
  const siteNav = qs('#topnav');
  const footer = qs('#site-footer');
  const overlays = qs('#overlays');

  if (sidebar) {
    sidebar.innerHTML = renderSidebar(role, route);
    const app = qs('.app');
    if (app && readCollapsed()) {
      app.classList.add('is-collapsed');
    }
  }

  if (topbar) {
    topbar.innerHTML = renderTopbar(role, title);
  }

  if (siteNav) {
    siteNav.innerHTML = renderSiteNav(route);
  }

  if (footer) {
    footer.innerHTML = renderFooter();
  }

  if (overlays) {
    overlays.innerHTML = renderScreenIndex(route);
  }

  /* Collapse toggle. */
  on(document, 'click', '[data-collapse]', function (event) {
    event.preventDefault();
    const app = qs('.app');
    if (!app) {
      return;
    }
    const next = !app.classList.contains('is-collapsed');
    app.classList.toggle('is-collapsed', next);
    writeCollapsed(next);
  });

  /* Sidebar accordion — a parent with children expands in place. */
  on(document, 'click', '[data-accordion-nav]', function (event, el) {
    event.preventDefault();
    const group = el.closest('.nav-group');
    if (!group) {
      return;
    }
    const opening = !group.classList.contains('is-open');
    group.classList.toggle('is-open', opening);
    el.setAttribute('aria-expanded', String(opening));
  });

  /* Screen index. */
  on(document, 'click', '[data-index-toggle]', function (event) {
    event.preventDefault();
    const panel = qs('#index-panel');
    if (panel) {
      panel.hidden = !panel.hidden;
    }
  });

  applyBrand();
  brandTitle(title || entry.title);
  initUI();
}

document.addEventListener('DOMContentLoaded', initShell);

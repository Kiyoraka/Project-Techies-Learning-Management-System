/* ==========================================================================
   pages/courses.js — course catalogue filtering
   --------------------------------------------------------------------------
   Shared by two screens:
     courses.html          public catalogue inside the landing shell
     student-catalog.html  Browse Catalog inside the dashboard shell

   Both render the same markup into #catalog-filters and #catalog-grid, so
   this one script serves both. Only Published courses are ever listed.

   Requires data.js, icons.js, ui.js.
   ========================================================================== */

'use strict';

const Catalog = {

  state: {
    categories: [],   /* empty means no category filter */
    level: 'All',
    price: 'All',
    query: ''
  },

  published: function () {
    return COURSES.filter(function (c) { return c.status === 'Published'; });
  },

  results: function () {
    const s = this.state;
    const needle = s.query.toLowerCase();

    return this.published().filter(function (c) {
      const byCategory = !s.categories.length || s.categories.indexOf(c.category) !== -1;
      const byLevel = s.level === 'All' || c.level === s.level;
      const byPrice = s.price === 'All' || (s.price === 'Free') === c.free;
      const byQuery = c.title.toLowerCase().indexOf(needle) !== -1;
      return byCategory && byLevel && byPrice && byQuery;
    });
  },

  /* ------------------------------------------------------------------------
     Filter rail
     ---------------------------------------------------------------------- */

  renderFilters: function () {
    const s = this.state;
    const published = this.published();

    const categories = CATEGORIES.map(function (cat) {
      const count = published.filter(function (c) { return c.category === cat; }).length;
      const checked = s.categories.indexOf(cat) !== -1;
      return '<label class="check filter-row">' +
        '<input type="checkbox" data-cat="' + esc(cat) + '"' + (checked ? ' checked' : '') + '>' +
        '<span class="check-box"></span>' +
        '<span class="filter-label">' + esc(cat) + '</span>' +
        '<span class="filter-count">' + count + '</span>' +
        '</label>';
    }).join('');

    const radios = function (name, options, current) {
      return options.map(function (opt) {
        return '<label class="radio filter-row">' +
          '<input type="radio" name="' + name + '" data-' + name + '="' + esc(opt) + '"' +
          (opt === current ? ' checked' : '') + '>' +
          '<span class="radio-ring"></span>' +
          '<span class="filter-label">' + esc(opt) + '</span>' +
          '</label>';
      }).join('');
    };

    return '<div class="card">' +
        '<div class="card-head"><h3 class="card-title">Filters</h3>' +
          '<button class="card-link" id="catalog-clear">Clear</button></div>' +
        '<div class="filter-group">' +
          '<span class="filter-title">Category</span>' + categories +
        '</div>' +
        '<div class="filter-group">' +
          '<span class="filter-title">Level</span>' + radios('level', LEVELS, s.level) +
        '</div>' +
        '<div class="filter-group">' +
          '<span class="filter-title">Price</span>' + radios('price', PRICES, s.price) +
        '</div>' +
      '</div>';
  },

  /* ------------------------------------------------------------------------
     Results grid
     ---------------------------------------------------------------------- */

  renderGrid: function () {
    const list = this.results();
    const grid = qs('#catalog-grid');
    const count = qs('#catalog-count');

    if (count) {
      count.textContent = list.length + (list.length === 1 ? ' course' : ' courses');
    }

    if (!list.length) {
      grid.className = '';
      grid.innerHTML = emptyState('No courses match those filters', 'Try clearing a filter or searching for something else.', 'book');
      return;
    }

    grid.className = 'course-grid';
    grid.innerHTML = list.map(function (c) {
      return '<article class="course-card">' +
        '<div class="course-thumb" style="background:' + c.thumb + '"></div>' +
        '<div class="course-body">' +
          categoryChip(c.category) +
          '<div class="course-title">' + esc(c.title) + '</div>' +
          '<div class="course-meta">' + avatar(c.instInitials, c.instColor, 22) + esc(c.instructor) + '</div>' +
          '<div class="course-meta">' + c.lessons + ' lessons &middot; ' + c.hours + 'h &middot; ' + esc(c.level) + '</div>' +
          '<div class="course-foot">' +
            '<span class="course-price">' + esc(c.price) + '</span>' +
            '<a class="btn btn-primary btn-sm" href="course-detail.html">Enroll</a>' +
          '</div>' +
        '</div>' +
      '</article>';
    }).join('');
  },

  render: function () {
    qs('#catalog-filters').innerHTML = this.renderFilters();
    this.renderGrid();
  },

  /* ------------------------------------------------------------------------
     Behaviour
     ---------------------------------------------------------------------- */

  bind: function () {
    const self = this;

    on(document, 'change', '[data-cat]', function (event, el) {
      const cat = el.getAttribute('data-cat');
      const at = self.state.categories.indexOf(cat);
      if (at === -1) {
        self.state.categories.push(cat);
      } else {
        self.state.categories.splice(at, 1);
      }
      self.renderGrid();
    });

    on(document, 'change', '[data-level]', function (event, el) {
      self.state.level = el.getAttribute('data-level');
      self.renderGrid();
    });

    on(document, 'change', '[data-price]', function (event, el) {
      self.state.price = el.getAttribute('data-price');
      self.renderGrid();
    });

    on(document, 'input', '#catalog-search', function (event, el) {
      self.state.query = el.value;
      self.renderGrid();
    });

    on(document, 'click', '#catalog-clear', function (event) {
      event.preventDefault();
      self.state = { categories: [], level: 'All', price: 'All', query: '' };
      const search = qs('#catalog-search');
      if (search) {
        search.value = '';
      }
      self.render();
    });
  }
};

document.addEventListener('DOMContentLoaded', function () {
  if (qs('#catalog-grid')) {
    Catalog.render();
    Catalog.bind();
  }
});

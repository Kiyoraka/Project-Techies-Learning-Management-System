/* ==========================================================================
   pages/student-enrolled.js — enrolled courses
   --------------------------------------------------------------------------
   The four enrolled courses split by In progress and Completed. A course is
   complete at 100 percent, which is how the design partitions them.

   Requires data.js, icons.js, ui.js.
   ========================================================================== */

'use strict';

const Enrolled = {

  state: { filter: 'In progress' },

  all: function () {
    return COURSES.filter(function (c) {
      return ENROLLED_COURSE_IDS.indexOf(c.id) !== -1;
    });
  },

  filtered: function () {
    const completed = this.state.filter === 'Completed';
    return this.all().filter(function (c) {
      return completed ? c.progress === 100 : c.progress < 100;
    });
  },

  renderFilter: function () {
    const self = this;
    qs('#enrolled-filter').innerHTML = ENROLLED_FILTERS.map(function (f) {
      const count = self.all().filter(function (c) {
        return f === 'Completed' ? c.progress === 100 : c.progress < 100;
      }).length;
      return '<button class="pill' + (f === self.state.filter ? ' is-active' : '') + '" data-enrolled="' + esc(f) + '">' +
        esc(f) + ' (' + count + ')</button>';
    }).join('');
  },

  renderGrid: function () {
    const list = this.filtered();
    const grid = qs('#enrolled-grid');

    if (!list.length) {
      grid.className = '';
      grid.innerHTML = emptyState('Nothing here yet', 'Browse the catalogue to enrol in your next course.', 'book');
      return;
    }

    grid.className = 'course-grid';
    grid.innerHTML = list.map(function (c) {
      const done = c.progress === 100;
      return '<article class="course-card">' +
        '<div class="course-thumb" style="background:' + c.thumb + '"></div>' +
        '<div class="course-body">' +
          '<div class="row-between">' + categoryChip(c.category) +
            (done ? '<span class="chip chip-published">Completed</span>' : '') + '</div>' +
          '<div class="course-title">' + esc(c.title) + '</div>' +
          '<div class="course-meta">' + avatar(c.instInitials, c.instColor, 22) + esc(c.instructor) + '</div>' +
          '<div style="margin-top:2px">' +
            '<div class="row-between tiny muted" style="margin-bottom:6px">' +
              '<span>' + (done ? 'Finished' : 'In progress') + '</span><span>' + c.progress + '%</span></div>' +
            progressBar(c.progress) +
          '</div>' +
          '<div class="course-foot">' +
            (done
              ? '<a class="btn btn-secondary btn-sm" href="student-certificates.html">Certificate</a>'
              : '<a class="btn btn-primary btn-sm" href="student-player.html">Continue</a>') +
            '<span class="tiny muted">' + c.lessons + ' lessons</span>' +
          '</div>' +
        '</div>' +
      '</article>';
    }).join('');
  },

  bind: function () {
    const self = this;
    on(document, 'click', '[data-enrolled]', function (event, el) {
      event.preventDefault();
      self.state.filter = el.getAttribute('data-enrolled');
      self.renderFilter();
      self.renderGrid();
    });
  }
};

document.addEventListener('DOMContentLoaded', function () {
  if (qs('#enrolled-grid')) {
    Enrolled.renderFilter();
    Enrolled.renderGrid();
    Enrolled.bind();
  }
});

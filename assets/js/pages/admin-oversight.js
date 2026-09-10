/* ==========================================================================
   pages/admin-oversight.js — course oversight
   --------------------------------------------------------------------------
   Every course regardless of status, filtered by lifecycle state. This is
   the one admin table that shows Draft and Pending review entries, which
   the public catalogue deliberately hides.

   Requires data.js, icons.js, ui.js.
   ========================================================================== */

'use strict';

const Oversight = {

  state: { status: 'All' },

  statuses: ['All', 'Published', 'Pending review', 'Draft'],

  filtered: function () {
    const status = this.state.status;
    return COURSES.filter(function (c) {
      return status === 'All' || c.status === status;
    });
  },

  renderFilter: function () {
    const self = this;
    qs('#oversight-filter').innerHTML = this.statuses.map(function (s) {
      const count = s === 'All'
        ? COURSES.length
        : COURSES.filter(function (c) { return c.status === s; }).length;
      return '<button class="pill' + (s === self.state.status ? ' is-active' : '') + '" data-status="' + esc(s) + '">' +
        esc(s) + ' (' + count + ')</button>';
    }).join('');
  },

  renderRows: function () {
    const rows = this.filtered();

    qs('#oversight-rows').innerHTML = rows.length
      ? rows.map(function (c) {
          return '<tr>' +
            '<td><div class="cell-user">' +
              '<span class="course-swatch" style="background:' + c.thumb + '"></span>' +
              '<div><div class="strong">' + esc(c.title) + '</div>' +
              '<div class="cell-sub">' + esc(c.category) + ' &middot; ' + c.lessons + ' lessons</div></div>' +
            '</div></td>' +
            '<td><div class="cell-user">' + avatar(c.instInitials, c.instColor, 28) +
              '<span class="small">' + esc(c.instructor) + '</span></div></td>' +
            '<td>' + statusChip(c.status) + '</td>' +
            '<td class="small">' + formatCount(c.enrolled) + '</td>' +
            '<td class="muted small">' + esc(c.updated) + '</td>' +
            '<td><div class="table-actions">' +
              '<button class="btn btn-secondary btn-sm" data-toast="review">Review</button>' +
            '</div></td>' +
          '</tr>';
        }).join('')
      : '<tr><td colspan="6" style="padding:32px;text-align:center" class="muted">No courses in that state.</td></tr>';

    qs('#oversight-count').textContent = rows.length + (rows.length === 1 ? ' course' : ' courses');
  },

  bind: function () {
    const self = this;
    on(document, 'click', '[data-status]', function (event, el) {
      event.preventDefault();
      self.state.status = el.getAttribute('data-status');
      self.renderFilter();
      self.renderRows();
    });
  }
};

document.addEventListener('DOMContentLoaded', function () {
  if (qs('#oversight-rows')) {
    Oversight.renderFilter();
    Oversight.renderRows();
    Oversight.bind();
  }
});

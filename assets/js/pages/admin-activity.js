/* ==========================================================================
   pages/admin-activity.js — activity log filtering and pagination
   --------------------------------------------------------------------------
   Ten log rows, filtered by role and paged six at a time, matching the
   design's perPage of 6. Changing the filter resets to page one.

   Requires data.js, icons.js, ui.js.
   ========================================================================== */

'use strict';

const ActivityLog = {

  state: { role: 'All', page: 1 },

  filtered: function () {
    const role = this.state.role;
    return ACTIVITY.filter(function (a) {
      return role === 'All' || a.role === role;
    });
  },

  pages: function () {
    return Math.max(1, Math.ceil(this.filtered().length / ACTIVITY_PER_PAGE));
  },

  render: function () {
    const rows = this.filtered();
    const pages = this.pages();
    const page = Math.min(this.state.page, pages);
    const from = (page - 1) * ACTIVITY_PER_PAGE;
    const slice = rows.slice(from, from + ACTIVITY_PER_PAGE);

    qs('#activity-rows').innerHTML = slice.length
      ? slice.map(function (a) {
          return '<tr>' +
            '<td class="muted">' + esc(a.time) + '</td>' +
            '<td class="strong">' + esc(a.user) + '</td>' +
            '<td>' + roleChip(a.role) + '</td>' +
            '<td>' + esc(a.action) + '</td>' +
            '<td class="muted">' + esc(a.target) + '</td>' +
            '<td class="muted">' + esc(a.ip) + '</td>' +
          '</tr>';
        }).join('')
      : '<tr><td colspan="6" style="padding:32px;text-align:center" class="muted">No activity for that role.</td></tr>';

    qs('#activity-range').textContent = rows.length
      ? 'Showing ' + (from + 1) + ' to ' + Math.min(from + ACTIVITY_PER_PAGE, rows.length) + ' of ' + rows.length
      : 'No entries';

    qs('#activity-page').textContent = 'Page ' + page + ' of ' + pages;
    qs('#activity-prev').disabled = page <= 1;
    qs('#activity-next').disabled = page >= pages;
  },

  bind: function () {
    const self = this;

    on(document, 'change', '#activity-role', function (event, el) {
      self.state.role = el.value;
      self.state.page = 1;
      self.render();
    });

    on(document, 'click', '#activity-prev', function (event) {
      event.preventDefault();
      self.state.page = Math.max(1, self.state.page - 1);
      self.render();
    });

    on(document, 'click', '#activity-next', function (event) {
      event.preventDefault();
      self.state.page = Math.min(self.pages(), self.state.page + 1);
      self.render();
    });
  }
};

document.addEventListener('DOMContentLoaded', function () {
  if (qs('#activity-rows')) {
    ActivityLog.render();
    ActivityLog.bind();
  }
});

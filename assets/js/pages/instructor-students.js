/* ==========================================================================
   pages/instructor-students.js — student management
   --------------------------------------------------------------------------
   Enrolled students filtered by course, with progress, last-active and quiz
   average. Message and View both fire toasts, matching the design.

   Requires data.js, icons.js, ui.js.
   ========================================================================== */

'use strict';

const StudentAdmin = {

  state: { course: 'All' },

  courses: function () {
    const seen = ['All'];
    ENROLLED_STUDENTS.forEach(function (s) {
      if (seen.indexOf(s.course) === -1) {
        seen.push(s.course);
      }
    });
    return seen;
  },

  filtered: function () {
    const course = this.state.course;
    return ENROLLED_STUDENTS.filter(function (s) {
      return course === 'All' || s.course === course;
    });
  },

  renderFilter: function () {
    const self = this;
    qs('#student-course').innerHTML = this.courses().map(function (c) {
      return '<option' + (c === self.state.course ? ' selected' : '') + '>' + esc(c) + '</option>';
    }).join('');
  },

  renderRows: function () {
    const rows = this.filtered();

    qs('#student-rows').innerHTML = rows.length
      ? rows.map(function (s) {
          return '<tr>' +
            '<td><div class="cell-user">' + avatar(s.initials, s.color, 32) +
              '<span class="strong">' + esc(s.name) + '</span></div></td>' +
            '<td class="small">' + esc(s.course) + '</td>' +
            '<td style="min-width:170px">' +
              '<div class="row-between tiny muted" style="margin-bottom:6px">' +
                '<span>Progress</span><span>' + s.progress + '%</span></div>' +
              progressBar(s.progress) +
            '</td>' +
            '<td class="muted small">' + esc(s.last) + '</td>' +
            '<td><span class="chip ' + (s.avg >= 80 ? 'chip-published' : 'chip-warning') + '">' + s.avg + '%</span></td>' +
            '<td><div class="table-actions">' +
              '<button class="icon-btn" title="Message" data-toast="message">' + icon('comment', 16) + '</button>' +
              '<button class="icon-btn" title="View profile" data-toast="review">' + icon('eye', 16) + '</button>' +
            '</div></td>' +
          '</tr>';
        }).join('')
      : '<tr><td colspan="6" style="padding:32px;text-align:center" class="muted">No students enrolled in that course.</td></tr>';

    qs('#student-count').textContent = rows.length + (rows.length === 1 ? ' student' : ' students');
  },

  bind: function () {
    const self = this;
    on(document, 'change', '#student-course', function (event, el) {
      self.state.course = el.value;
      self.renderRows();
    });
  }
};

document.addEventListener('DOMContentLoaded', function () {
  if (qs('#student-rows')) {
    StudentAdmin.renderFilter();
    StudentAdmin.renderRows();
    StudentAdmin.bind();
  }
});

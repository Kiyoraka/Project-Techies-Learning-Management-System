/* ==========================================================================
   pages/course-detail.js — the public course page
   --------------------------------------------------------------------------
   Renders the banner, learning outcomes, curriculum accordion and the sticky
   enrol card for COURSES[0], which is the course the design shows.

   Lessons past the first module carry a lock icon: the design gates preview
   content behind enrolment.

   Requires data.js, icons.js, ui.js.
   ========================================================================== */

'use strict';

const LEARNING_OUTCOMES = [
  'Write clean Python scripts with variables, loops and functions',
  'Read and write Excel and CSV files automatically',
  'Call web APIs and handle JSON responses',
  'Debug errors confidently and read documentation'
];

const COURSE_INCLUDES = [
  { icon: 'video', text: '18 hours of on-demand video' },
  { icon: 'quiz',  text: '8 quizzes and 1 graded project' },
  { icon: 'file',  text: '12 downloadable resources' },
  { icon: 'grad',  text: 'Certificate of completion' },
  { icon: 'clock', text: 'Lifetime access' }
];

const CourseDetail = {

  course: null,

  init: function () {
    this.course = COURSES[0];
    this.renderHead();
    this.renderLearn();
    this.renderCurriculum();
    this.renderBuy();
  },

  renderHead: function () {
    const c = this.course;
    qs('#detail-head').innerHTML =
      '<h1 class="detail-title">' + esc(c.title) + '</h1>' +
      '<p class="detail-sub">' + esc(c.subtitle) + '</p>' +
      '<div class="detail-meta">' +
        '<span class="row" style="gap:8px">' + avatar(c.instInitials, c.instColor, 32) +
          '<span class="strong">' + esc(c.instructor) + '</span></span>' +
        '<span><span class="stars">' + stars(c.rating) + '</span> ' + c.rating.toFixed(1) + ' rating</span>' +
        '<span>' + formatCount(c.enrolled) + ' enrolled</span>' +
        '<span>' + esc(c.level) + '</span>' +
        '<span>Updated ' + esc(c.updated) + '</span>' +
      '</div>';
  },

  renderLearn: function () {
    qs('#detail-learn').innerHTML = LEARNING_OUTCOMES.map(function (item) {
      return '<div class="learn-item">' +
        icon('check', 16, { stroke: 'var(--primary)' }) +
        '<span>' + esc(item) + '</span>' +
        '</div>';
    }).join('');
  },

  renderCurriculum: function () {
    const c = this.course;
    const totalLessons = CURRICULUM.reduce(function (sum, m) { return sum + m.lessons.length; }, 0);

    qs('#detail-curriculum-meta').textContent =
      CURRICULUM.length + ' modules · ' + totalLessons + ' lessons · ' + c.hours + ' hours';

    qs('#detail-curriculum').innerHTML = CURRICULUM.map(function (m) {
      const open = DETAIL_OPEN_MODULES.indexOf(m.id) !== -1;
      const minutes = m.lessons.reduce(function (sum, l) { return sum + l.mins; }, 0);

      const rows = m.lessons.map(function (l) {
        /* Module 1 is the free preview; everything later is locked. */
        const locked = m.id !== 1;
        return '<div class="lesson-row">' +
          icon(LESSON_TYPE_ICON[l.type], 16, { stroke: 'var(--text-muted)' }) +
          '<span class="lesson-title">' + esc(l.title) + '</span>' +
          '<span class="lesson-mins">' + l.mins + ' min</span>' +
          (locked
            ? icon('lock', 14, { stroke: 'var(--text-muted)' })
            : '<span class="chip chip-category">Preview</span>') +
          '</div>';
      }).join('');

      return '<div class="accordion-item' + (open ? ' is-open' : '') + '">' +
        '<button class="accordion-head" data-accordion aria-expanded="' + open + '">' +
          '<span>Module ' + m.id + ' &middot; ' + esc(m.title) + '</span>' +
          '<span class="row">' +
            '<span class="tiny muted">' + m.lessons.length + ' lessons &middot; ' + minutes + ' min</span>' +
            '<span class="accordion-chevron">' + icon('chevronDown', 16) + '</span>' +
          '</span>' +
        '</button>' +
        '<div class="accordion-body">' + rows + '</div>' +
        '</div>';
    }).join('');
  },

  renderBuy: function () {
    const c = this.course;
    qs('#detail-buy').innerHTML =
      '<div class="detail-thumb" style="background:' + c.thumb + '"></div>' +
      '<div class="detail-price">' + esc(c.price) + '</div>' +
      '<button class="btn btn-primary btn-block" style="margin-top:14px" data-toast="enroll">Enroll now</button>' +
      '<p class="tiny muted" style="text-align:center;margin-top:10px">7-day money-back guarantee</p>' +
      '<div class="divider"></div>' +
      '<div class="strong small" style="margin-bottom:12px">This course includes</div>' +
      '<div class="stack-sm">' + COURSE_INCLUDES.map(function (item) {
        return '<div class="row" style="gap:10px">' +
          icon(item.icon, 16, { stroke: 'var(--text-muted)' }) +
          '<span class="small">' + esc(item.text) + '</span>' +
          '</div>';
      }).join('') + '</div>';
  }
};

document.addEventListener('DOMContentLoaded', function () {
  if (qs('#detail-head')) {
    CourseDetail.init();
  }
});

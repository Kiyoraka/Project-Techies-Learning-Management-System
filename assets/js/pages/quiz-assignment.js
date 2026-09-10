/* ==========================================================================
   pages/quiz-assignment.js — quiz builder and assignment list
   --------------------------------------------------------------------------
   Two tabs sharing one screen. The sidebar links Quiz and Assignment to the
   same file with a hash, so the hash decides which tab opens.

   Requires data.js, icons.js, ui.js.
   ========================================================================== */

'use strict';

const QuizBuilder = {

  questions: [],

  init: function () {
    this.questions = QUIZ_BUILDER_QUESTIONS.map(function (q) {
      return Object.assign({}, q);
    });

    /* The sidebar reaches this page as #quiz or #assignment. */
    const wanted = (window.location.hash || '').replace('#', '') === 'assignment'
      ? 'Assignment'
      : 'Quiz';
    this.selectTab(wanted);

    this.renderQuestions();
    this.renderAssignments();
    this.bind();
  },

  selectTab: function (label) {
    qsa('[data-tab]').forEach(function (tab) {
      const on = tab.getAttribute('data-tab') === label;
      tab.classList.toggle('is-active', on);
    });
    qsa('[data-tab-panel]').forEach(function (panel) {
      panel.hidden = panel.getAttribute('data-tab-panel') !== 'qa:' + label;
    });
  },

  totalPoints: function () {
    return this.questions.reduce(function (sum, q) { return sum + q.pts; }, 0);
  },

  renderQuestions: function () {
    const self = this;

    qs('#quiz-questions').innerHTML = this.questions.length
      ? this.questions.map(function (q, i) {
          return '<div class="card question">' +
            '<div class="row-between" style="align-items:flex-start">' +
              '<div class="row" style="gap:12px;align-items:flex-start">' +
                '<span class="question-n">' + (i + 1) + '</span>' +
                '<div>' +
                  '<div class="strong">' + esc(q.text) + '</div>' +
                  '<div class="row" style="gap:8px;margin-top:8px">' +
                    '<span class="chip chip-category">' + esc(q.type) + '</span>' +
                    '<span class="tiny muted">' + q.pts + ' point' + (q.pts === 1 ? '' : 's') + '</span>' +
                  '</div>' +
                '</div>' +
              '</div>' +
              '<div class="table-actions">' +
                '<button class="icon-btn" title="Edit" data-toast="save">' + icon('edit', 16) + '</button>' +
                '<button class="icon-btn" title="Remove" data-remove-q="' + i + '">' + icon('trash', 16) + '</button>' +
              '</div>' +
            '</div>' +
          '</div>';
        }).join('')
      : emptyState('No questions yet', 'Add a multiple choice, true or false, or short answer question.', 'quiz');

    qs('#quiz-total').textContent = this.questions.length + ' questions · ' + this.totalPoints() + ' points';
  },

  renderAssignments: function () {
    qs('#assignment-rows').innerHTML = ASSIGNMENTS.map(function (a) {
      const pct = a.total ? Math.round(a.subs / a.total * 100) : 0;
      return '<tr>' +
        '<td><div class="strong">' + esc(a.title) + '</div>' +
          '<div class="cell-sub">' + esc(a.course) + '</div></td>' +
        '<td class="small">' + esc(a.due) + '</td>' +
        '<td style="min-width:160px">' +
          '<div class="row-between tiny muted" style="margin-bottom:6px">' +
            '<span>' + a.subs + ' of ' + a.total + '</span><span>' + pct + '%</span></div>' +
          progressBar(pct) +
        '</td>' +
        '<td><div class="table-actions">' +
          '<button class="btn btn-secondary btn-sm" data-toast="grade">Open grading</button>' +
        '</div></td>' +
      '</tr>';
    }).join('');
  },

  bind: function () {
    const self = this;

    on(document, 'click', '[data-tab]', function (event, el) {
      /* Keep the hash in step so a refresh reopens the same tab. */
      const label = el.getAttribute('data-tab');
      window.location.hash = label.toLowerCase();
    });

    on(document, 'click', '[data-add-q]', function (event, el) {
      event.preventDefault();
      self.questions.push({
        type: el.getAttribute('data-add-q'),
        text: 'New question — click to edit',
        pts: 1
      });
      self.renderQuestions();
    });

    on(document, 'click', '[data-remove-q]', function (event, el) {
      event.preventDefault();
      self.questions.splice(Number(el.getAttribute('data-remove-q')), 1);
      self.renderQuestions();
    });
  }
};

document.addEventListener('DOMContentLoaded', function () {
  if (qs('#quiz-questions')) {
    QuizBuilder.init();
  }
});

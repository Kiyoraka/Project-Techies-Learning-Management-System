/* ==========================================================================
   pages/student-quiz.js — quiz attempt and results
   --------------------------------------------------------------------------
   One question per screen with progress dots and a timer chip. Submitting
   scores the attempt and hands the result to the results screen through
   sessionStorage, so student-quiz-result.html can render a real outcome
   rather than a fixed one.

   The results page also renders standalone with a designed default, so it
   can be opened directly from the screen index.

   Requires data.js, icons.js, ui.js.
   ========================================================================== */

'use strict';

const QUIZ_RESULT_KEY = 'tlms.quiz.result';

const QuizAttempt = {

  at: 0,
  answers: {},
  secondsLeft: 20 * 60,
  timer: null,

  init: function () {
    this.render();
    this.bind();
    this.startTimer();
  },

  question: function () {
    return QUIZ_BANK[this.at];
  },

  startTimer: function () {
    const self = this;
    this.timer = setInterval(function () {
      self.secondsLeft = Math.max(0, self.secondsLeft - 1);
      const chip = qs('#quiz-timer');
      if (chip) {
        chip.textContent = self.clock() + ' left';
      }
      if (self.secondsLeft === 0) {
        clearInterval(self.timer);
        self.submit();
      }
    }, 1000);
  },

  clock: function () {
    const m = Math.floor(this.secondsLeft / 60);
    const s = this.secondsLeft % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  },

  render: function () {
    const q = this.question();
    const self = this;
    const chosen = this.answers[q.id];

    qs('#quiz-progress').innerHTML =
      '<div class="row-between" style="margin-bottom:12px">' +
        '<span class="tiny muted">Question ' + (this.at + 1) + ' of ' + QUIZ_BANK.length + '</span>' +
        '<span class="chip chip-warning" id="quiz-timer">' + this.clock() + ' left</span>' +
      '</div>' +
      '<div class="dots">' + QUIZ_BANK.map(function (item, i) {
        const done = self.answers[item.id] !== undefined;
        const cls = i === self.at ? ' is-current' : (done ? ' is-done' : '');
        return '<span class="dot' + cls + '"></span>';
      }).join('') + '</div>';

    let body;
    if (q.short) {
      body = '<input class="input" id="quiz-short" placeholder="Type your answer" value="' +
        esc(chosen || '') + '">';
    } else {
      body = q.options.map(function (opt) {
        const on = chosen === opt;
        return '<button class="quiz-choice' + (on ? ' is-chosen' : '') + '" data-answer="' + esc(opt) + '">' +
          '<span class="radio-ring"' + (on ? ' style="border-color:var(--primary)"' : '') + '>' +
          (on ? '<span class="radio-dot"></span>' : '') + '</span>' +
          '<span>' + esc(opt) + '</span>' +
          '</button>';
      }).join('');
    }

    qs('#quiz-question').innerHTML =
      '<h1 class="quiz-text">' + esc(q.text) + '</h1>' +
      '<div class="quiz-choices">' + body + '</div>';

    const last = this.at === QUIZ_BANK.length - 1;
    qs('#quiz-actions').innerHTML =
      '<button class="btn btn-secondary" id="quiz-prev"' + (this.at === 0 ? ' disabled' : '') + '>Previous</button>' +
      '<button class="btn btn-primary" id="' + (last ? 'quiz-submit' : 'quiz-next') + '">' +
        (last ? 'Submit quiz' : 'Next') + '</button>';
  },

  score: function () {
    const self = this;
    return QUIZ_BANK.map(function (q) {
      const given = (self.answers[q.id] || '').toString().trim();
      const ok = given.toLowerCase() === q.answer.toLowerCase();
      return { id: q.id, text: q.text, answer: q.answer, given: given, ok: ok };
    });
  },

  submit: function () {
    clearInterval(this.timer);
    const review = this.score();
    const correct = review.filter(function (r) { return r.ok; }).length;

    const result = {
      score: correct,
      total: QUIZ_BANK.length,
      pct: Math.round(correct / QUIZ_BANK.length * 100),
      passed: correct / QUIZ_BANK.length >= QUIZ_PASS_RATIO,
      review: review
    };

    try {
      window.sessionStorage.setItem(QUIZ_RESULT_KEY, JSON.stringify(result));
    } catch (err) {
      /* Storage blocked; the results page falls back to its default. */
    }
    window.location.href = 'student-quiz-result.html';
  },

  bind: function () {
    const self = this;

    on(document, 'click', '[data-answer]', function (event, el) {
      event.preventDefault();
      self.answers[self.question().id] = el.getAttribute('data-answer');
      self.render();
    });

    on(document, 'input', '#quiz-short', function (event, el) {
      self.answers[self.question().id] = el.value;
    });

    on(document, 'click', '#quiz-next', function (event) {
      event.preventDefault();
      self.at = Math.min(QUIZ_BANK.length - 1, self.at + 1);
      self.render();
    });

    on(document, 'click', '#quiz-prev', function (event) {
      event.preventDefault();
      self.at = Math.max(0, self.at - 1);
      self.render();
    });

    on(document, 'click', '#quiz-submit', function (event) {
      event.preventDefault();
      self.submit();
    });
  }
};

/* ------------------------------------------------------------------------
   Results screen
   ---------------------------------------------------------------------- */

const QuizResult = {

  /* Shown when the page is opened directly rather than after an attempt. */
  fallback: function () {
    const review = QUIZ_BANK.map(function (q, i) {
      const ok = i !== 3;
      return { id: q.id, text: q.text, answer: q.answer, given: ok ? q.answer : 'True', ok: ok };
    });
    const correct = review.filter(function (r) { return r.ok; }).length;
    return {
      score: correct,
      total: QUIZ_BANK.length,
      pct: Math.round(correct / QUIZ_BANK.length * 100),
      passed: correct / QUIZ_BANK.length >= QUIZ_PASS_RATIO,
      review: review
    };
  },

  read: function () {
    try {
      const raw = window.sessionStorage.getItem(QUIZ_RESULT_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (err) {
      /* fall through */
    }
    return this.fallback();
  },

  render: function () {
    const r = this.read();

    qs('#result-summary').innerHTML =
      '<div class="ring-wrap">' +
        progressRing(r.pct, 'result', r.passed ? 'var(--primary)' : 'var(--warning)') +
        '<span class="ring-value ring-value-lg">' + r.pct + '%</span>' +
      '</div>' +
      '<div>' +
        '<span class="chip ' + (r.passed ? 'chip-published' : 'chip-warning') + '">' +
          (r.passed ? 'Passed' : 'Not passed yet') + '</span>' +
        '<h1 class="page-title" style="margin-top:10px">' + r.score + ' of ' + r.total + ' correct</h1>' +
        '<p class="page-sub">' + (r.passed
          ? 'You cleared the 60 percent pass mark. Your certificate progress has been updated.'
          : 'The pass mark is 60 percent. Review the answers below and try again.') + '</p>' +
        '<div class="row" style="margin-top:16px">' +
          '<a class="btn btn-primary" href="student-player.html">Back to course</a>' +
          '<a class="btn btn-secondary" href="student-quiz.html">Retake quiz</a>' +
        '</div>' +
      '</div>';

    qs('#result-review').innerHTML = r.review.map(function (item, i) {
      return '<div class="card review-item">' +
        '<div class="row" style="gap:12px;align-items:flex-start">' +
          '<span class="review-mark ' + (item.ok ? 'is-ok' : 'is-bad') + '">' +
            icon(item.ok ? 'check' : 'close', 14, { stroke: '#fff', width: 3 }) + '</span>' +
          '<div style="flex:1;min-width:0">' +
            '<div class="tiny muted">Question ' + (i + 1) + '</div>' +
            '<div class="strong" style="margin-top:2px">' + esc(item.text) + '</div>' +
            '<div class="small" style="margin-top:8px">' +
              '<span class="muted">Your answer:</span> ' +
              '<span class="strong">' + esc(item.given || 'No answer') + '</span>' +
            '</div>' +
            (item.ok ? '' :
              '<div class="small" style="margin-top:4px">' +
                '<span class="muted">Correct answer:</span> ' +
                '<span class="strong" style="color:var(--primary-hover)">' + esc(item.answer) + '</span>' +
              '</div>') +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }
};

document.addEventListener('DOMContentLoaded', function () {
  if (qs('#quiz-question')) {
    QuizAttempt.init();
  }
  if (qs('#result-summary')) {
    QuizResult.render();
  }
});

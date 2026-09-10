/* ==========================================================================
   pages/student-player.js — the lesson player
   --------------------------------------------------------------------------
   Video area with a tab row, and a right rail carrying the curriculum tree.
   Completed lessons tick green, the current lesson takes the mint fill, and
   Mark complete advances the count. Previous and Next walk the flattened
   lesson list across module boundaries.

   Requires data.js, icons.js, ui.js.
   ========================================================================== */

'use strict';

const Player = {

  completed: [],
  currentId: CURRENT_LESSON_ID,

  flat: function () {
    return CURRICULUM.reduce(function (all, m) {
      return all.concat(m.lessons.map(function (l) {
        return Object.assign({ module: m }, l);
      }));
    }, []);
  },

  index: function () {
    const id = this.currentId;
    const list = this.flat();
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === id) {
        return i;
      }
    }
    return 0;
  },

  current: function () {
    return this.flat()[this.index()];
  },

  init: function () {
    this.completed = COMPLETED_LESSONS.slice();
    this.render();
    this.bind();
  },

  render: function () {
    const list = this.flat();
    const at = this.index();
    const lesson = list[at];
    const pct = Math.round(this.completed.length / list.length * 100);
    const isDone = this.completed.indexOf(lesson.id) !== -1;

    /* --- Video area and heading --- */
    qs('#player-video').innerHTML =
      '<span class="play-badge">' + icon('play', 26, { fill: 'var(--on-dark)', stroke: 'none' }) + '</span>' +
      '<span class="video-quality">1080p</span>';

    qs('#player-heading').innerHTML =
      '<div class="tiny muted">Lesson ' + (at + 1) + ' of ' + list.length + ' &middot; ' + esc(lesson.module.title) + '</div>' +
      '<h1 class="page-title" style="margin-top:4px">' + esc(lesson.title) + '</h1>';

    /* --- Actions --- */
    qs('#player-actions').innerHTML =
      '<button class="btn btn-secondary" id="player-prev"' + (at === 0 ? ' disabled' : '') + '>Previous</button>' +
      '<button class="btn ' + (isDone ? 'btn-secondary' : 'btn-primary') + '" id="player-complete">' +
        (isDone ? 'Completed' : 'Mark complete') + '</button>' +
      '<button class="btn btn-primary" id="player-next"' + (at === list.length - 1 ? ' disabled' : '') + '>Next lesson</button>';

    /* --- Curriculum rail --- */
    const self = this;
    qs('#player-rail').innerHTML =
      '<div class="card">' +
        '<div class="card-head">' +
          '<h3 class="card-title">Course content</h3>' +
          '<span class="tiny muted">' + pct + '%</span>' +
        '</div>' +
        progressBar(pct) +
        '<div class="tiny muted" style="margin-top:8px">' + this.completed.length + ' of ' + list.length + ' lessons complete</div>' +
      '</div>' +
      CURRICULUM.map(function (m) {
        const done = m.lessons.filter(function (l) {
          return self.completed.indexOf(l.id) !== -1;
        }).length;
        const holdsCurrent = m.lessons.some(function (l) { return l.id === self.currentId; });

        const rows = m.lessons.map(function (l) {
          const isComplete = self.completed.indexOf(l.id) !== -1;
          const isCurrent = l.id === self.currentId;
          return '<button class="lesson-row' + (isCurrent ? ' is-current' : '') +
            (isComplete ? ' is-done' : '') + '" data-goto="' + esc(l.id) + '" style="width:100%;text-align:left">' +
            (isComplete
              ? icon('check', 16, { stroke: 'var(--primary)' })
              : icon(LESSON_TYPE_ICON[l.type], 16, { stroke: 'var(--text-muted)' })) +
            '<span class="lesson-title">' + esc(l.title) + '</span>' +
            '<span class="lesson-mins">' + l.mins + ' min</span>' +
            '</button>';
        }).join('');

        return '<div class="accordion-item' + (holdsCurrent ? ' is-open' : '') + '" style="margin-top:12px">' +
          '<button class="accordion-head" data-accordion aria-expanded="' + holdsCurrent + '">' +
            '<span>Module ' + m.id + ' &middot; ' + esc(m.title) + '</span>' +
            '<span class="row"><span class="tiny muted">' + done + '/' + m.lessons.length + '</span>' +
            '<span class="accordion-chevron">' + icon('chevronDown', 16) + '</span></span>' +
          '</button>' +
          '<div class="accordion-body">' + rows + '</div>' +
          '</div>';
      }).join('');
  },

  bind: function () {
    const self = this;

    on(document, 'click', '[data-goto]', function (event, el) {
      event.preventDefault();
      self.currentId = el.getAttribute('data-goto');
      self.render();
    });

    on(document, 'click', '#player-prev', function (event) {
      event.preventDefault();
      const at = self.index();
      if (at > 0) {
        self.currentId = self.flat()[at - 1].id;
        self.render();
      }
    });

    on(document, 'click', '#player-next', function (event) {
      event.preventDefault();
      const list = self.flat();
      const at = self.index();
      if (at < list.length - 1) {
        self.currentId = list[at + 1].id;
        self.render();
      }
    });

    on(document, 'click', '#player-complete', function (event) {
      event.preventDefault();
      const id = self.currentId;
      if (self.completed.indexOf(id) === -1) {
        self.completed.push(id);
        self.render();
        toast('Lesson marked complete');
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', function () {
  if (qs('#player-rail')) {
    Player.init();
  }
});

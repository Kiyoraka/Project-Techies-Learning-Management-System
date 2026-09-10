/* ==========================================================================
   pages/create-course.js — the course builder
   --------------------------------------------------------------------------
   Four-step stepper over Basics, Curriculum, Pricing and Publish. The
   curriculum step carries the module accordion, add-lesson action and the
   lesson editor drawer with its Bunny.net upload progress.

   Lessons are held in a local copy of CURRICULUM so adding one persists for
   the visit without touching the shared dataset.

   Requires data.js, icons.js, ui.js.
   ========================================================================== */

'use strict';

const CourseBuilder = {

  step: 'Basics',
  modules: [],
  openModules: [],

  init: function () {
    /* Deep-ish copy: new module objects, new lesson arrays. */
    this.modules = CURRICULUM.map(function (m) {
      return { id: m.id, title: m.title, lessons: m.lessons.slice() };
    });
    this.openModules = BUILDER_OPEN_MODULES.slice();

    this.renderStepper();
    this.renderModules();
    this.showStep();
    this.bind();
  },

  /* ------------------------------------------------------------------------
     Stepper
     ---------------------------------------------------------------------- */

  renderStepper: function () {
    const current = CREATE_STEPS.indexOf(this.step);
    qs('#builder-steps').innerHTML = CREATE_STEPS.map(function (label, i) {
      const state = i < current ? ' is-done' : (i === current ? ' is-active' : '');
      return '<button class="step' + state + '" data-step="' + esc(label) + '">' +
        '<span class="step-n">' + (i + 1) + '</span>' + esc(label) + '</button>';
    }).join('');

    /* The final step submits for review rather than continuing. */
    const last = current === CREATE_STEPS.length - 1;
    const next = qs('#builder-next');
    next.textContent = last ? 'Submit for review' : 'Continue';
    next.setAttribute('data-toast', last ? 'publish' : '');
    qs('#builder-back').disabled = current === 0;
  },

  showStep: function () {
    const step = this.step;
    qsa('[data-step-panel]').forEach(function (panel) {
      panel.hidden = panel.getAttribute('data-step-panel') !== step;
    });
  },

  goTo: function (label) {
    this.step = label;
    this.renderStepper();
    this.showStep();
    window.scrollTo(0, 0);
  },

  /* ------------------------------------------------------------------------
     Curriculum
     ---------------------------------------------------------------------- */

  renderModules: function () {
    const self = this;

    qs('#builder-modules').innerHTML = this.modules.map(function (m) {
      const open = self.openModules.indexOf(m.id) !== -1;

      const rows = m.lessons.map(function (l) {
        return '<div class="lesson-row builder-lesson">' +
          '<span class="drag" title="Drag to reorder">' + icon('drag', 16, { stroke: 'var(--text-muted)' }) + '</span>' +
          icon(LESSON_TYPE_ICON[l.type], 16, { stroke: 'var(--text-muted)' }) +
          '<span class="lesson-title">' + esc(l.title) + '</span>' +
          '<span class="chip chip-draft">' + esc(l.type) + '</span>' +
          '<span class="lesson-mins">' + l.mins + ' min</span>' +
          '<button class="icon-btn" title="Edit lesson" data-lesson="' + esc(l.id) + '">' + icon('edit', 16) + '</button>' +
          '</div>';
      }).join('');

      return '<div class="accordion-item' + (open ? ' is-open' : '') + '" data-module="' + m.id + '">' +
        '<button class="accordion-head" data-accordion aria-expanded="' + open + '">' +
          '<span>Module ' + m.id + ' &middot; ' + esc(m.title) + '</span>' +
          '<span class="row">' +
            '<span class="tiny muted">' + m.lessons.length + ' lessons</span>' +
            '<span class="accordion-chevron">' + icon('chevronDown', 16) + '</span>' +
          '</span>' +
        '</button>' +
        '<div class="accordion-body">' + rows +
          '<div class="builder-add">' +
            '<button class="btn btn-ghost btn-sm" data-add-lesson="' + m.id + '">' +
              icon('plus', 16) + 'Add Lesson</button>' +
          '</div>' +
        '</div>' +
        '</div>';
    }).join('');
  },

  addLesson: function (moduleId) {
    const module = this.modules.filter(function (m) {
      return String(m.id) === String(moduleId);
    })[0];
    if (!module) {
      return;
    }
    module.lessons.push({
      id: 'new-' + Date.now(),
      title: 'New lesson — click to edit',
      type: 'Video',
      mins: 0
    });
    if (this.openModules.indexOf(module.id) === -1) {
      this.openModules.push(module.id);
    }
    this.renderModules();
  },

  /* ------------------------------------------------------------------------
     Lesson drawer
     ---------------------------------------------------------------------- */

  openLesson: function (lessonId) {
    let found = null;
    this.modules.forEach(function (m) {
      m.lessons.forEach(function (l) {
        if (l.id === lessonId) {
          found = l;
        }
      });
    });
    if (!found) {
      return;
    }

    qs('#drawer-title').textContent = 'Edit lesson';
    qs('#lesson-name').value = found.title;
    qs('#lesson-type').value = found.type;
    qs('#lesson-mins').value = found.mins;
    openPanel('lesson-drawer');
  },

  bind: function () {
    const self = this;

    on(document, 'click', '[data-step]', function (event, el) {
      event.preventDefault();
      self.goTo(el.getAttribute('data-step'));
    });

    on(document, 'click', '#builder-next', function (event) {
      event.preventDefault();
      const at = CREATE_STEPS.indexOf(self.step);
      if (at < CREATE_STEPS.length - 1) {
        self.goTo(CREATE_STEPS[at + 1]);
      }
    });

    on(document, 'click', '#builder-back', function (event) {
      event.preventDefault();
      const at = CREATE_STEPS.indexOf(self.step);
      if (at > 0) {
        self.goTo(CREATE_STEPS[at - 1]);
      }
    });

    on(document, 'click', '[data-add-lesson]', function (event, el) {
      event.preventDefault();
      self.addLesson(el.getAttribute('data-add-lesson'));
    });

    on(document, 'click', '[data-lesson]', function (event, el) {
      event.preventDefault();
      self.openLesson(el.getAttribute('data-lesson'));
    });

    /* Track which modules the reader has left open, so a re-render keeps them. */
    on(document, 'click', '#builder-modules [data-accordion]', function (event, el) {
      const item = el.closest('[data-module]');
      if (!item) {
        return;
      }
      const id = Number(item.getAttribute('data-module'));
      const at = self.openModules.indexOf(id);
      /* initAccordions has already flipped the class by this point. */
      if (item.classList.contains('is-open')) {
        if (at === -1) {
          self.openModules.push(id);
        }
      } else if (at !== -1) {
        self.openModules.splice(at, 1);
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', function () {
  if (qs('#builder-steps')) {
    CourseBuilder.init();
  }
});

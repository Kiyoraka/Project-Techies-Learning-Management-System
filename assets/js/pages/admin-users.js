/* ==========================================================================
   pages/admin-users.js — user management
   --------------------------------------------------------------------------
   Four tabs with live counts, search across name and email, per-row status
   toggle, and the row actions the design specifies: edit opens the side
   panel, reset password and deactivate both fire toasts.

   The user list is mutated in memory so toggling and deactivating persist
   for the visit, matching the prototype's behaviour.

   Requires data.js, icons.js, ui.js.
   ========================================================================== */

'use strict';

const UserAdmin = {

  users: [],
  state: { tab: 'All', query: '' },

  init: function () {
    /* Work on a copy so the shared dataset is never mutated. */
    this.users = USERS.map(function (u) { return Object.assign({}, u); });
    this.renderTabs();
    this.renderRows();
    this.bind();
  },

  matching: function () {
    const s = this.state;
    const needle = s.query.toLowerCase();
    return this.users.filter(function (u) {
      const byTab = s.tab === 'All' || (u.role + 's') === s.tab;
      const byQuery = (u.name + u.email).toLowerCase().indexOf(needle) !== -1;
      return byTab && byQuery;
    });
  },

  renderTabs: function () {
    const self = this;
    qs('#user-tabs').innerHTML = USER_TABS.map(function (tab) {
      const count = tab === 'All'
        ? self.users.length
        : self.users.filter(function (u) { return (u.role + 's') === tab; }).length;
      return '<button class="tab' + (tab === self.state.tab ? ' is-active' : '') + '" data-user-tab="' + esc(tab) + '">' +
        esc(tab) + ' <span class="tab-count">' + count + '</span></button>';
    }).join('');
  },

  renderRows: function () {
    const rows = this.matching();
    const body = qs('#user-rows');

    if (!rows.length) {
      body.innerHTML = '<tr><td colspan="6" style="padding:32px;text-align:center" class="muted">No users match that search.</td></tr>';
      return;
    }

    body.innerHTML = rows.map(function (u) {
      return '<tr>' +
        '<td><div class="cell-user">' + avatar(initialsOf(u.name), u.color, 32) +
          '<div><div class="strong">' + esc(u.name) + '</div>' +
          '<div class="cell-sub">' + esc(u.email) + '</div></div></div></td>' +
        '<td>' + roleChip(u.role) + '</td>' +
        '<td><div class="row" style="gap:10px">' +
          '<button class="toggle" data-user-toggle="' + u.id + '" role="switch" aria-checked="' + u.on + '"></button>' +
          '<span class="small muted">' + (u.on ? 'Active' : 'Inactive') + '</span>' +
        '</div></td>' +
        '<td class="muted small">' + esc(u.joined) + '</td>' +
        '<td><div class="table-actions">' +
          '<button class="icon-btn" title="Edit" data-panel-open="user-panel">' + icon('edit', 16) + '</button>' +
          '<button class="icon-btn" title="Reset password" data-toast="resetPw">' + icon('lock', 16) + '</button>' +
          '<button class="icon-btn" title="Deactivate" data-user-off="' + u.id + '">' + icon('trash', 16) + '</button>' +
        '</div></td>' +
      '</tr>';
    }).join('');
  },

  find: function (id) {
    return this.users.filter(function (u) { return String(u.id) === String(id); })[0];
  },

  bind: function () {
    const self = this;

    on(document, 'click', '[data-user-tab]', function (event, el) {
      event.preventDefault();
      self.state.tab = el.getAttribute('data-user-tab');
      self.renderTabs();
      self.renderRows();
    });

    on(document, 'input', '#user-search', function (event, el) {
      self.state.query = el.value;
      self.renderRows();
    });

    on(document, 'click', '[data-user-toggle]', function (event, el) {
      event.preventDefault();
      const user = self.find(el.getAttribute('data-user-toggle'));
      if (user) {
        user.on = !user.on;
        self.renderRows();
      }
    });

    on(document, 'click', '[data-user-off]', function (event, el) {
      event.preventDefault();
      const user = self.find(el.getAttribute('data-user-off'));
      if (user) {
        user.on = false;
        self.renderRows();
        toast(user.name + ' deactivated');
      }
    });

    /* Invite toggle swaps which toast the panel's submit fires. */
    on(document, 'click', '#user-panel-submit', function (event) {
      event.preventDefault();
      const invite = qs('#user-invite');
      const inviting = invite && invite.getAttribute('aria-checked') === 'true';
      closePanel(qs('#user-panel'));
      toast(inviting ? TOASTS.inviteEmail : TOASTS.userCreated);
    });
  }
};

document.addEventListener('DOMContentLoaded', function () {
  if (qs('#user-rows')) {
    UserAdmin.init();
  }
});

/* ==========================================================================
   community-feed.js — the reusable community feed
   --------------------------------------------------------------------------
   One component, four mount points:

     community.html              read-only, with the sign-in banner
     admin-community.html        Kiyo Tanaka / Administrator
     instructor-community.html   Puan Aisyah Rahman / Instructor
     student-community.html      Amirul Hakim / Student

   Mount by placing <div id="community-feed"></div> in the page and letting
   the page's role attribute decide the identity. The public page opts into
   read-only with data-readonly on the mount node.

   State is per-page and resets on navigation, which is the accepted trade of
   the one-file-per-screen shape.

   Requires data.js, icons.js, ui.js, feed.css.
   ========================================================================== */

'use strict';

const Feed = {

  state: {
    category: 'All',
    query: '',
    sort: 'Newest',
    draft: '',
    added: [],        /* posts written during this visit */
    liked: {},
    comments: {},     /* postId -> [{ who, initials, text }] */
    drafts: {},       /* postId -> comment draft */
    openComment: null
  },

  readOnly: false,
  user: { name: 'Amirul Hakim', initials: 'AH', title: 'Student' },
  root: null,

  /* ------------------------------------------------------------------------
     Mount
     ---------------------------------------------------------------------- */

  mount: function (node) {
    this.root = node;
    this.readOnly = node.hasAttribute('data-readonly');

    const role = document.body.getAttribute('data-role');
    this.user = SESSION_USER[role] || this.user;

    this.render();
    this.bind();
  },

  /* ------------------------------------------------------------------------
     Derived data
     ---------------------------------------------------------------------- */

  allPosts: function () {
    return this.state.added.concat(COMMUNITY_POSTS);
  },

  visiblePosts: function () {
    const s = this.state;
    const needle = s.query.toLowerCase();

    let list = this.allPosts().filter(function (p) {
      const matchesCategory = s.category === 'All' || p.category === s.category;
      const matchesQuery = (p.body + p.author).toLowerCase().indexOf(needle) !== -1;
      return matchesCategory && matchesQuery;
    });

    if (s.sort === 'Popular') {
      const self = this;
      list = list.slice().sort(function (a, b) {
        return self.likeCount(b) - self.likeCount(a);
      });
    }
    return list;
  },

  likeCount: function (post) {
    return post.likes + (this.state.liked[post.id] ? 1 : 0);
  },

  commentsFor: function (post) {
    return this.state.comments[post.id] || [];
  },

  /* ------------------------------------------------------------------------
     Fragments
     ---------------------------------------------------------------------- */

  bannerHTML: function () {
    if (!this.readOnly) {
      return '';
    }
    return '<div class="feed-banner">' +
      '<div class="feed-banner-text">' +
        icon('lock', 20, { stroke: 'var(--primary-hover)' }) +
        '<span class="strong small">Sign in to post and comment</span>' +
        '<span class="small muted">You are viewing the public community feed.</span>' +
      '</div>' +
      '<a class="btn btn-primary btn-sm" href="' + ROUTES.signin.file + '">Sign in</a>' +
      '</div>';
  },

  composerHTML: function () {
    if (this.readOnly) {
      return '';
    }
    const ready = this.state.draft.trim().length > 0;
    return '<div class="composer">' +
      '<div class="composer-row">' +
        avatar(this.user.initials, 'var(--sidebar-active)', 40) +
        '<input class="input input-pill" id="feed-draft" placeholder="Share what is on your mind" value="' + esc(this.state.draft) + '">' +
      '</div>' +
      '<div class="composer-actions">' +
        '<div class="composer-attach">' +
          '<button class="attach-btn" title="Attach image">' + icon('image', 18) + 'Image</button>' +
          '<button class="attach-btn" title="Attach file">' + icon('paperclip', 18) + 'File</button>' +
        '</div>' +
        '<button class="btn btn-primary btn-sm' + (ready ? '' : ' is-waiting') + '" id="feed-post">Post</button>' +
      '</div>' +
      '</div>';
  },

  filtersHTML: function () {
    const current = this.state.category;
    const pills = FEED_CATEGORIES.map(function (c) {
      return '<button class="pill' + (c === current ? ' is-active' : '') + '" data-feed-cat="' + esc(c) + '">' + esc(c) + '</button>';
    }).join('');

    const options = FEED_SORTS.map(function (s) {
      return '<option' + (s === Feed.state.sort ? ' selected' : '') + '>' + s + '</option>';
    }).join('');

    return '<div class="pills">' + pills + '</div>' +
      '<div class="row">' +
        '<div class="toolbar-grow">' +
          icon('search', 16, { stroke: 'var(--text-muted)' }) +
          '<input class="input input-search" id="feed-search" placeholder="Search posts" value="' + esc(this.state.query) + '">' +
        '</div>' +
        '<select class="select" id="feed-sort" style="width:auto">' + options + '</select>' +
      '</div>';
  },

  postHTML: function (post) {
    const liked = !!this.state.liked[post.id];
    const extra = this.commentsFor(post);
    const open = this.state.openComment === post.id;

    let html = '<article class="post" data-post="' + esc(post.id) + '">' +
      '<div class="post-head">' +
        avatar(post.initials, post.color, 40) +
        '<div class="post-ident">' +
          '<div class="post-byline">' +
            '<span class="post-author">' + esc(post.author) + '</span>' +
            roleChip(post.role, 'feed') +
            '<span class="post-time">' + esc(post.time) + '</span>' +
          '</div>' +
          '<div class="post-category">' + categoryChip(post.category) + '</div>' +
        '</div>' +
        '<button class="icon-btn" title="More">' + iconDots(18) + '</button>' +
      '</div>' +
      '<p class="post-body">' + esc(post.body) + '</p>';

    if (post.link) {
      html += '<a class="post-link" href="#">' +
        '<div class="post-link-thumb">' + icon('link', 24, { stroke: 'var(--primary)' }) + '</div>' +
        '<div class="post-link-meta">' +
          '<div class="post-link-title">' + esc(post.linkTitle) + '</div>' +
          '<div class="post-link-desc">' + esc(post.linkDesc) + '</div>' +
          '<div class="post-link-url">' + esc(post.link) + '</div>' +
        '</div>' +
        '</a>';
    }

    if (post.image) {
      html += '<div class="post-poster">' +
        '<div class="post-poster-text">' +
          '<div class="post-poster-eyebrow">POSTER</div>' +
          '<div class="post-poster-title">' + esc(post.image) + '</div>' +
        '</div>' +
        '</div>';
    }

    html += '<div class="post-actions">' +
      '<button class="react-btn' + (liked ? ' is-liked' : '') + '" data-like="' + esc(post.id) + '">' +
        icon('thumbsUp', 16) + this.likeCount(post) + ' Likes</button>' +
      '<button class="react-btn" data-comment="' + esc(post.id) + '">' +
        icon('comment', 16) + (post.comments + extra.length) + ' Comments</button>' +
      '<button class="react-btn" data-toast="share">' + icon('share', 16) + 'Share</button>' +
      '</div>';

    if (extra.length) {
      html += '<div class="comment-list">' + extra.map(function (c) {
        return '<div class="comment">' +
          avatar(c.initials, 'var(--sidebar-active)', 32) +
          '<div class="comment-bubble">' +
            '<strong class="strong">' + esc(c.who) + '</strong> <span class="muted">Just now</span>' +
            '<div style="margin-top:2px">' + esc(c.text) + '</div>' +
          '</div>' +
          '</div>';
      }).join('') + '</div>';
    }

    if (open && !this.readOnly) {
      html += '<div class="comment-form">' +
        avatar(this.user.initials, 'var(--sidebar-active)', 32) +
        '<input class="input" data-comment-draft="' + esc(post.id) + '" placeholder="Write a comment" value="' + esc(this.state.drafts[post.id] || '') + '">' +
        '<button class="btn btn-primary btn-sm" data-reply="' + esc(post.id) + '">Reply</button>' +
        '</div>';
    }

    return html + '</article>';
  },

  sideLeftHTML: function () {
    const pinned = this.allPosts().filter(function (p) { return p.pinned; });

    return '<div class="card">' +
        '<div class="card-head">' +
          '<h3 class="card-title">Recent Announcements</h3>' +
          '<a class="card-link" href="#">See all</a>' +
        '</div>' +
        '<div class="card-list">' + pinned.map(function (p) {
          return '<div class="pinned-item">' +
            '<span class="pinned-dot"></span>' +
            '<div>' +
              '<div class="pinned-title">' + esc(p.title) + '</div>' +
              '<div class="pinned-meta">' + esc(p.author) + ' &middot; ' + esc(p.date) + '</div>' +
            '</div>' +
            '</div>';
        }).join('') + '</div>' +
      '</div>' +
      '<div class="card">' +
        '<h3 class="card-title" style="margin-bottom:14px">My Classes</h3>' +
        '<div class="stack-sm">' + MY_CLASSES.map(function (c) {
          return '<div class="class-item">' +
            '<span class="class-swatch" style="background:' + c.color + '"></span>' +
            '<div style="min-width:0">' +
              '<div class="class-title truncate">' + esc(c.title) + '</div>' +
              '<div class="class-members">' + formatCount(c.members) + ' members</div>' +
            '</div>' +
            '</div>';
        }).join('') + '</div>' +
      '</div>';
  },

  sideRightHTML: function () {
    return '<div class="card">' +
        '<h3 class="card-title" style="margin-bottom:14px">Latest Updates</h3>' +
        '<div class="card-list">' + FEED_UPDATES.map(function (u) {
          return '<div class="update-item">' +
            avatar(u.initials, u.color, 28) +
            '<div>' +
              '<div class="update-text"><strong class="strong">' + esc(u.who) + '</strong> ' +
                esc(u.what) + ' <span class="update-where">' + esc(u.where) + '</span></div>' +
              '<div class="update-time">' + esc(u.time) + '</div>' +
            '</div>' +
            '</div>';
        }).join('') + '</div>' +
      '</div>' +
      '<div class="card">' +
        '<h3 class="card-title" style="margin-bottom:14px">Trending Topics</h3>' +
        '<div class="stack-sm">' + TRENDING_TOPICS.map(function (t) {
          return '<div class="trend-item">' +
            '<span class="trend-tag">' + esc(t.tag) + '</span>' +
            '<span class="trend-count">' + t.count + ' posts</span>' +
            '</div>';
        }).join('') + '</div>' +
      '</div>';
  },

  /* ------------------------------------------------------------------------
     Render
     ---------------------------------------------------------------------- */

  render: function () {
    const posts = this.visiblePosts();
    const self = this;

    const stream = posts.length
      ? posts.map(function (p) { return self.postHTML(p); }).join('')
      : emptyState('No posts here yet', 'Try another category or clear your search.');

    this.root.innerHTML =
      this.bannerHTML() +
      '<div class="feed">' +
        '<div class="feed-side">' + this.sideLeftHTML() + '</div>' +
        '<div class="feed-main">' +
          this.composerHTML() +
          this.filtersHTML() +
          stream +
        '</div>' +
        '<div class="feed-side">' + this.sideRightHTML() + '</div>' +
      '</div>';

    initToasts(this.root);
  },

  /* Re-render while keeping focus and caret in the field being typed into. */
  rerender: function (focusSelector) {
    const active = document.activeElement;
    const caret = active && active.selectionStart;
    this.render();
    if (focusSelector) {
      const next = qs(focusSelector, this.root);
      if (next) {
        next.focus();
        if (caret != null && next.setSelectionRange) {
          next.setSelectionRange(caret, caret);
        }
      }
    }
  },

  /* ------------------------------------------------------------------------
     Behaviour — all delegated, so re-rendering never loses a listener
     ---------------------------------------------------------------------- */

  bind: function () {
    const self = this;
    const root = this.root;

    on(root, 'click', '[data-feed-cat]', function (event, el) {
      event.preventDefault();
      self.state.category = el.getAttribute('data-feed-cat');
      self.render();
    });

    on(root, 'input', '#feed-search', function (event, el) {
      self.state.query = el.value;
      self.rerender('#feed-search');
    });

    on(root, 'change', '#feed-sort', function (event, el) {
      self.state.sort = el.value;
      self.render();
    });

    on(root, 'input', '#feed-draft', function (event, el) {
      const wasReady = self.state.draft.trim().length > 0;
      self.state.draft = el.value;
      /* Only re-render when the Post button actually changes state. */
      if (wasReady !== (el.value.trim().length > 0)) {
        self.rerender('#feed-draft');
      }
    });

    on(root, 'click', '#feed-post', function (event) {
      event.preventDefault();
      const text = self.state.draft.trim();
      if (!text) {
        return;
      }
      self.state.added.unshift({
        id: 'new-' + Date.now(),
        author: self.user.name,
        initials: self.user.initials,
        color: 'var(--sidebar-active)',
        role: self.user.title === 'Administrator' ? 'Admin' : self.user.title,
        time: 'Just now',
        category: self.state.category === 'All' ? 'General' : self.state.category,
        body: text,
        likes: 0,
        comments: 0
      });
      self.state.draft = '';
      self.render();
    });

    on(root, 'click', '[data-like]', function (event, el) {
      event.preventDefault();
      const id = el.getAttribute('data-like');
      self.state.liked[id] = !self.state.liked[id];
      self.render();
    });

    on(root, 'click', '[data-comment]', function (event, el) {
      event.preventDefault();
      const id = el.getAttribute('data-comment');
      self.state.openComment = String(self.state.openComment) === id ? null : id;
      self.render();
    });

    on(root, 'input', '[data-comment-draft]', function (event, el) {
      self.state.drafts[el.getAttribute('data-comment-draft')] = el.value;
    });

    on(root, 'click', '[data-reply]', function (event, el) {
      event.preventDefault();
      const id = el.getAttribute('data-reply');
      const text = (self.state.drafts[id] || '').trim();
      if (!text) {
        return;
      }
      self.state.comments[id] = (self.state.comments[id] || []).concat({
        who: self.user.name,
        initials: self.user.initials,
        text: text
      });
      self.state.drafts[id] = '';
      self.render();
    });
  }
};

document.addEventListener('DOMContentLoaded', function () {
  const node = qs('#community-feed');
  if (node) {
    Feed.mount(node);
  }
});

# Techies Learning Management System — Hardcode Prototype

A clickable, front-end-only prototype of a Learning Management System with a community
feed. Twenty-nine screens in plain HTML, CSS and JavaScript. No framework, no build
step, no backend, no dependencies to install.

Ported from a Claude Code Design canvas. This is a demo artefact for client review and
the reference the real build will be measured against — it is **not** the production app.

---

## Run it

Double-click **`index.html`**. That is the whole setup.

Every page is standalone and opens straight from the filesystem. If you would rather
serve it (useful for sharing over a LAN, or if your browser is strict about local
files):

```
python -m http.server 5173
```

then open `http://127.0.0.1:5173/index.html`.

**Start anywhere.** A floating **Screens** button sits in the bottom-right of every
page and opens an index of all twenty-nine screens grouped by role. That is the fastest
way to walk a demo.

---

## Screen map

| Landing | Admin | Instructor | Student |
|---|---|---|---|
| `index.html` — Home | `admin-dashboard.html` | `instructor-dashboard.html` | `student-dashboard.html` |
| `courses.html` — Catalogue | `admin-community.html` | `instructor-community.html` | `student-community.html` |
| `course-detail.html` | `admin-activity.html` — Activity Log | `instructor-courses.html` — All Courses | `student-enrolled.html` — My Courses |
| `community.html` — public feed | `admin-users.html` — User Management | `instructor-create-course.html` | `student-catalog.html` — Browse Catalog |
| `signin.html` | `admin-oversight.html` — Course Oversight | `instructor-quiz-assignment.html` | `student-player.html` — Lesson |
| | `admin-settings.html` | `instructor-students.html` | `student-quiz.html` — Quiz attempt |
| | | `instructor-settings.html` | `student-quiz-result.html` |
| | | | `student-certificates.html` |
| | | | `student-settings.html` |

Plus `components.html` (the component library) and `mobile-student-dashboard.html`
(phone frames, the only screen designed below 1180px).

---

## What actually works

This is a prototype, but it is not a set of pictures. Interactions that behave for real:

- **Community feed** — post, like, comment, filter by category, search, sort by newest
  or popular. The public page is read-only with a sign-in banner
- **Course catalogue** — category, level and price filters with live counts, search,
  clear-all
- **User management** — four tabs with counts, search, status toggles, deactivate,
  add-user side panel
- **Activity log** — role filter and pagination
- **Course builder** — four-step stepper, module accordion, add lesson, lesson drawer
- **Quiz builder** — add and remove questions of three types, running points total
- **Lesson player** — curriculum tree, mark complete, previous and next across modules
- **Quiz attempt** — one question per screen, countdown timer, real scoring against the
  answer key, and a per-question review on the results page
- **Sidebar collapse** — persists across pages via `localStorage`

Deliberately **not** wired: Google sign-in, Bunny.net uploads, payments, email,
certificate PDFs. Those are visual placeholders.

State resets when you move between pages. That is expected — each screen is a
standalone file with no shared session.

---

## File layout

```
*.html                    29 screens, one per file
assets/css/
  tokens.css              every colour, radius, shadow, type step and dimension
  base.css                reset, webfont contract, motion
  controls.css            buttons, inputs, toggles, chips, avatars
  components.css          cards, tables, tabs, progress, panels
  feed.css                the community feed
  layout.css              the two shells and overlays
  screens-public.css      landing and component-library one-offs
  screens-app.css         signed-in screen one-offs
assets/js/
  brand.js                the product name — see below
  data.js                 all sample content
  icons.js                29 glyphs
  ui.js                   toast, tabs, toggles, accordions, panels
  shell.js                renders sidebar, topbar, footer, screen index
  community-feed.js       the feed component
  pages/                  one script per interactive screen
```

### How the chrome works

Each page declares itself once, on the body tag:

```html
<body data-role="student" data-route="stu.dashboard" data-title="Dashboard">
```

`shell.js` reads those three attributes and fills in the sidebar, topbar, landing nav,
footer and overlay layer. The sidebar therefore exists in **one** place rather than
being copy-pasted across twenty-two dashboard pages, while every page still opens
standalone. Screen *content* is hardcoded in each file — that part is the deliverable.

When this is rebuilt for real, `shell.js` maps cleanly onto a Blade or Vue layout
component.

---

## Renaming the product

Both brand strings live in `assets/js/brand.js` and nowhere else:

```js
const BRAND = Object.freeze({
  short: 'Techies LMS',
  full:  'Techies Learning Management System',
  ...
});
```

Change those two lines and all twenty-nine pages follow. Sample emails
(`@techieslms.my`) and certificate identifiers (`TLM-…`) live in `assets/js/data.js`
if you want them to match.

---

## Intended production stack

Per the client brief, the real build targets:

- **Frontend** Vue 3 · **Backend** Laravel · **Database** MySQL
- **Media** Bunny.net Storage and Stream
- **Hosting** Cloudflare in front, RunCloud on the box
- **Auth** Google sign-in via Laravel Socialite (store `google_id` as a nullable
  column, never as the primary key)

The community feed is one component reused across all three roles — mirror that in the
real build rather than writing it three times.

---

## Sample data

Malaysian training-provider context throughout: six courses (Python Competency Program,
Robotics Foundation, Digital Marketing Asas, Data Analytics with Excel, Arduino IoT
Projects, Web Development Bootcamp), instructors Puan Aisyah Rahman, Encik Farid Zainal
and Cik Nurul Huda, a seventeen-lesson curriculum, a six-question quiz bank, an
eight-user table and five community posts.

All of it is fictional and lives in `assets/js/data.js`.

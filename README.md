# Techies Learning Management System — Hardcode Prototype

A clickable, front-end-only prototype of a Learning Management System with a community
feed. Twenty-nine screens in plain HTML, CSS and JavaScript. No framework, no build
step, no backend, no dependencies to install.

Ported from a Claude Code Design canvas. This is a demo artefact for client review and
the reference the real build will be measured against — it is **not** the production app.

---

## Run it

Double-click **`index.html`**. That is the whole setup.

It works from phone width up — see **Responsive behaviour** below.

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

## Responsive behaviour

The prototype reflows. There are three tiers:

```
  >= 1180px            768 - 1179px              < 768px
  DESKTOP              TABLET                    MOBILE
  ---------            ----------                --------
  260px sidebar        sidebar collapses to      sidebar hidden
  full grids           the 72px icon rail        bottom nav bar
  no bottom nav        grids halve               single column
```

Desktop rendering above 1180px is unchanged from the original desktop-only
build — every breakpoint lives in `assets/css/responsive.css` and none of it
applies at that width.

### Bottom navigation

Below 768px the sidebar is replaced by a fixed bottom bar. A bar holds four
slots; Student and the landing site have exactly four destinations, so Admin
and Instructor put their remainder behind a **More** sheet that slides up.

| Surface | Bar | Behind More |
|---|---|---|
| Landing | Home, Courses, Community, Sign In | — |
| Student | Home, My Courses, Community, Settings | — |
| Admin | Dashboard, Community, Users, **More** | Activity Log, Course Oversight, Settings |
| Instructor | Dashboard, Community, Courses, **More** | Create Course, Quiz, Assignment, Student Management, Settings |

The Student **My Courses** slot reaches all three course screens — Enrolled,
Browse Catalog and Certificates — through a tab row carried at the top of each
of those pages. That row is visible at every width, not only on mobile.

A slot stays lit across related routes, so My Courses remains active while a
student is in the lesson player, taking a quiz, or reading their results.

### What changes on a phone

- Sidebar out, bottom bar in; the top bar keeps title, search icon, bell and avatar
- KPI and stats grids go 2×2 (single column below 360px)
- Course grids, feature tiles, settings and two-column screens go single column
- The community feed drops both rails and shows the stream alone
- The landing hero drops its decorative dashboard mock; buttons go full width
- Sign-in becomes the panel above the card
- The course builder's stepper turns horizontal and scrolls
- Tables keep their shape and scroll sideways inside their card, so dense admin
  data stays readable rather than being crushed
- Side panels and drawers become full-width sheets

### Verifying it yourself

Browser devtools device toolbar is the easy way. Note that headless Chrome and
Edge clamp `--window-size` to roughly a 492px minimum viewport, so a smaller
`--screenshot` **crops** rather than reflows — it will look broken when it is
not. Measure inside the page instead:

```js
document.documentElement.scrollWidth   // must be <= window.innerWidth
window.matchMedia('(max-width: 767px)').matches
document.querySelectorAll('.bottom-tab').length   // 4
```

At a true 390px viewport this build reports `scrollWidth` 375 against
`innerWidth` 390, zero elements wider than the viewport, and four bottom tabs.

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
  responsive.css          every breakpoint, bottom nav and More sheet
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

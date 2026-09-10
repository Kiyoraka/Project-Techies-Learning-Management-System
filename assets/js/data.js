/* ==========================================================================
   data.js — sample content for the prototype
   --------------------------------------------------------------------------
   Every value here is lifted verbatim from the Claude Design canvas so the
   built pages read identically to the artboards. Pure data only: no DOM, no
   behaviour, no formatting. Derived values (progress dashes, initials, chip
   colours) are computed at render time, not stored.

   Two deliberate rebrands from the source, both flagged:
     - sample emails   @brilliantlms.my  ->  @techieslms.my
     - certificate ids EDU-2026-xxxxx    ->  TLM-2026-xxxxx
   Everything else is untouched, including names, dates, IP addresses and
   the Malaysian-context course titles.
   ========================================================================== */

'use strict';

/* --------------------------------------------------------------------------
   Courses — the spine of the catalogue, oversight table and every course card
   -------------------------------------------------------------------------- */

const COURSES = [
  {
    id: 1, title: 'Python Competency Program', category: 'Programming',
    instructor: 'Puan Aisyah Rahman', instInitials: 'AR', instColor: '#10B981',
    lessons: 42, hours: 18, price: 'RM 299', free: false, level: 'Intermediate',
    enrolled: 1240, status: 'Published', progress: 68, thumb: '#10B981',
    rating: 4.8, updated: '10 Sep 2026',
    subtitle: 'From zero to writing real automation scripts in 8 weeks.'
  },
  {
    id: 2, title: 'Robotics Foundation', category: 'Robotics',
    instructor: 'Encik Farid Zainal', instInitials: 'FZ', instColor: '#0EA5A4',
    lessons: 30, hours: 12, price: 'RM 249', free: false, level: 'Beginner',
    enrolled: 860, status: 'Published', progress: 35, thumb: '#0EA5A4',
    rating: 4.7, updated: '8 Sep 2026',
    subtitle: 'Sensors, motors and logic with hands-on kits.'
  },
  {
    id: 3, title: 'Digital Marketing Asas', category: 'Business',
    instructor: 'Cik Nurul Huda', instInitials: 'NH', instColor: '#34D399',
    lessons: 24, hours: 9, price: 'Free', free: true, level: 'Beginner',
    enrolled: 2105, status: 'Published', progress: 100, thumb: '#34D399',
    rating: 4.6, updated: '2 Sep 2026',
    subtitle: 'Social, search and email marketing for small businesses.'
  },
  {
    id: 4, title: 'Data Analytics with Excel', category: 'Data',
    instructor: 'Encik Farid Zainal', instInitials: 'FZ', instColor: '#0EA5A4',
    lessons: 28, hours: 10, price: 'RM 199', free: false, level: 'Beginner',
    enrolled: 540, status: 'Published', progress: 12, thumb: '#134E3A',
    rating: 4.5, updated: '30 Aug 2026',
    subtitle: 'Pivot tables, dashboards and clean reporting.'
  },
  {
    id: 5, title: 'Arduino IoT Projects', category: 'Robotics',
    instructor: 'Puan Aisyah Rahman', instInitials: 'AR', instColor: '#10B981',
    lessons: 20, hours: 8, price: 'RM 179', free: false, level: 'Intermediate',
    enrolled: 0, status: 'Draft', progress: 0, thumb: '#0EA5A4',
    rating: 0, updated: '9 Sep 2026',
    subtitle: 'Build five connected devices from scratch.'
  },
  {
    id: 6, title: 'Web Development Bootcamp', category: 'Programming',
    instructor: 'Puan Aisyah Rahman', instInitials: 'AR', instColor: '#10B981',
    lessons: 56, hours: 24, price: 'RM 399', free: false, level: 'Advanced',
    enrolled: 310, status: 'Pending review', progress: 0, thumb: '#134E3A',
    rating: 4.9, updated: '7 Sep 2026',
    subtitle: 'HTML, CSS, JavaScript and a Laravel backend.'
  }
];

/* Catalogue filter vocabularies. */
const CATEGORIES = ['Programming', 'Robotics', 'Business', 'Data'];
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const PRICES = ['All', 'Free', 'Paid'];

/* --------------------------------------------------------------------------
   Curriculum — Python Competency Program, 4 modules / 17 lessons
   Drives the course-detail accordion, the create-course builder and the
   lesson player rail.
   -------------------------------------------------------------------------- */

const CURRICULUM = [
  {
    id: 1, title: 'Getting Started', lessons: [
      { id: 'l1', title: 'Welcome and course setup', type: 'Video', mins: 8 },
      { id: 'l2', title: 'Installing Python and VS Code', type: 'Video', mins: 12 },
      { id: 'l3', title: 'Your first script', type: 'Text', mins: 6 },
      { id: 'l4', title: 'Module 1 Quiz', type: 'Quiz', mins: 10 }
    ]
  },
  {
    id: 2, title: 'Variables and Data Types', lessons: [
      { id: 'l5', title: 'Variables and naming', type: 'Video', mins: 14 },
      { id: 'l6', title: 'Numbers and strings', type: 'Video', mins: 16 },
      { id: 'l7', title: 'Lists and tuples', type: 'Video', mins: 18 },
      { id: 'l8', title: 'Dictionaries', type: 'Video', mins: 15 },
      { id: 'l9', title: 'Data types cheat sheet', type: 'PDF', mins: 4 },
      { id: 'l10', title: 'Module 2 Quiz', type: 'Quiz', mins: 10 }
    ]
  },
  {
    id: 3, title: 'Control Flow', lessons: [
      { id: 'l11', title: 'If statements', type: 'Video', mins: 12 },
      { id: 'l12', title: 'For and while loops', type: 'Video', mins: 20 },
      { id: 'l13', title: 'Loop exercises', type: 'Text', mins: 15 },
      { id: 'l14', title: 'Module 3 Quiz', type: 'Quiz', mins: 10 }
    ]
  },
  {
    id: 4, title: 'Functions', lessons: [
      { id: 'l15', title: 'Defining functions', type: 'Video', mins: 14 },
      { id: 'l16', title: 'Arguments and return values', type: 'Video', mins: 16 },
      { id: 'l17', title: 'Module 4 Quiz', type: 'Quiz', mins: 10 }
    ]
  }
];

/* Player defaults: lessons 1 to 6 done, currently sitting on l7. */
const COMPLETED_LESSONS = ['l1', 'l2', 'l3', 'l4', 'l5', 'l6'];
const CURRENT_LESSON_ID = 'l7';

/* Course-detail accordion opens module 1; create-course opens 1 and 2. */
const DETAIL_OPEN_MODULES = [1];
const BUILDER_OPEN_MODULES = [1, 2];

/* --------------------------------------------------------------------------
   Quiz bank — the student attempt flow. Pass mark is 60 percent.
   -------------------------------------------------------------------------- */

const QUIZ_BANK = [
  { id: 'q1', text: 'Which keyword defines a function in Python?', options: ['def', 'func', 'function', 'lambda'], answer: 'def' },
  { id: 'q2', text: 'Which of the following creates a list?', options: ['x = (1, 2, 3)', 'x = [1, 2, 3]', 'x = {1, 2, 3}', 'x = "1, 2, 3"'], answer: 'x = [1, 2, 3]' },
  { id: 'q3', text: 'What does len("Kuala Lumpur") return?', options: ['11', '12', '13', 'An error'], answer: '12' },
  { id: 'q4', text: 'True or False: Python lists are immutable.', options: ['True', 'False'], answer: 'False' },
  { id: 'q5', text: 'Short answer: which operator performs exponentiation in Python?', short: true, answer: '**' },
  { id: 'q6', text: 'Which loop keeps running while a condition stays true?', options: ['for', 'while', 'repeat', 'until'], answer: 'while' }
];

const QUIZ_PASS_RATIO = 0.6;

/* Instructor-side quiz builder starting rows (separate from the bank above). */
const QUIZ_BUILDER_QUESTIONS = [
  { type: 'Multiple choice', text: 'Which keyword defines a function in Python?', pts: 2 },
  { type: 'True or false', text: 'Python lists are immutable.', pts: 1 },
  { type: 'Short answer', text: 'Which operator performs exponentiation?', pts: 2 },
  { type: 'Multiple choice', text: 'What does len("Kuala Lumpur") return?', pts: 2 }
];

const QUESTION_TYPES = ['Multiple choice', 'True or false', 'Short answer'];

/* --------------------------------------------------------------------------
   Users — admin user-management table. Lim Wei Jie is deliberately inactive.
   -------------------------------------------------------------------------- */

const USERS = [
  { id: 1, name: 'Kiyo Tanaka', email: 'kiyo@techieslms.my', role: 'Admin', on: true, joined: '1 Jan 2026', color: '#134E3A' },
  { id: 2, name: 'Puan Aisyah Rahman', email: 'aisyah@techieslms.my', role: 'Instructor', on: true, joined: '12 Jan 2026', color: '#10B981' },
  { id: 3, name: 'Encik Farid Zainal', email: 'farid@techieslms.my', role: 'Instructor', on: true, joined: '3 Feb 2026', color: '#0EA5A4' },
  { id: 4, name: 'Cik Nurul Huda', email: 'nurul@techieslms.my', role: 'Instructor', on: true, joined: '20 Mar 2026', color: '#34D399' },
  { id: 5, name: 'Amirul Hakim', email: 'amirul.hakim@gmail.com', role: 'Student', on: true, joined: '28 Aug 2026', color: '#34D399' },
  { id: 6, name: 'Siti Nurhaliza', email: 'siti.n@gmail.com', role: 'Student', on: true, joined: '1 Sep 2026', color: '#0EA5A4' },
  { id: 7, name: 'Lim Wei Jie', email: 'weijie.lim@gmail.com', role: 'Student', on: false, joined: '5 Sep 2026', color: '#134E3A' },
  { id: 8, name: 'Nur Aina Zulkifli', email: 'aina.z@gmail.com', role: 'Student', on: true, joined: '8 Sep 2026', color: '#10B981' }
];

const USER_TABS = ['All', 'Admins', 'Instructors', 'Students'];
const PANEL_ROLES = ['Student', 'Instructor', 'Admin'];

/* Which course each recent sign-up joined, keyed by user id. */
const SIGNUP_COURSE = {
  5: 'Robotics Foundation',
  6: 'Python Competency Program',
  7: 'Web Development Bootcamp',
  8: 'Python Competency Program'
};

/* Honorifics stripped when deriving initials, so Puan Aisyah Rahman is AR. */
const HONORIFICS = ['Puan', 'Encik', 'Cik'];

/* --------------------------------------------------------------------------
   Activity log — 10 rows, paginated 6 per page
   -------------------------------------------------------------------------- */

const ACTIVITY = [
  { time: '10 Sep 2026 · 09:42', user: 'Puan Aisyah Rahman', role: 'Instructor', action: 'Published course', target: 'Python Competency Program', ip: '175.139.22.14' },
  { time: '10 Sep 2026 · 09:15', user: 'Amirul Hakim', role: 'Student', action: 'Enrolled', target: 'Robotics Foundation', ip: '60.51.104.8' },
  { time: '10 Sep 2026 · 08:58', user: 'Kiyo Tanaka', role: 'Admin', action: 'Updated settings', target: 'Authentication', ip: '118.100.7.201' },
  { time: '10 Sep 2026 · 08:30', user: 'Siti Nurhaliza', role: 'Student', action: 'Submitted quiz', target: 'Module 3 Quiz', ip: '115.164.90.33' },
  { time: '10 Sep 2026 · 07:55', user: 'Encik Farid Zainal', role: 'Instructor', action: 'Created assignment', target: 'Sensor Report', ip: '175.139.22.14' },
  { time: '9 Sep 2026 · 22:10', user: 'Lim Wei Jie', role: 'Student', action: 'Signed in with Google', target: '—', ip: '42.190.13.77' },
  { time: '9 Sep 2026 · 21:40', user: 'Cik Nurul Huda', role: 'Instructor', action: 'Uploaded video', target: 'Lesson 12: SEO Basics', ip: '203.106.55.2' },
  { time: '9 Sep 2026 · 20:05', user: 'Kiyo Tanaka', role: 'Admin', action: 'Deactivated user', target: 'Lim Wei Jie', ip: '118.100.7.201' },
  { time: '9 Sep 2026 · 18:22', user: 'Nur Aina Zulkifli', role: 'Student', action: 'Enrolled', target: 'Python Competency Program', ip: '1.9.76.140' },
  { time: '9 Sep 2026 · 16:05', user: 'Puan Aisyah Rahman', role: 'Instructor', action: 'Graded submission', target: 'Loop Exercises', ip: '175.139.22.14' }
];

const ACTIVITY_PER_PAGE = 6;
const ACTIVITY_ROLES = ['All', 'Admin', 'Instructor', 'Student'];

/* --------------------------------------------------------------------------
   Community — the feed, its sidebars, and the landing highlights
   -------------------------------------------------------------------------- */

const FEED_CATEGORIES = ['All', 'General', 'Announcements', 'Competitions', 'Events and Workshops'];
const FEED_SORTS = ['Newest', 'Popular'];

const COMMUNITY_POSTS = [
  {
    id: 1, author: 'Puan Aisyah Rahman', initials: 'AR', color: '#10B981', role: 'Instructor',
    time: '2h ago', category: 'Announcements', pinned: true,
    title: 'Python Competency pre-test is open', date: '10 Sep',
    body: 'Pre-test for Python Competency Program is now open. Please complete it before Friday, 13 Sep, 5:00 PM. It takes about 20 minutes and does not affect your final grade.',
    link: 'techieslms.my/pretest-python',
    linkTitle: 'Python Competency Program — Pre-test',
    linkDesc: '20 questions · 20 minutes · one attempt',
    likes: 24, comments: 8
  },
  {
    id: 2, author: 'Kiyo Tanaka', initials: 'KT', color: '#134E3A', role: 'Admin',
    time: '5h ago', category: 'Competitions', pinned: true,
    title: 'National Robotics Challenge 2026 registration', date: '10 Sep',
    body: 'Registration for the National Robotics Challenge 2026 closes on 20 Sep. Teams of 3, open to all Robotics Foundation students. Poster below, register via the form in your course page.',
    image: 'National Robotics Challenge 2026',
    likes: 56, comments: 19
  },
  {
    id: 3, author: 'Encik Farid Zainal', initials: 'FZ', color: '#0EA5A4', role: 'Instructor',
    time: 'Yesterday', category: 'Events and Workshops', pinned: true,
    title: 'Arduino hands-on workshop, Sat 14 Sep', date: '9 Sep',
    body: 'Arduino hands-on workshop this Saturday 14 Sep, 10:00 AM at Lab 2, Cyberjaya campus. Bring your own laptop; kits are provided. Limited to 30 seats.',
    likes: 31, comments: 12
  },
  {
    id: 4, author: 'Amirul Hakim', initials: 'AH', color: '#34D399', role: 'Student',
    time: 'Yesterday', category: 'General',
    body: 'Anyone from the Digital Marketing batch want to form a study group for the final project? We could meet online on Tuesday nights after 9 PM.',
    likes: 12, comments: 6
  },
  {
    id: 5, author: 'Siti Nurhaliza', initials: 'SN', color: '#0EA5A4', role: 'Student',
    time: '2 days ago', category: 'General',
    body: 'Finished Module 3 of Data Analytics with Excel — the pivot table lesson finally clicked. Terima kasih Encik Farid!',
    likes: 40, comments: 4
  }
];

/* Shorter bodies used by the landing page Community Highlights section. */
const COMMUNITY_HIGHLIGHTS = [
  { author: 'Puan Aisyah Rahman', initials: 'AR', color: '#10B981', role: 'Instructor', time: '2h ago', category: 'Announcements', body: 'Pre-test for Python Competency Program is now open. Please complete it before Friday, 13 Sep, 5:00 PM.', likes: 24, comments: 8 },
  { author: 'Kiyo Tanaka', initials: 'KT', color: '#134E3A', role: 'Admin', time: '5h ago', category: 'Competitions', body: 'Registration for the National Robotics Challenge 2026 closes on 20 Sep. Teams of 3, open to all Robotics Foundation students.', likes: 56, comments: 19 },
  { author: 'Encik Farid Zainal', initials: 'FZ', color: '#0EA5A4', role: 'Instructor', time: 'Yesterday', category: 'Events and Workshops', body: 'Arduino hands-on workshop this Saturday 14 Sep, 10:00 AM at Lab 2, Cyberjaya campus. Kits provided, 30 seats.', likes: 31, comments: 12 }
];

const MY_CLASSES = [
  { title: 'Python Competency Program', members: 1240, color: '#10B981' },
  { title: 'Robotics Foundation', members: 860, color: '#0EA5A4' },
  { title: 'Digital Marketing Asas', members: 2105, color: '#34D399' }
];

const FEED_UPDATES = [
  { who: 'Amirul Hakim', initials: 'AH', color: '#34D399', what: 'commented in', where: 'General', time: '10 min ago' },
  { who: 'Puan Aisyah Rahman', initials: 'AR', color: '#10B981', what: 'posted in', where: 'Announcements', time: '2h ago' },
  { who: 'Encik Farid Zainal', initials: 'FZ', color: '#0EA5A4', what: 'replied in', where: 'Events and Workshops', time: '5h ago' },
  { who: 'Lim Wei Jie', initials: 'LW', color: '#134E3A', what: 'joined', where: 'Robotics Foundation', time: 'Yesterday' }
];

const TRENDING_TOPICS = [
  { tag: '#PythonPretest', count: 48 },
  { tag: '#RoboticsChallenge2026', count: 35 },
  { tag: '#ArduinoWorkshop', count: 22 },
  { tag: '#StudyGroup', count: 14 }
];

/* --------------------------------------------------------------------------
   Instructor workspace
   -------------------------------------------------------------------------- */

/* Average student completion per owned course, keyed by course id. */
const COURSE_AVG_COMPLETION = { 1: 62, 5: 0, 6: 18 };

const SUBMISSIONS = [
  { student: 'Amirul Hakim', initials: 'AH', color: '#34D399', item: 'Sensor Report', course: 'Robotics Foundation', time: '2h ago' },
  { student: 'Siti Nurhaliza', initials: 'SN', color: '#0EA5A4', item: 'Module 3 Quiz · short answers', course: 'Data Analytics with Excel', time: '5h ago' },
  { student: 'Lim Wei Jie', initials: 'LW', color: '#134E3A', item: 'Final Project Brief', course: 'Digital Marketing Asas', time: 'Yesterday' },
  { student: 'Nur Aina Zulkifli', initials: 'NZ', color: '#10B981', item: 'Loop Exercises', course: 'Python Competency Program', time: 'Yesterday' }
];

const DEADLINES = [
  { title: 'Sensor Report', course: 'Robotics Foundation', due: '12 Sep', tone: '#F59E0B', label: 'Due in 2 days' },
  { title: 'Module 4 Quiz', course: 'Python Competency Program', due: '15 Sep', tone: '#5B6B64', label: 'Due in 5 days' },
  { title: 'Final Project', course: 'Digital Marketing Asas', due: '20 Sep', tone: '#5B6B64', label: 'Due in 10 days' }
];

const ASSIGNMENTS = [
  { title: 'Sensor Report', course: 'Robotics Foundation', due: '12 Sep 2026', subs: 18, total: 30 },
  { title: 'Loop Exercises', course: 'Python Competency Program', due: '11 Sep 2026', subs: 41, total: 48 },
  { title: 'Final Project Brief', course: 'Digital Marketing Asas', due: '20 Sep 2026', subs: 9, total: 36 },
  { title: 'IoT Device Proposal', course: 'Arduino IoT Projects', due: '30 Sep 2026', subs: 0, total: 0 }
];

const ENROLLED_STUDENTS = [
  { name: 'Amirul Hakim', initials: 'AH', color: '#34D399', course: 'Python Competency Program', progress: 68, last: '2h ago', avg: 84 },
  { name: 'Siti Nurhaliza', initials: 'SN', color: '#0EA5A4', course: 'Python Competency Program', progress: 91, last: '5h ago', avg: 92 },
  { name: 'Lim Wei Jie', initials: 'LW', color: '#134E3A', course: 'Web Development Bootcamp', progress: 12, last: '3 days ago', avg: 61 },
  { name: 'Nur Aina Zulkifli', initials: 'NZ', color: '#10B981', course: 'Python Competency Program', progress: 44, last: 'Yesterday', avg: 78 },
  { name: 'Hafiz Ismail', initials: 'HI', color: '#0EA5A4', course: 'Web Development Bootcamp', progress: 27, last: 'Yesterday', avg: 70 },
  { name: 'Tan Mei Ling', initials: 'TM', color: '#34D399', course: 'Python Competency Program', progress: 100, last: '1 week ago', avg: 96 }
];

const CREATE_STEPS = ['Basics', 'Curriculum', 'Pricing', 'Publish'];
const LESSON_TYPES = ['Video', 'PDF', 'Text', 'Quiz'];

/* --------------------------------------------------------------------------
   Student workspace
   -------------------------------------------------------------------------- */

const ENROLLED_COURSE_IDS = [1, 2, 3, 4];
const ENROLLED_FILTERS = ['In progress', 'Completed'];
const PLAYER_TABS = ['Overview', 'Resources', 'Q and A', 'Notes'];

const CERTIFICATES = [
  { course: 'Digital Marketing Asas', date: '28 Aug 2026', id: 'TLM-2026-04821', color: '#34D399' },
  { course: 'Introduction to Git and GitHub', date: '15 Jun 2026', id: 'TLM-2026-03110', color: '#0EA5A4' }
];

/* --------------------------------------------------------------------------
   KPI cards, per role. Each entry is [label, value, delta].
   -------------------------------------------------------------------------- */

const KPIS = {
  admin: [
    ['Total Students', '4,812', '+12% this month'],
    ['Total Instructors', '36', '+2 this month'],
    ['Published Courses', '128', '+6 this month'],
    ['Active Enrollments', '9,340', '+8% this month']
  ],
  instructor: [
    ['My Courses', '3', '1 pending review'],
    ['Total Students', '1,550', '+64 this week'],
    ['Pending Submissions', '4', 'Oldest 2 days'],
    ['Average Completion', '62%', '+3 pts vs last month']
  ],
  student: [
    ['Courses in progress', '3', '1 due this week'],
    ['Completed', '1', 'Digital Marketing Asas'],
    ['Certificates', '2', 'Latest 28 Aug'],
    ['Learning hours', '46', '+5h this week']
  ]
};

/* Compact student KPI strip used on the mobile frame. */
const STUDENT_KPI_COMPACT = [
  ['In progress', '3'], ['Completed', '1'], ['Certificates', '2'], ['Hours', '46']
];

/* --------------------------------------------------------------------------
   Admin enrolments chart — geometry copied from the artboard SVG
   viewBox 0 0 620 190. Two series plus the filled area under series 1.
   -------------------------------------------------------------------------- */

const ENROLMENTS_CHART = {
  viewBox: '0 0 620 190',
  months: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
  area: 'M40 150 L148 132 L256 118 L364 96 L472 74 L580 40 L580 170 L40 170 Z',
  series: [
    { points: '40,150 148,132 256,118 364,96 472,74 580,40', color: '#10B981' },
    { points: '40,160 148,152 256,148 364,136 472,128 580,110', color: '#34D399' }
  ]
};

/* --------------------------------------------------------------------------
   Signed-in identity per role
   -------------------------------------------------------------------------- */

const SESSION_USER = {
  admin: { name: 'Kiyo Tanaka', initials: 'KT', title: 'Administrator' },
  instructor: { name: 'Puan Aisyah Rahman', initials: 'AR', title: 'Instructor' },
  student: { name: 'Amirul Hakim', initials: 'AH', title: 'Student' }
};

/* --------------------------------------------------------------------------
   Route table — the one place a route id maps to its file and page title.
   Consumed by shell.js for nav links, the topbar title and the screen index.
   -------------------------------------------------------------------------- */

const ROUTES = {
  'home':             { file: 'index.html',                      title: 'Home',                group: 'Landing' },
  'courses':          { file: 'courses.html',                    title: 'Courses',             group: 'Landing' },
  'detail':           { file: 'course-detail.html',              title: 'Course Detail',       group: 'Landing' },
  'community':        { file: 'community.html',                  title: 'Community (public)',  group: 'Landing' },
  'signin':           { file: 'signin.html',                     title: 'Sign In',             group: 'Landing' },

  'admin.dashboard':  { file: 'admin-dashboard.html',            title: 'Dashboard',           group: 'Admin' },
  'admin.community':  { file: 'admin-community.html',            title: 'Community',           group: 'Admin' },
  'admin.activity':   { file: 'admin-activity.html',             title: 'Activity Log',        group: 'Admin' },
  'admin.users':      { file: 'admin-users.html',                title: 'User Management',     group: 'Admin' },
  'admin.oversight':  { file: 'admin-oversight.html',            title: 'Course Oversight',    group: 'Admin' },
  'admin.settings':   { file: 'admin-settings.html',             title: 'Settings',            group: 'Admin' },

  'inst.dashboard':   { file: 'instructor-dashboard.html',       title: 'Dashboard',           group: 'Instructor' },
  'inst.community':   { file: 'instructor-community.html',       title: 'Community',           group: 'Instructor' },
  'inst.courses':     { file: 'instructor-courses.html',         title: 'All Courses',         group: 'Instructor' },
  'inst.create':      { file: 'instructor-create-course.html',   title: 'Create Course',       group: 'Instructor' },
  'inst.qa':          { file: 'instructor-quiz-assignment.html', title: 'Quiz and Assignment', group: 'Instructor' },
  'inst.students':    { file: 'instructor-students.html',        title: 'Student Management',  group: 'Instructor' },
  'inst.settings':    { file: 'instructor-settings.html',        title: 'Settings',            group: 'Instructor' },

  'stu.dashboard':    { file: 'student-dashboard.html',          title: 'Dashboard',           group: 'Student' },
  'stu.community':    { file: 'student-community.html',          title: 'Community',           group: 'Student' },
  'stu.enrolled':     { file: 'student-enrolled.html',           title: 'My Courses',          group: 'Student' },
  'stu.catalog':      { file: 'student-catalog.html',            title: 'Browse Catalog',      group: 'Student' },
  'stu.player':       { file: 'student-player.html',             title: 'Lesson',              group: 'Student' },
  'stu.quiz':         { file: 'student-quiz.html',               title: 'Quiz',                group: 'Student' },
  'stu.result':       { file: 'student-quiz-result.html',        title: 'Quiz Results',        group: 'Student' },
  'stu.certs':        { file: 'student-certificates.html',       title: 'Certificates',        group: 'Student' },
  'stu.settings':     { file: 'student-settings.html',           title: 'Settings',            group: 'Student' },

  'components':       { file: 'components.html',                 title: 'Component Library',   group: 'Extras' },
  'mobile':           { file: 'mobile-student-dashboard.html',   title: 'Mobile Student Dashboard', group: 'Extras' }
};

/* Order the screen-index panel renders its groups in. */
const ROUTE_GROUPS = ['Landing', 'Admin', 'Instructor', 'Student', 'Extras'];

/* --------------------------------------------------------------------------
   Settings tab groups
   -------------------------------------------------------------------------- */

const SETTINGS_TABS = {
  admin: ['General', 'Appearance', 'Authentication', 'Storage', 'Email'],
  instructor: ['Profile', 'Notifications', 'Payout'],
  student: ['Profile', 'Password', 'Google account', 'Notifications']
};

/* Accent picker on admin Appearance — every option is a green. */
const ACCENT_SWATCHES = ['#10B981', '#059669', '#34D399', '#0EA5A4', '#134E3A'];

/* --------------------------------------------------------------------------
   Toast copy — exact wording from the design, keyed by action
   -------------------------------------------------------------------------- */

const TOASTS = {
  enroll: 'Enrolled in Python Competency Program',
  save: 'Changes saved',
  message: 'Message sent',
  download: 'Certificate PDF downloading',
  share: 'Share link copied',
  review: 'Course opened for review',
  resetPw: 'Password reset email sent',
  invite: 'Invitation sent',
  publish: 'Course submitted for review',
  grade: 'Grade saved',
  userCreated: 'User created',
  inviteEmail: 'Invitation email sent'
};

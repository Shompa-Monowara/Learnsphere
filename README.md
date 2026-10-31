# LearnSphere — Learning Management System (LMS)

A full-stack Learning Management System for small academies, teachers and students: course management, quizzes, assignments, progress tracking, certificates and payments in one place.

| | Link |
|---|---|
| **Live Demo (Frontend)** | https://learnsphere-murex.vercel.app |
| **Backend API (Live)** | https://learnsphere-server-gmt3.onrender.com/api |
| **Frontend Repository** | https://github.com/Shompa-Monowara/Learnsphere |
| **Backend Repository** | https://github.com/Shompa-Monowara/Learnsphere-server |
| **Author GitHub** | https://github.com/Shompa-Monowara |

> **Note:** The backend is hosted on Render's free plan. The first request after a period of inactivity can take about 50 seconds. Please wait and retry.

---

## Table of Contents

1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Run Locally](#run-locally)
6. [Environment Variables](#environment-variables)
7. [Demo Accounts](#demo-accounts)
8. [API Documentation](#api-documentation)
9. [Available Scripts](#available-scripts)
10. [Deployment](#deployment)
11. [Author](#author)

---

## Overview

LearnSphere lets teachers create and sell courses, and lets students enroll, learn, take quizzes, submit assignments and earn certificates. It has three role-based dashboards: **Admin**, **Teacher** and **Student**.

## Key Features

**Courses**
- Sections and lessons (video and PDF)
- Course workflow: Draft → Pending → Published / Rejected / Unpublished (admin approval)
- Categories, instructors, public course pages, wishlist, reviews and ratings

**Quizzes and Assignments**
- MCQ (auto-graded) and written questions (teacher-graded)
- Assignments with deadlines, file/text submissions, resubmission and late-submission settings
- Teacher grading and student result tracking

**Progress and Certificates**
- Lesson completion and course progress tracking
- Downloadable PDF certificates with public verification

**Dashboards**
- **Admin:** manage users, categories, courses (approve/reject), payments, reports, site settings, contact messages, newsletter subscribers
- **Teacher:** manage courses, curriculum, quizzes, assignments, students, reviews, earnings and payouts
- **Student:** enrolled courses, progress, quizzes, assignments, certificates, wishlist, messages

**Platform**
- Email OTP registration and login
- Google and GitHub OAuth
- JWT authentication with role-based access control
- Stripe payments (paid courses and teacher subscriptions, test mode)
- Notifications and student–teacher messaging with file upload (Cloudinary)
- Contact form, newsletter, light/dark theme

## Tech Stack

**Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, shadcn/ui, Radix UI, React Router v7, Axios, Framer Motion

**Backend:** Node.js, Express, TypeScript, MongoDB (Mongoose), Zod, JWT, Helmet, express-rate-limit, Multer

**Services:** MongoDB Atlas, Cloudinary (uploads), Stripe (payments), Brevo / SMTP (emails), Google & GitHub OAuth, PDFKit (certificates)

## Project Structure

```text
Learnsphere/                 # Frontend repo
├── src/
│   ├── components/  features/  layouts/
│   ├── pages/ (public, auth, student, teacher, admin)
│   ├── routes/  services/  stores/  hooks/  lib/
│   ├── App.tsx  main.tsx
├── public/
├── .env.example
└── package.json

Learnsphere-server/          # Backend repo
├── src/
│   ├── config/  controllers/  middlewares/
│   ├── models/  routes/  utils/  validations/
│   ├── app.ts  server.ts  seed.ts
├── .env.example
└── package.json
```

## Run Locally

**Prerequisites:** Node.js 20+, npm, a MongoDB database (local or Atlas). Cloudinary, Stripe, OAuth and email keys are optional unless you want those features.

### 1. Backend

```bash
git clone https://github.com/Shompa-Monowara/Learnsphere-server.git
cd Learnsphere-server
npm install
cp .env.example .env      # then fill in the values (see Environment Variables)
npm run seed              # creates categories + demo accounts
npm run dev               # http://localhost:5000
```

Health check: `http://localhost:5000/api/health`

### 2. Frontend

```bash
git clone https://github.com/Shompa-Monowara/Learnsphere.git
cd Learnsphere
npm install
cp .env.example .env      # set VITE_API_URL=http://localhost:5000/api
npm run dev               # http://localhost:5173
```

> Tip: for the quickest local test, set `REQUIRE_EMAIL_OTP=false` in the backend `.env` so login works without email setup.

## Environment Variables

### Backend (`Learnsphere-server/.env`)

| Variable | Required | Description |
|---|---|---|
| `NODE_ENV` | No | `development` / `production` |
| `PORT` | No | Server port (default `5000`) |
| `MONGO_URI` | **Yes** | MongoDB connection string |
| `JWT_SECRET` | **Yes** | JWT signing secret (min 16 chars) |
| `JWT_EXPIRES_IN` | No | Token lifetime (default `7d`) |
| `OTP_SECRET` | **Yes** | OTP hashing secret (min 16 chars) |
| `CLIENT_URL` | **Yes** | Frontend URL, no trailing slash (used for CORS) |
| `API_URL` | **Yes** | Backend API URL (used for OAuth callbacks) |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | For uploads | Cloudinary credentials |
| `REQUIRE_EMAIL_OTP` | No | `true` to require email OTP on register/login |
| `BREVO_API_KEY` | For email | Brevo transactional email API key |
| `MAIL_FROM` | For email | Verified sender address |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | Optional | SMTP fallback (dev only) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Optional | Google OAuth |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | Optional | GitHub OAuth |
| `STRIPE_SECRET_KEY` | For payments | Stripe secret key (test mode) |
| `STRIPE_WEBHOOK_SECRET` | Optional | Stripe webhook signing secret |
| `SEED_DEMO` | No | `true` to seed demo data in production |
| `DEMO_SKIP_OTP` | No | `true` lets the seeded demo accounts log in without OTP |

Example:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret_min_16_chars
OTP_SECRET=another_long_random_secret_min_16_chars
CLIENT_URL=http://localhost:5173
API_URL=http://localhost:5000/api
REQUIRE_EMAIL_OTP=false
```

### Frontend (`Learnsphere/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL, e.g. `http://localhost:5000/api` |

## Demo Accounts

Created by `npm run seed`.

| Role | Email | Password |
|---|---|---|
| Admin | admin@learnsphere.com | Admin@123 |
| Teacher | teacher@learnsphere.com | Teacher@123 |
| Student | student@learnsphere.com | Student@123 |

> Demonstration credentials only. If email OTP is enabled, these accounts need `DEMO_SKIP_OTP=true` on the server to log in without an OTP.

## API Documentation

**Base URL:** `https://learnsphere-server-gmt3.onrender.com/api` (local: `http://localhost:5000/api`)

**Authentication:** send the JWT in the header `Authorization: Bearer <token>`.

**Access legend:** 🌐 Public · 🔐 Any logged-in user · 🎓 Student · 👩‍🏫 Teacher · 🛡️ Admin

### Health
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/health` | 🌐 | Server health check |

### Authentication
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register/request-otp` | 🌐 | Start registration, send OTP |
| POST | `/auth/register/resend-otp` | 🌐 | Resend registration OTP |
| POST | `/auth/register/complete` | 🌐 | Verify OTP and create account |
| POST | `/auth/login` | 🌐 | Login (sends OTP if enabled) |
| POST | `/auth/login/resend-otp` | 🌐 | Resend login OTP |
| POST | `/auth/login/verify-otp` | 🌐 | Verify login OTP, returns token |
| POST | `/auth/forgot-password` | 🌐 | Send password reset email |
| POST | `/auth/reset-password/:token` | 🌐 | Reset password |
| GET | `/auth/me` | 🔐 | Get current user |
| PUT | `/auth/me` | 🔐 | Update profile |
| PUT | `/auth/password` | 🔐 | Change password |
| GET | `/auth/google` · `/auth/google/callback` | 🌐 | Google OAuth |
| GET | `/auth/github` · `/auth/github/callback` | 🌐 | GitHub OAuth |
| POST | `/auth/oauth/exchange` | 🌐 | Exchange OAuth code for token |

### Public
| Method | Endpoint | Description |
|---|---|---|
| GET | `/categories` | List categories |
| GET | `/instructors` · `/instructors/:id` | List / view instructors |
| GET | `/courses` | List published courses |
| GET | `/courses/:id` | Course details |
| GET | `/courses/:courseId/reviews` | Course reviews |
| GET | `/pricing` · `/features` · `/about` | Site content |
| GET | `/stats/public` | Public platform stats |
| GET | `/site-settings/public` | Public appearance settings |
| GET | `/contact/info` | Contact information |
| POST | `/contact` | Send contact message |
| POST | `/newsletter/subscribe` | Subscribe to newsletter |
| POST | `/newsletter/unsubscribe/:token` | Unsubscribe |
| GET | `/certificates/verify/:verificationId` | Verify a certificate |

### Courses and Reviews
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/courses/mine/list` | 👩‍🏫 | Teacher's own courses |
| POST | `/courses` | 👩‍🏫 | Create course |
| PUT | `/courses/:id` | 👩‍🏫 | Update course |
| PUT | `/courses/:id/curriculum` | 👩‍🏫 | Update sections and lessons |
| PATCH | `/courses/:id/submit` | 👩‍🏫 | Submit for admin review |
| DELETE | `/courses/:id` | 👩‍🏫 | Delete course |
| POST | `/courses/:courseId/reviews` | 🎓 | Add or update review |
| GET | `/reviews/mine` | 👩‍🏫 | Reviews on my courses |
| PATCH | `/reviews/:id/reply` | 👩‍🏫 | Reply to a review |
| POST | `/reviews/:id/helpful` | 🎓 | Toggle "helpful" |

### Enrollments and Wishlist
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/enrollments/:courseId` | 🎓 | Enroll in a course |
| GET | `/enrollments/mine` | 🔐 | My enrollments |
| GET | `/enrollments/:courseId/learn` | 🔐 | Course learning data |
| PATCH | `/enrollments/:courseId/lessons/:lessonId/complete` | 🎓 | Mark lesson complete |
| GET | `/enrollments/students` | 👩‍🏫 | All my students |
| GET | `/enrollments/:courseId/students` | 👩‍🏫 | Students of a course |
| GET | `/wishlist` | 🔐 | View wishlist |
| POST | `/wishlist/:courseId` | 🔐 | Add to wishlist |
| DELETE | `/wishlist/:courseId` | 🔐 | Remove from wishlist |

### Quizzes
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/courses/:courseId/quizzes` | 🔐 | Quizzes of a course |
| POST | `/courses/:courseId/quizzes` | 👩‍🏫 | Create quiz |
| GET | `/quizzes/:id` | 🔐 | Quiz details |
| PUT | `/quizzes/:id` | 👩‍🏫 | Update quiz |
| DELETE | `/quizzes/:id` | 👩‍🏫 | Delete quiz |
| POST | `/quizzes/:id/start` | 🎓 | Start an attempt |
| POST | `/quizzes/:id/attempt` | 🎓 | Submit attempt |
| GET | `/quizzes/:id/attempts/me` | 🎓 | My attempts for a quiz |
| GET | `/quizzes/:id/attempts` | 👩‍🏫 | All attempts for a quiz |
| PATCH | `/quizzes/attempts/:attemptId/grade` | 👩‍🏫 | Grade written answers |
| GET | `/quizzes/mine` · `/quizzes/attempts/mine` | 🎓 | My quizzes / all my attempts |

### Assignments
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/assignments/mine` | 🎓 | My assignments |
| GET | `/courses/:courseId/assignments` | 🔐 | Assignments of a course |
| GET | `/assignments/:id` | 🔐 | Assignment details |
| POST | `/assignments/:id/submit` | 🎓 | Submit (multipart, field `file`) |
| GET / POST | `/teacher/assignments` | 👩‍🏫 | List / create assignments |
| PUT / DELETE | `/teacher/assignments/:id` | 👩‍🏫 | Update / delete assignment |
| GET | `/teacher/submissions` | 👩‍🏫 | List submissions |
| PATCH | `/teacher/submissions/:id/grade` | 👩‍🏫 | Grade a submission |

### Payments and Subscriptions (Stripe)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/payments/checkout/:courseId` | 🎓 | Create course checkout session |
| POST | `/payments/confirm` | 🎓 | Confirm payment and enroll |
| POST | `/subscriptions/checkout` | 👩‍🏫 | Teacher plan checkout |
| POST | `/subscriptions/confirm` | 👩‍🏫 | Confirm subscription |
| GET | `/subscriptions/me` | 👩‍🏫 | My subscription |
| POST | `/subscriptions/cancel` | 👩‍🏫 | Cancel subscription |

### Certificates, Notifications, Messages, Upload
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/certificates/mine` | 🎓 | My certificates |
| GET | `/certificates/:id/download` | 🔐 | Download certificate PDF |
| GET | `/notifications` | 🔐 | List notifications |
| PATCH | `/notifications/read-all` · `/notifications/:id/read` | 🔐 | Mark as read |
| GET | `/messages/conversations` | 🔐 | Conversation list |
| GET | `/messages/:userId` | 🔐 | Message thread |
| POST | `/messages/:userId` | 🔐 | Send message (optional file) |
| POST | `/upload` | 🔐 | Upload a file to Cloudinary |

### Dashboards
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/dashboard/student` · `/dashboard/student/progress` | 🎓 | Student dashboard and progress |
| GET | `/dashboard/teacher` · `/dashboard/teacher/earnings` | 👩‍🏫 | Teacher dashboard and earnings |
| GET | `/teacher/courses` · `/teacher/students` · `/teacher/reviews` · `/teacher/earnings` | 👩‍🏫 | Teacher portal pages |
| POST | `/teacher/payouts` | 👩‍🏫 | Request payout |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/stats` | Platform statistics |
| GET | `/admin/users` | List users |
| PATCH | `/admin/users/:id/block` | Block / unblock user |
| PATCH | `/admin/users/:id/role` | Change user role |
| DELETE | `/admin/users/:id` | Delete user |
| GET | `/admin/courses` | List all courses |
| PATCH | `/admin/courses/:id/moderate` | Approve / reject course |
| GET / POST | `/categories` · `/admin/categories` | List / create categories |
| PUT / DELETE | `/categories/:id` | Update / delete category |
| GET | `/admin/transactions` · `/admin/payments` · `/admin/reports` | Finance and reports |
| GET / PUT | `/admin/site-settings` | View / update site settings |
| GET | `/admin/newsletter/subscribers` | Newsletter subscribers |
| GET | `/admin/contact-messages` | Contact messages |
| PATCH | `/admin/contact-messages/:id/status` | Update message status |
| DELETE | `/admin/contact-messages/:id` | Delete message |
| GET / POST | `/admin/mentors` | List / create mentors |
| PUT / DELETE | `/admin/mentors/:id` | Update / delete mentor |
| PATCH | `/admin/mentors/:id/publish` | Publish / unpublish mentor |

### Example

```http
POST /api/auth/login
Content-Type: application/json

{ "email": "student@learnsphere.com", "password": "Student@123" }
```

Error responses use the shape `{ "message": "Error description" }`.

## Available Scripts

**Backend**

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with auto-reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled server |
| `npm run seed` | Seed categories and demo data |
| `npm run seed:instructors` | Seed instructors |
| `npm run seed:students` | Seed students |
| `npm run typecheck` | TypeScript type check |

**Frontend**

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## Deployment

| Part | Platform |
|---|---|
| Frontend | Vercel (SPA rewrites in `vercel.json`) |
| Backend | Render (build: `npm install && npm run build`, start: `npm start`) |
| Database | MongoDB Atlas |
| Files | Cloudinary |

Make sure `CLIENT_URL` on the backend equals the deployed frontend URL, and `VITE_API_URL` on the frontend points to the deployed backend `/api`.

## Author

**Sampa Monowara**
Frontend / MERN Stack Developer

- GitHub: https://github.com/Shompa-Monowara
- LinkedIn: https://www.linkedin.com/in/shompa-monowara

---

**LearnSphere — Making Online Learning Simple, Accessible, and Organized.**
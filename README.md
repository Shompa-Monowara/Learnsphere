# LearnSphere — Learning Management System (LMS)

A modern and user-friendly Learning Management System designed for small academies, teachers, and students to simplify online learning, course management, assessments, and student progress tracking.

**Live Demo:** https://learnsphere-murex.vercel.app

**Backend API:** https://learnsphere-server-gmt3.onrender.com

> **Note:** The backend is hosted on Render's free plan. The first request after a period of inactivity may take approximately 50 seconds to respond.

---

## Overview

LearnSphere is a full-stack Learning Management System (LMS) that provides a centralized platform for teachers to create and manage courses, share learning materials, conduct quizzes, assign tasks, and evaluate student performance.

Students can explore courses, enroll in learning programs, access video and PDF lessons, participate in quizzes, submit assignments, monitor their learning progress, and earn downloadable completion certificates.

The platform includes separate role-based dashboards for Admins, Teachers, and Students, ensuring a smooth and organized learning experience.

## Problem Statement

Small academies and independent teachers often lack an affordable and simple platform to distribute educational materials, manage assignments, evaluate students, and track learning progress.

LearnSphere addresses these challenges by providing an integrated learning environment where teachers can manage educational content and students can access everything they need in one place.

## Key Features

### 1. Course Management
- Create and manage courses with structured sections.
- Add video and PDF lessons.
- Organize course content into a structured curriculum.
- Manage course publishing workflows.
- Submit courses for admin approval.
- Support course statuses: Draft, Pending, Published, Rejected, and Unpublished.

### 2. Quiz and Assessment System
- Create quizzes with multiple questions.
- Support MCQ and written questions.
- Automatically evaluate MCQ answers.
- Allow teachers to manually evaluate written answers.
- Track quiz attempts and results.

### 3. Assignment Management
- Teachers can create assignments with instructions and deadlines.
- Support file-based, text-based, and combined submissions.
- Students can submit their completed assignments.
- Teachers can review and grade submissions.
- Support assignment resubmission and late submission settings.

### 4. Student Progress Tracking
- Track course enrollment and lesson completion.
- Monitor learning progress.
- Display course completion status.
- Track quiz performance and assignment results.
- Generate downloadable PDF completion certificates.

### 5. Role-Based Dashboards

**Admin Dashboard**
- Manage students and teachers.
- Manage course categories and instructors.
- Review, approve, or reject submitted courses.
- Monitor payments and platform reports.
- Manage platform settings.

**Teacher Dashboard**
- Create and manage courses.
- Build course sections and lessons.
- Create quizzes and assignments.
- Review and grade student submissions.
- Monitor enrolled students.
- Manage course reviews and earnings.

**Student Dashboard**
- Explore and enroll in courses.
- Access video and PDF learning materials.
- Take quizzes and view results.
- Submit assignments and track grades.
- Monitor learning progress.
- Download completion certificates.
- Manage wishlist and messages.

## Additional Features

- Email OTP-based registration and login.
- Google and GitHub OAuth authentication.
- JWT-based authentication and protected routes.
- Stripe integration for paid course enrollment and teacher subscriptions.
- Course reviews and ratings.
- Wishlist functionality.
- Notifications and student-teacher messaging.
- Teacher earnings and payout management.
- Admin payment management and reports.
- Public course and instructor pages.
- Pricing and blog pages.
- Contact form.
- Newsletter subscription and unsubscribe.
- Public certificate verification.
- Light and dark theme support.

## Technology Stack

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui
- Radix UI
- React Router v7
- Axios
- Framer Motion

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- Zod
- JWT

### Third-Party Services
- **Cloudinary:** Image and file uploads.
- **Stripe:** Payment processing.
- **Brevo / SMTP:** Transactional emails and OTP delivery.
- **Google OAuth:** Google authentication.
- **GitHub OAuth:** GitHub authentication.
- **PDFKit:** PDF certificate generation.

## Project Structure

```text
LearnSphere/
│
├── learnsphere/                  # Frontend
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── features/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── public/
│   │   │   ├── auth/
│   │   │   ├── student/
│   │   │   ├── teacher/
│   │   │   └── admin/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── stores/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── .env.example
│   └── package.json
│
└── learnsphere-server/           # Backend
    ├── src/
    │   ├── config/
    │   ├── controllers/
    │   ├── middlewares/
    │   ├── models/
    │   ├── routes/
    │   ├── utils/
    │   ├── validations/
    │   ├── app.ts
    │   └── seed.ts
    ├── .env.example
    └── package.json
```

## Getting Started

Follow these instructions to run LearnSphere locally.

### Prerequisites

- Node.js 20 or later
- npm
- MongoDB (Local or MongoDB Atlas)
- Cloudinary account
- Stripe account (for payment functionality)

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
cd LearnSphere
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd learnsphere-server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Configure your environment variables.

Run the database seed:

```bash
npm run seed
```

Start the development server:

```bash
npm run dev
```

Backend server:

```text
http://localhost:5000
```

### 3. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd learnsphere
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

Configure the API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend application:

```text
http://localhost:5173
```

## Environment Variables

### Backend Environment Variables

Configure the following variables in `learnsphere-server/.env`:

| Variable | Description |
|---|---|
| PORT | Backend server port |
| MONGO_URI | MongoDB connection string |
| JWT_SECRET | JWT signing secret |
| OTP_SECRET | OTP security secret |
| JWT_EXPIRES_IN | JWT expiration duration |
| CLIENT_URL | Frontend application URL |
| API_URL | Backend API URL |
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud name |
| CLOUDINARY_API_KEY | Cloudinary API key |
| CLOUDINARY_API_SECRET | Cloudinary API secret |
| REQUIRE_EMAIL_OTP | Enable or disable email OTP |
| BREVO_API_KEY | Brevo email service API key |
| MAIL_FROM | Sender email address |
| SMTP_HOST | SMTP server host |
| SMTP_PORT | SMTP server port |
| SMTP_USER | SMTP username |
| SMTP_PASS | SMTP password |
| GOOGLE_CLIENT_ID | Google OAuth client ID |
| GOOGLE_CLIENT_SECRET | Google OAuth client secret |
| GITHUB_CLIENT_ID | GitHub OAuth client ID |
| GITHUB_CLIENT_SECRET | GitHub OAuth client secret |
| STRIPE_SECRET_KEY | Stripe secret key |
| SEED_DEMO | Enable demo seed configuration |
| DEMO_SKIP_OTP | Configure demo OTP behavior |

Optional integrations can be configured according to the features you want to enable.

### Frontend Environment Variables

Configure `learnsphere/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Demo Accounts

The following demo accounts are created through the backend seed script.

| Role | Email | Password |
|---|---|---|
| Admin | admin@learnsphere.com | Admin@123 |
| Teacher | teacher@learnsphere.com | Teacher@123 |
| Student | student@learnsphere.com | Student@123 |

> These are demonstration credentials only. Never use demo passwords for production accounts.

## Available Scripts

### Backend

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Compile TypeScript |
| `npm start` | Start production server |
| `npm run seed` | Seed demo data and categories |

### Frontend

| Command | Description |
|---|---|
| `npm run dev` | Start Vite development server |
| `npm run build` | Type-check and build the application |
| `npm run lint` | Run ESLint |

## Deployment

LearnSphere is deployed using the following services:

| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |
| File Storage | Cloudinary |
| Payment Gateway | Stripe |
| Email Service | Brevo / SMTP |

The frontend uses Vercel rewrites to support client-side routing.

## Future Improvements

- Live interactive classes.
- Advanced learning analytics.
- Course recommendation system.
- More assessment types.
- Improved mobile learning experience.

## Author

**Mst. Sampa Monowara**

Full Stack Developer

- GitHub: [Your GitHub Profile](YOUR_GITHUB_URL)
- LinkedIn: [Your LinkedIn Profile](YOUR_LINKEDIN_URL)

---

**LearnSphere — Making Online Learning Simple, Accessible, and Organized.**
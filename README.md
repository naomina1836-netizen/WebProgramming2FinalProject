# Nayo Jobs

## Job Recruitment & Career Management Platform

---

## Description

**Nayo Jobs** is a full-stack job recruitment platform that connects employers with job seekers in Ethiopia. The platform provides a professional interface designed to make job searching and hiring a premium experience.

Employers can create company profiles, post job vacancies, and manage applicants. Job seekers can search for jobs, upload resumes, apply for positions, and monitor their applications. Administrators oversee the entire platform by managing users, companies, and job listings.

---

## Table of Contents

- [Technology Stack](#technology-stack)
- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Contributors](#contributors)

---

## Technology Stack

### Backend
- **Runtime**: Node.js (v16+)
- **Framework**: Express.js (v4.18.2)
- **Database**: MySQL (v8.0) with mysql2 driver
- **Authentication**: JSON Web Tokens (JWT) with bcrypt hashing
- **File Upload**: Multer
- **Validation**: Custom validation (express-validator ready)
- **Environment**: dotenv

### Frontend
- **Library**: React (v18)
- **Build Tool**: Vite
- **Routing**: React Router DOM (v6)
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Styling**: Custom CSS with Black & Gold theme

### Development Tools
- **Version Control**: Git & GitHub
- **Code Editor**: VS Code
- **API Testing**: Thunder Client
- **Database Management**: phpMyAdmin

---

## Features

### Core Features

#### Authentication & Authorization
- User registration with role selection (Job Seeker, Employer)
- Secure login with JWT token generation
- Password hashing with bcrypt
- Role-based access control (Admin, Employer, Job Seeker)
- Protected routes and API endpoints

#### Job Seeker Features
- Browse and search jobs
- View detailed job descriptions
- Upload and manage resumes (PDF, DOC, DOCX)
- Apply for jobs with one click
- Track application status (Pending, Reviewed, Accepted, Rejected)
- View application history
- Edit profile and manage skills

#### Employer Features
- Create and manage company profile
- Post new job vacancies
- Edit and delete job postings
- View applicants for each job
- Update application statuses
- Company dashboard with statistics

#### Admin Features
- Admin dashboard with platform statistics
- View all users, companies, and jobs
- Delete users and jobs
- Platform oversight and management

#### Design & UX
- Professional black and gold theme
- Fully responsive design (mobile, tablet, desktop)
- Role-specific dashboards
- Toast notifications for user feedback

### Extra Features (Beyond Course Scope)
- File upload with Multer (resume management)
- Role-specific dashboards with statistics
- Professional custom theming
- Toast notifications
- Search functionality
- Duplicate application prevention
- One company per employer constraint
- Automatic form clearing after submission

---

## Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **MySQL** (XAMPP recommended for Windows)
- **npm** or **yarn** package manager
- **Git** (for cloning)

### Step 1: Clone the Repository
https://github.com/naomina1836-netizen/WebProgramming2FinalProject

### Step 2: Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your database credentials
# Open .env and modify:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=nayo_jobs

# Start the backend server
npm run dev
```

The backend server will start at `http://localhost:5000`.

### Step 3: Frontend Setup

```bash
# Navigate to client directory (in a new terminal)
cd client

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

The frontend will start at `http://localhost:5173`.

### Step 4: Database Setup

1. Open phpMyAdmin or MySQL command line
2. Create a new database called `nayo_jobs`
3. Import the schema from `database/schema.sql`:

```bash
mysql -u root -p nayo_jobs < database/schema.sql
```

Or manually run the SQL commands in `database/schema.sql`.

### Step 5: Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=nayo_jobs

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

### Step 6: Test the Setup

1. Backend should show: `Server running on port 5000`
2. Frontend should open in your browser
3. Visit `http://localhost:5173` to see the application
4. Test registration and login

---

## Database Schema

### Tables

#### Users Table
Stores all user accounts with role-based access.

| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | User ID (auto-increment) |
| name | VARCHAR(255) | Full name |
| email | VARCHAR(255) | Email address (unique) |
| password | VARCHAR(255) | Hashed password |
| role | ENUM | job_seeker, employer, admin |
| phone | VARCHAR(20) | Phone number |
| location | VARCHAR(255) | User location |
| bio | TEXT | User biography |
| skills | TEXT | Skills (comma-separated) |
| resume_url | VARCHAR(255) | Resume file path |
| created_at | TIMESTAMP | Account creation date |
| updated_at | TIMESTAMP | Last update date |

#### Profiles Table
Extended job seeker profiles with detailed information.

| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Profile ID (auto-increment) |
| user_id | INT (FK) | References users.id |
| headline | VARCHAR(255) | Professional headline |
| bio | TEXT | Detailed biography |
| skills | TEXT | Detailed skills |
| experience | TEXT | Work experience |
| education | TEXT | Education history |
| portfolio_url | VARCHAR(500) | Portfolio website |
| linkedin_url | VARCHAR(500) | LinkedIn profile |
| github_url | VARCHAR(500) | GitHub profile |
| phone | VARCHAR(20) | Contact phone |
| location | VARCHAR(255) | Location |
| date_of_birth | DATE | Date of birth |
| gender | ENUM | male, female, other, prefer_not_to_say |
| created_at | TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | Last update date |

#### Company Profiles Table
Enhanced employer company profiles.

| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Company profile ID |
| user_id | INT (FK) | References users.id |
| company_name | VARCHAR(255) | Company name |
| company_description | TEXT | Company description |
| company_website | VARCHAR(500) | Company website |
| company_logo | VARCHAR(500) | Logo URL/path |
| company_size | ENUM | 1-10, 11-50, 51-200, 201-500, 501-1000, 1000+ |
| industry | VARCHAR(100) | Industry type |
| founded_year | YEAR | Year founded |
| headquarters | VARCHAR(255) | HQ location |
| phone | VARCHAR(20) | Contact phone |
| created_at | TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | Last update date |

#### Jobs Table
Stores job postings from employers.

| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Job ID (auto-increment) |
| employer_id | INT (FK) | References users.id |
| title | VARCHAR(255) | Job title |
| description | TEXT | Job description |
| company | VARCHAR(255) | Company name |
| location | VARCHAR(255) | Job location |
| salary | VARCHAR(100) | Salary information |
| job_type | ENUM | full-time, part-time, contract, internship, remote |
| category | VARCHAR(100) | Job category |
| experience_level | VARCHAR(50) | Required experience |
| requirements | TEXT | Job requirements |
| responsibilities | TEXT | Job responsibilities |
| status | ENUM | active, closed, draft |
| deadline | DATE | Application deadline |
| created_at | TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | Last update date |

#### Applications Table
Tracks job applications from job seekers.

| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Application ID |
| job_id | INT (FK) | References jobs.id |
| applicant_id | INT (FK) | References users.id |
| cover_letter | TEXT | Cover letter |
| resume_url | VARCHAR(500) | Resume file path |
| status | ENUM | pending, reviewed, shortlisted, interviewed, offered, rejected, withdrawn |
| applied_at | TIMESTAMP | Application date |
| updated_at | TIMESTAMP | Last update date |
| notes | TEXT | Internal notes |

#### Saved Jobs Table
Allows users to bookmark jobs for later.

| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Saved job ID |
| user_id | INT (FK) | References users.id |
| job_id | INT (FK) | References jobs.id |
| saved_at | TIMESTAMP | Save date |
| notes | TEXT | Personal notes |

#### Messages Table
Direct messaging between users.

| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Message ID |
| sender_id | INT (FK) | References users.id |
| receiver_id | INT (FK) | References users.id |
| job_id | INT (FK) | References jobs.id (optional) |
| subject | VARCHAR(255) | Message subject |
| message | TEXT | Message content |
| is_read | BOOLEAN | Read status |
| read_at | TIMESTAMP | Read timestamp |
| created_at | TIMESTAMP | Creation date |

#### Notifications Table
In-app notification system.

| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Notification ID |
| user_id | INT (FK) | References users.id |
| type | ENUM | application, interview, offer, message, system |
| title | VARCHAR(255) | Notification title |
| message | TEXT | Notification message |
| link | VARCHAR(500) | Related link |
| is_read | BOOLEAN | Read status |
| read_at | TIMESTAMP | Read timestamp |
| created_at | TIMESTAMP | Creation date |

### Views

| View Name | Description |
|-----------|-------------|
| v_job_details | Job details with employer info and application counts |
| v_application_details | Full application details with user and job info |
| v_employer_dashboard | Employer dashboard statistics |

### Stored Procedures

| Procedure | Description |
|-----------|-------------|
| sp_get_employer_jobs | Get all jobs for an employer with application counts |
| sp_get_job_applications | Get all applications for a specific job |
| sp_get_employer_stats | Get employer statistics dashboard |
| sp_get_applicant_applications | Get all applications for a job seeker |

### Triggers

| Trigger | Description |
|---------|-------------|
| trg_create_profile_on_signup | Automatically creates profile/company profile on user signup |
| trg_check_company_profile | Prevents duplicate company profiles |
| trg_check_duplicate_application | Prevents duplicate job applications |
| trg_application_notification | Creates notification when a new application is submitted |

### Indexes

| Table | Indexes |
|-------|---------|
| users | email, role |
| profiles | user_id |
| company_profiles | user_id, company_name |
| jobs | employer_id, status, job_type, category, deadline, created_at |
| applications | job_id, applicant_id, status, applied_at |
| saved_jobs | user_id, job_id |
| messages | sender_id, receiver_id, job_id, created_at, is_read |
| notifications | user_id, is_read, created_at, type |

---

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |

### Users
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/users/me` | Get current user | JWT |
| PUT | `/api/users/me` | Update user profile | JWT |

### Companies
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/companies` | Get all companies | Public |
| GET | `/api/companies/my` | Get employer's company | JWT (Employer) |
| POST | `/api/companies` | Create company | JWT (Employer) |
| GET | `/api/companies/:id` | Get company by ID | Public |
| PUT | `/api/companies/:id` | Update company | JWT (Employer) |
| DELETE | `/api/companies/:id` | Delete company | JWT (Employer) |

### Jobs
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/jobs` | Get all jobs | Public |
| GET | `/api/jobs/search` | Search jobs | Public |
| GET | `/api/jobs/:id` | Get job by ID | Public |
| POST | `/api/jobs` | Create job | JWT (Employer) |
| GET | `/api/jobs/mine` | Get employer's jobs | JWT (Employer) |
| PUT | `/api/jobs/:id` | Update job | JWT (Employer) |
| DELETE | `/api/jobs/:id` | Delete job | JWT (Employer) |

### Applications
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/applications/:jobId` | Apply for job | JWT (Job Seeker) |
| GET | `/api/applications/my` | Get my applications | JWT (Job Seeker) |
| GET | `/api/applications/applicants` | Get applicants | JWT (Employer) |
| PATCH | `/api/applications/:id/status` | Update application status | JWT (Employer) |

### Upload
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/upload/resume` | Upload resume | JWT |
| GET | `/api/upload/resume/:filename` | Get resume | JWT |
| DELETE | `/api/upload/resume` | Delete resume | JWT |

### Health
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/health` | Health check | Public |

---

## Project Structure

```
nayo-jobs/
├── .gitignore                 # Git ignore file
├── README.md                  # Project documentation
├── database/
│   └── schema.sql             # Database DDL script
├── server/                    # Backend
│   ├── config/
│   │   └── db.js              # Database connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── companyController.js
│   │   ├── jobController.js
│   │   ├── applicationController.js
│   │   └── uploadController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   ├── models/                # Database models
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── companyRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── applicationRoutes.js
│   │   └── uploadRoutes.js
│   ├── uploads/               # Uploaded files
│   │   └── resumes/
│   ├── .env                   # Environment variables
│   ├── .env.example           # Example environment
│   ├── package.json           # Backend dependencies
│   └── server.js              # Backend entry point
├── client/                    # Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Footer.jsx
│   │   │   ├── JobCard.jsx
│   │   │   ├── JobForm.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── ResumeUpload.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   └── StatusBadge.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Applicants.jsx
│   │   │   ├── CreateCompany.jsx
│   │   │   ├── CreateJob.jsx
│   │   │   ├── EditJob.jsx
│   │   │   ├── EmployerDashboard.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── JobDetails.jsx
│   │   │   ├── Jobs.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Register.jsx
│   │   │   └── SeekerDashboard.jsx
│   │   ├── services/
│   │   │   └── api.js        # Axios configuration
│   │   ├── styles/
│   │   │   └── global.css     # Global styles
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # App entry point
│   ├── package.json           # Frontend dependencies
│   └── vite.config.js         # Vite configuration
└── package.json               # Root package.json
```


## Contributors

- **Naomi Zenebe(032/BSC-B6/2023) Section B**
```

<p align="center">
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Express.js-5.x-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
</p>

<h1 align="center">🎓 EduRecruit — Campus Placement Portal</h1>

<p align="center">
  <strong>A modern, full-stack web application for streamlining campus placements and internships</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-api-documentation">API Docs</a> •
  <a href="#-project-structure">Structure</a>
</p>

---

## 📋 Overview

**EduRecruit** (formerly CIPAT) is a comprehensive campus placement management system designed for educational institutions. It connects students with recruiters while giving administrators (Training & Placement Officers) complete oversight of the placement process.

### 🎯 Problem Statement
Traditional campus placement processes involve:
- Manual coordination between TPO, students, and companies
- Lack of real-time application tracking
- Inefficient eligibility verification
- No centralized data for placement analytics

### 💡 Solution
EduRecruit digitizes the entire workflow with:
- Role-based dashboards for all stakeholders
- Automated eligibility filtering (CGPA, Backlogs, Branch)
- Real-time application status tracking
- Comprehensive analytics for placement insights

---

## ✨ Features

### 👨‍🎓 Student Portal
| Feature | Description |
|---------|-------------|
| 📝 Profile Management | Manage academic details, resume upload |
| 🔍 Job Discovery | Browse and filter eligible job openings |
| 📨 One-Click Apply | Apply to jobs with eligibility auto-check |
| 📊 Application Tracking | Visual progress tracker (Applied → Shortlisted → Interview → Selected) |
| 🔔 Notifications | Real-time status updates |

### 🏢 Recruiter Portal
| Feature | Description |
|---------|-------------|
| 📋 Job Posting | Create detailed job listings with criteria |
| 👥 Applicant Management | View, filter, and manage applicants |
| ✅ Decision Panel | Shortlist, schedule interviews, select/reject |
| 📈 Dashboard Analytics | Track posting performance |

### 🔐 Admin (TPO) Portal
| Feature | Description |
|---------|-------------|
| 🏪 Company Verification | Approve/reject company registrations |
| 📊 System Analytics | Placement rates, trends, KPIs |
| 👁️ Full Visibility | Monitor all jobs and applications |
| 📋 Reports | Exportable placement data |

---

## 🛠️ Tech Stack

### Frontend
```
React 18          →  UI Library with Hooks
Vite 7            →  Build Tool & Dev Server
Tailwind CSS v4   →  Utility-First Styling
Framer Motion     →  Smooth Animations
React Router v6   →  Client-Side Routing
Axios             →  HTTP Client
React Hot Toast   →  Toast Notifications
React Icons       →  Icon Library
```

### Backend
```
Node.js 18+       →  JavaScript Runtime
Express.js 5      →  Web Framework
MongoDB           →  NoSQL Database
Mongoose          →  ODM Library
JWT               →  Authentication
bcrypt            →  Password Hashing
```

### Architecture
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React SPA     │────▶│  Express API    │────▶│    MongoDB      │
│   (Frontend)    │◀────│   (Backend)     │◀────│   (Database)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
     Port 5173              Port 5000            Atlas / Local
```

---

## 📸 Screenshots

<details>
<summary><b>🖼️ Click to expand screenshots</b></summary>

### Landing Page
> Modern landing page with feature highlights and call-to-action

### Student Dashboard
> Clean dashboard with application stats and job recommendations

### Recruiter Dashboard  
> Comprehensive view of job postings and applicant pipeline

### Admin Dashboard
> System-wide analytics with placement KPIs

### Job Application Flow
> Step-by-step visual progress tracker

</details>

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **MongoDB** (Local or [Atlas](https://www.mongodb.com/atlas))
- **Git** ([Download](https://git-scm.com/))

### 1️⃣ Clone Repository
```bash
git clone https://github.com/IleshDevX/edurecruit.git
cd edurecruit
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install

# Create environment file
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Seed demo data
node seed.js

# Start server
npm run dev
```

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4️⃣ Access Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api

---

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin (TPO)** | `admin@cipat.com` | `password123` |
| **Student** | `aarav@student.com` | `password123` |
| **Recruiter** | `hr@techcorp.com` | `password123` |

<details>
<summary><b>📋 All Demo Accounts</b></summary>

### Students
| Name | Email | Branch | CGPA |
|------|-------|--------|------|
| Aarav Sharma | aarav@student.com | Computer Science | 8.75 |
| Priya Patel | priya@student.com | Information Technology | 9.10 |
| Rohan Mehta | rohan@student.com | Electronics | 7.20 |
| Sneha Kulkarni | sneha@student.com | Computer Science | 8.50 |
| Vikram Singh | vikram@student.com | Mechanical | 6.80 |

### Companies
| Company | Email | Status |
|---------|-------|--------|
| TechCorp Solutions | hr@techcorp.com | ✅ Approved |
| InnovaTech Systems | recruit@innovatech.com | ✅ Approved |
| DataWave Analytics | talent@datawave.com | ⏳ Pending |

</details>

---

## 📁 Project Structure

```
edurecruit/
├── 📂 backend/
│   ├── 📂 controllers/      # Route handlers
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   ├── companyController.js
│   │   └── adminController.js
│   ├── 📂 models/           # Mongoose schemas
│   │   ├── User.js
│   │   ├── Student.js
│   │   ├── Company.js
│   │   ├── Job.js
│   │   ├── Application.js
│   │   └── Notification.js
│   ├── 📂 routes/           # API routes
│   ├── 📂 middleware/       # Auth middleware
│   ├── server.js           # Entry point
│   └── seed.js             # Database seeder
│
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 components/   # Reusable UI components
│   │   ├── 📂 pages/        # Page components
│   │   │   ├── 📂 student/
│   │   │   ├── 📂 company/
│   │   │   └── 📂 admin/
│   │   ├── 📂 layouts/      # Layout wrappers
│   │   ├── 📂 context/      # React Context
│   │   └── 📂 services/     # API service
│   └── index.html
│
└── 📄 README.md
```

---

## 📡 API Documentation

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login user |
| `GET` | `/api/auth/me` | Get current user |

### Student Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/student/profile` | Get student profile |
| `PUT` | `/api/student/profile` | Update profile |
| `GET` | `/api/student/jobs` | Get eligible jobs |
| `POST` | `/api/student/apply` | Apply to job |
| `GET` | `/api/student/applications` | Get my applications |

### Company Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/company/stats` | Dashboard stats |
| `GET` | `/api/company/jobs` | Get posted jobs |
| `POST` | `/api/company/jobs` | Create job posting |
| `PUT` | `/api/company/applications/:id` | Update application status |

### Admin Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/stats` | System statistics |
| `GET` | `/api/admin/companies` | All companies |
| `PUT` | `/api/admin/companies/:id/approve` | Approve company |
| `GET` | `/api/admin/jobs` | All job postings |
| `GET` | `/api/admin/applications` | All applications |

---

## 🔄 Application Status Flow

```
┌─────────┐    ┌─────────────┐    ┌───────────┐    ┌──────────┐
│ Applied │───▶│ Shortlisted │───▶│ Interview │───▶│ Selected │
└─────────┘    └─────────────┘    └───────────┘    └──────────┘
     │              │                   │
     │              │                   │
     ▼              ▼                   ▼
┌──────────────────────────────────────────────────────────────┐
│                        Rejected                               │
└──────────────────────────────────────────────────────────────┘
```

---

## 🎨 Design System

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#0F766E` | Main actions, links |
| Sidebar | `#0F172A` | Navigation background |
| Success | `#10B981` | Positive states |
| Warning | `#F59E0B` | Pending states |
| Danger | `#EF4444` | Destructive actions |

### Typography
- **Font:** Inter (Google Fonts)
- **Headings:** Bold, tracking-tight
- **Body:** Regular, optimized line-height

---

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

---

## 📦 Deployment

### 🚀 Quick Deploy to Render (Recommended)

#### Option 1: One-Click Deploy (Using render.yaml)
1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Connect to Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will auto-detect `render.yaml` and create both services

3. **Configure Environment Variables**
   - **Backend Service** → Environment:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: (Auto-generated or set your own)
   - **Frontend Service** → Environment:
     - `VITE_API_URL`: Your backend URL + `/api` (e.g., `https://edurecruit-backend.onrender.com/api`)
     - `VITE_BACKEND_URL`: Your backend URL (e.g., `https://edurecruit-backend.onrender.com`)

#### Option 2: Manual Deploy

**Backend Deployment:**
1. New Web Service → Connect Repository
2. **Settings:**
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Environment Variables:**
     ```
     MONGODB_URI=mongodb+srv://...
     JWT_SECRET=your_super_secret_jwt_key
     PORT=5000
     NODE_VERSION=18.18.0
     ```
3. Deploy!

**Frontend Deployment:**
1. New Static Site → Connect Repository
2. **Settings:**
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Publish Directory:** `frontend/dist`
   - **Environment Variables:**
     ```
     VITE_API_URL=https://your-backend.onrender.com/api
     VITE_BACKEND_URL=https://your-backend.onrender.com
     ```
3. Deploy!

### 🔧 MongoDB Atlas Setup
1. Create free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. **Security:**
   - Database Access → Add user (save credentials)
   - Network Access → Add `0.0.0.0/0` (allow all IPs)
3. Connect → Get connection string → Replace `<password>` and `<dbname>`

### 🌐 Alternative Hosting Options

#### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder
```
**Environment Variables:**
- `VITE_API_URL`: Your backend API URL + `/api`
- `VITE_BACKEND_URL`: Your backend URL

#### Backend (Railway/Heroku)
```bash
# Set environment variables:
# - MONGODB_URI
# - JWT_SECRET
# - PORT
```

### ⚠️ Important Notes
- **Free Tier Limitations:** Render free tier services spin down after 15 minutes of inactivity (first request may take 30-60 seconds)
- **CORS:** Backend already configured for all origins in development. For production, update CORS in `server.js`:
  ```javascript
  app.use(cors({ origin: 'https://your-frontend-url.com' }));
  ```
- **File Uploads:** Render's free tier doesn't persist uploaded files. Consider using:
  - [Cloudinary](https://cloudinary.com/) for resume uploads
  - AWS S3 / Azure Blob Storage

### 📊 Post-Deployment
1. **Seed Demo Data:** Run seeder on backend
   ```bash
   # In Render Shell or locally connected to production DB
   node seed.js
   ```
2. **Test Login:** Use demo credentials from README
3. **Monitor:** Check Render logs for errors

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**IleshDevX**
- GitHub: [@IleshDevX](https://github.com/IleshDevX)
- LinkedIn: [IleshDevX](https://www.linkedin.com/in/ileshdevx/)
- Email: ileshpatel666@gmail.com

---

## 🙏 Acknowledgments

- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB University](https://university.mongodb.com/)
- [Heroicons](https://heroicons.com/) for iconography

---

<p align="center">
  <strong>⭐ Star this repository if you found it helpful!</strong>
</p>

<p align="center">
  Made with ❤️ for campus placements
</p>

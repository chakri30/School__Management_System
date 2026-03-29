# 🎓 School Management System

A full-stack web application built with the **MERN stack** to streamline school operations — manage classes, students, teachers, attendance, exam results, and notices all in one place.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue?style=for-the-badge&logo=vercel)](https://school-management-system-tlvk.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-green?style=for-the-badge&logo=render)](https://school-management-system-rnf0.onrender.com)

---

## 📸 Screenshots

> Admin Dashboard — colorful stats, quick actions, recent activity
> <img width="2878" height="1447" alt="image" src="https://github.com/user-attachments/assets/75c34233-04f4-4d09-90e8-ab135c9d4e7d" />






---

## ✨ Features

### 👨‍💼 Admin
- Register and manage the school
- Add/view/delete Classes, Subjects, Students, Teachers
- Publish Notices for the school
- View student complaints
- Dashboard with live stats (total students, classes, teachers)

### 👨‍🎓 Student
- Login with Roll Number and Name
- View attendance records per subject
- View exam marks and performance
- Submit complaints
- View school notices

### 👩‍🏫 Teacher
- Login with email and password
- Take student attendance
- Provide exam marks
- View assigned class and subject

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js, Material UI, Redux, Styled Components |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Authentication** | JWT (JSON Web Tokens), Bcrypt |
| **Deployment** | Vercel (Frontend), Render (Backend), MongoDB Atlas (DB) |

---

## 🔐 Security Improvements (over original)

This project includes several backend improvements beyond the original open-source version:

- ✅ **JWT Authentication** — All login endpoints (Admin, Student, Teacher) now return signed JWT tokens
- ✅ **Bcrypt Password Hashing** — Admin passwords are now hashed before saving (original stored plain text)
- ✅ **Input Validation** — All API routes validated using `express-validator`
- ✅ **Rate Limiting** — API protected with `express-rate-limit` (100 requests per 15 min)
- ✅ **Morgan Logging** — HTTP request logging added for debugging and monitoring
- ✅ **Improved CORS** — CORS configured with environment-specific origin
- ✅ **Centralized Error Handling** — Global error handler middleware added
- ✅ **Modular Folder Structure** — Separated `config/db.js` and `middleware/errorHandler.js`

---

## 📁 Project Structure

```
School-Management-System/
│
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── admin-controller.js
│   │   ├── student_controller.js
│   │   ├── teacher-controller.js
│   │   ├── class-controller.js
│   │   ├── subject-controller.js
│   │   ├── notice-controller.js
│   │   └── complain-controller.js
│   ├── middleware/
│   │   └── errorHandler.js     # Global error handler
│   ├── models/
│   │   ├── adminSchema.js
│   │   ├── studentSchema.js
│   │   ├── teacherSchema.js
│   │   ├── sclassSchema.js
│   │   ├── subjectSchema.js
│   │   ├── noticeSchema.js
│   │   └── complainSchema.js
│   ├── routes/
│   │   └── route.js            # All API routes with validation
│   ├── .env                    # Environment variables (not pushed)
│   ├── .gitignore
│   ├── index.js                # Entry point
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   ├── pages/
    │   │   ├── admin/
    │   │   │   ├── classRelated/
    │   │   │   ├── studentRelated/
    │   │   │   ├── teacherRelated/
    │   │   │   ├── subjectRelated/
    │   │   │   ├── noticeRelated/
    │   │   │   ├── AdminDashboard.js
    │   │   │   ├── AdminHomePage.js
    │   │   │   └── SideBar.js
    │   │   ├── student/
    │   │   └── teacher/
    │   ├── redux/
    │   ├── App.js
    │   └── index.js
    ├── .env                    # Environment variables (not pushed)
    ├── .gitignore
    └── package.json
```

---

## ⚙️ Local Setup

### Prerequisites
Make sure you have these installed:
- [Node.js](https://nodejs.org) (v16 or higher)
- [Git](https://git-scm.com)
- A [MongoDB Atlas](https://mongodb.com/atlas) account (free)

---

### Step 1 — Clone the repository
```bash
git clone https://github.com/chakri30/School_Management_System.git
cd School_Management_System
```

### Step 2 — Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:
```env
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/schooldb
SECRET_KEY=your_random_secret_key
PORT=8000
FRONTEND_URL=http://localhost:3000
```

Start the backend:
```bash
npm start
```
Backend runs at: `http://localhost:8000`

---

### Step 3 — Setup Frontend
Open a new terminal:
```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` folder:
```env
REACT_APP_BASE_URL=http://localhost:8000
```

Start the frontend:
```bash
npm start
```
Frontend runs at: `http://localhost:3000`

---

## 🚀 Deployment

### Backend → [Render](https://render.com)
| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Build Command | `npm install` |
| Start Command | `node index.js` |
| Environment Variables | `MONGO_URL`, `SECRET_KEY`, `PORT`, `FRONTEND_URL` |

### Frontend → [Vercel](https://vercel.com)
| Setting | Value |
|---|---|
| Root Directory | `frontend` |
| Framework | Create React App |
| Build Command | `npm run build` |
| Environment Variables | `REACT_APP_BASE_URL` = your Render URL |

---

## 🌐 API Endpoints

### Admin
| Method | Endpoint | Description |
|---|---|---|
| POST | `/AdminReg` | Register admin |
| POST | `/AdminLogin` | Login admin |
| GET | `/Admin/:id` | Get admin details |

### Student
| Method | Endpoint | Description |
|---|---|---|
| POST | `/StudentReg` | Register student |
| POST | `/StudentLogin` | Login student |
| GET | `/Students/:id` | Get all students |
| GET | `/Student/:id` | Get student detail |
| PUT | `/StudentAttendance/:id` | Mark attendance |
| PUT | `/UpdateExamResult/:id` | Update exam marks |

### Teacher
| Method | Endpoint | Description |
|---|---|---|
| POST | `/TeacherReg` | Register teacher |
| POST | `/TeacherLogin` | Login teacher |
| GET | `/Teachers/:id` | Get all teachers |
| GET | `/Teacher/:id` | Get teacher detail |

### Class, Subject, Notice, Complain
All CRUD endpoints available for Classes, Subjects, Notices and Complaints.

---

## 👨‍💻 Author

**Chakri Chindiri**
- GitHub: [@chakri30](https://github.com/chakri30)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---


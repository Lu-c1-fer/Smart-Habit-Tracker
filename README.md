# 🌿 Smart Habit Tracker

A full stack habit tracking application with streak calculations, JWT authentication, and a polished React frontend. Built to demonstrate production-ready development practices including layered architecture, input validation, rate limiting, automated testing, and cloud deployment.

**🔗 Live Demo:** [smart-habit-tracker-rouge.vercel.app](https://smart-habit-tracker-rouge.vercel.app)  
**📡 API:** [smart-habit-tracker-production-d573.up.railway.app](https://smart-habit-tracker-production-d573.up.railway.app)  
**📁 Repo:** [github.com/Lu-c1-fer/Smart-Habit-Tracker](https://github.com/Lu-c1-fer/Smart-Habit-Tracker)

---

## 📸 Screenshots

> - Login page
![login page](image.png)

> - Dashboard with habits

![users dashboard](image-1.png)

> - Add habit modal

![Add new habit](image-2.png)

> - Track progress, streak 

![tracking streak, progress, completion of habit for the day](image-3.png)

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure register & login with token-based auth
- 📋 **Habit Management** — Create, edit, delete habits with title, description, frequency & reminder time
- 🔥 **Streak Tracking** — Automatic streak calculation with grace period logic
- 📊 **Dashboard Analytics** — Progress bar, best streak, daily completion stats
- 🏆 **Streak Badges** — Milestone badges at 3, 7, 14, 30, 100, 365 days
- 🌤️ **Time-aware Greeting** — Dynamic greeting based on time of day
- 🛡️ **Security** — Helmet.js headers, rate limiting, input validation with Zod
- ✅ **Tested** — Unit and integration tests with Jest & Supertest
- ☁️ **Deployed** — Frontend on Vercel, Backend + PostgreSQL on Railway

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React + Vite | UI framework & bundler |
| React Router v6 | Client-side routing |
| Axios | HTTP client with interceptors |
| CSS Modules | Scoped component styling |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js + Express | Server & REST API |
| PostgreSQL | Relational database |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| Zod | Request validation |
| Helmet + Rate Limit | Security hardening |
| Jest + Supertest | Testing |

### Infrastructure
| Service | Purpose |
|---------|---------|
| Railway | Backend + PostgreSQL hosting |
| Vercel | Frontend hosting + CDN |
| GitHub | Version control + CI |

---

## 🏗️ Architecture

The backend follows a strict layered architecture — each layer has one responsibility:

```
Request → Route → Controller → Service → Repository → Database
```

```
backend/src/
├── routes/          # URL definitions only
├── controllers/     # HTTP in/out only (req/res)
├── services/        # Business logic (streak calculation, auth)
├── repositories/    # SQL queries only
├── middlewares/     # Auth guard, validation, error handler
├── validators/      # Zod schemas
├── config/          # DB connection, environment
└── utils/           # JWT helpers
```

```
frontend/src/
├── pages/           # Login, Register, Dashboard
├── context/         # AuthContext (global auth state)
└── lib/             # Axios instance, API calls
```

---

## 📡 API Reference

### Auth Routes
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login, receive JWT | ❌ |

### Habit Routes
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/habits/dashboard` | Get all habits with streaks | ✅ |
| POST | `/api/habits` | Create a habit | ✅ |
| PATCH | `/api/habits/:id` | Update a habit | ✅ |
| DELETE | `/api/habits/:id` | Soft delete a habit | ✅ |
| POST | `/api/habits/:id/log` | Mark habit complete today | ✅ |
| GET | `/api/habits/:id/streak` | Get streak for one habit | ✅ |

### Authentication
All protected routes require a Bearer token:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔥 Streak Logic

The streak engine handles real-world edge cases:

- ✅ Counts consecutive days with completed logs
- ✅ **Grace period** — streak preserved if user logged yesterday but not today yet
- ✅ Streak resets to 0 if last log was 2+ days ago
- ✅ Uses `Set`-based O(1) date lookups for performance
- ✅ Soft-delete preserves historical log data for accurate streak history

---

## 🧪 Tests

```bash
cd backend
npm test
```

**15 tests across 2 test suites:**

**Auth Integration Tests (auth.test.js)**
- Register returns 201 + JWT token
- Duplicate email returns 409
- Missing fields return 400 with validation errors
- Weak password rejected with field-specific error
- Login returns 200 + JWT token
- Wrong credentials return 401 (same message — prevents user enumeration)
- Missing login fields return 400

**Streak Unit Tests (streak.test.js)**
- Empty logs return 0
- Single day streak
- Consecutive day streaks
- Gap detection stops count correctly
- Grace period handling
- Long streak (30 days) accuracy

---

## 🚀 Running Locally

### Prerequisites
- Node.js v18+
- PostgreSQL
- npm

### Backend Setup

```bash
# Clone the repo
git clone https://github.com/Lu-c1-fer/Smart-Habit-Tracker.git
cd Smart-Habit-Tracker/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Fill in your `.env`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/habittracker
JWT_SECRET=your_super_secret_key
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

```bash
# Run development server
npm run dev
```

### Frontend Setup

```bash
cd ../frontend
npm install
```

Create `.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

```bash
npm run dev
```

App will be running at `http://localhost:5173`

---

## 🔒 Security Features

- **Helmet.js** — Sets 15+ HTTP security headers automatically
- **Rate Limiting** — 100 req/15min globally, 10 req/15min on auth routes
- **bcrypt** — Passwords hashed with 12 salt rounds (never stored plain)
- **JWT expiry** — Tokens expire after 15 minutes
- **Zod validation** — All request bodies validated before hitting business logic
- **Soft delete** — User data never permanently deleted
- **User enumeration prevention** — Same error message for wrong email/password
- **trust proxy** — Correctly configured for Railway's reverse proxy

---

## 📁 Project Structure

```
Smart-Habit-Tracker/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   └── habit.controller.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   └── validate.js
│   │   ├── repositories/
│   │   │   ├── user.repo.js
│   │   │   └── habit.repo.js
│   │   ├── routes/
│   │   │   ├── auth.route.js
│   │   │   └── habit.route.js
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   └── habit.service.js
│   │   ├── tests/
│   │   │   ├── auth.test.js
│   │   │   └── streak.test.js
│   │   ├── validators/
│   │   │   ├── auth.validator.js
│   │   │   └── habit.validator.js
│   │   ├── utils/
│   │   │   └── jwt.js
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── lib/
│   │   │   ├── api.js
│   │   │   └── habits.js
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```



---

## 👨‍💻 Author

**Ayush Thapa**

- 🔗 [LinkedIn](https://www.linkedin.com/in/ayush-thapa-181507245)
- 🐙 [GitHub](https://github.com/Lu-c1-fer)

---

## 📄 License

MIT License — feel free to use this project as a reference or starting point.
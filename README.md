# 🧠 Smart Habit Tracker API

A production-ready RESTful API for tracking daily habits and streaks, built with Node.js, Express, and PostgreSQL. Features secure JWT authentication, rate limiting, and comprehensive test coverage.

🚀 **Live API:** [https://smart-habit-tracker-production-d573.up.railway.app](https://smart-habit-tracker-production-d573.up.railway.app)

---

## 📌 Features

- 🔐 **JWT Authentication** — Secure register and login with token-based auth
- 🛡️ **Rate Limiting** — API abuse prevention on all endpoints
- 📋 **Habit Management** — Full CRUD operations for habits
- 📈 **Streak Tracking** — Automatic streak calculation with grace period logic
- ✅ **Tested** — Unit and integration tests written with Jest and Supertest
- ☁️ **Deployed** — Live on Railway with PostgreSQL database

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | PostgreSQL |
| Authentication | JWT (JSON Web Tokens) |
| Testing | Jest + Supertest |
| Deployment | Railway |

---

## 📡 API Endpoints

### Auth

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | ❌ |
| POST | `/api/auth/login` | Login and receive JWT token | ❌ |

### Habits

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/habits` | Get all habits for logged in user | ✅ |
| POST | `/api/habits` | Create a new habit | ✅ |
| PUT | `/api/habits/:id` | Update an existing habit | ✅ |
| DELETE | `/api/habits/:id` | Delete a habit | ✅ |

---

## 🔐 Authentication

This API uses **JWT (JSON Web Tokens)** for authentication. After registering or logging in, include the token in the Authorization header for all protected routes:

```
Authorization: Bearer <your_token_here>
```

---

## 📊 Streak Logic

The streak calculation handles real-world edge cases:

- ✅ Counts consecutive days logged
- ✅ **Grace period** — streak preserved if user hasn't logged today but logged yesterday
- ✅ Streak resets if last log was 2+ days ago
- ✅ Uses Set-based O(1) date lookups for performance

---

## 🧪 Testing

The project includes both unit and integration tests:

**Unit Tests — Streak Calculation**
- Empty logs return 0
- Single day streak
- Consecutive day streaks
- Gap detection stops count correctly
- Grace period handling
- Long streak (30 days) accuracy

**Integration Tests — Authentication**
- Successful registration returns JWT token
- Duplicate email returns 409
- Missing fields return 400 with validation errors
- Weak password rejected with specific field error
- Successful login returns JWT token
- Wrong credentials return 401 (identical message prevents user enumeration)
- Missing fields on login return 400

```bash
# Run tests
npm test
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js v18+
- PostgreSQL
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/smart-habit-tracker.git

# Navigate into the project
cd smart-habit-tracker

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
NODE_ENV=development
```

### Run the App

```bash
# Development
npm run dev

# Production
npm start
```

---

## 📁 Project Structure

```
smart-habit-tracker/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js              # PostgreSQL connection
│   │   │   └── env.js             # Environment variable config
│   │   ├── controllers/
│   │   │   ├── auth.controller.js # Auth request handling
│   │   │   └── habit.controller.js# Habit request handling
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js # JWT verification
│   │   │   └── validate.js        # Request validation middleware
│   │   ├── repositories/
│   │   │   ├── habit.repo.js      # Habit database queries
│   │   │   └── user.repo.js       # User database queries
│   │   ├── routes/
│   │   │   ├── auth.route.js      # Auth routes
│   │   │   └── habit.route.js     # Habit routes
│   │   ├── services/
│   │   │   ├── auth.service.js    # Auth business logic
│   │   │   └── habit.service.js   # Habit business logic
│   │   ├── tests/
│   │   │   ├── auth.test.js       # Integration tests
│   │   │   └── streak.test.js     # Unit tests
│   │   ├── utils/
│   │   │   └── jwt.js             # JWT utility functions
│   │   ├── validators/
│   │   │   ├── auth.validator.js  # Auth input validation
│   │   │   └── habit.validator.js # Habit input validation
│   │   ├── app.js                 # Express app setup
│   │   └── server.js              # Entry point
│   ├── .gitignore
│   ├── nodemon.json
│   └── package.json
└── README.md
```

---

## 🔮 Upcoming Features

- [ ] React frontend (in progress)
- [ ] Habit completion logging per day
- [ ] Weekly and monthly streak reports
- [ ] Timezone-aware streak calculation

---

## 👨‍💻 Author

**Ayush Thapa**
-LinkedIn Profile:  www.linkedin.com/in/ayush-thapa-181507245
-GitHub Profile: https://github.com/Lu-c1-fer 

---

## 📄 License

MIT License — feel free to use this project as a reference.

# Cognibloom Backend API

Cognibloom is an AI-powered adaptive learning platform backend built with **Node.js, Express, TypeScript, PostgreSQL, and Prisma ORM**. It provides a secure, fully-typed REST API with JWT authentication, hierarchical resource authorization (IDOR prevention), interactive learning session modes, and dynamic analytics aggregation.

---

## 🛠 Tech Stack

- **Runtime & Language:** Node.js, TypeScript (Strict Mode)
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma ORM
- **Authentication:** JWT (JSON Web Tokens) with Bearer token authentication
- **Password Hashing:** `bcryptjs` (Salt factor 10)
- **Request Validation:** Zod schema validation
- **Security & Logging:** Helmet, CORS, Morgan

---

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma            # Prisma schema (User, Topic, Session, Interaction, Enums)
│   ├── seed.ts                  # Realistic demo data seed script
│   └── migrations/              # PostgreSQL migration history
│       └── 20260901000000_init/
│           └── migration.sql
├── src/
│   ├── config/
│   │   └── env.ts               # Validated environment configuration
│   ├── lib/
│   │   └── prisma.ts            # Singleton PrismaClient instance
│   ├── types/
│   │   ├── express.d.ts         # Augmented Request type with user context
│   │   ├── api.types.ts         # Standardized API response types
│   │   └── domain.types.ts      # Core domain enums (InteractionMode, Feedback)
│   ├── utils/
│   │   ├── password.ts          # bcrypt hashing & verification
│   │   ├── jwt.ts               # Token signing & verification
│   │   └── apiResponse.ts       # Standardized JSON response formatting
│   ├── middleware/
│   │   ├── auth.middleware.ts   # JWT verification & req.user extraction
│   │   ├── validate.middleware.ts # Zod validation middleware
│   │   ├── errorHandler.ts      # Global error handler with Prisma error mapping
│   │   └── notFoundHandler.ts   # 404 Route handler
│   ├── features/
│   │   ├── auth/                # Authentication Feature Module
│   │   │   ├── auth.types.ts
│   │   │   ├── auth.validator.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.controller.ts
│   │   │   └── auth.routes.ts
│   │   ├── topics/              # Topics Management Feature Module
│   │   │   ├── topic.validator.ts
│   │   │   ├── topic.service.ts
│   │   │   ├── topic.controller.ts
│   │   │   └── topic.routes.ts
│   │   ├── sessions/            # Learning Sessions Feature Module
│   │   │   ├── session.validator.ts
│   │   │   ├── session.service.ts
│   │   │   ├── session.controller.ts
│   │   │   └── session.routes.ts
│   │   ├── interactions/        # AI Interaction & Feedback Feature Module
│   │   │   ├── interaction.validator.ts
│   │   │   ├── interaction.ai.ts
│   │   │   ├── interaction.service.ts
│   │   │   ├── interaction.controller.ts
│   │   │   └── interaction.routes.ts
│   │   └── dashboard/           # Analytics & Metrics Feature Module
│   │       ├── dashboard.service.ts
│   │       ├── dashboard.controller.ts
│   │       └── dashboard.routes.ts
│   ├── routes/
│   │   └── index.ts             # Central API router mounting feature routers
│   ├── app.ts                   # Express app configuration & middleware
│   ├── server.ts                # Server entry point & graceful shutdown
│   └── test-runner.ts           # Sanity and unit verification suite
├── .env.example
├── tsconfig.json
├── package.json
└── README.md
```

---

## ⚡ Quick Start & Setup Instructions

### 1. Prerequisites
- Node.js (v18+ recommended, v22+ supported)
- PostgreSQL database instance

### 2. Installation
Navigate to the `backend` directory and install dependencies:
```bash
cd backend
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env` and set your PostgreSQL credentials and JWT secret:
```bash
cp .env.example .env
```

Example `.env`:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:password@localhost:5432/cognibloom?schema=public"
JWT_SECRET="cognibloom_super_secret_jwt_key_development_change_in_production_2026"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="http://localhost:3000"
```

### 4. Database Setup & Migrations
Generate Prisma client and apply migrations:
```bash
# Generate Prisma Client
npm run prisma:generate

# Apply migrations to database
npm run prisma:migrate
# or push directly in development:
npm run prisma:push
```

### 5. Seed Demo Data
Populate the database with demo users, topics, sessions, and interactions:
```bash
npm run prisma:seed
```

Demo Credentials created by seed:
- **Email:** `alex@cognibloom.com`
- **Password:** `password123`

### 6. Run the Server
```bash
# Start development server with hot reload
npm run dev

# Or build and run production bundle
npm run build
npm start
```

Server starts by default at `http://localhost:5000`.

---

## 📚 API Reference Documentation

All endpoints return responses in a standardized JSON format:
```json
{
  "success": true,
  "message": "Optional descriptive message",
  "data": { ... },
  "meta": { ... }
}
```

### 🔐 Authentication (`/api/auth`)

#### 1. Register User
- **Method & Path:** `POST /api/auth/register`
- **Auth:** Public
- **Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "createdAt": "2026-09-01T12:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 2. Login User
- **Method & Path:** `POST /api/auth/login`
- **Auth:** Public
- **Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "createdAt": "2026-09-01T12:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 3. Get Current User Profile
- **Method & Path:** `GET /api/auth/me`
- **Auth:** `Bearer <JWT_TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "createdAt": "2026-09-01T12:00:00.000Z"
    }
  }
}
```

---

### 📖 Topics (`/api/topics`)

#### 4. Create Topic
- **Method & Path:** `POST /api/topics`
- **Auth:** `Bearer <JWT_TOKEN>`
- **Request Body:**
```json
{
  "title": "Distributed Systems & Event-Driven Architecture"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "Topic created successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "title": "Distributed Systems & Event-Driven Architecture",
    "createdAt": "2026-09-01T12:00:00.000Z"
  }
}
```

#### 5. List Authenticated User Topics
- **Method & Path:** `GET /api/topics`
- **Auth:** `Bearer <JWT_TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Distributed Systems & Event-Driven Architecture",
      "createdAt": "2026-09-01T12:00:00.000Z",
      "totalSessions": 2,
      "lastSession": {
        "id": 2,
        "startedAt": "2026-09-01T14:00:00.000Z",
        "endedAt": null,
        "_count": { "interactions": 4 }
      }
    }
  ]
}
```

#### 6. Get Topic Details
- **Method & Path:** `GET /api/topics/:topicId`
- **Auth:** `Bearer <JWT_TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Distributed Systems & Event-Driven Architecture",
    "userId": 1,
    "createdAt": "2026-09-01T12:00:00.000Z",
    "totalSessions": 2,
    "sessions": [
      {
        "id": 2,
        "startedAt": "2026-09-01T14:00:00.000Z",
        "endedAt": null,
        "totalInteractions": 4
      }
    ]
  }
}
```

---

### ⏱ Learning Sessions (`/api/topics/:topicId/sessions` & `/api/sessions`)

#### 7. Start Learning Session
- **Method & Path:** `POST /api/topics/:topicId/sessions`
- **Auth:** `Bearer <JWT_TOKEN>`
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "Learning session started successfully",
  "data": {
    "id": 3,
    "topicId": 1,
    "startedAt": "2026-09-01T15:00:00.000Z",
    "endedAt": null,
    "topic": {
      "id": 1,
      "title": "Distributed Systems & Event-Driven Architecture"
    }
  }
}
```

#### 8. Get Session Details & Interactions
- **Method & Path:** `GET /api/sessions/:sessionId`
- **Auth:** `Bearer <JWT_TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "topicId": 1,
    "topicTitle": "Distributed Systems & Event-Driven Architecture",
    "startedAt": "2026-09-01T15:00:00.000Z",
    "endedAt": null,
    "isEnded": false,
    "totalInteractions": 2,
    "interactions": [ ... ]
  }
}
```

#### 9. End Learning Session
- **Method & Path:** `PATCH /api/sessions/:sessionId/end`
- **Auth:** `Bearer <JWT_TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Learning session ended successfully",
  "data": {
    "id": 3,
    "topicId": 1,
    "startedAt": "2026-09-01T15:00:00.000Z",
    "endedAt": "2026-09-01T15:45:00.000Z"
  }
}
```

---

### 💬 Interactions (`/api/sessions/:sessionId/interactions` & `/api/interactions`)

#### 10. Create Interaction (Ask AI Question)
- **Method & Path:** `POST /api/sessions/:sessionId/interactions`
- **Auth:** `Bearer <JWT_TOKEN>`
- **Request Body:**
```json
{
  "mode": "LEARN",
  "question": "What is the difference between at-least-once and exactly-once message delivery?"
}
```
*Valid modes: `LEARN`, `CHALLENGE`, `EXPLAIN`, `VALIDATE`*

- **Response (201 Created):**
```json
{
  "success": true,
  "message": "Interaction processed successfully",
  "data": {
    "id": 10,
    "sessionId": 3,
    "mode": "LEARN",
    "question": "What is the difference between at-least-once and exactly-once message delivery?",
    "response": "[Cognibloom AI - Learning Guide]\n\n**Topic:** Distributed Systems...",
    "feedback": null,
    "createdAt": "2026-09-01T15:10:00.000Z"
  }
}
```

#### 11. Get Session Interactions (with Pagination)
- **Method & Path:** `GET /api/sessions/:sessionId/interactions?page=1&limit=10&order=asc`
- **Auth:** `Bearer <JWT_TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 10,
      "sessionId": 3,
      "mode": "LEARN",
      "question": "What is the difference...",
      "response": "...",
      "feedback": null,
      "createdAt": "2026-09-01T15:10:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

#### 12. Submit Interaction Feedback
- **Method & Path:** `PATCH /api/interactions/:interactionId/feedback`
- **Auth:** `Bearer <JWT_TOKEN>`
- **Request Body:**
```json
{
  "feedback": "HELPFUL"
}
```
*Valid feedback values: `HELPFUL`, `NOT_HELPFUL`*

- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Feedback submitted successfully",
  "data": {
    "id": 10,
    "sessionId": 3,
    "mode": "LEARN",
    "question": "What is the difference...",
    "response": "...",
    "feedback": "HELPFUL",
    "createdAt": "2026-09-01T15:10:00.000Z"
  }
}
```

---

### 📊 Dashboard (`/api/dashboard`)

#### 13. Get Authenticated User Learning Dashboard
- **Method & Path:** `GET /api/dashboard`
- **Auth:** `Bearer <JWT_TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "metrics": {
      "topicsStudied": 3,
      "activeTopics": 3,
      "numberOfSessions": 4,
      "questionsAsked": 7,
      "helpfulResponses": 5,
      "notHelpfulResponses": 1,
      "unratedResponses": 1,
      "mostStudiedTopic": {
        "id": 1,
        "title": "Distributed Systems & Event-Driven Architecture",
        "sessionCount": 2,
        "interactionCount": 4
      }
    },
    "interactionsByMode": {
      "LEARN": 3,
      "CHALLENGE": 1,
      "EXPLAIN": 2,
      "VALIDATE": 1
    },
    "recentActivity": {
      "sessions": [
        {
          "id": 3,
          "topicId": 1,
          "topicTitle": "Distributed Systems & Event-Driven Architecture",
          "startedAt": "2026-09-01T15:00:00.000Z",
          "endedAt": null,
          "interactionCount": 2
        }
      ],
      "interactions": [
        {
          "id": 10,
          "mode": "LEARN",
          "question": "What is the difference...",
          "feedback": "HELPFUL",
          "createdAt": "2026-09-01T15:10:00.000Z",
          "topicId": 1,
          "topicTitle": "Distributed Systems & Event-Driven Architecture",
          "sessionId": 3
        }
      ]
    }
  }
}
```

---

## 🔒 Security & Authorization Design

1. **Strict Ownership Verification:**
   - Resources are protected through relational traversal: `Interaction -> Session -> Topic -> User`.
   - Any query attempting to access or mutate an entity not belonging to `req.user.userId` immediately returns `404 Not Found` (to prevent IDOR identification and object enumeration).

2. **Immutable Identity Invariant:**
   - The user identity is extracted **exclusively** from the cryptographically verified JWT payload. No client-supplied user ID in the request body, header, or query parameters is trusted.

3. **Input Sanitization & Schema Validation:**
   - All inputs are strictly validated against strongly-typed Zod schemas before hitting any controller or database layer.

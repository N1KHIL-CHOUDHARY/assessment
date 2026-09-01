# Cognibloom Approach

## 1. Problem Understanding

Cognibloom is a learning platform where a user can learn different topics by having an interactive session with the AI.

The main problem we are trying to solve is that learning should not just be one question and one answer.

We want to keep track of what the user is learning and what they asked so that the learning activity can be used later.

The main user can be a student, fresher, or developer who wants to learn a new technology.

Different users can have different levels of understanding. For example, a fresher may need simple explanations and real-life examples, while an experienced developer may prefer a shorter and more technical answer.

The main user actions are:
- Register and login
- Create a topic
- Start a learning session
- Ask questions
- Get an AI response
- Give helpful or not helpful feedback
- End the session
- See learning activity on the dashboard

For the prototype, I considered the main learning flow as:

```text
User → Topic → Session → Question → AI Response → Feedback
```

This was more important than adding many extra features.

---

## 2. Assumptions

The requirements were open-ended, so I had to make some decisions.

### Learning Sessions
I assumed that one topic can have multiple sessions. For example:
- **React**
  - Session 1
  - Session 2
  - Session 3

This allows the user to come back to the same topic later.

### Interactions
One interaction contains the user's question and the AI response. It also stores the mode, feedback, and timestamp.

### Progress
I did not treat progress as actual mastery. For now, progress means learning activity such as:
- Number of topics
- Number of sessions
- Number of questions
- Feedback (Helpful / Not Helpful)
- Recent activity
- Most studied topic

I made this decision because simply asking more questions does not mean the user has mastered a topic.

### AI
For now we use mock AI responses because the requirement allows predefined responses. This lets us build and test the complete system without depending on an external AI API. A real LLM can be added later.

### Learning Modes
The system has four modes:
- **LEARN**: Main mode for the prototype.
- **CHALLENGE**: Scenario-based technical questions.
- **EXPLAIN**: Step-by-step conceptual breakdowns.
- **VALIDATE**: Evaluation of user answers.

The other modes are kept in the design so they can be improved later.

---

## 3. Architecture

I used a separate frontend and backend:

```text
User
  ↓
Next.js Frontend
  ↓
Express REST API
  ↓
Services
  ↓
Prisma
  ↓
PostgreSQL
```

The frontend is responsible for the UI and user interaction. The backend handles authentication, validation, business logic, and database operations.

- **Next.js** for frontend: Provides clean routing and a solid React-based component structure.
- **Express** for backend: Keeps the REST API straightforward and lightweight.
- **Separation**: Keeping them separate means the backend API can later be used by other clients such as a mobile app.

### Backend Structure

I used a feature-based structure:

```text
backend/src/features/
  ├── auth/
  ├── topics/
  ├── sessions/
  ├── interactions/
  └── dashboard/
```

Each feature contains the code related to that functionality (routes, controller, service, validator). For example, interaction-related logic stays inside the `interactions` feature. This keeps related code together and makes the project easier to understand and change.

---

## 4. Database Design

The main relationship is:

```text
User
  ↓
Topic
  ↓
Session
  ↓
Interaction
```

### Models

- **User**: Stores learner information (`id`, `username`, `email`, `passwordHash`, `createdAt`).
- **Topic**: Represents something the user wants to learn. It belongs to one user (`id`, `userId`, `title`, `createdAt`).
- **Session**: Represents one learning session for a topic. It stores `id`, `topicId`, `startedAt`, `endedAt`. A topic can have multiple sessions.
- **Interaction**: Stores one question and its AI response (`id`, `sessionId`, `mode`, `question`, `response`, `feedback`, `createdAt`).

I kept `sessionId` as the connection instead of storing `userId` and `topicId` again. So we can get the owner through:

```text
Interaction → Session → Topic → User
```

This avoids storing the same relationship multiple times and maintains a normalized schema.

### Why PostgreSQL & Prisma

- **PostgreSQL**: Chosen because learning data is relational with clear parent-child dependencies and cascade delete requirements.
- **Prisma**: Chosen because it provides type-safe database queries with TypeScript and manages migrations easily.

---

## 5. API Design & Security

### Main Endpoints

```text
Auth
  POST  /api/auth/register
  POST  /api/auth/login
  GET   /api/auth/me

Topics
  POST  /api/topics
  GET   /api/topics
  GET   /api/topics/:topicId

Sessions
  POST  /api/topics/:topicId/sessions
  GET   /api/sessions/:sessionId
  PATCH /api/sessions/:sessionId/end

Interactions
  POST  /api/sessions/:sessionId/interactions
  GET   /api/sessions/:sessionId/interactions
  PATCH /api/interactions/:interactionId/feedback

Dashboard
  GET   /api/dashboard
```

- **Feedback**: Kept as a separate `PATCH` request because feedback happens after the interaction is created.
- **Pagination**: Used for interaction history since sessions can grow large over time.

### Authentication & Authorization (IDOR Prevention)

- **JWT**: After login, the user receives a JWT. Protected routes extract and verify the `userId` from the token.
- **IDOR Protection**: The backend verifies ownership along the relational chain:
  - For a session: checks `session.topic.userId === loggedInUserId`.
  - For an interaction: checks `interaction.session.topic.userId === loggedInUserId`.
  - If unauthorized or not found, it returns `404 Not Found` so users cannot discover or access other users' data.
- **Validation**: Passwords are salt-hashed with bcrypt. Zod validates request bodies and query parameters at the API boundary.

---

## 6. Dashboard, AI Approach & Future Evolution

### Dashboard & Progress
The dashboard calculates activity metrics directly from the database:
- Total topics, sessions, and questions
- Feedback distribution (helpful vs. not helpful)
- Interaction modes breakdown
- Most studied topic
- Recent 5 sessions and interactions

I did not create a fake percentage (e.g. "React progress 82%") because question counts do not equal subject mastery. A future version can evaluate challenge and validation results to produce a meaningful score.

### AI Engine
- **Current**: Deterministic, mode-aware mock generator. The response adapts to the selected mode (`LEARN`, `CHALLENGE`, `EXPLAIN`, `VALIDATE`) and topic title.
- **Future Integration**: The service layer isolates AI generation, so swapping the mock with a live LLM (Gemini or OpenAI) requires changing only the AI service without restructuring controllers or database tables:

```text
Interaction Service → AI Service → Real LLM
```

### Scalability & Next Steps

1. **Database & Cache**: As data grows, add composite indexes on interactions, connection pooling (PgBouncer), and Redis caching for dashboard queries.
2. **Horizontal Scaling**: The stateless Express API can scale across multiple instances behind a load balancer.
3. **Async Queues**: Heavy AI requests can be offloaded to worker queues (e.g., BullMQ) with streaming updates (Server-Sent Events).
4. **Next 24 Hours Focus**:
   - **High Priority**: Integrate live LLM, improve interactive session UI, add integration tests.
   - **Next**: Stream AI responses, rate limiting, advanced mastery calculation.
   - **Later**: Spaced repetition, recommendation engine, background workers.

---

## Summary

The main goal was to establish a solid core learning loop:

```text
User → Topic → Session → Question → AI Response → Feedback → Dashboard Analytics
```

Instead of building an overly complex system all at once, I focused on clean architecture, reliable persistence, stateless authentication, and user data isolation. This provides a robust foundation that can easily incorporate live AI models and adaptive learning features.

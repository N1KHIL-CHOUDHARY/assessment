## 1. System Architecture & Feature-Based Modular Design

Cognibloom backend follows a clean, highly cohesive **feature-based (vertical slice)** architecture:

```
src/
├── config/                      # Environment variables & runtime config
├── lib/                         # Shared libraries & singleton Prisma client
├── types/                       # Shared domain & request types
├── utils/                       # Common cryptographic & response utilities
├── middleware/                  # Global Express middleware (Auth, Validation, Error Handling)
├── features/                    # Self-contained domain modules
│   ├── auth/                    # Auth: routes, controller, service, validator, types
│   ├── topics/                  # Topics: routes, controller, service, validator
│   ├── sessions/                # Sessions: routes, controller, service, validator
│   ├── interactions/            # Interactions: routes, controller, service, validator, AI engine
│   └── dashboard/               # Dashboard: routes, controller, service
├── routes/                      # Main router mounting all feature routers
├── app.ts                       # Express application bootstrap
└── server.ts                    # HTTP server listener & graceful shutdown
```

### Why Feature-Based Architecture?
1. **High Cohesion**: All components related to a domain entity (e.g. `topics` validation, business logic, route handlers, and data transformations) live in the same directory.
2. **Simplified Navigation & Cognitive Load**: Developers working on the `sessions` feature only navigate within `src/features/sessions/`.
3. **Decoupled Evolution**: Domain modules can be developed, tested, or refactored independently without spilling across global folders.
4. **Clean Cross-Feature Integration**: Features expose clear service and controller boundaries.

---

## 2. Request Flows & Lifecycles

### A. Authentication Flow
- **Registration (`POST /api/auth/register`):**
  1. Input is validated by Zod (`email`, `username`, `password`).
  2. Uniqueness of email and username is checked against PostgreSQL.
  3. Password is salt-hashed using `bcryptjs` with 10 salt rounds.
  4. User is persisted in the database; `passwordHash` is excluded from the returned payload.
  5. A signed JWT containing `userId`, `email`, and `username` is issued and returned to the client.
- **Login (`POST /api/auth/login`):**
  1. Input is validated.
  2. User is looked up via email or username.
  3. Bcrypt verifies the plaintext candidate against the stored hash in constant time.
  4. On match, a new JWT is returned.

### B. Topic Creation & Lookup Flow
- **Create Topic (`POST /api/topics`):**
  1. `auth.middleware` verifies the Bearer token and attaches `req.user`.
  2. Service creates a new topic tied strictly to `req.user.userId`.
- **List Topics (`GET /api/topics`):**
  1. Filters by `userId: req.user.userId`.
  2. Aggregates total session count and fetches the latest session status.

### C. Learning Session Lifecycle
- **Start Session (`POST /api/topics/:topicId/sessions`):**
  1. Verifies that `topic.userId === req.user.userId`.
  2. Creates a session with `startedAt = new Date()` and `endedAt = null`.
- **End Session (`PATCH /api/sessions/:sessionId/end`):**
  1. Verifies ownership through `session.topic.userId === req.user.userId`.
  2. Validates that the session is not already ended; if already ended, rejects with `400 Bad Request`.
  3. Sets `endedAt = new Date()`.

### D. Interaction & Feedback Lifecycle
- **Create Interaction (`POST /api/sessions/:sessionId/interactions`):**
  1. Validates `mode` (`LEARN | CHALLENGE | EXPLAIN | VALIDATE`) and `question`.
  2. Verifies session ownership through `session.topic.userId`.
  3. Invokes `generateMockAIResponse` tailored to the mode and topic title.
  4. Stores interaction with `feedback = null`.
- **Feedback Rating (`PATCH /api/interactions/:interactionId/feedback`):**
  1. Validates feedback enum (`HELPFUL | NOT_HELPFUL`).
  2. Verifies ownership through `interaction.session.topic.userId === req.user.userId`.
  3. Updates feedback state.

### E. Dashboard Metrics Aggregation Flow
- **Retrieve Dashboard (`GET /api/dashboard`):**
  1. Gathers 100% computed metrics from live database records for `req.user.userId`:
     - Total topics created.
     - Topics with active sessions.
     - Total sessions initiated.
     - Total questions/interactions submitted.
     - Helpful vs. Not Helpful feedback counts and unrated questions.
     - Interaction mode breakdown (`LEARN`, `CHALLENGE`, `EXPLAIN`, `VALIDATE`).
     - Most studied topic (determined by session frequency and interaction depth).
     - Chronological recent activity stream (latest 5 sessions & latest 5 interactions).

---

## 3. Security, Authorization & IDOR Prevention

### Preventing Insecure Direct Object References (IDOR)
In educational platforms, data isolation is paramount. We enforce IDOR prevention through:

1. **Relational Path Traversal Verification:**
   - Instead of checking merely if an ID exists in the database, our queries traverse the full hierarchy:
     - `Session`: `session.topic.userId === req.user.userId`
     - `Interaction`: `interaction.session.topic.userId === req.user.userId`
2. **Obscuring Existence of Unauthorized Resources:**
   - When a user requests an ID belonging to another user, we return `404 Not Found` rather than `403 Forbidden`. This prevents attackers from enumerating valid IDs of other users across the system.
3. **No Direct Foreign Keys on Sub-Entities:**
   - In accordance with the project constraints, `Interaction` holds only `sessionId`. `userId` and `topicId` are never duplicated onto `Interaction` but are derived safely through the relational chain.

---

## 4. Error Handling & Validation Philosophy

1. **Zod Validation Middleware:**
   - Automatically intercepts invalid payloads before they reach controllers.
   - Translates Zod errors into clean, field-specific arrays (e.g. `{ field: "email", message: "Invalid email address" }`).
2. **Prisma Error Translation:**
   - Converts raw Prisma error codes (`P2002`, `P2025`, `P2003`) into meaningful HTTP responses (`409 Conflict`, `404 Not Found`, `400 Bad Request`).
3. **Security Invariant:**
   - In production (`NODE_ENV === 'production'`), unhandled 500 error stack traces are suppressed to avoid disclosing internal server structure.

---

## 5. Mock AI Design & Future LLM Integration

The current mock AI engine (`src/utils/aiMock.ts`) provides differentiated, structured responses according to the selected mode:
- **`LEARN`**: Explores fundamentals, core mechanisms, and practical applications.
- **`CHALLENGE`**: Formulates scenario-based technical questions and architectural constraints.
- **`EXPLAIN`**: Provides mental models and step-by-step conceptual breakdowns.
- **`VALIDATE`**: Evaluates correctness, points out optimization opportunities, and evaluates security.

### Future LLM Extensibility:
When migrating to live LLMs (e.g. Google Gemini 1.5 Flash / Pro):
- Simply swap or wrap `aiMock.ts` with a service implementing a common interface `IAIService { generateResponse(topic, mode, question): Promise<string> }`.
- No controller, route, or database schema changes are required.

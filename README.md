# Cognibloom - AI Learning Platform

This repository contains the full stack implementation of Cognibloom, an AI-powered interactive learning platform.

## Repository Structure

- `backend/`: Node.js + Express + TypeScript + PostgreSQL + Prisma REST API backend.
- `frontend/`: Interactive Web Application UI.
- `APPROACH.md`: Comprehensive engineering design, architectural decisions, IDOR prevention, and data flow documentation.

## Backend Quick Start

```bash
cd backend
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

For complete API documentation and endpoint details, refer to [backend/README.md](backend/README.md).

# Cognibloom Backend - Tech Stack README

## Backend Tech Stack

### Core Framework & Runtime
- **Runtime**: [Node.js](https://nodejs.org/) (LTS version)
- **Web Framework**: [Express](https://expressjs.com/) (Minimalist web framework)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Static type checking for JavaScript)

### Database & ORM
- **Database**: [PostgreSQL](https://www.postgresql.org/) (Relational database management system)
- **ORM**: [Prisma](https://prisma.io/) (Next-generation ORM)
  - **Prisma Client**: Type-safe database access
  - **Prisma Migrate**: Database schema migration tool
  - **Prisma Seed**: Database seeding utility

### Authentication & Security
- **JWT**: [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) (JSON Web Tokens)
- **Password Hashing**: [bcrypt](https://www.npmjs.com/package/bcrypt) (Password hashing function)

### Utility Libraries
- **CORS**: [cors](https://www.npmjs.com/package/cors) (Cross-Origin Resource Sharing)
- **Compression**: [compression](https://www.npmjs.com/package/compression) (Node.js compression middleware)
- **Helmet**: [helmet](https://helmetjs.github.io/) (Set various HTTP headers for security)
- **Dotenv**: [dotenv](https://www.npmjs.com/package/dotenv) (Load environment variables from .env)
- **Helmet**: [helmet](https://helmetjs.github.io/) (Set various HTTP headers for security)
- **Helmet**: [helmet](https://helmetjs.github.io/) (Set various HTTP headers for security)

## Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS version)
- [PostgreSQL](https://www.postgresql.org/download/) (Running locally or remote)

### Installation
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Create database schema (if not exists)
npm run prisma:push

# Seed database with demo data
npm run prisma:seed

# Start development server
npm run dev
```

## Environment Variables

Create a `.env` file in the `backend/` directory based on `.env.example`:

```env
DATABASE_URL="postgresql://your_user:your_password@localhost:5432/your_db"
JWT_SECRET="your_secret_key"
JWT_EXPIRES_IN="1h"
```

## API Documentation

For detailed API documentation and endpoint details, refer to [backend/README.md](backend/README.md).

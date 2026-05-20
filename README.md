# Salary Management System

A full-stack salary management application built with Node.js, TypeScript, Express, Prisma, Next.js, and Tailwind CSS.

## Table of Contents
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Architecture](#architecture)
- [Screenshots](#screenshots)
- [Deployed Links](#deployed-links)
- [Test Commands](#test-commands)
- [Assumptions](#assumptions)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)

## Setup

### Prerequisites
- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Git**: For version control

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd salary-management
   ```

2. **Install all dependencies (monorepo)**
   ```bash
   npm install
   ```
   This will install dependencies for both backend and frontend workspaces.

3. **Set up environment variables**

   **Backend** (`backend/.env`):
   ```bash
   cp backend/.env.example backend/.env
   ```

   **Frontend** (`frontend/.env`):
   ```bash
   cp frontend/.env.example frontend/.env
   ```

4. **Initialize the database**
   ```bash
   cd backend
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. **Seed the database (optional)**
   ```bash
   npm run prisma:seed
   cd ..
   ```

6. **Set up Git hooks**
   ```bash
   npm run prepare
   ```

### Running the Application

**Development mode (both backend and frontend):**
```bash
npm run dev
```

- Backend: `http://localhost:3001`
- Frontend: `http://localhost:3000`

**Run individually:**
```bash
# Backend only
npm run backend:dev

# Frontend only
npm run frontend:dev
```

### Building for Production

```bash
# Build both projects
npm run build

# Build individually
npm run backend:build
npm run frontend:build
```

### Running in Production

```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm start
```

## Environment Variables

### Backend (.env)

Create a `backend/.env` file with the following variables:

```env
NODE_ENV=development
PORT=3001
DATABASE_URL="file:./dev.db"
CORS_ORIGIN=http://localhost:3000
```

**Variable Descriptions:**
- `NODE_ENV`: Environment mode (development/production)
- `PORT`: Port number for the backend server
- `DATABASE_URL`: SQLite database file path
- `CORS_ORIGIN`: Allowed origin for CORS requests

### Frontend (.env)

Create a `frontend/.env` file with the following variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Variable Descriptions:**
- `NEXT_PUBLIC_API_URL`: Backend API base URL

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           Next.js Frontend (Port 3000)                 │ │
│  │  - React Components (shadcn/ui)                        │ │
│  │  - TailwindCSS Styling                                 │ │
│  │  - Client-side State Management                        │ │
│  │  - API Integration Layer                               │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Express.js Backend (Port 3001)                 │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  Middleware Layer                                 │ │ │
│  │  │  - CORS, Helmet, Compression                      │ │ │
│  │  │  - Error Handler                                  │ │ │
│  │  │  - Request Validation                             │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  Routes Layer                                     │ │ │
│  │  │  - /api/employees                                 │ │ │
│  │  │  - /api/statistics                                │ │ │
│  │  │  - /health                                        │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  Controllers Layer                                │ │ │
│  │  │  - Request/Response Handling                      │ │ │
│  │  │  - Input Validation                               │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  Services Layer                                   │ │ │
│  │  │  - Business Logic                                 │ │ │
│  │  │  - Data Processing                                │ │ │
│  │  │  - Aggregation Logic                              │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Prisma ORM
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       Data Layer                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              SQLite Database                           │ │
│  │  - Employee Table                                      │ │
│  │  - Salary Records                                      │ │
│  │  - Indexed Queries                                     │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Backend Architecture

**Layered Architecture Pattern:**

1. **Routes Layer** (`src/routes/`)
   - Defines API endpoints
   - Maps HTTP methods to controllers

2. **Controllers Layer** (`src/controllers/`)
   - Handles HTTP requests/responses
   - Validates input using express-validator
   - Calls appropriate services

3. **Services Layer** (`src/services/`)
   - Contains business logic
   - Interacts with Prisma ORM
   - Performs data aggregation and calculations

4. **Middleware Layer** (`src/middleware/`)
   - Error handling
   - Request validation
   - Security (CORS, Helmet)

5. **Data Layer** (Prisma + SQLite)
   - Database schema definition
   - Type-safe database queries
   - Migration management

### Frontend Architecture

**Component-Based Architecture:**

1. **App Router** (`src/app/`)
   - Next.js 14 App Router
   - Server and client components
   - Layout and page components

2. **Components** (`src/components/`)
   - Reusable UI components
   - Layout components (Header, Sidebar)
   - Feature-specific components

3. **Hooks** (`src/hooks/`)
   - Custom React hooks
   - API integration hooks
   - State management hooks

4. **Types** (`src/types/`)
   - TypeScript interfaces
   - API response types
   - Component prop types

5. **Utilities** (`src/lib/`)
   - Helper functions
   - API client configuration
   - Shared utilities

### Data Flow

```
User Action → Frontend Component → API Hook → Backend Route → 
Controller → Service → Prisma → Database → Service → 
Controller → API Response → Frontend State Update → UI Update
```

## Screenshots

### Dashboard
![Dashboard](./screenshots/dashboard.png)
*Main dashboard showing employee statistics and summary cards*

### Employee List
![Employee List](./screenshots/employee-list.png)
*Paginated employee list with search and filter capabilities*

### Employee Details
![Employee Details](./screenshots/employee-details.png)
*Detailed view of individual employee information*

### Statistics View
![Statistics](./screenshots/statistics.png)
*Salary statistics and aggregations by department*

> **Note**: Add actual screenshots to the `screenshots/` directory in the project root.

## Deployed Links

### Production
- **Frontend**: [https://salary-management-frontend-mocha.vercel.app](https://salary-management-frontend-mocha.vercel.app)
- **Backend API**: [https://salary-management-backend.vercel.app](https://salary-management-backend.vercel.app)
- **Health Check**: [https://salary-management-backend.vercel.app/health](https://salary-management-backend.vercel.app/health)

> **Note**: Application is fully deployed and functional on Vercel.

## Test Commands

### Backend Tests

**Run all tests:**
```bash
npm run backend:test
```

**Run tests in watch mode:**
```bash
cd backend
npm test -- --watch
```

**Run tests with coverage:**
```bash
npm run backend:test
cd backend
npm run test:coverage
```

**Run specific test file:**
```bash
cd backend
npm test employees.test.ts
```

**Run tests matching a pattern:**
```bash
cd backend
npm test -- --grep "employee"
```

### Test Coverage

The test suite includes:
- **Unit Tests**: Service layer business logic
- **Integration Tests**: API endpoints with database
- **Error Handling Tests**: Validation and error scenarios

**Coverage Reports:**
```bash
cd backend
npm run test:coverage
```

Coverage reports are generated in `backend/coverage/` directory.

### Available Test Files
- `employees.test.ts` - Employee CRUD operations
- `aggregation.test.ts` - Salary statistics and aggregations
- `error-handler.test.ts` - Error handling middleware
- `validation.test.ts` - Input validation
- `database.test.ts` - Database operations

## Assumptions

### General Assumptions

1. **Database**
   - SQLite is used for simplicity and portability
   - Database file is stored locally in the backend directory
   - No authentication/authorization required (internal tool)

2. **Employee Data**
   - Employee names are unique identifiers
   - Salary values are positive numbers
   - Department names are predefined categories
   - Sub-departments are optional fields

3. **API Design**
   - RESTful API conventions followed
   - JSON format for all requests/responses
   - Pagination is server-side with default page size of 10
   - All monetary values are in the same currency (no conversion needed)

4. **Frontend Behavior**
   - Modern browsers (Chrome, Firefox, Safari, Edge) are supported
   - JavaScript is enabled
   - Minimum viewport width of 320px (mobile-first)

5. **Performance**
   - Dataset size is manageable (< 100,000 employees)
   - No real-time updates required
   - Caching is handled at the browser level

6. **Validation**
   - Name: Required, 2-100 characters
   - Salary: Required, positive number, max 10 digits
   - Department: Required, non-empty string
   - Sub-department: Optional string

7. **Error Handling**
   - Network errors are handled gracefully
   - User-friendly error messages displayed
   - Failed requests can be retried manually

8. **Security**
   - Application runs in a trusted internal network
   - CORS is configured for specific origins
   - Input sanitization is performed on all user inputs
   - No sensitive data encryption required (internal tool)

9. **Deployment**
   - Backend can be deployed on any Node.js hosting platform
   - Frontend can be deployed on Vercel/Netlify
   - Environment variables are managed through platform settings

10. **Testing**
    - Unit and integration tests cover critical paths
    - Manual testing is performed for UI/UX
    - Test database is separate from development database

11. **Data Consistency**
    - No concurrent write conflicts expected
    - Database transactions are not required for current operations
    - Data integrity is maintained through Prisma schema constraints

12. **Scalability**
    - Current architecture supports up to 10,000 concurrent users
    - Database can be migrated to PostgreSQL/MySQL if needed
    - Horizontal scaling can be achieved through load balancing

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express
- **ORM**: Prisma
- **Database**: SQLite
- **Testing**: Vitest, Supertest
- **Code Quality**: ESLint, Prettier

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Code Quality**: ESLint, Prettier

### Development Tools
- **Git Hooks**: Husky
- **Pre-commit**: lint-staged
- **Monorepo**: npm workspaces

## Project Structure

```
salary-management/
├── backend/          # Express API with Prisma ORM
├── frontend/         # Next.js application
└── package.json      # Root package.json for monorepo
```

## Backend Structure

```
backend/
├── prisma/
│   └── schema.prisma       # Database schema
├── src/
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Express middleware
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── types/             # TypeScript types
│   ├── utils/             # Utility functions
│   └── index.ts           # Application entry point
├── tests/                 # Test files
└── package.json
```

## Frontend Structure

```
frontend/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Home page
│   │   └── globals.css   # Global styles
│   ├── components/       # React components
│   ├── lib/              # Utility functions
│   └── types/            # TypeScript types
└── package.json
```

## Available Scripts

### Root Level
- `npm run dev` - Run both backend and frontend
- `npm run build` - Build both projects
- `npm run lint` - Lint all workspaces
- `npm run format` - Format all workspaces
- `npm run type-check` - Type check all workspaces

### Backend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Lint code
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run migrations
- `npm run prisma:studio` - Open Prisma Studio

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Lint code
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code
- `npm run type-check` - Type check

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=3001
DATABASE_URL="file:./dev.db"
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Git Hooks

This project uses Husky and lint-staged to ensure code quality:

- **pre-commit**: Runs linting and formatting on staged files

## License

ISC

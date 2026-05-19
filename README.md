# Salary Management System

A full-stack salary management application built with Node.js, TypeScript, Express, Prisma, Next.js, and Tailwind CSS.

## Project Structure

```
salary-management/
├── backend/          # Express API with Prisma ORM
├── frontend/         # Next.js application
└── package.json      # Root package.json for monorepo
```

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

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd salary-management
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   cd ..
   ```

5. **Set up environment variables**

   **Backend** (`backend/.env`):
   ```bash
   cp backend/.env.example backend/.env
   ```

   **Frontend** (`frontend/.env`):
   ```bash
   cp frontend/.env.example frontend/.env
   ```

6. **Initialize Prisma**
   ```bash
   cd backend
   npx prisma generate
   npx prisma migrate dev --name init
   cd ..
   ```

7. **Set up Husky**
   ```bash
   npm run prepare
   ```

### Development

**Run both backend and frontend concurrently:**
```bash
npm run dev
```

**Run backend only:**
```bash
npm run backend:dev
```

**Run frontend only:**
```bash
npm run frontend:dev
```

The backend will run on `http://localhost:3001` and the frontend on `http://localhost:3000`.

### Building

**Build both projects:**
```bash
npm run build
```

**Build backend only:**
```bash
npm run backend:build
```

**Build frontend only:**
```bash
npm run frontend:build
```

### Testing

**Run backend tests:**
```bash
npm run backend:test
```

**Run tests with coverage:**
```bash
cd backend
npm run test:coverage
```

### Code Quality

**Lint all projects:**
```bash
npm run lint
```

**Format all projects:**
```bash
npm run format
```

**Type check all projects:**
```bash
npm run type-check
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

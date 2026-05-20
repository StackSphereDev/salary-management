# Architecture Documentation

## System Overview

The Salary Management System is a full-stack web application built as a monorepo using npm workspaces. It provides comprehensive employee salary management with advanced analytics and insights capabilities.

## Architecture Pattern

### Layered Architecture (Backend)

```
┌─────────────────────────────────────┐
│         API Layer (Routes)          │
│  - Request validation               │
│  - Response formatting              │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      Controller Layer               │
│  - Request handling                 │
│  - Error handling                   │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│       Service Layer                 │
│  - Business logic                   │
│  - Data transformation              │
│  - Orchestration                    │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      Repository Layer               │
│  - Data access abstraction          │
│  - Prisma ORM integration           │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         Database (SQLite)           │
│  - Data persistence                 │
└─────────────────────────────────────┘
```

### Component-Based Architecture (Frontend)

```
┌─────────────────────────────────────┐
│         Next.js App Router          │
│  - File-based routing               │
│  - Server/Client components         │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         Pages/Routes                │
│  - Dashboard                        │
│  - Employees                        │
│  - Salaries                         │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      React Components               │
│  - UI Components (shadcn/ui)        │
│  - Business Components              │
│  - Layout Components                │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      State Management               │
│  - TanStack Query (React Query)     │
│  - Server state caching             │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         API Client                  │
│  - HTTP requests                    │
│  - Error handling                   │
└─────────────────────────────────────┘
```

## Technology Stack

### Backend
- **Runtime**: Node.js v18+
- **Language**: TypeScript 5.4.5
- **Framework**: Express 4.19.2
- **ORM**: Prisma 5.14.0
- **Database**: SQLite (development), PostgreSQL-ready
- **Validation**: Zod 4.4.3, express-validator 7.0.1
- **Security**: Helmet 7.1.0, CORS 2.8.5
- **Performance**: Compression 1.7.4
- **Testing**: Vitest 1.6.0, Supertest 7.0.0

### Frontend
- **Framework**: Next.js 14.2.3 (App Router)
- **Language**: TypeScript 5.4.5
- **Styling**: Tailwind CSS 3.4.3
- **UI Library**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React 0.379.0
- **State Management**: TanStack Query 5.100.11
- **Forms**: React Hook Form 7.76.0 + Zod validation
- **Testing**: Jest 30.4.2, Testing Library

### Development Tools
- **Monorepo**: npm workspaces
- **Git Hooks**: Husky 8.0.3
- **Pre-commit**: lint-staged 15.2.2
- **Linting**: ESLint 8.57.0
- **Formatting**: Prettier 3.2.5
- **Process Management**: Concurrently 8.2.2

## Design Decisions

### 1. Monorepo Structure
**Decision**: Use npm workspaces for monorepo management

**Rationale**:
- Simplified dependency management
- Shared tooling configuration
- Single repository for related codebases
- No additional tooling overhead (Nx, Turborepo)

**Tradeoffs**:
- Less sophisticated build caching vs. Turborepo
- Manual script orchestration
- Simpler but less scalable for very large teams

### 2. SQLite for Development
**Decision**: Use SQLite as the primary database

**Rationale**:
- Zero configuration setup
- File-based, portable database
- Sufficient for 10,000+ employee records
- Easy testing and development
- Prisma provides PostgreSQL migration path

**Tradeoffs**:
- Single-threaded writes
- Limited concurrent write performance
- No advanced features (full-text search, JSON operators)
- Production deployment requires PostgreSQL migration

### 3. Layered Backend Architecture
**Decision**: Implement strict separation of concerns

**Rationale**:
- Clear responsibility boundaries
- Testable in isolation
- Easy to maintain and extend
- Repository pattern abstracts data access

**Tradeoffs**:
- More boilerplate code
- Slightly more complex for simple CRUD
- Better long-term maintainability

### 4. TanStack Query for State Management
**Decision**: Use React Query instead of Redux/Zustand

**Rationale**:
- Built-in server state caching
- Automatic background refetching
- Optimistic updates support
- Reduced boilerplate
- Perfect for API-driven applications

**Tradeoffs**:
- Learning curve for developers unfamiliar with it
- Less control over client-side state
- Excellent for server state, not ideal for complex client state

### 5. Zod for Validation
**Decision**: Use Zod for both backend and frontend validation

**Rationale**:
- Type-safe schema validation
- Shared schemas between frontend/backend
- TypeScript inference
- Runtime validation + compile-time types

**Tradeoffs**:
- Slightly larger bundle size
- Additional dependency
- Better DX and type safety

### 6. App Router (Next.js 14)
**Decision**: Use Next.js App Router instead of Pages Router

**Rationale**:
- Server Components by default
- Better performance
- Streaming and Suspense support
- Future-proof architecture
- Improved data fetching patterns

**Tradeoffs**:
- Newer API, less community resources
- Requires understanding of Server/Client components
- Migration complexity from Pages Router

## API Design

### RESTful Principles
- Resource-based URLs (`/api/employees`, `/api/salary-insights`)
- HTTP methods for CRUD (GET, POST, PUT, DELETE)
- Consistent response structure
- Proper status codes (200, 201, 400, 404, 500)

### Response Format
```typescript
// Success (List)
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}

// Success (Single)
{
  "id": "...",
  "name": "...",
  ...
}

// Error
{
  "error": "Error message"
}
```

### Query Parameters
- Pagination: `?page=1&limit=10`
- Sorting: `?sortBy=salary&order=desc`
- Filtering: `?department=Engineering&status=ACTIVE`
- Search: `?search=John`

## Security Considerations

### Backend Security
- **Helmet**: Security headers (XSS, clickjacking protection)
- **CORS**: Configured origin whitelist
- **Input Validation**: Zod + express-validator
- **SQL Injection**: Prevented by Prisma ORM
- **Error Handling**: No sensitive data in error messages

### Frontend Security
- **XSS Prevention**: React's built-in escaping
- **CSRF**: Same-origin policy
- **Environment Variables**: Prefixed with `NEXT_PUBLIC_`
- **Type Safety**: TypeScript prevents many runtime errors

## Performance Optimizations

### Backend
1. **Database Indexing**: Strategic indexes on frequently queried fields
2. **Compression**: Gzip compression for responses
3. **Pagination**: Cursor-based pagination support
4. **Query Optimization**: Prisma select/include optimization
5. **Batch Operations**: Seed uses batch inserts (1000 records/batch)

### Frontend
1. **Server Components**: Reduced JavaScript bundle
2. **Code Splitting**: Automatic route-based splitting
3. **React Query Caching**: Reduces redundant API calls
4. **Optimistic Updates**: Immediate UI feedback
5. **Lazy Loading**: Components loaded on demand

## Scalability Considerations

### Current Capacity
- **Employees**: 10,000+ records (tested)
- **Concurrent Users**: ~100 (SQLite limitation)
- **Response Time**: <50ms for most queries

### Scaling Path
1. **Database Migration**: SQLite → PostgreSQL
2. **Caching Layer**: Redis for frequently accessed data
3. **Load Balancing**: Multiple backend instances
4. **CDN**: Static asset delivery
5. **Database Replication**: Read replicas for analytics

## Error Handling Strategy

### Backend
```typescript
class AppError extends Error {
  statusCode: number;
}

// Specific error types
- ValidationError (400)
- NotFoundError (404)
- DatabaseError (500)
```

### Frontend
- React Query error boundaries
- User-friendly error messages
- Retry mechanisms for transient failures
- Loading states for better UX

## Testing Strategy

### Backend Testing
- **Unit Tests**: Services, utilities (Vitest)
- **Integration Tests**: API endpoints (Supertest)
- **Test Coverage**: >80% target
- **Test Database**: In-memory SQLite

### Frontend Testing
- **Component Tests**: React Testing Library
- **Hook Tests**: Custom hooks testing
- **E2E Tests**: (Future: Playwright)

## Deployment Architecture

### Development
```
Developer Machine
├── Backend (localhost:3001)
├── Frontend (localhost:3000)
└── SQLite Database (file)
```

### Production (Recommended)
```
┌─────────────────────────────────────┐
│         Load Balancer/CDN           │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      Frontend (Vercel/Netlify)      │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   Backend API (Railway/Render)      │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   PostgreSQL (Supabase/Neon)        │
└─────────────────────────────────────┘
```

## Future Enhancements

### Planned Features
1. **Authentication**: JWT-based auth with role-based access
2. **Real-time Updates**: WebSocket for live data
3. **Advanced Analytics**: ML-based salary predictions
4. **Export Functionality**: CSV/PDF reports
5. **Audit Logging**: Track all data changes

### Technical Improvements
1. **GraphQL API**: Alternative to REST
2. **Microservices**: Split into smaller services
3. **Event Sourcing**: For audit trail
4. **Full-text Search**: Elasticsearch integration
5. **Monitoring**: APM tools (Sentry, DataDog)

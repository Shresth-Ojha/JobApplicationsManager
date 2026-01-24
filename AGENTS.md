# Job Application Tracker - Full Stack Web Application

## Project Overview
Build a production-grade job application tracking web application that helps job seekers manage their application pipeline from initial application to final outcome. The system should be secure, scalable, and provide an excellent user experience with modern UI/UX patterns.

## Technology Stack Requirements

### Frontend
- **Framework**: React 18+ with TypeScript
- **State Management**: Redux Toolkit or Zustand for global state
- **Routing**: React Router v6+
- **UI Library**: Tailwind CSS for styling
- **Component Library**: shadcn/ui or Radix UI for accessible components
- **Form Handling**: React Hook Form with Zod validation
- **Date Handling**: date-fns or Day.js
- **HTTP Client**: Axios with interceptors for auth
- **Theme**: Support for dark/light mode with system preference detection

### Backend
- **Runtime**: Node.js 20+ with TypeScript
- **Framework**: Express.js or NestJS (preferred for enterprise patterns)
- **Database**: PostgreSQL 15+ for relational data
- **ORM**: Prisma or TypeORM for type-safe database operations
- **Authentication**: JWT-based auth with refresh tokens
- **Password Security**: bcrypt for hashing (min 12 rounds)
- **Validation**: Zod or class-validator for request validation
- **API Documentation**: Swagger/OpenAPI specification

### DevOps & Infrastructure
- **Containerization**: Docker with docker-compose for local development
- **Environment Management**: dotenv with environment-specific configs
- **Logging**: Winston or Pino for structured logging
- **Error Tracking**: Sentry integration (optional but recommended)
- **Rate Limiting**: Express rate limiter to prevent abuse
- **CORS**: Properly configured CORS policies

## Core Features & Functionality

### 1. Authentication & User Management
- **Registration**:
  - Email/password registration with email verification
  - Password strength requirements (min 8 chars, uppercase, lowercase, number, special char)
  - Email uniqueness validation
  - Optional: OAuth integration (Google, GitHub)

- **Login**:
  - Secure login with JWT tokens
  - Refresh token mechanism (7-day expiry for access, 30-day for refresh)
  - "Remember me" functionality
  - Account lockout after 5 failed attempts (15-minute cooldown)

- **Profile Management**:
  - Update profile information (name, email, phone)
  - Change password with current password verification
  - Delete account with confirmation dialog
  - Upload profile picture (optional)

### 2. Job Application Management

#### Application Schema
Each application should track:
- Company name (required)
- Position/Role title (required)
- Job description/URL (optional)
- Application date (auto-set to current date)
- Status (enum: Applied, Screening, Phone Interview, Technical Interview, Onsite Interview, Offer Received, Accepted, Rejected, Withdrawn)
- Salary range (min/max, currency)
- Location (city, country, remote/hybrid/onsite)
- Job posting URL
- Application source (LinkedIn, Company Website, Referral, etc.)
- Priority level (Low, Medium, High)
- Notes (rich text editor for interview notes, contacts, etc.)
- Tags/Labels (custom categorization)
- Contacts (recruiter name, email, phone)
- Timeline of status changes with timestamps

#### Application CRUD Operations
- **Create**: Quick add form with minimal required fields + detailed view
- **Read**: List view with filters, search, and sorting
- **Update**: Edit any field, update status with automatic timestamp
- **Delete**: Soft delete with 30-day recovery period

#### Advanced Features
- **Bulk Actions**: Select multiple applications for status updates or deletion
- **Duplicate Detection**: Warn if adding similar company/position
- **File Uploads**: Attach resume, cover letter, offer letter (max 5MB per file)
- **Email Integration**: Parse application emails to auto-create entries (stretch goal)

### 3. Dashboard & Analytics

#### Main Dashboard
- **Overview Cards**:
  - Total applications
  - Active applications (non-terminal states)
  - Interview pipeline count
  - Offer count
  - Average response time

- **Visual Analytics**:
  - Application funnel chart (Applied → Offer conversion)
  - Status distribution pie/donut chart
  - Applications over time (line chart)
  - Success rate by application source
  - Average time in each stage

- **Quick Actions**:
  - Add new application button (prominent)
  - Recently updated applications
  - Upcoming interviews (sorted by date)
  - Applications needing follow-up (>14 days since last update)

### 4. Search, Filter & Sort

#### Search
- Full-text search across company, position, notes
- Search suggestions/autocomplete
- Recent searches saved

#### Filters
- Status (multi-select)
- Date range (applied date, last updated)
- Priority level
- Location
- Salary range
- Tags
- Application source
- Combine multiple filters (AND logic)

#### Sorting
- Date applied (newest/oldest)
- Last updated
- Company name (A-Z)
- Priority
- Salary (high to low)

### 5. User Experience Features

#### Interface Requirements
- **Responsive Design**: Mobile-first approach, works on 320px to 4K screens
- **Loading States**: Skeleton loaders for async operations
- **Error Handling**: User-friendly error messages with recovery suggestions
- **Notifications**: Toast notifications for CRUD operations
- **Keyboard Shortcuts**: Power user features (Ctrl+K for search, etc.)
- **Accessibility**: WCAG 2.1 AA compliance
  - Proper ARIA labels
  - Keyboard navigation
  - Screen reader support
  - Focus indicators

#### Theme System
- Light mode (default)
- Dark mode
- System preference detection
- Smooth theme transition animations
- Theme persistence in localStorage
- High contrast mode support

#### Onboarding
- Welcome tour for first-time users
- Sample application data option
- Tooltips for key features
- Help documentation/FAQ section

## Technical Requirements

### Code Quality & Standards

#### Frontend
```typescript
// Example structure
src/
├── components/
│   ├── common/          // Reusable UI components
│   ├── features/        // Feature-specific components
│   └── layout/          // Layout components
├── pages/               // Route pages
├── hooks/               // Custom React hooks
├── services/            // API service layer
├── store/               // State management
├── types/               // TypeScript types/interfaces
├── utils/               // Helper functions
├── constants/           // App constants
└── styles/              // Global styles
```

#### Backend
```typescript
// Example structure
src/
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.dto.ts
│   │   └── auth.guard.ts
│   ├── users/
│   ├── applications/
│   └── analytics/
├── common/
│   ├── decorators/
│   ├── filters/         // Exception filters
│   ├── guards/          // Auth guards
│   ├── interceptors/    // Response interceptors
│   └── pipes/           // Validation pipes
├── config/              // Configuration
├── database/            // DB migrations & seeds
└── utils/               // Helper functions
```

### Security Requirements

#### Authentication & Authorization
- JWT tokens stored in httpOnly cookies (not localStorage)
- CSRF protection for state-changing operations
- Refresh token rotation
- Token blacklisting on logout
- Rate limiting on auth endpoints (5 requests/15min for login)

#### Data Protection
- Input sanitization to prevent XSS
- SQL injection prevention (ORM parameterized queries)
- Password hashing with bcrypt (cost factor 12)
- Sensitive data encryption at rest (optional)
- HTTPS only in production
- Security headers (Helmet.js)
  - Content-Security-Policy
  - X-Frame-Options
  - X-Content-Type-Options
  - Strict-Transport-Security

#### API Security
- Request validation on all endpoints
- File upload validation (type, size, virus scanning)
- API rate limiting (100 requests/15min per user)
- CORS whitelist for allowed origins
- API versioning (/api/v1/)

### Performance Optimization

#### Frontend
- Code splitting & lazy loading for routes
- Image optimization (WebP with fallbacks)
- Virtual scrolling for large lists (react-window)
- Debounced search inputs
- Memoization for expensive computations
- Service worker for offline functionality (optional)
- Bundle size optimization (<500KB initial load)

#### Backend
- Database indexing on frequently queried fields
- Query optimization (N+1 prevention)
- Response caching where appropriate
- Pagination for list endpoints (default 20 items)
- Connection pooling for database
- Compression middleware (gzip)
- Response time monitoring

### Testing Requirements

#### Frontend Testing
- Unit tests: Jest + React Testing Library (>70% coverage)
- Component tests for critical user flows
- E2E tests: Playwright or Cypress (auth, CRUD operations)
- Accessibility testing with axe-core

#### Backend Testing
- Unit tests: Jest (>80% coverage)
- Integration tests for API endpoints
- Database transaction rollback in tests
- Mock external services
- Security testing (OWASP top 10)

### Database Schema Design

#### Users Table
```sql
users:
  - id (UUID, primary key)
  - email (unique, indexed)
  - password_hash
  - first_name
  - last_name
  - profile_picture_url
  - email_verified (boolean)
  - verification_token
  - reset_token
  - reset_token_expires
  - failed_login_attempts
  - locked_until
  - created_at
  - updated_at
  - deleted_at (soft delete)
```

#### Applications Table
```sql
applications:
  - id (UUID, primary key)
  - user_id (foreign key, indexed)
  - company_name (indexed)
  - position_title (indexed)
  - job_description
  - job_url
  - application_date (indexed)
  - current_status (enum, indexed)
  - salary_min
  - salary_max
  - salary_currency
  - location_city
  - location_country
  - location_type (remote/hybrid/onsite)
  - application_source
  - priority_level
  - notes (text)
  - recruiter_name
  - recruiter_email
  - recruiter_phone
  - created_at
  - updated_at
  - deleted_at
```

#### Application History Table
```sql
application_history:
  - id (UUID, primary key)
  - application_id (foreign key)
  - status (enum)
  - notes
  - created_at
```

#### Tags/Labels Table
```sql
tags:
  - id (UUID, primary key)
  - user_id (foreign key)
  - name
  - color

application_tags:
  - application_id (foreign key)
  - tag_id (foreign key)
```

#### Files Table
```sql
files:
  - id (UUID, primary key)
  - application_id (foreign key)
  - file_name
  - file_type
  - file_size
  - file_url
  - uploaded_at
```

### API Endpoints Specification

#### Authentication
- POST /api/v1/auth/register - Register new user
- POST /api/v1/auth/login - Login user
- POST /api/v1/auth/logout - Logout user
- POST /api/v1/auth/refresh - Refresh access token
- POST /api/v1/auth/forgot-password - Request password reset
- POST /api/v1/auth/reset-password - Reset password
- GET /api/v1/auth/verify-email/:token - Verify email

#### Users
- GET /api/v1/users/me - Get current user profile
- PUT /api/v1/users/me - Update profile
- PUT /api/v1/users/me/password - Change password
- DELETE /api/v1/users/me - Delete account
- POST /api/v1/users/me/avatar - Upload profile picture

#### Applications
- GET /api/v1/applications - List applications (paginated, filtered)
- GET /api/v1/applications/:id - Get single application
- POST /api/v1/applications - Create application
- PUT /api/v1/applications/:id - Update application
- DELETE /api/v1/applications/:id - Delete application
- PATCH /api/v1/applications/:id/status - Update status
- POST /api/v1/applications/:id/files - Upload file
- GET /api/v1/applications/:id/history - Get status history

#### Analytics
- GET /api/v1/analytics/dashboard - Dashboard statistics
- GET /api/v1/analytics/funnel - Conversion funnel data
- GET /api/v1/analytics/timeline - Applications over time

#### Tags
- GET /api/v1/tags - List user tags
- POST /api/v1/tags - Create tag
- PUT /api/v1/tags/:id - Update tag
- DELETE /api/v1/tags/:id - Delete tag

### Error Handling

#### HTTP Status Codes
- 200: Success
- 201: Created
- 400: Bad Request (validation errors)
- 401: Unauthorized (invalid/missing token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 409: Conflict (duplicate email, etc.)
- 422: Unprocessable Entity
- 429: Too Many Requests
- 500: Internal Server Error

#### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "timestamp": "2026-01-23T10:30:00Z"
}
```

### Environment Variables

#### Frontend (.env)
```
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=JobTracker
VITE_ENABLE_ANALYTICS=false
```

#### Backend (.env)
```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/jobtracker
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
FRONTEND_URL=http://localhost:5173
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password
FILE_UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

## Deliverables

### Documentation
1. **README.md**: Setup instructions, features overview, tech stack
2. **API Documentation**: Swagger/OpenAPI specification
3. **Database Schema**: ER diagram and migration files
4. **User Guide**: How to use the application
5. **Developer Guide**: Code structure, conventions, contribution guidelines

### Code Quality
- ESLint + Prettier configuration
- Husky pre-commit hooks for linting
- Conventional commits enforcement
- TypeScript strict mode enabled
- No `any` types (use `unknown` if necessary)
- Comprehensive JSDoc comments for complex functions

### Deployment Ready
- Docker configuration for easy deployment
- Database migration scripts
- Seed data for testing
- CI/CD pipeline configuration (GitHub Actions)
- Production build optimization
- Health check endpoints

## Success Metrics
- Application loads in <2 seconds
- API response time <200ms for 95th percentile
- Zero console errors/warnings in production
- 100% TypeScript coverage (no `any`)
- Accessible to WCAG 2.1 AA standards
- Mobile responsive (320px to 4K)
- Secure authentication flow with no vulnerabilities

## Future Enhancements (Post-MVP)
- Browser extension for one-click application saving
- Email parsing to auto-create applications
- Interview preparation resources
- Salary negotiation calculator
- Job market insights and trends
- Team collaboration features
- Export data to PDF/Excel
- Integration with job boards (LinkedIn, Indeed)
- Calendar integration for interview scheduling
- AI-powered application insights

---

**Important Notes:**
- Follow SOLID principles and DRY methodology
- Write self-documenting code with clear variable/function names
- Implement proper error boundaries in React
- Use database transactions for multi-step operations
- Log all security-relevant events
- Regular dependency updates for security patches
- Performance monitoring from day one
- User privacy compliance (GDPR-ready architecture)

This is a production-grade application. Code quality, security, and user experience are non-negotiable priorities.
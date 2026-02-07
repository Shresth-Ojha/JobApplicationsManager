# Job Applications Manager (JAM)

> **Manage your job applications from submission to offer – all in one clean, simple place.**

## 🎯 Who This Is For

If you're actively hunting opportunities and tired of:
- Spreadsheets scattered across multiple tabs
- Forgetting where you applied and when
- Losing track of recruiter emails and interview dates
- Wondering which companies ghosted you
- Having your application data spread across LinkedIn, Indeed, and email

**This tool is for you.**

## ✨ What This Does

Job Applications Manager (JAM) is a lightweight, distraction-free application management system designed specifically for job seekers. No unnecessary features. No bloat. Just what you need.

### Core Features

**📋 Simple Application Management**
- Track company, position, application date, and status
- Store recruiter contact information
- Attach relevant documents (resume, cover letters, offer letters)
- Add personal notes for each application

**📊 Real-Time Dashboard**
- Quick overview of your application pipeline at a glance
- See how many applications are in each stage (Applied → Offer)
- Track active vs. completed applications
- View recent activity instantly

**🔍 Smart Filtering & Search**
- Filter by status, priority, location, salary range
- Search across companies, positions, and notes
- Organize applications with custom tags
- Sort by date, priority, company name, or salary

**📈 Analytics**
- Visual funnel showing your conversion rates
- Status distribution charts
- Application timeline
- Success metrics by source (LinkedIn, Referral, etc.)

**🏷️ Organization**
- Assign priority levels (Low, Medium, High)
- Create custom tags for categorization
- Mark applications as favorites
- Track salary expectations

**🔐 Your Data, Your Control**
- Secure authentication with encrypted passwords
- All data stored in your database (not sold)
- No third-party tracking
- GDPR-ready architecture

## 🚀 Why Use This Instead of Spreadsheets?

| Spreadsheets | This App |
|---|---|
| ❌ No status workflow | ✅ Clear pipeline stages |
| ❌ Manual calculations | ✅ Instant analytics & charts |
| ❌ Hard to search/filter | ✅ Powerful search & multi-filters |
| ❌ Scattered across devices | ✅ Centralized, accessible everywhere |
| ❌ Easy to accidentally delete | ✅ Safe, organized storage |
| ❌ No insights on success | ✅ Real-time conversion metrics |

## 💻 Tech Stack

**Frontend:** React 19, TypeScript, Tailwind CSS, Recharts
**Backend:** Express.js, Node.js, PostgreSQL, Prisma ORM
**Deployment:** Docker, Vercel (Frontend), Render (Backend), Supabase (Database)

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd JobApplicationsTracker
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   
   # Configure environment
   cp .env.example .env
   # Edit .env with your database URL and JWT secrets
   
   # Run migrations
   npx prisma migrate dev
   
   # Start server
   npm run dev
   ```

3. **Setup Frontend** (in a new terminal)
   ```bash
   cd client
   npm install
   
   # Configure environment
   cp .env.example .env
   # Ensure VITE_API_URL points to your backend (http://localhost:3000/api/v1)
   
   # Start dev server
   npm run dev
   ```

4. **Access the app**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000/api/v1`
   - Health check: `http://localhost:3000/api/health`

### Using Docker

```bash
docker-compose up
```

This starts both frontend and backend with a PostgreSQL database.

## 📚 Features Overview

### Dashboard
Get a snapshot of your job search at a glance:
- Total applications count
- Active applications in progress
- Recent activity feed
- Quick "Add New Application" button

### Application Management
- **Create**: Add new applications with company, position, status, salary, location
- **View**: See all applications in a beautiful list with status badges
- **Edit**: Update any field at any time
- **Track**: Automatic timestamps for every status change
- **Organize**: Tag, prioritize, and annotate applications

### Analytics
Understand your job search performance:
- **Funnel Chart**: See conversion rates from application to offer
- **Status Distribution**: Breakdown of applications by stage
- **Timeline**: Track application volume over time
- **Source Analysis**: Identify which job boards work best for you

### Profile & Settings
- Manage your personal information
- Update contact details
- Change password securely
- Download your data

## 🔒 Security

- Passwords hashed with bcrypt (cost factor 12)
- JWT tokens with refresh mechanism
- Rate limiting to prevent abuse
- HTTPS recommended in production
- Input validation on all endpoints
- No sensitive data exposed in logs

## 📦 What's NOT Included

To keep this simple and bloat-free, we intentionally exclude:
- Social media integration
- Email forwarding/parsing
- AI-powered recommendations
- Calendar sync
- Job board scraping

**Why?** These features complicate the app and require external permissions. We focus on what matters: tracking your applications effectively.

## 🤝 Contributing

This is a community project. Issues and pull requests are welcome!

## 📄 License

MIT License - Use freely, modify, deploy as needed.

## 🎓 Learning Resources

- [Setting up locally](#local-development)
- [Database schema](./server/prisma/schema.prisma)
- [API endpoints](./server/src/routes/)
- [Component guide](./client/src/components/)

## 🆘 Troubleshooting

**Frontend can't connect to backend?**
- Check `VITE_API_URL` in client/.env
- Ensure backend is running on port 3000

**Database connection error?**
- Verify `DATABASE_URL` in server/.env
- Ensure PostgreSQL is running
- Check credentials are correct

**Port already in use?**
- Backend: Change PORT in server/.env
- Frontend: Vite will use next available port

## 💡 Tips for Best Results

1. **Be consistent**: Update your applications as soon as you hear back
2. **Use tags**: Create categories like "Dream Companies", "Safety Schools", etc.
3. **Add notes**: Record what was discussed in interviews
4. **Set reminders**: Mark follow-up dates in your personal calendar
5. **Review analytics**: Understand what's working in your job search

## 🙌 Made With Care

Built for job seekers by developers who've been there. We know the pain of juggling 50+ applications and losing track. This tool makes it simple.

**Happy job hunting! 🎯**

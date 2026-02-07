# Deployment Guide - Job Applications Manager (JAM)

This guide covers deploying your app using **free tiers** of Vercel, Render, and Supabase.

---

## 📋 Architecture Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Vercel    │────▶│   Render    │────▶│  Supabase   │
│  (Frontend) │     │  (Backend)  │     │ (Postgres)  │
└─────────────┘     └─────────────┘     └─────────────┘
```

---

## Step 1: Set Up PostgreSQL Database (Supabase)

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Go to **Settings → Database** and copy the connection string
4. Replace `[YOUR-PASSWORD]` with your database password
5. Save this URL - you'll need it for Render

**Connection string format:**
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

---

## Step 2: Deploy Backend (Render)

1. Go to [render.com](https://render.com) and create an account
2. Click **New → Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name:** `job-manager-api`
   - **Root Directory:** `server`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npm start`

5. Add Environment Variables:
   ```
   NODE_ENV=production
   DATABASE_URL=[Your Supabase connection string]
   JWT_SECRET=[Generate: openssl rand -hex 64]
   JWT_REFRESH_SECRET=[Generate: openssl rand -hex 64]
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   FRONTEND_URL=https://your-app.vercel.app
   ```

6. Click **Create Web Service**
7. After deploy, run migrations:
   - Go to **Shell** tab
   - Run: `npx prisma migrate deploy`

8. Copy your Render URL (e.g., `https://job-manager-api.onrender.com`)

---

## Step 3: Deploy Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com) and create an account
2. Click **Add New → Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`

5. Add Environment Variable:
   ```
   VITE_API_URL=https://job-manager-api.onrender.com/api/v1
   ```

6. Click **Deploy**

---

## Step 4: Update CORS

After deploying, update your Render backend's `FRONTEND_URL` environment variable with your actual Vercel URL.

---

## 🔄 CI/CD Pipeline (GitHub Actions)

The CI workflow (`.github/workflows/ci.yml`) runs automatically on:
- Push to `main` or `develop`
- Pull requests to `main`

**What it does:**
- Installs dependencies
- Type-checks code
- Builds both frontend and backend

**Auto-deploy:**
- Vercel auto-deploys on push to `main`
- Render auto-deploys on push to `main`

---

## 📁 Configuration Files Created

| File | Purpose |
|------|---------|
| `.github/workflows/ci.yml` | CI pipeline for testing/building |
| `client/vercel.json` | Vercel deployment config |
| `server/render.yaml` | Render deployment config |
| `server/.env.example` | Environment variables template |

---

## 🆓 Free Tier Limits

| Service | Limits |
|---------|--------|
| **Vercel** | Unlimited deploys, 100GB bandwidth |
| **Render** | 750 hrs/month, sleeps after 15min inactivity |
| **Supabase** | 500MB database, 2 projects |

---

## 🚨 Important Notes

1. **Render Free Tier Sleep:** Your backend will sleep after 15 minutes of inactivity. First request after sleep takes ~30 seconds.

2. **Secrets:** Never commit `.env` files. Use platform dashboards to set secrets.

3. **Database Migrations:** Run `npx prisma migrate deploy` in Render shell after each schema change.

---

## Quick Commands

```bash
# Generate new secrets
openssl rand -hex 64

# Test build locally
cd client && npm run build
cd server && npm run build

# Run migrations
npx prisma migrate deploy
```

# 🚀 Production Deployment Plan

> **Last Updated:** April 21, 2026
> **Current Status:** Backend deployed, Frontend deploy plan updated to Render-only

---

## 📊 Deployment Status Dashboard

| Phase | Status | Progress |
|-------|--------|----------|
| **0. Code Preparation** | ✅ Complete | 5/5 steps |
| **1. Backend (Render)** | ✅ Complete | Deployed & Running |
| **2. Frontend (Render)** | ✅ Complete | 4/4 steps |
| **3. Verification** | ⏳ In Progress | 0/4 steps |

---

## 🔧 Post-Deploy Fixes (April 21, 2026)

### Fixes Applied
- **Client**: Fixed ESLint `react-hooks/immutability` errors in 9 files
- **Client**: Fixed `react-refresh/only-export-components` warning in AuthContext.jsx
- **Server**: Fixed Firestore `array-contains` query bug in `groups.js` (added `memberUids` field)
- **Status**: All fixes committed and pushed to `main`

### Plan Update (April 21, 2026)
- **Original**: Backend on Render + Frontend on Vercel
- **Updated**: Both Backend & Frontend on Render (Vercel access issues)

---

## 🌐 Live URLs

| Service | Platform | URL | Status |
|---------|----------|-----|--------|
| **Backend API** | Render | `https://daily-tracker-jvmk.onrender.com` | ✅ Live |
| **Frontend** | Render | `https://daily-tracker-fe.onrender.com` | ✅ Live |
| **API Base** | - | `https://daily-tracker-jvmk.onrender.com/api` | ✅ Ready |

---

## ✅ Completed Steps

### Phase 0: Code Preparation (COMPLETED)
- [x] 0.1 Update server/index.js - Added production CORS config
- [x] 0.2 Create vercel.json - Vercel build configuration (deprecated, kept for reference)
- [x] 0.3 Create .env.production templates - Both client & server
- [x] 0.4 Update .gitignore - Secure .env files
- [x] 0.5 Commit & Push code - All changes pushed to GitHub

### Phase 1: Backend Deployment - Render (COMPLETED)
- [x] 1.1 Create Render account - Using GitHub login
- [x] 1.2 Create Web Service - Connected to daily-tracker repo
- [x] 1.3 Configure build settings:
  - Root Directory: `server`
  - Build Command: `npm install`
  - Start Command: `npm start`
- [x] 1.4 Add Environment Variables (all from server/.env.production)
- [x] 1.5 Deploy & get URL: `https://daily-tracker-jvmk.onrender.com`

---

## ⏳ Remaining Steps

### Phase 2: Frontend Deployment - Render Static Site (COMPLETED)
> **Deployed at:** https://daily-tracker-fe.onrender.com
> **Date:** April 21, 2026

- [x] 2.1 Go to Render Dashboard → Click "New" → Select "Static Site"
- [x] 2.2 Connect `daily-tracker` repository
- [x] 2.3 Configure build settings:
  - Name: `daily-tracker-fe`
  - Root Directory: `client`
  - Build Command: `npm run build`
  - Publish Directory: `dist`
- [x] 2.4 Add Environment Variables
- [x] 2.5 Add Rewrite Rule for SPA routing
- [x] 2.6 Click "Create Static Site" and wait 1-2 minutes

### Phase 3: Verification (IN PROGRESS)
> **Estimated Time:** 5 minutes

- [ ] 3.1 Open frontend URL and verify UI loads
- [ ] 3.2 Test authentication (Register/Login)
- [ ] 3.3 Test API calls (Add food/workout/sleep)
- [ ] 3.4 Test Group Scheduling feature

---

## 🔑 Environment Variables for Render Static Site (Phase 2.4)

Add these in Render Dashboard → Static Site Settings → Environment:

| Key | Value | Status |
|-----|-------|--------|
| `VITE_API_URL` | `https://daily-tracker-jvmk.onrender.com/api` | Ready |
| `VITE_FIREBASE_API_KEY` | `AIzaSyCR1PR2PNNidF3svHlwXg3bbydvUKy9XIQ` | Ready |
| `VITE_FIREBASE_AUTH_DOMAIN` | `tracker-jason.firebaseapp.com` | Ready |
| `VITE_FIREBASE_PROJECT_ID` | `tracker-jason` | Ready |
| `VITE_FIREBASE_STORAGE_BUCKET` | `tracker-jason.firebasestorage.app` | Ready |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `263528444001` | Ready |
| `VITE_FIREBASE_APP_ID` | `1:263528444001:web:3e16fe9668b76bfdd3fa20` | Ready |

---

## 📋 Quick Reference: Render Static Site Deploy Steps

When you're ready to deploy frontend, follow these exact steps:

1. **Go to** [render.com](https://render.com) Dashboard
2. **Click** "New" → "Static Site"
3. **Connect** your `daily-tracker` GitHub repository
4. **Configure:**
   - Name: `daily-tracker-frontend`
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Publish Directory: `dist`
5. **Environment Variables:** Add all 7 variables from table above
6. **Redirects/Rewrites:** Add rule:
   - Source: `/*`
   - Destination: `/index.html`
7. **Click** "Create Static Site"
8. **Wait** 1-2 minutes
9. **Done!** Your app will be live at `https://daily-tracker-frontend.onrender.com`

---

## ⚠️ Important Notes

1. **Render Free Tier - Web Service:** Backend sleeps after 15min idle. First request after sleep takes 5-10s to wake up.
2. **Render Free Tier - Static Site:** Always available via CDN, no sleep.
3. **Firebase Free Tier:** 50,000 reads/day limit. Sufficient for <100 users.
4. **Security:** Never commit .env files. They are gitignored.
5. **Auto-deploy:** After setup, pushing to GitHub auto-deploys both frontend and backend on Render.
6. **CORS Update Required:** After frontend deploy, update `server/index.js` with actual frontend URL.

---

## 🆘 Troubleshooting Guide

| Issue | Cause | Solution |
|-------|-------|----------|
| CORS Error | Frontend URL not allowed | Update `server/index.js` CORS config with actual Render Static Site URL |
| 404 API | Backend not ready | Wait 2-3 min, check Render dashboard |
| Firebase Error | Wrong credentials | Verify env variables, especially PRIVATE_KEY |
| Build Fail | Node version | Render uses Node 18+, should be fine |
| Slow First Request | Render sleeping (backend only) | Normal for free tier, subsequent requests fast |
| Blank Page | Routing issue | Check Rewrite Rules in Static Site settings |

---

## 🔄 Post-Deploy: Auto-Deploy Setup

Once both services are deployed:
1. Push code to GitHub `main` branch
2. Render auto-deploys backend Web Service (~30 seconds)
3. Render auto-deploys frontend Static Site (~60 seconds)
4. No manual steps needed!

---

## 📁 Files Modified for Deployment

```
daily-tracker/
├── server/index.js                    ← CORS production config
├── server/.env.production             ← Backend env template (gitignored)
├── client/vercel.json                 ← Vercel build config (deprecated)
├── client/.env.production             ← Frontend env template (gitignored)
├── .gitignore                         ← Secured .env files
├── DEPLOY.md                          ← This file
└── deploy-check.sh                    ← Verification script
```

---

## 📝 Next Action Required

**Your next task:** Complete Phase 3 (Verification)
- Estimated time: 5 minutes
- Frontend URL: https://daily-tracker-fe.onrender.com
- Backend URL: https://daily-tracker-jvmk.onrender.com

**When ready:** Test the following:
1. Open https://daily-tracker-fe.onrender.com
2. Register/Login with a test account
3. Add food, workout, sleep entries
4. Create a group and test scheduling feature

**CORS updated:** `server/index.js` already configured with actual frontend URL.

---

## 💰 Cost Analysis (Free Tier Only)

| Service | Platform | Type | Cost/Month |
|---------|----------|------|-----------|
| Backend API | Render | Web Service (Free) | $0 |
| Frontend | Render | Static Site (Free) | $0 |
| Database | Firebase | Firestore (Free Spark) | $0 |
| Auth | Firebase | Authentication (Free) | $0 |
| **TOTAL** | | | **$0** |

**Limits:**
- Render Web Service: Sleeps after 15min idle
- Render Static Site: 100GB bandwidth/month
- Firebase: 50,000 reads/day, 20,000 writes/day
- Firebase Auth: 50,000 users/month

---

## 🔄 Migration Note

If you later want to switch back to Vercel or another platform:
1. Update `server/index.js` CORS origin
2. Update `VITE_API_URL` environment variable
3. No other code changes needed

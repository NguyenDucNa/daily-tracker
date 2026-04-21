# 🚀 Production Deployment Plan

> **Last Updated:** April 21, 2026
> **Current Status:** Backend deployed, Frontend pending

---

## 📊 Deployment Status Dashboard

| Phase | Status | Progress |
|-------|--------|----------|
| **0. Code Preparation** | ✅ Complete | 5/5 steps |
| **1. Backend (Render)** | ✅ Complete | Deployed & Running |
| **2. Frontend (Vercel)** | ⏳ Not Started | 0/5 steps |
| **3. Verification** | ⏳ Not Started | 0/4 steps |

---

## 🔧 Post-Deploy Fixes (April 21, 2026)

### Fixes Applied
- **Client**: Fixed ESLint `react-hooks/immutability` errors in 9 files
- **Client**: Fixed `react-refresh/only-export-components` warning in AuthContext.jsx
- **Server**: Fixed Firestore `array-contains` query bug in `groups.js` (added `memberUids` field)
- **Status**: All fixes committed and pushed to `main`

---

## 🌐 Live URLs

| Service | Platform | URL | Status |
|---------|----------|-----|--------|
| **Backend API** | Render | `https://daily-tracker-jvmk.onrender.com` | ✅ Live |
| **Frontend** | Vercel | `https://daily-tracker.vercel.app` (expected) | ⏳ Pending |
| **API Base** | - | `https://daily-tracker-jvmk.onrender.com/api` | ✅ Ready |

---

## ✅ Completed Steps

### Phase 0: Code Preparation (COMPLETED)
- [x] 0.1 Update server/index.js - Added production CORS config
- [x] 0.2 Create vercel.json - Vercel build configuration
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

### Phase 2: Frontend Deployment - Vercel (PENDING)
> **Estimated Time:** 10 minutes
> **Prerequisites:** Backend URL confirmed above

- [ ] 2.1 Create Vercel account (Sign up at vercel.com with GitHub)
- [ ] 2.2 Import project (`daily-tracker` repo)
- [ ] 2.3 Configure build settings:
  - Framework: `Vite`
  - Root Directory: `client`
  - Build Command: `npm run build`
  - Output Directory: `dist`
- [ ] 2.4 Add Environment Variables (see table below)
- [ ] 2.5 Click Deploy and wait 1-2 minutes

### Phase 3: Verification (PENDING)
> **Estimated Time:** 5 minutes

- [ ] 3.1 Open frontend URL and verify UI loads
- [ ] 3.2 Test authentication (Register/Login)
- [ ] 3.3 Test API calls (Add food/workout/sleep)
- [ ] 3.4 Test Group Scheduling feature

---

## 🔑 Environment Variables for Vercel (Phase 2.4)

Add these in Vercel Dashboard → Project Settings → Environment Variables:

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

## 📋 Quick Reference: Vercel Deploy Steps

When you're ready to deploy frontend, follow these exact steps:

1. **Go to** [vercel.com](https://vercel.com)
2. **Sign up** with GitHub
3. **Click** "Add New..." → "Project"
4. **Import** `daily-tracker` repository
5. **Configure:**
   - Framework Preset: **Vite**
   - Root Directory: **client**
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. **Environment Variables:** Add all 7 variables from table above
7. **Click** "Deploy"
8. **Wait** 1-2 minutes
9. **Done!** Your app will be live at `https://daily-tracker.vercel.app`

---

## ⚠️ Important Notes

1. **Render Free Tier:** Backend sleeps after 15min idle. First request after sleep takes 5-10s to wake up.
2. **Firebase Free Tier:** 50,000 reads/day limit. Sufficient for <100 users.
3. **Vercel Free Tier:** 100GB bandwidth/month. Sufficient for small app.
4. **Security:** Never commit .env files. They are gitignored.
5. **Auto-deploy:** After setup, pushing to GitHub auto-deploys both frontend and backend.

---

## 🆘 Troubleshooting Guide

| Issue | Cause | Solution |
|-------|-------|----------|
| CORS Error | Frontend URL not allowed | Check server/index.js CORS config |
| 404 API | Backend not ready | Wait 2-3 min, check Render dashboard |
| Firebase Error | Wrong credentials | Verify env variables, especially PRIVATE_KEY |
| Build Fail | Node version | Render uses Node 18+, should be fine |
| Slow First Request | Render sleeping | Normal for free tier, subsequent requests fast |
| Blank Page | Routing issue | Check vercel.json rewrite rules |

---

## 🔄 Post-Deploy: Auto-Deploy Setup

Once both services are deployed:
1. Push code to GitHub `main` branch
2. Render auto-deploys backend (~30 seconds)
3. Vercel auto-deploys frontend (~60 seconds)
4. No manual steps needed!

---

## 📁 Files Modified for Deployment

```
daily-tracker/
├── server/index.js                    ← CORS production config
├── server/.env.production             ← Backend env template (gitignored)
├── client/vercel.json                 ← Vercel build config
├── client/.env.production             ← Frontend env template (gitignored)
├── .gitignore                         ← Secured .env files
├── DEPLOY.md                          ← This file
└── deploy-check.sh                    ← Verification script
```

---

## 📝 Next Action Required

**Your next task:** Complete Phase 2 (Vercel Frontend Deployment)
- Estimated time: 10 minutes
- All configuration values are provided above
- No code changes needed

**When ready:** Follow the "Quick Reference: Vercel Deploy Steps" section above.

**After completion:** Update this file by marking Phase 2 and 3 as complete.

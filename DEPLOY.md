# 🚀 Production Deployment Plan

## Tổng quan kiến trúc
```
Frontend (Vercel)     Backend (Render)      Database (Firebase)
  React + Vite    <->   Express.js      <->  Firestore + Auth
  FREE TIER           FREE TIER             FREE TIER (50K reads/day)
```

---

## 📋 Bảng kế hoạch chi tiết

| Phase | Step | Mô tả | Ngưởi làm | Status | Est. Time |
|-------|------|-------|-----------|--------|-----------|
| **0** | **Chuẩn bị code** | | | | **5 phút** |
| 0.1 | Cập nhật server/index.js | Thêm CORS production config | 🤖 Auto | ✅ Ready | 1 phút |
| 0.2 | Tạo vercel.json | Config build cho Vercel | 🤖 Auto | ✅ Ready | 1 phút |
| 0.3 | Tạo .env.production templates | Templates cho cả client & server | 🤖 Auto | ✅ Ready | 1 phút |
| 0.4 | Cập nhật .gitignore | Đảm bảo .env không bị commit | 🤖 Auto | ✅ Ready | 30 giây |
| 0.5 | Commit & Push code | Đưa code lên GitHub | 👤 Manual | ⏳ Pending | 1 phút |
| **1** | **Deploy Backend (Render)** | | | | **10 phút** |
| 1.1 | Tạo tài khoản Render | Đăng ký render.com (dùng GitHub) | 👤 Manual | ⏳ Pending | 2 phút |
| 1.2 | Tạo Web Service | New + → Web Service → Connect GitHub | 👤 Manual | ⏳ Pending | 2 phút |
| 1.3 | Config build settings | Root: server, Build: npm install, Start: npm start | 👤 Manual | ⏳ Pending | 1 phút |
| 1.4 | Thêm Environment Variables | Copy từ .env.production vào Render dashboard | 👤 Manual | ⏳ Pending | 3 phút |
| 1.5 | Deploy & lấy URL | Đợi deploy xong, copy URL backend | 👤 Manual | ⏳ Pending | 2 phút |
| **2** | **Deploy Frontend (Vercel)** | | | | **10 phút** |
| 2.1 | Tạo tài khoản Vercel | Đăng ký vercel.com (dùng GitHub) | 👤 Manual | ⏳ Pending | 2 phút |
| 2.2 | Import project | Add New → Project → Import daily-tracker | 👤 Manual | ⏳ Pending | 1 phút |
| 2.3 | Config build settings | Framework: Vite, Root: client | 👤 Manual | ⏳ Pending | 1 phút |
| 2.4 | Thêm Environment Variables | VITE_API_URL + Firebase config | 👤 Manual | ⏳ Pending | 3 phút |
| 2.5 | Deploy | Click Deploy, đợi 1-2 phút | 🤖 Auto | ⏳ Pending | 2 phút |
| **3** | **Verify & Go Live** | | | | **5 phút** |
| 3.1 | Test trang chủ | Mở URL Vercel, kiểm tra UI | 👤 Manual | ⏳ Pending | 1 phút |
| 3.2 | Test đăng nhập | Register/Login với test account | 👤 Manual | ⏳ Pending | 1 phút |
| 3.3 | Test API | Thêm food/workout/sleep data | 👤 Manual | ⏳ Pending | 2 phút |
| 3.4 | Test Groups | Tạo group, invite, suggest schedule | 👤 Manual | ⏳ Pending | 1 phút |

---

## 🔑 Thông tin quan trọng

### URLs sau deploy
- **Frontend:** `https://daily-tracker.vercel.app`
- **Backend:** `https://daily-tracker-api.onrender.com`
- **API Base:** `https://daily-tracker-api.onrender.com/api`

### Environment Variables cần có

**Render (Server):**
```
PORT=10000
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@...iam.gserviceaccount.com
FIREBASE_CLIENT_ID=...
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/...
```

**Vercel (Client):**
```
VITE_API_URL=https://daily-tracker-api.onrender.com/api
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## ⚠️ Lưu ý quan trọng

1. **Render free tier:** Backend sẽ "sleep" sau 15 phút không có request. Request đầu tiên sau khi sleep sẽ mất 5-10 giây để "wake up"
2. **Firebase free tier:** Giới hạn 50,000 reads/ngày. Với <100 users hoàn toàn đủ dùng
3. **Vercel free tier:** 100GB bandwidth/tháng, đủ cho small app
4. **Không commit .env files:** Đã cấu hình .gitignore để tránh lộ credentials

---

## 🔄 Auto-deploy sau này

Sau khi setup xong, mỗi lần push code lên GitHub:
1. Render auto-deploy backend (30 giây)
2. Vercel auto-deploy frontend (60 giây)
3. Không cần làm gì thêm!

---

## 🆘 Troubleshooting

| Lỗi | Nguyên nhân | Cách fix |
|-----|-------------|----------|
| CORS error | Frontend URL chưa được allow | Kiểm tra CORS config trong server/index.js |
| 404 API | Backend chưa deploy xong | Đợi 2-3 phút, refresh Render dashboard |
| Firebase error | Sai credentials | Kiểm tra env variables, đặc biệt PRIVATE_KEY |
| Build fail | Node version | Render dùng Node 18+, không cần lo |
| Slow first request | Render sleep | Bình thường với free tier, request sau sẽ nhanh |

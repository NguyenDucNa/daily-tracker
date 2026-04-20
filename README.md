# Daily Life Tracker

A full-stack web application for tracking daily nutrition, workouts, and sleep. Built with React, Node.js/Express, and Firebase.

## Features

- **Food Tracking**: Log daily meals with calories, protein, carbs, and fat
- **Workout Tracking**: Track exercises with automatic PR (Personal Record) detection
- **Sleep Tracking**: Monitor sleep duration and quality
- **Analytics**: View charts and progress over time
- **Authentication**: User login/register system

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS + Recharts
- **Backend**: Node.js + Express
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication

## Setup

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** (Email/Password)
4. Enable **Firestore Database**
5. Copy your config credentials

### 2. Backend Setup

```bash
cd server
cp .env.example .env
# Edit .env with your Firebase credentials
npm install
npm run dev
```

Server runs on `http://localhost:3000`

### 3. Frontend Setup

```bash
cd client
cp .env.example .env
# Edit .env with your Firebase credentials
npm install
npm run dev
```

Client runs on `http://localhost:5173`

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Food
- `GET /api/foods?date=YYYY-MM-DD` - Get foods by date
- `POST /api/foods` - Add food
- `PUT /api/foods/:id` - Update food
- `DELETE /api/foods/:id` - Delete food

### Workout
- `GET /api/workouts?date=YYYY-MM-DD` - Get workouts by date
- `GET /api/workouts/personal-records` - Get all PRs
- `POST /api/workouts` - Add workout (auto PR detection)
- `DELETE /api/workouts/:id` - Delete workout

### Sleep
- `GET /api/sleep?date=YYYY-MM-DD` - Get sleep by date
- `GET /api/sleep/stats` - Get 7-day sleep stats
- `POST /api/sleep` - Add sleep record
- `DELETE /api/sleep/:id` - Delete sleep record
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import foodRoutes from './routes/foods.js';
import workoutRoutes from './routes/workouts.js';
import sleepRoutes from './routes/sleep.js';
import groupRoutes from './routes/groups.js';
import availabilityRoutes from './routes/availability.js';

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? [
        'https://daily-tracker-fe.onrender.com',
        'https://daily-tracker-jvmk.onrender.com',
      ]
    : 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/sleep', sleepRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/availability', availabilityRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
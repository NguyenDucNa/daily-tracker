import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import foodRoutes from './routes/foods.js';
import workoutRoutes from './routes/workouts.js';
import sleepRoutes from './routes/sleep.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/sleep', sleepRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
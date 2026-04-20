import express from 'express';
import { db } from '../config/firebase.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

const getDateRange = (dateStr) => {
  const date = new Date(dateStr);
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));
  return { startOfDay, endOfDay };
};

router.get('/', async (req, res) => {
  const { date } = req.query;
  const userId = req.user.uid;

  try {
    const { startOfDay, endOfDay } = getDateRange(date || new Date().toISOString());
    
    const snapshot = await db.collection(`users/${userId}/workouts`)
      .where('date', '>=', startOfDay)
      .where('date', '<=', endOfDay)
      .orderBy('date', 'desc')
      .get();

    const workouts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate().toISOString(),
    }));

    res.json(workouts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/all', async (req, res) => {
  const userId = req.user.uid;

  try {
    const snapshot = await db.collection(`users/${userId}/workouts`)
      .orderBy('date', 'desc')
      .limit(100)
      .get();

    const workouts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate().toISOString(),
    }));

    res.json(workouts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/personal-records', async (req, res) => {
  const userId = req.user.uid;

  try {
    const snapshot = await db.collection(`users/${userId}/personalRecords`).get();
    const records = snapshot.docs.map(doc => ({
      exerciseName: doc.id,
      ...doc.data(),
      achievedAt: doc.data().achievedAt?.toDate().toISOString(),
    }));
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const checkAndUpdatePR = async (userId, exerciseName, weight, reps, sets) => {
  const volume = weight * reps * sets;
  const prRef = db.collection(`users/${userId}/personalRecords`).doc(exerciseName);
  const prDoc = await prRef.get();

  let isPR = false;
  let newPR = null;

  if (!prDoc.exists) {
    isPR = true;
    newPR = {
      maxWeight: weight,
      maxReps: reps,
      maxVolume: volume,
      achievedAt: new Date(),
    };
  } else {
    const currentPR = prDoc.data();
    if (volume > currentPR.maxVolume) {
      isPR = true;
      newPR = {
        maxWeight: weight > currentPR.maxWeight ? weight : currentPR.maxWeight,
        maxReps: reps > currentPR.maxReps ? reps : currentPR.maxReps,
        maxVolume: volume,
        achievedAt: new Date(),
      };
    }
  }

  if (newPR) {
    await prRef.set(newPR);
  }

  return isPR;
};

router.post('/', async (req, res) => {
  const { exerciseName, weight, reps, sets, date } = req.body;
  const userId = req.user.uid;

  try {
    const weightNum = Number(weight) || 0;
    const repsNum = Number(reps) || 0;
    const setsNum = Number(sets) || 1;
    const volume = weightNum * repsNum * setsNum;

    const isPR = await checkAndUpdatePR(userId, exerciseName, weightNum, repsNum, setsNum);

    const docRef = await db.collection(`users/${userId}/workouts`).add({
      exerciseName,
      weight: weightNum,
      reps: repsNum,
      sets: setsNum,
      volume,
      isPR,
      date: new Date(date || new Date().toISOString()),
      createdAt: new Date(),
    });

    const doc = await docRef.get();
    res.status(201).json({
      id: doc.id,
      ...doc.data(),
      isPR,
      date: doc.data().date.toDate().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const userId = req.user.uid;

  try {
    await db.collection(`users/${userId}/workouts`).doc(id).delete();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
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
    
    const snapshot = await db.collection(`users/${userId}/sleep`)
      .where('date', '>=', startOfDay)
      .where('date', '<=', endOfDay)
      .orderBy('date', 'desc')
      .get();

    const sleepRecords = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate().toISOString(),
    }));

    res.json(sleepRecords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stats', async (req, res) => {
  const userId = req.user.uid;

  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const snapshot = await db.collection(`users/${userId}/sleep`)
      .where('date', '>=', sevenDaysAgo)
      .orderBy('date', 'desc')
      .get();

    const records = snapshot.docs.map(doc => doc.data());
    
    if (records.length === 0) {
      return res.json({ averageDuration: 0, records: [] });
    }

    const totalDuration = records.reduce((sum, r) => sum + (r.duration || 0), 0);
    const averageDuration = totalDuration / records.length;

    const qualityCounts = records.reduce((acc, r) => {
      acc[r.quality] = (acc[r.quality] || 0) + 1;
      return acc;
    }, {});

    res.json({
      averageDuration: Math.round(averageDuration * 10) / 10,
      totalRecords: records.length,
      qualityCounts,
      records: records.slice(0, 7).map(r => ({
        ...r,
        date: r.date.toDate().toISOString(),
      })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  const { bedtime, wakeTime, quality, date } = req.body;
  const userId = req.user.uid;

  try {
    const bedtimeDate = new Date(bedtime);
    const wakeTimeDate = new Date(wakeTime);
    
    let duration = (wakeTimeDate - bedtimeDate) / (1000 * 60 * 60);
    if (duration < 0) {
      duration += 24;
    }

    const docRef = await db.collection(`users/${userId}/sleep`).add({
      bedtime: bedtimeDate,
      wakeTime: wakeTimeDate,
      duration: Math.round(duration * 10) / 10,
      quality: quality || 'medium',
      date: new Date(date || new Date().toISOString()),
      createdAt: new Date(),
    });

    const doc = await docRef.get();
    res.status(201).json({
      id: doc.id,
      ...doc.data(),
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
    await db.collection(`users/${userId}/sleep`).doc(id).delete();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
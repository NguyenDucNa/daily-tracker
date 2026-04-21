import express from 'express';
import { db } from '../config/firebase.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/', async (req, res) => {
  const userId = req.user.uid;

  try {
    const snapshot = await db.collection(`users/${userId}/availability`).get();

    const availability = snapshot.docs.map(doc => ({
      dayOfWeek: doc.id,
      ...doc.data(),
    }));

    res.json(availability);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/', async (req, res) => {
  const userId = req.user.uid;
  const { availability } = req.body;

  try {
    const batch = db.batch();

    for (const avail of availability) {
      const docRef = db.collection(`users/${userId}/availability`).doc(String(avail.dayOfWeek));
      batch.set(docRef, {
        dayOfWeek: avail.dayOfWeek,
        timeSlots: avail.timeSlots || [],
        updatedAt: new Date(),
      });
    }

    await batch.commit();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
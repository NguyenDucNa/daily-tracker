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
    
    const snapshot = await db.collection(`users/${userId}/foods`)
      .where('date', '>=', startOfDay)
      .where('date', '<=', endOfDay)
      .orderBy('date', 'desc')
      .get();

    const foods = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate().toISOString(),
    }));

    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  const { name, calories, protein, carbs, fat, mealType, date } = req.body;
  const userId = req.user.uid;

  try {
    const docRef = await db.collection(`users/${userId}/foods`).add({
      name,
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
      mealType: mealType || 'snack',
      date: new Date(date || new Date().toISOString()),
      createdAt: new Date(),
    });

    const doc = await docRef.get();
    res.status(201).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const userId = req.user.uid;
  const { name, calories, protein, carbs, fat, mealType, date } = req.body;

  try {
    await db.collection(`users/${userId}/foods`).doc(id).update({
      name,
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
      mealType,
      date: new Date(date),
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const userId = req.user.uid;

  try {
    await db.collection(`users/${userId}/foods`).doc(id).delete();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
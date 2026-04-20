import express from 'express';
import { auth, db } from '../config/firebase.js';
import { authenticate, createUserDocument } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, displayName } = req.body;

  try {
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: displayName || email.split('@')[0],
    });

    await createUserDocument(userRecord);

    const token = await auth.createCustomToken(userRecord.uid);

    res.status(201).json({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRecord = await auth.getUserByEmail(email);
    const token = await auth.createCustomToken(userRecord.uid);

    res.json({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      token,
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

router.get('/me', authenticate, async (req, res) => {
  try {
    const userRecord = await auth.getUser(req.user.uid);
    res.json({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
    });
  } catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
});

export default router;
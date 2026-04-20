import { auth, db } from '../config/firebase.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const createUserDocument = async (user) => {
  const userRef = db.collection('users').doc(user.uid);
  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    await userRef.set({
      email: user.email,
      displayName: user.displayName || user.email.split('@')[0],
      createdAt: new Date().toISOString(),
    });
  }

  return userRef;
};
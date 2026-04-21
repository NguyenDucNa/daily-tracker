import express from 'express';
import { db } from '../config/firebase.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

const generateInviteCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const isAdmin = (group, userId) => {
  const member = group.members?.find(m => m.uid === userId);
  return member?.role === 'admin';
};

router.post('/', async (req, res) => {
  const { name } = req.body;
  const userId = req.user.uid;

  try {
    const inviteCode = generateInviteCode();
    const now = new Date();

    const docRef = await db.collection('groups').add({
      name,
      inviteCode,
      members: [
        {
          uid: userId,
          displayName: req.body.displayName || userId,
          role: 'admin',
          joinedAt: now,
        }
      ],
      memberUids: [userId],
      createdBy: userId,
      createdAt: now,
      updatedAt: now,
    });

    const doc = await docRef.get();
    const data = doc.data();
    res.status(201).json({
      id: doc.id,
      name: data.name,
      inviteCode: data.inviteCode,
      members: data.members,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  const userId = req.user.uid;

  try {
    const snapshot = await db.collection('groups')
      .where('memberUids', 'array-contains', userId)
      .get();

    const groups = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const userId = req.user.uid;

  try {
    const doc = await db.collection('groups').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const data = doc.data();
    const isMember = data.members?.some(m => m.uid === userId);

    if (!isMember) {
      return res.status(403).json({ error: 'Not a member' });
    }

    res.json({ id: doc.id, ...data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const userId = req.user.uid;
  const { name } = req.body;

  try {
    const doc = await db.collection('groups').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const data = doc.data();

    if (!isAdmin(data, userId)) {
      return res.status(403).json({ error: 'Only admin can update' });
    }

    await doc.ref.update({
      name,
      updatedAt: new Date(),
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
    const doc = await db.collection('groups').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const data = doc.data();

    if (data.createdBy !== userId) {
      return res.status(403).json({ error: 'Only creator can delete' });
    }

    await doc.ref.delete();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/join', async (req, res) => {
  const { inviteCode } = req.body;
  const userId = req.user.uid;

  try {
    const snapshot = await db.collection('groups')
      .where('inviteCode', '==', inviteCode.toUpperCase())
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ error: 'Invalid invite code' });
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    const isAlreadyMember = data.members?.some(m => m.uid === userId);

    if (isAlreadyMember) {
      return res.status(400).json({ error: 'Already a member' });
    }

    const newMembers = [
      ...(data.members || []),
      {
        uid: userId,
        displayName: req.body.displayName || userId,
        role: 'member',
        joinedAt: new Date(),
      }
    ];

    await doc.ref.update({
      members: newMembers,
      memberUids: [...(data.memberUids || []), userId],
      updatedAt: new Date(),
    });

    res.json({
      id: doc.id,
      name: data.name,
      inviteCode: data.inviteCode,
      members: newMembers,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/leave', async (req, res) => {
  const { id } = req.params;
  const userId = req.user.uid;

  try {
    const doc = await db.collection('groups').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const data = doc.data();
    const newMembers = data.members?.filter(m => m.uid !== userId);
    const newMemberUids = data.memberUids?.filter(uid => uid !== userId) || [];

    if (newMembers?.length === 0) {
      await doc.ref.delete();
    } else {
      await doc.ref.update({
        members: newMembers,
        memberUids: newMemberUids,
        updatedAt: new Date(),
      });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/suggest', async (req, res) => {
  const { id } = req.params;
  const userId = req.user.uid;

  try {
    const doc = await db.collection('groups').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const data = doc.data();
    const members = data.members || [];
    const memberIds = members.map(m => m.uid);

    const suggestedSlots = [];

    for (let day = 0; day < 7; day++) {
      const commonSlots = { start: '06:00', end: '22:00' };

      let isAllAvailable = true;

      for (const memberId of memberIds) {
        const availDoc = await db.collection(`users/${memberId}/availability`).doc(String(day)).get();

        if (availDoc.exists) {
          const availData = availDoc.data().timeSlots || [];
          if (availData.length === 0) {
            isAllAvailable = false;
            break;
          }
        } else {
          isAllAvailable = false;
        }
      }

      if (isAllAvailable) {
        suggestedSlots.push({
          dayOfWeek: day,
          start: commonSlots.start,
          end: commonSlots.end,
        });
      }
    }

    let confidence = 'low';
    if (suggestedSlots.length > 0) {
      confidence = 'medium';
    }

    res.json({
      suggestedSlots,
      confidence,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
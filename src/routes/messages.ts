import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// ✅ Extend Express Request to include userId
interface AuthenticatedRequest extends Request {
  userId?: number;
}

// ✅ Auth middleware
function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  try {
    const payload: any = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (e) {
    res.sendStatus(403);
  }
}

// ✅ Get all messages (with sender info)
router.get('/', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: req.userId },
        { receiverId: req.userId }
      ]
    },
    orderBy: { createdAt: 'asc' },
    include: { sender: true, receiver: true }
  });

  res.json(messages);
});

// ✅ Post a new message
router.post('/', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { content, receiverId } = req.body;

  if (!req.userId || !receiverId) return res.status(400).json({ error: 'Missing sender or receiver' });

  const message = await prisma.message.create({
    data: {
      content,
      senderId: req.userId,
      receiverId: Number(receiverId)
    },
    include: { sender: true, receiver: true }
  });

  res.json(message);
});

export default router;

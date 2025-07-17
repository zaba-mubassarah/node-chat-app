import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getMessages = async (_req: Request, res: Response) => {
  const messages = await prisma.message.findMany({ orderBy: { createdAt: 'asc' } });
  res.json(messages);
};

export const postMessage = async (req: Request, res: Response) => {
  const { content, sender } = req.body;
  const newMsg = await prisma.message.create({ data: { content, sender } });
  res.json(newMsg);
};

import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/errorHandler';

export class SessionService {
  async startSession(userId: number, topicId: number) {
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
    });

    if (!topic || topic.userId !== userId) {
      throw new AppError('Topic not found.', 404);
    }

    const session = await prisma.session.create({
      data: {
        topicId,
        startedAt: new Date(),
      },
      include: {
        topic: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return session;
  }

  async getSessionById(userId: number, sessionId: number) {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        topic: {
          select: {
            id: true,
            title: true,
            userId: true,
          },
        },
        interactions: {
          orderBy: { createdAt: 'asc' },
        },
        _count: {
          select: { interactions: true },
        },
      },
    });

    if (!session || session.topic.userId !== userId) {
      throw new AppError('Session not found.', 404);
    }

    return {
      id: session.id,
      topicId: session.topicId,
      topicTitle: session.topic.title,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      isEnded: session.endedAt !== null,
      totalInteractions: session._count.interactions,
      interactions: session.interactions,
    };
  }

  async endSession(userId: number, sessionId: number) {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        topic: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!session || session.topic.userId !== userId) {
      throw new AppError('Session not found.', 404);
    }

    if (session.endedAt !== null) {
      throw new AppError('Session is already ended.', 400, {
        endedAt: session.endedAt,
      });
    }

    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      data: {
        endedAt: new Date(),
      },
    });

    return updatedSession;
  }
}

export const sessionService = new SessionService();

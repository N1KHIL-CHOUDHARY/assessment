import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/errorHandler';
import { CreateTopicInput } from './topic.validator';

interface TopicSummaryWithSession {
  id: number;
  title: string;
  createdAt: Date;
  _count: {
    sessions: number;
  };
  sessions: {
    id: number;
    startedAt: Date;
    endedAt: Date | null;
    _count: {
      interactions: number;
    };
  }[];
}

interface TopicDetailSession {
  id: number;
  startedAt: Date;
  endedAt: Date | null;
  _count: {
    interactions: number;
  };
}

export class TopicService {
  async createTopic(userId: number, input: CreateTopicInput) {
    const topic = await prisma.topic.create({
      data: {
        userId,
        title: input.title.trim(),
      },
    });

    return topic;
  }

  async getUserTopics(userId: number) {
    const topics: TopicSummaryWithSession[] = await prisma.topic.findMany({
      where: { userId },
      include: {
        _count: {
          select: {
            sessions: true,
          },
        },
        sessions: {
          take: 1,
          orderBy: { startedAt: 'desc' },
          select: {
            id: true,
            startedAt: true,
            endedAt: true,
            _count: {
              select: { interactions: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return topics.map((t: TopicSummaryWithSession) => ({
      id: t.id,
      title: t.title,
      createdAt: t.createdAt,
      totalSessions: t._count.sessions,
      lastSession: t.sessions[0] || null,
    }));
  }

  async getTopicById(userId: number, topicId: number) {
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: {
        sessions: {
          orderBy: { startedAt: 'desc' },
          include: {
            _count: {
              select: { interactions: true },
            },
          },
        },
        _count: {
          select: { sessions: true },
        },
      },
    });

    if (!topic || topic.userId !== userId) {
      throw new AppError('Topic not found.', 404);
    }

    return {
      id: topic.id,
      title: topic.title,
      userId: topic.userId,
      createdAt: topic.createdAt,
      totalSessions: topic._count.sessions,
      sessions: topic.sessions.map((s: TopicDetailSession) => ({
        id: s.id,
        startedAt: s.startedAt,
        endedAt: s.endedAt,
        totalInteractions: s._count.interactions,
      })),
    };
  }
}

export const topicService = new TopicService();

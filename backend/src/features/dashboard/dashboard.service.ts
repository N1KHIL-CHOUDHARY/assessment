import { prisma } from '../../lib/prisma';
import { Feedback, InteractionMode } from '../../types/domain.types';

interface UserTopicWithSessions {
  id: number;
  title: string;
  createdAt: Date;
  sessions: {
    id: number;
    startedAt: Date;
    endedAt: Date | null;
    _count: {
      interactions: number;
    };
  }[];
}

interface RecentSessionRecord {
  id: number;
  startedAt: Date;
  endedAt: Date | null;
  topic: {
    id: number;
    title: string;
  };
  _count: {
    interactions: number;
  };
}

interface RecentInteractionRecord {
  id: number;
  mode: string;
  question: string;
  feedback: string | null;
  createdAt: Date;
  session: {
    id: number;
    topic: {
      id: number;
      title: string;
    };
  };
}

export class DashboardService {
  async getDashboardData(userId: number) {
    // 1. Total topics created by user
    const totalTopicsCount = await prisma.topic.count({
      where: { userId },
    });

    // 2. All topics with their session & interaction count for user
    const userTopics: UserTopicWithSessions[] = await prisma.topic.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        createdAt: true,
        sessions: {
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
    });

    // Calculate topics that have at least 1 session
    const topicsWithSessionsCount = userTopics.filter((t: UserTopicWithSessions) => t.sessions.length > 0).length;

    // Total sessions
    const totalSessions = userTopics.reduce((acc: number, t: UserTopicWithSessions) => acc + t.sessions.length, 0);

    // Total questions / interactions across all sessions of user
    const totalQuestionsAsked = await prisma.interaction.count({
      where: {
        session: {
          topic: {
            userId,
          },
        },
      },
    });

    // Helpful & Not Helpful feedback counts
    const [helpfulCount, notHelpfulCount] = await Promise.all([
      prisma.interaction.count({
        where: {
          feedback: Feedback.HELPFUL as any,
          session: { topic: { userId } },
        },
      }),
      prisma.interaction.count({
        where: {
          feedback: Feedback.NOT_HELPFUL as any,
          session: { topic: { userId } },
        },
      }),
    ]);

    const unratedCount = totalQuestionsAsked - (helpfulCount + notHelpfulCount);

    // Mode breakdown (LEARN, CHALLENGE, EXPLAIN, VALIDATE)
    const modeCounts = await prisma.interaction.groupBy({
      by: ['mode'],
      where: {
        session: {
          topic: {
            userId,
          },
        },
      },
      _count: {
        id: true,
      },
    });

    const interactionsByMode: Record<InteractionMode, number> = {
      [InteractionMode.LEARN]: 0,
      [InteractionMode.CHALLENGE]: 0,
      [InteractionMode.EXPLAIN]: 0,
      [InteractionMode.VALIDATE]: 0,
    };

    modeCounts.forEach((item: { mode: string; _count: { id: number } }) => {
      const modeKey = item.mode as InteractionMode;
      if (interactionsByMode[modeKey] !== undefined) {
        interactionsByMode[modeKey] = item._count.id;
      }
    });

    // Find most studied topic (by session count, tiebreaker by interaction count)
    let mostStudiedTopic: {
      id: number;
      title: string;
      sessionCount: number;
      interactionCount: number;
    } | null = null;

    if (userTopics.length > 0) {
      const topicStats = userTopics.map((t: UserTopicWithSessions) => {
        const sessionCount = t.sessions.length;
        const interactionCount = t.sessions.reduce((acc: number, s: { _count: { interactions: number } }) => acc + s._count.interactions, 0);
        return {
          id: t.id,
          title: t.title,
          sessionCount,
          interactionCount,
        };
      });

      topicStats.sort((a: { sessionCount: number; interactionCount: number }, b: { sessionCount: number; interactionCount: number }) => {
        if (b.sessionCount !== a.sessionCount) {
          return b.sessionCount - a.sessionCount;
        }
        return b.interactionCount - a.interactionCount;
      });

      if (topicStats[0] && (topicStats[0].sessionCount > 0 || topicStats[0].interactionCount > 0)) {
        mostStudiedTopic = topicStats[0];
      }
    }

    // Recent activity: Latest 5 interactions and latest 5 sessions
    const recentInteractions: RecentInteractionRecord[] = await prisma.interaction.findMany({
      where: {
        session: {
          topic: {
            userId,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        mode: true,
        question: true,
        feedback: true,
        createdAt: true,
        session: {
          select: {
            id: true,
            topic: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    const recentSessions: RecentSessionRecord[] = await prisma.session.findMany({
      where: {
        topic: {
          userId,
        },
      },
      orderBy: { startedAt: 'desc' },
      take: 5,
      select: {
        id: true,
        startedAt: true,
        endedAt: true,
        topic: {
          select: {
            id: true,
            title: true,
          },
        },
        _count: {
          select: { interactions: true },
        },
      },
    });

    return {
      metrics: {
        topicsStudied: totalTopicsCount,
        activeTopics: topicsWithSessionsCount,
        numberOfSessions: totalSessions,
        questionsAsked: totalQuestionsAsked,
        helpfulResponses: helpfulCount,
        notHelpfulResponses: notHelpfulCount,
        unratedResponses: Math.max(0, unratedCount),
        mostStudiedTopic,
      },
      interactionsByMode,
      recentActivity: {
        sessions: recentSessions.map((s: RecentSessionRecord) => ({
          id: s.id,
          topicId: s.topic.id,
          topicTitle: s.topic.title,
          startedAt: s.startedAt,
          endedAt: s.endedAt,
          interactionCount: s._count.interactions,
        })),
        interactions: recentInteractions.map((i: RecentInteractionRecord) => ({
          id: i.id,
          mode: i.mode,
          question: i.question,
          feedback: i.feedback,
          createdAt: i.createdAt,
          topicId: i.session.topic.id,
          topicTitle: i.session.topic.title,
          sessionId: i.session.id,
        })),
      },
    };
  }
}

export const dashboardService = new DashboardService();

import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/errorHandler';
import { generateMockAIResponse } from './interaction.ai';
import { CreateInteractionInput, FeedbackInput } from './interaction.validator';
import { Feedback } from '../../types/domain.types';

export class InteractionService {
  async createInteraction(userId: number, sessionId: number, input: CreateInteractionInput) {
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
      },
    });

    if (!session || session.topic.userId !== userId) {
      throw new AppError('Session not found.', 404);
    }

    const aiResponse = generateMockAIResponse(session.topic.title, input.mode, input.question);

    const interaction = await prisma.interaction.create({
      data: {
        sessionId,
        mode: input.mode,
        question: input.question.trim(),
        response: aiResponse,
        feedback: null,
      },
    });

    return interaction;
  }

  async getSessionInteractions(
    userId: number,
    sessionId: number,
    query: { page?: number; limit?: number; order?: 'asc' | 'desc' }
  ) {
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

    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    const order = query.order || 'asc';

    const [total, interactions] = await Promise.all([
      prisma.interaction.count({
        where: { sessionId },
      }),
      prisma.interaction.findMany({
        where: { sessionId },
        orderBy: { createdAt: order },
        skip,
        take: limit,
      }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      interactions,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async updateFeedback(userId: number, interactionId: number, input: FeedbackInput) {
    const interaction = await prisma.interaction.findUnique({
      where: { id: interactionId },
      include: {
        session: {
          include: {
            topic: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
    });

    if (!interaction || interaction.session.topic.userId !== userId) {
      throw new AppError('Interaction not found.', 404);
    }

    const updated = await prisma.interaction.update({
      where: { id: interactionId },
      data: {
        feedback: input.feedback as Feedback,
      },
    });

    return updated;
  }
}

export const interactionService = new InteractionService();

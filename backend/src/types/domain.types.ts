// Domain Enums mirroring the Prisma Schema for rock-solid IDE type resolution

export enum InteractionMode {
  LEARN = 'LEARN',
  CHALLENGE = 'CHALLENGE',
  EXPLAIN = 'EXPLAIN',
  VALIDATE = 'VALIDATE',
}

export enum Feedback {
  HELPFUL = 'HELPFUL',
  NOT_HELPFUL = 'NOT_HELPFUL',
}

export type InteractionModeType = keyof typeof InteractionMode;
export type FeedbackType = keyof typeof Feedback;

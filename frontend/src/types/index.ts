// Standardized API response format matching the backend
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  meta?: PaginationMeta;
  error?: ApiErrorPayload;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiErrorPayload {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]> | any[];
  details?: any;
}

// User & Auth Types
export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

export interface AuthResponseData {
  user: User;
  token: string;
}

export interface CurrentUserResponseData {
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Topics Types
export interface TopicListItem {
  id: number;
  title: string;
  createdAt: string;
  totalSessions: number;
  lastSession: {
    id: number;
    startedAt: string;
    endedAt: string | null;
    _count: {
      interactions: number;
    };
  } | null;
}

export interface TopicSessionSummary {
  id: number;
  startedAt: string;
  endedAt: string | null;
  totalInteractions: number;
}

export interface TopicDetail {
  id: number;
  title: string;
  userId: number;
  createdAt: string;
  totalSessions: number;
  sessions: TopicSessionSummary[];
}

export interface CreateTopicPayload {
  title: string;
}

export interface CreateTopicResponseData {
  id: number;
  userId: number;
  title: string;
  createdAt: string;
}

// Interaction & Learning Modes Types
export type InteractionMode = 'LEARN' | 'CHALLENGE' | 'EXPLAIN' | 'VALIDATE';

export type FeedbackType = 'HELPFUL' | 'NOT_HELPFUL';

export interface Interaction {
  id: number;
  sessionId: number;
  mode: InteractionMode;
  question: string;
  response: string;
  feedback: FeedbackType | null;
  createdAt: string;
}

export interface CreateInteractionPayload {
  mode: InteractionMode;
  question: string;
}

export interface FeedbackPayload {
  feedback: FeedbackType;
}

export interface ModeMetadata {
  key: InteractionMode;
  label: string;
  tagline: string;
  description: string;
  badgeColor: string;
  isAvailable: boolean;
}

// Session Types
export interface Session {
  id: number;
  topicId: number;
  startedAt: string;
  endedAt: string | null;
  topic?: {
    id: number;
    title: string;
  };
}

export interface SessionDetail {
  id: number;
  topicId: number;
  topicTitle: string;
  startedAt: string;
  endedAt: string | null;
  isEnded: boolean;
  totalInteractions: number;
  interactions: Interaction[];
}

export interface StartSessionResponseData {
  id: number;
  topicId: number;
  startedAt: string;
  endedAt: string | null;
  topic: {
    id: number;
    title: string;
  };
}

export interface EndSessionResponseData {
  id: number;
  topicId: number;
  startedAt: string;
  endedAt: string;
}

// Dashboard Types
export interface MostStudiedTopic {
  id: number;
  title: string;
  sessionCount: number;
  interactionCount: number;
}

export interface DashboardMetrics {
  topicsStudied: number;
  activeTopics: number;
  numberOfSessions: number;
  questionsAsked: number;
  helpfulResponses: number;
  notHelpfulResponses: number;
  unratedResponses: number;
  mostStudiedTopic: MostStudiedTopic | null;
}

export type InteractionsByMode = Record<InteractionMode, number>;

export interface RecentSessionActivity {
  id: number;
  topicId: number;
  topicTitle: string;
  startedAt: string;
  endedAt: string | null;
  interactionCount: number;
}

export interface RecentInteractionActivity {
  id: number;
  mode: InteractionMode;
  question: string;
  feedback: string | null;
  createdAt: string;
  topicId: number;
  topicTitle: string;
  sessionId: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  interactionsByMode: InteractionsByMode;
  recentActivity: {
    sessions: RecentSessionActivity[];
    interactions: RecentInteractionActivity[];
  };
}

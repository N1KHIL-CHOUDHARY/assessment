'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { dashboardApi, sessionApi } from '@/lib/api';
import { DashboardData } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import {
  MetricCard,
  ModeBreakdownChart,
  MostStudiedTopicCard,
  RecentSessionsList,
  RecentInteractionsList,
} from '@/components/dashboard';
import { Button, CardSkeleton, ErrorAlert, EmptyState } from '@/components/ui';
import { CreateTopicModal } from '@/components/topics/CreateTopicModal';
import {
  BookOpen,
  PlayCircle,
  HelpCircle,
  ThumbsUp,
  PlusCircle,
  RefreshCw,
  Sparkles,
  Layers,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [startingSessionTopicId, setStartingSessionTopicId] = useState<number | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await dashboardApi.getDashboard();
      setData(response);
    } catch (err: any) {
      setError(err?.message || 'Failed to load dashboard metrics. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleStartSession = async (topicId: number) => {
    setStartingSessionTopicId(topicId);
    try {
      const session = await sessionApi.startSession(topicId);
      router.push(`/topics/${topicId}/session/${session.id}`);
    } catch (err: any) {
      setError(err?.message || 'Failed to initiate learning session. Please try again.');
      setStartingSessionTopicId(null);
    }
  };

  const handleTopicCreated = (newTopic: { id: number }) => {
    router.push(`/topics/${newTopic.id}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner & Greeting */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Learning Overview
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome, {user?.username || 'Learner'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track your interactive learning activity, explore topic focus, and review recent AI discussions.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-center">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDashboardData}
            isLoading={isLoading}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            title="Refresh dashboard data"
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<PlusCircle className="w-4 h-4" />}
            className="shadow-sm"
          >
            New Topic
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <ErrorAlert
          title="Dashboard Error"
          message={error}
          onRetry={fetchDashboardData}
          onDismiss={() => setError(null)}
        />
      )}

      {/* Loading State */}
      {isLoading && !data && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CardSkeleton />
            </div>
            <div>
              <CardSkeleton />
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Content */}
      {data && (
        <div className="space-y-8">
          {/* Section 1: Overview Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Topics Studied"
              value={data.metrics.topicsStudied}
              subtitle={`${data.metrics.activeTopics} active with sessions`}
              icon={<BookOpen className="w-5 h-5" />}
              color="indigo"
            />
            <MetricCard
              title="Sessions Started"
              value={data.metrics.numberOfSessions}
              subtitle="Total learning sessions"
              icon={<PlayCircle className="w-5 h-5" />}
              color="purple"
            />
            <MetricCard
              title="Questions Asked"
              value={data.metrics.questionsAsked}
              subtitle="Interactive Q&A prompts"
              icon={<HelpCircle className="w-5 h-5" />}
              color="blue"
            />
            <MetricCard
              title="Helpful Responses"
              value={data.metrics.helpfulResponses}
              subtitle={`${data.metrics.notHelpfulResponses} marked unhelpful`}
              icon={<ThumbsUp className="w-5 h-5" />}
              color="emerald"
            />
          </div>

          {/* Section 2: Mode Breakdown & Most Studied Topic */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ModeBreakdownChart data={data.interactionsByMode} />
            </div>
            <div>
              <MostStudiedTopicCard
                topic={data.metrics.mostStudiedTopic}
                onStartSession={handleStartSession}
                isStartingSession={startingSessionTopicId === data.metrics.mostStudiedTopic?.id}
              />
            </div>
          </div>

          {/* Section 3: Recent Activity Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentSessionsList sessions={data.recentActivity.sessions} />
            <RecentInteractionsList interactions={data.recentActivity.interactions} />
          </div>

          {/* Zero Activity Welcome State */}
          {data.metrics.topicsStudied === 0 && (
            <EmptyState
              icon={<Layers className="w-7 h-7" />}
              title="Ready to begin your learning journey?"
              description="Create your very first topic to start interacting with Cognibloom's AI learning assistant."
              actionLabel="Create First Topic"
              onAction={() => setIsCreateModalOpen(true)}
              className="mt-6"
            />
          )}
        </div>
      )}

      {/* Create Topic Modal */}
      <CreateTopicModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTopicCreated={handleTopicCreated}
      />
    </div>
  );
}

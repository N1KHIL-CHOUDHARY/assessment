'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { topicApi, sessionApi } from '@/lib/api';
import { TopicListItem, CreateTopicResponseData } from '@/types';
import { TopicCard, CreateTopicModal } from '@/components/topics';
import { Button, Input, EmptyState, ErrorAlert, CardSkeleton } from '@/components/ui';
import { BookOpen, PlusCircle, Search, RefreshCw, Sparkles } from 'lucide-react';

export default function TopicsPage() {
  const router = useRouter();

  const [topics, setTopics] = useState<TopicListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [startingSessionTopicId, setStartingSessionTopicId] = useState<number | null>(null);

  const fetchTopics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await topicApi.getTopics();
      setTopics(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load learning topics. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const handleStartSession = async (topicId: number) => {
    setStartingSessionTopicId(topicId);
    try {
      const session = await sessionApi.startSession(topicId);
      router.push(`/topics/${topicId}/session/${session.id}`);
    } catch (err: any) {
      setError(err?.message || 'Failed to start learning session.');
      setStartingSessionTopicId(null);
    }
  };

  const handleTopicCreated = (newTopic: CreateTopicResponseData) => {
    router.push(`/topics/${newTopic.id}`);
  };

  const filteredTopics = topics.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> Study Modules
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Learning Topics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Organize and explore subject areas with Cognibloom&apos;s AI-assisted learning modes.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchTopics}
            isLoading={isLoading}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
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
            Create Topic
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <ErrorAlert
          title="Topics Error"
          message={error}
          onRetry={fetchTopics}
          onDismiss={() => setError(null)}
        />
      )}

      {/* Search & Stats Bar */}
      {topics.length > 0 && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="w-full sm:max-w-xs">
            <Input
              placeholder="Search your topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
              className="h-9 text-xs"
            />
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-1.5 self-end sm:self-center">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>
              Showing <strong className="text-slate-800 font-semibold">{filteredTopics.length}</strong> of{' '}
              <strong className="text-slate-800 font-semibold">{topics.length}</strong> topics
            </span>
          </div>
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading && topics.length === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}

      {/* Empty State: No Topics Created Yet */}
      {!isLoading && topics.length === 0 && (
        <EmptyState
          icon={<BookOpen className="w-7 h-7" />}
          title="You haven't started learning anything yet."
          description="Create your first topic to dive into deep Q&A, conceptual discussions, and adaptive AI sessions."
          actionLabel="Create your first topic"
          onAction={() => setIsCreateModalOpen(true)}
          className="my-8"
        />
      )}

      {/* Empty State: Search Query Yielded 0 Results */}
      {!isLoading && topics.length > 0 && filteredTopics.length === 0 && (
        <EmptyState
          icon={<Search className="w-7 h-7" />}
          title="No topics match your search"
          description={`We couldn't find any topics matching "${searchQuery}". Try a different keyword or create a new topic.`}
          actionLabel="Clear Search"
          onAction={() => setSearchQuery('')}
          className="my-8"
        />
      )}

      {/* Topics Grid */}
      {!isLoading && filteredTopics.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onStartSession={handleStartSession}
              isStartingSession={startingSessionTopicId === topic.id}
            />
          ))}
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

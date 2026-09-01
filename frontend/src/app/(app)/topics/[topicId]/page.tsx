'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { topicApi, sessionApi } from '@/lib/api';
import { TopicDetail as TopicDetailType } from '@/types';
import { Button, Card, Badge, ErrorAlert, Spinner } from '@/components/ui';
import {
  BookOpen,
  Play,
  Clock,
  ArrowLeft,
  MessageSquare,
  Sparkles,
  Calendar,
  CheckCircle,
  PlayCircle,
  ArrowRight,
} from 'lucide-react';
import { formatDate, formatRelativeTime, formatDuration } from '@/utils/formatters';

export default function TopicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params?.topicId as string;

  const [topic, setTopic] = useState<TopicDetailType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isStartingSession, setIsStartingSession] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTopicDetail = useCallback(async () => {
    if (!topicId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await topicApi.getTopicById(Number(topicId));
      setTopic(data);
    } catch (err: any) {
      setError(err?.message || 'Topic could not be found.');
    } finally {
      setIsLoading(false);
    }
  }, [topicId]);

  useEffect(() => {
    fetchTopicDetail();
  }, [fetchTopicDetail]);

  const handleStartSession = async () => {
    if (!topic) return;
    setIsStartingSession(true);
    try {
      const newSession = await sessionApi.startSession(topic.id);
      router.push(`/topics/${topic.id}/session/${newSession.id}`);
    } catch (err: any) {
      setError(err?.message || 'Failed to start learning session. Please try again.');
      setIsStartingSession(false);
    }
  };

  if (isLoading) {
    return <Spinner size="xl" label="Loading topic..." className="py-20" />;
  }

  if (error || !topic) {
    return (
      <div className="max-w-xl mx-auto py-12 space-y-4">
        <ErrorAlert
          title="Topic Error"
          message={error || 'Unable to display topic details.'}
          onRetry={fetchTopicDetail}
        />
        <Link href="/topics" className="inline-flex items-center gap-1.5 text-xs text-indigo-600 font-medium">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to all topics
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Navigation Breadcrumb */}
      <div>
        <Link
          href="/topics"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 font-medium transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Topics
        </Link>
      </div>

      {/* Hero Header Card */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-white/15 px-2.5 py-0.5 rounded-full text-indigo-200 backdrop-blur-xs flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> Topic Focus
              </span>
              <span className="text-xs text-indigo-200/80">Created {formatDate(topic.createdAt)}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              {topic.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-indigo-100/90 pt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-300" />
                {topic.totalSessions} Learning {topic.totalSessions === 1 ? 'Session' : 'Sessions'} Completed
              </span>
            </div>
          </div>

          {/* Primary CTA */}
          <div className="shrink-0 self-start md:self-center">
            <Button
              variant="primary"
              size="lg"
              onClick={handleStartSession}
              isLoading={isStartingSession}
              leftIcon={<Play className="w-5 h-5 fill-current" />}
              rightIcon={<Sparkles className="w-4 h-4" />}
              className="bg-white text-indigo-900 hover:bg-indigo-50 border-0 shadow-lg hover:shadow-indigo-500/20 font-bold px-6 h-12"
            >
              Start Learning
            </Button>
          </div>
        </div>
      </div>

      {/* Previous Sessions History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Learning Sessions History</h2>
            <p className="text-xs text-slate-500">
              Review past interactions, AI dialogues, and feedback given in this topic.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleStartSession}
            isLoading={isStartingSession}
            leftIcon={<PlayCircle className="w-4 h-4" />}
            className="text-xs"
          >
            Start New Session
          </Button>
        </div>

        {topic.sessions.length === 0 ? (
          <Card className="text-center py-12 border-dashed border-2 border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">No sessions recorded yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
              Begin your first AI-guided learning session for &quot;{topic.title}&quot; right now.
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={handleStartSession}
              isLoading={isStartingSession}
              leftIcon={<Play className="w-4 h-4 fill-current" />}
            >
              Start Learning Session
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {topic.sessions.map((session, index) => {
              const isEnded = !!session.endedAt;
              return (
                <Card
                  key={session.id}
                  hoverable
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        Session #{topic.sessions.length - index}
                      </span>
                      {isEnded ? (
                        <Badge variant="secondary" className="text-[10px] py-0">
                          <CheckCircle className="w-2.5 h-2.5 mr-1" />
                          Ended
                        </Badge>
                      ) : (
                        <Badge variant="success" dot className="text-[10px] py-0">
                          In Progress
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        Started: {formatDate(session.startedAt)} ({formatRelativeTime(session.startedAt)})
                      </span>
                      <span>•</span>
                      <span>Duration: {formatDuration(session.startedAt, session.endedAt)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <MessageSquare className="w-3 h-3 text-indigo-500" />
                        {session.totalInteractions} {session.totalInteractions === 1 ? 'question' : 'questions'}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <Link href={`/topics/${topic.id}/session/${session.id}`} className="w-full sm:w-auto">
                      <Button variant={isEnded ? 'outline' : 'primary'} size="sm" className="w-full sm:w-auto text-xs">
                        <span>{isEnded ? 'Review Session' : 'Continue Session'}</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

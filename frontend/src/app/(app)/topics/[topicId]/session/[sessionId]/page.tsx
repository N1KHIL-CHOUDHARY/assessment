'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { sessionApi, interactionApi } from '@/lib/api';
import { SessionDetail, Interaction, InteractionMode, FeedbackType } from '@/types';
import { SessionHeader, ModeSelector, QuestionInput } from '@/components/sessions';
import { InteractionBubble } from '@/components/interactions';
import { Spinner, ErrorAlert, EmptyState } from '@/components/ui';
import { MessageSquare, Sparkles, Loader2 } from 'lucide-react';

export default function LearningSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params?.sessionId as string;

  const [session, setSession] = useState<SessionDetail | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [selectedMode, setSelectedMode] = useState<InteractionMode>('LEARN');
  const [isLoadingSession, setIsLoadingSession] = useState<boolean>(true);
  const [isAskingAI, setIsAskingAI] = useState<boolean>(false);
  const [isEndingSession, setIsEndingSession] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const bottomScrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback((smooth = true) => {
    if (bottomScrollRef.current) {
      bottomScrollRef.current.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        block: 'end',
      });
    }
  }, []);

  // Fetch session data
  const fetchSession = useCallback(async () => {
    if (!sessionId) return;
    setIsLoadingSession(true);
    setError(null);
    try {
      const data = await sessionApi.getSessionById(Number(sessionId));
      setSession(data);
      setInteractions(data.interactions || []);
      setTimeout(() => scrollToBottom(false), 100);
    } catch (err: any) {
      setError(err?.message || 'Failed to load learning session.');
    } finally {
      setIsLoadingSession(false);
    }
  }, [sessionId, scrollToBottom]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  // Handle asking AI
  const handleAskQuestion = async (questionText: string) => {
    if (!sessionId || !session || session.isEnded || isAskingAI) return;

    setIsAskingAI(true);
    setError(null);

    setTimeout(() => scrollToBottom(true), 50);

    try {
      const newInteraction = await interactionApi.createInteraction(Number(sessionId), {
        mode: selectedMode,
        question: questionText,
      });

      setInteractions((prev) => [...prev, newInteraction]);
      setSession((prev) =>
        prev
          ? {
              ...prev,
              totalInteractions: prev.totalInteractions + 1,
            }
          : prev
      );

      setTimeout(() => scrollToBottom(true), 100);
    } catch (err: any) {
      setError(err?.message || 'Failed to process AI question. Please try again.');
    } finally {
      setIsAskingAI(false);
    }
  };

  // Handle interaction feedback (optimistic update)
  const handleFeedback = async (interactionId: number, feedback: FeedbackType) => {
    setInteractions((prev) =>
      prev.map((item) => (item.id === interactionId ? { ...item, feedback } : item))
    );

    try {
      await interactionApi.submitFeedback(interactionId, { feedback });
    } catch (err: any) {
      console.error('Failed to submit feedback:', err);
      setError('Feedback could not be submitted. Please try again.');
      fetchSession();
    }
  };

  // Handle ending session
  const handleEndSession = async () => {
    if (!sessionId || !session || session.isEnded || isEndingSession) return;

    if (!window.confirm('Are you sure you want to end this learning session?')) {
      return;
    }

    setIsEndingSession(true);
    setError(null);
    try {
      const endedData = await sessionApi.endSession(Number(sessionId));
      setSession((prev) =>
        prev
          ? {
              ...prev,
              isEnded: true,
              endedAt: endedData.endedAt,
            }
          : prev
      );
    } catch (err: any) {
      setError(err?.message || 'Failed to end learning session.');
    } finally {
      setIsEndingSession(false);
    }
  };

  if (isLoadingSession) {
    return <Spinner size="xl" label="Loading learning session..." className="py-20" />;
  }

  if (error && !session) {
    return (
      <div className="max-w-xl mx-auto py-12 space-y-4">
        <ErrorAlert
          title="Session Error"
          message={error}
          onRetry={fetchSession}
        />
        <button
          onClick={() => router.push('/topics')}
          className="text-xs text-indigo-600 font-medium hover:underline"
        >
          Return to Topics
        </button>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="flex flex-col min-h-[calc(100vh-12rem)] max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Session Header */}
      <SessionHeader
        topicId={session.topicId}
        topicTitle={session.topicTitle}
        startedAt={session.startedAt}
        endedAt={session.endedAt}
        isEnded={session.isEnded}
        totalInteractions={interactions.length}
        onEndSession={handleEndSession}
        isEndingSession={isEndingSession}
      />

      {/* Inline Error Alert */}
      {error && (
        <div className="mb-4">
          <ErrorAlert message={error} onDismiss={() => setError(null)} />
        </div>
      )}

      {/* Main Conversation Stream */}
      <div className="flex-1 space-y-4 pb-6">
        {interactions.length === 0 ? (
          <EmptyState
            icon={<MessageSquare className="w-7 h-7" />}
            title="Start your first inquiry"
            description={`Ask anything about "${session.topicTitle}". Cognibloom AI will provide structured explanations, examples, and adaptive follow-ups.`}
            className="my-8 bg-white/60 border-slate-200"
          />
        ) : (
          interactions.map((interaction) => (
            <InteractionBubble
              key={interaction.id}
              interaction={interaction}
              onFeedback={handleFeedback}
              isSessionEnded={session.isEnded}
            />
          ))
        )}

        {/* AI Thinking Indicator */}
        {isAskingAI && (
          <div className="flex items-start gap-3 max-w-4xl mr-auto py-2 animate-in fade-in">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-sm border border-indigo-100 shadow-sm p-4 text-slate-600 flex items-center gap-3">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span className="text-xs font-medium text-slate-700 animate-pulse">
                Cognibloom AI is formulating an adaptive response for {session.topicTitle}...
              </span>
            </div>
          </div>
        )}

        <div ref={bottomScrollRef} className="h-1" />
      </div>

      {/* Sticky Bottom Prompt & Mode Selector */}
      <div className="sticky bottom-4 z-30 pt-2 space-y-3 bg-gradient-to-t from-slate-50 via-slate-50/95 to-transparent pb-1">
        {!session.isEnded && (
          <ModeSelector
            currentMode={selectedMode}
            onSelectMode={setSelectedMode}
            disabled={isAskingAI || session.isEnded}
          />
        )}

        <QuestionInput
          topicTitle={session.topicTitle}
          mode={selectedMode}
          onSubmit={handleAskQuestion}
          isLoading={isAskingAI}
          isSessionEnded={session.isEnded}
        />
      </div>
    </div>
  );
}

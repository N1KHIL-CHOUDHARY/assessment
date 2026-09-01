'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, StopCircle, CheckCircle, Sparkles } from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { formatDate, formatDuration } from '@/utils/formatters';

interface SessionHeaderProps {
  topicId: number;
  topicTitle: string;
  startedAt: string;
  endedAt: string | null;
  isEnded: boolean;
  totalInteractions: number;
  onEndSession: () => void;
  isEndingSession?: boolean;
}

export const SessionHeader: React.FC<SessionHeaderProps> = ({
  topicId,
  topicTitle,
  startedAt,
  endedAt,
  isEnded,
  totalInteractions,
  onEndSession,
  isEndingSession = false,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-subtle mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Topic Title and Breadcrumb */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link
              href={`/topics/${topicId}`}
              className="inline-flex items-center gap-1 hover:text-indigo-600 font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Topic</span>
            </Link>
            <span>/</span>
            <span className="flex items-center gap-1 text-slate-400">
              <BookOpen className="w-3 h-3" />
              Topic #{topicId}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {topicTitle}
            </h1>
            {isEnded ? (
              <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-slate-300">
                <CheckCircle className="w-3 h-3 mr-1 text-slate-500" />
                Session Ended
              </Badge>
            ) : (
              <Badge variant="success" dot>
                Live Learning Session
              </Badge>
            )}
          </div>

          {/* Session Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Started: <span className="font-medium text-slate-700">{formatDate(startedAt)}</span>
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span>
              Duration: <span className="font-medium text-slate-700">{formatDuration(startedAt, endedAt)}</span>
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="flex items-center gap-1 font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              {totalInteractions} {totalInteractions === 1 ? 'Interaction' : 'Interactions'}
            </span>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3 self-start md:self-center">
          {!isEnded ? (
            <Button
              variant="danger"
              size="sm"
              onClick={onEndSession}
              isLoading={isEndingSession}
              leftIcon={<StopCircle className="w-4 h-4" />}
            >
              End Session
            </Button>
          ) : (
            <Link href={`/topics/${topicId}`}>
              <Button variant="outline" size="sm">
                View Topic Summary
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

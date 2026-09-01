'use client';

import React from 'react';
import Link from 'next/link';
import { TopicListItem } from '@/types';
import { BookOpen, Clock, Play, ArrowRight, MessageSquare } from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { formatRelativeTime } from '@/utils/formatters';

interface TopicCardProps {
  topic: TopicListItem;
  onStartSession?: (topicId: number) => void;
  isStartingSession?: boolean;
}

export const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  onStartSession,
  isStartingSession = false,
}) => {
  return (
    <Card hoverable className="flex flex-col justify-between group transition-all duration-200">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <BookOpen className="w-5 h-5" />
          </div>
          <Badge variant={topic.totalSessions > 0 ? 'primary' : 'secondary'}>
            {topic.totalSessions} {topic.totalSessions === 1 ? 'Session' : 'Sessions'}
          </Badge>
        </div>

        {/* Title */}
        <Link href={`/topics/${topic.id}`}>
          <h3 className="text-base font-bold text-slate-900 line-clamp-2 hover:text-indigo-600 transition-colors mb-2">
            {topic.title}
          </h3>
        </Link>

        {/* Meta Stats */}
        <div className="space-y-1.5 text-xs text-slate-500 mb-6">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Last activity:{' '}
              <strong className="text-slate-700 font-medium">
                {topic.lastSession
                  ? formatRelativeTime(topic.lastSession.startedAt)
                  : formatRelativeTime(topic.createdAt)}
              </strong>
            </span>
          </div>

          {topic.lastSession && (
            <div className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
              <span>
                Latest session:{' '}
                <strong className="text-slate-700 font-medium">
                  {topic.lastSession._count.interactions} questions
                </strong>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-4 border-t border-slate-100 mt-auto">
        <Link href={`/topics/${topic.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full text-xs">
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>

        {onStartSession && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onStartSession(topic.id)}
            isLoading={isStartingSession}
            leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
            className="text-xs"
            title="Start Learning Session"
          >
            Learn
          </Button>
        )}
      </div>
    </Card>
  );
};

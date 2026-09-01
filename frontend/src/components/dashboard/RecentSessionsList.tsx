'use client';

import React from 'react';
import Link from 'next/link';
import { RecentSessionActivity } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Button } from '@/components/ui';
import { Clock, MessageSquare, ArrowRight, Play, CheckCircle } from 'lucide-react';
import { formatRelativeTime } from '@/utils/formatters';

interface RecentSessionsListProps {
  sessions: RecentSessionActivity[];
}

export const RecentSessionsList: React.FC<RecentSessionsListProps> = ({ sessions }) => {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle>Recent Learning Sessions</CardTitle>
          <CardDescription>Latest study sessions you initiated</CardDescription>
        </div>
        <Link href="/topics">
          <Button variant="ghost" size="sm" className="text-xs text-indigo-600 hover:text-indigo-700 h-8">
            <span>All Topics</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
      </CardHeader>

      <CardContent>
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
            No recent sessions found. Start a topic session to begin learning!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {sessions.map((session) => {
              const isEnded = !!session.endedAt;
              return (
                <div
                  key={session.id}
                  className="py-3 flex items-center justify-between gap-3 group hover:bg-slate-50/70 -mx-2 px-2 rounded-lg transition-colors"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/topics/${session.topicId}/session/${session.id}`}
                        className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate block"
                      >
                        {session.topicTitle}
                      </Link>
                      {isEnded ? (
                        <Badge variant="secondary" className="text-[10px] px-2 py-0">
                          <CheckCircle className="w-2.5 h-2.5 mr-1" />
                          Ended
                        </Badge>
                      ) : (
                        <Badge variant="success" dot className="text-[10px] px-2 py-0">
                          Active
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {formatRelativeTime(session.startedAt)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3 text-slate-400" />
                        {session.interactionCount} {session.interactionCount === 1 ? 'question' : 'questions'}
                      </span>
                    </div>
                  </div>

                  <Link href={`/topics/${session.topicId}/session/${session.id}`}>
                    <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs">
                      {isEnded ? (
                        <span>Review</span>
                      ) : (
                        <span className="flex items-center gap-1 text-indigo-600">
                          <Play className="w-3 h-3 fill-current" />
                          Resume
                        </span>
                      )}
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

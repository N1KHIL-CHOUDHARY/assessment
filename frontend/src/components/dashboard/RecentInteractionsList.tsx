'use client';

import React from 'react';
import Link from 'next/link';
import { RecentInteractionActivity } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from '@/components/ui';
import { Clock, ThumbsUp, ThumbsDown, ArrowUpRight } from 'lucide-react';
import { formatRelativeTime } from '@/utils/formatters';
import { getModeMetadata } from '@/utils/modeConstants';
import { cn } from '@/lib/utils';

interface RecentInteractionsListProps {
  interactions: RecentInteractionActivity[];
}

export const RecentInteractionsList: React.FC<RecentInteractionsListProps> = ({ interactions }) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle>Recent Questions & AI Insights</CardTitle>
        <CardDescription>Questions you recently explored with Cognibloom AI</CardDescription>
      </CardHeader>

      <CardContent>
        {interactions.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
            No questions asked yet. Choose a topic and start your first conversation!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {interactions.map((item) => {
              const modeMeta = getModeMetadata(item.mode);
              return (
                <div key={item.id} className="py-3.5 space-y-2 group">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={cn(
                          'text-[10px] font-bold uppercase px-2 py-0.5 rounded border',
                          modeMeta.badgeColor
                        )}
                      >
                        {modeMeta.label}
                      </span>
                      <Link
                        href={`/topics/${item.topicId}`}
                        className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors truncate max-w-[200px]"
                      >
                        {item.topicTitle}
                      </Link>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0">
                      <span className="flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {formatRelativeTime(item.createdAt)}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/topics/${item.topicId}/session/${item.sessionId}`}
                    className="block group-hover:text-indigo-600 transition-colors"
                  >
                    <p className="text-xs sm:text-sm font-medium text-slate-800 line-clamp-2 leading-relaxed">
                      &quot;{item.question}&quot;
                    </p>
                  </Link>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center gap-2">
                      {item.feedback === 'HELPFUL' && (
                        <Badge variant="success" className="text-[10px] gap-1 py-0">
                          <ThumbsUp className="w-2.5 h-2.5" />
                          Helpful
                        </Badge>
                      )}
                      {item.feedback === 'NOT_HELPFUL' && (
                        <Badge variant="danger" className="text-[10px] gap-1 py-0">
                          <ThumbsDown className="w-2.5 h-2.5" />
                          Not Helpful
                        </Badge>
                      )}
                      {!item.feedback && (
                        <span className="text-[11px] text-slate-400 italic">No feedback provided</span>
                      )}
                    </div>

                    <Link
                      href={`/topics/${item.topicId}/session/${item.sessionId}`}
                      className="text-[11px] font-medium text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Open Session</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

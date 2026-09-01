'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from '@/components/ui';
import { MostStudiedTopic } from '@/types';
import { Trophy, BookOpen, MessageSquare, Play, ArrowRight } from 'lucide-react';

interface MostStudiedTopicCardProps {
  topic: MostStudiedTopic | null;
  onStartSession?: (topicId: number) => void;
  isStartingSession?: boolean;
}

export const MostStudiedTopicCard: React.FC<MostStudiedTopicCardProps> = ({
  topic,
  onStartSession,
  isStartingSession = false,
}) => {
  if (!topic) {
    return (
      <Card className="h-full flex flex-col justify-center text-center p-6 bg-gradient-to-b from-white to-slate-50">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
          <BookOpen className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-slate-800 mb-1">No Most Studied Topic Yet</h4>
        <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">
          Start a learning session to build your study history and see your top topic here.
        </p>
        <Link href="/topics" className="inline-block">
          <Button variant="outline" size="sm">
            Browse Topics
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col justify-between relative overflow-hidden border-indigo-200/80 shadow-card bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/30">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

      <div>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center shrink-0">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded">
                Top Focus
              </span>
              <CardTitle className="text-base mt-1">Most Studied Topic</CardTitle>
            </div>
          </div>
          <CardDescription>The subject you have explored the most</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Link href={`/topics/${topic.id}`} className="group block">
            <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
              {topic.title}
            </h3>
          </Link>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-white/80 backdrop-blur-xs rounded-xl p-3 border border-slate-200/80 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Sessions</span>
              </div>
              <span className="text-xl font-bold text-slate-900">{topic.sessionCount}</span>
            </div>

            <div className="bg-white/80 backdrop-blur-xs rounded-xl p-3 border border-slate-200/80 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
                <span>Questions</span>
              </div>
              <span className="text-xl font-bold text-slate-900">{topic.interactionCount}</span>
            </div>
          </div>
        </CardContent>
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-slate-100/80 mt-4">
        <Link href={`/topics/${topic.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full text-xs">
            <span>View Topic</span>
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
          >
            Continue
          </Button>
        )}
      </div>
    </Card>
  );
};

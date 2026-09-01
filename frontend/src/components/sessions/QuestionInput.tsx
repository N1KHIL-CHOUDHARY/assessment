'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, CornerDownLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui';
import { InteractionMode } from '@/types';

interface QuestionInputProps {
  topicTitle: string;
  mode: InteractionMode;
  onSubmit: (question: string) => Promise<void>;
  isLoading: boolean;
  isSessionEnded: boolean;
}

export const QuestionInput: React.FC<QuestionInputProps> = ({
  topicTitle,
  mode,
  onSubmit,
  isLoading,
  isSessionEnded,
}) => {
  const [question, setQuestion] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [question]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || isLoading || isSessionEnded) return;

    await onSubmit(trimmed);
    setQuestion('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const getPlaceholder = () => {
    switch (mode) {
      case 'LEARN':
        return `Ask anything about ${topicTitle} (e.g. "Explain the core mechanics and trade-offs")...`;
      case 'CHALLENGE':
        return `Ask for a challenge scenario or test question on ${topicTitle}...`;
      case 'EXPLAIN':
        return `Explain a concept in ${topicTitle} in your own words to get AI critique...`;
      case 'VALIDATE':
        return `Ask to validate a hypothesis or best practice in ${topicTitle}...`;
    }
  };

  if (isSessionEnded) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-100/80 p-5 text-center shadow-xs">
        <div className="flex items-center justify-center gap-2 text-slate-700 font-semibold text-sm mb-1">
          <AlertCircle className="w-4 h-4 text-slate-500" />
          <span>This learning session has ended</span>
        </div>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          You can review the conversation and feedback above, or start a fresh session from the Topic page.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-slate-300/80 shadow-lg p-3 transition-all focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20"
    >
      <div className="relative flex flex-col">
        <textarea
          ref={textareaRef}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={getPlaceholder()}
          disabled={isLoading || isSessionEnded}
          rows={2}
          className="w-full resize-none border-0 bg-transparent px-2 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:opacity-50"
        />

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 px-1 mt-1">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="hidden sm:inline-flex items-center gap-1">
              <CornerDownLeft className="w-3 h-3" /> Press <kbd className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[10px] text-slate-600">Enter</kbd> to ask
            </span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!question.trim() || isLoading}
            isLoading={isLoading}
            leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            rightIcon={<Send className="w-3.5 h-3.5" />}
            className="h-8 px-3.5 text-xs font-semibold shadow-xs"
          >
            Ask AI
          </Button>
        </div>
      </div>
    </form>
  );
};

'use client';

import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Check, Loader2 } from 'lucide-react';
import { FeedbackType } from '@/types';
import { cn } from '@/lib/utils';

interface FeedbackButtonsProps {
  currentFeedback: FeedbackType | null;
  onFeedback: (feedback: FeedbackType) => Promise<void>;
  disabled?: boolean;
}

export const FeedbackButtons: React.FC<FeedbackButtonsProps> = ({
  currentFeedback,
  onFeedback,
  disabled = false,
}) => {
  const [submittingFeedback, setSubmittingFeedback] = useState<FeedbackType | null>(null);

  const handleFeedbackClick = async (feedback: FeedbackType) => {
    if (disabled || submittingFeedback || currentFeedback === feedback) return;
    setSubmittingFeedback(feedback);
    try {
      await onFeedback(feedback);
    } finally {
      setSubmittingFeedback(null);
    }
  };

  const isHelpful = currentFeedback === 'HELPFUL';
  const isNotHelpful = currentFeedback === 'NOT_HELPFUL';

  return (
    <div className="flex items-center gap-2 pt-2 text-xs">
      <span className="text-[11px] font-medium text-slate-400 mr-1">Was this helpful?</span>

      {/* Helpful Button */}
      <button
        type="button"
        disabled={disabled || submittingFeedback !== null}
        onClick={() => handleFeedbackClick('HELPFUL')}
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium border transition-all duration-150',
          isHelpful
            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs font-semibold'
            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        title="Helpful response"
      >
        {submittingFeedback === 'HELPFUL' ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
        ) : isHelpful ? (
          <Check className="w-3.5 h-3.5 text-emerald-600" />
        ) : (
          <ThumbsUp className="w-3.5 h-3.5" />
        )}
        <span>Helpful</span>
      </button>

      {/* Not Helpful Button */}
      <button
        type="button"
        disabled={disabled || submittingFeedback !== null}
        onClick={() => handleFeedbackClick('NOT_HELPFUL')}
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium border transition-all duration-150',
          isNotHelpful
            ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-xs font-semibold'
            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        title="Not helpful response"
      >
        {submittingFeedback === 'NOT_HELPFUL' ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600" />
        ) : isNotHelpful ? (
          <Check className="w-3.5 h-3.5 text-rose-600" />
        ) : (
          <ThumbsDown className="w-3.5 h-3.5" />
        )}
        <span>Not Helpful</span>
      </button>
    </div>
  );
};

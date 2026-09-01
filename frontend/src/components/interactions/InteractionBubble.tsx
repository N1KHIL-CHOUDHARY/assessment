import React from 'react';
import { Interaction, FeedbackType } from '@/types';
import { Sparkles, User as UserIcon, Clock } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { FeedbackButtons } from './FeedbackButtons';
import { getModeMetadata } from '@/utils/modeConstants';
import { formatRelativeTime } from '@/utils/formatters';
import { cn } from '@/lib/utils';

interface InteractionBubbleProps {
  interaction: Interaction;
  onFeedback: (interactionId: number, feedback: FeedbackType) => Promise<void>;
  isSessionEnded?: boolean;
}

export const InteractionBubble: React.FC<InteractionBubbleProps> = ({
  interaction,
  onFeedback,
  isSessionEnded = false,
}) => {
  const modeMeta = getModeMetadata(interaction.mode);

  return (
    <div className="space-y-4 py-2">
      {/* User Question */}
      <div className="flex items-start justify-end gap-3 max-w-3xl ml-auto">
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {formatRelativeTime(interaction.createdAt)}
            </span>
            <span className="text-xs font-bold text-slate-800">You</span>
          </div>
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm max-w-2xl text-sm leading-relaxed whitespace-pre-wrap">
            {interaction.question}
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center justify-center shrink-0 shadow-2xs mt-1">
          <UserIcon className="w-4 h-4" />
        </div>
      </div>

      {/* Cognibloom AI Response */}
      <div className="flex items-start gap-3 max-w-4xl mr-auto">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
          <Sparkles className="w-4 h-4" />
        </div>

        <div className="flex-1 space-y-2">
          {/* Header info */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-gradient-to-r from-indigo-900 to-purple-900 bg-clip-text text-transparent">
              Cognibloom AI
            </span>
            <span
              className={cn(
                'text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border',
                modeMeta.badgeColor
              )}
            >
              {modeMeta.label}
            </span>
          </div>

          {/* AI Content Box */}
          <div className="bg-white rounded-2xl rounded-tl-sm border border-slate-200/90 shadow-card p-5 text-slate-800">
            <MarkdownRenderer content={interaction.response} />

            {/* Feedback Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <FeedbackButtons
                currentFeedback={interaction.feedback}
                onFeedback={(feedback) => onFeedback(interaction.id, feedback)}
                disabled={isSessionEnded}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { InteractionMode } from '@/types';
import { LEARNING_MODES } from '@/utils/modeConstants';
import { Sparkles, Brain, Compass, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModeSelectorProps {
  currentMode: InteractionMode;
  onSelectMode: (mode: InteractionMode) => void;
  disabled?: boolean;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  onSelectMode,
  disabled = false,
}) => {
  const getModeIcon = (key: InteractionMode) => {
    switch (key) {
      case 'LEARN':
        return <Brain className="w-3.5 h-3.5" />;
      case 'CHALLENGE':
        return <Sparkles className="w-3.5 h-3.5" />;
      case 'EXPLAIN':
        return <Compass className="w-3.5 h-3.5" />;
      case 'VALIDATE':
        return <CheckCircle2 className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Learning Mode
        </label>
        <span className="text-[11px] text-indigo-600 font-medium hidden sm:inline">
          {LEARNING_MODES.find((m) => m.key === currentMode)?.tagline}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {LEARNING_MODES.map((mode) => {
          const isSelected = currentMode === mode.key;
          return (
            <button
              key={mode.key}
              type="button"
              disabled={disabled}
              onClick={() => onSelectMode(mode.key)}
              className={cn(
                'flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all duration-150',
                isSelected
                  ? 'bg-indigo-50/90 border-indigo-300 text-indigo-900 shadow-xs ring-1 ring-indigo-500/20'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div
                className={cn(
                  'p-1.5 rounded-lg flex items-center justify-center shrink-0',
                  isSelected ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-500'
                )}
              >
                {getModeIcon(mode.key)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold block truncate">{mode.label}</span>
                </div>
                <span className="text-[10px] text-slate-500 block truncate">{mode.tagline}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

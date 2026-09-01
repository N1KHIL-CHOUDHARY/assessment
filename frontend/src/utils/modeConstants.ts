import { InteractionMode, ModeMetadata } from '@/types';

export const LEARNING_MODES: ModeMetadata[] = [
  {
    key: 'LEARN',
    label: 'Learn',
    tagline: 'Interactive Q&A',
    description: 'Ask deep conceptual questions, receive tailored AI explanations, and break down complex ideas step-by-step.',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    isAvailable: true,
  },
  {
    key: 'CHALLENGE',
    label: 'Challenge',
    tagline: 'Socratic Testing',
    description: 'The AI tests your knowledge by posing challenging scenarios and probing questions to test edge cases.',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    isAvailable: true,
  },
  {
    key: 'EXPLAIN',
    label: 'Explain',
    tagline: 'Feynman Technique',
    description: 'Explain a topic in your own words. The AI critiques your mental model and identifies gaps in understanding.',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    isAvailable: true,
  },
  {
    key: 'VALIDATE',
    label: 'Validate',
    tagline: 'Concept Assessment',
    description: 'Validate key principles against industry best practices and verify accuracy of hypotheses.',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    isAvailable: true,
  },
];

export function getModeMetadata(mode: InteractionMode | string): ModeMetadata {
  const found = LEARNING_MODES.find((m) => m.key === mode);
  return (
    found || {
      key: 'LEARN',
      label: mode,
      tagline: 'Learning Session',
      description: 'Active learning mode',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
      isAvailable: true,
    }
  );
}

import React from 'react';
import { Brain, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white/60 py-6 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-indigo-600" />
          <span className="font-semibold text-slate-700">Cognibloom</span>
          <span>&copy; {new Date().getFullYear()} — Adaptive Learning Platform</span>
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          <span>for curious minds</span>
        </div>
      </div>
    </footer>
  );
};

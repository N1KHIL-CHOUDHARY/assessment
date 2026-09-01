import React from 'react';
import Link from 'next/link';
import { Brain, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 shadow-sm">
        <Brain className="w-8 h-8" />
      </div>
      <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">
        Error 404
      </span>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
        Page Not Found
      </h1>
      <p className="text-sm text-slate-500 max-w-md mb-8">
        The learning page or resource you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </p>

      <div className="flex items-center gap-3">
        <Link href="/dashboard">
          <Button variant="primary" size="md" leftIcon={<LayoutDashboard className="w-4 h-4" />}>
            Go to Dashboard
          </Button>
        </Link>
        <Link href="/topics">
          <Button variant="outline" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            View Topics
          </Button>
        </Link>
      </div>
    </div>
  );
}

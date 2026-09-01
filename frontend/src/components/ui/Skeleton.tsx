import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export const Skeleton: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return <div className={cn('animate-pulse rounded-md bg-slate-200/80', className)} {...props} />;
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-40" />
    </div>
  );
};

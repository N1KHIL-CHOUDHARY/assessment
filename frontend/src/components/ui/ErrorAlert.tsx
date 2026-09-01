import React from 'react';
import { AlertCircle, RefreshCw, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export interface ErrorAlertProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  onDismiss,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-900 shadow-sm animate-in fade-in',
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div className="space-y-1 text-left">
          <p className="text-xs font-semibold text-rose-800">{title}</p>
          <p className="text-xs text-rose-700 leading-relaxed">{message}</p>
          {onRetry && (
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                className="bg-white hover:bg-rose-50 border-rose-300 text-rose-800 h-7 text-xs"
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-rose-500 hover:text-rose-700 p-1 rounded-md hover:bg-rose-100 transition-colors"
          aria-label="Dismiss error"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

'use client';

import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm text-muted font-medium">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full h-10 px-3.5 rounded-xl bg-surface-subtle border border-border-subtle',
            'text-foreground placeholder:text-muted/50',
            'focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50',
            'transition-all duration-200',
            error && 'border-danger/50 focus:ring-danger/30 focus:border-danger/50',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
export type { InputProps };

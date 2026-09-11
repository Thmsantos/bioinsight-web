import { cn } from '@/utils/cn';
import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  'data-testid'?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, 'data-testid': testId, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-testid={testId}
        className={cn(
          'rounded-xl border border-slate-200 bg-white p-6 shadow-sm',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
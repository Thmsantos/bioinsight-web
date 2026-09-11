import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import { forwardRef  } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    isLoading?: boolean;
    'data-testid': string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = 'primary',
      isLoading = false,
      disabled,
      'data-testid': testId,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary: 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800',
      secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300 active:bg-slate-400',
      outline: 'border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-100',
      danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
    };

    return (
      <button
        ref={ref}
        data-testid={testId}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          variants[variant],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export type { ButtonProps }

export { Button }
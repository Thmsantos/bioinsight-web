import { cn } from '@/utils/cn';

interface StatusBadgeProps {
  status: 'Completed' | 'Processing' | 'Failed';
  testId?: string;
}

export function StatusBadge({ status, testId }: StatusBadgeProps) {
  const styles = {
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Processing: 'bg-amber-50 text-amber-700 border-amber-200',
    Failed: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <span
      data-testid={testId}
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        styles[status]
      )}
    >
      {status}
    </span>
  );
}
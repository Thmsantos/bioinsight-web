import { Card } from '@/components/ui/Card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  testId?: string;
}

function KpiCard({
  label,
  value,
  unit,
  trend = 'neutral',
  trendValue,
  testId,
}: KpiCardProps) {
  const trendIcons = {
    up: <TrendingUp className="h-4 w-4 text-emerald-500" />,
    down: <TrendingDown className="h-4 w-4 text-amber-500" />,
    neutral: <Minus className="h-4 w-4 text-slate-400" />,
  };

  return (
    <Card data-testid={testId} className="flex flex-col justify-between p-5">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <div className="mt-2 flex items-baseline justify-between">
        <div className="text-2xl font-bold text-slate-900">
          {value} {unit && <span className="text-base font-normal text-slate-500">{unit}</span>}
        </div>
        {trendValue && (
          <div className="flex items-center gap-1 text-xs font-medium text-slate-600">
            {trendIcons[trend]}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
    </Card>
  );
}

export { KpiCard }
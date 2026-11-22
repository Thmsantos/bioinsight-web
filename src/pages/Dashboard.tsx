import { useEffect, useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { UploadPdfModal } from '@/components/dashboard/UploadPdfModal';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Upload, Calendar, RefreshCw, BarChart3, ArrowLeft } from 'lucide-react';
import { reportService } from '@/services/reportService';
import type { Insight } from '@/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type NumericInsightKey =
  | 'weight'
  | 'fatPercentage'
  | 'fatMass'
  | 'visceralFat'
  | 'protein'
  | 'water'
  | 'bmi'
  | 'basalRate'
  | 'waistAndHips';

interface MetricDefinition {
  key: NumericInsightKey;
  label: string;
  unit: string;
  description: string;
  color: string;
  hoverColor: string;
  badgeBg: string;
  badgeText: string;
}

const METRIC_DEFINITIONS: MetricDefinition[] = [
  {
    key: 'weight',
    label: 'Weight',
    unit: 'kg',
    description: 'Total body weight across exams',
    color: '#0284c7',
    hoverColor: '#0369a1',
    badgeBg: 'bg-sky-50',
    badgeText: 'text-sky-700',
  },
  {
    key: 'fatPercentage',
    label: 'Body Fat Percentage',
    unit: '%',
    description: 'Proportion of body fat to total weight',
    color: '#10b981',
    hoverColor: '#059669',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
  },
  {
    key: 'fatMass',
    label: 'Body Fat Mass',
    unit: 'kg',
    description: 'Total weight of fat in the body',
    color: '#f59e0b',
    hoverColor: '#d97706',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
  },
  {
    key: 'visceralFat',
    label: 'Visceral Fat Level',
    unit: 'lvl',
    description: 'Fat stored around internal organs',
    color: '#ef4444',
    hoverColor: '#dc2626',
    badgeBg: 'bg-red-50',
    badgeText: 'text-red-700',
  },
  {
    key: 'protein',
    label: 'Protein',
    unit: 'kg',
    description: 'Essential muscle building block',
    color: '#6366f1',
    hoverColor: '#4f46e5',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700',
  },
  {
    key: 'water',
    label: 'Total Body Water',
    unit: 'L',
    description: 'Hydration and fluid balance',
    color: '#3b82f6',
    hoverColor: '#2563eb',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
  },
  {
    key: 'bmi',
    label: 'BMI (Body Mass Index)',
    unit: 'kg/m²',
    description: 'Weight-to-height ratio indicator',
    color: '#8b5cf6',
    hoverColor: '#7c3aed',
    badgeBg: 'bg-violet-50',
    badgeText: 'text-violet-700',
  },
  {
    key: 'basalRate',
    label: 'Basal Metabolic Rate (BMR)',
    unit: 'kcal',
    description: 'Daily calories burned at rest',
    color: '#f97316',
    hoverColor: '#ea580c',
    badgeBg: 'bg-orange-50',
    badgeText: 'text-orange-700',
  },
  {
    key: 'waistAndHips',
    label: 'Waist-Hip Ratio',
    unit: 'ratio',
    description: 'Body fat distribution indicator',
    color: '#14b8a6',
    hoverColor: '#0d9488',
    badgeBg: 'bg-teal-50',
    badgeText: 'text-teal-700',
  },
];

const ALL_REPORTS_OPTION = 'ALL';

function Dashboard() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [selectedInsightId, setSelectedInsightId] = useState<string>(ALL_REPORTS_OPTION);
  const [loading, setLoading] = useState<boolean>(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const data = await reportService.getInsights();
        if (!isMounted) return;
        setInsights(data);
      } catch (error) {
        if (isMounted) console.error('Failed to load insights:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const isAllMode = selectedInsightId === ALL_REPORTS_OPTION;

  const selectedInsight = useMemo(() => {
    if (isAllMode) return null;
    return insights.find((item) => item._id === selectedInsightId) || null;
  }, [insights, selectedInsightId, isAllMode]);

  const previousInsight = useMemo(() => {
    if (!selectedInsight) return null;
    const currentIndex = insights.findIndex((item) => item._id === selectedInsight._id);
    return currentIndex > 0 ? insights[currentIndex - 1] : null;
  }, [insights, selectedInsight]);

  const trends = useMemo(() => {
    if (!selectedInsight || !previousInsight) {
      return { weight: undefined, fat: undefined };
    }

    const weightDiff = (selectedInsight.weight - previousInsight.weight).toFixed(1);
    const fatDiff = (selectedInsight.fatPercentage - previousInsight.fatPercentage).toFixed(1);

    return {
      weight: {
        trend:
          Number(weightDiff) > 0
            ? ('up' as const)
            : Number(weightDiff) < 0
              ? ('down' as const)
              : ('neutral' as const),
        value: `${Number(weightDiff) > 0 ? '+' : ''}${weightDiff} kg`,
      },
      fat: {
        trend:
          Number(fatDiff) > 0
            ? ('up' as const)
            : Number(fatDiff) < 0
              ? ('down' as const)
              : ('neutral' as const),
        value: `${Number(fatDiff) > 0 ? '+' : ''}${fatDiff}%`,
      },
    };
  }, [selectedInsight, previousInsight]);

  const chartLabels = useMemo(() => {
    return insights.map((item) => {
      const cleanName = item.filename.replace(/\.pdf$/i, '');
      const shortName = cleanName.length > 16 ? `${cleanName.slice(0, 14)}…` : cleanName;
      const dateStr = item.date || new Date(item.createdAt).toLocaleDateString();
      return `${shortName} (${dateStr})`;
    });
  }, [insights]);

  const createChartOptions = (metric: MetricDefinition): ChartOptions<'bar'> => ({
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 12,
        right: 12,
        left: 4,
        bottom: 4,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 14 },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (items) => {
            const idx = items[0]?.dataIndex ?? 0;
            const item = insights[idx];
            return item ? `${item.filename} — ${item.date}` : '';
          },
          label: (context) => {
            const val = context.parsed.y;
            return `${metric.label}: ${val} ${metric.unit}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#334155',
          font: {
            size: 12,
            weight: 600,
          },
          maxRotation: 25,
          minRotation: 0,
        },
      },
      y: {
        beginAtZero: true,
        border: {
          display: false,
        },
        grid: {
          color: '#e2e8f0',
        },
        ticks: {
          color: '#475569',
          font: {
            size: 12,
            weight: 500,
          },
          callback: (value) => `${value} ${metric.unit}`,
        },
      },
    },
  });

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div data-testid="dashboard-page" className="space-y-6">
      {/* Header & File Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Your Body Composition Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            {isAllMode
              ? 'Comparing all your bioimpedance reports side by side.'
              : `Viewing detailed metrics for ${selectedInsight?.filename} (${selectedInsight?.date}).`}
          </p>
        </div>

        {insights.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {!isAllMode && (
              <Button
                type="button"
                variant="outline"
                data-testid="back-to-all-reports-btn"
                onClick={() => setSelectedInsightId(ALL_REPORTS_OPTION)}
                className="text-sm"
              >
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Compare All Reports
              </Button>
            )}

            <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 shadow-sm">
              <Calendar className="h-4 w-4 text-slate-500" />
              <select
                data-testid="select-insight-dropdown"
                value={selectedInsightId}
                onChange={(e) => setSelectedInsightId(e.target.value)}
                className="cursor-pointer bg-transparent text-sm font-semibold text-slate-800 outline-none"
              >
                <option value={ALL_REPORTS_OPTION}>
                  All Reports (Compare All — {insights.length})
                </option>
                {insights.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.filename} ({item.date})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {insights.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <p className="mb-4 text-base text-slate-500">
            No bioimpedance reports found yet. Upload your first InBody PDF below.
          </p>
        </Card>
      ) : isAllMode ? (
        /* DEFAULT MODE: Individual Comparison Bar Chart for Every Attribute */
        <div
          data-testid="all-reports-charts-grid"
          className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          {METRIC_DEFINITIONS.map((metric) => {
            const latestValue = insights[insights.length - 1]?.[metric.key];
            const chartData = {
              labels: chartLabels,
              datasets: [
                {
                  label: `${metric.label} (${metric.unit})`,
                  data: insights.map((item) => item[metric.key]),
                  backgroundColor: metric.color,
                  hoverBackgroundColor: metric.hoverColor,
                  borderRadius: 8,
                  maxBarThickness: 56,
                },
              ],
            };

            return (
              <Card
                key={metric.key}
                data-testid={`chart-card-${metric.key}`}
                className="flex flex-col justify-between transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-slate-400" />
                      <h2 className="text-lg font-bold text-slate-900">
                        {metric.label}
                      </h2>
                    </div>
                    <p className="mt-0.5 text-sm text-slate-500">
                      {metric.description}
                    </p>
                  </div>

                  {latestValue !== undefined && (
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${metric.badgeBg} ${metric.badgeText}`}
                    >
                      Latest: {latestValue} {metric.unit}
                    </span>
                  )}
                </div>

                <div className="h-64 w-full">
                  <Bar data={chartData} options={createChartOptions(metric)} />
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* SINGLE REPORT SELECTED MODE: Cards for All 9 Attributes */
        selectedInsight && (
          <div data-testid="single-report-cards-section" className="space-y-6">
            {/* Primary 4 KPI Cards with Trend Indicators */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <KpiCard
                testId="kpi-latest-weight"
                label="Weight"
                value={selectedInsight.weight}
                unit="kg"
                trend={trends.weight?.trend}
                trendValue={trends.weight?.value}
              />
              <KpiCard
                testId="kpi-body-fat"
                label="Body Fat Percentage"
                value={selectedInsight.fatPercentage}
                unit="%"
                trend={trends.fat?.trend}
                trendValue={trends.fat?.value}
              />
              <KpiCard
                testId="kpi-bmi"
                label="BMI"
                value={selectedInsight.bmi}
                unit="kg/m²"
                trend="neutral"
              />
              <KpiCard
                testId="kpi-bmr"
                label="BMR"
                value={selectedInsight.basalRate}
                unit="kcal"
                trend="neutral"
              />
            </div>

            {/* Remaining 5 Attribute Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <KpiCard
                testId="kpi-fat-mass"
                label="Body Fat Mass"
                value={selectedInsight.fatMass}
                unit="kg"
                trend="neutral"
              />
              <KpiCard
                testId="kpi-visceral-fat"
                label="Visceral Fat Level"
                value={selectedInsight.visceralFat}
                unit="lvl"
                trend="neutral"
              />
              <KpiCard
                testId="kpi-protein"
                label="Protein"
                value={selectedInsight.protein}
                unit="kg"
                trend="neutral"
              />
              <KpiCard
                testId="kpi-water"
                label="Total Body Water"
                value={selectedInsight.water}
                unit="L"
                trend="neutral"
              />
              <KpiCard
                testId="kpi-waist-hips"
                label="Waist-Hip Ratio"
                value={selectedInsight.waistAndHips}
                unit="ratio"
                trend="neutral"
              />
            </div>
          </div>
        )
      )}

      {/* Upload CTA */}
      <div className="flex justify-center py-2">
        <Button
          data-testid="upload-pdf-trigger-btn"
          onClick={() => setIsUploadModalOpen(true)}
          className="w-full max-w-md bg-emerald-600 py-3 text-base shadow-md hover:bg-emerald-700 active:bg-emerald-800"
        >
          <Upload className="mr-2 h-5 w-5" />
          + Upload New InBody PDF
        </Button>
      </div>

      <UploadPdfModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
}

export { Dashboard };
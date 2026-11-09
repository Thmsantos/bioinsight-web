import { useEffect, useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { UploadPdfModal } from '@/components/dashboard/UploadPdfModal';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Upload, Calendar, RefreshCw } from 'lucide-react';
import { reportService } from '@/services/reportService';
import type { Insight } from '@/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [selectedInsightId, setSelectedInsightId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true); 
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);


  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const data = await reportService.getInsights();
        if (!isMounted) return;
        
        setInsights(data);
        if (data.length > 0) {
          setSelectedInsightId(data[data.length - 1]._id);
        }
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

  const currentInsight = useMemo(() => {
    return insights.find((item) => item._id === selectedInsightId) || insights[insights.length - 1];
  }, [insights, selectedInsightId]);

  const previousInsight = useMemo(() => {
    if (!currentInsight) return null;
    const currentIndex = insights.findIndex((item) => item._id === currentInsight._id);
    return currentIndex > 0 ? insights[currentIndex - 1] : null;
  }, [insights, currentInsight]);

  const trends = useMemo(() => {
    if (!currentInsight || !previousInsight) {
      return { weight: undefined, fat: undefined };
    }

    const weightDiff = (currentInsight.weight - previousInsight.weight).toFixed(1);
    const fatDiff = (currentInsight.fatPercentage - previousInsight.fatPercentage).toFixed(1);

    return {
      weight: {
        trend: Number(weightDiff) > 0 ? ('up' as const) : Number(weightDiff) < 0 ? ('down' as const) : ('neutral' as const),
        value: `${Number(weightDiff) > 0 ? '+' : ''}${weightDiff} kg`,
      },
      fat: {
        trend: Number(fatDiff) > 0 ? ('up' as const) : Number(fatDiff) < 0 ? ('down' as const) : ('neutral' as const),
        value: `${Number(fatDiff) > 0 ? '+' : ''}${fatDiff}%`,
      },
    };
  }, [currentInsight, previousInsight]);

  const lineChartData = useMemo(() => {
    const labels = insights.map((item) => item.date || new Date(item.createdAt).toLocaleDateString());
    return {
      labels,
      datasets: [
        {
          label: 'Weight (kg)',
          data: insights.map((item) => item.weight),
          borderColor: '#0284c7',
          backgroundColor: '#0284c7',
          tension: 0.3,
        },
        {
          label: 'Body Fat (%)',
          data: insights.map((item) => item.fatPercentage),
          borderColor: '#10b981',
          backgroundColor: '#10b981',
          tension: 0.3,
        },
        {
          label: 'Fat Mass (kg)',
          data: insights.map((item) => item.fatMass),
          borderColor: '#f59e0b',
          backgroundColor: '#f59e0b',
          tension: 0.3,
        },
      ],
    };
  }, [insights]);

  const barChartData = useMemo(() => {
    if (!currentInsight) {
      return { labels: [], datasets: [] };
    }

    return {
      labels: ['Water (L)', 'Protein (kg)', 'Fat Mass (kg)'],
      datasets: [
        {
          label: 'Body Composition Components',
          data: [currentInsight.water, currentInsight.protein, currentInsight.fatMass],
          backgroundColor: ['#3b82f6', '#6366f1', '#10b981'],
          borderRadius: 6,
        },
      ],
    };
  }, [currentInsight]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div data-testid="dashboard-page" className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Your Body Composition Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Track and compare your bioimpedance evolution over time.
          </p>
        </div>

        {insights.length > 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
            <Calendar className="h-4 w-4 text-slate-500" />
            <select
              data-testid="select-insight-dropdown"
              value={selectedInsightId}
              onChange={(e) => setSelectedInsightId(e.target.value)}
              className="bg-transparent text-sm font-semibold text-slate-700 outline-none cursor-pointer"
            >
              {insights.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.filename} ({item.date})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {currentInsight ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              testId="kpi-latest-weight"
              label="Weight"
              value={currentInsight.weight}
              unit="kg"
              trend={trends.weight?.trend}
              trendValue={trends.weight?.value}
            />
            <KpiCard
              testId="kpi-body-fat"
              label="Body Fat"
              value={currentInsight.fatPercentage}
              unit="%"
              trend={trends.fat?.trend}
              trendValue={trends.fat?.value}
            />
            <KpiCard
              testId="kpi-bmi"
              label="BMI"
              value={currentInsight.bmi}
              trend="neutral"
            />
            <KpiCard
              testId="kpi-bmr"
              label="BMR"
              value={currentInsight.basalRate}
              unit="kcal"
              trend="neutral"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card data-testid="line-chart-card" className="flex flex-col">
              <h2 className="mb-4 text-base font-semibold text-slate-800">
                Evolution History
              </h2>
              <div className="h-64 w-full">
                <Line data={lineChartData} options={chartOptions} />
              </div>
            </Card>

            <Card data-testid="bar-chart-card" className="flex flex-col">
              <h2 className="mb-4 text-base font-semibold text-slate-800">
                Selected Report Metrics ({currentInsight.date})
              </h2>
              <div className="h-64 w-full">
                <Bar data={barChartData} options={chartOptions} />
              </div>
            </Card>
          </div>
        </>
      ) : (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <p className="text-slate-500 mb-4">No bioimpedance reports found yet.</p>
        </Card>
      )}

      <div className="flex justify-center py-2">
        <Button
          data-testid="upload-pdf-trigger-btn"
          onClick={() => setIsUploadModalOpen(true)}
          className="w-full max-w-md bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 py-3 text-base shadow-md"
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
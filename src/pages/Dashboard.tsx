import { useState } from 'react';
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
import { Upload } from 'lucide-react';

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
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const lineChartData = {
    labels: ['Dec 15', 'Dec 22', 'Sep 10', 'Dec 14', 'Nov 15', 'Dec 25'],
    datasets: [
      {
        label: 'Weight (kg)',
        data: [78, 76, 75, 74.2, 74.5, 74.2],
        borderColor: '#0284c7',
        backgroundColor: '#0284c7',
        tension: 0.3,
      },
      {
        label: 'Body Fat (%)',
        data: [25, 24, 23, 22, 21.8, 21.5],
        borderColor: '#10b981',
        backgroundColor: '#10b981',
        tension: 0.3,
      },
      {
        label: 'Skeletal Muscle (kg)',
        data: [32, 33, 33.5, 34, 34.5, 34.8],
        borderColor: '#6366f1',
        backgroundColor: '#6366f1',
        tension: 0.3,
      },
    ],
  };

  const barChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Muscle Mass',
        data: [32, 32.5, 33, 33.8, 34.2, 34.8],
        backgroundColor: '#0284c7',
      },
      {
        label: 'Fat Mass',
        data: [20, 19, 18.5, 17, 16.5, 16],
        backgroundColor: '#10b981',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <div data-testid="dashboard-page" className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        Your Body Composition Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          testId="kpi-latest-weight"
          label="Latest Weight"
          value={74.2}
          unit="kg"
          trend="down"
          trendValue="-0.3 kg"
        />
        <KpiCard
          testId="kpi-body-fat"
          label="Body Fat"
          value="21.5"
          unit="%"
          trend="down"
          trendValue="-0.3%"
        />
        <KpiCard
          testId="kpi-skeletal-muscle"
          label="Skeletal Muscle"
          value={34.8}
          unit="kg"
          trend="up"
          trendValue="+0.3 kg"
        />
        <KpiCard
          testId="kpi-bmr"
          label="BMR"
          value={1710}
          unit="kcal"
          trend="neutral"
          trendValue="0"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card data-testid="line-chart-card" className="flex flex-col">
          <h2 className="mb-4 text-base font-semibold text-slate-800">
            Evolution Progress
          </h2>
          <div className="h-64 w-full">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </Card>

        <Card data-testid="bar-chart-card" className="flex flex-col">
          <h2 className="mb-4 text-base font-semibold text-slate-800">
            Historical Comparisons
          </h2>
          <div className="h-64 w-full">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </Card>
      </div>

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

export { Dashboard }
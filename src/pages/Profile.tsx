import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Download, Trash2, KeyRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { reportService } from '@/services/reportService';
import type { Insight, UserWithoutPassword } from '@/types';
import { storage } from '@/utils/storage';

export function Profile() {
  const [reports, setReports] = useState<Insight[]>([]);
  const user = storage.get<UserWithoutPassword>('user');

  function deleteReport(id: string): void {
    reportService.deleteReport(id);
  }

  useEffect(() => {
    let isMounted = true;

    const loadReports = async () => {
      try {
        const data = await reportService.getInsights();
        if (!isMounted) return;
        
        setReports(data);
      } catch (error) {
        if (isMounted) console.error('Failed to load insights:', error);
      }
    };

    loadReports();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div data-testid="profile-page" className="max-w-5xl space-y-8">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        My Profile
      </h1>

      <Card data-testid="user-info-card">
        <h2 className="mb-4 text-base font-semibold text-slate-800">
          User Information
        </h2>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              id="name"
              label="Name"
              defaultValue={user?.email.split('@')[0]}
              data-testid="profile-name-input"
            />
            <Input
              id="email"
              type="email"
              label="Email"
              defaultValue={user?.email}
              data-testid="profile-email-input"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-end gap-2">
              <Input
                id="password"
                type="password"
                label="Password"
                defaultValue="••••••••"
                disabled
                className="flex-1"
                data-testid="profile-password-input"
              />
              <Button
                type="button"
                variant="outline"
                data-testid="change-password-btn"
                className="whitespace-nowrap"
              >
                <KeyRound className="mr-2 h-4 w-4" />
                Change Password
              </Button>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" data-testid="save-profile-btn">
              Save Changes
            </Button>
          </div>
        </form>
      </Card>

      <Card data-testid="my-reports-card">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-slate-800">
            My Reports
          </h2>
          <p className="text-sm text-slate-500">
            Your uploaded InBody bioimpedance reports
          </p>
        </div>

        <div className="overflow-x-auto">
          <table
            data-testid="reports-table"
            className="w-full text-left text-sm text-slate-600"
          >
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Report Name</th>
                <th className="px-4 py-3">Date Uploaded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {reports.map((report) => (
                <tr
                  key={report.filename}
                  data-testid={`report-row-${report.filename}`}
                  className="hover:bg-slate-50/50"
                >
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {report.filename}
                  </td>
                  <td className="px-4 py-3">{report.date}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        data-testid={`download-report-btn-${report.filename}`}
                        className="p-1.5 text-slate-500 hover:text-brand-600 transition-colors"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        data-testid={`delete-report-btn-${report.filename}`}
                        className="p-1.5 text-slate-500 hover:text-red-600 transition-colors"
                        title="Delete"
                        onClick={() => deleteReport(report._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
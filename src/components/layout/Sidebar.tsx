import { cn } from '@/utils/cn';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  History, 
  User, 
  FileText, 
  Settings, 
  LogOut 
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', testId: 'nav-dashboard-link' },
  { label: 'History', icon: History, path: '/history', testId: 'nav-history-link' },
  { label: 'Profile', icon: User, path: '/profile', testId: 'nav-profile-link' },
  { label: 'Reports', icon: FileText, path: '/reports', testId: 'nav-reports-link' },
  { label: 'Settings', icon: Settings, path: '/settings', testId: 'nav-settings-link' },
];

function Sidebar() {
  return (
    <aside 
      data-testid="main-sidebar"
      className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white p-4"
    >
      <div className="mb-8 px-2 py-3">
        <h1 
          data-testid="app-logo"
          className="text-2xl font-black tracking-tight text-slate-900"
        >
          BIOINSIGHT
        </h1>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              data-testid={item.testId}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-slate-100 text-brand-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 pt-4">
        <button
          data-testid="logout-btn"
          onClick={() => { window.location.href = '/login' }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}

export { Sidebar }
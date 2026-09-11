import { Bell, Search } from 'lucide-react';

export function Header() {
  return (
    <header 
      data-testid="main-header"
      className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8"
    >
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          data-testid="global-search-input"
          placeholder="Search Bar"
          className="w-full rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-4 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      <div className="flex items-center gap-4">
        <button 
          data-testid="notifications-btn"
          className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <Bell className="h-5 w-5" />
        </button>

        <div 
          data-testid="user-avatar"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700"
        >
          JD
        </div>
      </div>
    </header>
  );
}
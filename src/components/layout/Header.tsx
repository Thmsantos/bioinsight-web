import type { UserWithoutPassword } from '@/types';
import { storage } from '@/utils/storage';
import { Bell } from 'lucide-react';

export function Header() {
  const email = storage.get<UserWithoutPassword>('user')?.email;
  const abbreviation = `${email?.split('')[0]}${email?.split('')[1]}`.toUpperCase();

  return (
    <header 
      data-testid="main-header"
      className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8"
    >
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
          {abbreviation}
        </div>
      </div>
    </header>
  );
}
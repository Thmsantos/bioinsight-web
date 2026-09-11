import { Header } from './Header';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

function AppLayout() {
  return (
    <div className="flex h-screen bg-slate-50 font-sans antialiased overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main data-testid="main-content"  className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export { AppLayout }
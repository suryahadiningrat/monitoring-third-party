import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Server, Bell, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MainLayout() {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Layanan', path: '/services', icon: Server },
    { name: 'Pengingat', path: '/reminders', icon: Bell },
    { name: 'Biaya', path: '/costs', icon: DollarSign },
  ];

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r">
        <div className="h-16 flex items-center px-6 border-b">
          <h1 className="text-lg font-bold tracking-tight text-slate-900">Third Party Monitor</h1>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden pb-16 md:pb-0">
        <div className="md:hidden h-14 flex items-center px-4 border-b bg-white">
          <h1 className="text-lg font-bold tracking-tight text-slate-900">Third Party Monitor</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navbar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t flex items-center justify-around px-2 z-50">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center w-full h-full space-y-1 text-xs font-medium transition-colors',
                isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

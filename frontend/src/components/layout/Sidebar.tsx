'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Package, LogOut, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

export function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Usuários', href: '/admin/usuarios', icon: Users },
    { name: 'Produtos', href: '/admin/produtos', icon: Package },
  ];

  return (
    <>
      {/* Mobile Top Navbar */}
      <div className="md:hidden flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
        <div className="font-bold text-lg text-slate-900">MinhaFabrica</div>
        <button onClick={() => setIsOpen(true)} className="text-slate-500 hover:text-slate-900">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-slate-200 bg-white transition-transform md:static md:translate-x-0 shrink-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 shrink-0 items-center gap-2 justify-between border-b border-slate-200 px-4">
           <div className="font-bold text-lg text-slate-900">MinhaFabrica</div>
           <button onClick={() => setIsOpen(false)} className="md:hidden text-slate-500 hover:text-slate-900">
             <X className="h-5 w-5" />
           </button>
        </div>
        <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-slate-200 p-4 shrink-0">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <p className="font-medium text-slate-900 truncate w-32">{user?.email}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.profile}</p>
            </div>
            <button
              onClick={logout}
              className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-red-600 transition-colors cursor-pointer"
              title="Sair"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

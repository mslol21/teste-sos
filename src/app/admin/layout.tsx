'use client';

import React, { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useStore } from '@/context/StoreContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { tenant } = useStore();
  const pathname = usePathname();

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-slate-900 border-b border-slate-800 p-4 z-20">
        <div className="flex items-center gap-3">
          <img
            src={tenant.logoUrl}
            alt={tenant.name}
            className="w-8 h-8 rounded-lg object-cover border border-amber-400"
          />
          <h2 className="font-extrabold text-white text-sm">Painel Admin</h2>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-slate-800 text-white rounded-xl"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <div
        className={`fixed inset-y-0 left-0 z-30 transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <AdminSidebar onClose={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto min-w-0 p-4 md:p-0">
        {children}
      </div>
    </div>
  );
}

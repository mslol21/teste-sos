'use client';

import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto min-w-0">
        {children}
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import {
  LayoutDashboard,
  Kanban,
  Utensils,
  ChefHat,
  Users,
  DollarSign,
  Sparkles,
  Volume2,
  VolumeX,
  ArrowLeft,
  X
} from 'lucide-react';

interface AdminSidebarProps {
  onClose?: () => void;
}

export const AdminSidebar = ({ onClose }: AdminSidebarProps) => {
  const pathname = usePathname();
  const { tenant, audioAlertEnabled, setAudioAlertEnabled } = useStore();

  const links = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/orders', label: 'Gestão de Pedidos', icon: Kanban },
    { href: '/admin/kds', label: 'Cozinha (KDS)', icon: ChefHat },
    { href: '/admin/waiter', label: 'Modo Garçom', icon: Users },
    { href: '/admin/products', label: 'Produtos', icon: Utensils },
    { href: '/admin/ai-insights', label: 'Módulo de IA', icon: Sparkles },
    { href: '/admin/financial', label: 'Financeiro', icon: DollarSign },
  ];

  return (
    <aside className="w-72 md:w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 shadow-2xl md:shadow-none">
      {/* Top Header */}
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <img
              src={tenant.logoUrl}
              alt={tenant.name}
              className="w-10 h-10 rounded-xl object-cover border border-amber-400"
            />
            <div>
              <h2 className="font-extrabold text-white text-sm leading-tight truncate">
                {tenant.name}
              </h2>
              <span className="text-[10px] bg-red-600/30 text-red-400 px-2 py-0.5 rounded font-bold uppercase border border-red-500/30">
                SaaS White Label
              </span>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="md:hidden p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-3 md:py-2.5 rounded-xl text-sm md:text-xs font-bold transition ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-5 h-5 md:w-4 md:h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Controls */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        {/* Sound toggle */}
        <button
          onClick={() => setAudioAlertEnabled(!audioAlertEnabled)}
          className={`w-full flex items-center justify-between p-3 md:p-2.5 rounded-xl text-sm md:text-xs font-bold border transition ${
            audioAlertEnabled
              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
        >
          <span className="flex items-center gap-2">
            {audioAlertEnabled ? <Volume2 className="w-5 h-5 md:w-4 md:h-4 text-emerald-400" /> : <VolumeX className="w-5 h-5 md:w-4 md:h-4" />}
            Som de Pedidos
          </span>
          <span className="text-[10px] uppercase font-black">{audioAlertEnabled ? 'ON' : 'OFF'}</span>
        </button>

        {/* Return to storefront */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm md:text-xs py-3 md:py-2.5 rounded-xl transition"
        >
          <ArrowLeft className="w-4 h-4 md:w-3.5 md:h-3.5" />
          <span>Ver Loja Virtual</span>
        </Link>
      </div>
    </aside>
  );
};

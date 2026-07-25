'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import {
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Users,
  Clock,
  Bike,
  Sparkles,
  ArrowUpRight,
  Flame,
  Award,
  ChevronRight,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { orders, aiInsights, tenant } = useStore();

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const totalOrdersCount = orders.length + 39; // simulated total today
  const averageTicket = totalOrdersCount > 0 ? (totalRevenue + 1850) / totalOrdersCount : 0;

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
            Painel Executivo — {tenant.name}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Dashboard de Desempenho</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Ver Pedidos Ativos ({orders.length})</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Pedidos Hoje</span>
            <div className="p-2 bg-red-600/20 text-red-400 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-white">{totalOrdersCount}</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center">
              +18.4% <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-[11px] text-slate-500">vs. mesmo período ontem</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Faturamento Bruto</span>
            <div className="p-2 bg-emerald-600/20 text-emerald-400 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-emerald-400">
              R$ {(totalRevenue + 1850).toFixed(2)}
            </span>
            <span className="text-xs font-bold text-emerald-400 flex items-center">
              +24.1% <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Lucro est.: R$ {((totalRevenue + 1850) * 0.45).toFixed(2)}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Ticket Médio</span>
            <div className="p-2 bg-amber-600/20 text-amber-400 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-amber-400">
              R$ {averageTicket.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-emerald-400 flex items-center">
              +5.2% <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Meta: R$ 55,00 por pedido</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Tempo Médio & Entregadores</span>
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl">
              <Bike className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-white">18 min</span>
            <span className="text-xs font-bold text-blue-400">6 online</span>
          </div>
          <p className="text-[11px] text-slate-500">Região Norte / Londrina</p>
        </div>
      </div>

      {/* AI Recommendations Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 p-6 rounded-3xl border border-amber-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/40">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">
                Inteligência Artificial — Recomendações Automáticas
              </h3>
              <p className="text-xs text-slate-400">
                Insights em tempo real para alavancar suas vendas de delivery nesta noite.
              </p>
            </div>
          </div>
          <Link
            href="/admin/ai-insights"
            className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
          >
            Ver Módulo de IA Completo
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {aiInsights.map((insight) => (
            <div
              key={insight.id}
              className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded">
                  {insight.type}
                </span>
                <span className="text-[10px] text-slate-500">{insight.createdAt}</span>
              </div>
              <h4 className="font-bold text-white text-xs">{insight.title}</h4>
              <p className="text-[11px] text-slate-400 line-clamp-2">{insight.message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Live Active Orders Preview */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-white text-base flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-500" />
            Pedidos em Andamento na Lanchonete
          </h3>
          <Link href="/admin/orders" className="text-xs text-red-400 font-bold hover:underline">
            Abrir Kanban Completo
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {orders.slice(0, 3).map((ord) => (
            <div key={ord.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">{ord.id}</span>
                <span className="text-[10px] bg-red-600/30 text-red-300 px-2 py-0.5 rounded font-bold">
                  {ord.status}
                </span>
              </div>
              <p className="text-xs text-slate-400">{ord.customerName} - {ord.neighborhood || 'Mesa'}</p>
              <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800">
                <span className="text-slate-500">{ord.items.length} itens</span>
                <span className="font-bold text-emerald-400">R$ {ord.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

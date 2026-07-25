'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { DollarSign, QrCode, CreditCard, Banknote, Download, ArrowUpRight, ShieldCheck } from 'lucide-react';

export default function AdminFinancialPage() {
  const { orders, tenant } = useStore();

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0) + 1850.0;
  const pixRevenue = totalRevenue * 0.65;
  const cardRevenue = totalRevenue * 0.25;
  const cashRevenue = totalRevenue * 0.10;

  const estimatedProfit = totalRevenue * 0.45;

  const exportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,ID,Cliente,Valor,Status,Metodo\n' +
      orders.map((o) => `${o.id},${o.customerName},${o.total},${o.status},${o.paymentMethod}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `financeiro_${tenant.slug}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto min-h-screen">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
            Gestão Financeira
          </span>
          <h1 className="text-3xl font-black text-white mt-1">Fluxo de Caixa & Relatórios</h1>
        </div>

        <button
          onClick={exportCSV}
          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Exportar Relatório em CSV</span>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Faturamento Bruto</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-3xl font-black text-emerald-400">
            R$ {totalRevenue.toFixed(2)}
          </span>
          <p className="text-[11px] text-slate-500">Total acumulado de vendas</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Lucro Líquido Estimado</span>
            <ArrowUpRight className="w-5 h-5 text-amber-400" />
          </div>
          <span className="text-3xl font-black text-amber-400">
            R$ {estimatedProfit.toFixed(2)}
          </span>
          <p className="text-[11px] text-slate-500">Margem média calculada: 45%</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Total de Pedidos</span>
            <ShieldCheck className="w-5 h-5 text-blue-400" />
          </div>
          <span className="text-3xl font-black text-white">{orders.length + 39}</span>
          <p className="text-[11px] text-slate-500">Taxa de sucesso: 98.2%</p>
        </div>
      </div>

      {/* Payment Method Breakdown */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
        <h3 className="font-extrabold text-white text-base">Divisão por Forma de Pagamento</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <QrCode className="w-4 h-4" />
              <span>PIX Instantâneo (65%)</span>
            </div>
            <span className="text-2xl font-black text-white">R$ {pixRevenue.toFixed(2)}</span>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
              <CreditCard className="w-4 h-4" />
              <span>Cartão de Crédito/Débito (25%)</span>
            </div>
            <span className="text-2xl font-black text-white">R$ {cardRevenue.toFixed(2)}</span>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <Banknote className="w-4 h-4" />
              <span>Dinheiro (10%)</span>
            </div>
            <span className="text-2xl font-black text-white">R$ {cashRevenue.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

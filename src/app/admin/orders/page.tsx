'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Order, OrderStatus } from '@/types';
import {
  Printer,
  ChevronRight,
  ChevronLeft,
  X,
  Volume2,
  Clock,
  Phone,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ChefHat,
  Bike,
  Sparkles,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, tenant, audioAlertEnabled, setAudioAlertEnabled } = useStore();
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<Order | null>(null);
  const [paperWidth, setPaperWidth] = useState<'58mm' | '80mm'>('80mm');
  const [activeMobileTab, setActiveMobileTab] = useState<number | 'ALL'>('ALL');

  const columns: { status: OrderStatus[]; title: string; color: string }[] = [
    { status: ['NEW'], title: 'Novos Chegando', color: 'border-red-500 bg-red-950/20 text-red-400' },
    { status: ['ACCEPTED', 'PREPARING'], title: 'Em Preparação', color: 'border-amber-500 bg-amber-950/20 text-amber-400' },
    { status: ['READY', 'OUT_FOR_DELIVERY'], title: 'Pronto / Em Rota', color: 'border-blue-500 bg-blue-950/20 text-blue-400' },
    { status: ['DELIVERED'], title: 'Finalizados', color: 'border-emerald-500 bg-emerald-950/20 text-emerald-400' },
  ];

  const getNextStatus = (current: OrderStatus): OrderStatus => {
    switch (current) {
      case 'NEW':
        return 'PREPARING';
      case 'ACCEPTED':
      case 'PREPARING':
        return 'OUT_FOR_DELIVERY';
      case 'READY':
      case 'OUT_FOR_DELIVERY':
        return 'DELIVERED';
      default:
        return 'DELIVERED';
    }
  };

  const getPrevStatus = (current: OrderStatus): OrderStatus => {
    switch (current) {
      case 'DELIVERED':
        return 'OUT_FOR_DELIVERY';
      case 'READY':
      case 'OUT_FOR_DELIVERY':
        return 'PREPARING';
      case 'ACCEPTED':
      case 'PREPARING':
        return 'NEW';
      default:
        return 'NEW';
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto min-h-screen flex flex-col">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
            Gestão Realtime de Pedidos
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Quadro Kanban de Pedidos</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAudioAlertEnabled(!audioAlertEnabled)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition flex items-center gap-2 ${
              audioAlertEnabled
                ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>Alerta Sonoro: {audioAlertEnabled ? 'Ativado' : 'Desativado'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Column Switcher Tabs */}
      <div className="flex md:hidden gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setActiveMobileTab('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 border ${
            activeMobileTab === 'ALL'
              ? 'bg-red-600 text-white border-red-500'
              : 'bg-slate-900 text-slate-400 border-slate-800'
          }`}
        >
          Todas Colunas ({orders.length})
        </button>
        {columns.map((c, idx) => {
          const count = orders.filter((o) => c.status.includes(o.status)).length;
          return (
            <button
              key={c.title}
              onClick={() => setActiveMobileTab(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 border ${
                activeMobileTab === idx
                  ? 'bg-red-600 text-white border-red-500'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              {c.title} ({count})
            </button>
          );
        })}
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1 items-start">
        {columns.map((col, idx) => {
          if (activeMobileTab !== 'ALL' && activeMobileTab !== idx) {
            return null;
          }
          const colOrders = orders.filter((o) => col.status.includes(o.status));

          return (
            <div
              key={col.title}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col max-h-[80vh] min-h-[600px]"
            >
              {/* Column Header */}
              <div className={`p-3 rounded-2xl border ${col.color} flex items-center justify-between mb-4`}>
                <h3 className="font-extrabold text-sm">{col.title}</h3>
                <span className="w-6 h-6 rounded-full bg-slate-950/80 font-black text-xs flex items-center justify-center">
                  {colOrders.length}
                </span>
              </div>

              {/* Orders List */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {colOrders.length === 0 ? (
                  <div className="p-8 text-center text-slate-600 text-xs font-bold border border-dashed border-slate-800 rounded-2xl">
                    Nenhum pedido nesta coluna
                  </div>
                ) : (
                  colOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition shadow-md space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div>
                          <span className="font-black text-white text-sm">{ord.id}</span>
                          <span className="text-[10px] text-slate-400 block">
                            {new Date(ord.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <span className="text-[10px] bg-slate-800 text-amber-400 font-extrabold px-2 py-0.5 rounded uppercase">
                          {ord.orderType}
                        </span>
                      </div>

                      {/* Customer info */}
                      <div className="text-xs space-y-1 text-slate-300">
                        <p className="font-bold text-white">{ord.customerName}</p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                          <span className="truncate">{ord.deliveryAddress || 'Retirada / Mesa'}</span>
                        </p>
                      </div>

                      {/* Items preview */}
                      <div className="space-y-1 text-xs border-t border-b border-slate-900 py-2">
                        {ord.items.map((it) => (
                          <div key={it.id} className="flex justify-between text-slate-300">
                            <span>{it.quantity}x {it.productName}</span>
                            <span className="font-bold text-slate-400">R$ {it.totalPrice.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Card Footer Actions */}
                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={() => setSelectedOrderForPrint(ord)}
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1"
                          title="Imprimir Comanda Térmica"
                        >
                          <Printer className="w-3.5 h-3.5 text-amber-400" />
                          <span>Comanda</span>
                        </button>

                        <div className="flex items-center gap-1">
                          {col.status[0] !== 'NEW' && (
                            <button
                              onClick={() => updateOrderStatus(ord.id, getPrevStatus(ord.status))}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                              title="Voltar status"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                          )}
                          {col.status[0] !== 'DELIVERED' && (
                            <button
                              onClick={() => updateOrderStatus(ord.id, getNextStatus(ord.status))}
                              className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1"
                            >
                              <span>Avançar</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ESC/POS Thermal Receipt Modal (58mm & 80mm) */}
      {selectedOrderForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Printer className="w-5 h-5 text-amber-400" />
                Impressão de Comanda Térmica
              </h3>
              <button
                onClick={() => setSelectedOrderForPrint(null)}
                className="p-1.5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Paper Size selector */}
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => setPaperWidth('80mm')}
                className={`flex-1 py-2 rounded-xl font-bold border ${
                  paperWidth === '80mm'
                    ? 'bg-amber-400 text-slate-950 border-amber-400'
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                Impressora 80mm
              </button>
              <button
                onClick={() => setPaperWidth('58mm')}
                className={`flex-1 py-2 rounded-xl font-bold border ${
                  paperWidth === '58mm'
                    ? 'bg-amber-400 text-slate-950 border-amber-400'
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                Impressora 58mm
              </button>
            </div>

            {/* Printable Slip Preview */}
            <div
              className={`bg-white text-black p-4 font-mono text-[11px] leading-tight mx-auto rounded shadow-inner ${
                paperWidth === '58mm' ? 'w-[230px]' : 'w-[300px]'
              }`}
            >
              <div className="text-center space-y-1 border-b border-black pb-2 mb-2">
                <h4 className="font-black text-sm uppercase">{tenant.name}</h4>
                <p className="text-[10px]">{tenant.slogan}</p>
                <p className="text-[10px]">{tenant.address}</p>
                <p className="text-[10px]">Tel: {tenant.whatsappNumber}</p>
              </div>

              <div className="border-b border-black pb-2 mb-2">
                <p><strong>PEDIDO #:</strong> {selectedOrderForPrint.id}</p>
                <p><strong>DATA:</strong> {new Date(selectedOrderForPrint.createdAt).toLocaleDateString('pt-BR')} {new Date(selectedOrderForPrint.createdAt).toLocaleTimeString('pt-BR')}</p>
                <p><strong>TIPO:</strong> {selectedOrderForPrint.orderType}</p>
                <p><strong>CLIENTE:</strong> {selectedOrderForPrint.customerName}</p>
                <p><strong>TEL:</strong> {selectedOrderForPrint.customerPhone}</p>
                {selectedOrderForPrint.orderType === 'DELIVERY' && (
                  <p><strong>END:</strong> {selectedOrderForPrint.deliveryAddress}, {selectedOrderForPrint.number} - {selectedOrderForPrint.neighborhood}</p>
                )}
              </div>

              <div className="border-b border-black pb-2 mb-2 space-y-1">
                <p className="font-bold border-b border-dashed border-black pb-1">QTD ITEM P.UNIT TOTAL</p>
                {selectedOrderForPrint.items.map((it) => (
                  <div key={it.id}>
                    <p className="font-bold">{it.quantity}x {it.productName}</p>
                    {it.options.map((o, idx) => (
                      <p key={idx} className="text-[9px] pl-2">+ {o.optionName}</p>
                    ))}
                    {it.notes && <p className="text-[9px] pl-2 italic">Obs: {it.notes}</p>}
                    <p className="text-right">R$ {it.totalPrice.toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-0.5 text-right font-bold">
                <p>Subtotal: R$ {selectedOrderForPrint.subtotal.toFixed(2)}</p>
                <p>Entrega: R$ {selectedOrderForPrint.deliveryFee.toFixed(2)}</p>
                <p className="text-sm pt-1 border-t border-black">TOTAL: R$ {selectedOrderForPrint.total.toFixed(2)}</p>
                <p className="text-left text-[10px] font-normal pt-1">PAG: {selectedOrderForPrint.paymentMethod}</p>
              </div>

              <div className="text-center pt-3 text-[9px] border-t border-dashed border-black mt-2">
                *** OBRIGADO PELA PREFERÊNCIA ***
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setSelectedOrderForPrint(null)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Agora</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

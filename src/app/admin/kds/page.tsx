'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { ChefHat, Clock, Check, Volume2, Maximize, Minimize, AlertCircle } from 'lucide-react';

export default function KitchenDisplaySystemPage() {
  const { orders, updateOrderStatus, audioAlertEnabled, setAudioAlertEnabled } = useStore();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const kitchenOrders = orders.filter((o) => ['NEW', 'ACCEPTED', 'PREPARING'].includes(o.status));

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-slate-950 text-white">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-slate-900 p-4 rounded-3xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-600 text-white rounded-2xl">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Kitchen Display System (KDS)</h1>
            <p className="text-xs text-slate-400">
              Tela da Cozinha — {kitchenOrders.length} pedidos ativos aguardando preparo
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAudioAlertEnabled(!audioAlertEnabled)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center gap-2"
          >
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <span>Alerta de Som</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-2"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            <span>{isFullscreen ? 'Sair Tela Cheia' : 'Modo Tela Cheia'}</span>
          </button>
        </div>
      </div>

      {/* Orders Grid */}
      {kitchenOrders.length === 0 ? (
        <div className="p-16 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
          <ChefHat className="w-16 h-16 mx-auto text-slate-600" />
          <h2 className="text-xl font-bold text-slate-400">Cozinha sem pedidos pendentes!</h2>
          <p className="text-xs text-slate-500">Todos os lanches foram entregues com sucesso.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kitchenOrders.map((ord) => {
            const minutesElapsed = Math.floor(
              (Date.now() - new Date(ord.createdAt).getTime()) / (1000 * 60)
            );

            let timerBadgeColor = 'bg-emerald-600/30 text-emerald-400 border-emerald-500/30';
            if (minutesElapsed > 25) {
              timerBadgeColor = 'bg-red-600/40 text-red-300 border-red-500/40 animate-pulse';
            } else if (minutesElapsed > 15) {
              timerBadgeColor = 'bg-amber-500/30 text-amber-300 border-amber-500/30';
            }

            return (
              <div
                key={ord.id}
                className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 space-y-4 flex flex-col justify-between shadow-xl"
              >
                <div>
                  {/* Top Order Metadata */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <span className="font-black text-2xl text-amber-400">{ord.id}</span>
                      <span className="text-xs text-slate-400 block font-bold mt-0.5">
                        {ord.customerName} ({ord.orderType})
                      </span>
                    </div>

                    <span className={`px-3 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1.5 ${timerBadgeColor}`}>
                      <Clock className="w-4 h-4" />
                      {minutesElapsed} min
                    </span>
                  </div>

                  {/* Items list for cooks */}
                  <div className="mt-4 space-y-3">
                    {ord.items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black text-base text-white">
                            {item.quantity}x {item.productName}
                          </span>
                        </div>

                        {item.options.length > 0 && (
                          <div className="text-xs font-bold text-amber-300 pl-2">
                            {item.options.map((o) => `+ ${o.optionName}`).join(' | ')}
                          </div>
                        )}

                        {item.notes && (
                          <div className="text-xs text-red-400 font-extrabold bg-red-950/40 p-2 rounded-xl border border-red-900">
                            OBS: {item.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {ord.notes && (
                    <div className="mt-3 p-3 bg-amber-950/40 border border-amber-900 rounded-2xl text-xs text-amber-300 font-bold">
                      Observação Geral: {ord.notes}
                    </div>
                  )}
                </div>

                {/* Big Ready Button */}
                <button
                  onClick={() => updateOrderStatus(ord.id, 'OUT_FOR_DELIVERY')}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Check className="w-6 h-6 stroke-[3]" />
                  <span>MARCAR PRONTO PARA SAÍDA</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

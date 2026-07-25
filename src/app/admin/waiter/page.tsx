'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Product } from '@/types';
import {
  Users,
  Plus,
  UtensilsCrossed,
  CheckCircle2,
  X,
  CreditCard,
  DollarSign,
  ArrowRightLeft,
} from 'lucide-react';

export default function WaiterModePage() {
  const { tables, openTableOrder, addItemToTable, closeTableOrder, products } = useStore();
  const [selectedTable, setSelectedTable] = useState<number | null>(4);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [openNewTableNum, setOpenNewTableNum] = useState<number | null>(null);

  const tableList = Array.from({ length: 12 }, (_, i) => i + 1);

  const currentTableOrder = selectedTable ? tables[selectedTable] : null;

  const handleOpenTable = (num: number) => {
    if (!newCustomerName.trim()) return;
    openTableOrder(num, newCustomerName);
    setOpenNewTableNum(null);
    setNewCustomerName('');
    setSelectedTable(num);
  };

  const handleAddProduct = (prod: Product) => {
    if (!selectedTable) return;
    addItemToTable(selectedTable, {
      id: `table-${selectedTable}-${Date.now()}`,
      product: prod,
      quantity: 1,
      selectedOptions: [],
      notes: '',
      unitPrice: prod.promoPrice || prod.price,
      totalPrice: prod.promoPrice || prod.price,
    });
    setShowAddProductModal(false);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto min-h-screen">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
            Atendimento Presencial
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Modo Garçom & Gestão de Mesas</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column: Table Grid */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-extrabold text-white text-base flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-red-500" />
            Mapa de Mesas da Lanchonete
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {tableList.map((num) => {
              const tableOrder = tables[num];
              const isOpen = Boolean(tableOrder && tableOrder.status === 'OPEN');
              const isSelected = selectedTable === num;

              return (
                <button
                  key={num}
                  onClick={() => setSelectedTable(num)}
                  className={`p-5 rounded-3xl border text-center transition flex flex-col items-center justify-between gap-2 shadow-md relative ${
                    isSelected
                      ? 'ring-4 ring-red-500/40 border-red-500 bg-red-950/40 text-white'
                      : isOpen
                      ? 'bg-amber-950/30 border-amber-500/50 text-amber-200'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-400">MESA</span>
                  <span className="text-3xl font-black text-white">{num}</span>

                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      isOpen
                        ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isOpen ? 'Ocupada' : 'Livre'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Table Order Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
            <h3 className="font-extrabold text-white text-base border-b border-slate-800 pb-3 flex justify-between items-center">
              <span>Mesa #{selectedTable}</span>
              {currentTableOrder && (
                <span className="text-xs text-amber-400 font-bold">
                  {currentTableOrder.customerName}
                </span>
              )}
            </h3>

            {currentTableOrder ? (
              <div className="space-y-4">
                {/* Items */}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {currentTableOrder.items.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">Mesa aberta sem consumo ainda.</p>
                  ) : (
                    currentTableOrder.items.map((it) => (
                      <div key={it.id} className="flex justify-between text-xs text-slate-300 bg-slate-950 p-2.5 rounded-xl">
                        <span>{it.quantity}x {it.product.name}</span>
                        <span className="font-bold text-white">R$ {it.totalPrice.toFixed(2)}</span>
                      </div>
                    ))
                  )}
                </div>

                {/* Total */}
                <div className="pt-3 border-t border-slate-800 flex justify-between font-black text-lg text-white">
                  <span>Total da Mesa</span>
                  <span className="text-amber-400">R$ {currentTableOrder.total.toFixed(2)}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAddProductModal(true)}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Lançar Item</span>
                  </button>

                  <button
                    onClick={() => selectedTable && closeTableOrder(selectedTable)}
                    className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
                  >
                    Fechar Conta
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 py-4 text-center">
                <p className="text-xs text-slate-400">Mesa livre para atendimento.</p>
                {openNewTableNum === selectedTable ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Nome do Cliente..."
                      value={newCustomerName}
                      onChange={(e) => setNewCustomerName(e.target.value)}
                      className="w-full p-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white"
                    />
                    <button
                      onClick={() => selectedTable && handleOpenTable(selectedTable)}
                      className="w-full py-2.5 bg-red-600 font-bold text-xs text-white rounded-xl"
                    >
                      Abrir Mesa Agora
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => selectedTable && setOpenNewTableNum(selectedTable)}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl"
                  >
                    Abrir Comanda da Mesa #{selectedTable}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full text-white space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm">Adicionar Item à Mesa #{selectedTable}</h3>
              <button onClick={() => setShowAddProductModal(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => handleAddProduct(prod)}
                  className="p-3 bg-slate-950 hover:bg-slate-800 rounded-xl border border-slate-800 cursor-pointer flex justify-between items-center transition"
                >
                  <div className="flex items-center gap-3">
                    <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-lg object-cover" />
                    <span className="font-bold text-xs">{prod.name}</span>
                  </div>
                  <span className="font-black text-xs text-amber-400">
                    R$ {(prod.promoPrice || prod.price).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

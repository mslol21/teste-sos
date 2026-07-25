'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Tag,
  ArrowRight,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    cartSubtotal,
    cartDiscount,
    cartDeliveryFee,
    cartTotal,
    tenant,
    products,
    addToCart,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800">
          {/* Drawer Header */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400 rounded-xl">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Seu Carrinho
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {cart.length} {cart.length === 1 ? 'item selecionado' : 'itens selecionados'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl transition"
              aria-label="Fechar carrinho"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                  <ShoppingBag className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                </div>
                <p className="font-bold text-slate-700 dark:text-slate-200 text-base mb-1">
                  Seu carrinho está vazio!
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mb-4">
                  Que tal experimentar o nosso famoso X-Bacon Supremo ou Combo Londrinense?
                </p>
                <button
                  onClick={onClose}
                  className="bg-red-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md hover:bg-red-700 transition"
                >
                  Ver Cardápio
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex gap-3 group"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-red-500 transition p-1"
                          title="Remover"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Selected options pills */}
                      {item.selectedOptions.length > 0 && (
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {item.selectedOptions.map((o) => o.optionName).join(', ')}
                        </p>
                      )}

                      {item.notes && (
                        <p className="text-[10px] text-amber-600 dark:text-amber-400 italic truncate">
                          Obs: {item.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                      <span className="font-extrabold text-xs text-red-600 dark:text-red-400">
                        R$ {item.totalPrice.toFixed(2)}
                      </span>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded-lg">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="text-slate-500 hover:text-slate-900 dark:hover:text-white p-0.5"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="text-slate-500 hover:text-slate-900 dark:hover:text-white p-0.5"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer (Summary & Checkout) */}
          {cart.length > 0 && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-800 space-y-3">
              {/* Coupon Form */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl text-xs text-emerald-800 dark:text-emerald-300">
                    <span className="font-bold flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      Cupom {appliedCoupon.code} aplicado
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-red-500 hover:underline font-bold"
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Cupom (ex: LONDRINA10)"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value);
                          setCouponError('');
                        }}
                        className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl uppercase tracking-wider"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-slate-900 text-white dark:bg-slate-800 font-bold text-xs px-3.5 py-1.5 rounded-xl hover:bg-slate-800 transition"
                    >
                      Aplicar
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {couponError}
                  </p>
                )}
              </div>

              {/* Cost Summary */}
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>R$ {cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de Entrega estimada</span>
                  <span>R$ {cartDeliveryFee.toFixed(2)}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Desconto do Cupom</span>
                    <span>- R$ {cartDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-black text-slate-900 dark:text-white text-base">
                  <span>Total</span>
                  <span className="text-red-600 dark:text-red-400">
                    R$ {cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg transition active:scale-95 text-sm"
              >
                <span>Finalizar Pedido</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Upsell / Cross-sell Section */}
          {cart.length > 0 && (
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Aproveite e leve também
              </h4>
              <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar">
                {products
                  .filter((p) => p.categoryId === 'cat-bebidas' || p.categoryId === 'cat-porcoes')
                  .filter((p) => !cart.some((c) => c.product.id === p.id))
                  .slice(0, 3)
                  .map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="min-w-[140px] max-w-[140px] bg-slate-50 dark:bg-slate-800 rounded-xl p-2.5 border border-slate-200 dark:border-slate-700 flex flex-col justify-between gap-2"
                    >
                      <div className="flex gap-2 items-center">
                        <img
                          src={suggestion.image}
                          alt={suggestion.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <span className="text-[10px] font-bold text-slate-900 dark:text-white leading-tight line-clamp-2">
                          {suggestion.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-red-600 dark:text-red-400">
                          R$ {suggestion.price.toFixed(2)}
                        </span>
                        <button
                          onClick={() => addToCart(suggestion, 1, [])}
                          className="bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400 hover:bg-red-200 p-1.5 rounded-lg transition"
                          title="Adicionar"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

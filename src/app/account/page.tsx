'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/store/Header';
import { Footer } from '@/components/store/Footer';
import { useStore } from '@/context/StoreContext';
import { MOCK_LOYALTY_REWARDS } from '@/lib/mockData';
import { LoyaltyReward } from '@/types';
import confetti from 'canvas-confetti';
import {
  Award,
  ShoppingBag,
  Gift,
  RotateCcw,
  Check,
  Star,
  MapPin,
  User,
  Phone,
  Sparkles,
} from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const { customerPoints, redeemReward, orders, addToCart, products } = useStore();
  const [activeTab, setActiveTab] = useState<'rewards' | 'orders' | 'addresses'>('rewards');
  const [redeemedSuccess, setRedeemedSuccess] = useState<string | null>(null);

  const handleRedeem = (reward: LoyaltyReward) => {
    const success = redeemReward(reward);
    if (success) {
      confetti({ particleCount: 80, spread: 60 });
      setRedeemedSuccess(reward.id);
      setTimeout(() => setRedeemedSuccess(null), 3000);
    }
  };

  const handleReorder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    order.items.forEach((item) => {
      const matchedProduct = products.find((p) => p.id === item.productId) || products[0];
      addToCart(matchedProduct, item.quantity, item.options, item.notes);
    });

    router.push('/checkout');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Customer Profile & Loyalty Banner */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-black border-2 border-white/40">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <span className="bg-yellow-400 text-red-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Cliente VIP Londrina
                </span>
                <h1 className="text-2xl font-black mt-1">Carlos Eduardo Silva</h1>
                <p className="text-xs text-red-100 flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  (43) 99123-4567
                </p>
              </div>
            </div>

            {/* Loyalty Balance Widget */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-3">
              <div className="p-3 bg-yellow-400 text-red-950 rounded-xl">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] text-red-100 uppercase tracking-wider block font-bold">
                  Saldo de Pontos
                </span>
                <span className="text-2xl font-black text-yellow-300">
                  {customerPoints} Pts
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-4">
          <button
            onClick={() => setActiveTab('rewards')}
            className={`pb-3 text-sm font-extrabold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'rewards'
                ? 'border-red-600 text-red-600 dark:text-red-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Trocar Pontos (Fidelidade)</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-sm font-extrabold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'orders'
                ? 'border-red-600 text-red-600 dark:text-red-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Histórico de Pedidos</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`pb-3 text-sm font-extrabold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'addresses'
                ? 'border-red-600 text-red-600 dark:text-red-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Endereços Salvos</span>
          </button>
        </div>

        {/* Rewards Store */}
        {activeTab === 'rewards' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                Prêmios Disponíveis para Troca
              </h3>
              <p className="text-xs text-slate-500">
                Cada R$ 1,00 gasto em nosso sistema gera 1 Ponto de Fidelidade!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {MOCK_LOYALTY_REWARDS.map((reward) => {
                const canRedeem = customerPoints >= reward.pointsCost;
                const isSuccess = redeemedSuccess === reward.id;

                return (
                  <div
                    key={reward.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-xs flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <img
                        src={reward.image}
                        alt={reward.name}
                        className="w-full h-36 object-cover rounded-2xl"
                      />
                      <div>
                        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-md uppercase">
                          {reward.rewardType}
                        </span>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-1">
                          {reward.name}
                        </h4>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="font-black text-sm text-red-600 dark:text-red-400">
                        {reward.pointsCost} Pontos
                      </span>

                      <button
                        disabled={!canRedeem}
                        onClick={() => handleRedeem(reward)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                          isSuccess
                            ? 'bg-emerald-600 text-white'
                            : canRedeem
                            ? 'bg-amber-400 hover:bg-amber-500 text-red-950 font-black cursor-pointer'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {isSuccess ? 'Resgatado!' : canRedeem ? 'Resgatar' : 'Pontos Insuficientes'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Order History */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              Seus Pedidos Recentes
            </h3>

            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <span className="font-black text-sm text-slate-900 dark:text-white">
                        Pedido #{ord.id}
                      </span>
                      <span className="text-xs text-slate-400 block">
                        {new Date(ord.createdAt).toLocaleDateString('pt-BR')} às{' '}
                        {new Date(ord.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-3 py-1 rounded-full text-xs font-bold">
                      {ord.status}
                    </span>
                  </div>

                  {/* Items preview */}
                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    {ord.items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>
                          {item.quantity}x {item.productName}
                        </span>
                        <span className="font-bold">R$ {item.totalPrice.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="font-black text-slate-900 dark:text-white text-sm">
                      Total: R$ {ord.total.toFixed(2)}
                    </span>

                    <div className="flex gap-2">
                      <Link
                        href={`/order/${ord.id}`}
                        className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl hover:bg-slate-200 transition"
                      >
                        Rastrear
                      </Link>
                      <button
                        onClick={() => handleReorder(ord.id)}
                        className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Repetir Pedido</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Saved Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              Endereços Cadastrados
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-red-600 bg-red-50 dark:bg-red-950 px-2.5 py-0.5 rounded-full">
                    Principal
                  </span>
                  <MapPin className="w-4 h-4 text-slate-400" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Casa</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Rua Sergipe, 450 - Centro
                  <br />
                  Londrina - PR, 86010-000
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                    Trabalho
                  </span>
                  <MapPin className="w-4 h-4 text-slate-400" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Escritório Gleba</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Av. Ayrton Senna da Silva, 800 - Gleba Palhano
                  <br />
                  Londrina - PR, 86050-460
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

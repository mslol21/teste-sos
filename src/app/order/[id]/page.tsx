'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/store/Header';
import { Footer } from '@/components/store/Footer';
import { useStore } from '@/context/StoreContext';
import { OrderStatus } from '@/types';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Clock,
  ChefHat,
  Bike,
  PackageCheck,
  Phone,
  MapPin,
  QrCode,
  CreditCard,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const { orders, updateOrderStatus, tenant } = useStore();

  const order = orders.find((o) => o.id === orderId) || orders[0];

  const [simulatedStatus, setSimulatedStatus] = useState<OrderStatus>(order?.status || 'NEW');

  useEffect(() => {
    if (order) setSimulatedStatus(order.status);
  }, [order?.status]);

  // Trigger celebration confetti when status hits DELIVERED
  useEffect(() => {
    if (simulatedStatus === 'DELIVERED') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [simulatedStatus]);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-xl mx-auto px-4 py-16 text-center space-y-4">
          <h2 className="text-2xl font-black">Pedido não encontrado</h2>
          <Link href="/" className="text-red-600 font-bold hover:underline text-sm">
            Voltar para Início
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const steps: { status: OrderStatus; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      status: 'NEW',
      label: 'Pedido Recebido',
      icon: <CheckCircle2 className="w-5 h-5" />,
      desc: 'Enviado para a lanchonete e aguardando confirmação.',
    },
    {
      status: 'PREPARING',
      label: 'Na Cozinha',
      icon: <ChefHat className="w-5 h-5" />,
      desc: 'O chapeiro está montando seu lanche com ingredientes frescos.',
    },
    {
      status: 'OUT_FOR_DELIVERY',
      label: 'Saiu para Entrega',
      icon: <Bike className="w-5 h-5" />,
      desc: 'O entregador está a caminho do seu endereço.',
    },
    {
      status: 'DELIVERED',
      label: 'Entregue',
      icon: <PackageCheck className="w-5 h-5" />,
      desc: 'Pedido entregue com sucesso! Bom apetite.',
    },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'NEW':
        return 0;
      case 'ACCEPTED':
      case 'PREPARING':
        return 1;
      case 'READY':
      case 'OUT_FOR_DELIVERY':
        return 2;
      case 'DELIVERED':
        return 3;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(simulatedStatus);

  const advanceSimulatedStatus = () => {
    let next: OrderStatus = 'NEW';
    if (simulatedStatus === 'NEW') next = 'PREPARING';
    else if (simulatedStatus === 'PREPARING' || simulatedStatus === 'ACCEPTED') next = 'OUT_FOR_DELIVERY';
    else if (simulatedStatus === 'OUT_FOR_DELIVERY' || simulatedStatus === 'READY') next = 'DELIVERED';
    else next = 'NEW';

    setSimulatedStatus(next);
    updateOrderStatus(order.id, next);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-950 p-6 sm:p-8 rounded-3xl text-white shadow-2xl space-y-4 border border-slate-800 relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="bg-red-600 text-white font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                Acompanhamento em Tempo Real (Supabase Realtime)
              </span>
              <h1 className="text-2xl sm:text-3xl font-black mt-2">
                Pedido #{order.id}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Realizado em {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {/* Realtime Simulator Controls */}
            <div className="bg-slate-800/90 p-3 rounded-2xl border border-slate-700 space-y-1 text-right">
              <span className="text-[11px] text-amber-400 font-bold block">
                Simular Atualização do Pedido
              </span>
              <button
                onClick={advanceSimulatedStatus}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ml-auto"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Avançar Status</span>
              </button>
            </div>
          </div>

          {/* Timeline Bar */}
          <div className="pt-6">
            <div className="relative flex justify-between">
              {/* Progress Line */}
              <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-slate-800 z-0" />
              <div
                className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-gradient-to-r from-red-600 to-amber-400 z-0 transition-all duration-500"
                style={{ width: `${(currentIndex / 3) * 100}%` }}
              />

              {steps.map((step, idx) => {
                const isCompleted = idx <= currentIndex;
                const isCurrent = idx === currentIndex;

                return (
                  <div key={step.status} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                        isCompleted
                          ? 'bg-red-600 text-white shadow-lg shadow-red-600/40 scale-110'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      } ${isCurrent ? 'ring-4 ring-red-500/30 animate-pulse' : ''}`}
                    >
                      {step.icon}
                    </div>
                    <span
                      className={`text-[11px] font-bold mt-2 text-center hidden sm:block ${
                        isCompleted ? 'text-white' : 'text-slate-500'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Status Alert Banner */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 rounded-2xl shrink-0">
            {steps[currentIndex].icon}
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Status Atual: {steps[currentIndex].label}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {steps[currentIndex].desc}
            </p>
          </div>
        </div>

        {/* Order Details & Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer & Delivery Details */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-600" />
              Detalhes de Entrega
            </h3>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <p>
                <strong>Cliente:</strong> {order.customerName}
              </p>
              <p>
                <strong>Telefone:</strong> {order.customerPhone}
              </p>
              {order.orderType === 'DELIVERY' ? (
                <>
                  <p>
                    <strong>Endereço:</strong> {order.deliveryAddress}, {order.number}
                  </p>
                  <p>
                    <strong>Bairro:</strong> {order.neighborhood} - Londrina
                  </p>
                  {order.reference && (
                    <p>
                      <strong>Ref:</strong> {order.reference}
                    </p>
                  )}
                </>
              ) : (
                <p>
                  <strong>Tipo:</strong> Retirada / Balcão
                </p>
              )}
              <p>
                <strong>Pagamento:</strong> {order.paymentMethod}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <a
                href={`https://wa.me/${tenant.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition"
              >
                <Phone className="w-4 h-4" />
                <span>Falar com o Suporte da Loja</span>
              </a>
            </div>
          </div>

          {/* Items Summary */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-red-600" />
              Itens Solicitados
            </h3>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-xs border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {item.quantity}x {item.productName}
                    </span>
                    {item.notes && (
                      <p className="text-[10px] text-amber-600 italic">Obs: {item.notes}</p>
                    )}
                  </div>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    R$ {item.totalPrice.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 space-y-1 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>R$ {order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxa de Entrega</span>
                <span>R$ {order.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-black text-slate-900 dark:text-white text-base">
                <span>Total Pago</span>
                <span className="text-red-600 dark:text-red-400">
                  R$ {order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

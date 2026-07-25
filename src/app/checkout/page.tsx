'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/store/Header';
import { Footer } from '@/components/store/Footer';
import { useStore } from '@/context/StoreContext';
import { OrderType, PaymentMethod } from '@/types';
import {
  ShoppingBag,
  MapPin,
  CreditCard,
  QrCode,
  Banknote,
  Truck,
  Store,
  UtensilsCrossed,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Tag,
  Copy,
  Check,
} from 'lucide-react';

const NEIGHBORHOODS = [
  { name: 'Centro', fee: 7.00 },
  { name: 'Gleba Palhano', fee: 9.00 },
  { name: 'Zona Norte / Cinco Conjuntos', fee: 6.00 },
  { name: 'Jardim Higienópolis', fee: 7.50 },
  { name: 'Jardim Shangri-Lá', fee: 8.00 },
  { name: 'Vila Nova', fee: 7.00 },
  { name: 'Aeroporto', fee: 8.50 },
];

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    cartDeliveryFee,
    cartTotal,
    appliedCoupon,
    placeOrder,
  } = useStore();

  const [orderType, setOrderType] = useState<OrderType>('DELIVERY');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  
  // Delivery address states
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('Centro');
  const [zipCode, setZipCode] = useState('');
  const [reference, setReference] = useState('');
  const [tableNumber, setTableNumber] = useState('1');

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');
  const [cashChange, setCashChange] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [pixCopied, setPixCopied] = useState(false);

  // Card simulation states
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-xl mx-auto px-4 py-16 text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-50 dark:bg-red-950 flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Seu carrinho está vazio
          </h2>
          <p className="text-sm text-slate-500">
            Adicione lanches saborosos ao seu carrinho antes de finalizar a compra.
          </p>
          <button
            onClick={() => router.push('/menu')}
            className="bg-red-600 text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-lg hover:bg-red-700 transition"
          >
            Ver Cardápio
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const selectedNeighborhoodFee = NEIGHBORHOODS.find((n) => n.name === neighborhood)?.fee || 7.00;
  const finalFee = orderType === 'DELIVERY' ? selectedNeighborhoodFee : 0;
  const finalTotal = Math.max(0, cartSubtotal + finalFee - cartDiscount);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setErrorMsg('Por favor, preencha seu nome e telefone.');
      return;
    }

    if (orderType === 'DELIVERY' && (!street.trim() || !number.trim())) {
      setErrorMsg('Por favor, preencha a rua e número para a entrega.');
      return;
    }

    const createdOrder = placeOrder({
      customerName: name,
      customerPhone: phone,
      customerCpf: cpf,
      orderType,
      deliveryAddress: orderType === 'DELIVERY' ? `${street}, ${number}` : undefined,
      number,
      neighborhood: orderType === 'DELIVERY' ? neighborhood : undefined,
      zipCode,
      reference,
      tableNumber: orderType === 'TABLE' ? parseInt(tableNumber, 10) : undefined,
      paymentMethod,
      changeFor: paymentMethod === 'CASH' && cashChange ? parseFloat(cashChange) : undefined,
      subtotal: cartSubtotal,
      deliveryFee: finalFee,
      discount: cartDiscount,
      total: finalTotal,
    });

    router.push(`/order/${createdOrder.id}`);
  };

  const dummyPixKey = '00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540539.905802BR5922Os Lanches de Londrina6008Londrina62070503***6304E2CA';

  const copyPix = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(dummyPixKey);
      setPixCopied(true);
      setTimeout(() => setPixCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
          Finalizar Pedido
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-8">
          Preencha os dados de entrega e forma de pagamento para concluir.
        </p>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 rounded-2xl text-xs text-red-700 dark:text-red-300 font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Columns - Form Sections */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Tipo de Pedido */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-red-600" />
                1. Tipo de Pedido
              </h3>

              <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setOrderType('DELIVERY')}
                  className={`p-2.5 sm:p-3.5 rounded-2xl border text-center font-bold text-[10px] xs:text-xs flex flex-col items-center gap-1.5 sm:gap-2 transition ${
                    orderType === 'DELIVERY'
                      ? 'bg-red-50 dark:bg-red-950/50 border-red-500 text-red-700 dark:text-red-300 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="truncate w-full">Entrega</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType('PICKUP')}
                  className={`p-2.5 sm:p-3.5 rounded-2xl border text-center font-bold text-[10px] xs:text-xs flex flex-col items-center gap-1.5 sm:gap-2 transition ${
                    orderType === 'PICKUP'
                      ? 'bg-red-50 dark:bg-red-950/50 border-red-500 text-red-700 dark:text-red-300 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <Store className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="truncate w-full">Retirada</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType('TABLE')}
                  className={`p-2.5 sm:p-3.5 rounded-2xl border text-center font-bold text-[10px] xs:text-xs flex flex-col items-center gap-1.5 sm:gap-2 transition ${
                    orderType === 'TABLE'
                      ? 'bg-red-50 dark:bg-red-950/50 border-red-500 text-red-700 dark:text-red-300 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="truncate w-full">Na Mesa</span>
                </button>
              </div>
            </div>

            {/* 2. Dados Pessoais */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-red-600" />
                2. Seus Dados
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: João da Silva"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Telefone WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(43) 99999-9999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    CPF (Opcional - Nota Fiscal Paulista/Paranaense)
                  </label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* 3. Endereço ou Mesa */}
            {orderType === 'DELIVERY' && (
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-600" />
                  3. Endereço de Entrega (Londrina & Região)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Rua / Avenida *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Rua Sergipe"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Número *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: 450"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Bairro em Londrina *
                    </label>
                    <select
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold"
                    >
                      {NEIGHBORHOODS.map((n) => (
                        <option key={n.name} value={n.name}>
                          {n.name} (Taxa: R$ {n.fee.toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      CEP (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="86010-000"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Complemento / Ref.
                    </label>
                    <input
                      type="text"
                      placeholder="Apto, Bloco, Próximo ao Calçadão..."
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {orderType === 'TABLE' && (
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <UtensilsCrossed className="w-5 h-5 text-red-600" />
                  3. Número da Mesa
                </h3>
                <div className="max-w-xs">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mesa nº
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>
            )}

            {/* 4. Forma de Pagamento */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-red-600" />
                4. Forma de Pagamento
              </h3>

              <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('PIX')}
                  className={`p-2.5 sm:p-3.5 rounded-2xl border text-center font-bold text-[10px] xs:text-xs flex flex-col items-center gap-1.5 sm:gap-2 transition ${
                    paymentMethod === 'PIX'
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="truncate w-full">PIX</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CREDIT_CARD')}
                  className={`p-2.5 sm:p-3.5 rounded-2xl border text-center font-bold text-[10px] xs:text-xs flex flex-col items-center gap-1.5 sm:gap-2 transition ${
                    paymentMethod === 'CREDIT_CARD'
                      ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-500 text-blue-700 dark:text-blue-300 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="truncate w-full">Cartão</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CASH')}
                  className={`p-2.5 sm:p-3.5 rounded-2xl border text-center font-bold text-[10px] xs:text-xs flex flex-col items-center gap-1.5 sm:gap-2 transition ${
                    paymentMethod === 'CASH'
                      ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 text-amber-800 dark:text-amber-300 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Banknote className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="truncate w-full">Dinheiro</span>
                </button>
              </div>

              {/* PIX QR Code details */}
              {paymentMethod === 'PIX' && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-2xl space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-20 bg-white p-1.5 rounded-xl border shrink-0">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=00020126580014BR.GOV.BCB.PIX"
                        alt="QR Code PIX"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-emerald-900 dark:text-emerald-200 text-xs">
                        Aprovação Automática via Mercado Pago / Supabase
                      </h4>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1">
                        Chave PIX copia e cola gerada com desconto e confirmação instantânea.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={dummyPixKey}
                      className="w-full p-2 text-[10px] bg-white dark:bg-slate-900 border border-emerald-300 rounded-xl font-mono text-slate-600 dark:text-slate-300 truncate"
                    />
                    <button
                      type="button"
                      onClick={copyPix}
                      className="bg-emerald-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl shrink-0 hover:bg-emerald-700 flex items-center gap-1"
                    >
                      {pixCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{pixCopied ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Cash Change details */}
              {paymentMethod === 'CASH' && (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-2xl">
                  <label className="block text-xs font-bold text-amber-900 dark:text-amber-200 mb-1">
                    Precisa de troco para quanto?
                  </label>
                  <input
                    type="number"
                    placeholder="Ex: R$ 100,00 (Deixe em branco se não precisar)"
                    value={cashChange}
                    onChange={(e) => setCashChange(e.target.value)}
                    className="w-full p-2.5 text-xs bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 rounded-xl"
                  />
                </div>
              )}

              {/* Credit Card simulated details */}
              {paymentMethod === 'CREDIT_CARD' && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-2xl space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-blue-900 dark:text-blue-200 mb-1">
                      Número do Cartão
                    </label>
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full p-2.5 text-xs bg-white dark:bg-slate-900 border border-blue-300 dark:border-blue-800 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-blue-900 dark:text-blue-200 mb-1">
                        Validade
                      </label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        className="w-full p-2.5 text-xs bg-white dark:bg-slate-900 border border-blue-300 dark:border-blue-800 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-blue-900 dark:text-blue-200 mb-1">
                        CVC
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full p-2.5 text-xs bg-white dark:bg-slate-900 border border-blue-300 dark:border-blue-800 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 lg:sticky lg:top-24">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <ShoppingBag className="w-5 h-5 text-red-600" />
                Resumo do Pedido ({cart.length} itens)
              </h3>

              {/* Items List */}
              <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs gap-2">
                    <div className="min-w-0">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {item.quantity}x {item.product.name}
                      </span>
                      {item.selectedOptions.length > 0 && (
                        <p className="text-[10px] text-slate-500 truncate">
                          {item.selectedOptions.map((o) => o.optionName).join(', ')}
                        </p>
                      )}
                    </div>
                    <span className="font-bold text-slate-700 dark:text-slate-300 shrink-0">
                      R$ {item.totalPrice.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total Calculation Breakdown */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>R$ {cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de Entrega ({orderType === 'DELIVERY' ? neighborhood : 'Sem Taxa'})</span>
                  <span>R$ {finalFee.toFixed(2)}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Desconto Aplicado</span>
                    <span>- R$ {cartDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between font-black text-slate-900 dark:text-white text-lg">
                  <span>Total do Pedido</span>
                  <span className="text-red-600 dark:text-red-400">
                    R$ {finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
                  />
                  <span>Li e aceito os termos do pedido e política de entrega.</span>
                </label>
              </div>

              {/* Submit Order Button */}
              <button
                type="submit"
                disabled={!acceptedTerms}
                className={`w-full py-4 px-6 rounded-2xl font-black text-base shadow-xl transition active:scale-95 flex items-center justify-center gap-2 ${
                  acceptedTerms
                    ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white cursor-pointer'
                    : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Confirmar e Realizar Pedido</span>
              </button>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}

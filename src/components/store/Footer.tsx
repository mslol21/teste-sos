'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import {
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  Zap,
  CreditCard,
  QrCode,
  Award,
  Share2,
  Flame,
} from 'lucide-react';

export const Footer = () => {
  const { tenant } = useStore();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-amber-500/20 pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {/* Brand & Slogan */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img
              src={tenant.logoUrl}
              alt={tenant.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-400 shadow-md bg-black"
            />
            <div>
              <h3 className="font-black text-white text-lg leading-tight flex items-center gap-1">
                {tenant.name}
              </h3>
              <p className="text-xs text-amber-400 font-bold">
                {tenant.slogan}
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Dogs tradicionais e especiais, lanches prensados da chapa, burguers assados na brasa, porções crocantes e cervejas trincando em Londrina e toda a Região Norte.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a
              href="#"
              className="p-2 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white rounded-xl transition border border-slate-800"
              aria-label="Compartilhar"
            >
              <Share2 className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="p-2 bg-slate-900 hover:bg-red-600 text-white rounded-xl transition border border-slate-800"
              aria-label="S.O.S."
            >
              <Flame className="w-4 h-4 text-amber-400" />
            </a>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="space-y-3">
          <h4 className="font-black text-white text-xs uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            Horário de Atendimento
          </h4>
          <ul className="text-xs space-y-2 text-slate-400">
            <li className="flex justify-between border-b border-slate-900 pb-1.5">
              <span>Segunda a Quinta:</span>
              <span className="font-bold text-slate-200">18:00 às 23:30</span>
            </li>
            <li className="flex justify-between border-b border-slate-900 pb-1.5">
              <span>Sexta e Sábado:</span>
              <span className="font-bold text-amber-400">18:00 às 01:00</span>
            </li>
            <li className="flex justify-between border-b border-slate-900 pb-1.5">
              <span>Domingo & Feriados:</span>
              <span className="font-bold text-slate-200">18:00 às 00:00</span>
            </li>
          </ul>
        </div>

        {/* Location Info */}
        <div className="space-y-3">
          <h4 className="font-black text-white text-xs uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-500" />
            Localização & Contato
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {tenant.address} - {tenant.city}/{tenant.state}
          </p>
          <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block font-bold">Atendimento / WhatsApp:</span>
            <a
              href={`https://wa.me/${tenant.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-black text-emerald-400 hover:underline flex items-center gap-1.5"
            >
              <Phone className="w-4 h-4" />
              (43) 99988-7766
            </a>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3">
          <h4 className="font-black text-white text-xs uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Formas de Pagamento
          </h4>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-emerald-400 font-bold">
              <QrCode className="w-3.5 h-3.5" />
              PIX Instantâneo
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-200 font-bold">
              <CreditCard className="w-3.5 h-3.5 text-blue-400" />
              Cartões de Crédito/Débito
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-amber-400 font-bold">
              Dinheiro c/ Troco
            </span>
          </div>

          <div className="pt-2">
            <Link
              href="/account"
              className="inline-flex items-center gap-2 btn-gold-action text-xs px-4 py-2 rounded-xl"
            >
              <Award className="w-4 h-4 text-slate-950" />
              <span>Programa de Fidelidade</span>
            </Link>
          </div>
        </div>
      </div>

      {/* SaaS White Label Footer Bar */}
      <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© {new Date().getFullYear()} SOS.LANCHES Delivery — Todos os direitos reservados.</p>
        <p className="flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          Tecnologia SaaS Multi-Tenant White Label Delivery
        </p>
      </div>
    </footer>
  );
};

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import {
  ShoppingBag,
  Heart,
  MapPin,
  Clock,
  Phone,
  Search,
  Award,
  Sparkles,
  LayoutDashboard,
  Flame,
} from 'lucide-react';
import { CartDrawer } from './CartDrawer';

export const Header = () => {
  const {
    tenant,
    cart,
    favorites,
    searchQuery,
    setSearchQuery,
    customerPoints,
  } = useStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const pathname = usePathname();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel-dark transition-all">
        {/* Top Info Bar */}
        <div className="bg-gradient-to-r from-red-700 via-amber-600 to-red-700 text-white text-xs py-1.5 px-4 font-bold shadow-md">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 font-extrabold tracking-wide uppercase">
                <Flame className="w-4 h-4 text-yellow-300 animate-flame" />
                {tenant.slogan}
              </span>
              <span className="hidden sm:inline text-red-200">|</span>
              <span className="hidden sm:flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-yellow-300" />
                Entrega Média em Londrina: <strong className="text-yellow-300">{tenant.avgDeliveryTime}</strong>
              </span>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <a
                href={`https://wa.me/${tenant.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 bg-black/30 hover:bg-black/50 px-3 py-1 rounded-full transition text-[11px] font-bold border border-white/20"
              >
                <Phone className="w-3 h-3 text-emerald-400" />
                <span>WhatsApp Loja</span>
              </a>
              <Link
                href="/account"
                className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black px-3 py-1 rounded-full hover:brightness-110 transition text-[11px] shadow-sm"
              >
                <Award className="w-3.5 h-3.5" />
                <span>{customerPoints} Pts Fidelidade</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Nav */}
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-red-600 p-0.5 shadow-xl group-hover:scale-105 transition-transform border border-amber-400/40">
              <img
                src={tenant.logoUrl}
                alt={tenant.name}
                className="w-full h-full object-cover rounded-[14px] bg-slate-950"
              />
            </div>
            <div>
              <h1 className="font-black text-lg sm:text-xl tracking-tight text-white leading-tight flex items-center gap-2">
                {tenant.name}
                <span className="text-[10px] badge-gold-glowing px-2 py-0.5 rounded font-black uppercase tracking-wider">
                  LONDRINA
                </span>
              </h1>
              <div className="flex items-center gap-1 text-xs text-amber-300 font-medium">
                <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                <span className="truncate max-w-[200px] sm:max-w-[280px]">
                  {tenant.address}
                </span>
              </div>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
            <input
              type="text"
              placeholder="Buscar X-Bacon, Dog Especial, Burguer na Brasa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-900/90 border border-amber-500/30 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/60 text-white placeholder-slate-400 transition shadow-inner"
            />
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-2 sm:gap-3">
            <nav className="hidden lg:flex items-center gap-1.5 mr-2 text-xs font-bold">
              <Link
                href="/"
                className={`px-3.5 py-2 rounded-xl transition ${
                  pathname === '/'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                Início
              </Link>
              <Link
                href="/menu"
                className={`px-3.5 py-2 rounded-xl transition ${
                  pathname === '/menu'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                Cardápio
              </Link>
              <Link
                href="/account"
                className={`px-3.5 py-2 rounded-xl transition ${
                  pathname === '/account'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                Meus Pedidos
              </Link>
            </nav>

            {/* Admin Portal Button */}
            <Link
              href="/admin/dashboard"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30 text-xs font-extrabold rounded-xl transition shadow-md"
              title="Painel Admin White Label"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
              <span>Painel Admin</span>
            </Link>

            {/* Favorites Icon */}
            <Link
              href="/menu?filter=favorites"
              className="relative p-2 text-slate-300 hover:bg-slate-900 rounded-xl transition border border-slate-800"
              title="Favoritos"
            >
              <Heart className="w-5 h-5 text-red-500 fill-red-500/20" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border border-slate-950">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 btn-gold-action px-4 py-2.5 rounded-2xl active:scale-95 cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-slate-950" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-red-600 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-amber-500 shadow-md animate-bounce">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <span className="hidden xs:inline text-xs tracking-wide">CARRINHO</span>
            </button>
          </div>
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

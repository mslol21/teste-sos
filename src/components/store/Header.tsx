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
  LayoutDashboard,
  Flame,
  Menu,
  X,
  Home,
  Utensils
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel-dark transition-all">
        {/* Top Info Bar */}
        <div className="bg-gradient-to-r from-red-700 via-amber-600 to-red-700 text-white text-xs py-1.5 px-4 font-bold shadow-md hidden sm:block">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex items-center gap-1.5 font-extrabold tracking-wide uppercase truncate">
                <Flame className="w-4 h-4 text-yellow-300 animate-flame shrink-0" />
                <span className="truncate">{tenant.slogan}</span>
              </span>
              <span className="hidden md:inline text-red-200">|</span>
              <span className="hidden md:flex items-center gap-1">
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
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-3">
          
          {/* Mobile Hamburger */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 text-slate-300 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-red-600 p-0.5 shadow-xl group-hover:scale-105 transition-transform border border-amber-400/40">
              <img
                src={tenant.logoUrl}
                alt={tenant.name}
                className="w-full h-full object-cover rounded-[14px] bg-slate-950"
              />
            </div>
            <div>
              <h1 className="font-black text-sm xs:text-base sm:text-xl tracking-tight text-white leading-tight flex items-center gap-1.5">
                <span className="truncate max-w-[130px] xs:max-w-[180px] sm:max-w-none">{tenant.name}</span>
                <span className="text-[9px] sm:text-[10px] badge-gold-glowing px-1.5 py-0.5 rounded font-black uppercase tracking-wider hidden sm:inline-block">
                  LONDRINA
                </span>
              </h1>
              <div className="hidden sm:flex items-center gap-1 text-xs text-amber-300 font-medium">
                <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                <span className="truncate max-w-[200px] sm:max-w-[280px]">
                  {tenant.address}
                </span>
              </div>
            </div>
          </Link>

          {/* Search Bar - hidden on very small screens, flex on md */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-900/90 border border-amber-500/30 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/60 text-white placeholder-slate-400 transition shadow-inner"
            />
          </div>

          {/* Navigation Links (Desktop) */}
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
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30 text-xs font-extrabold rounded-xl transition shadow-md"
              title="Painel Admin White Label"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
              <span>Painel Admin</span>
            </Link>

            {/* Favorites Icon */}
            <Link
              href="/menu?filter=favorites"
              className="hidden sm:flex relative p-2 text-slate-300 hover:bg-slate-900 rounded-xl transition border border-slate-800"
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
              className="flex items-center gap-2 btn-gold-action px-3 py-2 md:px-4 md:py-2.5 rounded-2xl active:scale-95 cursor-pointer"
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

        {/* Mobile Search Bar (Only visible on small screens below md) */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-900/90 border border-amber-500/30 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/60 text-white placeholder-slate-400 transition shadow-inner"
            />
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-black/60" onClick={() => setIsMobileMenuOpen(false)} />
        <div 
          className={`absolute inset-y-0 left-0 w-4/5 max-w-sm bg-slate-950 border-r border-amber-500/30 shadow-2xl transform transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } flex flex-col`}
        >
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={tenant.logoUrl}
                alt={tenant.name}
                className="w-10 h-10 rounded-xl object-cover border border-amber-400"
              />
              <span className="font-extrabold text-white text-sm">Menu</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <Link href="/" className="flex items-center gap-3 p-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 font-bold">
              <Home className="w-5 h-5 text-amber-500" />
              Início
            </Link>
            <Link href="/menu" className="flex items-center gap-3 p-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 font-bold">
              <Utensils className="w-5 h-5 text-amber-500" />
              Cardápio
            </Link>
            <Link href="/account" className="flex items-center gap-3 p-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 font-bold">
              <Award className="w-5 h-5 text-amber-500" />
              Meus Pedidos
            </Link>
            <Link href="/menu?filter=favorites" className="flex items-center gap-3 p-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 font-bold">
              <Heart className="w-5 h-5 text-amber-500" />
              Favoritos
            </Link>
            <Link href="/admin/dashboard" className="flex items-center gap-3 p-3 mt-4 rounded-xl text-amber-400 bg-amber-950/20 border border-amber-900/50 hover:bg-amber-900/40 font-bold">
              <LayoutDashboard className="w-5 h-5" />
              Painel Admin (SaaS)
            </Link>
          </div>
          
          <div className="p-4 border-t border-slate-800 space-y-3">
             <a
                href={`https://wa.me/${tenant.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl transition font-bold"
              >
                <Phone className="w-5 h-5" />
                <span>WhatsApp: {tenant.whatsappNumber}</span>
              </a>
          </div>
        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

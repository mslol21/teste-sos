'use client';

import React, { useState } from 'react';
import { Header } from '@/components/store/Header';
import { Footer } from '@/components/store/Footer';
import { ProductCard } from '@/components/store/ProductCard';
import { useStore } from '@/context/StoreContext';
import {
  Search,
  Filter,
  Flame,
  Star,
  Heart,
  SlidersHorizontal,
  Sparkles,
  ArrowUpDown,
} from 'lucide-react';

export default function MenuPage() {
  const {
    categories,
    products,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    favorites,
  } = useStore();

  const [filterPromo, setFilterPromo] = useState(false);
  const [filterBestSeller, setFilterBestSeller] = useState(false);
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  let filtered = products.filter((p) => {
    if (activeCategory && p.categoryId !== activeCategory) return false;
    if (filterPromo && !p.isPromo) return false;
    if (filterBestSeller && !p.isBestSeller) return false;
    if (filterFavorites && !favorites.includes(p.id)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.ingredients.some((ing) => ing.toLowerCase().includes(q))
      );
    }
    return true;
  });

  if (sortBy === 'price-asc') {
    filtered = [...filtered].sort((a, b) => (a.promoPrice || a.price) - (b.promoPrice || b.price));
  } else if (sortBy === 'price-desc') {
    filtered = [...filtered].sort((a, b) => (b.promoPrice || b.price) - (a.promoPrice || a.price));
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Page Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-red-600" />
            Cardápio Completo — Os Lanches de Londrina
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Escolha seu lanche artesanal, monte seus adicionais favoritos e receba quentinho.
          </p>
        </div>

        {/* Search & Filters Controls Bar */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nome ou ingrediente..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Quick Filter Badges */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                onClick={() => setFilterPromo(!filterPromo)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                  filterPromo
                    ? 'bg-red-600 text-white border-red-600 shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Em Promoção</span>
              </button>

              <button
                onClick={() => setFilterBestSeller(!filterBestSeller)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                  filterBestSeller
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>Mais Vendidos</span>
              </button>

              <button
                onClick={() => setFilterFavorites(!filterFavorites)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                  filterFavorites
                    ? 'bg-pink-600 text-white border-pink-600 shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>Favoritos ({favorites.length})</span>
              </button>

              {/* Price Sort Dropdown */}
              <div className="relative ml-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'default' | 'price-asc' | 'price-desc')}
                  className="pl-3 pr-8 py-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 appearance-none cursor-pointer"
                >
                  <option value="default">Ordenar por: Padrão</option>
                  <option value="price-asc">Menor Preço</option>
                  <option value="price-desc">Maior Preço</option>
                </select>
                <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Categories Tab Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-800 no-scrollbar">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
                activeCategory === null
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
                  activeCategory === cat.id
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
            <span>Exibindo {filtered.length} produtos</span>
            {(filterPromo || filterBestSeller || filterFavorites || activeCategory || searchQuery) && (
              <button
                onClick={() => {
                  setFilterPromo(false);
                  setFilterBestSeller(false);
                  setFilterFavorites(false);
                  setActiveCategory(null);
                  setSearchQuery('');
                  setSortBy('default');
                }}
                className="text-red-600 dark:text-red-400 font-bold hover:underline"
              >
                Limpar todos os filtros
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="p-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <p className="text-lg font-bold text-slate-700 dark:text-slate-300">
                Nenhum lanche encontrado com os filtros atuais.
              </p>
              <p className="text-xs text-slate-500">
                Tente buscar outro termo ou limpar os filtros para ver todo o nosso cardápio.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

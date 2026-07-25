'use client';

import React, { useState } from 'react';
import { Header } from '@/components/store/Header';
import { Footer } from '@/components/store/Footer';
import { ProductCard } from '@/components/store/ProductCard';
import { useStore } from '@/context/StoreContext';
import { Search, Sparkles, Utensils, Star, Flame } from 'lucide-react';

export default function MenuPage() {
  const { categories, products, activeCategory, setActiveCategory, searchQuery, setSearchQuery } = useStore();
  const [filter, setFilter] = useState<'ALL' | 'PROMO' | 'BEST_SELLER'>('ALL');

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory ? p.categoryId === activeCategory : true;
    const matchesSearch = searchQuery
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    let matchesFilter = true;
    if (filter === 'PROMO') matchesFilter = !!p.isPromo;
    if (filter === 'BEST_SELLER') matchesFilter = !!p.isBestSeller;

    return matchesCategory && matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0A0A] text-slate-100">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-8">
        
        {/* Search & Filters */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <Utensils className="w-8 h-8 text-amber-500" />
              Cardápio Completo
            </h1>
            
            <div className="w-full md:w-96 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text"
                placeholder="Buscar lanches, bebidas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-amber-500/50 transition-colors placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setFilter('ALL')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 ${
                filter === 'ALL' ? 'bg-amber-500 text-black' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Todos
            </button>
            <button 
              onClick={() => setFilter('PROMO')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 ${
                filter === 'PROMO' ? 'bg-red-600 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Flame className="w-4 h-4" />
              Promoções
            </button>
            <button 
              onClick={() => setFilter('BEST_SELLER')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 ${
                filter === 'BEST_SELLER' ? 'bg-amber-500 text-black' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Star className="w-4 h-4" />
              Mais Pedidos
            </button>
          </div>
        </section>

        {/* Categories Bar */}
        <section>
          <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
            <button
              onClick={() => setActiveCategory(null)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black shrink-0 border transition ${
                activeCategory === null
                  ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white border-amber-400 shadow-lg'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-amber-500/40'
              }`}
            >
              <span>Todos</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-xs font-black shrink-0 border transition ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white border-amber-400 shadow-lg'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-amber-500/40'
                }`}
              >
                {cat.image && (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-6 h-6 rounded-full object-cover border border-amber-400/40"
                  />
                )}
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Products Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-xl font-bold text-slate-200">
              {activeCategory ? categories.find(c => c.id === activeCategory)?.name : 'Resultados'}
            </h2>
            <span className="text-sm text-slate-500 font-medium">
              {filteredProducts.length} produtos
            </span>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-900 rounded-3xl border border-slate-800">
              <Utensils className="w-16 h-16 text-slate-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-300">Nenhum produto encontrado</h3>
              <p className="text-slate-500 mt-2">Tente buscar com outras palavras ou limpar os filtros.</p>
              <button 
                onClick={() => { setSearchQuery(''); setFilter('ALL'); setActiveCategory(null); }}
                className="mt-6 px-6 py-2 bg-amber-500 text-black font-bold rounded-xl"
              >
                Limpar Filtros
              </button>
            </div>
          )}
        </section>

      </main>

      <Footer />
    </div>
  );
}

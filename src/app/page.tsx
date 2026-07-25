'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/store/Header';
import { Footer } from '@/components/store/Footer';
import { ProductCard } from '@/components/store/ProductCard';
import { useStore } from '@/context/StoreContext';
import {
  Flame,
  Star,
  Clock,
  Sparkles,
  ArrowRight,
  Phone,
  Utensils,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

const BANNERS = [
  {
    id: 1,
    title: 'Combo S.O.S. Brasa + Batata + Cerveja',
    subtitle: 'Burguer 180g assado na grelha, batata crocante e Long Neck trincando!',
    tag: 'O MAIS PEDIDO EM LONDRINA',
    price: 'R$ 38,90',
    oldPrice: 'R$ 46,90',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f6?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    title: 'Dog Especial S.O.S. Frango & Bacon',
    subtitle: '2 salsichas, frango desfiado temperado na chapa e farofa de bacon',
    tag: 'DOG MAIS FAMOSO DA ZONA NORTE',
    price: 'R$ 22,90',
    oldPrice: 'R$ 26,90',
    image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 3,
    title: 'X-Bacon Prensado Tradicional',
    subtitle: 'Prensado na chapa com hambúrguer artesanal, duplo bacon e queijo derretido',
    tag: 'CLÁSSICO PRENSADO',
    price: 'R$ 29,90',
    oldPrice: null,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
  },
];

export default function Home() {
  const { tenant, categories, products, activeCategory, setActiveCategory, searchQuery } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const promoProducts = products.filter((p) => p.isPromo);
  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory ? p.categoryId === activeCategory : true;
    const matchesSearch = searchQuery
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0A0A] text-slate-100">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-12">
        {/* Banner Hero Slider */}
        <section className="relative rounded-3xl overflow-hidden shadow-lg bg-slate-900 border border-slate-200/20 aspect-[21/9] min-h-[320px] sm:min-h-[420px]">
          {BANNERS.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover opacity-45 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent flex items-center p-6 sm:p-12">
                <div className="max-w-xl space-y-4">
                  <span className="inline-flex items-center gap-1.5 badge-gold-glowing font-black text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                    <Sparkles className="w-4 h-4" />
                    {banner.tag}
                  </span>
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-md break-words">
                    {banner.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                    {banner.subtitle}
                  </p>
                  <div className="flex items-center gap-5 pt-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-black text-amber-400">
                        {banner.price}
                      </span>
                      {banner.oldPrice && (
                        <span className="text-sm text-slate-500 line-through">
                          {banner.oldPrice}
                        </span>
                      )}
                    </div>
                    <Link
                      href="/menu"
                      className="btn-gold-action px-6 py-3.5 rounded-2xl text-xs sm:text-sm flex items-center gap-2"
                    >
                      <span>FAZER PEDIDO AGORA</span>
                      <ArrowRight className="w-4 h-4 stroke-[3]" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Dots */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {BANNERS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === currentSlide ? 'w-8 bg-amber-400' : 'w-2.5 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Categories Horizontal Bar */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-xl text-white flex items-center gap-2">
              <Utensils className="w-5 h-5 text-amber-400" />
              Categorias do S.O.S.
            </h3>
            <Link
              href="/menu"
              className="text-xs font-extrabold text-amber-400 hover:underline flex items-center gap-1"
            >
              Ver Cardápio Completo
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => setActiveCategory(null)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black shrink-0 border transition ${
                activeCategory === null
                  ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white border-amber-400 shadow-lg'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-amber-500/40'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Todos os Produtos</span>
            </button>

            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-xs font-black shrink-0 border transition ${
                    isActive
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
              );
            })}
          </div>
        </section>

        {/* Promo Section */}
        {promoProducts.length > 0 && !activeCategory && !searchQuery && (
          <section className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-2xl text-white flex items-center gap-2">
                  <Flame className="w-6 h-6 text-red-500 animate-flame" />
                  Ofertas Especiais de Hoje
                </h3>
                <p className="text-xs text-amber-300/80 font-medium">
                  Matador da sua fome com desconto garantido!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {promoProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Main Product Grid */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-2xl text-white flex items-center gap-2">
              <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
              {activeCategory
                ? categories.find((c) => c.id === activeCategory)?.name
                : 'Os Mais Pedidos do S.O.S.'}
            </h3>
            <span className="text-xs text-slate-400 font-bold">
              {filteredProducts.length} opções disponíveis
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Reviews Section */}
        <section className="gold-glow-card rounded-3xl p-8 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="badge-gold-glowing text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
              AVALIAÇÃO 4.9 ★★★★★ EM LONDRINA
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              O S.O.S. Favorito da Região Norte
            </h3>
            <p className="text-xs text-slate-400">
              Muitos Dogs, Lanches Prensados e Burguers entregues quentinhos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/20 space-y-3">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 italic">
                "O Dog Especial Frango & Bacon é absurdo de recheado! Pão macio e maionese verde top de linha."
              </p>
              <span className="block text-xs font-black text-amber-400">
                — Rodrigo M., Centro Londrina
              </span>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/20 space-y-3">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 italic">
                "Burguer na brasa 180g sensacional! Chegou rápido na Gleba Palhano e a cerveja Long Neck veio estupidamente gelada!"
              </p>
              <span className="block text-xs font-black text-amber-400">
                — Juliana K., Gleba Palhano
              </span>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/20 space-y-3">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 italic">
                "Melhor lanche prensado de Londrina. Sem falar na facilidade de pedir pelo cardápio digital."
              </p>
              <span className="block text-xs font-black text-amber-400">
                — Marcelo S., Zona Norte
              </span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

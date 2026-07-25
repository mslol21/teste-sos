'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { useStore } from '@/context/StoreContext';
import { Heart, Plus, Flame, Star, Sparkles, Clock } from 'lucide-react';
import { ProductModal } from './ProductModal';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { favorites, toggleFavorite } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isFav = favorites.includes(product.id);
  const hasPromo = product.promoPrice && product.promoPrice < product.price;

  return (
    <>
      <div className="group relative gold-glow-card rounded-3xl overflow-hidden transition-all duration-300 flex flex-col h-full">
        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          {product.isBestSeller && (
            <span className="badge-gold-glowing text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider">
              <Star className="w-3 h-3 fill-slate-950" />
              Mais Pedido
            </span>
          )}
          {hasPromo && (
            <span className="badge-red-glowing text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider">
              <Flame className="w-3 h-3 text-yellow-300 animate-flame" />
              Oferta S.O.S.
            </span>
          )}
          {product.isNew && (
            <span className="bg-emerald-600 text-white font-black text-[10px] px-3 py-1 rounded-full shadow-md flex items-center gap-1 uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              Novidade
            </span>
          )}
        </div>

        {/* Heart Favorite */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          className="absolute top-3 right-3 z-10 p-2.5 bg-black/60 backdrop-blur-md rounded-full border border-amber-500/30 hover:scale-110 active:scale-90 transition"
          aria-label="Favoritar"
        >
          <Heart
            className={`w-4 h-4 transition ${
              isFav ? 'text-red-500 fill-red-500' : 'text-slate-400 hover:text-red-500'
            }`}
          />
        </button>

        {/* Image Container with Hover Zoom */}
        <div
          onClick={() => setIsModalOpen(true)}
          className="relative w-full h-48 sm:h-52 overflow-hidden bg-slate-950 cursor-pointer shrink-0"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out brightness-95 group-hover:brightness-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

          {/* Prep Time Tag */}
          <div className="absolute bottom-3 left-3 z-10">
            <span className="text-[11px] font-bold text-amber-300 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-amber-500/30 flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" /> ~{product.prepTimeMinutes} min
            </span>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <h3
              onClick={() => setIsModalOpen(true)}
              className="font-extrabold text-white text-base leading-snug group-hover:text-amber-400 transition cursor-pointer line-clamp-2"
            >
              {product.name}
            </h3>
            <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Price & Action Button */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
            <div>
              {hasPromo ? (
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-500 line-through">
                    R$ {product.price.toFixed(2)}
                  </span>
                  <span className="text-xl font-black text-amber-400">
                    R$ {product.promoPrice?.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-xl font-black text-white">
                  R$ {product.price.toFixed(2)}
                </span>
              )}
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 btn-gold-action px-4 py-2.5 rounded-2xl text-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>MONTAR</span>
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ProductModal product={product} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};

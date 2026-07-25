'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Product, Category } from '@/types';
import {
  Utensils,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Check,
  Search,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Download,
  Upload,
} from 'lucide-react';

export default function AdminProductsPage() {
  const { products, categories, tenant } = useStore();
  const [productList, setProductList] = useState<Product[]>(products);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  const filtered = productList.filter((p) => {
    if (selectedCat && p.categoryId !== selectedCat) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleProductActive = (id: string) => {
    setProductList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  const duplicateProduct = (product: Product) => {
    const newProd: Product = {
      ...product,
      id: `prod-dup-${Date.now()}`,
      name: `${product.name} (Cópia)`,
    };
    setProductList((prev) => [newProd, ...prev]);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto min-h-screen">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
            Gestão de Cardápio
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Produtos & Categorias</h1>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>
          <button className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg">
            <Plus className="w-4 h-4" />
            <span>Novo Produto</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedCat(null)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 ${
              selectedCat === null ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            Todas Categorias
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 ${
                selectedCat === c.id ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-x-auto shadow-xl no-scrollbar">
        <table className="w-full min-w-[700px] text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
            <tr>
              <th className="p-4">Produto</th>
              <th className="p-4">Categoria</th>
              <th className="p-4">Preço</th>
              <th className="p-4">Preço Promo</th>
              <th className="p-4">Estoque</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map((prod) => (
              <tr key={prod.id} className="hover:bg-slate-950/50 transition">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={prod.image} alt={prod.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <span className="font-bold text-white text-sm block">{prod.name}</span>
                      <span className="text-[10px] text-slate-500 line-clamp-1">{prod.description}</span>
                    </div>
                  </div>
                </td>
                <td className="p-4 font-bold text-amber-400">
                  {categories.find((c) => c.id === prod.categoryId)?.name}
                </td>
                <td className="p-4 font-bold text-white">R$ {prod.price.toFixed(2)}</td>
                <td className="p-4 font-bold text-red-400">
                  {prod.promoPrice ? `R$ ${prod.promoPrice.toFixed(2)}` : '-'}
                </td>
                <td className="p-4 font-bold">{prod.stockCount} un</td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => toggleProductActive(prod.id)}
                    className="inline-flex items-center gap-1 font-bold"
                  >
                    {prod.active ? (
                      <ToggleRight className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-slate-600" />
                    )}
                  </button>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => duplicateProduct(prod)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                    title="Duplicar Produto"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                    title="Editar"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Product, CartItemOption } from '@/types';
import { useStore } from '@/context/StoreContext';
import {
  X,
  Plus,
  Minus,
  Check,
  ShoppingBag,
  Clock,
  Info,
  Sparkles,
  Share2,
} from 'lucide-react';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addToCart } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [showNutritional, setShowNutritional] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const basePrice = product.promoPrice && product.promoPrice < product.price ? product.promoPrice : product.price;

  // Initialize option groups selection if defaults exist
  React.useEffect(() => {
    if (product.optionGroups) {
      const initial: Record<string, string[]> = {};
      product.optionGroups.forEach((group) => {
        if (group.required && group.options.length > 0) {
          initial[group.id] = [group.options[0].id];
        } else {
          initial[group.id] = [];
        }
      });
      setSelectedOptions(initial);
    }
  }, [product]);

  const handleOptionToggle = (groupId: string, optionId: string, maxSelect: number) => {
    setSelectedOptions((prev) => {
      const current = prev[groupId] || [];
      if (maxSelect === 1) {
        return { ...prev, [groupId]: [optionId] };
      }
      if (current.includes(optionId)) {
        return { ...prev, [groupId]: current.filter((id) => id !== optionId) };
      }
      if (current.length < maxSelect) {
        return { ...prev, [groupId]: [...current, optionId] };
      }
      return prev;
    });
  };

  // Calculate extra prices from selected options
  let extraPrices = 0;
  const flatSelectedOptions: CartItemOption[] = [];

  product.optionGroups?.forEach((group) => {
    const selectedIds = selectedOptions[group.id] || [];
    selectedIds.forEach((optId) => {
      const option = group.options.find((o) => o.id === optId);
      if (option) {
        extraPrices += option.price;
        flatSelectedOptions.push({
          groupName: group.name,
          optionName: option.name,
          optionPrice: option.price,
        });
      }
    });
  });

  const unitPrice = basePrice + extraPrices;
  const totalPrice = unitPrice * quantity;

  // Check required groups
  const isFormValid = product.optionGroups?.every((group) => {
    if (!group.required) return true;
    const count = (selectedOptions[group.id] || []).length;
    return count >= group.minSelect;
  }) ?? true;

  const handleAdd = () => {
    if (!isFormValid) return;
    addToCart(product, quantity, flatSelectedOptions, notes);
    onClose();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-slate-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close & Share buttons */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2.5 bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 rounded-full shadow-md hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Compartilhar produto"
          >
            {copiedLink ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-2.5 bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 rounded-full shadow-md hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          {/* Header Image Hero */}
          <div className="relative aspect-16/9 bg-slate-100 dark:bg-slate-800">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-6">
              <div className="text-white">
                <span className="inline-flex items-center gap-1 bg-red-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-1">
                  <Clock className="w-3 h-3" /> ~{product.prepTimeMinutes} min
                </span>
                <h2 className="text-2xl font-black">{product.name}</h2>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Description & Price */}
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {product.description}
              </p>
              
              {/* Ingredients Pills */}
              {product.ingredients.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {product.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              )}

              {/* Nutritional Info Drawer */}
              {product.nutritionalInfo && (
                <div className="mt-3">
                  <button
                    onClick={() => setShowNutritional(!showNutritional)}
                    className="text-xs text-red-600 dark:text-red-400 font-semibold flex items-center gap-1 hover:underline"
                  >
                    <Info className="w-3.5 h-3.5" />
                    {showNutritional ? 'Ocultar Informações Nutricionais' : 'Ver Informações Nutricionais'}
                  </button>
                  {showNutritional && (
                    <p className="mt-2 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl text-xs text-amber-900 dark:text-amber-200 font-medium">
                      {product.nutritionalInfo}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Option Groups */}
            {product.optionGroups?.map((group) => {
              const currentSelected = selectedOptions[group.id] || [];
              const isRequiredSatisfied = !group.required || currentSelected.length >= group.minSelect;

              return (
                <div
                  key={group.id}
                  className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                        {group.name}
                        {group.required && (
                          <span className="text-[10px] bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 px-2 py-0.5 rounded font-bold uppercase">
                            Obrigatório
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {group.maxSelect === 1
                          ? 'Escolha 1 opção'
                          : `Escolha de ${group.minSelect} até ${group.maxSelect} opções`}
                      </p>
                    </div>
                    {!isRequiredSatisfied && (
                      <span className="text-xs text-red-500 font-medium">Selecione item</span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {group.options.map((opt) => {
                      const isSelected = currentSelected.includes(opt.id);
                      return (
                        <label
                          key={opt.id}
                          onClick={() => handleOptionToggle(group.id, opt.id, group.maxSelect)}
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                            isSelected
                              ? 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-900 dark:text-red-200 font-semibold'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border flex items-center justify-center transition ${
                                isSelected
                                  ? 'border-red-600 bg-red-600 text-white'
                                  : 'border-slate-300 dark:border-slate-600'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="text-sm">{opt.name}</span>
                          </div>

                          {opt.price > 0 ? (
                            <span className="text-xs font-bold text-red-600 dark:text-red-400">
                              + R$ {opt.price.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">Sem custo</span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Special Instructions Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Observações do Pedido (Ex: sem cebola, ponto da carne...)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Escreva como você prefere o seu lanche..."
                rows={2}
                className="w-full p-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Quantity Controls */}
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-1.5 rounded-2xl shadow-xs">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              aria-label="Reduzir quantidade"
            >
              <Minus className="w-4 h-4 text-slate-700 dark:text-slate-200" />
            </button>
            <span className="w-8 text-center font-extrabold text-base text-slate-900 dark:text-white">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              aria-label="Aumentar quantidade"
            >
              <Plus className="w-4 h-4 text-slate-700 dark:text-slate-200" />
            </button>
          </div>

          {/* Add to Cart Submit */}
          <button
            disabled={!isFormValid}
            onClick={handleAdd}
            className={`w-full sm:w-auto flex-1 flex items-center justify-between gap-4 px-6 py-3.5 rounded-2xl font-bold shadow-lg transition active:scale-95 ${
              isFormValid
                ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white cursor-pointer'
                : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span className="flex items-center gap-2 text-sm">
              <ShoppingBag className="w-5 h-5" />
              Adicionar ao Carrinho
            </span>
            <span className="text-base font-black">
              R$ {totalPrice.toFixed(2)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

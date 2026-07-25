'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { Sparkles, Check, X, TrendingUp, Users, Tag, AlertCircle, Send } from 'lucide-react';

export default function AIInsightsPage() {
  const { aiInsights, applyAIInsight, dismissAIInsight, tenant } = useStore();

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-5xl mx-auto min-h-screen">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/60 p-5 sm:p-8 rounded-3xl border border-amber-500/40 text-white space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500 text-slate-950 rounded-2xl shadow-lg shrink-0">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-wider block">
              Motor de Inteligência Artificial White Label
            </span>
            <h1 className="text-xl sm:text-3xl font-black">AI Business Advisor — {tenant.name}</h1>
          </div>
        </div>
        <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
          Algoritmo de machine learning treinando com dados de vendas da Região Norte, analisando horários de pico, produtos parados, público inativo e margem de lucro.
        </p>
      </div>

      {/* Insights Cards */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-white text-base">Recomendações Ativas</h3>

        <div className="space-y-4">
          {aiInsights.map((ins) => {
            const isApplied = ins.status === 'APPLIED';
            const isDismissed = ins.status === 'DISMISSED';

            if (isDismissed) return null;

            return (
              <div
                key={ins.id}
                className={`p-6 rounded-3xl border transition space-y-4 ${
                  isApplied
                    ? 'bg-slate-900/40 border-emerald-500/40 opacity-70'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 font-extrabold px-2.5 py-0.5 rounded-full border border-amber-500/30">
                        {ins.type}
                      </span>
                      <span className="text-xs text-slate-500">{ins.createdAt}</span>
                    </div>
                    <h4 className="font-extrabold text-white text-base sm:text-lg">{ins.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                      {ins.message}
                    </p>
                  </div>

                  {isApplied ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800 shrink-0">
                      <Check className="w-4 h-4" /> Recomendação Aplicada
                    </span>
                  ) : (
                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                      <button
                        onClick={() => dismissAIInsight(ins.id)}
                        className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition"
                        title="Ignorar"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => applyAIInsight(ins.id)}
                        className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                      >
                        <Send className="w-4 h-4" />
                        <span>{ins.actionText || 'Executar Ação'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Lock, Eye, Zap, ShieldCheck } from 'lucide-react';

interface LockedAnalysisCardProps {
  onUnlock?: () => void;
  username: string;
}

export const LockedAnalysisCard: React.FC<LockedAnalysisCardProps> = ({ onUnlock, username }) => {
  return (
    <div className="relative rounded-2xl bg-[#000000] border border-neutral-800 p-4 sm:p-5 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
      {/* Background blurred teaser metrics */}
      <div 
        className="space-y-3 pointer-events-none select-none opacity-40"
        style={{ filter: 'blur(8px)' }}
      >
        <div className="flex justify-between items-center text-xs text-neutral-400">
          <span>Relatório de Atividade Noturna</span>
          <span className="text-[#22C55E]">Ativo entre 23:40h - 03:10h</span>
        </div>
        <div className="h-10 rounded-lg bg-neutral-900 flex items-center px-3 justify-between">
          <span className="text-xs text-white">Top 3 Interações Frequentes</span>
          <span className="text-xs text-[#3B82F6]">3 perfis identificados</span>
        </div>
        <div className="h-10 rounded-lg bg-neutral-900 flex items-center px-3 justify-between">
          <span className="text-xs text-white">Detecção de Stories Ocultos</span>
          <span className="text-xs text-[#8B5CF6]">Disponível</span>
        </div>
      </div>

      {/* Overlay de bloqueio com CTA */}
      <div className="absolute inset-0 bg-[#050507]/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center space-y-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#2563EB]/20 to-[#7C3AED]/20 border border-[#3B82F6]/40 flex items-center justify-center text-[#60A5FA] shadow-[0_0_20px_rgba(37,99,235,0.3)]">
          <Lock className="w-5 h-5 text-[#60A5FA]" />
        </div>

        <div className="space-y-1 max-w-xs">
          <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
            Análise Avançada de @{username}
          </h4>
          <p className="text-xs text-[#94A3B8]">
            Desbloqueie o dossiê detalhado com padrões de presença, interações e visualizador 100% anônimo.
          </p>
        </div>

        <button
          type="button"
          onClick={onUnlock}
          className="py-2.5 px-5 rounded-xl font-main font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] hover:brightness-110 active:scale-95 transition-all shadow-[0_0_25px_rgba(37,99,235,0.5)] flex items-center gap-2 cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 fill-white" />
          <span>Desbloquear Análise Completa</span>
        </button>
      </div>
    </div>
  );
};

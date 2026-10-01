import React from 'react';
import { Lock, Zap, Check, ShieldCheck, ChevronRight } from 'lucide-react';

interface UnlockCTAProps {
  onUnlock: () => void;
  username: string;
}

export const UnlockCTA: React.FC<UnlockCTAProps> = ({ onUnlock, username }) => {
  return (
    <div className="space-y-3 pt-2">
      <button
        type="button"
        onClick={onUnlock}
        className="w-full py-3.5 sm:py-4 px-5 rounded-2xl font-main font-bold text-sm sm:text-base text-white bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(37,99,235,0.45)] flex items-center justify-center gap-2 cursor-pointer relative overflow-hidden"
      >
        <Zap className="w-4 h-4 fill-white shrink-0" />
        <span>DESBLOQUEAR ANÁLISE COMPLETA</span>
        <ChevronRight className="w-4 h-4 shrink-0" />
      </button>

      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-4 text-xs text-[#94A3B8]">
        <span className="flex items-center gap-1">
          <Check className="w-3.5 h-3.5 text-[#22C55E]" />
          <span>100% Anônimo</span>
        </span>
        <span className="text-slate-700">•</span>
        <span className="flex items-center gap-1">
          <Lock className="w-3.5 h-3.5 text-[#60A5FA]" />
          <span>Sem Senha</span>
        </span>
        <span className="text-slate-700">•</span>
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#A78BFA]" />
          <span>Acesso Imediato</span>
        </span>
      </div>
    </div>
  );
};

import React from 'react';
import { Lock, Zap, X, ShieldCheck } from 'lucide-react';

interface BlockedPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onVirarVip: () => void;
  title?: string;
  description?: string;
}

export const BlockedPopup: React.FC<BlockedPopupProps> = ({
  isOpen,
  onClose,
  onVirarVip,
  title = 'Recurso disponível no acesso VIP',
  description = 'Para liberar todas as funcionalidades e ter acesso permanente, torne-se um membro VIP.',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn select-none">
      <div className="relative w-full max-w-sm rounded-2xl bg-[#101318] border border-[#262A30] p-6 text-center text-[#F5F5F5] shadow-[0_20px_50px_rgba(0,0,0,0.95)] space-y-4">
        
        {/* Close icon */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1 rounded-full text-neutral-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lock Icon */}
        <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-tr from-[#F97316]/20 via-[#EC4899]/20 to-[#9333EA]/20 border border-[#EC4899]/40 flex items-center justify-center text-[#EC4899] shadow-[0_0_20px_rgba(236,72,153,0.3)]">
          <Lock className="w-6 h-6" />
        </div>

        {/* Text */}
        <div className="space-y-1.5">
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onVirarVip();
            }}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#F97316] via-[#EC4899] to-[#9333EA] hover:brightness-110 active:scale-98 transition-all shadow-[0_0_20px_rgba(236,72,153,0.4)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Virar VIP</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl font-medium text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            Continuar prévia
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
          <span>Acesso anônimo e 100% seguro</span>
        </div>

      </div>
    </div>
  );
};

import React from 'react';
import { Heart, Send, ArrowLeft } from 'lucide-react';

interface TopSocialBarProps {
  onBack?: () => void;
  username?: string;
}

export const TopSocialBar: React.FC<TopSocialBarProps> = ({ onBack, username }) => {
  return (
    <div className="sticky top-0 z-30 h-14 sm:h-16 flex items-center justify-between px-4 bg-[#000000] border-b border-neutral-900 select-none">
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="p-1 -ml-1 text-white hover:text-neutral-300 transition-colors cursor-pointer active:scale-95"
            title="Voltar / Alterar @"
            aria-label="Voltar para busca"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
        )}
        
        {/* Social App Brand / Header */}
        <div className="flex items-center">
          <span className="font-serif italic font-bold text-xl sm:text-[23px] text-white tracking-wide">
            Espia Aí
          </span>
        </div>
      </div>

      {/* Top right social actions */}
      <div className="flex items-center gap-5 text-white">
        <button
          type="button"
          className="p-1 hover:text-[#EF4444] transition-colors cursor-pointer active:scale-90"
          aria-label="Notificações"
        >
          <Heart className="w-6 h-6 stroke-[1.8]" />
        </button>
        <button
          type="button"
          className="p-1 hover:text-[#3B82F6] transition-colors cursor-pointer active:scale-90"
          aria-label="Mensagens diretas"
        >
          <Send className="w-6 h-6 stroke-[1.8] -rotate-12" />
        </button>
      </div>
    </div>
  );
};

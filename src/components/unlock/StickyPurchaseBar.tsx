import React from 'react';

interface StickyPurchaseBarProps {
  onOpenCheckout: () => void;
}

export const StickyPurchaseBar: React.FC<StickyPurchaseBarProps> = ({ onOpenCheckout }) => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-[#101418]/95 backdrop-blur-xl border-t border-white/10 px-4 py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.9)] select-none">
      <div className="max-w-[480px] mx-auto flex items-center justify-between gap-3">
        <div className="flex flex-col text-left min-w-0">
          <h4 className="text-xs sm:text-sm font-extrabold text-white leading-tight">
            Finalize sua compra agora!
          </h4>
          <p className="text-[10px] sm:text-[11px] text-[#9CA3AF] leading-tight mt-0.5">
            Não saia ou recarregue essa página, a espionagem não pode ser realizada novamente.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCheckout}
          className="shrink-0 px-3.5 sm:px-4 py-2.5 rounded-xl bg-[#5B39D4] hover:bg-[#6D3CEB] active:scale-[0.98] transition-all font-bold text-white text-xs sm:text-sm text-center shadow-[0_0_20px_rgba(91,57,212,0.5)] cursor-pointer"
        >
          Desbloquear<br className="sm:hidden" /> Acesso Agora
        </button>
      </div>
    </div>
  );
};

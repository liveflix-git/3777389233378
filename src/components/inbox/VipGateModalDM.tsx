import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Sparkles, X } from 'lucide-react';

interface VipGateModalDMProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export const VipGateModalDM: React.FC<VipGateModalDMProps> = ({
  isOpen,
  onClose,
  title = 'Acesso VIP',
  description = 'Torne-se VIP para ver a conversa completa, sem censura e com acesso total às mensagens, mídias e histórico.',
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleVirarVip = () => {
    onClose();
    navigate('/unlock');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-sm rounded-2xl bg-[#12161F] border border-white/10 p-6 text-center shadow-2xl space-y-4">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lock Icon */}
        <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-tr from-[#7000FF] to-[#3797F0] p-0.5 shadow-lg flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-[#12161F] flex items-center justify-center">
            <Lock className="w-6 h-6 text-[#3797F0]" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-white tracking-tight">
            {title}
          </h3>
          <p className="text-[13px] text-neutral-300 leading-relaxed font-normal">
            {description}
          </p>
        </div>

        {/* Primary CTA Button -> directly navigates to /unlock */}
        <button
          type="button"
          onClick={handleVirarVip}
          className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#7000FF] via-[#A855F7] to-[#3797F0] hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(112,0,255,0.4)] flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 fill-white" />
          <span>Virar VIP</span>
        </button>
      </div>
    </div>
  );
};

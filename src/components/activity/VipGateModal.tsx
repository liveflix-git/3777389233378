import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Sparkles, X } from 'lucide-react';

interface VipGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  closeLabel?: string;
}

export const VipGateModal: React.FC<VipGateModalProps> = ({
  isOpen,
  onClose,
  title = 'Conteúdo disponível no VIP',
  description = 'Para abrir esta conversa e ver as mensagens completas, desbloqueie o acesso VIP.',
  closeLabel = 'Fechar',
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUnlockVip = () => {
    onClose();
    navigate('/unlock');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn select-none">
      <div className="relative w-full max-w-[380px] bg-[#0E131F] border border-[rgba(139,92,246,0.35)] rounded-[24px] p-6 text-center shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_40px_rgba(139,92,246,0.2)] text-[#F5F5F7] space-y-4">
        
        {/* Close icon */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#9CA3AF] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Icon Badge */}
        <div className="w-12 h-12 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center mx-auto text-[#C084FC]">
          <Sparkles className="w-6 h-6 text-glow-cyber" />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            {description}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2.5 pt-2">
          <button
            type="button"
            onClick={handleUnlockVip}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-[#6D3CEB] to-[#5B39D4] hover:brightness-110 active:scale-[0.98] transition-all font-bold text-white text-sm shadow-[0_0_20px_rgba(109,60,235,0.4)] flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Desbloquear VIP</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full h-10 rounded-xl bg-[#1A202C] hover:bg-[#252D3D] transition-colors font-medium text-xs text-[#9CA3AF] hover:text-white cursor-pointer"
          >
            {closeLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

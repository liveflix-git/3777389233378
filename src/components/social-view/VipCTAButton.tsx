import React from 'react';
import { Zap, ChevronRight } from 'lucide-react';

interface VipCTAButtonProps {
  onClick: () => void;
  className?: string;
  isExpired?: boolean;
}

export const VipCTAButton: React.FC<VipCTAButtonProps> = ({ onClick, className = '', isExpired }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full sm:w-auto px-5 py-3 rounded-xl font-main font-bold text-sm text-white bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] hover:brightness-110 active:scale-95 transition-all shadow-[0_0_25px_rgba(37,99,235,0.45)] flex items-center justify-center gap-2 shrink-0 cursor-pointer whitespace-nowrap ${className}`}
    >
      <Zap className="w-4 h-4 fill-white shrink-0" />
      <span>{isExpired ? 'RENOVAR ACESSO VIP' : 'VIRAR VIP'}</span>
      <ChevronRight className="w-4 h-4 shrink-0" />
    </button>
  );
};

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface SuccessToastProps {
  show: boolean;
  message?: string;
}

export const SuccessToast: React.FC<SuccessToastProps> = ({
  show,
  message = 'Acesso concluído com sucesso!',
}) => {
  if (!show) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-[#22C55E] text-white px-4 py-2.5 rounded-[8px] shadow-[0_8px_30px_rgba(34,197,94,0.35)] flex items-center gap-2 text-[13.5px] font-semibold tracking-tight transition-all duration-300 animate-slideDown z-50 select-none max-w-[90vw] text-center">
      <CheckCircle2 className="w-4 h-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
};

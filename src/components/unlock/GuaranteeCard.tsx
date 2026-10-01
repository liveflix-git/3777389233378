import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const GuaranteeCard: React.FC = () => {
  return (
    <div className="w-full bg-[#10B981]/10 border border-[#10B981]/30 rounded-[18px] p-5 text-center shadow-[0_10px_25px_rgba(16,185,129,0.1)] flex flex-col items-center justify-center space-y-2 select-none my-4">
      <div className="w-10 h-10 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#10B981]">
        <ShieldCheck className="w-6 h-6" />
      </div>

      <h4 className="text-base font-extrabold text-white">
        Garantia Incondicional de 30 Dias
      </h4>

      <p className="text-xs text-[#A8AEB5] leading-relaxed max-w-sm">
        Teste sem risco. Se o produto estiver dentro das condições da garantia e você solicitar no prazo de 30 dias, seguiremos integralmente a política de reembolso publicada.
      </p>
    </div>
  );
};

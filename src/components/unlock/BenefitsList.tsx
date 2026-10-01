import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const BENEFITS = [
  'Acesso completo às ferramentas do Espia Aí',
  'Visualização ampliada de dados públicos disponíveis',
  'Relatórios e análises adicionais consolidados',
  'Recursos exclusivos e alertas da versão VIP',
  'Atualizações e suporte incluídos durante o acesso',
];

export const BenefitsList: React.FC = () => {
  return (
    <div className="w-full space-y-2 select-none">
      <h3 className="text-sm font-bold uppercase tracking-wider text-[#A8AEB5] px-1 mb-2">
        O que você recebe no VIP:
      </h3>

      {BENEFITS.map((item, idx) => (
        <div
          key={idx}
          className="w-full bg-[#0D1213] border border-[#202829] rounded-xl p-3.5 flex items-center gap-3 text-left shadow-sm"
        >
          <div className="w-6 h-6 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          </div>
          <span className="text-xs sm:text-sm font-semibold text-white/90">
            {item}
          </span>
        </div>
      ))}
    </div>
  );
};

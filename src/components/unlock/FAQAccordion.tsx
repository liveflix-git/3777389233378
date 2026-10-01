import React, { useState } from 'react';
import { HelpCircle, Plus, Minus } from 'lucide-react';

const FAQS = [
  {
    q: 'A ferramenta realmente funciona?',
    a: 'O Espia Aí organiza e apresenta informações publicamente disponíveis e recursos próprios da plataforma em uma experiência visual simples e consolidada.',
  },
  {
    q: 'A pessoa pesquisada recebe alguma notificação?',
    a: 'A pesquisa feita dentro do Espia Aí não envia uma notificação ao perfil pesquisado. Isso não significa acesso direto à conta ou conteúdo estritamente privado.',
  },
  {
    q: 'Funciona com perfis privados?',
    a: 'Perfis privados possuem limitações. O Espia Aí exibe somente informações disponíveis para o provider e recursos de prévia da plataforma.',
  },
  {
    q: 'Preciso instalar alguma coisa?',
    a: 'Não. O Espia Aí funciona diretamente pelo seu navegador no celular ou computador e não exige nenhuma instalação.',
  },
  {
    q: 'Como funciona a garantia?',
    a: 'Oferecemos 7 dias de garantia incondicional. Se você não estiver satisfeito no prazo, pode solicitar o reembolso total conforme nossa política.',
  },
  {
    q: 'Quanto tempo tenho acesso?',
    a: 'Acesso liberado de forma contínua conforme o plano VIP escolhido.',
  },
];

export const FAQAccordion: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleItem = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="w-full space-y-4 select-none">
      {/* Title */}
      <div className="space-y-1 text-center">
        <h3 className="text-base sm:text-lg font-bold text-white flex items-center justify-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#8B5CF6]" />
          <span>Perguntas Frequentes</span>
        </h3>
        <p className="text-xs text-[#A8AEB5]">
          Tire suas dúvidas sobre o funcionamento do Espia Aí.
        </p>
      </div>

      {/* Accordion list */}
      <div className="space-y-2">
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-[#151A1C] border border-[#242A2D] rounded-[10px] overflow-hidden transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => toggleItem(idx)}
                className="w-full p-4 flex items-center justify-between text-left font-bold text-xs sm:text-sm text-white hover:text-[#C084FC] transition-colors cursor-pointer"
              >
                <span className="pr-2">{faq.q}</span>
                <span className="w-6 h-6 rounded-full bg-[#202829] flex items-center justify-center shrink-0 text-[#8B5CF6]">
                  {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                </span>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs text-[#A8AEB5] leading-relaxed border-t border-[#242A2D]/60 animate-fadeIn">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

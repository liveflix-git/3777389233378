import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'O dono do perfil investigado vai saber de alguma coisa?',
      answer:
        'Não, de forma alguma. Todas as consultas do Stalkeia App são efetuadas por servidores proxy anônimos externos. O Instagram não envia notificações, não cria registros e nem associa a pesquisa a você.',
    },
    {
      question: 'Preciso fornecer a senha do meu Instagram?',
      answer:
        'Nunca! Nós abominamos a coleta de credenciais. O Stalkeia App requer unicamente o @ (nome de usuário público) do perfil alvo. Você não precisa nem mesmo ter uma conta no Instagram para utilizar o serviço.',
    },
    {
      question: 'Funciona para perfis privados?',
      answer:
        'Para perfis privados, nosso sistema extrai metadados públicos permitidos, horários de atividade online, oscilações na lista numérica de seguidos/seguidores e padrões de conexões mútuas, respeitando as diretrizes de dados abertos.',
    },
    {
      question: 'Quanto tempo demora para gerar a análise?',
      answer:
        'A varredura preliminar demora entre 30 e 60 segundos. Após a conclusão, o dossiê completo é disponibilizado instantaneamente na sua tela e também pode ser baixado em PDF criptografado.',
    },
    {
      question: 'Como funciona a garantia de 7 dias?',
      answer:
        'Se você sentir que as informações geradas não atenderam às suas expectativas, basta entrar em contato com o suporte em até 7 dias após o desbloqueio para solicitar 100% do reembolso imediato, sem perguntas.',
    },
  ];

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10 max-w-4xl mx-auto border-t border-[rgba(139,92,246,0.12)]">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono-tech uppercase tracking-wider text-[#A855F7] mb-2">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Tira-Dúvidas</span>
        </div>
        <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-[#F8FAFC]">
          Perguntas Frequentes
        </h2>
        <p className="mt-3 text-sm sm:text-base text-[#9CA3AF]">
          Transparência técnica total sobre segurança, velocidade e funcionamento.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-[#0B0B10] border border-[rgba(139,92,246,0.16)] overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
              >
                <span className="font-display font-semibold text-sm sm:text-base text-[#F8FAFC]">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[#8B5CF6] shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-white' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-[#9CA3AF] leading-relaxed border-t border-[rgba(139,92,246,0.08)] pt-4">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

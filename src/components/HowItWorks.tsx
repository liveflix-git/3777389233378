import React from 'react';
import { Search, Cpu, FileText, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onStartNow: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStartNow }) => {
  const steps = [
    {
      num: '01',
      title: 'Informe o @ do Perfil',
      description: 'Digite o nome de usuário que deseja analisar. Não é necessário fazer login com sua conta nem fornecer qualquer dado pessoal.',
      icon: Search,
    },
    {
      num: '02',
      title: 'Varredura Criptografada',
      description: 'Nossos servidores anônimos rastreiam metadados públicos, frequências de postagem, cruzamento de curtidas e horários de pico.',
      icon: Cpu,
    },
    {
      num: '03',
      title: 'Acesse o Dossiê Visual',
      description: 'Em menos de 60 segundos você recebe o mapa completo de interações, padrões de madrugada e alertas confidenciais.',
      icon: FileText,
    },
  ];

  return (
    <section id="como-funciona" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl mx-auto border-t border-[rgba(139,92,246,0.12)]">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-mono-tech uppercase tracking-wider text-[#A855F7] mb-2 block">
          Fluxo de Operação
        </span>
        <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-[#F8FAFC]">
          Como a investigação funciona na prática
        </h2>
        <p className="mt-3 text-sm sm:text-base text-[#9CA3AF]">
          Simples, imediato e totalmente invisível para a pessoa analisada.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="relative p-6 sm:p-8 rounded-3xl bg-[#0B0B10] border border-[rgba(139,92,246,0.16)] flex flex-col justify-between group hover:border-[#8B5CF6]/50 transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#050507] border border-[#8B5CF6]/30 flex items-center justify-center text-[#A855F7]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono-tech text-xl font-bold text-[#8B5CF6]/50 group-hover:text-[#A855F7] transition-colors">
                    {step.num}
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-white">
                  {step.title}
                </h3>

                <p className="text-sm text-[#9CA3AF] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <button
          onClick={onStartNow}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#C084FC] hover:text-white transition-colors underline decoration-dotted"
        >
          <span>Experimentar varredura agora</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};

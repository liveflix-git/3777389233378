import React from 'react';
import { Clock, Users, EyeOff, BellRing, Sparkles, ArrowRight } from 'lucide-react';

interface InvestigationFeaturesProps {
  onSelectFeature?: () => void;
}

export const InvestigationFeatures: React.FC<InvestigationFeaturesProps> = ({ onSelectFeature }) => {
  const features = [
    {
      index: '01',
      title: 'Mapeamento de Horários Noturnos',
      subtitle: 'Presença Silenciosa no App',
      description:
        'Descubra os momentos exatos em que o perfil esteve com o aplicativo aberto durante a madrugada, mesmo sem publicar fotos ou stories.',
      icon: Clock,
      highlight: 'Picos entre 00h e 03h',
      tag: 'Atividade Oculta',
    },
    {
      index: '02',
      title: 'Radar de Conexões Recíprocas',
      subtitle: 'Interações Mais Frequentes',
      description:
        'Nosso algoritmo cruza a velocidade e constância de curtidas para apontar quais perfis interagem em tempo recorde com o alvo.',
      icon: Users,
      highlight: '3 perfis em alerta',
      tag: 'Conexões Ocultas',
    },
    {
      index: '03',
      title: 'Visualizador Fantasma de Stories',
      subtitle: 'Sem Registro de Visualização',
      description:
        'Assista a stories, destaques e lives sem que seu nome ou conta apareça na lista de visualizadores do perfil alvo.',
      icon: EyeOff,
      highlight: 'Zero Rastro',
      tag: '100% Anônimo',
    },
    {
      index: '04',
      title: 'Histórico de Novos Seguidos',
      subtitle: 'Monitoramento em Tempo Real',
      description:
        'Receba avisos instantâneos quando a conta começar a seguir um novo perfil ou deixar de seguir alguém.',
      icon: BellRing,
      highlight: 'Atualizações Instantâneas',
      tag: 'Alertas Ativos',
    },
  ];

  return (
    <section id="recursos" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 text-xs font-mono-tech uppercase tracking-wider text-[#A855F7] mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Camadas de Inteligência</span>
        </div>
        <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-[#F8FAFC] tracking-tight">
          O que você descobre ao iniciar a análise?
        </h2>
        <p className="mt-4 text-sm sm:text-base text-[#9CA3AF] leading-relaxed">
          Dados estruturados de maneira visual para você entender sinais que passariam completamente despercebidos a olho nu.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feat) => {
          const Icon = feat.icon;
          return (
            <div
              key={feat.index}
              className="group relative rounded-3xl bg-[#0B0B10] border border-[rgba(139,92,246,0.18)] p-6 sm:p-8 hover:border-[rgba(139,92,246,0.4)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(139,92,246,0.12)] flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#050507] border border-[rgba(139,92,246,0.3)] flex items-center justify-center text-[#A855F7] group-hover:scale-105 group-hover:text-white transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-mono-tech text-xs text-[#9CA3AF]">
                    {feat.index} · {feat.tag}
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-[#F8FAFC] group-hover:text-[#E9D5FF] transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs font-mono-tech text-[#A855F7] mt-1">
                    {feat.subtitle}
                  </p>
                </div>

                <p className="text-sm text-[#9CA3AF] leading-relaxed">
                  {feat.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[rgba(139,92,246,0.1)] flex items-center justify-between text-xs">
                <span className="font-mono-tech text-[#C084FC]">
                  {feat.highlight}
                </span>
                <span className="text-[#9CA3AF] group-hover:text-white flex items-center gap-1 transition-colors">
                  Ver detalhes
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};

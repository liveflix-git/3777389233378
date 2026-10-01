import React from 'react';
import { Check, Zap, Crown, ShieldCheck, ArrowRight } from 'lucide-react';

interface PricingSectionProps {
  onSelectPlan: (planName: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  return (
    <section id="planos" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl mx-auto border-t border-[rgba(139,92,246,0.12)]">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-mono-tech uppercase tracking-wider text-[#A855F7] mb-2 block">
          Acesso & Relatórios
        </span>
        <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-[#F8FAFC]">
          Escolha como deseja investigar
        </h2>
        <p className="mt-3 text-sm sm:text-base text-[#9CA3AF]">
          Acesso instantâneo e sigilo garantido. Sem assinaturas surpresa ou fidelidade.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        
        {/* Plan 1: Dossiê Único */}
        <div className="p-8 rounded-3xl bg-[#0B0B10] border border-[rgba(139,92,246,0.2)] flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-tech uppercase tracking-wider text-[#9CA3AF]">
                Análise Expressa
              </span>
              <span className="text-xs font-mono-tech text-emerald-400">Entrega em 60s</span>
            </div>

            <div>
              <h3 className="font-display font-bold text-2xl text-white">Dossiê Único</h3>
              <p className="text-xs text-[#9CA3AF] mt-1">
                Ideal para investigar um perfil específico com relatório detalhado.
              </p>
            </div>

            <div className="pt-2 flex items-baseline gap-1">
              <span className="text-sm font-semibold text-[#9CA3AF]">R$</span>
              <span className="font-display text-4xl font-extrabold text-white">29,90</span>
              <span className="text-xs text-[#9CA3AF]">/ pagamento único</span>
            </div>

            <ul className="space-y-3 pt-4 border-t border-[rgba(139,92,246,0.12)] text-xs text-[#9CA3AF]">
              <li className="flex items-center gap-2 text-white">
                <Check className="w-4 h-4 text-emerald-400" />
                1 Dossiê Completo de Qualquer Perfil
              </li>
              <li className="flex items-center gap-2 text-white">
                <Check className="w-4 h-4 text-emerald-400" />
                Mapeamento de Horários Noturnos
              </li>
              <li className="flex items-center gap-2 text-white">
                <Check className="w-4 h-4 text-emerald-400" />
                Top 5 Perfis com Interações Recíprocas
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#8B5CF6]" />
                Download do Relatório em PDF Seguro
              </li>
            </ul>
          </div>

          <button
            onClick={() => onSelectPlan('Dossiê Único')}
            className="w-full py-3.5 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider text-white bg-[#050507] border border-[rgba(139,92,246,0.4)] hover:bg-[#8B5CF6]/15 hover:border-[#8B5CF6] transition-all flex items-center justify-center gap-2"
          >
            <span>Gerar Dossiê Único</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Plan 2: Acesso VIP Ilimitado (Highlight) */}
        <div className="p-8 rounded-3xl bg-gradient-to-b from-[#0F0E17] to-[#0B0B10] border-2 border-[#8B5CF6] flex flex-col justify-between space-y-6 shadow-[0_0_40px_rgba(139,92,246,0.25)] relative">
          
          <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-[11px] font-bold text-white uppercase tracking-wider shadow-md">
            Mais Escolhido
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-tech uppercase tracking-wider text-[#A855F7]">
                Monitoramento Contínuo
              </span>
              <span className="flex items-center gap-1 text-xs text-amber-400 font-medium">
                <Crown className="w-3.5 h-3.5" /> VIP Ilimitado
              </span>
            </div>

            <div>
              <h3 className="font-display font-bold text-2xl text-white">Passaporte VIP</h3>
              <p className="text-xs text-[#9CA3AF] mt-1">
                Monitore múltiplos perfis com alertas automáticos em tempo real.
              </p>
            </div>

            <div className="pt-2 flex items-baseline gap-1">
              <span className="text-sm font-semibold text-[#9CA3AF]">R$</span>
              <span className="font-display text-4xl font-extrabold text-white">49,90</span>
              <span className="text-xs text-[#9CA3AF]">/ acesso vitalício</span>
            </div>

            <ul className="space-y-3 pt-4 border-t border-[rgba(139,92,246,0.12)] text-xs text-[#9CA3AF]">
              <li className="flex items-center gap-2 text-white">
                <Check className="w-4 h-4 text-emerald-400" />
                Perfis Ilimitados para Investigar
              </li>
              <li className="flex items-center gap-2 text-white">
                <Check className="w-4 h-4 text-emerald-400" />
                Alertas Instantâneos de Novos Seguidos
              </li>
              <li className="flex items-center gap-2 text-white">
                <Check className="w-4 h-4 text-emerald-400" />
                Visualizador Fantasma de Stories Sem Rastro
              </li>
              <li className="flex items-center gap-2 text-white">
                <Check className="w-4 h-4 text-emerald-400" />
                Garantia Incondicional de 7 Dias
              </li>
            </ul>
          </div>

          <button
            onClick={() => onSelectPlan('Passaporte VIP')}
            className="w-full py-4 px-6 rounded-2xl font-bold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-[#8B5CF6] via-[#9333EA] to-[#A855F7] hover:brightness-110 shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-all flex items-center justify-center gap-2"
          >
            <span>Desbloquear Acesso Ilimitado</span>
            <Zap className="w-4 h-4 fill-white" />
          </button>
        </div>

      </div>

      <div className="mt-8 text-center text-xs text-[#9CA3AF] flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Garantia de 7 dias com devolução integral do valor se não ficar satisfeito.</span>
      </div>
    </section>
  );
};

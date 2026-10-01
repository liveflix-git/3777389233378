import React from 'react';
import { Eye, ShieldCheck, Lock, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardFooterProps {
  onOpenInfoModal: (title: string, message: string) => void;
}

export const DashboardFooter: React.FC<DashboardFooterProps> = ({ onOpenInfoModal }) => {
  const navigate = useNavigate();

  return (
    <footer className="w-full select-none mt-12">
      {/* Area 1: Brand intro & Security badges */}
      <div className="w-full bg-[#151A20] border-t border-white/5 py-10 px-5 text-center flex flex-col items-center justify-center space-y-5">
        {/* Small Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#0B0B10] border border-[#8B5CF6]/40 flex items-center justify-center shadow-sm">
            <Eye className="w-3.5 h-3.5 text-[#A855F7]" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-white">
            ESPIA AÍ <span className="text-[#8B5CF6]">APP</span>
          </span>
        </div>

        {/* Short platform description */}
        <p className="text-xs sm:text-sm text-[#9CA3AF] max-w-md leading-relaxed font-normal">
          O Espia Aí reúne ferramentas de análise e organização de informações em uma única plataforma.
        </p>

        {/* Security callout badges */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 text-xs text-white/80 font-medium flex-wrap pt-1">
          <div className="flex items-center gap-1.5 bg-[#0B0E12] px-3 py-1.5 rounded-lg border border-white/5">
            <Lock className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>Conexão segura</span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#0B0E12] px-3 py-1.5 rounded-lg border border-white/5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Site protegido</span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#0B0E12] px-3 py-1.5 rounded-lg border border-white/5">
            <CreditCard className="w-3.5 h-3.5 text-amber-400" />
            <span>Pagamentos seguros</span>
          </div>
        </div>

        {/* Payment Methods Image */}
        <div className="flex items-center justify-center pt-3">
          <img
            src="https://i.ibb.co/bMcW4Ryc/formas-pagamento.png"
            alt="Formas de pagamento"
            className="h-14 sm:h-20 w-auto object-contain max-w-[360px] sm:max-w-[480px]"
          />
        </div>
      </div>

      {/* Area 2: Links Grid (Serviços & Informações) */}
      <div className="w-full bg-[#070B0D] border-t border-white/5 py-8 px-5">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {/* Column 1: Serviços */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Serviços
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#9CA3AF]">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  • Instagram
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfoModal('WhatsApp', 'Recurso em desenvolvimento.')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  • WhatsApp
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfoModal('Facebook', 'Recurso em desenvolvimento.')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  • Facebook
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfoModal('Localização', 'Recurso em desenvolvimento.')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  • Localização
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfoModal('Câmera', 'Recurso em desenvolvimento.')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  • Câmera
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfoModal('Detetive Particular', 'Atendimento especializado sob demanda.')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  • Detetive Particular
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Informações */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Informações
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#9CA3AF]">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfoModal('Central de Ajuda', 'Nossa equipe de suporte está disponível 24/7.')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  • Central de Ajuda
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfoModal('Termos de Uso', 'Termos e diretrizes de uso da plataforma Espia Aí.')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  • Termos de Uso
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfoModal('Política de Privacidade', 'Sua privacidade e dados mantidos em sigilo absoluto.')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  • Política de Privacidade
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfoModal('LGPD', 'Conformidade com a Lei Geral de Proteção de Dados.')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  • LGPD
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="max-w-[1280px] mx-auto border-t border-white/5 mt-8 pt-6 text-center">
          <p className="text-[11px] text-[#6B7280] font-mono">
            © 2026 ESPIA AÍ APP. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

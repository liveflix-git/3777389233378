import React from 'react';
import { ShieldCheck, EyeOff, KeyRound, Server, Check } from 'lucide-react';

export const SecurityGuarantee: React.FC = () => {
  const points = [
    {
      title: 'Zero Acesso à sua Conta',
      description: 'Nós nunca solicitamos seu login, senha ou e-mail do Instagram. Sua privacidade permanece inviolável.',
      icon: KeyRound,
    },
    {
      title: 'Rastreamento 100% Fantasma',
      description: 'As consultas são feitas através de proxies internacionais rotativos. O perfil investigado não recebe aviso algum.',
      icon: EyeOff,
    },
    {
      title: 'Destruição Automática de Cache',
      description: 'Todas as informações e relatórios gerados são criptografados e apagados do banco após a entrega.',
      icon: Server,
    },
  ];

  return (
    <section id="sigilo" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl mx-auto border-t border-[rgba(139,92,246,0.12)]">
      <div className="rounded-[32px] bg-gradient-to-b from-[#0B0B10] to-[#07070A] border border-[rgba(139,92,246,0.22)] p-8 sm:p-14 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#8B5CF6]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono-tech text-emerald-400 mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>PROTOCOLO DE SIGILO BLINDADO</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-[#F8FAFC]">
            Por que é tecnicamente impossível alguém saber que você investigou?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#9CA3AF] leading-relaxed">
            Desenvolvido com arquitetura descentralizada. Suas pesquisas não deixam pegadas digitais, cookies nem registros em redes sociais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {points.map((pt, i) => {
            const Icon = pt.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#050507] border border-[rgba(139,92,246,0.14)] space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#A855F7]">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-base text-white">
                  {pt.title}
                </h3>
                <p className="text-xs text-[#9CA3AF] leading-relaxed">
                  {pt.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Security badges bar */}
        <div className="mt-10 pt-8 border-t border-[rgba(139,92,246,0.12)] flex flex-wrap items-center justify-between gap-4 text-xs text-[#9CA3AF]">
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-400" />
            Conexão TLS 1.3 Criptografada
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-400" />
            Em conformidade com LGPD & Sigilo Digital
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-400" />
            Zero Armazenamento de Senhas
          </span>
        </div>

      </div>
    </section>
  );
};

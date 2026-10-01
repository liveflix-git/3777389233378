import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  Search, 
  ShieldCheck, 
  KeyRound, 
  Sparkles, 
  Lock, 
  Check, 
  Users, 
  Flame, 
  ArrowRight,
  TrendingUp,
  AtSign,
  Radio
} from 'lucide-react';

interface HeroSectionProps {
  onStartAnalysis: (handle: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartAnalysis }) => {
  const [handle, setHandle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [counter, setCounter] = useState(84304);
  const [pulseCount, setPulseCount] = useState(false);
  const [recentNotification, setRecentNotification] = useState<string | null>(null);

  // Dynamic increment of analyzed profiles
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => prev + Math.floor(Math.random() * 2) + 1);
      setPulseCount(true);
      setTimeout(() => setPulseCount(false), 800);
    }, 5500);

    return () => clearInterval(interval);
  }, []);

  // Occasional discrete toast notifications of live queries
  useEffect(() => {
    const cities = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Brasília', 'Salvador', 'Porto Alegre'];
    const interval = setInterval(() => {
      const city = cities[Math.floor(Math.random() * cities.length)];
      const secondsAgo = Math.floor(Math.random() * 20) + 4;
      setRecentNotification(`Novo perfil analisado em ${city} há ${secondsAgo}s`);
      
      const timeout = setTimeout(() => {
        setRecentNotification(null);
      }, 3500);
      return () => clearTimeout(timeout);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = handle.trim().replace(/^@/, '');
    if (!clean) {
      setErrorMessage('Por favor, digite o @ do perfil que deseja investigar.');
      return;
    }
    setErrorMessage('');
    onStartAnalysis(clean);
  };

  const handleQuickSelect = (suggestedHandle: string) => {
    setHandle(suggestedHandle);
    setErrorMessage('');
    onStartAnalysis(suggestedHandle.replace(/^@/, ''));
  };

  return (
    <section className="relative min-h-screen pt-24 pb-16 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Background radial violet glow for depth */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[620px] lg:w-[840px] h-[340px] sm:h-[620px] lg:h-[840px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.16) 0%, rgba(168, 85, 247, 0.06) 45%, rgba(5, 5, 7, 0) 70%)',
          filter: 'blur(80px)',
        }}
        aria-hidden="true"
      />

      {/* Cyber Reticle / Subtle Target Rings */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] sm:w-[850px] sm:h-[850px] rounded-full border border-[rgba(139,92,246,0.06)] pointer-events-none"
        aria-hidden="true"
      />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] sm:w-[500px] sm:h-[500px] rounded-full border border-[rgba(139,92,246,0.08)] pointer-events-none"
        aria-hidden="true"
      />

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center">
        
        {/* Discrete Security Kicker (Anti-pill text layout with separator) */}
        <div className="mb-4 flex items-center gap-2 text-xs font-mono-tech text-[#9CA3AF] tracking-wide">
          <span className="flex items-center gap-1.5 text-[#C084FC]">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            SISTEMA ONLINE
          </span>
          <span aria-hidden="true" className="text-neutral-700">·</span>
          <span>GATEWAY SEGURO 256-BIT</span>
          <span aria-hidden="true" className="text-neutral-700">·</span>
          <span>100% ANÔNIMO</span>
        </div>

        {/* 2. CARD CENTRAL */}
        <div 
          className="w-full bg-[#0B0B10]/95 backdrop-blur-xl rounded-[28px] sm:rounded-[32px] p-6 sm:p-10 border border-[rgba(139,92,246,0.18)] shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_35px_rgba(139,92,246,0.14)] relative overflow-hidden transition-all duration-300 hover:border-[rgba(139,92,246,0.28)]"
        >
          {/* Subtle top card glow line */}
          <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-[#8B5CF6]/50 to-transparent" />

          {/* 3. LOGO / TOPO DO CARD */}
          <div className="flex flex-col items-center justify-center text-center mb-6 sm:mb-8">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-[#050507] border border-[rgba(139,92,246,0.4)] shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                <Eye className="w-4.5 h-4.5 text-[#A855F7]" />
                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <span className="font-display font-extrabold text-xl sm:text-2xl tracking-tight text-[#F8FAFC]">
                Stalkeia <span className="text-[#A855F7]">App</span>
              </span>
            </div>
            <p className="text-[11px] font-mono-tech uppercase tracking-wider text-[#9CA3AF]">
              Inteligência e Monitoramento de Perfis
            </p>
          </div>

          {/* 4. HEADLINE PRINCIPAL */}
          <div className="text-center mb-5 sm:mb-6">
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl md:text-[34px] leading-[1.25] text-[#F8FAFC] tracking-tight">
              O que esse perfil{' '}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] via-[#C084FC] to-[#8B5CF6] drop-shadow-[0_0_18px_rgba(168,85,247,0.45)]">
                  realmente faz
                </span>
              </span>{' '}
              quando está no Instagram?
            </h1>
          </div>

          {/* 5. SUBHEADLINE */}
          <div className="text-center mb-8">
            <p className="text-sm sm:text-base text-[#9CA3AF] leading-relaxed max-w-md mx-auto">
              Descubra sinais, padrões e atividades de um perfil de forma rápida, discreta e visual.
            </p>
          </div>

          {/* INPUT + 6. CTA PRINCIPAL */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Input Wrapper */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#9CA3AF] group-focus-within:text-[#A855F7] transition-colors">
                <AtSign className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={handle}
                onChange={(e) => {
                  setHandle(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="digite o @ do perfil (ex: gabriel.costa)"
                className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-2xl bg-[#050507] border border-[rgba(139,92,246,0.25)] text-[#F8FAFC] placeholder-[#6B7280] text-sm sm:text-base font-medium focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/30 transition-all shadow-inner"
                autoComplete="off"
                spellCheck="false"
              />
            </div>

            {errorMessage && (
              <p className="text-xs text-rose-400 font-medium px-1">
                {errorMessage}
              </p>
            )}

            {/* Quick Suggestions */}
            <div className="flex items-center justify-between text-xs text-[#9CA3AF] px-1">
              <span>Sugestões rápidas de teste:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickSelect('mariana_silva')}
                  className="hover:text-[#C084FC] underline decoration-dotted transition-colors"
                >
                  @mariana_silva
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => handleQuickSelect('lucas.dev')}
                  className="hover:text-[#C084FC] underline decoration-dotted transition-colors"
                >
                  @lucas.dev
                </button>
              </div>
            </div>

            {/* CTA BUTTON */}
            <button
              type="submit"
              className="relative w-full overflow-hidden py-4 sm:py-4.5 px-6 rounded-2xl font-display font-bold text-base sm:text-lg text-white bg-gradient-to-r from-[#8B5CF6] via-[#9333EA] to-[#A855F7] hover:brightness-110 active:scale-[0.99] transition-all duration-200 shadow-[0_0_28px_rgba(139,92,246,0.45),0_8px_20px_rgba(0,0,0,0.5)] flex items-center justify-center gap-2.5 group cursor-pointer"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform pointer-events-none" />

              <Search className="w-5 h-5 text-white/95 group-hover:scale-110 transition-transform" />
              <span>Analisar Agora</span>
              <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* 7. BENEFÍCIOS RÁPIDOS ABAIXO DO BOTÃO */}
          <div className="mt-7 pt-6 border-t border-[rgba(139,92,246,0.12)]">
            <div className="grid grid-cols-3 gap-2 text-center">
              
              {/* Benefício 1 */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 text-xs text-[#F8FAFC]">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-medium whitespace-nowrap">100% Discreto</span>
              </div>

              {/* Benefício 2 */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 text-xs text-[#F8FAFC]">
                <KeyRound className="w-4 h-4 text-[#A855F7] shrink-0" />
                <span className="font-medium whitespace-nowrap">Sem Senha</span>
              </div>

              {/* Benefício 3 */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 text-xs text-[#F8FAFC]">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-medium whitespace-nowrap">Teste Grátis</span>
              </div>

            </div>
          </div>

        </div>

        {/* 8. PROVA SOCIAL / CONTADOR */}
        <div className="mt-8 flex flex-col items-center justify-center gap-2">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0B0B10]/80 border border-[rgba(139,92,246,0.22)] shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A855F7] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#8B5CF6]" />
            </span>
            <p className="text-xs sm:text-sm text-[#9CA3AF] font-medium">
              <span 
                className={`font-mono-tech font-bold text-white transition-all duration-300 ${
                  pulseCount ? 'text-[#C084FC] scale-105 inline-block' : ''
                }`}
              >
                +{counter.toLocaleString('pt-BR')}
              </span>{' '}
              perfis analisados hoje
            </p>
          </div>

          {/* Discreet live notification pill */}
          {recentNotification && (
            <div className="text-[11px] font-mono-tech text-[#C084FC]/90 animate-fadeIn flex items-center gap-1.5 bg-[#050507]/90 px-3 py-1 rounded-full border border-[#8B5CF6]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {recentNotification}
            </div>
          )}
        </div>

      </div>

    </section>
  );
};

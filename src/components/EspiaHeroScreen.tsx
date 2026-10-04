import React, { useState, useEffect, useMemo } from 'react';
import { Eye, Lock, KeyRound, Check } from 'lucide-react';

interface EspiaHeroScreenProps {
  onStartAnalysis: () => void;
}

const FULL_HEADLINE = 'O que seu Cônjuge faz quando está no Instagram?';
const INITIAL_TYPED_TEXT = 'O que se'; // Início conforme solicitado: "O que se" + cursor piscando

export const EspiaHeroScreen: React.FC<EspiaHeroScreenProps> = ({ onStartAnalysis }) => {
  const [typedLength, setTypedLength] = useState<number>(INITIAL_TYPED_TEXT.length);
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [showSubtitle, setShowSubtitle] = useState<boolean>(false);
  const [showCTA, setShowCTA] = useState<boolean>(false);
  const [showBenefits, setShowBenefits] = useState<boolean>(false);

  // Dynamic increment for social proof counter
  const baseCount = 81937;
  const [animatedCounter, setAnimatedCounter] = useState(baseCount);
  const [pulseCount, setPulseCount] = useState(false);

  // Get current day of week in Portuguese (ex: sábado)
  const currentDayOfWeek = useMemo(() => {
    const days = [
      'domingo',
      'segunda-feira',
      'terça-feira',
      'quarta-feira',
      'quinta-feira',
      'sexta-feira',
      'sábado',
    ];
    return days[new Date().getDay()];
  }, []);

  // 1. Typing animation for the main title (starts at "O que se" and types rapidly)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    // Small initial delay before continuing typing
    timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        setTypedLength((prev) => {
          if (prev >= FULL_HEADLINE.length) {
            clearInterval(intervalId);
            setIsTyping(false);
            return FULL_HEADLINE.length;
          }
          return prev + 1;
        });
      }, 42); // ~42ms per character -> fast, smooth natural typing
    }, 280);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []);

  // 2. Cascade reveal of Subtitle, CTA and Benefits once typing completes
  useEffect(() => {
    if (!isTyping) {
      const t1 = setTimeout(() => setShowSubtitle(true), 140);
      const t2 = setTimeout(() => setShowCTA(true), 400);
      const t3 = setTimeout(() => setShowBenefits(true), 600);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [isTyping]);

  // Gradual pulse increment for social proof counter
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedCounter((prev) => prev + Math.floor(Math.random() * 2) + 1);
      setPulseCount(true);
      setTimeout(() => setPulseCount(false), 700);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  /**
   * Helper to format headline with "Cônjuge" highlighted in purple dynamically
   * "O que seu " (0..10)
   * "Cônjuge" (10..17)
   * " faz quando está no Instagram?" (17..)
   */
  const renderFormattedHeadline = () => {
    const currentText = FULL_HEADLINE.slice(0, typedLength);

    if (typedLength <= 10) {
      return (
        <>
          <span>{currentText}</span>
          <span className="inline-block w-[3px] h-[1.05em] bg-[#A855F7] align-middle ml-0.5 animate-pulse" />
        </>
      );
    }

    if (typedLength > 10 && typedLength <= 17) {
      const prefix = FULL_HEADLINE.slice(0, 10);
      const conjugePartial = FULL_HEADLINE.slice(10, typedLength);
      return (
        <>
          <span>{prefix}</span>
          <span className="text-[#A855F7] font-bold drop-shadow-[0_0_12px_rgba(168,85,247,0.4)]">
            {conjugePartial}
          </span>
          <span className="inline-block w-[3px] h-[1.05em] bg-[#A855F7] align-middle ml-0.5 animate-pulse" />
        </>
      );
    }

    // typedLength > 17
    const prefix = FULL_HEADLINE.slice(0, 10);
    const conjuge = 'Cônjuge';
    const suffix = FULL_HEADLINE.slice(17, typedLength);

    return (
      <>
        <span>{prefix}</span>
        <span className="text-[#A855F7] font-bold drop-shadow-[0_0_12px_rgba(168,85,247,0.4)]">
          {conjuge}
        </span>
        <span>{suffix}</span>
        {isTyping && (
          <span className="inline-block w-[3px] h-[1.05em] bg-[#A855F7] align-middle ml-0.5 animate-pulse" />
        )}
      </>
    );
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center px-4 sm:px-6 py-10 sm:py-16 overflow-hidden select-none">
      {/* Glow radial atrás do card */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] sm:w-[620px] h-[360px] sm:h-[620px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(168, 85, 247, 0.18) 0%, rgba(37, 99, 235, 0.15) 35%, rgba(5, 5, 7, 0) 70%)',
          filter: 'blur(80px)',
        }}
        aria-hidden="true"
      />

      {/* Central Card */}
      <div className="relative z-10 w-full max-w-[480px] mx-auto bg-[#0A0D14]/92 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.94),0_0_30px_rgba(168,85,247,0.06)] text-center transition-all duration-300 overflow-hidden">
        {/* Linha horizontal de scanner */}
        <div
          className="absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#A855F7]/35 to-transparent pointer-events-none animate-card-scanner z-0"
          aria-hidden="true"
        />

        {/* Cantos decorativos */}
        <div className="absolute top-2.5 left-2.5 w-2.5 h-2.5 border-t-2 border-l-2 border-[#A855F7] rounded-tl glow-corner-accent pointer-events-none" />
        <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 border-t-2 border-r-2 border-[#A855F7] rounded-tr glow-corner-accent pointer-events-none" />
        <div className="absolute bottom-2.5 left-2.5 w-2.5 h-2.5 border-b-2 border-l-2 border-[#4F46E5] rounded-bl glow-corner-accent pointer-events-none" />
        <div className="absolute bottom-2.5 right-2.5 w-2.5 h-2.5 border-b-2 border-r-2 border-[#4F46E5] rounded-br glow-corner-accent pointer-events-none" />

        {/* 1. STATUS: ● SISTEMA ONLINE */}
        <div className="relative z-10 inline-flex items-center gap-2 mb-4 px-2.5 py-1 rounded-full bg-[#050507]/80 border border-slate-800/90 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
          <span className="font-mono-tech text-[10px] sm:text-[11px] font-medium tracking-wider uppercase text-[#94A3B8]">
            SISTEMA ONLINE
          </span>
        </div>

        {/* LOGO ESPIA AÍ NO TOPO */}
        <div className="relative z-10 flex flex-col items-center justify-center mb-3">
          <img
            src="/espia-logo.png"
            alt="Espia Aí App Logo"
            className="w-28 sm:w-34 h-auto max-h-20 sm:max-h-24 object-contain mx-auto drop-shadow-[0_0_20px_rgba(168,85,247,0.35)] transition-transform hover:scale-105"
          />
        </div>

        {/* 2. HEADLINE PRINCIPAL (Com animação de digitação rápida e "Cônjuge" destacado) */}
        <h1 className="relative z-10 font-main font-extrabold text-[22px] sm:text-[26px] md:text-[29px] leading-[1.26] text-[#F5F5F7] tracking-tight mb-3 min-h-[64px] sm:min-h-[72px] flex items-center justify-center">
          <span className="inline">{renderFormattedHeadline()}</span>
        </h1>

        {/* 3. SUBTÍTULO (Surge suavemente após a digitação) */}
        <div
          className={`relative z-10 transition-all duration-500 transform ${
            showSubtitle
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2 pointer-events-none'
          } mb-6`}
        >
          <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed max-w-sm mx-auto">
            Descubra a verdade sobre{' '}
            <span className="text-[#A855F7] font-semibold">qualquer pessoa</span>
            , acessando o instagram dela!
          </p>
        </div>

        {/* 4. BOTÃO CTA (Surge após o término da digitação do título) */}
        <div
          className={`relative z-10 w-full mb-5 transition-all duration-500 transform ${
            showCTA
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-3 pointer-events-none'
          }`}
        >
          <button
            type="button"
            onClick={onStartAnalysis}
            className="w-full relative overflow-hidden group cursor-pointer py-4 px-6 rounded-xl sm:rounded-2xl font-main font-bold text-sm sm:text-base tracking-wider uppercase text-white bg-gradient-to-r from-[#2563EB] via-[#6366F1] to-[#9333EA] hover:brightness-110 active:scale-[0.98] transition-all duration-200 shadow-[0_0_26px_rgba(147,51,234,0.38)] flex items-center justify-center gap-2.5"
          >
            {/* Shimmer sweep */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform pointer-events-none" />

            {/* Olho pulsando */}
            <span className="relative flex items-center justify-center">
              <Eye className="w-5 h-5 text-white animate-pulse" />
              <span className="absolute w-2 h-2 rounded-full bg-[#E9D5FF] opacity-80 animate-ping" />
            </span>

            <span>Espionar Agora</span>
          </button>
        </div>

        {/* 5. BENEFÍCIOS (Entram suavemente após o CTA) */}
        <div
          className={`relative z-10 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-2.5 sm:gap-3.5 text-[11px] sm:text-xs text-[#94A3B8] font-medium flex-wrap transition-all duration-500 ${
            showBenefits ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* 100% Anônimo */}
          <span className="inline-flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
            <span>100% Anônimo</span>
          </span>

          <span aria-hidden="true" className="text-slate-700">•</span>

          {/* Sem Senha */}
          <span className="inline-flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-[#A855F7] shrink-0" />
            <span>Sem Senha</span>
          </span>

          <span aria-hidden="true" className="text-slate-700">•</span>

          {/* Teste Grátis */}
          <span className="inline-flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#3B82F6] shrink-0" />
            <span>Teste Grátis</span>
          </span>
        </div>

        {/* 6. PROVA SOCIAL NO RODAPÉ DO CARD */}
        <div
          className={`relative z-10 mt-5 flex items-center justify-center transition-opacity duration-500 ${
            showBenefits ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p className="text-xs font-mono-tech text-[#94A3B8]">
            <span
              className={`font-bold text-[#A855F7] transition-all duration-300 inline-block drop-shadow-[0_0_8px_rgba(168,85,247,0.35)] ${
                pulseCount ? 'text-[#E9D5FF] scale-105' : ''
              }`}
            >
              +{animatedCounter.toLocaleString('pt-BR')}
            </span>{' '}
            perfis analisados hoje ({currentDayOfWeek})
          </p>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Eye, Lock, KeyRound, Check } from 'lucide-react';
import { TypewriterText } from './TypewriterText';

interface EspiaHeroScreenProps {
  onStartAnalysis: () => void;
}

export const EspiaHeroScreen: React.FC<EspiaHeroScreenProps> = ({ onStartAnalysis }) => {
  const targetCount = 38344;
  const [animatedCounter, setAnimatedCounter] = useState(0);
  const [counterFinished, setCounterFinished] = useState(false);
  const [pulseCount, setPulseCount] = useState(false);

  // Numeric count up from 0 -> 38,344 starting at 1800ms
  useEffect(() => {
    let animationFrameId: number;
    let startTimestamp: number | null = null;
    const duration = 700; // ms

    const timer = setTimeout(() => {
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeOutProgress = 1 - Math.pow(1 - progress, 2);
        const currentVal = Math.floor(easeOutProgress * targetCount);
        setAnimatedCounter(currentVal);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(step);
        } else {
          setAnimatedCounter(targetCount);
          setCounterFinished(true);
        }
      };

      animationFrameId = requestAnimationFrame(step);
    }, 1800);

    return () => {
      clearTimeout(timer);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Dynamic gradual increment after initial count up finishes
  useEffect(() => {
    if (!counterFinished) return;

    const interval = setInterval(() => {
      setAnimatedCounter((prev) => prev + Math.floor(Math.random() * 2) + 1);
      setPulseCount(true);
      setTimeout(() => setPulseCount(false), 700);
    }, 4500);

    return () => clearInterval(interval);
  }, [counterFinished]);

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center px-4 sm:px-6 py-10 sm:py-16 overflow-hidden select-none">
      {/* Glow radial azul elétrico e cibernético atrás do card */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] sm:w-[620px] h-[360px] sm:h-[620px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(37, 99, 235, 0.24) 0%, rgba(79, 70, 229, 0.12) 40%, rgba(5, 5, 7, 0) 70%)',
          filter: 'blur(80px)',
        }}
        aria-hidden="true"
      />

      {/* Central Card */}
      <div className="relative z-10 w-full max-w-[480px] mx-auto bg-[#0A0D14]/92 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.94),0_0_30px_rgba(37,99,235,0.08)] text-center transition-all duration-300 overflow-hidden">
        {/* Linha horizontal de scanner */}
        <div
          className="absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#3B82F6]/35 to-transparent pointer-events-none animate-card-scanner z-0"
          aria-hidden="true"
        />

        {/* Cantos decorativos */}
        <div className="absolute top-2.5 left-2.5 w-2.5 h-2.5 border-t-2 border-l-2 border-[#3B82F6] rounded-tl glow-corner-accent pointer-events-none" />
        <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 border-t-2 border-r-2 border-[#3B82F6] rounded-tr glow-corner-accent pointer-events-none" />
        <div className="absolute bottom-2.5 left-2.5 w-2.5 h-2.5 border-b-2 border-l-2 border-[#4F46E5] rounded-bl glow-corner-accent pointer-events-none" />
        <div className="absolute bottom-2.5 right-2.5 w-2.5 h-2.5 border-b-2 border-r-2 border-[#4F46E5] rounded-br glow-corner-accent pointer-events-none" />

        {/* 1. STATUS: ● SISTEMA ONLINE */}
        <div className="relative z-10 inline-flex items-center gap-2 mb-4 px-2.5 py-1 rounded-full bg-[#050507]/80 border border-slate-800/90 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
          <span className="font-mono-tech text-[10px] sm:text-[11px] font-medium tracking-wider uppercase text-[#94A3B8]">
            <TypewriterText
              text="SISTEMA ONLINE"
              speed={18}
              delay={50}
              cursor={true}
            />
          </span>
        </div>

        {/* LOGO ESPIA AÍ */}
        <div className="relative z-10 flex flex-col items-center justify-center mb-2">
          <img
            src="/espia-logo.png"
            alt="Espia Aí App Logo"
            className="w-28 sm:w-34 h-auto max-h-20 sm:max-h-24 object-contain mx-auto drop-shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-transform hover:scale-105"
          />
        </div>

        {/* 2. HEADLINE PRINCIPAL */}
        <h1 className="relative z-10 font-main font-extrabold text-[22px] sm:text-[27px] md:text-[31px] leading-[1.24] text-[#F5F5F7] tracking-tight mb-3">
          <TypewriterText
            text="O que seu cônjuge está fazendo no Instagram agora?"
            speed={22}
            delay={200}
            cursor={true}
          />
        </h1>

        {/* 3. SUBHEADLINE */}
        <p className="relative z-10 text-sm sm:text-base text-[#94A3B8] leading-relaxed max-w-sm mx-auto mb-6">
          <TypewriterText
            text="Descubra a verdade sobre qualquer pessoa acessando o Instagram dela."
            speed={16}
            delay={850}
            cursor={true}
          />
        </p>

        {/* 4. BOTÃO PRINCIPAL (Interativo e pronto para clique) */}
        <div className="relative z-10 w-full mb-5">
          <button
            type="button"
            onClick={onStartAnalysis}
            className="w-full relative overflow-hidden group cursor-pointer py-4 px-6 rounded-xl sm:rounded-2xl font-main font-bold text-sm sm:text-base tracking-wider uppercase text-white bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] hover:brightness-110 active:scale-[0.98] transition-all duration-200 shadow-[0_0_24px_rgba(37,99,235,0.35)] flex items-center justify-center gap-2.5"
          >
            {/* Shimmer sweep */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform pointer-events-none" />

            {/* Olhinho piscando */}
            <span className="relative flex items-center justify-center">
              <Eye className="w-5 h-5 text-white animate-pulse" />
              <span className="absolute w-2 h-2 rounded-full bg-[#93C5FD] opacity-80 animate-ping" />
            </span>

            <span>ESPIONAR AGORA</span>
          </button>
        </div>

        {/* 5. BENEFÍCIOS LOGO ABAIXO DO BOTÃO */}
        <div className="relative z-10 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-2.5 sm:gap-3.5 text-[11px] sm:text-xs text-[#94A3B8] font-medium flex-wrap">
          {/* Sem senha */}
          <span className="inline-flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-[#3B82F6] shrink-0" />
            <span>
              <TypewriterText
                text="Sem senha"
                speed={14}
                delay={1300}
                cursor={false}
              />
            </span>
          </span>

          <span aria-hidden="true" className="text-slate-700">•</span>

          {/* 100% anônimo */}
          <span className="inline-flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
            <span>
              <TypewriterText
                text="100% anônimo"
                speed={14}
                delay={1450}
                cursor={false}
              />
            </span>
          </span>

          <span aria-hidden="true" className="text-slate-700">•</span>

          {/* Análise inicial grátis */}
          <span className="inline-flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#3B82F6] shrink-0" />
            <span>
              <TypewriterText
                text="Análise inicial grátis"
                speed={14}
                delay={1600}
                cursor={false}
              />
            </span>
          </span>
        </div>

        {/* 6. PROVA SOCIAL COM CONTADOR DE ANÁLISES */}
        <div className="relative z-10 mt-5 flex items-center justify-center">
          <p className="text-xs font-mono-tech text-[#94A3B8]">
            <span
              className={`font-bold text-[#60A5FA] transition-all duration-300 inline-block drop-shadow-[0_0_8px_rgba(59,130,246,0.35)] ${
                pulseCount ? 'text-[#93C5FD] scale-105' : ''
              }`}
            >
              +{animatedCounter.toLocaleString('pt-BR')}
            </span>{' '}
            <TypewriterText
              text="análises realizadas hoje"
              speed={16}
              delay={1800}
              cursor={false}
            />
          </p>
        </div>
      </div>
    </div>
  );
};

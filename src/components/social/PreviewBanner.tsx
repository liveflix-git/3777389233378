import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { getEspiaPreviewRemainingSeconds, isEspiaPreviewExpired } from '../../services/espiaSession';

interface PreviewBannerProps {
  onVirarVip: () => void;
}

export const PreviewBanner: React.FC<PreviewBannerProps> = ({ onVirarVip }) => {
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState<number>(() => getEspiaPreviewRemainingSeconds());

  useEffect(() => {
    // Check expiration on mount
    if (isEspiaPreviewExpired()) {
      navigate('/unlock', { replace: true });
      return;
    }

    const interval = setInterval(() => {
      const remaining = getEspiaPreviewRemainingSeconds();
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        navigate('/unlock', { replace: true });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const isExpired = secondsLeft === 0;
  const isUrgent = secondsLeft > 0 && secondsLeft < 60;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-gradient-to-r from-[#F97316] via-[#EC4899] to-[#9333EA] text-white px-3.5 sm:px-5 pt-2.5 sm:pt-3 pb-[calc(0.55rem+env(safe-area-inset-bottom,0px))] shadow-[0_-8px_30px_rgba(0,0,0,0.85)] select-none">
      <div className="max-w-[1380px] mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-1.5 sm:gap-4">
        
        {/* Mobile Top Row / Desktop Left Block */}
        <div className="flex items-center justify-between sm:justify-start gap-2.5 min-w-0 flex-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-yellow-300 shrink-0 text-sm">⚡</span>
            <span className="font-semibold text-xs sm:text-sm text-white tracking-tight truncate">
              Prévia disponível por
            </span>
            <span 
              className={`font-mono font-bold text-xs sm:text-sm tracking-wider tabular-nums bg-black/20 px-1.5 py-0.5 rounded border border-white/20 text-white shrink-0 ${
                isUrgent ? 'animate-pulse text-yellow-200 border-yellow-300/40' : ''
              }`}
            >
              {formatTime(secondsLeft)}
            </span>
            {isExpired && (
              <span className="text-[9px] font-bold uppercase bg-black/50 px-1.5 py-0.5 rounded border border-white/30 text-white shrink-0">
                Expirado
              </span>
            )}
          </div>

          {/* CTA Button visible on mobile top-right and desktop right */}
          <div className="sm:hidden shrink-0">
            <button
              type="button"
              onClick={onVirarVip}
              className="px-3.5 py-1.5 h-[32px] rounded-lg font-bold text-[11.5px] text-neutral-950 bg-white hover:bg-neutral-100 active:scale-95 transition-all shadow-md flex items-center gap-1.5 cursor-pointer uppercase tracking-wider whitespace-nowrap"
            >
              <Zap className="w-3 h-3 fill-neutral-950 text-neutral-950" />
              <span>Virar VIP</span>
            </button>
          </div>
        </div>

        {/* Subtitle text */}
        <p className="text-[11px] sm:text-[12.5px] text-white/90 leading-tight truncate sm:whitespace-normal sm:flex-1 sm:px-2">
          Você ganhou 5 minutos para testar gratuitamente nossa ferramenta. Para liberar todas as funcionalidades e manter o acesso, torne-se VIP.
        </p>

        {/* Desktop CTA Button */}
        <div className="hidden sm:flex shrink-0 items-center justify-end">
          <button
            type="button"
            onClick={onVirarVip}
            className="px-5 py-2 h-[36px] rounded-xl font-bold text-xs sm:text-sm text-neutral-950 bg-white hover:bg-neutral-100 active:scale-95 transition-all shadow-[0_4px_15px_rgba(0,0,0,0.3)] flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider whitespace-nowrap"
          >
            <Zap className="w-3.5 h-3.5 fill-neutral-950 text-neutral-950" />
            <span>Virar VIP</span>
          </button>
        </div>

      </div>
    </div>
  );
};

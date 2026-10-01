import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { VipCTAButton } from './VipCTAButton';

interface BottomPreviewBarProps {
  onVipClick: () => void;
}

export const BottomPreviewBar: React.FC<BottomPreviewBarProps> = ({ onVipClick }) => {
  // Countdown starting at 09:59 (599 seconds)
  const [secondsLeft, setSecondsLeft] = useState(599);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const isExpired = secondsLeft === 0;
  const isUrgent = secondsLeft < 120 && !isExpired;

  return (
    <div className={`fixed bottom-0 inset-x-0 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-[430px] z-50 p-3 sm:p-4 bg-[#0A0D14]/95 backdrop-blur-xl border-t ${
      isUrgent ? 'border-rose-500/50 shadow-[0_-10px_35px_rgba(244,63,94,0.35)]' : 'border-neutral-800/90 shadow-[0_-10px_35px_rgba(0,0,0,0.9)]'
    } select-none transition-all`}>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
        
        {/* Urgency Line & Context Text */}
        <div className="space-y-1 text-left min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 font-mono-tech font-bold text-xs sm:text-[13px] tracking-wide ${
              isUrgent ? 'text-rose-400' : 'text-[#F59E0B]'
            }`}>
              <Zap className={`w-3.5 h-3.5 ${isUrgent ? 'fill-rose-400 text-rose-400 animate-ping' : 'fill-[#F59E0B] text-[#F59E0B] animate-pulse'}`} />
              <span>⚡ Prévia disponível por {formatTime(secondsLeft)}</span>
            </span>
            {isExpired && (
              <span className="text-[10px] text-[#EF4444] font-bold uppercase bg-red-500/15 px-1.5 py-0.5 rounded border border-red-500/30">
                Expirado
              </span>
            )}
          </div>

          <p className="text-[11px] sm:text-xs text-neutral-300 leading-snug">
            Você ganhou 10 minutos para testar gratuitamente nossa ferramenta, mas para liberar todas as funcionalidades e ter acesso permanente é necessário ser um membro VIP.
          </p>
        </div>

        {/* CTA Button */}
        <div className="shrink-0 pt-1 sm:pt-0">
          <VipCTAButton onClick={onVipClick} isExpired={isExpired} />
        </div>

      </div>
    </div>
  );
};

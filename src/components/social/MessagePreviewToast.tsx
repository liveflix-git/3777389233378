import React, { useState, useEffect } from 'react';

export interface MessagePreviewToastProps {
  appTitle?: string;
  senderName?: string;
  previewText?: string;
  timestampLabel?: string;
  onClose?: () => void;
}

export const MessagePreviewToast: React.FC<MessagePreviewToastProps> = ({
  appTitle = 'Instagram',
  senderName = 'Fer*****',
  previewText = '"teste adivinha o que vc\nesqueceu aqui? kkkkk"',
  timestampLabel = 'Agora',
  onClose,
}) => {
  // 'entering' | 'visible' | 'leaving' | 'hidden'
  const [animState, setAnimState] = useState<'entering' | 'visible' | 'leaving' | 'hidden'>('entering');

  useEffect(() => {
    // 1. Enter animation finishes at 350ms
    const timerEnter = setTimeout(() => {
      setAnimState('visible');
    }, 350);

    // 2. Start exit animation after 3200ms visible time
    const timerExitStart = setTimeout(() => {
      setAnimState('leaving');
    }, 3500);

    // 3. Fully hide and trigger callback
    const timerExitEnd = setTimeout(() => {
      setAnimState('hidden');
      onClose?.();
    }, 3850);

    return () => {
      clearTimeout(timerEnter);
      clearTimeout(timerExitStart);
      clearTimeout(timerExitEnd);
    };
  }, [onClose]);

  if (animState === 'hidden') return null;

  const animationClass =
    animState === 'leaving' ? 'animate-toast-slide-up' : 'animate-toast-slide-down';

  return (
    <div
      style={{
        backgroundColor: 'rgba(34, 37, 45, 0.96)',
        borderColor: 'rgba(255, 255, 255, 0.11)',
      }}
      className={`fixed top-[12px] left-[12px] right-[12px] z-50 max-w-[420px] mx-auto border rounded-[20px] p-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.85)] backdrop-blur-xl select-none transition-all ${animationClass}`}
    >
      <div className="flex items-center gap-3">
        {/* Left Circular Blurred Avatar */}
        <div className="relative w-[44px] h-[44px] rounded-full overflow-hidden shrink-0 border border-white/10 bg-gradient-to-tr from-[#D9A197] via-[#B87C8F] to-[#5C456C] flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="Avatar prévia"
            className="w-full h-full object-cover filter blur-[9px] scale-125 opacity-85"
          />
        </div>

        {/* Content Block Right of Avatar */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          {/* Top Line: Title & Timestamp */}
          <div className="flex items-center justify-between gap-2 leading-tight">
            <span className="text-[13.5px] font-bold text-white tracking-tight">
              {appTitle}
            </span>
            <span className="text-[12px] font-normal text-[#9CA3AF] shrink-0">
              {timestampLabel}
            </span>
          </div>

          {/* Line 2: Sender notification text with colon */}
          <p className="text-[13.5px] font-medium text-white/95 leading-tight mt-0.5 truncate">
            {senderName} enviou uma mensagem:
          </p>

          {/* Line 3 & 4: Quoted message text */}
          <p className="text-[13px] font-normal text-[#D1D5DB] leading-snug mt-0.5 whitespace-pre-line line-clamp-2">
            {previewText}
          </p>
        </div>
      </div>
    </div>
  );
};

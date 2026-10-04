import React from 'react';
import { useNavigate } from 'react-router-dom';

interface MobileTopBarProps {
  onBack?: () => void;
}

// Pixel-perfect Instagram Heart Outline matching print
const InstagramHeartIcon: React.FC<{ className?: string }> = ({ className = 'w-[24px] h-[24px]' }) => (
  <svg
    aria-label="Notificações"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

// Pixel-perfect Instagram Direct Paper Plane Icon matching print
const InstagramDirectIcon: React.FC<{ className?: string }> = ({ className = 'w-[24px] h-[24px]' }) => (
  <svg
    aria-label="Direct"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

export const MobileTopBar: React.FC<MobileTopBarProps> = () => {
  const navigate = useNavigate();

  return (
    <header className="md:hidden sticky top-0 z-30 h-[54px] flex items-center justify-between px-4 bg-[#080B0E] border-b border-[#24282E]/40 text-[#F5F5F5] select-none">
      {/* Left: Instagram Wordmark Script Logo */}
      <div className="flex items-center">
        <span 
          style={{ fontFamily: "'Grand Hotel', cursive, sans-serif" }}
          className="text-[28px] text-white tracking-wide leading-none pt-0.5 select-none font-normal"
        >
          Instagram
        </span>
      </div>

      {/* Right Social Actions: Heart with Dot + Direct Paper Plane with Badge "3" */}
      <div className="flex items-center gap-[16px]">
        {/* Heart Icon Button with red notification dot matching print */}
        <button
          type="button"
          onClick={() => navigate('/notifications')}
          className="relative flex items-center justify-center p-1 text-white hover:text-[#EC4899] transition-colors cursor-pointer active:scale-95"
          aria-label="Notificações"
        >
          <InstagramHeartIcon className="w-[24px] h-[24px] text-white" />
          <span className="absolute top-[2px] right-[2px] w-[9px] h-[9px] rounded-full bg-[#FF2B42] pointer-events-none" />
        </button>
        
        {/* DM Direct Button with badge "3" matching print */}
        <button
          type="button"
          onClick={() => navigate('/direct')}
          className="relative flex items-center justify-center p-1 text-white hover:text-[#3B82F6] transition-colors cursor-pointer active:scale-95"
          aria-label="Mensagens diretas"
        >
          <InstagramDirectIcon className="w-[24px] h-[24px] text-white" />
          {/* Badge: Red circle with white bold number "3" matching print */}
          <span className="absolute -top-[5px] -right-[6px] w-[18px] h-[18px] rounded-full bg-[#FF2B42] text-white text-[11px] font-bold leading-none flex items-center justify-center pointer-events-none select-none">
            3
          </span>
        </button>
      </div>
    </header>
  );
};

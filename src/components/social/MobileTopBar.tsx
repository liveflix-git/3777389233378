import React from 'react';
import { useNavigate } from 'react-router-dom';

interface MobileTopBarProps {
  onBack?: () => void;
}

// Pixel-perfect Instagram Heart Outline
const InstagramHeartIcon: React.FC<{ className?: string }> = ({ className = 'w-[24px] h-[24px]' }) => (
  <svg
    aria-label="Notificações"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.071 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z" />
  </svg>
);

// Pixel-perfect Instagram Direct Paper Plane Icon
const InstagramDirectIcon: React.FC<{ className?: string }> = ({ className = 'w-[24px] h-[24px]' }) => (
  <svg
    aria-label="Direct"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
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

      {/* Right Social Actions: Heart with Dot + Direct Paper Plane with Badge "6" */}
      <div className="flex items-center gap-[18px]">
        {/* Heart Icon Button with small red notification dot */}
        <button
          type="button"
          onClick={() => navigate('/notifications')}
          className="relative flex items-center justify-center p-1 text-white hover:text-[#EC4899] transition-colors cursor-pointer active:scale-95"
          aria-label="Notificações"
        >
          <InstagramHeartIcon className="w-[24px] h-[24px] text-white" />
          <span className="absolute top-[3px] right-[3px] w-[6.5px] h-[6.5px] rounded-full bg-[#FF3040] border-[1px] border-[#080B0E] pointer-events-none" />
        </button>
        
        {/* DM Direct Paper Plane Button with badge "6" */}
        <button
          type="button"
          onClick={() => navigate('/direct')}
          className="relative flex items-center justify-center p-1 text-white hover:text-[#3B82F6] transition-colors cursor-pointer active:scale-95"
          aria-label="Mensagens diretas"
        >
          <InstagramDirectIcon className="w-[24px] h-[24px] text-white" />
          {/* Badge: Small red circle, white number, right at the top-right corner of the direct icon */}
          <span className="absolute -top-[3px] -right-[5px] min-w-[17px] h-[17px] px-[3.5px] rounded-full bg-[#FF3040] text-white text-[10px] font-bold leading-none flex items-center justify-center border-[2px] border-[#080B0E] pointer-events-none select-none">
            6
          </span>
        </button>
      </div>
    </header>
  );
};

import React from 'react';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NotificationBadge } from './NotificationBadge';

interface MobileTopBarProps {
  onBack?: () => void;
}

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
    <line x1="22" y1="3" x2="9.218" y2="10.083" />
    <polygon points="11.698 20.334 22 3.001 2 3.001 9.218 10.083 11.698 20.334" />
  </svg>
);

export const MobileTopBar: React.FC<MobileTopBarProps> = () => {
  const navigate = useNavigate();

  return (
    <header className="md:hidden sticky top-0 z-30 h-[54px] flex items-center justify-between px-[16px] bg-[#080B0E] border-b border-[#24282E]/40 text-[#F5F5F5] select-none">
      {/* Left: Instagram Wordmark */}
      <div className="flex items-center">
        <span 
          style={{ fontFamily: "'Grand Hotel', cursive, sans-serif" }}
          className="text-[25px] text-white tracking-wide leading-none pt-0.5 select-none font-normal"
        >
          Instagram
        </span>
      </div>

      {/* Right Social Actions: Heart with Dot + Paper Plane with Badge "2" */}
      <div className="flex items-center gap-[15px]">
        {/* Heart Icon button with small red dot */}
        <button
          type="button"
          onClick={() => navigate('/notifications')}
          className="relative flex items-center justify-center p-0.5 text-white hover:text-[#EC4899] transition-colors cursor-pointer active:scale-90"
          aria-label="Notificações"
        >
          <Heart className="w-[24px] h-[24px] text-white stroke-[2]" />
          <span className="absolute -top-[1px] -right-[1px] w-[8px] h-[8px] rounded-full bg-[#FF3040] border-[2px] border-[#080B0E] pointer-events-none" />
        </button>
        
        {/* DM Paper Plane button with badge "2" */}
        <button
          type="button"
          onClick={() => navigate('/direct')}
          className="relative flex items-center justify-center p-0.5 text-white hover:text-[#3B82F6] transition-colors cursor-pointer active:scale-90"
          aria-label="Mensagens diretas"
        >
          <InstagramDirectIcon className="w-[24px] h-[24px] text-white" />
          <NotificationBadge count={6} />
        </button>
      </div>
    </header>
  );
};

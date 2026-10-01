import React from 'react';
import { 
  Home, 
  Film, 
  MessageCircle, 
  Heart, 
  Search, 
  Compass, 
  PlusSquare, 
  LayoutDashboard, 
  User, 
  Menu 
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { InstagramProfileData } from '../../services/instagramProfile';

interface DesktopSidebarProps {
  profile?: InstagramProfileData | null;
  onOpenSearch?: () => void;
  onBlockedClick?: () => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  profile,
  onOpenSearch,
  onBlockedClick,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Página inicial', path: '/feed', icon: Home },
    { label: 'Reels', action: onBlockedClick, icon: Film },
    { label: 'Mensagens', path: '/direct', icon: MessageCircle, badge: '2' },
    { label: 'Pesquisa', action: onOpenSearch, icon: Search },
    { label: 'Explorar', action: onBlockedClick, icon: Compass },
    { label: 'Notificações', path: '/notifications', icon: Heart, dot: true },
    { label: 'Criar', action: onBlockedClick, icon: PlusSquare },
    { label: 'Painel', action: onBlockedClick, icon: LayoutDashboard },
    { label: 'Perfil', path: '/profile', icon: User },
  ];

  return (
    <aside className="hidden md:flex flex-col justify-between w-[245px] min-h-screen sticky top-0 bg-[#080B0E] border-r border-[#24282E]/40 p-4 select-none z-20 shrink-0">
      
      {/* Brand & Nav */}
      <div className="space-y-6 pt-2">
        {/* Instagram Script Wordmark */}
        <div 
          onClick={() => navigate('/feed')} 
          className="px-3 py-1 cursor-pointer select-none"
        >
          <span 
            style={{ fontFamily: "'Grand Hotel', cursive, sans-serif" }}
            className="text-[28px] text-white tracking-wide leading-none select-none block"
          >
            Instagram
          </span>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = item.path ? location.pathname === item.path : false;

            const handleClick = () => {
              if (item.action) {
                item.action();
              } else if (item.path) {
                navigate(item.path);
              }
            };

            return (
              <button
                key={idx}
                type="button"
                onClick={handleClick}
                className={`w-full h-[50px] flex items-center justify-between px-3.5 rounded-xl text-[15px] font-medium transition-colors cursor-pointer group ${
                  isActive
                    ? 'bg-[#101318] text-white font-semibold'
                    : 'text-[#A8A8A8] hover:bg-[#101318]/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-4">
                  <Icon className={`w-[22px] h-[22px] stroke-[1.9] transition-transform group-hover:scale-105 ${isActive ? 'text-white' : 'text-[#A8A8A8] group-hover:text-white'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="min-w-[17px] h-[17px] px-1 rounded-full bg-[#FF3040] text-white text-[10px] font-bold flex items-center justify-center leading-none shadow-[0_2px_6px_rgba(255,48,64,0.4)]">
                    {item.badge}
                  </span>
                )}

                {item.dot && (
                  <span className="w-2 h-2 rounded-full bg-[#FF3040] shadow-[0_0_6px_rgba(255,48,64,0.6)]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Menu Item */}
      <div className="pt-4 border-t border-[#24282E]/40">
        <button
          type="button"
          onClick={onBlockedClick}
          className="w-full h-[48px] flex items-center gap-4 px-3.5 rounded-xl text-[15px] text-[#A8A8A8] hover:bg-[#101318] hover:text-white transition-colors cursor-pointer"
        >
          <Menu className="w-[22px] h-[22px]" />
          <span>Mais</span>
        </button>
      </div>

    </aside>
  );
};

import React, { useState } from 'react';
import { Eye, Menu, X, LayoutDashboard, User, History, Zap, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardHeaderProps {
  onOpenCreditsModal: () => void;
  onOpenInfoModal: (title: string, message: string) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onOpenCreditsModal,
  onOpenInfoModal,
}) => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-50 h-[70px] bg-gradient-to-r from-[#0C0E16] to-[#111020] border-b border-white/5 px-4 sm:px-6 lg:px-8 flex items-center justify-between select-none shadow-md">
        <div className="max-w-[1280px] w-full mx-auto flex items-center justify-between">
          {/* Logo ESPIA AÍ APP */}
          <div
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-[#0B0B10] border border-[#8B5CF6]/40 shadow-[0_0_12px_rgba(139,92,246,0.3)] group-hover:border-[#8B5CF6] transition-colors">
              <Eye className="w-4 h-4 text-[#A855F7] group-hover:text-white transition-colors" />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#8B5CF6]/20 to-transparent pointer-events-none" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                ESPIA AÍ <span className="text-[#8B5CF6]">APP</span>
              </span>
            </div>
          </div>

          {/* Right Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Abrir Menu"
          >
            <Menu className="w-[26px] h-[26px]" />
          </button>
        </div>
      </header>

      {/* Slide-over Mobile/Desktop Sidebar Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Menu Panel */}
          <div className="relative z-10 w-full max-w-xs bg-[#0C0E16] border-l border-white/10 h-full p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 flex items-center justify-center">
                    <Eye className="w-4 h-4 text-[#C084FC]" />
                  </div>
                  <span className="font-bold text-white text-base">
                    ESPIA AÍ <span className="text-[#8B5CF6]">APP</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Menu Navigation Items */}
              <nav className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/dashboard');
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-white font-semibold text-sm transition-all"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#C084FC]" />
                  <span>Dashboard</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenInfoModal('Minha Conta', 'Sua conta está ativa e verificada no nível VIP 1.');
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/5 font-medium text-sm transition-all"
                >
                  <User className="w-4 h-4 text-purple-400" />
                  <span>Minha conta</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenInfoModal('Histórico', 'Seu histórico de pesquisas recentes está arquivado com sigilo.');
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/5 font-medium text-sm transition-all"
                >
                  <History className="w-4 h-4 text-purple-400" />
                  <span>Histórico</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenCreditsModal();
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/5 font-medium text-sm transition-all"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Comprar créditos</span>
                </button>
              </nav>
            </div>

            {/* Logout Button at bottom */}
            <div className="pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-300 hover:bg-rose-900/50 hover:text-white font-bold text-sm transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

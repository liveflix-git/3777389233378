import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Lock, ChevronRight } from 'lucide-react';
import { getEspiaProfile } from '../services/espiaSession';
import { ActivitySection } from '../components/activity/ActivitySection';
import { VipGateModal } from '../components/activity/VipGateModal';
import type { ActivityItemData } from '../components/activity/ActivityItem';

export const ActivityPage: React.FC = () => {
  const navigate = useNavigate();
  const profile = getEspiaProfile();
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);

  const username = profile?.username || 'perfil.selecionado';

  // Section 1: Hoje
  const itemsHoje: ActivityItemData[] = [
    {
      id: 'hoje-1',
      avatarSrc: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      hasLockOverlay: true,
      usernamePrefix: 'Kau******',
      actionText: 'curtiu seu comentário: Delíciaaaa 😍😍',
      timestamp: '48 min',
      rightThumbnail: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    },
  ];

  // Section 2: Ontem
  const itemsOntem: ActivityItemData[] = [
    {
      id: 'ontem-1',
      avatarSrc: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      usernamePrefix: '_pe*****',
      actionText: 'começou a seguir você.',
      timestamp: '9 h',
      buttonLabel: 'Seguindo',
      buttonVariant: 'gray',
    },
    {
      id: 'ontem-2',
      avatarSrc: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
      usernamePrefix: 'fil*****',
      actionText: 'começou a seguir você.',
      timestamp: '12 h',
      buttonLabel: 'Seguindo',
      buttonVariant: 'gray',
    },
    {
      id: 'ontem-3',
      stackedAvatars: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      ],
      usernamePrefix: 'kai******, _ju******',
      actionText: 'e outras 1 pessoas estão no app. Junte-se a elas agora.',
      timestamp: '16 h',
      buttonLabel: 'Testar',
      buttonVariant: 'blue',
    },
  ];

  // Section 3: Últimos 7 dias
  const itemsUltimos7Dias: ActivityItemData[] = [
    {
      id: '7d-1',
      avatarSrc: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
      hasLockOverlay: true,
      usernamePrefix: 'Nova sugestão',
      actionText: 'para seguir.',
      timestamp: '1 d',
      buttonLabel: 'Seguir',
      buttonVariant: 'blue',
    },
    {
      id: '7d-2',
      avatarSrc: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
      usernamePrefix: 'mar*****',
      actionText: 'curtiu seu story.',
      timestamp: '3 d',
      rightThumbnail: 'https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: '7d-3',
      avatarSrc: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
      usernamePrefix: 'an*****',
      actionText: 'enviou uma solicitação para seguir você.',
      timestamp: '5 d',
      buttonLabel: 'Confirmar',
      buttonVariant: 'blue',
    },
  ];

  const handleItemClick = () => {
    setIsVipModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#F5F5F7] select-none pb-24">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-[#000000]/95 backdrop-blur-md px-4 py-3.5 flex items-center justify-between border-b border-white/10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white hover:text-[#9CA3AF] transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          <span className="text-base sm:text-lg font-bold tracking-tight text-white font-display">
            {username}
          </span>
        </button>
        <div className="w-6" /> {/* spacer */}
      </header>

      {/* Main Content Container */}
      <main className="w-full max-w-[500px] mx-auto px-4 pt-4 pb-12">
        {/* Section 1: Hoje */}
        <ActivitySection
          title="Hoje"
          items={itemsHoje}
          onItemClick={handleItemClick}
        />

        {/* Section 2: Ontem */}
        <ActivitySection
          title="Ontem"
          items={itemsOntem}
          onItemClick={handleItemClick}
        />

        {/* Section 3: Últimos 7 dias */}
        <ActivitySection
          title="Últimos 7 dias"
          items={itemsUltimos7Dias}
          onItemClick={handleItemClick}
        />

        {/* Red VIP Unlock Prompt below last notification */}
        <div
          onClick={handleItemClick}
          className="mt-6 p-3.5 rounded-2xl bg-gradient-to-r from-[#310A0A] via-[#240808] to-[#310A0A] border border-red-500/50 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.2)] flex items-center justify-between gap-3 cursor-pointer hover:border-red-400 active:scale-[0.99] transition-all"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center shrink-0 text-red-400">
              <Lock className="w-4 h-4" />
            </div>
            <div className="text-left min-w-0">
              <p className="text-[13px] font-bold text-red-100 leading-tight">
                Notificações Ocultas
              </p>
              <p className="text-[12px] font-medium text-red-200/90 leading-tight mt-0.5">
                Para ver todo o histórico de interações e detalhes completos, desbloqueie o acesso VIP.
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-red-400 shrink-0" />
        </div>
      </main>

      {/* VIP Gate Modal */}
      <VipGateModal
        isOpen={isVipModalOpen}
        onClose={() => setIsVipModalOpen(false)}
      />
    </div>
  );
};

// Export aliases for route compatibility
export const NotificationsPage = ActivityPage;

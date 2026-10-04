import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Sparkles, SquarePen, Lock, ChevronRight } from 'lucide-react';
import { getEspiaProfile } from '../services/espiaSession';
import { StoryNotesRow } from '../components/inbox/StoryNotesRow';
import { ConversationList } from '../components/inbox/ConversationList';
import { VipGateModal } from '../components/activity/VipGateModal';
import { PreviewBanner } from '../components/social/PreviewBanner';
import { maskUsername } from '../components/social/SocialStoriesRow';
import type { ConversationData } from '../components/inbox/ConversationItem';

export const InboxPreviewPage: React.FC = () => {
  const navigate = useNavigate();
  const profile = getEspiaProfile();
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);

  const username = profile?.username || 'perfil.selecionado';
  const targetFirstName = profile?.fullName ? profile.fullName.split(' ')[0] : '';
  const firstMsgText = targetFirstName ? `${targetFirstName} adivinha o que vc esq...` : 'Adivinha o que vc esq...';

  const related = (profile?.relatedProfiles || []).filter(p => p && p.username);

  const defaultMessages = [
    { msg: firstMsgText, time: 'Agora' },
    { msg: 'Encaminhou um reel de jonas....', time: '2 d' },
    { msg: 'Blz depois a gente se fala', time: '2 d' },
    { msg: 'Vídeo enviado', time: '3 d' },
    { msg: 'Mandou um áudio', time: '4 d' },
    { msg: 'Curtiu sua mensagem', time: '5 d' },
  ];

  const conversations: ConversationData[] = defaultMessages.map((item, idx) => {
    const relUser = related[idx];
    const handle = relUser?.username ? maskUsername(relUser.username) : `usr_${idx + 1}*****`;
    const avatar = relUser?.profilePicture || '';

    return {
      id: `conv-${idx + 1}`,
      avatarSrc: avatar,
      handle,
      previewMessage: item.msg,
      timestamp: item.time,
    };
  });

  const handleOpenVip = () => {
    setIsVipModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#F5F5F7] select-none flex flex-col justify-between">
      <div className="w-full max-w-[500px] mx-auto pb-32">
        {/* Header Bar */}
        <header className="sticky top-0 z-40 bg-[#000000] px-4 py-3.5 flex items-center justify-between">
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

          {/* Generic Header Icons */}
          <div className="flex items-center gap-3 text-white">
            <button
              type="button"
              onClick={handleOpenVip}
              className="p-1 hover:text-[#3B82F6] transition-colors cursor-pointer"
            >
              <Sparkles className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleOpenVip}
              className="p-1 hover:text-[#3B82F6] transition-colors cursor-pointer"
            >
              <SquarePen className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Top Story / Notes Row */}
        <StoryNotesRow
          selfAvatar={profile?.profilePicture || undefined}
          relatedProfiles={profile?.relatedProfiles}
          onNoteClick={handleOpenVip}
        />

        {/* Messages Section Header */}
        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Mensagens
          </h3>
          <button
            type="button"
            onClick={handleOpenVip}
            className="text-[13.5px] font-semibold text-[#3B82F6] hover:underline cursor-pointer"
          >
            Pedidos (4)
          </button>
        </div>

        {/* Conversation List */}
        <ConversationList
          conversations={conversations}
          onConversationClick={handleOpenVip}
        />

        {/* Red VIP Unlock Prompt below last conversation */}
        <div
          onClick={handleOpenVip}
          className="mt-6 mx-4 p-3.5 rounded-2xl bg-gradient-to-r from-[#310A0A] via-[#240808] to-[#310A0A] border border-red-500/50 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.2)] flex items-center justify-between gap-3 cursor-pointer hover:border-red-400 active:scale-[0.99] transition-all"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center shrink-0 text-red-400">
              <Lock className="w-4 h-4" />
            </div>
            <div className="text-left min-w-0">
              <p className="text-[13px] font-bold text-red-100 leading-tight">
                Conteúdo Restrito
              </p>
              <p className="text-[12px] font-medium text-red-200/90 leading-tight mt-0.5">
                Para ver todas as mensagens e conversas ocultas, você precisa desbloquear o acesso VIP.
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-red-400 shrink-0" />
        </div>
      </div>

      {/* Sticky Bottom Preview Banner */}
      <PreviewBanner onVirarVip={() => navigate('/unlock')} />

      {/* VIP Gate Modal */}
      <VipGateModal
        isOpen={isVipModalOpen}
        onClose={() => setIsVipModalOpen(false)}
        title="Conteúdo disponível no VIP"
        description="Para abrir esta conversa e ver as mensagens completas, desbloqueie o acesso VIP."
        closeLabel="Fechar"
      />
    </div>
  );
};

// Export as DirectPage for routes
export const DirectPage = InboxPreviewPage;

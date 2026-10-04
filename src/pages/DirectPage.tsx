import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Sparkles, SquarePen, Lock, ChevronRight } from 'lucide-react';
import { getEspiaProfile } from '../services/espiaSession';
import { StoryNotesRow } from '../components/inbox/StoryNotesRow';
import { ConversationList } from '../components/inbox/ConversationList';
import { ConversationData } from '../components/inbox/ConversationItem';
import { VipGateModalDM } from '../components/inbox/VipGateModalDM';
import { PreviewBanner } from '../components/social/PreviewBanner';
import { maskUsername } from '../components/social/SocialStoriesRow';
import { getSearchedProfileDisplayName } from '../utils/profileName';

export const DirectPage: React.FC = () => {
  const navigate = useNavigate();
  const profile = getEspiaProfile();
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);

  const username = profile?.username || 'perfil.selecionado';
  const targetFirstName = getSearchedProfileDisplayName(profile);
  const related = (profile?.relatedProfiles || []).filter((p) => p && p.username);

  // Helper to map DM slot index to a shifted profile index so Notes (0..2) and DMs do not repeat in the same order
  const getDmProfileIndex = (dmSlot: number) => {
    if (related.length === 0) return dmSlot;
    // Shift offset by 3 so Notes take items 0..2 and DMs start from item 3 onwards
    return (dmSlot + 3) % related.length;
  };

  // Helper to resolve handle from related profiles or generate clean fallback
  const getHandle = (dmSlot: number, fallback: string) => {
    const idx = getDmProfileIndex(dmSlot);
    const rel = related[idx];
    if (rel && rel.username) {
      return maskUsername(rel.username);
    }
    return fallback;
  };

  // Helper to resolve avatar from related profiles
  const getAvatar = (dmSlot: number) => {
    const idx = getDmProfileIndex(dmSlot);
    return related[idx]?.profilePicture || '';
  };

  // 3 Unlocked conversations + 5 Additional Locked-by-click conversations (Total 8)
  const conversations: ConversationData[] = [
    {
      id: 'chat_1',
      avatarSrc: getAvatar(0),
      handle: getHandle(0, 'Fer*****'),
      previewMessage: `${targetFirstName}, adivinha o que vc esqueceu aq...`,
      timestamp: 'Agora',
      hasUnread: true,
      isLocked: false,
    },
    {
      id: 'chat_2',
      avatarSrc: getAvatar(1),
      handle: getHandle(1, 'Bia*****'),
      previewMessage: 'Já cheguei, só pra te avisar...',
      timestamp: '2 h',
      hasUnread: false,
      isLocked: false,
    },
    {
      id: 'chat_3',
      avatarSrc: getAvatar(2),
      handle: getHandle(2, 'Giu*****'),
      previewMessage: 'Enviou uma foto',
      timestamp: '5 h',
      hasUnread: false,
      isLocked: false,
    },
    {
      id: 'chat_4',
      avatarSrc: getAvatar(3),
      handle: getHandle(3, 'Luc*****'),
      previewMessage: 'Te mandei lá kkk',
      timestamp: '1 d',
      isLocked: true,
    },
    {
      id: 'chat_5',
      avatarSrc: getAvatar(4),
      handle: getHandle(4, 'Mar*****'),
      previewMessage: 'Visualizado',
      timestamp: '1 d',
      isLocked: true,
    },
    {
      id: 'chat_6',
      avatarSrc: getAvatar(5),
      handle: getHandle(5, 'Gab*****'),
      previewMessage: 'Enviou um reel',
      timestamp: '2 d',
      isLocked: true,
    },
    {
      id: 'chat_7',
      avatarSrc: getAvatar(6),
      handle: getHandle(6, 'Jua*****'),
      previewMessage: 'Curtiu uma mensagem',
      timestamp: '2 d',
      isLocked: true,
    },
    {
      id: 'chat_8',
      avatarSrc: getAvatar(7),
      handle: getHandle(7, 'Ped*****'),
      previewMessage: 'Pode deixar',
      timestamp: '3 d',
      isLocked: true,
    },
  ];

  const handleConversationClick = (conv: ConversationData) => {
    if (conv.isLocked) {
      setIsVipModalOpen(true);
    } else {
      navigate(`/chat/${conv.id}`);
    }
  };

  const handleOpenVip = () => {
    setIsVipModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#F5F5F7] select-none flex flex-col justify-between font-sans">
      <div className="w-full max-w-[500px] mx-auto pb-32">
        
        {/* Header Bar */}
        <header className="sticky top-0 z-40 bg-[#000000]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-white/[0.04]">
          <button
            type="button"
            onClick={() => navigate('/feed')}
            className="flex items-center gap-2 text-white hover:text-neutral-300 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            <span className="text-[18px] font-bold tracking-tight text-white font-sans">
              {username}
            </span>
          </button>

          <div className="flex items-center gap-3.5 text-white">
            <button
              type="button"
              onClick={handleOpenVip}
              className="p-1 hover:text-[#3797F0] transition-colors cursor-pointer"
              aria-label="Acesso VIP"
            >
              <Sparkles className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleOpenVip}
              className="p-1 hover:text-[#3797F0] transition-colors cursor-pointer"
              aria-label="Nova mensagem"
            >
              <SquarePen className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Stories / Notes Row */}
        <StoryNotesRow
          selfAvatar={profile?.profilePicture || undefined}
          relatedProfiles={profile?.relatedProfiles}
          onNoteClick={handleOpenVip}
        />

        {/* Messages Section Header */}
        <div className="px-4 mt-5 mb-2.5 flex items-center justify-between">
          <h3 className="text-[17px] font-bold text-white tracking-tight">
            Mensagens
          </h3>
          <button
            type="button"
            onClick={handleOpenVip}
            className="text-[15px] font-medium text-[#3797F0] hover:underline cursor-pointer"
          >
            Pedidos (4)
          </button>
        </div>

        {/* Conversation List */}
        <ConversationList
          conversations={conversations}
          onConversationClick={handleConversationClick}
        />

        {/* End of Preview VIP CTA */}
        <div
          onClick={handleOpenVip}
          className="mt-6 mx-4 p-4 rounded-2xl bg-gradient-to-r from-[#180A0A] via-[#120505] to-[#180A0A] border border-red-500/30 text-red-200 shadow-lg flex items-center justify-between gap-3 cursor-pointer hover:border-red-400 active:scale-[0.99] transition-all"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center shrink-0 text-red-400">
              <Lock className="w-4 h-4" />
            </div>
            <div className="text-left min-w-0">
              <p className="text-[13.5px] font-bold text-red-100 leading-tight">
                Veja todas as conversas sem censura
              </p>
              <p className="text-[12px] font-medium text-red-300/80 leading-tight mt-0.5">
                Desbloqueie o acesso VIP para visualizar o histórico e mídias completas.
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-red-400 shrink-0" />
        </div>
      </div>

      {/* Sticky Bottom Preview Banner */}
      <PreviewBanner onVirarVip={() => navigate('/unlock')} />

      {/* VIP Gate Modal */}
      <VipGateModalDM
        isOpen={isVipModalOpen}
        onClose={() => setIsVipModalOpen(false)}
        title="Acesso VIP Requerido"
        description="Desbloqueie o acesso VIP para visualizar esta conversa completa."
      />
    </div>
  );
};

export default DirectPage;

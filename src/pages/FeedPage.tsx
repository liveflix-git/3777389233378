import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { getEspiaProfile } from '../services/espiaSession';
import { SocialAppShell } from '../components/social/SocialAppShell';
import { SocialStoriesRow } from '../components/social/SocialStoriesRow';
import { SocialFeedArea } from '../components/social/SocialFeedArea';
import { BlockedPopup } from '../components/social/BlockedPopup';
import { MessagePreviewToast } from '../components/social/MessagePreviewToast';

export const FeedPage: React.FC = () => {
  const navigate = useNavigate();
  const profile = getEspiaProfile();

  const [isBlockedPopupOpen, setIsBlockedPopupOpen] = useState(false);
  const [blockedTitle, setBlockedTitle] = useState('Recurso disponível no acesso VIP');
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  useEffect(() => {
    // Show notification toast once per preview session after ~1600ms delay
    const toastShown = sessionStorage.getItem('espia_toast_shown');
    if (!toastShown) {
      const timer = setTimeout(() => {
        setShowNotificationToast(true);
        sessionStorage.setItem('espia_toast_shown', 'true');
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, []);

  // If no profile was looked up, redirect to unlock
  if (!profile) {
    navigate('/unlock', { replace: true });
    return null;
  }

  const handleOpenBlocked = (title?: string) => {
    if (title) setBlockedTitle(title);
    setIsBlockedPopupOpen(true);
  };

  const handleOpenVip = () => {
    setIsBlockedPopupOpen(false);
    navigate('/unlock');
  };

  const targetFirstName = profile.fullName ? profile.fullName.split(' ')[0] : 'teste';

  return (
    <SocialAppShell profile={profile} onBlockedClick={handleOpenBlocked}>
      {/* Temporary Social Notification Toast matching reference */}
      {showNotificationToast && (
        <MessagePreviewToast
          appTitle="Instagram"
          senderName="Fer*****"
          previewText={`"${targetFirstName} adivinha o que vc\nesqueceu aqui? kkkkk"`}
          timestampLabel="Agora"
          onClick={() => handleOpenBlocked('Mensagem direta confidencial')}
          onClose={() => setShowNotificationToast(false)}
        />
      )}

      {/* 1. Horizontal Stories Row at Top of Feed */}
      <SocialStoriesRow
        mainProfilePic={profile.profilePicture}
        mainUsername={profile.username}
        relatedProfiles={profile.relatedProfiles}
        onStoryClick={() => handleOpenBlocked('Visualizador anônimo de stories')}
      />

      {/* Notice between stories and feed */}
      <div className="w-full px-4 py-3 bg-[#0C1016] border-b border-[#24282E]/40 flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#F97316] via-[#EC4899] to-[#9333EA] p-[1.5px] shrink-0 flex items-center justify-center shadow-md">
          <div className="w-full h-full rounded-full bg-[#080B0E] flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
          </div>
        </div>
        <p className="text-[12.5px] text-[#C9D1D9] leading-snug flex-1">
          Você viu todas as publicações disponíveis na prévia grátis,{' '}
          <span className="text-[#8B949E]">seja membro VIP para ver todos os posts.</span>{' '}
          <button
            type="button"
            onClick={() => navigate('/unlock')}
            className="text-[#0095F6] hover:text-[#60A5FA] font-bold cursor-pointer underline underline-offset-2 ml-1"
          >
            Virar VIP
          </button>
        </p>
      </div>

      {/* 2. Main Social Feed Post (Header + Large Full-Width Post Media) */}
      <SocialFeedArea
        profile={profile}
        onBlockedClick={() => handleOpenBlocked('Conteúdo restrito no plano gratuito')}
      />

      {/* Blocked feature popup */}
      <BlockedPopup
        isOpen={isBlockedPopupOpen}
        onClose={() => setIsBlockedPopupOpen(false)}
        onVirarVip={handleOpenVip}
        title={blockedTitle}
      />
    </SocialAppShell>
  );
};

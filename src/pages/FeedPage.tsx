import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEspiaProfile } from '../services/espiaSession';
import { SocialAppShell } from '../components/social/SocialAppShell';
import { SocialStoriesRow } from '../components/social/SocialStoriesRow';
import { SocialFeedArea } from '../components/social/SocialFeedArea';
import { BlockedPopup } from '../components/social/BlockedPopup';
import { CheckoutModal } from '../components/CheckoutModal';
import { MessagePreviewToast } from '../components/social/MessagePreviewToast';

export const FeedPage: React.FC = () => {
  const navigate = useNavigate();
  const profile = getEspiaProfile();

  const [isBlockedPopupOpen, setIsBlockedPopupOpen] = useState(false);
  const [blockedTitle, setBlockedTitle] = useState('Recurso disponível no acesso VIP');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
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

  // If no profile was looked up, redirect to search/landing
  if (!profile) {
    navigate('/');
    return null;
  }

  const handleOpenBlocked = (title?: string) => {
    if (title) setBlockedTitle(title);
    setIsBlockedPopupOpen(true);
  };

  const handleOpenVip = () => {
    setIsBlockedPopupOpen(false);
    setIsCheckoutOpen(true);
  };

  const targetFirstName = profile.fullName ? profile.fullName.split(' ')[0] : 'teste';

  return (
    <SocialAppShell profile={profile} onBackToSearch={() => navigate('/')}>
      {/* Temporary Social Notification Toast matching reference */}
      {showNotificationToast && (
        <MessagePreviewToast
          appTitle="Instagram"
          senderName="Fer*****"
          previewText={`"${targetFirstName} adivinha o que vc\nesqueceu aqui? kkkkk"`}
          timestampLabel="Agora"
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

      {/* Checkout modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        planName={`Acesso VIP · @${profile.username}`}
      />
    </SocialAppShell>
  );
};

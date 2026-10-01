import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEspiaProfile } from '../services/espiaSession';
import { SocialAppShell } from '../components/social/SocialAppShell';
import { SocialProfileHeader } from '../components/social/SocialProfileHeader';
import { SocialProfileGrid } from '../components/social/SocialProfileGrid';
import { BlockedPopup } from '../components/social/BlockedPopup';
import { CheckoutModal } from '../components/CheckoutModal';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const profile = getEspiaProfile();

  const [isBlockedPopupOpen, setIsBlockedPopupOpen] = useState(false);
  const [blockedTitle, setBlockedTitle] = useState('Recurso disponível no acesso VIP');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

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

  return (
    <SocialAppShell profile={profile} onBackToSearch={() => navigate('/')}>
      {/* 1. Real Profile Header with Photo, Stats, Bio & "Editar perfil" */}
      <SocialProfileHeader
        profile={profile}
        onStoryClick={() => handleOpenBlocked('Visualizador anônimo de stories')}
      />

      {/* 2. Real Profile Grid / Tabs */}
      <SocialProfileGrid
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

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { InstagramProfileData } from '../../services/instagramProfile';
import { isEspiaPreviewExpired } from '../../services/espiaSession';
import { MobileTopBar } from './MobileTopBar';
import { DesktopSidebar } from './DesktopSidebar';
import { DesktopRightSuggestions } from './DesktopRightSuggestions';
import { PreviewBanner } from './PreviewBanner';
import { BlockedPopup } from './BlockedPopup';
import { CheckoutModal } from '../CheckoutModal';
import { InteractiveScannerModal } from '../InteractiveScannerModal';

interface SocialAppShellProps {
  profile: InstagramProfileData;
  children: React.ReactNode;
  onBackToSearch?: () => void;
}

export const SocialAppShell: React.FC<SocialAppShellProps> = ({
  profile,
  children,
  onBackToSearch,
}) => {
  const navigate = useNavigate();
  const [isBlockedPopupOpen, setIsBlockedPopupOpen] = useState(false);
  const [blockedPopupTitle, setBlockedPopupTitle] = useState('Recurso disponível no acesso VIP');
  const [blockedPopupDesc, setBlockedPopupDesc] = useState('Para liberar todas as funcionalidades e ter acesso permanente, torne-se um membro VIP.');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    if (isEspiaPreviewExpired()) {
      navigate('/unlock', { replace: true });
    }
  }, [navigate]);

  const handleOpenBlocked = (title?: string, desc?: string) => {
    if (title) setBlockedPopupTitle(title);
    if (desc) setBlockedPopupDesc(desc);
    setIsBlockedPopupOpen(true);
  };

  const handleOpenVip = () => {
    setIsBlockedPopupOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="w-full min-h-screen bg-[#080B0E] text-[#F5F5F5] flex flex-col justify-between selection:bg-[#EC4899]/30">
      
      {/* 3-Column Desktop Social Layout / Full Mobile Viewport */}
      <div className="flex-1 flex justify-center w-full max-w-[1380px] mx-auto">
        
        {/* 1. Left Desktop Sidebar (245px) */}
        <DesktopSidebar
          profile={profile}
          onOpenSearch={() => setIsSearchOpen(true)}
          onBlockedClick={() => handleOpenBlocked()}
        />

        {/* 2. Center Feed Column (Dominant: min 650px, ideal 760px-800px on desktop) */}
        <main className="flex-1 w-full max-w-[780px] min-h-screen border-x border-[#24282E] flex flex-col bg-[#080B0E]">
          {/* Mobile Topbar */}
          <MobileTopBar onBack={onBackToSearch} />

          {/* Feed Content */}
          <div className="flex-1 w-full pb-36">
            {children}
          </div>
        </main>

        {/* 3. Right Desktop Suggestions Sidebar (310px) */}
        <DesktopRightSuggestions
          profile={profile}
          onOpenSearch={() => setIsSearchOpen(true)}
          onBlockedClick={() => handleOpenBlocked('Sugestões avançadas', 'Acesso ao mapeamento de perfis sugeridos disponível no plano VIP.')}
          onSelectSuggestion={() => handleOpenBlocked('Perfil relacionado', 'Acesso ao histórico deste perfil disponível no plano VIP.')}
        />
      </div>

      {/* Sticky Bottom Preview Banner with 5-minute countdown */}
      <PreviewBanner onVirarVip={handleOpenVip} />

      {/* Blocked feature short popup */}
      <BlockedPopup
        isOpen={isBlockedPopupOpen}
        onClose={() => setIsBlockedPopupOpen(false)}
        onVirarVip={handleOpenVip}
        title={blockedPopupTitle}
        description={blockedPopupDesc}
      />

      {/* VIP Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        planName={`Acesso VIP · @${profile.username}`}
      />

      {/* Search Overlay for lookup without losing state */}
      <InteractiveScannerModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

    </div>
  );
};

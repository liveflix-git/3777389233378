import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, AlertTriangle } from 'lucide-react';
import { getEspiaProfile } from '../services/espiaSession';
import { MatrixBackground } from '../components/MatrixBackground';
import { ProfileSummary } from '../components/unlock/ProfileSummary';
import { CompletedAnalysisCard } from '../components/unlock/CompletedAnalysisCard';
import { LockedMediaGrid } from '../components/unlock/LockedMediaGrid';
import { LocationPreview } from '../components/unlock/LocationPreview';
import { LockedStoriesSection } from '../components/unlock/LockedStoriesSection';
import { DirectDemo } from '../components/unlock/DirectDemo';
import { OfferCard } from '../components/unlock/OfferCard';
import { TestimonialDemoCarousel } from '../components/unlock/TestimonialDemoCarousel';
import { FAQAccordion } from '../components/unlock/FAQAccordion';
import { GuaranteeCard } from '../components/unlock/GuaranteeCard';
import { StickyPurchaseBar } from '../components/unlock/StickyPurchaseBar';
import { CheckoutModal } from '../components/CheckoutModal';

export const UnlockPage: React.FC = () => {
  const navigate = useNavigate();
  const profile = getEspiaProfile();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const username = profile?.username || 'usuario';
  const targetFirstName = profile?.fullName
    ? profile.fullName.split(' ')[0]
    : profile?.username || 'o usuário';

  return (
    <div className="relative min-h-screen bg-[#05090A] text-[#F5F5F5] selection:bg-[#8B5CF6]/30 overflow-x-hidden pb-36">
      {/* Subtle Matrix background effect */}
      <MatrixBackground opacity={0.3} speed={0.4} />

      {/* Container Mobile First */}
      <div className="relative z-10 w-full max-w-[480px] mx-auto px-4 py-8 space-y-6">
        
        {/* 1 & 2. Headline & Real Profile Card */}
        {profile ? (
          <ProfileSummary profile={profile} />
        ) : (
          <div className="text-center py-6">
            <h1 className="text-xl font-bold text-white">Espia Aí - Análise Expirada</h1>
            <p className="text-xs text-[#A8AEB5] mt-1">Sua prévia de 5 minutos expirou.</p>
          </div>
        )}

        {/* 3. Completed Analysis Card */}
        <CompletedAnalysisCard username={username} />

        {/* 4. Arrow Down */}
        <div className="flex justify-center my-2 text-[#8B5CF6] animate-bounce">
          <ChevronDown className="w-6 h-6" />
        </div>

        {/* 5. Locked Media Grid */}
        <LockedMediaGrid username={username} />

        {/* 6. Location Preview */}
        {profile && (
          <LocationPreview
            profile={profile}
            onOpenCheckout={() => setIsCheckoutOpen(true)}
          />
        )}

        {/* 7. Stories and Posts */}
        <LockedStoriesSection targetName={targetFirstName} />

        {/* 8. Direct Demo */}
        {profile && <DirectDemo profile={profile} />}

        {/* 9. Arrow Down with Matrix Space */}
        <div className="flex flex-col items-center justify-center my-4 text-[#8B5CF6] space-y-1">
          <span className="text-[10px] font-mono text-[#A8AEB5] uppercase tracking-widest">
            Acesso VIP Disponível
          </span>
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </div>

        {/* 10, 11, 12, 13. Offer Card (STALKEIA APP Offer & Benefits) */}
        <OfferCard
          username={username}
          targetName={targetFirstName}
          onOpenCheckout={() => setIsCheckoutOpen(true)}
        />

        {/* 14. Social Proof / Testimonial Demo Carousel */}
        <TestimonialDemoCarousel />

        {/* 15. Red Sensitive Information Warning Card */}
        <div className="w-full bg-[#2C0D0D] border border-red-800/50 rounded-2xl p-4 flex items-center gap-3 text-left shadow-lg my-4">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-xs sm:text-sm text-red-200/90 font-normal leading-relaxed">
            As informações acessadas são <strong className="font-bold text-red-100">extremamente sensíveis</strong>. Use com responsabilidade.
          </p>
        </div>

        {/* 16. FAQ Accordion */}
        <FAQAccordion />

        {/* 17. Guarantee Card */}
        <GuaranteeCard />

      </div>

      {/* Sticky Bottom Purchase Bar */}
      <StickyPurchaseBar onOpenCheckout={() => setIsCheckoutOpen(true)} />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        planName={`Desbloqueio VIP · @${username}`}
      />
    </div>
  );
};

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Facebook } from 'lucide-react';
import { getEspiaProfile } from '../../services/espiaSession';
import { AnimatedMaskedField } from './AnimatedMaskedField';
import { PreparationStatusCard } from './PreparationStatusCard';
import { SuccessToast } from './SuccessToast';

export const PreparationScreen: React.FC = () => {
  const navigate = useNavigate();
  const savedProfile = getEspiaProfile();
  const username = savedProfile?.username || 'felp_gomes7';

  const [phase, setPhase] = useState<'trying' | 'success'>('trying');
  const [showToast, setShowToast] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const isComplete = phase === 'success';

  // Triggered strictly after the typing state machine reaches minimum 12 seconds
  const handleSimulationComplete = useCallback(() => {
    setShowPasswordError(false);
    setPhase('success');
    setShowToast(true);

    // After success toast display, smooth fade-out and navigation to /feed
    setTimeout(() => {
      setIsFadingOut(true);
    }, 1800);

    setTimeout(() => {
      navigate('/feed');
    }, 2200);
  }, [navigate]);

  const handleEntrarClick = () => {
    if (isComplete) {
      navigate('/feed');
    }
  };

  return (
    <div
      className={`w-full min-h-[100dvh] bg-[#000000] text-[#F5F5F7] flex flex-col justify-between items-center px-4 py-6 select-none relative overflow-hidden transition-opacity duration-300 ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Top Green Success Toast (✓ Conta acessada com sucesso!) */}
      <SuccessToast show={showToast} message="Conta acessada com sucesso!" />

      {/* Main Container - Mobile First Clean Social Login View */}
      <div className="w-full max-w-[350px] mx-auto flex flex-col justify-between min-h-[100dvh] py-2 z-10">
        
        {/* Top Header & Large Script Wordmark */}
        <div className="flex flex-col items-center pt-8 sm:pt-10">
          <span
            style={{ fontFamily: "'Grand Hotel', cursive, sans-serif" }}
            className="text-[52px] sm:text-[56px] text-white tracking-wide leading-none mt-6 mb-8 select-none font-normal"
          >
            Instagram
          </span>
        </div>

        {/* Form Body Area */}
        <div className="w-full flex flex-col space-y-2.5 my-auto py-1">
          
          {/* Field 1: Readonly Username */}
          <div className="flex flex-col">
            <input
              type="text"
              readOnly
              tabIndex={-1}
              value={username}
              className="w-full h-[48px] bg-[#0F141A] border border-[#232C36] rounded-[4px] px-3 text-[14px] text-white font-medium focus:outline-none cursor-not-allowed select-none pointer-events-none"
            />
          </div>

          {/* Field 2: Character-by-character Animated Masked Password Field */}
          <div className="flex flex-col">
            <AnimatedMaskedField
              isComplete={isComplete}
              onSimulationComplete={handleSimulationComplete}
              onErrorStateChange={setShowPasswordError}
            />
          </div>

          {/* Red Error Message Below Inputs during validation of each attempt */}
          <div className="min-h-[22px] flex items-center justify-center pt-0.5 pb-1">
            {showPasswordError && !isComplete ? (
              <span className="text-[#ED4956] text-[12.5px] font-normal text-center leading-tight block">
                A senha que você inseriu está incorreta.
              </span>
            ) : null}
          </div>

          {/* Status Card (Spinner roxo / Check roxo) */}
          <PreparationStatusCard isComplete={isComplete} />

          {/* Action Button "Entrar" */}
          <button
            type="button"
            disabled={!isComplete}
            onClick={handleEntrarClick}
            className={`w-full h-[44px] rounded-[6px] font-semibold text-[14px] text-white flex items-center justify-center transition-all duration-200 select-none mt-1.5 ${
              isComplete
                ? 'bg-[#0095F6] hover:bg-[#1877F2] active:scale-[0.98] cursor-pointer shadow-md'
                : 'bg-[#0095F6]/40 text-white/50 cursor-not-allowed'
            }`}
          >
            Entrar
          </button>

          {/* Visual Non-functional Links */}
          <div className="w-full text-center space-y-3 mt-4 text-[12px] select-none">
            <div className="text-[#3897F0] hover:underline cursor-pointer transition-colors font-medium">
              Esqueceu a senha?
            </div>

            <div className="flex items-center gap-3 my-2 px-1">
              <div className="h-[1px] bg-[#232C36] flex-1" />
              <span className="text-[10px] font-semibold text-[#70798B] tracking-wider">OU</span>
              <div className="h-[1px] bg-[#232C36] flex-1" />
            </div>

            <div className="flex items-center justify-center gap-2 text-[#3897F0] font-semibold cursor-pointer hover:underline pt-0.5">
              <Facebook className="w-4 h-4 fill-current shrink-0" />
              <span>Entrar com o Facebook</span>
            </div>
          </div>
        </div>

        {/* Footer Area */}
        <div className="w-full text-center py-4 text-[11px] text-[#6B7280] font-medium select-none">
          Instagram da Meta © 2026
        </div>
      </div>
    </div>
  );
};

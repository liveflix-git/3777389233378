import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Facebook } from 'lucide-react';
import { getEspiaProfile } from '../../services/espiaSession';
import { AnimatedMaskedField } from './AnimatedMaskedField';
import { PreparationStatusCard } from './PreparationStatusCard';
import { SuccessToast } from './SuccessToast';

const STATUS_MESSAGES = [
  'Sincronização pendente.',
  'Validando sessão...',
  'Processando visualização...',
  'Quebrando criptografia...',
  'Preparando ambiente...',
  'Revalidando informações...',
  'Finalizando análise...',
];

export const PreparationScreen: React.FC = () => {
  const navigate = useNavigate();
  const savedProfile = getEspiaProfile();
  const username = savedProfile?.username || 'usuario.instagram';

  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // 0.4s -> 8%
    const t0 = setTimeout(() => {
      setProgress(8);
      setMessageIndex(0);
    }, 400);

    // 1.2s -> 17%
    const t1 = setTimeout(() => {
      setProgress(17);
      setMessageIndex(1);
    }, 1200);

    // 2.2s -> 26%, Stage 0
    const t2 = setTimeout(() => {
      setProgress(26);
      setStageIndex(0);
      setMessageIndex(2);
    }, 2200);

    // 3.4s -> 34%, Stage 1
    const t3 = setTimeout(() => {
      setProgress(34);
      setStageIndex(1);
      setMessageIndex(3);
    }, 3400);

    // 4.6s -> 47%
    const t4 = setTimeout(() => {
      setProgress(47);
      setMessageIndex(4);
    }, 4600);

    // 5.8s -> 59%, Stage 2
    const t5 = setTimeout(() => {
      setProgress(59);
      setStageIndex(2);
      setMessageIndex(5);
    }, 5800);

    // 7.0s -> 68%
    const t6 = setTimeout(() => {
      setProgress(68);
      setMessageIndex(6);
    }, 7000);

    // 8.1s -> 79%, Stage 3
    const t7 = setTimeout(() => {
      setProgress(79);
      setStageIndex(3);
    }, 8100);

    // 9.1s -> 88%
    const t8 = setTimeout(() => {
      setProgress(88);
    }, 9100);

    // 9.8s -> 96%, Stage 4
    const t9 = setTimeout(() => {
      setProgress(96);
      setStageIndex(4);
    }, 9800);

    // 10.5s -> 100%, Complete state reached, Toast shown!
    const t10 = setTimeout(() => {
      setProgress(100);
      setIsComplete(true);
      setShowToast(true);
    }, 10500);

    // 11.4s -> Start smooth fade-out transition
    const t11 = setTimeout(() => {
      setIsFadingOut(true);
    }, 11400);

    // 11.8s -> Automatically navigate to /feed
    const t12 = setTimeout(() => {
      navigate('/feed');
    }, 11800);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(t7);
      clearTimeout(t8);
      clearTimeout(t9);
      clearTimeout(t10);
      clearTimeout(t11);
      clearTimeout(t12);
    };
  }, [navigate]);

  return (
    <div
      className={`w-full min-h-[100dvh] bg-[#000000] text-[#F5F5F7] flex flex-col justify-between items-center px-4 py-6 select-none relative overflow-hidden transition-opacity duration-300 ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Top Green Success Toast (Acesso concluído com sucesso!) */}
      <SuccessToast show={showToast} message="Acesso concluído com sucesso!" />

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

          {/* Field 2: Animated Masked Field with character-by-character typing & deleting effect */}
          <div className="flex flex-col">
            <AnimatedMaskedField isComplete={isComplete} />
          </div>

          {/* Red Status Message Below Inputs */}
          <div className="min-h-[18px] px-0.5 pt-0.5">
            {!isComplete ? (
              <span className="text-[#FF3B30] text-[12px] font-medium leading-tight block transition-all duration-300">
                {STATUS_MESSAGES[messageIndex]}
              </span>
            ) : (
              <span className="text-[#22C55E] text-[12px] font-medium leading-tight block transition-all duration-300">
                Sessão validada com sucesso.
              </span>
            )}
          </div>

          {/* Compact Preparation Status Card */}
          <PreparationStatusCard
            progress={progress}
            stageIndex={stageIndex}
            isComplete={isComplete}
          />

          {/* Action Button "Entrar" */}
          <button
            type="button"
            disabled={!isComplete}
            onClick={() => navigate('/feed')}
            className={`w-full h-[44px] rounded-[6px] font-semibold text-[14px] text-white flex items-center justify-center transition-all duration-200 select-none mt-1.5 ${
              isComplete
                ? 'bg-[#0095F6] hover:bg-[#1877F2] active:scale-[0.98] cursor-pointer shadow-md'
                : 'bg-[#005C9E] opacity-70 cursor-not-allowed'
            }`}
          >
            {isComplete ? 'Entrar' : 'Carregando...'}
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

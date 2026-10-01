import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check, 
  Lock, 
  X, 
  ArrowRight, 
  Loader2,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { 
  fetchInstagramProfile, 
  normalizeUsername, 
  type InstagramProfileData 
} from '../services/instagramProfile';
import { saveEspiaProfile, initEspiaPreviewTimer } from '../services/espiaSession';

interface InteractiveScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetProfile?: string;
}

type ModalStage = 'input' | 'confirm';

export const InteractiveScannerModal: React.FC<InteractiveScannerModalProps> = ({
  isOpen,
  onClose,
  targetProfile = '',
}) => {
  const navigate = useNavigate();

  const [handle, setHandle] = useState(targetProfile || '');
  const [stage, setStage] = useState<ModalStage>('input');
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [foundProfile, setFoundProfile] = useState<InstagramProfileData | null>(null);

  const cleanUsername = normalizeUsername(handle);
  const isButtonDisabled = cleanUsername.length < 2 || isSearching;

  // Reset state when modal opens or closes
  useEffect(() => {
    if (!isOpen) {
      setStage('input');
      setIsSearching(false);
      setErrorMessage('');
      setFoundProfile(null);
    } else {
      if (targetProfile) {
        setHandle(targetProfile);
      }
      setStage('input');
      setIsSearching(false);
      setErrorMessage('');
      setFoundProfile(null);
    }
  }, [isOpen, targetProfile]);

  // Handler triggered when clicking the arrow button to search
  const handleFetchProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cleanUsername.length < 2 || isSearching) {
      return;
    }

    setErrorMessage('');
    setIsSearching(true);

    const requested = normalizeUsername(handle);
    const startTime = Date.now();

    try {
      // 1. Fetch real profile from backend / Apify
      const data = await fetchInstagramProfile(requested);

      // Sanity check
      const returned = normalizeUsername(data.username);
      if (requested !== returned) {
        throw new Error('PROFILE_MISMATCH');
      }

      // 2. Ensure smooth animation duration of 3.8s (range of 3 to 5 seconds)
      const elapsed = Date.now() - startTime;
      const MIN_LOADING_TIME_MS = 3800;
      if (elapsed < MIN_LOADING_TIME_MS) {
        await new Promise((r) => setTimeout(r, MIN_LOADING_TIME_MS - elapsed));
      }

      setFoundProfile(data);
      setIsSearching(false);
      setStage('confirm');
    } catch (err: unknown) {
      setIsSearching(false);
      const msg = err instanceof Error && err.message !== 'PROFILE_MISMATCH'
        ? err.message
        : 'Não foi possível localizar esse perfil. Confira o @ e tente novamente.';
      setErrorMessage(msg);
    }
  };

  // Handler when user clicks "Confirmar >"
  const handleConfirmProfile = () => {
    if (!foundProfile) return;

    saveEspiaProfile(foundProfile);
    initEspiaPreviewTimer(true);

    onClose();
    navigate('/preparing');
  };

  // Handler when user clicks "Corrigir @"
  const handleEditHandle = () => {
    setStage('input');
    setIsSearching(false);
    setErrorMessage('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-[#050507]/92 backdrop-blur-xl animate-fadeIn select-none">
      {/* Background glow in electric purple/blue */}
      <div className="absolute w-[460px] h-[460px] bg-[#8B5CF6]/15 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative w-full max-w-[430px] my-6 bg-[#0B0E14] border border-[#1E2633] rounded-[24px] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.95)] text-[#F5F5F7] overflow-hidden">
        
        {/* Close button */}
        {!isSearching && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-[#94A3B8] hover:text-white hover:bg-white/5 transition-colors focus:outline-none z-10 cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* =================================================== */}
        {/* STAGE 1: INPUT FORM (With Arrow -> Spinning Loader inside button) */}
        {/* =================================================== */}
        {stage === 'input' && (
          <div className="space-y-5 py-1">
            {/* Logo do Espia Aí Centralizada */}
            <div className="flex flex-col items-center justify-center pt-1">
              <img
                src="/espia-logo.png"
                alt="Espia Aí Logo"
                className="w-22 sm:w-26 h-auto max-h-16 object-contain mx-auto drop-shadow-[0_0_15px_rgba(139,92,246,0.35)]"
              />
            </div>

            <p className="text-sm sm:text-base text-[#94A3B8] text-center leading-relaxed font-medium">
              Digite o usuário da pessoa a ser{' '}
              <span className="text-[#3B82F6] font-bold text-glow-cyber">
                espionada
              </span>{' '}
              sem o @
            </p>

            <form onSubmit={handleFetchProfile} className="space-y-3">
              <div className="relative flex items-center bg-[#050507] rounded-xl border border-slate-700/80 p-1.5 focus-within:border-[#3B82F6] transition-colors">
                <span className="select-none font-mono font-bold text-base text-[#3B82F6] pl-3 pr-0.5">
                  @
                </span>

                <input
                  type="text"
                  disabled={isSearching}
                  value={handle.replace(/^@/, '')}
                  onChange={(e) => {
                    setHandle(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="ex: nome_do_cônjuge_2"
                  autoFocus
                  className="w-full bg-transparent text-[#F5F5F7] placeholder-[#64748B] text-sm font-medium px-2 py-2 focus:outline-none disabled:opacity-60"
                  autoComplete="off"
                  spellCheck="false"
                />

                {/* Arrow Button that converts into a spinning loader circle when clicked */}
                <button
                  type="submit"
                  disabled={isButtonDisabled}
                  className={`w-10 h-10 rounded-lg font-bold text-white transition-all flex items-center justify-center shrink-0 ${
                    isButtonDisabled
                      ? 'opacity-50 cursor-not-allowed bg-slate-800 text-slate-500'
                      : 'bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:brightness-110 shadow-[0_0_15px_rgba(37,99,235,0.45)] cursor-pointer active:scale-95'
                  }`}
                  aria-label="Buscar perfil"
                >
                  {isSearching ? (
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </button>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 font-medium flex items-center gap-2 animate-fadeIn">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </form>

            {/* Trust badges */}
            <div className="pt-2 flex items-center justify-center gap-3.5 text-xs text-[#94A3B8] flex-wrap">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#22C55E]" />
                <span>100% anônimo</span>
              </span>
              <span aria-hidden="true" className="text-slate-700">•</span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#60A5FA]" />
                <span>Sem senha</span>
              </span>
              <span aria-hidden="true" className="text-slate-700">•</span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span>Teste grátis</span>
              </span>
            </div>
          </div>
        )}

        {/* =================================================== */}
        {/* STAGE 2: EXACT INSTAGRAM PROFILE CONFIRMATION SCREEN */}
        {/* Matches uploaded reference image.png pixel for pixel */}
        {/* =================================================== */}
        {stage === 'confirm' && foundProfile && (
          <div className="py-2 space-y-5 animate-fadeIn">
            {/* Title in Purple */}
            <div className="text-center space-y-1.5">
              <h2 className="text-[24px] font-bold text-[#A855F7] tracking-tight">
                Confirme o Instagram
              </h2>
              <p className="text-[14px] text-[#E2E8F0] font-medium leading-relaxed">
                Você deseja espionar o perfil <br />
                <span className="text-white font-bold text-[16px]">@{foundProfile.username}</span>?
              </p>
            </div>

            {/* Instagram Profile Header Area */}
            <div className="bg-transparent py-2">
              <div className="flex items-center gap-4">
                {/* Large Profile Picture */}
                <div className="w-[82px] h-[82px] rounded-full overflow-hidden shrink-0 bg-neutral-900 border border-neutral-800 shadow-md">
                  <img
                    src={foundProfile.profilePicture || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`}
                    alt={foundProfile.username}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Stats Grid (posts, seguidores, seguindo) */}
                <div className="flex-1 flex items-center justify-around text-center">
                  <div>
                    <span className="text-[16px] font-bold text-white block leading-tight">
                      {foundProfile.posts !== null && foundProfile.posts !== undefined
                        ? foundProfile.posts.toLocaleString('pt-BR')
                        : '0'}
                    </span>
                    <span className="text-[12px] text-[#A0AEC0] font-medium">posts</span>
                  </div>

                  <div>
                    <span className="text-[16px] font-bold text-white block leading-tight">
                      {foundProfile.followers !== null && foundProfile.followers !== undefined
                        ? foundProfile.followers.toLocaleString('pt-BR')
                        : '685'}
                    </span>
                    <span className="text-[12px] text-[#A0AEC0] font-medium">seguidores</span>
                  </div>

                  <div>
                    <span className="text-[16px] font-bold text-white block leading-tight">
                      {foundProfile.following !== null && foundProfile.following !== undefined
                        ? foundProfile.following.toLocaleString('pt-BR')
                        : '257'}
                    </span>
                    <span className="text-[12px] text-[#A0AEC0] font-medium">seguindo</span>
                  </div>
                </div>
              </div>

              {/* Bio / Full Name display line */}
              <div className="mt-3.5 px-0.5">
                <p className="text-[13px] text-white font-normal leading-snug">
                  {foundProfile.fullName || foundProfile.biography || '🃏'}
                </p>
              </div>
            </div>

            {/* Red Warning Card */}
            <div className="bg-[#1C0D11] border border-[#851D28] rounded-[16px] p-3.5 text-center flex items-center justify-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-[#EF4444] shrink-0" />
              <p className="text-[12px] text-[#EF4444] font-medium leading-tight">
                Limite de apenas 1 pesquisa por dispositivo, certifique-se que digitou o usuário corretamente.
              </p>
            </div>

            {/* Bottom Two Action Buttons */}
            <div className="flex items-center gap-3 pt-1">
              {/* Left Pill Button: Corrigir @ */}
              <button
                type="button"
                onClick={handleEditHandle}
                className="flex-1 h-[48px] rounded-full bg-[#121822] border border-[#232C3A] hover:bg-[#1A2230] text-white text-[14px] font-bold transition-all cursor-pointer flex items-center justify-center"
              >
                Corrigir @
              </button>

              {/* Right Pill Button: Confirmar > */}
              <button
                type="button"
                onClick={handleConfirmProfile}
                className="flex-1 h-[48px] rounded-full bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#A855F7] hover:brightness-110 active:scale-[0.98] text-white text-[14px] font-bold transition-all shadow-[0_0_20px_rgba(168,85,247,0.45)] flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Confirmar</span>
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

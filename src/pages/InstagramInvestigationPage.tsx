import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Instagram,
  Check,
  Loader2,
  Circle,
  Zap,
  X,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import {
  fetchCurrentUserApi,
  getDashboardUser,
  getActiveAnalysisApi,
  startAnalysisApi,
  accelerateAnalysisApi,
  cancelAnalysisApi,
  syncAnalysisProgressApi,
  spendCreditsApi,
  type DashboardUser,
  type AnalysisData,
} from '../services/espiaSession';
import { MatrixBackground } from '../components/MatrixBackground';

export const InstagramInvestigationPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<DashboardUser>(getDashboardUser());
  const [handleInput, setHandleInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisData | null>(null);
  const [isLoadingActive, setIsLoadingActive] = useState(true);

  // Acceleration transient states
  const [isAccelerating, setIsAccelerating] = useState(false);
  const [showAccelerationSuccess, setShowAccelerationSuccess] = useState(false);

  // 2FA Error Screen State (when final stage 6 is accelerated)
  const [is2FAProcessRunning, setIs2FAProcessRunning] = useState(false);
  const [show2FAErrorScreen, setShow2FAErrorScreen] = useState(false);
  const [twoFAProgressStep, setTwoFAProgressStep] = useState(0);

  // Modals state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showAccelerateModal, setShowAccelerateModal] = useState(false);
  const [showInsufficientCreditsModal, setShowInsufficientCreditsModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to trigger 2FA loading sequence
  const trigger2FAProcess = () => {
    setIsAccelerating(false);
    setIs2FAProcessRunning(true);
    setTwoFAProgressStep(1);

    setTimeout(() => setTwoFAProgressStep(2), 1200);
    setTimeout(() => setTwoFAProgressStep(3), 2600);
    setTimeout(() => {
      setIs2FAProcessRunning(false);
      setShow2FAErrorScreen(true);
    }, 4000);
  };

  // 1. Fetch user profile and check active analysis on mount
  useEffect(() => {
    fetchCurrentUserApi().then((userData) => {
      setUser(userData);
    });

    getActiveAnalysisApi('instagram')
      .then((analysis) => {
        if (analysis) {
          setActiveAnalysis(analysis);
          if (analysis.status === 'COMPLETED' || analysis.currentStage >= 6 || analysis.progress >= 95) {
            trigger2FAProcess();
          }
        }
      })
      .finally(() => {
        setIsLoadingActive(false);
      });
  }, []);

  // 2. Slow progress simulation timer when an analysis is active
  useEffect(() => {
    if (!activeAnalysis || activeAnalysis.status === 'COMPLETED') return;

    const interval = setInterval(() => {
      setActiveAnalysis((prev) => {
        if (!prev || prev.status === 'COMPLETED') return prev;
        const currentStage = prev.currentStage || 2;
        const maxProgressForStage = Math.min(95, currentStage * 15 + 10);
        if (prev.progress >= maxProgressForStage) return prev;

        const nextProgress = prev.progress + 1;
        syncAnalysisProgressApi(nextProgress, 'instagram');
        return {
          ...prev,
          progress: nextProgress,
        };
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [activeAnalysis?.id, activeAnalysis?.status]);

  // Clean input handler: max 30 chars, allow letters, numbers, dot, underscore
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/^@/, '');
    const clean = raw.replace(/[^a-zA-Z0-9_.]/g, '').slice(0, 30);
    setHandleInput(clean);
    if (errorMessage) setErrorMessage('');
  };

  // Form submit handler
  const handleStartAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = handleInput.trim();

    if (!clean) {
      setErrorMessage('Digite o nome de usuário que deseja investigar.');
      return;
    }

    if (clean.length > 30) {
      setErrorMessage('O nome de usuário deve ter no máximo 30 caracteres.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const res = await startAnalysisApi(clean, 'instagram');
    setIsSubmitting(false);

    if (res.success && res.analysis) {
      setActiveAnalysis(res.analysis);
    } else if (res.error === 'ALREADY_RUNNING' && res.analysis) {
      setActiveAnalysis(res.analysis);
    } else {
      setErrorMessage(res.message || 'Não foi possível iniciar a análise.');
    }
  };

  // Trigger Accelerate Flow - Check real credit balance first
  const handleAccelerateClick = () => {
    if (user.credits < 30) {
      setShowInsufficientCreditsModal(true);
    } else {
      setShowAccelerateModal(true);
    }
  };

  // Confirm Acceleration Action
  const handleConfirmAccelerate = async () => {
    setShowAccelerateModal(false);
    setIsAccelerating(true);

    const res = await accelerateAnalysisApi('instagram');

    if (res.success && res.analysis) {
      setActiveAnalysis(res.analysis);
      if (typeof res.credits === 'number') {
        setUser((prev) => ({ ...prev, credits: res.credits! }));
      }

      const isFinal =
        res.analysis.status === 'COMPLETED' ||
        res.analysis.currentStage >= 6 ||
        res.analysis.progress >= 90;

      if (isFinal) {
        trigger2FAProcess();
      } else {
        // Show temporary success banner for 1500ms
        setShowAccelerationSuccess(true);
        setTimeout(() => {
          setShowAccelerationSuccess(false);
          setIsAccelerating(false);
        }, 1500);
      }
    } else if (res.error === 'INSUFFICIENT_CREDITS') {
      setIsAccelerating(false);
      if (typeof res.credits === 'number') {
        setUser((prev) => ({ ...prev, credits: res.credits! }));
      }
      setShowInsufficientCreditsModal(true);
    } else {
      setIsAccelerating(false);
      setErrorMessage(res.message || 'Erro ao acelerar análise.');
    }
  };

  // Confirm Cancel Action
  const handleConfirmCancel = async () => {
    setShowCancelModal(false);
    await cancelAnalysisApi('instagram');
    setActiveAnalysis(null);
    setHandleInput('');
  };

  // Active Analysis Stage Helpers
  const currentStage = activeAnalysis?.currentStage || 2;
  const totalStages = activeAnalysis?.totalStages || 6;
  const isCompleted = activeAnalysis?.status === 'COMPLETED' || currentStage > totalStages;
  const hasPendingStages = !isCompleted;

  // Stages Checklist Helper
  const stagesList = [
    { number: 1, title: 'Perfil encontrado' },
    { number: 2, title: 'Acessando feeds e stories...' },
    { number: 3, title: 'Recuperando mensagens privadas...' },
    { number: 4, title: 'Acessando lista de stalkers...' },
    { number: 5, title: 'Mapeando curtidas ocultas...' },
    { number: 6, title: 'Gerando relatório completo...' },
  ];

  return (
    <div className="relative min-h-screen bg-[#05090C] text-[#F5F7FA] font-sans selection:bg-[#2563EB]/30 overflow-x-hidden flex flex-col justify-between">
      {/* Background cyber pattern */}
      <MatrixBackground opacity={0.25} speed={0.3} />

      <div className="relative z-10 w-full flex-1">
        {/* HEADER */}
        <header className="sticky top-0 z-40 h-[65px] bg-[#0C1114] border-b border-[#20282D] px-4 sm:px-6 flex items-center justify-between select-none shadow-md">
          <div className="max-w-[1280px] w-full mx-auto flex items-center justify-between">
            {/* Back Arrow */}
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-xl text-[#9CA3AF] hover:text-white hover:bg-white/5 transition-colors cursor-pointer flex items-center justify-center"
              aria-label="Voltar ao dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Center Logo */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#2563EB]/20 border border-[#2563EB]/40 flex items-center justify-center">
                <Instagram className="w-3.5 h-3.5 text-[#3B82F6]" />
              </div>
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white uppercase">
                INSTAGRAM
              </span>
            </div>

            {/* Right Credits Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2563EB]/15 border border-[#2563EB]/30 text-xs font-bold text-[#3B82F6]">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{user.credits}</span>
            </div>
          </div>
        </header>

        {/* MAIN BODY CONTAINER */}
        <main className="w-full px-3 sm:px-6 py-6 sm:py-8 flex flex-col items-center justify-center">
          {isLoadingActive ? (
            <div className="py-20 flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-[#3B82F6] animate-spin" />
              <span className="text-xs text-[#9CA3AF]">Carregando módulo...</span>
            </div>
          ) : is2FAProcessRunning ? (
            /* ========================================================= */
            /* TELA 3: PROCESSO DE ACESSO AO INSTAGRAM (CARREGANDO 2FA)  */
            /* ========================================================= */
            <div className="w-full max-w-[570px] mx-auto bg-[#0C1114] border border-[#20282D] rounded-[20px] p-6 sm:p-8 shadow-2xl text-center space-y-6 select-none animate-in fade-in duration-300">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-[#2563EB]/20 border border-[#2563EB]/40 flex items-center justify-center text-[#3B82F6]">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>

              <div className="space-y-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  Acessando conta do Instagram
                </h2>
                <div className="inline-block px-3 py-1 rounded-full bg-[#2563EB]/20 text-[#3B82F6] font-mono font-bold text-xs sm:text-sm">
                  @{activeAnalysis?.username || 'usuario'}
                </div>
              </div>

              <div className="space-y-3 pt-2 text-left">
                <div className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
                  twoFAProgressStep >= 1 ? 'bg-[#2563EB]/10 border-[#2563EB]/40 text-white' : 'bg-[#05090C] border-[#20282D] text-[#6B7280]'
                }`}>
                  {twoFAProgressStep >= 1 ? (
                    <Check className="w-4 h-4 text-[#3B82F6] shrink-0 stroke-[3]" />
                  ) : (
                    <Circle className="w-4 h-4 text-[#4B5563] shrink-0" />
                  )}
                  <span className="text-xs sm:text-sm font-medium">Estabelecendo conexão segura com os servidores...</span>
                </div>

                <div className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
                  twoFAProgressStep >= 2 ? 'bg-[#2563EB]/10 border-[#2563EB]/40 text-white' : 'bg-[#05090C] border-[#20282D] text-[#6B7280]'
                }`}>
                  {twoFAProgressStep >= 2 ? (
                    <Check className="w-4 h-4 text-[#3B82F6] shrink-0 stroke-[3]" />
                  ) : (
                    <Circle className="w-4 h-4 text-[#4B5563] shrink-0" />
                  )}
                  <span className="text-xs sm:text-sm font-medium">Obtendo credenciais de sessão do perfil @{activeAnalysis?.username || 'usuario'}...</span>
                </div>

                <div className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
                  twoFAProgressStep >= 3 ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' : 'bg-[#05090C] border-[#20282D] text-[#6B7280]'
                }`}>
                  {twoFAProgressStep >= 3 ? (
                    <Loader2 className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-[#4B5563] shrink-0" />
                  )}
                  <span className="text-xs sm:text-sm font-medium">Validando chave de segurança e e-mail vinculado...</span>
                </div>
              </div>
            </div>
          ) : show2FAErrorScreen ? (
            /* ========================================================= */
            /* TELA 4: ERRO AUTENTICAÇÃO DE DOIS FATORES (2FA REQUERIDO) */
            /* ========================================================= */
            <div className="w-full max-w-[570px] mx-auto bg-[#0C1114] border border-rose-500/40 rounded-[20px] p-6 sm:p-8 shadow-[0_0_30px_rgba(244,63,94,0.15)] text-center space-y-6 select-none animate-in fade-in duration-300">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-500">
                <AlertCircle className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <div className="inline-block px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 font-extrabold text-xs tracking-wider uppercase">
                  BLOQUEIO DE SEGURANÇA DETECTADO
                </div>
                <h2 className="text-lg sm:text-2xl font-black text-white">
                  Autenticação de Dois Fatores (2FA) Ativa
                </h2>
                <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed max-w-md mx-auto">
                  A conta <strong className="text-white">@{activeAnalysis?.username || 'usuario'}</strong> possui verificação de dois fatores ativada pelo Instagram.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#05090C] border border-[#20282D] text-xs sm:text-sm text-left space-y-2 leading-relaxed">
                <p className="text-white font-semibold flex items-center gap-2">
                  <span className="text-rose-400">⚠️</span> Acesso ao E-mail Vinculado Necessário
                </p>
                <p className="text-[#9CA3AF]">
                  Para ignorar o código 2FA e liberar as mensagens e arquivos privados do perfil, é necessário interceptar a confirmação pelo e-mail da conta.
                </p>
              </div>

              {/* CARD DE PREÇO / COMPRA DE CRÉDITOS */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-[#180A0A] to-[#0C1114] border border-rose-500/30 space-y-4">
                <div className="space-y-1">
                  <span className="text-xs text-[#9CA3AF] font-bold uppercase tracking-wider">Custo do Módulo de Desbloqueio</span>
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="w-6 h-6 text-amber-400 fill-amber-400" />
                    <span className="text-2xl sm:text-3xl font-black text-white">80 Créditos</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (user.credits < 80) {
                      setShowInsufficientCreditsModal(true);
                    } else {
                      spendCreditsApi('instagram_2fa').then((res) => {
                        if (res.success) {
                          setUser((prev) => ({ ...prev, credits: res.credits }));
                          alert('Módulo de e-mail ativado! Finalizando bypass de 2FA...');
                        } else {
                          setShowInsufficientCreditsModal(true);
                        }
                      });
                    }
                  }}
                  className="w-full py-4 px-6 rounded-xl font-extrabold text-xs sm:text-sm uppercase tracking-wider text-white bg-gradient-to-r from-rose-600 via-rose-500 to-rose-700 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shadow-[0_0_20px_rgba(225,29,72,0.4)] flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>Acessar E-mail por 80 Créditos</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShow2FAErrorScreen(false);
                }}
                className="text-xs text-[#9CA3AF] hover:text-white underline font-medium cursor-pointer"
              >
                Voltar ao painel da análise
              </button>
            </div>
          ) : !activeAnalysis ? (
            /* ========================================================= */
            /* TELA 1: FORMULÁRIO DE INVESTIGAÇÃO                        */
            /* ========================================================= */
            <div className="w-full max-w-[570px] mx-auto bg-[#0C1114] border border-[#20282D] rounded-[20px] p-[18px] sm:p-8 shadow-2xl space-y-6 text-left select-none">
              {/* Header inside Card */}
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#2563EB]/15 border border-[#2563EB]/35 flex items-center justify-center text-[#3B82F6] shrink-0">
                  <Instagram className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                    Investigar Instagram
                  </h1>
                  <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
                    Analise informações e recursos disponíveis para um perfil.
                  </p>
                </div>
              </div>

              {/* Card de Dica */}
              <div className="p-3.5 rounded-xl bg-[rgba(37,99,235,0.10)] border border-[rgba(59,130,246,0.35)] text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
                <p>
                  <span className="font-bold text-[#3B82F6]">Dica:</span> informe exatamente como aparece no Instagram. Não precisa colocar @, letras maiúsculas ou espaços.
                </p>
              </div>

              {/* Form Input */}
              <form onSubmit={handleStartAnalysis} className="space-y-4 pt-1">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
                    Digite o nome de usuário (sem o @)
                  </label>

                  <div className="relative flex items-center bg-[#05090C] border border-[#20282D] focus-within:border-[#3B82F6] rounded-xl px-4 py-3 transition-colors">
                    <span className="text-[#3B82F6] font-extrabold text-base mr-2 select-none">
                      @
                    </span>
                    <input
                      type="text"
                      value={handleInput}
                      onChange={handleInputChange}
                      placeholder="Ex: lucas_silva10"
                      maxLength={30}
                      className="w-full bg-transparent text-white placeholder-[#6B7280] font-medium text-sm sm:text-base outline-none"
                    />
                  </div>

                  {errorMessage && (
                    <p className="text-xs text-rose-400 flex items-center gap-1.5 pt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errorMessage}</span>
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!handleInput.trim() || isSubmitting}
                  className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base text-white transition-all duration-200 cursor-pointer shadow-md flex items-center justify-center gap-2 ${
                    !handleInput.trim() || isSubmitting
                      ? 'bg-[#20282D] text-[#6B7280] cursor-not-allowed opacity-60'
                      : 'bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.99]'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Iniciando...</span>
                    </>
                  ) : (
                    <span>Iniciar análise</span>
                  )}
                </button>
              </form>

              {/* Bottom Info Text */}
              <div className="text-center pt-2">
                <p className="text-xs text-[#9CA3AF] font-medium">
                  🎉 Análise inicial gratuita, sem gastar créditos.
                </p>
              </div>
            </div>
          ) : (
            /* ========================================================= */
            /* TELA 2: PAINEL DE ANÁLISE EM ANDAMENTO                    */
            /* ========================================================= */
            <div className="w-full max-w-[570px] mx-auto space-y-4 select-none">
              {/* CARD PRINCIPAL DA ANÁLISE */}
              <div className="bg-[#0C1114] border border-[#20282D] rounded-[20px] p-[18px] sm:p-8 shadow-2xl space-y-6 text-left">
                {/* Header da Análise */}
                <div className="flex items-center justify-between border-b border-[#20282D] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center text-[#3B82F6]">
                      <Instagram className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight leading-tight">
                        @{activeAnalysis.username}
                      </h2>
                      <p className="text-xs text-[#9CA3AF] flex items-center gap-1.5 pt-0.5">
                        {isCompleted ? (
                          <span className="text-[#22C55E] font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Análise concluída
                          </span>
                        ) : (
                          <>
                            <Loader2 className="w-3 h-3 text-[#3B82F6] animate-spin" />
                            <span>Analisando perfil...</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Percentage Badge */}
                  <div className="px-3 py-1 rounded-full bg-[#2563EB]/15 border border-[#2563EB]/35 text-xs font-bold text-[#3B82F6]">
                    {activeAnalysis.progress}%
                  </div>
                </div>

                {/* Barra de Progresso Horizontal */}
                <div className="space-y-1.5">
                  <div className="w-full bg-[#202628] h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#3B82F6] h-full rounded-full transition-all duration-700"
                      style={{ width: `${activeAnalysis.progress}%` }}
                    />
                  </div>
                </div>

                {/* CHECKLIST DYNAMIC DE ETAPAS */}
                <div className="space-y-2.5 pt-1">
                  {stagesList.map((stage) => {
                    const isStageDone = currentStage > stage.number || isCompleted;
                    const isStageActive = currentStage === stage.number && !isCompleted;

                    if (isStageDone) {
                      return (
                        <div
                          key={stage.number}
                          className="flex items-center gap-3 p-3 rounded-r-xl bg-[rgba(37,99,235,0.12)] border-l-[3px] border-[#3B82F6] animate-in fade-in duration-300"
                        >
                          <div className="w-5 h-5 rounded-full bg-[#3B82F6] flex items-center justify-center text-white shrink-0">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                          <span className="text-xs sm:text-sm font-semibold text-[#F5F7FA]">
                            {stage.title.replace('...', '')}
                          </span>
                        </div>
                      );
                    }

                    if (isStageActive) {
                      return (
                        <div
                          key={stage.number}
                          className="flex items-center gap-3 p-3 rounded-xl bg-[#05090C] border border-[#20282D] animate-in fade-in duration-300"
                        >
                          <Loader2 className="w-5 h-5 text-[#3B82F6] animate-spin shrink-0" />
                          <span className="text-xs sm:text-sm font-medium text-[#F5F7FA]">
                            {stage.title}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={stage.number}
                        className="flex items-center gap-3 p-3 rounded-xl bg-[#05090C]/50 border border-[#20282D]/40 opacity-60"
                      >
                        <Circle className="w-5 h-5 text-[#4B5563] shrink-0" />
                        <span className="text-xs sm:text-sm text-[#9CA3AF]">
                          {stage.title}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* TEMPO ESTIMADO CARD */}
                <div className="p-4 rounded-xl bg-[#05090C] border border-[#20282D] flex items-center gap-3.5">
                  <div className="text-xl shrink-0">⌛</div>
                  <div className="space-y-0.5 text-left">
                    <h3 className="text-xs sm:text-sm font-bold text-white">
                      {isCompleted ? 'Análise concluída' : 'Análise em andamento'}
                    </h3>
                    <p className="text-xs text-[#9CA3AF]">
                      Progresso: {activeAnalysis.progress}% •{' '}
                      {isCompleted ? (
                        <span className="text-[#22C55E] font-semibold">
                          100% Finalizada
                        </span>
                      ) : activeAnalysis.accelerated ? (
                        <span className="text-[#3B82F6] font-semibold">
                          Tempo estimado: Indeterminado (você pode acelerar por 30 créditos)
                        </span>
                      ) : (
                        'Tempo estimado: 5 dias'
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* BOTÃO CANCELAR ANÁLISE */}
              <button
                type="button"
                onClick={() => setShowCancelModal(true)}
                className="w-full py-3 px-4 rounded-xl bg-[#180A0A] border border-[#7F1D1D] text-[#EF4444] hover:bg-[#2A0E0E] font-semibold text-xs sm:text-sm transition-colors cursor-pointer text-center"
              >
                Cancelar análise
              </button>

              {/* CARD DE ACELERAÇÃO OU LIBERAÇÃO DO RELATÓRIO */}
              {isCompleted ? (
                <div className="bg-gradient-to-b from-[#1E1B4B] via-[#0F172A] to-[#0C1114] border-2 border-[#2563EB]/80 rounded-2xl p-5 shadow-[0_0_30px_rgba(37,99,235,0.3)] space-y-3.5 text-center transition-all animate-in fade-in duration-300">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2563EB]/20 border border-[#2563EB]/40 text-[#3B82F6] text-xs font-extrabold tracking-wider uppercase">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Análise 100% Concluída</span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm sm:text-base font-extrabold text-white">
                      O relatório de @{activeAnalysis.username} está pronto!
                    </h3>
                    <p className="text-xs text-[#9CA3AF]">
                      Todas as mensagens, mídias e conexões mapeadas foram compiladas. Clique abaixo para iniciar o acesso à conta.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={trigger2FAProcess}
                    style={{ height: '52px' }}
                    className="w-full rounded-xl font-black text-white text-xs sm:text-sm uppercase tracking-wider bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#1D4ED8] hover:brightness-110 active:scale-[0.98] cursor-pointer shadow-[0_0_20px_rgba(59,130,246,0.4)] flex items-center justify-center gap-2 transition-all"
                  >
                    <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                    <span>Acessar Relatório de @{activeAnalysis.username}</span>
                  </button>
                </div>
              ) : (
                <div className="bg-gradient-to-b from-[#0F172A] to-[#0C1114] border border-[#2563EB]/40 rounded-2xl p-5 shadow-[0_0_20px_rgba(37,99,235,0.15)] space-y-3.5 text-center transition-all">
                  {showAccelerationSuccess ? (
                    /* TEMPORARY SUCCESS TOAST (1.5s) */
                    <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/35 text-[#22C55E] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 animate-in fade-in duration-300">
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>✓ Etapa acelerada com sucesso</span>
                    </div>
                  ) : (
                    /* CTA BUTTON RE-APPEARS FOR PENDING STAGES */
                    <>
                      <p className="text-xs sm:text-sm font-semibold text-white/90">
                        A análise está demorando...
                      </p>

                      <button
                        type="button"
                        onClick={handleAccelerateClick}
                        disabled={isAccelerating}
                        style={{
                          height: '50px',
                          background: isAccelerating
                            ? '#1E293B'
                            : 'linear-gradient(90deg, #3B82F6, #2563EB)',
                        }}
                        className={`w-full rounded-[10px] font-bold text-white text-sm tracking-wide shadow-md flex items-center justify-center gap-2 transition-all ${
                          isAccelerating
                            ? 'cursor-not-allowed opacity-80 border border-slate-700'
                            : 'hover:brightness-110 active:scale-[0.98] cursor-pointer'
                        }`}
                      >
                        {isAccelerating ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-[#3B82F6]" />
                            <span>Acelerando etapa...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                            <span>Acelerar por 30 créditos</span>
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ========================================================= */}
      {/* MODAIS DE CONFIRMAÇÃO & CRÉDITOS                          */}
      {/* ========================================================= */}

      {/* 1. Modal Confirmação Acelerar */}
      {showAccelerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-[#0C1114] border border-[#20282D] rounded-2xl p-6 shadow-2xl text-center space-y-4 select-none">
            <button
              type="button"
              onClick={() => setShowAccelerateModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mx-auto w-12 h-12 rounded-2xl bg-[#2563EB]/20 border border-[#2563EB]/40 flex items-center justify-center text-amber-400">
              <Zap className="w-6 h-6 fill-amber-400/20" />
            </div>

            <h3 className="text-base sm:text-lg font-extrabold text-white">
              Acelerar análise por 30 créditos?
            </h3>

            <div className="p-3 rounded-xl bg-[#05090C] border border-[#20282D] text-xs text-[#9CA3AF] space-y-1">
              <p>Saldo atual: <strong className="text-white">{user.credits} créditos</strong></p>
              <p>Após a operação: <strong className="text-[#3B82F6]">{Math.max(0, user.credits - 30)} créditos</strong></p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAccelerateModal(false)}
                className="w-1/2 py-3 rounded-xl bg-[#20282D] hover:bg-[#2A343B] text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmAccelerate}
                className="w-1/2 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md"
              >
                Acelerar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal Créditos Insuficientes */}
      {showInsufficientCreditsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-[#0C1114] border border-[#20282D] rounded-2xl p-6 shadow-2xl text-center space-y-4 select-none">
            <button
              type="button"
              onClick={() => setShowInsufficientCreditsModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mx-auto w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertCircle className="w-6 h-6" />
            </div>

            <h3 className="text-base sm:text-lg font-extrabold text-white">
              Créditos insuficientes
            </h3>

            <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
              Você precisa de 30 créditos para acelerar esta análise. Seu saldo atual é de {user.credits} créditos.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowInsufficientCreditsModal(false)}
                className="w-1/2 py-3 rounded-xl bg-[#20282D] hover:bg-[#2A343B] text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowInsufficientCreditsModal(false);
                  navigate('/creditos');
                }}
                className="w-1/2 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md"
              >
                Comprar créditos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal Cancelar Análise */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-[#0C1114] border border-[#20282D] rounded-2xl p-6 shadow-2xl text-center space-y-4 select-none">
            <button
              type="button"
              onClick={() => setShowCancelModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mx-auto w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertCircle className="w-6 h-6" />
            </div>

            <h3 className="text-base sm:text-lg font-extrabold text-white">
              Cancelar esta análise?
            </h3>

            <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
              Sua análise em andamento será interrompida e limpa.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="w-1/2 py-3 rounded-xl bg-[#20282D] hover:bg-[#2A343B] text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="w-1/2 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md"
              >
                Cancelar análise
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

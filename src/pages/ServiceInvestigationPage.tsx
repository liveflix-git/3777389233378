import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  Loader2,
  Circle,
  Zap,
  X,
  AlertCircle,
  CheckCircle2,
  Search,
  MapPin,
  Lock,
} from 'lucide-react';
import {
  fetchCurrentUserApi,
  getDashboardUser,
  getActiveAnalysisApi,
  startAnalysisApi,
  accelerateAnalysisApi,
  cancelAnalysisApi,
  syncAnalysisProgressApi,
  type DashboardUser,
  type AnalysisData,
} from '../services/espiaSession';
import { SERVICE_CONFIGS, type ServiceConfig } from '../services/serviceConfigs';
import { MatrixBackground } from '../components/MatrixBackground';

interface ServiceInvestigationPageProps {
  forcedServiceKey?: string;
}

export const ServiceInvestigationPage: React.FC<ServiceInvestigationPageProps> = ({
  forcedServiceKey,
}) => {
  const navigate = useNavigate();
  const params = useParams<{ service: string }>();

  const rawServiceKey = (forcedServiceKey || params.service || 'instagram').toLowerCase();
  const serviceKey = rawServiceKey === 'outras_redes' ? 'outras-redes' : rawServiceKey;

  const isDetetive = serviceKey === 'detetive' || serviceKey === 'detetive-particular';
  const config: ServiceConfig = SERVICE_CONFIGS[serviceKey] || SERVICE_CONFIGS['instagram'];

  const [user, setUser] = useState<DashboardUser>(getDashboardUser());
  const [targetInput, setTargetInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisData | null>(null);
  const [isLoadingActive, setIsLoadingActive] = useState(true);

  // Acceleration transient states
  const [isAccelerating, setIsAccelerating] = useState(false);
  const [showAccelerationSuccess, setShowAccelerationSuccess] = useState(false);

  // Security Unseal Error Screen State
  const [isUnsealProcessRunning, setIsUnsealProcessRunning] = useState(false);
  const [showSecurityErrorScreen, setShowSecurityErrorScreen] = useState(false);
  const [unsealProgressStep, setUnsealProgressStep] = useState(0);

  // Modals state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showAccelerateModal, setShowAccelerateModal] = useState(false);
  const [showInsufficientCreditsModal, setShowInsufficientCreditsModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ServiceIcon = config.icon;

  // Helper to trigger security unseal loading sequence
  const triggerUnsealProcess = () => {
    setIsAccelerating(false);
    setIsUnsealProcessRunning(true);
    setUnsealProgressStep(1);

    setTimeout(() => setUnsealProgressStep(2), 1200);
    setTimeout(() => setUnsealProgressStep(3), 2600);
    setTimeout(() => {
      setIsUnsealProcessRunning(false);
      setShowSecurityErrorScreen(true);
    }, 4000);
  };

  // 1. Fetch user profile and check active analysis on mount
  useEffect(() => {
    if (isDetetive) {
      setIsLoadingActive(false);
      return;
    }

    fetchCurrentUserApi().then((userData) => {
      setUser(userData);
    });

    getActiveAnalysisApi(serviceKey)
      .then((analysis) => {
        if (analysis) {
          setActiveAnalysis(analysis);
          if (
            analysis.status === 'COMPLETED' ||
            analysis.currentStage >= 6 ||
            analysis.progress >= 95
          ) {
            triggerUnsealProcess();
          }
        }
      })
      .finally(() => {
        setIsLoadingActive(false);
      });
  }, [serviceKey, isDetetive]);

  // 2. Progress simulation timer
  useEffect(() => {
    if (isDetetive || !activeAnalysis || activeAnalysis.status === 'COMPLETED') return;

    const interval = setInterval(() => {
      setActiveAnalysis((prev) => {
        if (!prev || prev.status === 'COMPLETED') return prev;
        const currentStage = prev.currentStage || 2;
        const maxProgressForStage = Math.min(95, currentStage * 15 + 10);
        if (prev.progress >= maxProgressForStage) return prev;

        const nextProgress = prev.progress + 1;
        syncAnalysisProgressApi(nextProgress, serviceKey);
        return {
          ...prev,
          progress: nextProgress,
        };
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [activeAnalysis?.id, activeAnalysis?.status, serviceKey, isDetetive]);

  // Input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const clean = config.sanitize(raw);
    setTargetInput(clean);
    if (errorMessage) setErrorMessage('');
  };

  // Form submit handler
  const handleStartAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = targetInput.trim();

    const validationError = config.validate(clean);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      localStorage.setItem('espia_last_searched_handle', clean);
      sessionStorage.setItem('espia_last_searched_handle', clean);
    } catch {}

    const res = await startAnalysisApi(clean, serviceKey);
    setIsSubmitting(false);

    if (res.success && res.analysis) {
      setActiveAnalysis(res.analysis);
    } else if (res.error === 'ALREADY_RUNNING' && res.analysis) {
      setActiveAnalysis(res.analysis);
    } else {
      setErrorMessage(res.message || 'Não foi possível iniciar a análise.');
    }
  };

  // Trigger Accelerate Flow
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

    const res = await accelerateAnalysisApi(serviceKey);

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
        triggerUnsealProcess();
      } else {
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
    await cancelAnalysisApi(serviceKey);
    setActiveAnalysis(null);
    setTargetInput('');
  };

  const currentStage = activeAnalysis?.currentStage || 2;
  const totalStages = activeAnalysis?.totalStages || 6;
  const isCompleted = activeAnalysis?.status === 'COMPLETED' || currentStage > totalStages;
  const hasPendingStages = !isCompleted;

  // DETETIVE PARTICULAR NOT AVAILABLE SCREEN
  if (isDetetive) {
    return (
      <div className="relative min-h-screen bg-[#05090C] text-[#F5F7FA] font-sans selection:bg-[#2563EB]/30 overflow-x-hidden flex flex-col justify-between">
        <MatrixBackground opacity={0.25} speed={0.3} />

        <div className="relative z-10 w-full flex-1">
          {/* HEADER */}
          <header className="sticky top-0 z-40 h-[65px] bg-[#0C1114] border-b border-[#20282D] px-4 sm:px-6 flex items-center justify-between select-none shadow-md">
            <div className="max-w-[1280px] w-full mx-auto flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-xl text-[#9CA3AF] hover:text-white hover:bg-white/5 transition-colors cursor-pointer flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
                  <Search className="w-3.5 h-3.5 text-neutral-300" />
                </div>
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white uppercase">
                  DETETIVE PARTICULAR
                </span>
              </div>

              <div className="w-9" />
            </div>
          </header>

          <main className="w-full px-4 py-16 flex flex-col items-center justify-center">
            <div className="w-full max-w-[520px] bg-[#0C1114] border border-[#20282D] rounded-[24px] p-8 shadow-2xl text-center space-y-6 select-none">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <MapPin className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 font-extrabold text-xs tracking-wider uppercase">
                  INDISPONÍVEL NO MOMENTO
                </span>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                  Detetive Particular
                </h1>
                <p className="text-sm text-[#9CA3AF] leading-relaxed">
                  O serviço de investigação física presencial com Detetive Particular{' '}
                  <strong className="text-amber-300 font-semibold">
                    ainda não está disponível para a sua região.
                  </strong>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#05090C] border border-[#20282D] text-xs text-[#9CA3AF] text-left leading-relaxed space-y-2">
                <p className="font-bold text-white flex items-center gap-2">
                  <span className="text-amber-400">📍</span> Expansão de Cobertura
                </p>
                <p>
                  Atualmente operamos apenas em capitais selecionadas. Você pode utilizar nossos módulos digitais instantâneos de WhatsApp, Instagram, Facebook e Localização GPS no painel.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="w-full py-3.5 rounded-xl font-extrabold text-sm text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-all cursor-pointer shadow-md"
              >
                Voltar ao Painel Principal
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

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
                <ServiceIcon className={`w-3.5 h-3.5 ${config.accentColor}`} />
              </div>
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white uppercase">
                {config.uppercaseTitle}
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
          ) : isUnsealProcessRunning ? (
            <div className="w-full max-w-[570px] mx-auto bg-[#0C1114] border border-[#20282D] rounded-[20px] p-6 sm:p-8 shadow-2xl text-center space-y-6 select-none animate-in fade-in duration-300">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-[#2563EB]/20 border border-[#2563EB]/40 flex items-center justify-center text-[#3B82F6]">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>

              <div className="space-y-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  Acessando dados do {config.title}
                </h2>
                <div className="inline-block px-3 py-1 rounded-full bg-[#2563EB]/20 text-[#3B82F6] font-mono font-bold text-xs sm:text-sm">
                  {activeAnalysis?.username || 'alvo'}
                </div>
              </div>

              <div className="space-y-3 pt-2 text-left">
                <div
                  className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
                    unsealProgressStep >= 1
                      ? 'bg-[#2563EB]/10 border-[#2563EB]/40 text-white'
                      : 'bg-[#05090C] border-[#20282D] text-[#6B7280]'
                  }`}
                >
                  {unsealProgressStep >= 1 ? (
                    <Check className="w-4 h-4 text-[#3B82F6] shrink-0 stroke-[3]" />
                  ) : (
                    <Circle className="w-4 h-4 text-[#4B5563] shrink-0" />
                  )}
                  <span className="text-xs sm:text-sm font-medium">{config.step1Text}</span>
                </div>

                <div
                  className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
                    unsealProgressStep >= 2
                      ? 'bg-[#2563EB]/10 border-[#2563EB]/40 text-white'
                      : 'bg-[#05090C] border-[#20282D] text-[#6B7280]'
                  }`}
                >
                  {unsealProgressStep >= 2 ? (
                    <Check className="w-4 h-4 text-[#3B82F6] shrink-0 stroke-[3]" />
                  ) : (
                    <Circle className="w-4 h-4 text-[#4B5563] shrink-0" />
                  )}
                  <span className="text-xs sm:text-sm font-medium">
                    {config.step2Text(activeAnalysis?.username || 'alvo')}
                  </span>
                </div>

                <div
                  className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
                    unsealProgressStep >= 3
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                      : 'bg-[#05090C] border-[#20282D] text-[#6B7280]'
                  }`}
                >
                  {unsealProgressStep >= 3 ? (
                    <Loader2 className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-[#4B5563] shrink-0" />
                  )}
                  <span className="text-xs sm:text-sm font-medium">{config.step3Text}</span>
                </div>
              </div>
            </div>
          ) : showSecurityErrorScreen ? (
            <div className="w-full max-w-[570px] mx-auto bg-[#0C1114] border border-rose-500/40 rounded-[20px] p-6 sm:p-8 shadow-[0_0_30px_rgba(244,63,94,0.15)] text-center space-y-6 select-none animate-in fade-in duration-300">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-500">
                <AlertCircle className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <div className="inline-block px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 font-extrabold text-xs tracking-wider uppercase">
                  {config.securityBlockBadge}
                </div>
                <h2 className="text-lg sm:text-2xl font-black text-white">
                  {config.securityBlockTitle}
                </h2>
                <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed max-w-md mx-auto">
                  {config.securityBlockDesc(activeAnalysis?.username || 'alvo')}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#05090C] border border-[#20282D] text-xs sm:text-sm text-left space-y-2 leading-relaxed">
                <p className="text-white font-semibold flex items-center gap-2">
                  <span className="text-rose-400">⚠️</span> Desbloqueio Avançado Requerido
                </p>
                <p className="text-[#9CA3AF]">{config.securityBlockWarning}</p>
              </div>

              {/* CARD DE PREÇO / COMPRA DE CRÉDITOS */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-[#180A0A] to-[#0C1114] border border-rose-500/30 space-y-4">
                <div className="space-y-1">
                  <span className="text-xs text-[#9CA3AF] font-bold uppercase tracking-wider">
                    Custo do Módulo de Desbloqueio
                  </span>
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
                    <span className="text-2xl sm:text-3xl font-black text-white">
                      150 Créditos
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#05090C] border border-[#20282D] text-xs">
                  <span className="text-[#9CA3AF]">Seu saldo atual:</span>
                  <span
                    className={`font-extrabold flex items-center gap-1 ${
                      user.credits >= 150 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    {user.credits} créditos
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/creditos')}
                  className="w-full py-4 rounded-xl font-extrabold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shadow-[0_0_20px_rgba(225,29,72,0.4)] flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>{config.unsealButtonText} (150 Créditos)</span>
                </button>
              </div>

              <div className="pt-2 border-t border-[#20282D] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(true)}
                  className="text-xs text-[#9CA3AF] hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Cancelar Investigação
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="text-xs text-[#3B82F6] hover:underline font-bold transition-colors cursor-pointer"
                >
                  Voltar ao Painel
                </button>
              </div>
            </div>
          ) : activeAnalysis ? (
            <div className="w-full max-w-[570px] mx-auto bg-[#0C1114] border border-[#20282D] rounded-[20px] p-5 sm:p-7 shadow-2xl space-y-6 select-none animate-in fade-in duration-300">
              {/* STATUS BAR HEADER */}
              <div className="flex items-center justify-between pb-4 border-b border-[#20282D]">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-[#3B82F6] animate-ping" />
                  <span className="text-xs font-extrabold text-white uppercase tracking-wider">
                    Investigação em Andamento
                  </span>
                </div>
                <div className="px-2.5 py-1 rounded-md bg-[#2563EB]/20 border border-[#2563EB]/40 text-[#3B82F6] font-mono font-bold text-xs">
                  {activeAnalysis.username}
                </div>
              </div>

              {/* PROGRESS CIRCLE & SPEED BAR */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#9CA3AF] flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 text-[#3B82F6] animate-spin" />
                    <span>Progresso da varredura</span>
                  </span>
                  <span className="text-[#3B82F6] font-mono text-base font-extrabold">
                    {activeAnalysis.progress}%
                  </span>
                </div>

                <div className="w-full h-3 bg-[#05090C] rounded-full overflow-hidden border border-[#20282D] p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-cyan-400 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]"
                    style={{ width: `${activeAnalysis.progress}%` }}
                  />
                </div>
              </div>

              {/* CHECKLIST DE ETAPAS */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider block mb-2">
                  Checklist de Extração de Dados
                </span>

                {config.stagesList.map((stg) => {
                  const isDone = stg.number < currentStage;
                  const isCurrent = stg.number === currentStage;

                  return (
                    <div
                      key={stg.number}
                      className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                        isDone
                          ? 'bg-[#2563EB]/10 border-[#2563EB]/30 text-white'
                          : isCurrent
                          ? 'bg-[#0F172A] border-[#3B82F6] text-white shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                          : 'bg-[#05090C]/60 border-[#20282D]/60 text-[#4B5563]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isDone ? (
                          <div className="w-5 h-5 rounded-full bg-[#2563EB] flex items-center justify-center text-white shrink-0">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : isCurrent ? (
                          <div className="w-5 h-5 rounded-full bg-[#3B82F6]/20 border border-[#3B82F6] flex items-center justify-center text-[#3B82F6] shrink-0">
                            <Loader2 className="w-3 h-3 animate-spin" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-[#374151] flex items-center justify-center shrink-0">
                            <Circle className="w-3 h-3 text-[#374151]" />
                          </div>
                        )}
                        <span className="text-xs sm:text-sm font-semibold">{stg.title}</span>
                      </div>

                      {isDone && (
                        <span className="text-[10px] font-bold text-[#3B82F6] uppercase font-mono tracking-wider">
                          Concluído
                        </span>
                      )}
                      {isCurrent && (
                        <span className="text-[10px] font-bold text-amber-400 uppercase font-mono tracking-wider animate-pulse">
                          Extraindo...
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* ACTION BUTTONS (ACELERAR / CANCELAR) */}
              <div className="pt-3 space-y-3">
                {hasPendingStages && (
                  <button
                    type="button"
                    onClick={handleAccelerateClick}
                    disabled={isAccelerating}
                    className="w-full py-4 rounded-xl font-extrabold text-xs sm:text-sm uppercase tracking-wider text-white bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.35)] flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Acelerar Análise (-30 Créditos)</span>
                  </button>
                )}

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setShowCancelModal(true)}
                    className="text-xs text-[#9CA3AF] hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    Cancelar Investigação
                  </button>

                  <span className="text-[11px] text-[#6B7280]">
                    Velocidade estimada: <strong className="text-white">Normal</strong>
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-[500px] bg-[#0C1114] border border-[#20282D] rounded-[24px] p-6 sm:p-8 shadow-2xl space-y-6 select-none animate-in fade-in duration-300">
              {/* SERVICE LOGO & TITLE */}
              <div className="text-center space-y-2">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-[#2563EB]/15 border border-[#2563EB]/35 flex items-center justify-center text-[#3B82F6] shadow-md">
                  <ServiceIcon className={`w-7 h-7 ${config.accentColor}`} />
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Investigar {config.title}
                </h1>
                <p className="text-xs text-[#9CA3AF] leading-relaxed">
                  {config.inputHelp}
                </p>
              </div>

              {/* COST & BADGE */}
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#05090C] border border-[#20282D]">
                <span className="text-xs text-[#9CA3AF] font-bold">Custo de Varredura:</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${config.badgeStyle}`}>
                  {config.creditCost}
                </span>
              </div>

              {/* INPUT FORM */}
              <form onSubmit={handleStartAnalysis} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">
                    {config.inputLabel}
                  </label>
                  <div className="relative flex items-center bg-[#05090C] border border-[#20282D] focus-within:border-[#3B82F6] rounded-xl px-3.5 py-3 transition-colors">
                    <input
                      type="text"
                      value={targetInput}
                      onChange={handleInputChange}
                      placeholder={config.placeholder}
                      className="w-full bg-transparent text-white placeholder-[#6B7280] font-medium text-sm outline-none"
                    />
                  </div>
                </div>

                {errorMessage && (
                  <p className="text-xs text-rose-400 font-medium flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errorMessage}</span>
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-xl font-extrabold text-sm uppercase tracking-wider text-white bg-gradient-to-r ${config.buttonBg} hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2`}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Iniciar Análise</span>
                  )}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: CONFIRMAÇÃO DE CANCELAMENTO */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0C1114] border border-[#20282D] rounded-2xl p-6 space-y-5 text-center shadow-2xl animate-in zoom-in-95 duration-200 select-none">
            <div className="mx-auto w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <X className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-white">Cancelar Análise?</h3>
              <p className="text-xs text-[#9CA3AF]">
                Se cancelar agora, o progresso acumulado da varredura será perdido.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="py-2.5 rounded-xl text-xs font-bold text-[#9CA3AF] bg-[#05090C] hover:text-white border border-[#20282D] cursor-pointer"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 cursor-pointer shadow-md"
              >
                Sim, Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CONFIRMAÇÃO DE ACELERAÇÃO (-30 CRÉDITOS) */}
      {showAccelerateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0C1114] border border-amber-500/30 rounded-2xl p-6 space-y-5 text-center shadow-2xl animate-in zoom-in-95 duration-200 select-none">
            <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Zap className="w-6 h-6 fill-amber-400" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-white">Acelerar Varredura?</h3>
              <p className="text-xs text-[#9CA3AF]">
                Avança instantaneamente para a próxima etapa avançada.
              </p>
              <div className="pt-2 text-xs font-extrabold text-amber-400">
                Custo: -30 Créditos (Saldo atual: {user.credits})
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAccelerateModal(false)}
                className="py-2.5 rounded-xl text-xs font-bold text-[#9CA3AF] bg-[#05090C] hover:text-white border border-[#20282D] cursor-pointer"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleConfirmAccelerate}
                className="py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-yellow-600 hover:brightness-110 cursor-pointer shadow-md"
              >
                Confirmar (-30)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CRÉDITOS INSUFICIENTES */}
      {showInsufficientCreditsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0C1114] border border-rose-500/30 rounded-2xl p-6 space-y-5 text-center shadow-2xl animate-in zoom-in-95 duration-200 select-none">
            <div className="mx-auto w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-white">Créditos Insuficientes</h3>
              <p className="text-xs text-[#9CA3AF]">
                Você precisa de pelo menos <strong className="text-white">30 créditos</strong> para acelerar a investigação.
              </p>
              <div className="pt-1 text-xs text-rose-400 font-bold">
                Saldo atual: {user.credits} créditos
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => navigate('/creditos')}
                className="w-full py-3 rounded-xl text-xs font-extrabold uppercase text-white bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:brightness-110 cursor-pointer shadow-md"
              >
                Comprar Créditos Agora
              </button>
              <button
                type="button"
                onClick={() => setShowInsufficientCreditsModal(false)}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-[#9CA3AF] hover:text-white cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

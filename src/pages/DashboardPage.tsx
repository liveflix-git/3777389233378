import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Instagram,
  MessageCircle,
  Share2,
  MapPin,
  Smartphone,
  PhoneCall,
  Camera,
  Globe,
  Search,
  Plus,
  ArrowUpRight,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { MatrixBackground } from '../components/MatrixBackground';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { ServiceCard } from '../components/dashboard/ServiceCard';
import { DashboardFooter } from '../components/dashboard/DashboardFooter';
import { LockedFeatureModal } from '../components/dashboard/LockedFeatureModal';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user: authUser, profile } = useAuth();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    isCreditPurchase?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    isCreditPurchase: false,
  });

  const openModal = (title: string, message: string, isCreditPurchase = false) => {
    setModalState({
      isOpen: true,
      title,
      message,
      isCreditPurchase,
    });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const userDisplayName = profile?.display_name || authUser?.email?.split('@')[0] || 'Investigador';
  const credits = profile?.credits ?? 200;
  const xp = profile?.xp ?? 0;
  const level = profile?.level ?? 1;
  const xpPercent = Math.min(100, Math.max(0, (xp / 200) * 100));

  return (
    <div className="relative min-h-screen bg-[#05090A] text-[#F5F5F5] selection:bg-[#8B5CF6]/30 overflow-x-hidden flex flex-col justify-between">
      {/* Discreet Matrix cyber background */}
      <MatrixBackground opacity={0.3} speed={0.4} />

      <div className="relative z-10 flex-1 w-full">
        {/* Sticky Header */}
        <DashboardHeader
          onOpenCreditsModal={() => navigate('/creditos')}
          onOpenInfoModal={(title, message) => openModal(title, message)}
        />

        {/* Main Dashboard Container */}
        <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 select-none">
          {/* HERO / WELCOME PANEL */}
          <div className="w-full bg-gradient-to-r from-[#3F2498] via-[#5934BA] to-[#7447C2] rounded-[20px] p-5 sm:p-6 shadow-[0_10px_30px_rgba(63,36,152,0.35)] relative overflow-hidden">
            {/* Ambient inner glow */}
            <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Header inside Hero: Greeting & Level Badge */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="inline-block text-xs sm:text-sm font-semibold text-white/80">
                    ✨ Bem-vindo!
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                    Olá, {userDisplayName}! 👋
                  </h1>
                  <p className="text-xs sm:text-sm text-white/65 font-normal">
                    Escolha um serviço e comece sua análise
                  </p>
                </div>

                {/* Level Badge */}
                <div className="shrink-0 bg-white/12 backdrop-blur-md rounded-[14px] px-3.5 py-2 sm:px-4 sm:py-2.5 border border-white/15 text-right flex flex-col items-end">
                  <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-1">
                    <ArrowUpRight className="w-3.5 h-3.5 text-purple-200" />
                    <span>Nv.{level}</span>
                  </span>
                  <span className="text-[10px] text-white/60 uppercase font-mono tracking-wider">
                    Level
                  </span>
                </div>
              </div>

              {/* Credits & XP Boxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 pt-2">
                {/* Box 1: Créditos */}
                <div className="bg-black/25 backdrop-blur-md rounded-xl p-4 border border-white/10 flex items-center justify-between shadow-sm">
                  <div className="space-y-1">
                    <span className="text-xs text-white/70 font-semibold block">
                      ⚡ Créditos
                    </span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-white leading-none">
                      {credits}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate('/creditos')}
                    className="w-9 h-9 rounded-full bg-white/15 border border-white/20 hover:bg-white/25 active:scale-95 transition-all flex items-center justify-center text-white cursor-pointer shadow-sm"
                    aria-label="Adicionar créditos"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Box 2: XP */}
                <div className="bg-black/25 backdrop-blur-md rounded-xl p-4 border border-white/10 flex flex-col justify-between space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/70 font-semibold">
                      ✨ XP
                    </span>
                    <span className="text-base sm:text-xl font-extrabold text-white">
                      {xp}/200
                    </span>
                  </div>

                  {/* Horizontal Progress Bar */}
                  <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-white/80 h-full rounded-full transition-all duration-500"
                      style={{ width: `${xpPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SERVICES SECTION */}
          <section className="space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>🔥 Serviços Disponíveis</span>
            </h2>

            {/* Grid 4 columns desktop, 2 tablet, 1 mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
              {/* 1. Instagram */}
              <ServiceCard
                icon={<Instagram className="w-5 h-5 text-pink-400" />}
                title="Instagram"
                description="Veja dados públicos, atividades disponíveis e recursos de análise de perfis."
                creditCost="Grátis 🥳"
                accentColor="text-pink-400 bg-pink-500/10 border-pink-500/30"
                badgeStyle="bg-pink-500/15 text-pink-300 border-pink-500/30"
                onClick={() => navigate('/dashboard/instagram')}
              />

              {/* 2. WhatsApp */}
              <ServiceCard
                icon={<MessageCircle className="w-5 h-5 text-emerald-400" />}
                title="WhatsApp"
                description="Recursos de análise e ferramentas relacionadas ao WhatsApp."
                creditCost="⚡ 40 créditos"
                accentColor="text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                badgeStyle="bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                onClick={() =>
                  openModal(
                    'WhatsApp',
                    'Recurso em desenvolvimento.'
                  )
                }
              />

              {/* 3. Facebook */}
              <ServiceCard
                icon={<Share2 className="w-5 h-5 text-sky-400" />}
                title="Facebook"
                description="Ferramentas de análise de informações publicamente disponíveis."
                creditCost="⚡ 45 créditos"
                accentColor="text-sky-400 bg-sky-500/10 border-sky-500/30"
                badgeStyle="bg-sky-500/15 text-sky-300 border-sky-500/30"
                onClick={() =>
                  openModal(
                    'Facebook',
                    'Recurso em desenvolvimento.'
                  )
                }
              />

              {/* 4. Localização */}
              <ServiceCard
                icon={<MapPin className="w-5 h-5 text-amber-400" />}
                title="Localização"
                description="Ferramentas regionais e recursos de localização disponíveis."
                creditCost="⚡ 60 créditos"
                accentColor="text-amber-400 bg-amber-500/10 border-amber-500/30"
                badgeStyle="bg-amber-500/15 text-amber-300 border-amber-500/30"
                onClick={() =>
                  openModal(
                    'Localização',
                    'Recurso em desenvolvimento.'
                  )
                }
              />

              {/* 5. SMS */}
              <ServiceCard
                icon={<Smartphone className="w-5 h-5 text-yellow-400" />}
                title="SMS"
                description="Módulo de análise e ferramentas relacionadas a mensagens."
                creditCost="⚡ 30 créditos"
                accentColor="text-yellow-400 bg-yellow-500/10 border-yellow-500/30"
                badgeStyle="bg-yellow-500/15 text-yellow-300 border-yellow-500/30"
                onClick={() =>
                  openModal(
                    'SMS',
                    'Recurso em desenvolvimento.'
                  )
                }
              />

              {/* 6. Chamadas */}
              <ServiceCard
                icon={<PhoneCall className="w-5 h-5 text-emerald-400" />}
                title="Chamadas"
                description="Módulo de análise de registros e ferramentas relacionadas."
                creditCost="⚡ 25 créditos"
                accentColor="text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                badgeStyle="bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                onClick={() =>
                  openModal(
                    'Chamadas',
                    'Recurso em desenvolvimento.'
                  )
                }
              />

              {/* 7. Câmera */}
              <ServiceCard
                icon={<Camera className="w-5 h-5 text-fuchsia-400" />}
                title="Câmera"
                description="Recursos multimídia disponíveis na plataforma."
                creditCost="⚡ 55 créditos"
                accentColor="text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/30"
                badgeStyle="bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30"
                onClick={() =>
                  openModal(
                    'Câmera',
                    'Recurso em desenvolvimento.'
                  )
                }
              />

              {/* 8. Outras Redes */}
              <ServiceCard
                icon={<Globe className="w-5 h-5 text-rose-400" />}
                title="Outras Redes"
                description="Ferramentas adicionais para outras plataformas e redes sociais."
                creditCost="⚡ 70 créditos"
                accentColor="text-rose-400 bg-rose-500/10 border-rose-500/30"
                badgeStyle="bg-rose-500/15 text-rose-300 border-rose-500/30"
                onClick={() =>
                  openModal(
                    'Outras Redes',
                    'Recurso em desenvolvimento.'
                  )
                }
              />

              {/* 9. Detetive Particular (~2 columns on desktop) */}
              <ServiceCard
                className="lg:col-span-2"
                icon={<Search className="w-5 h-5 text-neutral-300" />}
                title="Detetive Particular"
                description="Investigação personalizada com atendimento especializado."
                creditCost="Personalizado"
                accentColor="text-neutral-300 bg-white/10 border-white/20"
                badgeStyle="bg-white/10 text-neutral-300 border-white/20"
                onClick={() =>
                  openModal(
                    'Detetive Particular',
                    'Atendimento personalizado sob demanda com especialista. Entre em contato na central.'
                  )
                }
              />
            </div>
          </section>
        </main>
      </div>

      {/* FOOTER */}
      <DashboardFooter
        onOpenInfoModal={(title, message) => openModal(title, message)}
      />

      {/* MODAL */}
      <LockedFeatureModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
        isCreditPurchase={modalState.isCreditPurchase}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MatrixBackground } from './components/MatrixBackground';
import { EspiaHeroScreen } from './components/EspiaHeroScreen';
import { InteractiveScannerModal } from './components/InteractiveScannerModal';
import { FeedPage } from './pages/FeedPage';
import { ProfilePage } from './pages/ProfilePage';
import { DirectPage } from './pages/DirectPage';
import { ChatPage } from './pages/ChatPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { PreparingPage } from './pages/PreparingPage';
import { UnlockPage } from './pages/UnlockPage';
import { DashboardPage } from './pages/DashboardPage';
import { InstagramInvestigationPage } from './pages/InstagramInvestigationPage';
import { AntiAlertPage } from './pages/AntiAlertPage';
import { CreditsPage } from './pages/CreditsPage';
import { LoginPage } from './pages/LoginPage';

function LandingPage() {
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#050507] text-[#F5F5F7] overflow-hidden flex flex-col justify-center items-center">
      {/* 1. Cyber matrix background */}
      <MatrixBackground opacity={0.85} speed={0.9} />

      {/* 2. Hero Screen */}
      <main className="w-full h-full flex items-center justify-center relative z-10">
        <EspiaHeroScreen onStartAnalysis={() => setIsScannerOpen(true)} />
      </main>

      {/* 3. Interactive lookup & transition modal */}
      <InteractiveScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/entrar" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/instagram" element={<InstagramInvestigationPage />} />
        <Route path="/creditos" element={<CreditsPage />} />
        <Route path="/comprar-creditos" element={<CreditsPage />} />
        <Route path="/dashboard/creditos" element={<CreditsPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/preparing" element={<PreparingPage />} />
        <Route path="/analyzing" element={<PreparingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/direct" element={<DirectPage />} />
        <Route path="/inbox" element={<DirectPage />} />
        <Route path="/chat/:chatId" element={<ChatPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/activity" element={<NotificationsPage />} />
        <Route path="/unlock" element={<UnlockPage />} />
        <Route path="/acesso" element={<UnlockPage />} />
        <Route path="/alerta" element={<AntiAlertPage />} />
        <Route path="/anti-alerta" element={<AntiAlertPage />} />
        <Route path="/back-redirect" element={<AntiAlertPage />} />
        <Route path="/alerta-anti-vigilancia" element={<AntiAlertPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

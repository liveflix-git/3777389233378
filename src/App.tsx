import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
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
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/entrar" element={<LoginPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/instagram"
            element={
              <ProtectedRoute>
                <InstagramInvestigationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/creditos"
            element={
              <ProtectedRoute>
                <CreditsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/comprar-creditos"
            element={
              <ProtectedRoute>
                <CreditsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/creditos"
            element={
              <ProtectedRoute>
                <CreditsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/feed"
            element={
              <ProtectedRoute>
                <FeedPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/preparing"
            element={
              <ProtectedRoute>
                <PreparingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analyzing"
            element={
              <ProtectedRoute>
                <PreparingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/direct"
            element={
              <ProtectedRoute>
                <DirectPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inbox"
            element={
              <ProtectedRoute>
                <DirectPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:chatId"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/activity"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/unlock"
            element={
              <ProtectedRoute>
                <UnlockPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/acesso"
            element={
              <ProtectedRoute>
                <UnlockPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alerta"
            element={
              <ProtectedRoute>
                <AntiAlertPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/anti-alerta"
            element={
              <ProtectedRoute>
                <AntiAlertPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/back-redirect"
            element={
              <ProtectedRoute>
                <AntiAlertPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alerta-anti-vigilancia"
            element={
              <ProtectedRoute>
                <AntiAlertPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

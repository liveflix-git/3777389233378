import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
import { ServiceInvestigationPage } from './pages/ServiceInvestigationPage';
import { AntiAlertPage } from './pages/AntiAlertPage';
import { CreditsPage } from './pages/CreditsPage';
import { LoginPage } from './pages/LoginPage';

function RouteNormalizer() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Check query parameter routing (?page=dashboard, ?page=back-redirect, etc.)
    const searchParams = new URLSearchParams(location.search);
    const paramRoute =
      searchParams.get('page') ||
      searchParams.get('p') ||
      searchParams.get('r') ||
      searchParams.get('route') ||
      searchParams.get('redirect') ||
      searchParams.get('path');

    if (paramRoute) {
      const clean = paramRoute.toLowerCase().trim().replace(/^\//, '');
      if (clean === 'dashboard' || clean === 'painel' || clean === 'app') {
        navigate('/dashboard', { replace: true });
        return;
      }
      if (clean === 'login' || clean === 'entrar' || clean === 'auth') {
        navigate('/login', { replace: true });
        return;
      }
      if (
        clean === 'back-redirect' ||
        clean === 'backredirect' ||
        clean === 'back_redirect' ||
        clean === 'back' ||
        clean === 'redirect' ||
        clean === 'alerta' ||
        clean === 'anti-alerta'
      ) {
        navigate('/back-redirect', { replace: true });
        return;
      }
      if (clean === 'unlock' || clean === 'desbloqueio' || clean === 'vip') {
        navigate('/unlock', { replace: true });
        return;
      }
    }

    // 2. Check hash routing (#/dashboard, #/back-redirect, etc.)
    if (location.hash) {
      const hash = location.hash.replace(/^#\/?/, '').toLowerCase().trim();
      if (hash === 'dashboard' || hash === 'painel' || hash === 'app') {
        navigate('/dashboard', { replace: true });
        return;
      }
      if (hash === 'login' || hash === 'entrar' || hash === 'auth') {
        navigate('/login', { replace: true });
        return;
      }
      if (
        hash === 'back-redirect' ||
        hash === 'backredirect' ||
        hash === 'back_redirect' ||
        hash === 'back' ||
        hash === 'redirect' ||
        hash === 'alerta' ||
        hash === 'anti-alerta'
      ) {
        navigate('/back-redirect', { replace: true });
        return;
      }
      if (hash === 'unlock' || hash === 'desbloqueio' || hash === 'vip') {
        navigate('/unlock', { replace: true });
        return;
      }
    }

    // 3. Check case sensitivity or trailing slash
    const rawPath = location.pathname;
    const lower = rawPath.toLowerCase();
    const withoutTrailing = lower.length > 1 ? lower.replace(/\/+$/, '') : lower;
    if (rawPath !== withoutTrailing) {
      navigate(withoutTrailing + location.search + location.hash, { replace: true });
    }

    // 4. Meta Pixel SPA PageView tracking on route change
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'PageView');
    }
  }, [location.pathname, location.search, location.hash, navigate]);

  return null;
}

function FallbackRedirect() {
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  if (path.includes('dashboard') || path.includes('painel')) {
    return <Navigate to="/dashboard" replace />;
  }

  if (path.includes('login') || path.includes('entrar') || path.includes('auth')) {
    return <Navigate to="/login" replace />;
  }

  if (
    path.includes('back') ||
    path.includes('redirect') ||
    path.includes('alerta') ||
    path.includes('vigilancia')
  ) {
    return <Navigate to="/back-redirect" replace />;
  }

  if (path.includes('unlock') || path.includes('acesso') || path.includes('vip')) {
    return <Navigate to="/unlock" replace />;
  }

  return <Navigate to="/" replace />;
}

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
        <RouteNormalizer />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/" element={<LoginPage />} />
          <Route path="/login/*" element={<LoginPage />} />
          <Route path="/entrar" element={<LoginPage />} />
          <Route path="/entrar/" element={<LoginPage />} />
          <Route path="/entrar/*" element={<LoginPage />} />
          <Route path="/auth" element={<LoginPage />} />
          <Route path="/auth/*" element={<LoginPage />} />

          {/* Dashboard routes and aliases */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/painel"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/painel/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/"
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
            path="/dashboard/:service"
            element={
              <ProtectedRoute>
                <ServiceInvestigationPage />
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

          {/* Back redirect and Anti-Alert Routes & aliases */}
          <Route path="/back-redirect" element={<AntiAlertPage />} />
          <Route path="/back-redirect/" element={<AntiAlertPage />} />
          <Route path="/back-redirect/*" element={<AntiAlertPage />} />
          <Route path="/backredirect" element={<AntiAlertPage />} />
          <Route path="/backredirect/" element={<AntiAlertPage />} />
          <Route path="/back_redirect" element={<AntiAlertPage />} />
          <Route path="/back_redirect/" element={<AntiAlertPage />} />
          <Route path="/back" element={<AntiAlertPage />} />
          <Route path="/back/" element={<AntiAlertPage />} />
          <Route path="/redirect" element={<AntiAlertPage />} />
          <Route path="/redirect/" element={<AntiAlertPage />} />
          <Route path="/alerta" element={<AntiAlertPage />} />
          <Route path="/alerta/" element={<AntiAlertPage />} />
          <Route path="/anti-alerta" element={<AntiAlertPage />} />
          <Route path="/anti-alerta/" element={<AntiAlertPage />} />
          <Route path="/alerta-anti-vigilancia" element={<AntiAlertPage />} />
          <Route path="/alerta-anti-vigilancia/" element={<AntiAlertPage />} />

          {/* Smart Fallback */}
          <Route path="*" element={<FallbackRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

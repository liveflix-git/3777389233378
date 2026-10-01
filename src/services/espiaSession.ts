import type { InstagramProfileData } from './instagramProfile';

const PROFILE_STORAGE_KEY = 'espia_profile';
const PREVIEW_TIMER_KEY = 'espia_preview_expires_at';
const DASHBOARD_USER_KEY = 'espia_dashboard_user';
const PERSISTENT_USER_ID_KEY = 'espia_user_id';
const FIVE_MINUTES_MS = 5 * 60 * 1000;

export interface DashboardUser {
  id: string;
  displayName: string;
  username: string;
  credits: number;
  xp: number;
  level: number;
}

/**
 * Gets or initializes a persistent unique client user ID in localStorage.
 * Guarantees that refresh, relogin, or navigation maintains the exact same backend account ID.
 */
export function getOrInitUserId(): string {
  try {
    let storedId = localStorage.getItem(PERSISTENT_USER_ID_KEY);
    if (!storedId || storedId.trim().length === 0) {
      storedId = `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      localStorage.setItem(PERSISTENT_USER_ID_KEY, storedId);
    }
    return storedId;
  } catch {
    return 'user_default';
  }
}

export function setUserId(id: string): void {
  try {
    localStorage.setItem(PERSISTENT_USER_ID_KEY, id);
  } catch {}
}

/**
 * Calls backend POST /api/auth/login
 */
export async function loginApi(
  email: string,
  password?: string
): Promise<{ success: boolean; user?: DashboardUser; message?: string }> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = (await res.json()) as any;
    if (res.ok && data.success && data.user) {
      setUserId(data.user.id);
      saveDashboardUser(data.user);
      return { success: true, user: data.user };
    } else {
      return { success: false, message: data.message || 'Falha ao realizar login.' };
    }
  } catch (err) {
    console.error('[EspiaSession] Login error:', err);
    return { success: false, message: 'Erro de conexão com o servidor.' };
  }
}

/**
 * Calls backend POST /api/auth/register
 */
export async function registerApi(
  name: string,
  email: string,
  password?: string
): Promise<{ success: boolean; user?: DashboardUser; message?: string }> {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = (await res.json()) as any;
    if (res.ok && data.success && data.user) {
      setUserId(data.user.id);
      saveDashboardUser(data.user);
      return { success: true, user: data.user };
    } else {
      return { success: false, message: data.message || 'Falha ao criar conta.' };
    }
  } catch (err) {
    console.error('[EspiaSession] Register error:', err);
    return { success: false, message: 'Erro de conexão com o servidor.' };
  }
}

/**
 * Calls backend GET /api/me to fetch official server-side user record and credit balance.
 */
export async function fetchCurrentUserApi(): Promise<DashboardUser> {
  const userId = getOrInitUserId();
  try {
    const res = await fetch(`/api/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId,
      },
    });

    if (res.ok) {
      const data = (await res.json()) as any;
      const user: DashboardUser = {
        id: data.id || userId,
        displayName: data.displayName || 'Felipe',
        username: data.username || 'felipe',
        credits: typeof data.credits === 'number' ? data.credits : 200,
        xp: typeof data.xp === 'number' ? data.xp : 0,
        level: typeof data.level === 'number' ? data.level : 1,
      };

      // Cache locally for offline fallback
      try {
        localStorage.setItem(DASHBOARD_USER_KEY, JSON.stringify(user));
      } catch {}

      return user;
    }
  } catch (err) {
    console.warn('[EspiaSession] Failed to fetch /api/me, falling back to local cache:', err);
  }

  return getDashboardUser();
}

/**
 * Calls backend POST /api/user/spend to debit credits atomically on server.
 */
export async function spendCreditsApi(
  service: string
): Promise<{ success: boolean; credits: number; cost?: number; error?: string }> {
  const userId = getOrInitUserId();
  try {
    const res = await fetch('/api/user/spend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId,
      },
      body: JSON.stringify({ service }),
    });

    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = (await res.json()) as any;
      if (data.success) {
        saveDashboardUser({ credits: data.credits });
        return {
          success: true,
          credits: data.credits,
          cost: data.cost,
        };
      } else {
        return {
          success: false,
          credits: typeof data.credits === 'number' ? data.credits : getDashboardUser().credits,
          error: data.error || 'SPEND_FAILED',
        };
      }
    }
  } catch (err) {
    console.warn('[EspiaSession] Error spending credits via API, using local storage fallback:', err);
  }

  // Fallback for static Netlify host
  const user = getDashboardUser();
  const cost = service === 'whatsapp' ? 40 : service === 'facebook' ? 45 : service === 'location' ? 60 : service === '2fa_bypass' ? 80 : 30;
  if (user.credits < cost) {
    return { success: false, credits: user.credits, error: 'INSUFFICIENT_CREDITS' };
  }
  const newCredits = user.credits - cost;
  saveDashboardUser({ credits: newCredits });
  return { success: true, credits: newCredits, cost };
}

export interface AnalysisData {
  id: string;
  userId: string;
  username: string;
  service: string;
  status: 'PENDING' | 'ACCELERATED' | 'COMPLETED' | 'CANCELLED';
  currentStage: number;
  totalStages: number;
  progress: number;
  accelerated: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getActiveAnalysisApi(service = 'instagram'): Promise<AnalysisData | null> {
  const userId = getOrInitUserId();
  try {
    const res = await fetch(`/api/analysis/active?service=${encodeURIComponent(service)}`, {
      method: 'GET',
      headers: { 'X-User-Id': userId },
    });
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = (await res.json()) as any;
      return data.analysis || null;
    }
  } catch (err) {
    console.warn('[EspiaSession] Failed to fetch active analysis via API:', err);
  }

  try {
    const raw = localStorage.getItem(`espia_active_analysis_${service}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export async function startAnalysisApi(
  username: string,
  service = 'instagram'
): Promise<{ success: boolean; analysis?: AnalysisData; error?: string; message?: string }> {
  const userId = getOrInitUserId();
  try {
    const res = await fetch('/api/analysis/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId,
      },
      body: JSON.stringify({ username, service }),
    });

    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = (await res.json()) as any;
      return data;
    }
  } catch (err) {
    console.warn('[EspiaSession] Failed to start analysis via API:', err);
  }

  const now = new Date().toISOString();
  const analysis: AnalysisData = {
    id: `anal_${Date.now()}`,
    userId,
    username,
    service,
    status: 'PENDING',
    currentStage: 2,
    totalStages: 6,
    progress: 25,
    accelerated: false,
    createdAt: now,
    updatedAt: now,
  };
  try {
    localStorage.setItem(`espia_active_analysis_${service}`, JSON.stringify(analysis));
  } catch {}
  return { success: true, analysis };
}

export async function accelerateAnalysisApi(
  service = 'instagram'
): Promise<{ success: boolean; analysis?: AnalysisData; credits?: number; error?: string; message?: string }> {
  const userId = getOrInitUserId();
  try {
    const res = await fetch('/api/analysis/accelerate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId,
      },
      body: JSON.stringify({ service }),
    });

    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = (await res.json()) as any;
      if (data.success && typeof data.credits === 'number') {
        saveDashboardUser({ credits: data.credits });
      }
      return data;
    }
  } catch (err) {
    console.warn('[EspiaSession] Failed to accelerate analysis via API:', err);
  }

  const user = getDashboardUser();
  if (user.credits < 30) {
    return { success: false, credits: user.credits, error: 'INSUFFICIENT_CREDITS', message: 'Créditos insuficientes.' };
  }

  const newCredits = user.credits - 30;
  saveDashboardUser({ credits: newCredits });

  const active = await getActiveAnalysisApi(service);
  if (!active) {
    return { success: false, credits: newCredits, error: 'NO_ACTIVE_ANALYSIS', message: 'Nenhuma análise ativa encontrada.' };
  }

  const nextStage = Math.min(6, (active.currentStage || 2) + 1);
  const isCompleted = nextStage >= 6;
  const nextProgress = isCompleted ? 100 : Math.min(95, nextStage * 15 + 10);

  const updatedAnalysis: AnalysisData = {
    ...active,
    currentStage: nextStage,
    progress: nextProgress,
    status: isCompleted ? 'COMPLETED' : 'ACCELERATED',
    accelerated: true,
    updatedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(`espia_active_analysis_${service}`, JSON.stringify(updatedAnalysis));
  } catch {}

  return {
    success: true,
    credits: newCredits,
    analysis: updatedAnalysis,
  };
}

export async function cancelAnalysisApi(service = 'instagram'): Promise<boolean> {
  const userId = getOrInitUserId();
  try {
    const res = await fetch('/api/analysis/cancel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId,
      },
      body: JSON.stringify({ service }),
    });
    if (res.ok) return true;
  } catch (err) {
    console.warn('[EspiaSession] Failed to cancel analysis via API:', err);
  }

  try {
    localStorage.removeItem(`espia_active_analysis_${service}`);
    return true;
  } catch {
    return false;
  }
}

export async function syncAnalysisProgressApi(progress: number, service = 'instagram'): Promise<void> {
  const userId = getOrInitUserId();
  try {
    await fetch('/api/analysis/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId,
      },
      body: JSON.stringify({ service, progress }),
    });
  } catch (err) {
    // Ignore transient sync errors
  }

  try {
    const active = await getActiveAnalysisApi(service);
    if (active) {
      active.progress = progress;
      if (progress >= 100) {
        active.status = 'COMPLETED';
        active.currentStage = 6;
      }
      localStorage.setItem(`espia_active_analysis_${service}`, JSON.stringify(active));
    }
  } catch {}
}

/**
 * Retrieves cached local user record as fallback.
 */
export function getDashboardUser(): DashboardUser {
  const userId = getOrInitUserId();
  try {
    const raw = localStorage.getItem(DASHBOARD_USER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        id: parsed.id || userId,
        displayName: parsed.displayName || 'Felipe',
        username: parsed.username || 'felipe',
        credits: typeof parsed.credits === 'number' ? parsed.credits : 200,
        xp: typeof parsed.xp === 'number' ? parsed.xp : 0,
        level: typeof parsed.level === 'number' ? parsed.level : 1,
      };
    }
  } catch (err) {
    console.error('[EspiaSession] Failed to read cached dashboard user:', err);
  }

  return {
    id: userId,
    displayName: 'Felipe',
    username: 'felipe',
    credits: 200,
    xp: 0,
    level: 1,
  };
}

/**
 * Updates/saves the dashboard user into local cache.
 */
export function saveDashboardUser(user: Partial<DashboardUser>): void {
  try {
    const current = getDashboardUser();
    const updated = { ...current, ...user };
    localStorage.setItem(DASHBOARD_USER_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('[EspiaSession] Failed to save dashboard user:', err);
  }
}

/**
 * Clears stored profile state. Note: DOES NOT reset server-side credit balance!
 */
export function logoutDashboardUser(): void {
  try {
    localStorage.removeItem(DASHBOARD_USER_KEY);
    clearEspiaProfile();
  } catch (err) {
    console.error('[EspiaSession] Failed to logout dashboard user:', err);
  }
}

/**
 * Persists the resolved Espia profile into localStorage
 */
export function saveEspiaProfile(profile: InstagramProfileData): void {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('[EspiaSession] Failed to save profile to localStorage:', err);
  }
}

/**
 * Retrieves the currently saved Espia profile from localStorage
 */
export function getEspiaProfile(): InstagramProfileData | null {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as InstagramProfileData;
  } catch (err) {
    console.error('[EspiaSession] Failed to read profile from localStorage:', err);
    return null;
  }
}

/**
 * Clears the saved Espia profile from localStorage and resets timer
 */
export function clearEspiaProfile(): void {
  try {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    sessionStorage.removeItem(PREVIEW_TIMER_KEY);
    sessionStorage.removeItem('espia_toast_shown');
  } catch (err) {
    console.error('[EspiaSession] Failed to clear profile:', err);
  }
}

/**
 * Initializes or reads the 5-minute countdown expiration timestamp in sessionStorage.
 */
export function initEspiaPreviewTimer(forceReset = false): number {
  try {
    if (!forceReset) {
      const existing = sessionStorage.getItem(PREVIEW_TIMER_KEY);
      if (existing) {
        const parsed = parseInt(existing, 10);
        if (!isNaN(parsed) && parsed > Date.now()) {
          return parsed;
        }
      }
    }
    const newExpiresAt = Date.now() + FIVE_MINUTES_MS;
    sessionStorage.setItem(PREVIEW_TIMER_KEY, String(newExpiresAt));
    sessionStorage.removeItem('espia_toast_shown');
    return newExpiresAt;
  } catch (err) {
    return Date.now() + FIVE_MINUTES_MS;
  }
}

/**
 * Calculates the remaining seconds for the active 5-minute preview.
 */
export function getEspiaPreviewRemainingSeconds(): number {
  try {
    let expiresAtStr = sessionStorage.getItem(PREVIEW_TIMER_KEY);
    if (!expiresAtStr) {
      const newExpiresAt = initEspiaPreviewTimer();
      expiresAtStr = String(newExpiresAt);
    }
    const expiresAt = parseInt(expiresAtStr, 10);
    if (isNaN(expiresAt)) return 0;
    const remainingMs = expiresAt - Date.now();
    return Math.max(0, Math.floor(remainingMs / 1000));
  } catch {
    return 0;
  }
}

/**
 * Checks if the preview timer has expired.
 */
export function isEspiaPreviewExpired(): boolean {
  return getEspiaPreviewRemainingSeconds() <= 0;
}

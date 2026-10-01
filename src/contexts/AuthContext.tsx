import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getDashboardUser, saveDashboardUser, logoutDashboardUser } from '../services/espiaSession';

const DEMO_AUTH_STORAGE_KEY = 'espia_auth_session';

export interface UserProfile {
  id: string;
  display_name: string | null;
  credits: number;
  xp: number;
  level: number;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isConfigured: boolean;
  signUp: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  isConfigured: false,
  signUp: async () => ({ success: false }),
  signIn: async () => ({ success: false }),
  signOut: async () => {},
  refreshProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = async (userId: string, currentUserObj?: User | null) => {
    const effectiveUser = currentUserObj || user;
    const fallbackName =
      effectiveUser?.user_metadata?.display_name ||
      effectiveUser?.email?.split('@')[0] ||
      'Investigador';

    let currentCredits = 200;
    try {
      const cached = getDashboardUser();
      if (typeof cached.credits === 'number') {
        currentCredits = cached.credits;
      }
    } catch {}

    if (!isSupabaseConfigured) {
      setProfile({
        id: userId,
        display_name: fallbackName,
        credits: currentCredits,
        xp: 0,
        level: 1,
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        const p = data as UserProfile;
        setProfile(p);
        saveDashboardUser({ credits: p.credits });
      } else {
        if (error) {
          console.warn('[SupabaseAuth] Could not fetch profile table:', error.message);
        }
        setProfile({
          id: userId,
          display_name: fallbackName,
          credits: currentCredits,
          xp: 0,
          level: 1,
        });
      }
    } catch (err) {
      console.error('[SupabaseAuth] Exception fetching profile:', err);
      setProfile({
        id: userId,
        display_name: fallbackName,
        credits: currentCredits,
        xp: 0,
        level: 1,
      });
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id, user);
    } else {
      const cached = getDashboardUser();
      if (typeof cached.credits === 'number') {
        setProfile((prev) => (prev ? { ...prev, credits: cached.credits } : null));
      }
    }
  };

  // Listen to global credit updates across all features
  useEffect(() => {
    const handleCreditsEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ credits: number }>;
      const newCredits = customEvent.detail?.credits;
      if (typeof newCredits === 'number') {
        setProfile((prev) => (prev ? { ...prev, credits: newCredits } : null));
        if (isSupabaseConfigured && user?.id) {
          Promise.resolve(
            supabase
              .from('profiles')
              .update({ credits: newCredits })
              .eq('id', user.id)
          ).catch(() => {});
        }
      }
    };

    window.addEventListener('espia_credits_updated', handleCreditsEvent);
    return () => {
      window.removeEventListener('espia_credits_updated', handleCreditsEvent);
    };
  }, [user?.id]);

  useEffect(() => {
    let mounted = true;

    if (!isSupabaseConfigured) {
      // Restore persistent session from localStorage for demo mode
      try {
        const stored = localStorage.getItem(DEMO_AUTH_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.user) {
            setUser(parsed.user);
            setSession(parsed.session);
            const cachedCredits = getDashboardUser().credits ?? 200;
            setProfile({
              ...(parsed.profile || {}),
              credits: cachedCredits,
            });
          }
        }
      } catch (err) {
        console.warn('[AuthContext] Failed to restore demo session:', err);
      }
      setLoading(false);
      return;
    }

    // 1. Get initial session from Supabase persistent storage
    supabase.auth
      .getSession()
      .then(async ({ data: { session } }) => {
        if (!mounted) return;
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id, session.user);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn('[SupabaseAuth] Session initialization error:', err);
        if (mounted) setLoading(false);
      });

    // 2. Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchProfile(session.user.id, session.user);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, name?: string) => {
    if (!isSupabaseConfigured) {
      const mockUser = {
        id: 'user_demo_123',
        email,
        app_metadata: {},
        user_metadata: { display_name: name || email.split('@')[0] },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as User;

      const mockSession = {
        access_token: 'mock_token',
        token_type: 'bearer',
        user: mockUser,
      } as unknown as Session;

      const cachedCredits = getDashboardUser().credits ?? 200;
      const mockProfile: UserProfile = {
        id: 'user_demo_123',
        display_name: name || email.split('@')[0],
        credits: cachedCredits,
        xp: 0,
        level: 1,
      };

      setUser(mockUser);
      setSession(mockSession);
      setProfile(mockProfile);

      try {
        localStorage.setItem(
          DEMO_AUTH_STORAGE_KEY,
          JSON.stringify({ user: mockUser, session: mockSession, profile: mockProfile })
        );
      } catch {}

      return { success: true };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: name || email.split('@')[0],
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        await refreshProfile();
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erro ao realizar cadastro.' };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      const mockUser = {
        id: 'user_demo_123',
        email,
        app_metadata: {},
        user_metadata: { display_name: email.split('@')[0] },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as User;

      const mockSession = {
        access_token: 'mock_token',
        token_type: 'bearer',
        user: mockUser,
      } as unknown as Session;

      const cachedCredits = getDashboardUser().credits ?? 200;
      const mockProfile: UserProfile = {
        id: 'user_demo_123',
        display_name: email.split('@')[0],
        credits: cachedCredits,
        xp: 0,
        level: 1,
      };

      setUser(mockUser);
      setSession(mockSession);
      setProfile(mockProfile);

      try {
        localStorage.setItem(
          DEMO_AUTH_STORAGE_KEY,
          JSON.stringify({ user: mockUser, session: mockSession, profile: mockProfile })
        );
      } catch {}

      return { success: true };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        await refreshProfile();
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erro ao realizar login.' };
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut().catch(() => {});
    }
    try {
      localStorage.removeItem(DEMO_AUTH_STORAGE_KEY);
      logoutDashboardUser();
    } catch {}
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isConfigured: isSupabaseConfigured,
        signUp,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

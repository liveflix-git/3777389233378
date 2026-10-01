import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  rawUrl && rawUrl.startsWith('http') && rawKey && rawKey.length > 10
);

// Fallback to valid URL structure if VITE_SUPABASE_URL is empty so createClient doesn't throw 'supabaseUrl is required'
const supabaseUrl = isSupabaseConfigured ? rawUrl : 'https://placeholder.supabase.co';
const supabaseAnonKey = isSupabaseConfigured ? rawKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder';

if (!isSupabaseConfigured) {
  console.warn(
    '[Supabase] VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não estão configuradas nas variáveis de ambiente. Configure na Cloudflare/Vite para habilitar login remoto.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

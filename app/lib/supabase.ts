import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.warn('Supabase URL not configured. Auth will not work properly.');
  }
  
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
}

export const supabase = {
  get client() {
    return getSupabaseClient();
  },
  auth: {
    getSession: async () => {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        return { data: { session: null }, error: null };
      }
      return getSupabaseClient().auth.getSession();
    },
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        return { data: { subscription: { unsubscribe: () => {} } }, error: null };
      }
      return getSupabaseClient().auth.onAuthStateChange(callback);
    },
    signInWithPassword: async (credentials: { email: string; password: string }) => {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        return { data: { user: null, session: null }, error: new Error('Supabase not configured') };
      }
      return getSupabaseClient().auth.signInWithPassword(credentials);
    },
    signUp: async (credentials: { email: string; password: string }) => {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        return { data: { user: null, session: null }, error: new Error('Supabase not configured') };
      }
      return getSupabaseClient().auth.signUp(credentials);
    },
    signOut: async () => {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        return { error: null };
      }
      return getSupabaseClient().auth.signOut();
    },
  },
};

export interface UserProfile {
  id: string;
  email: string;
  is_premium: boolean;
  premium_tier: 'none' | 'legend' | 'full';
  premium_expires_at: string | null;
  created_at: string;
}

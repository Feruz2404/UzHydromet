import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Frontend reads ONLY public Supabase env (anon key + URL). The server-side
// admin API uses SUPABASE_SERVICE_ROLE_KEY and never exposes it to the browser.
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL ?? '').trim()
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim()

// Export `null` when not configured so the app keeps rendering with static
// fallback content. Surface a clear console warning so the missing var is
// easy to diagnose during local dev or on Vercel preview deploys.
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

if (!supabase && typeof console !== 'undefined') {
  const missing: string[] = []
  if (!supabaseUrl) missing.push('VITE_SUPABASE_URL')
  if (!supabaseAnonKey) missing.push('VITE_SUPABASE_ANON_KEY')
  console.warn(
    '[supabaseClient] Supabase is not configured. Missing env: ' +
      missing.join(', ') +
      '. Set these in Vercel → Project Settings → Environment Variables ' +
      '(or in a local .env file). The site will fall back to static content ' +
      'until configured.'
  )
}

export function isSupabaseConfigured(): boolean {
  return supabase !== null
}

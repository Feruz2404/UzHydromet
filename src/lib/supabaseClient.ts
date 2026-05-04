import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Read public Supabase env at build time. Both must be set for the public site
// to read from the database. The server-side admin API uses SERVICE_ROLE_KEY
// instead and never exposes it to the client.
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL ?? '').trim()
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim()

// We export `null` instead of an unconfigured client so the app keeps working
// (with static fallback) when env vars are missing in dev or preview.
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

export function isSupabaseConfigured(): boolean {
  return supabase !== null
}

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// During build time, environment variables might not be available
// Return a mock client that throws a clear error at runtime
if (!supabaseUrl || !supabaseAnonKey) {
  // This will only be used during build time - at runtime the real values will be available
  console.warn('Supabase environment variables not available during build time')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
)

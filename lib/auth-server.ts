import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from './supabase-server'

// ─── requireAuth — use only in Server Components / Route Handlers ─────────────

export async function requireAuth() {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')
  return user
}

// ─── getCurrentUserServer — returns null instead of redirecting ───────────────

export async function getCurrentUserServer() {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user ?? null
}

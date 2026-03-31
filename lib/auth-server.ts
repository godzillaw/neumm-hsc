import { redirect }                  from 'next/navigation'
import { createSupabaseServerClient } from './supabase-server'
import type { User }                  from '@supabase/supabase-js'

/**
 * Server-side auth guard.
 * Call at the top of any Server Component or Server Action that requires
 * an authenticated user.  Redirects to /auth/login if the session is missing.
 */
export async function requireAuth(): Promise<User> {
  const supabase = createSupabaseServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/auth/login')
  }

  return user
}

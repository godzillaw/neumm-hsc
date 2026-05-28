import { NextResponse }                from 'next/server'
import { createSupabaseServerClient }  from '@/lib/supabase-server'

/**
 * POST /api/privacy/delete-account
 *
 * Marks the user account for deletion (soft delete — actual deletion happens
 * after 30 days via process-deletions script).
 */
export async function POST() {
  try {
    const supabase = createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const { error } = await supabase
      .from('users')
      .update({
        deletion_requested:    true,
        deletion_requested_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (error) {
      console.error('[delete-account] update failed:', error.message)
      return NextResponse.json({ error: 'Failed to request deletion.' }, { status: 500 })
    }

    // Sign out the user
    await supabase.auth.signOut()

    console.log('[delete-account] queued for deletion:', user.id, user.email)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[privacy/delete-account]', err)
    return NextResponse.json({ error: 'Request failed' }, { status: 500 })
  }
}

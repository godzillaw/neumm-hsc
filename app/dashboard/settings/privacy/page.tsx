import type { Metadata }              from 'next'
import { requireAuth }                 from '@/lib/auth-server'
import { createSupabaseServerClient }  from '@/lib/supabase-server'
import PrivacyControls                 from './PrivacyControls'

export const metadata: Metadata = {
  title: 'Privacy Settings — Neumm',
  description: 'Manage your privacy preferences on Neumm.',
}

export default async function PrivacySettingsPage() {
  const user    = await requireAuth()
  const supabase = createSupabaseServerClient()

  const { data } = await supabase
    .from('users')
    .select('leaderboard_visible, is_minor, terms_version, terms_accepted_at, privacy_version, privacy_accepted_at')
    .eq('id', user.id)
    .single()

  const row = data as {
    leaderboard_visible?:  boolean | null
    is_minor?:             boolean | null
    terms_version?:        string | null
    terms_accepted_at?:    string | null
    privacy_version?:      string | null
    privacy_accepted_at?:  string | null
  } | null

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", maxWidth: 640, padding: '32px 24px' }}>
      <h1 style={{ color: '#006D77', fontSize: 26, fontWeight: 900, marginBottom: 6, marginTop: 0 }}>
        Privacy Settings
      </h1>
      <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 36, lineHeight: 1.6 }}>
        Manage your privacy preferences. Your rights under the Australian Privacy Act 1988.
      </p>

      <PrivacyControls
        userId={user.id}
        leaderboardVisible={row?.leaderboard_visible ?? true}
        isMinor={row?.is_minor ?? false}
        termsVersion={row?.terms_version ?? null}
        termsAcceptedAt={row?.terms_accepted_at ?? null}
        privacyVersion={row?.privacy_version ?? null}
        privacyAcceptedAt={row?.privacy_accepted_at ?? null}
      />
    </div>
  )
}

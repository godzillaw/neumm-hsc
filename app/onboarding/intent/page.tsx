import { redirect } from 'next/navigation'

// Intent selection step has been removed from onboarding.
// Any cached or bookmarked links land here → forward to year selection.
export default function IntentPage() {
  redirect('/onboarding/year')
}

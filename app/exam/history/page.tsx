import { requireAuth }        from '@/lib/auth-server'
import { getMockTestHistory }  from '../mock-actions'
import AppSidebar              from '@/components/AppSidebar'
import MobileBottomNav         from '@/components/MobileBottomNav'
import MockTestHistoryView     from './MockTestHistoryView'

export default async function HistoryPage() {
  await requireAuth()
  const history = await getMockTestHistory()

  return (
    <div className="flex min-h-screen" style={{ background: '#F7F3FF' }}>
      <AppSidebar />
      <div className="flex-1 min-w-0 pb-20 md:pb-0">
        <MockTestHistoryView history={history} />
      </div>
      <MobileBottomNav />
    </div>
  )
}

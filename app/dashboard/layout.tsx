import AppSidebar from '@/components/AppSidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F4F6FA]">
      <AppSidebar />
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  )
}

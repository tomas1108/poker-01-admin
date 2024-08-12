import { MobileHeader } from '@/components/mobile-header'
import { Sidebar } from '@/components/sidebar'

type Props = {
  children: React.ReactNode
}

const MainLayout = ({ children }: Props) => {
  return (
    <>
      <MobileHeader />
      <Sidebar className="hidden lg:flex" />
      <main className="pt-50 h-full pt-10 lg:pl-[256px] lg:pt-0">
        <div className="h-full w-full pt-6">{children}</div>
      </main>
    </>
  )
}

export default MainLayout

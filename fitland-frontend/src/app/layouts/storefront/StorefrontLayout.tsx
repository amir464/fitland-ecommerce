import { Outlet } from 'react-router'

import { AnnouncementBar } from '@/widgets/announcement-bar/AnnouncementBar'
import { SiteFooter } from '@/widgets/site-footer/SiteFooter'
import { SiteHeader } from '@/widgets/site-header/SiteHeader'

export function StorefrontLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[60] -translate-y-24 bg-fitland-lime px-4 py-3 font-bold text-fitland-charcoal transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <AnnouncementBar />
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}

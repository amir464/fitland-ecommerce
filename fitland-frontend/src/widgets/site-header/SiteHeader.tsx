import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import { Container, IconButton, Typography } from '@mui/material'
import { useState } from 'react'
import { Link } from 'react-router'

import { CartHeaderAction } from '@/widgets/site-header/CartHeaderAction'
import { DesktopNavigation } from '@/widgets/site-header/DesktopNavigation'
import { HeaderActions } from '@/widgets/site-header/HeaderActions'
import { MobileNavigationDrawer } from '@/widgets/site-header/MobileNavigationDrawer'

export function SiteHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-black/10 bg-fitland-canvas/95 backdrop-blur-sm">
        <Container className="grid min-h-16 grid-cols-[1fr_auto_1fr] items-center gap-4 lg:grid-cols-[auto_1fr_auto] lg:gap-12">
          <Typography
            component={Link}
            to="/"
            aria-label="FitLand home"
            color="text.primary"
            sx={{
              width: 'fit-content',
              fontSize: '1.35rem',
              fontWeight: 900,
              letterSpacing: '0.08em',
              textDecoration: 'none',
            }}
          >
            FITLAND
          </Typography>
          <DesktopNavigation />
          <div className="flex items-center justify-self-end lg:hidden">
            <CartHeaderAction />
            <IconButton
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
            >
              <MenuRoundedIcon />
            </IconButton>
          </div>
          <HeaderActions />
        </Container>
      </header>
      <MobileNavigationDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  )
}

import { Container, Typography } from '@mui/material'
import { Link } from 'react-router'

import { footerNavigation } from '@/shared/config/navigation'

export function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-fitland-charcoal text-white">
      <Container className="py-12 sm:py-16">
        <div className="grid gap-12 border-b border-white/15 pb-12 sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <section className="min-w-0" aria-labelledby="footer-brand">
            <Typography
              id="footer-brand"
              component="h2"
              color="inherit"
              sx={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '0.08em' }}
            >
              FITLAND
            </Typography>
            <Typography
              color="inherit"
              className="mt-4 max-w-sm opacity-70"
              sx={{ lineHeight: 1.7 }}
            >
              Premium sportswear engineered for movement, recovery, and everything
              between.
            </Typography>
          </section>

          <nav
            aria-label="Footer navigation"
            className="grid min-w-0"
          >
            {Object.entries(footerNavigation).map(([group, items]) => (
              <section key={group} aria-labelledby={`footer-${group.toLowerCase()}`}>
                <Typography
                  id={`footer-${group.toLowerCase()}`}
                  component="h2"
                  color="inherit"
                  sx={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.12em' }}
                >
                  {group.toUpperCase()}
                </Typography>
                <ul className="mt-4 space-y-3">
                  {items.map((item) => (
                    <li key={item.label}>
                      <Link
                        to={item.to}
                        className="text-sm text-white/65 transition-colors hover:text-white focus-visible:text-white"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </nav>

        </div>

        <div className="pt-6 text-white/60">
          <Typography variant="caption" color="inherit">
            &copy; {currentYear} FitLand Store
          </Typography>
        </div>
      </Container>
    </footer>
  )
}

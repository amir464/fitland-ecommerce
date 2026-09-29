import { NavLink } from 'react-router'

import { primaryNavigation } from '@/shared/config/navigation'

export function DesktopNavigation() {
  return (
    <nav aria-label="Primary navigation" className="hidden lg:block">
      <ul className="flex items-center gap-7">
        {primaryNavigation.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                [
                  'relative py-2 text-sm font-semibold tracking-wide text-fitland-charcoal',
                  'after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left',
                  'after:bg-fitland-lime after:transition-transform',
                  isActive
                    ? 'after:scale-x-100'
                    : 'after:scale-x-0 hover:after:scale-x-100',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

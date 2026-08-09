export type NavigationItem = {
  label: string
  to: string
}

export const primaryNavigation: readonly NavigationItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
]

export const accountNavigation: readonly NavigationItem[] = [
  { label: 'Account', to: '/account' },
  { label: 'Cart', to: '/cart' },
]

export const footerNavigation = {
  Shop: [
    { label: 'New arrivals', to: '/shop' },
    { label: 'Cart', to: '/cart' },
    { label: 'Account', to: '/account' },
  ],
} as const

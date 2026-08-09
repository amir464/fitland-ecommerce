import { Container, Typography } from '@mui/material'

export function AnnouncementBar() {
  return (
    <aside aria-label="Store announcement" className="bg-fitland-charcoal text-white">
      <Container className="flex min-h-8 items-center justify-center gap-4 py-1 text-center sm:justify-between">
        <Typography variant="caption" color="inherit" sx={{ fontWeight: 700 }}>
          Free shipping on orders over $150
        </Typography>
        <Typography
          variant="caption"
          color="inherit"
          className="hidden opacity-70 sm:block"
        >
          Designed for movement. Built for everyday performance.
        </Typography>
      </Container>
    </aside>
  )
}

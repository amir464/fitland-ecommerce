import { Container, Typography } from '@mui/material'

type PagePlaceholderProps = {
  eyebrow: string
  title: string
  description: string
}

export function PagePlaceholder({
  eyebrow,
  title,
  description,
}: PagePlaceholderProps) {
  return (
    <Container component="section" className="py-20 sm:py-28 lg:py-36">
      <div className="max-w-3xl">
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ fontWeight: 700, letterSpacing: '0.16em' }}
        >
          {eyebrow}
        </Typography>
        <Typography component="h1" variant="h2" className="mt-3">
          {title}
        </Typography>
        <Typography
          color="text.secondary"
          className="mt-5"
          sx={{ maxWidth: 620, fontSize: { xs: '1rem', sm: '1.125rem' }, lineHeight: 1.7 }}
        >
          {description}
        </Typography>
      </div>
    </Container>
  )
}

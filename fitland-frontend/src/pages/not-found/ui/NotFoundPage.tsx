import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import { Button, Container, Stack, Typography } from '@mui/material'
import { Link } from 'react-router'

export function Component() {
  return (
    <Container component="section" className="grid min-h-[55vh] place-items-center py-16">
      <Stack spacing={3} sx={{ alignItems: 'flex-start', maxWidth: 620 }}>
        <Typography
          aria-hidden="true"
          color="secondary.main"
          sx={{
            fontSize: { xs: '6rem', sm: '10rem' },
            fontWeight: 800,
            lineHeight: 0.8,
          }}
        >
          404
        </Typography>
        <Typography component="h1" variant="h2">
          This route missed the finish line.
        </Typography>
        <Typography color="text.secondary">
          The page you requested does not exist in FitLand Store.
        </Typography>
        <Button
          component={Link}
          to="/"
          variant="contained"
          startIcon={<ArrowBackRoundedIcon />}
        >
          Back to foundation
        </Button>
      </Stack>
    </Container>
  )
}

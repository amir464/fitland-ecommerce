import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { Button, Container, Typography } from '@mui/material'
import { Link } from 'react-router'

export function Component() {
  return (
    <section className="relative overflow-hidden border-b border-black/10">
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-24 h-64 w-64 rotate-12 bg-fitland-lime sm:h-80 sm:w-80 lg:right-8 lg:top-10"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-[18%] hidden h-24 w-24 border-[16px] border-fitland-charcoal/10 md:block"
      />
      <Container className="relative py-20 sm:py-24 lg:py-28">
        <div className="max-w-3xl">
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ fontWeight: 800, letterSpacing: '0.18em' }}
          >
            FITLAND PERFORMANCE
          </Typography>
          <Typography component="h1" variant="h1" className="mt-4">
            Movement
            <br />
            starts here.
          </Typography>
          <Typography
            color="text.secondary"
            className="mt-7"
            sx={{
              maxWidth: 590,
              fontSize: { xs: '1.05rem', sm: '1.25rem' },
              lineHeight: 1.65,
            }}
          >
            Purpose-built sportswear that moves through training, recovery, and
            everyday life with you.
          </Typography>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button
              component={Link}
              to="/shop"
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
            >
              Shop new arrivals
            </Button>
            <Button component={Link} to="/shop" variant="outlined">
              Explore the shop
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}

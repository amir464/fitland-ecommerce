import { Card, CardContent, Skeleton, Stack } from '@mui/material'

export function ProductCardSkeleton() {
  return (
    <Card
      className="flex h-full w-full min-w-0 flex-col overflow-hidden"
      sx={{ borderRadius: 1.5 }}
    >
      <Skeleton className="aspect-[4/5] h-auto w-full" variant="rectangular" />
      <CardContent className="flex flex-1 flex-col p-3 sm:p-5">
        <Skeleton className="min-h-[2.6em]" width="45%" />
        <Skeleton className="mt-2 min-h-[2.6em]" width="82%" />
        <Stack className="mt-2 min-h-[3.1em]" spacing={0.5}>
          <Skeleton />
          <Skeleton width="92%" />
        </Stack>
        <Stack className="mt-auto pt-4" spacing={1.5}>
          <Skeleton className="min-h-11 sm:min-h-6" width="58%" />
          <Stack className="min-h-12 flex-wrap sm:min-h-7" direction="row" spacing={1}>
            <Skeleton height={28} width={72} />
            <Skeleton height={24} width={58} />
          </Stack>
          <Skeleton height={22} width={92} />
        </Stack>
      </CardContent>
    </Card>
  )
}

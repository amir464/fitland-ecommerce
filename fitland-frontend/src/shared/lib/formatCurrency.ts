const currencyFormatters = new Map<string, Intl.NumberFormat>()

export function formatCurrency(
  amount: number,
  currency = 'USD',
): string {
  if (!Number.isFinite(amount)) {
    return ''
  }

  let formatter = currencyFormatters.get(currency)

  if (!formatter) {
    try {
      formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
      })
    } catch {
      formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      })
    }

    currencyFormatters.set(currency, formatter)
  }

  return formatter.format(amount)
}

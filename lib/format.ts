const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const compactCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})

export function formatMoney(value: number): string {
  return currency.format(Math.round(value))
}

/** Rounds to a friendly "about" number: $342,871 becomes $343,000. */
export function formatApprox(value: number): string {
  const magnitude = value >= 100_000 ? 1000 : value >= 10_000 ? 100 : 10
  return currency.format(Math.round(value / magnitude) * magnitude)
}

export function formatCompact(value: number): string {
  return compactCurrency.format(value)
}

export function formatPercent(fraction: number, digits = 2): string {
  return `${(fraction * 100).toFixed(digits)}%`
}

export function formatMonth(month: string): string {
  const [y, m] = month.split('-').map(Number)
  if (!y || !m) return month
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })
}

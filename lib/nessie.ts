import 'server-only'

const BASE_URL = 'http://api.nessieisreal.com'
const TIMEOUT_MS = 5000

export function hasNessieKey(): boolean {
  return Boolean(process.env.NESSIE_API_KEY)
}

export async function nessieFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const key = process.env.NESSIE_API_KEY
  if (!key) throw new Error('NESSIE_API_KEY is not set')
  const separator = path.includes('?') ? '&' : '?'
  const res = await fetch(`${BASE_URL}${path}${separator}key=${encodeURIComponent(key)}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...init?.headers },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Nessie ${res.status} on ${path}`)
  return (await res.json()) as T
}

export interface NessieAccount {
  _id: string
  type: string
  nickname?: string
  balance?: number
}

export interface NessieTransaction {
  amount: number
  transaction_date?: string
  purchase_date?: string
  status?: string
}

export function isSafeId(id: string): boolean {
  return /^[a-zA-Z0-9-]{1,64}$/.test(id)
}

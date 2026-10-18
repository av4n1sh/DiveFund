import mockCustomers from '@/data/mock/customers.json'
import { hasNessieKey, nessieFetch } from '@/lib/nessie'
import type { NessieCustomer } from '@/lib/types'

export async function GET() {
  if (!hasNessieKey()) {
    return Response.json({ customers: mockCustomers, mocked: true })
  }
  try {
    const customers = await nessieFetch<NessieCustomer[]>('/customers')
    if (!Array.isArray(customers) || customers.length === 0) {
      return Response.json({ customers: mockCustomers, mocked: true })
    }
    const trimmed = customers.slice(0, 8).map(({ _id, first_name, last_name }) => ({ _id, first_name, last_name }))
    return Response.json({ customers: trimmed, mocked: false })
  } catch (error) {
    console.error('[nessie] customers failed:', error)
    return Response.json({ customers: mockCustomers, mocked: true })
  }
}

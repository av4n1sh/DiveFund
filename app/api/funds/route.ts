import { FUNDS } from '@/lib/funds'

export function GET() {
  return Response.json(FUNDS)
}

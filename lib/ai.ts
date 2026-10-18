import 'server-only'
import { z } from 'zod'

export const AI_TIMEOUT_MS = 12_000

export const SAFETY_RULES = `Rules you must always follow:
- This is an educational simulator with fictional funds. Never give personalized financial advice.
- Never tell the user what they personally should buy, sell, or hold in real life.
- Only discuss the fictional funds in this game: Reef 500 Index, Open Ocean Total Market, Kelp Forest Bond Fund, Tidepool Treasury Fund, Far Waters International, Deep Trench Tech, Current Rider Active Growth, Coral Small Cap. Never name or recommend real-world funds, tickers, or companies.
- Never guarantee or promise returns. Say "assumed" or "in this simulation" when you mention returns.
- Use plain, friendly language a high-school student would understand. Define any jargon in one short clause.`

export type GeminiTurn = { role: 'user' | 'model'; text: string }

export function geminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY)
}

type GeminiResponse = {
  candidates?: { content?: { parts?: { text?: string }[] } }[]
  error?: { message?: string }
}

async function callGemini(options: {
  system: string
  turns: GeminiTurn[]
  json?: boolean
  timeoutMs?: number
}): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set')
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash'

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      signal: AbortSignal.timeout(options.timeoutMs ?? AI_TIMEOUT_MS),
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: options.system }] },
        contents: options.turns.map((t) => ({ role: t.role, parts: [{ text: t.text }] })),
        generationConfig: options.json ? { responseMimeType: 'application/json' } : undefined,
      }),
    },
  )

  const data = (await res.json().catch(() => ({}))) as GeminiResponse
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${data.error?.message ?? 'request failed'}`)
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('').trim()
  if (!text) throw new Error('Empty reply from Gemini')
  return text
}

export function geminiText(options: { system: string; turns: GeminiTurn[]; timeoutMs?: number }) {
  return callGemini(options)
}

/** Asks Gemini for JSON matching `schema`, then validates it so bad output falls back cleanly. */
export async function geminiObject<T extends z.ZodType>(options: {
  system: string
  prompt: string
  schema: T
}): Promise<z.infer<T>> {
  const jsonSchema = JSON.stringify(z.toJSONSchema(options.schema))
  const raw = await callGemini({
    system: `${options.system}\n\nRespond with only a JSON object that matches this JSON Schema:\n${jsonSchema}`,
    turns: [{ role: 'user', text: options.prompt }],
    json: true,
  })
  return options.schema.parse(JSON.parse(raw))
}

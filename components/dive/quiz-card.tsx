'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Loader2, X } from 'lucide-react'
import { useGame } from '@/components/game-provider'
import { Button, buttonVariants } from '@/components/ui/button'
import { LevelUpDialog } from '@/components/dive/level-up-dialog'
import { postJson, useGuideContext } from '@/hooks/use-guide-context'
import { MAX_LEVEL } from '@/data/levels'
import type { RewardEvents } from '@/lib/game'
import { cn } from '@/lib/utils'

interface Question {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

const PASS_SCORE = 2

export function QuizCard({
  level,
  guideName = 'Atlas',
}: {
  level: number
  guideName?: string
}) {
  const { state, passQuiz } = useGame()
  const context = useGuideContext(level)
  const [questions, setQuestions] = useState<Question[] | null>(null)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [reward, setReward] = useState<RewardEvents | null>(null)

  const passed = state.passedQuizzes.includes(level)
  const lockedIn = (state.lockInsByLevel[level] ?? 0) > 0
  const score = questions ? questions.filter((q, i) => answers[i] === q.correctIndex).length : 0

  async function start() {
    setLoading(true)
    setSubmitted(false)
    try {
      const data = await postJson<{ questions: Question[] }>(['/api/guide/quiz', context])
      setQuestions(data.questions)
      setAnswers(data.questions.map(() => null))
    } finally {
      setLoading(false)
    }
  }

  function submit() {
    setSubmitted(true)
    if (score >= PASS_SCORE) {
      const events = passQuiz(level)
      setReward(events)
    }
  }

  if (passed && !questions) {
    return (
      <section className="flex flex-col gap-3 rounded-3xl bg-card p-5">
        <h2 className="font-heading font-semibold">Depth check cleared</h2>
        {level < MAX_LEVEL ? (
          <Link href={`/dive/${level + 1}`} className={cn(buttonVariants({ size: 'lg' }), 'h-12 rounded-full text-base')}>
            Descend to depth {level + 1}
          </Link>
        ) : (
          <Link href="/summary" className={cn(buttonVariants({ size: 'lg' }), 'h-12 rounded-full text-base')}>
            Surface and see your log
          </Link>
        )}
      </section>
    )
  }

  return (
    <section aria-labelledby="quiz-heading" className="flex flex-col gap-4 rounded-3xl bg-card p-5">
      <div className="flex flex-col gap-1">
        <h2 id="quiz-heading" className="font-heading font-semibold">
          Depth check
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Get {PASS_SCORE} of 3 right to descend. {guideName} writes questions about your own mix.
        </p>
      </div>

      {!questions ? (
        <Button
          variant="secondary"
          size="lg"
          className="h-12 rounded-full text-base"
          onClick={start}
          disabled={!lockedIn || loading}
        >
          {loading && <Loader2 className="size-5 animate-spin" aria-hidden="true" />}
          {lockedIn ? (loading ? 'Writing questions…' : 'Take the depth check') : 'Lock in once to unlock'}
        </Button>
      ) : (
        <form
          className="flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
        >
          {questions.map((q, qi) => (
            <fieldset key={qi} className="flex flex-col gap-2">
              <legend className="mb-2 text-pretty font-medium leading-relaxed">
                {qi + 1}. {q.question}
              </legend>
              {q.options.map((opt, oi) => {
                const chosen = answers[qi] === oi
                const correct = q.correctIndex === oi
                return (
                  <label
                    key={oi}
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-sm transition-colors',
                      !submitted && chosen && 'border-primary bg-accent',
                      !submitted && !chosen && 'border-border bg-secondary hover:bg-accent',
                      submitted && correct && 'border-chart-1 bg-chart-1/15',
                      submitted && chosen && !correct && 'border-destructive bg-destructive/15',
                      submitted && !chosen && !correct && 'border-border bg-secondary opacity-70',
                    )}
                  >
                    <input
                      type="radio"
                      name={`q-${qi}`}
                      className="sr-only"
                      checked={chosen}
                      disabled={submitted}
                      onChange={() => setAnswers((a) => a.map((v, i) => (i === qi ? oi : v)))}
                    />
                    <span className="flex-1">{opt}</span>
                    {submitted && correct && <Check className="size-4" aria-label="Correct answer" />}
                    {submitted && chosen && !correct && <X className="size-4" aria-label="Your answer" />}
                  </label>
                )
              })}
              {submitted && <p className="text-sm leading-relaxed text-muted-foreground">{q.explanation}</p>}
            </fieldset>
          ))}

          {!submitted ? (
            <Button type="submit" size="lg" className="h-12 rounded-full text-base" disabled={answers.some((a) => a === null)}>
              Check answers
            </Button>
          ) : score >= PASS_SCORE ? (
            <div className="flex flex-col gap-2" role="status">
              <p className="font-heading text-lg font-semibold">
                {score}/3 — cleared!
              </p>
              <Link
                href={level < MAX_LEVEL ? `/dive/${level + 1}` : '/summary'}
                className={cn(buttonVariants({ size: 'lg' }), 'h-12 rounded-full text-base')}
              >
                {level < MAX_LEVEL ? `Descend to depth ${level + 1}` : 'Surface and see your log'}
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2" role="status">
              <p className="font-heading text-lg font-semibold">{score}/3 — not quite.</p>
              <Button variant="secondary" size="lg" className="h-12 rounded-full text-base" onClick={start} type="button">
                Try new questions
              </Button>
            </div>
          )}
        </form>
      )}

      <LevelUpDialog events={reward} level={level} onClose={() => setReward(null)} />
    </section>
  )
}

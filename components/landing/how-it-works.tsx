import Image from 'next/image'

const STEPS = [
  {
    image: '/images/step-connect.png',
    title: 'Connect a practice account',
    body: 'We review a sample bank ledger to see what you can comfortably set aside each month. No real money ever moves.',
  },
  {
    image: '/images/step-learn.png',
    title: 'Learn one concept per depth',
    body: 'Each depth introduces a single principle—index baskets, bond ballast, expense ratios—tested on your own numbers.',
  },
  {
    image: '/images/step-dive.png',
    title: 'Pass the depth check',
    body: 'Complete a short check tailored to your allocation choices to unlock deeper funds and continue your descent.',
  },
]

export function HowItWorks() {
  return (
    <section aria-labelledby="how-heading" className="bg-surface py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4">
        <h2 id="how-heading" className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
          How a DiveFund dive works
        </h2>
        <ol className="grid gap-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <li key={step.title} className="flex flex-col gap-4">
              <div className="relative flex w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/80 p-3">
                <Image
                  src={step.image}
                  alt={step.title}
                  width={640}
                  height={360}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="w-full h-auto object-contain max-h-[400px] aspect-video rounded-xl"
                />
              </div>
              <h3 className="font-heading text-xl font-semibold">{step.title}</h3>
              <p className="leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

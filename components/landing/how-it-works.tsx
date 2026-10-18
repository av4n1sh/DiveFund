import Image from 'next/image'

const STEPS = [
  {
    image: '/images/step-connect.png',
    title: 'Connect a practice account',
    body: 'We look at a demo bank account to find what you could set aside each month. No real money moves.',
  },
  {
    image: '/images/step-learn.png',
    title: 'Learn one idea per depth',
    body: 'Each level teaches a single concept in plain words, then lets you try it on your own mix of funds.',
  },
  {
    image: '/images/step-dive.png',
    title: 'Pass the depth check',
    body: 'A short quiz written around your choices. Pass it to unlock new funds and dive deeper.',
  },
]

export function HowItWorks() {
  return (
    <section aria-labelledby="how-heading" className="bg-surface py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4">
        <h2 id="how-heading" className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
          How a dive works
        </h2>
        <ol className="grid gap-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <li key={step.title} className="flex flex-col gap-4">
              <Image
                src={step.image}
                alt=""
                width={512}
                height={512}
                className="aspect-[4/3] w-full rounded-2xl object-cover"
              />
              <h3 className="font-heading text-xl font-semibold">{step.title}</h3>
              <p className="leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

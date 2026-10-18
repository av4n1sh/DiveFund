import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Inter } from 'next/font/google'
import { AudioProvider } from '@/components/audio/AudioSystem'
import { GameProvider } from '@/components/game-provider'
import { GuideStateProvider } from '@/components/guide/guide-provider'
import { RouteTransitionProvider } from '@/components/route-transition'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage' })

export const metadata: Metadata = {
  title: 'DiveFund — Deep-Sea Financial Exploration',
  description: 'A guided maritime simulation that teaches how long-term ETF investing works.',
  icons: {
    icon: [{ url: '/images/divefund-logo.png', type: 'image/png' }],
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0f2537',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${bricolage.variable} bg-background`}>
      <body className="antialiased">
        <AudioProvider>
          <GameProvider>
            <GuideStateProvider>
              <RouteTransitionProvider>{children}</RouteTransitionProvider>
            </GuideStateProvider>
          </GameProvider>
        </AudioProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  )
}

import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Inter } from 'next/font/google'
import { GameProvider } from '@/components/game-provider'
import { GuideStateProvider } from '@/components/guide/guide-provider'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage' })

export const metadata: Metadata = {
  title: 'DiveFund',
  description: 'A beginner-friendly game that teaches how ETF investing works.',
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0f3550',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${bricolage.variable} bg-background`}>
      <body className="antialiased">
        <GameProvider>
          <GuideStateProvider>{children}</GuideStateProvider>
        </GameProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  )
}

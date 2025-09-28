import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Portfolio Personal - Desarrollador Full Stack',
  description: 'Portafolio profesional de desarrollador Full Stack especializado en React, Next.js, Node.js y Python. Creando experiencias web modernas y escalables.',
  keywords: 'desarrollador, full stack, react, nextjs, nodejs, python, portfolio, web developer',
  authors: [{ name: 'Portfolio Personal' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-background text-foreground">
          {children}
        </div>
      </body>
    </html>
  )
}

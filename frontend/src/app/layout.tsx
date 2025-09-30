import '@/styles/globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Portfolio Personal - Desarrollador Full Stack',
    template: '%s | Portfolio Personal'
  },
  description: 'Portafolio profesional de desarrollador Full Stack especializado en React, Next.js, Node.js y Python. Creando experiencias web modernas y escalables.',
  keywords: ['desarrollador', 'full stack', 'react', 'nextjs', 'nodejs', 'python', 'portfolio', 'web developer'],
  authors: [{ name: 'Portfolio Personal' }],
  creator: 'Portfolio Personal',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://tu-dominio.com',
    title: 'Portfolio Personal - Desarrollador Full Stack',
    description: 'Portafolio profesional de desarrollador Full Stack especializado en React, Next.js, Node.js y Python.',
    siteName: 'Portfolio Personal',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio Personal - Desarrollador Full Stack',
    description: 'Portafolio profesional de desarrollador Full Stack especializado en React, Next.js, Node.js y Python.',
    creator: '@tu_usuario',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
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
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}

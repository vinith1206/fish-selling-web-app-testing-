import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import Navbar from '@/components/Navbar'
import WhatsAppButton from '@/components/WhatsAppButton'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AquaCatch - Live Aquarium Fish Store',
  description: 'Premium live aquarium fish delivered to your doorstep. Fresh, healthy fish for your aquarium.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pb-20">
              {children}
            </main>
            <WhatsAppButton />
          </div>
        </CartProvider>
      </body>
    </html>
  )
}
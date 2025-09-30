import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/contexts/CartContext';
import Header from '@/components/Header';
import FloatingActions from '@/components/FloatingActions';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FreshCatch - Fresh Fish Delivered Daily',
  description: 'Premium quality fresh fish delivered to your doorstep. Order now for same-day delivery!',
  keywords: 'fresh fish, seafood, delivery, online fish market, premium fish',
  authors: [{ name: 'FreshCatch Team' }],
  openGraph: {
    title: 'FreshCatch - Fresh Fish Delivered Daily',
    description: 'Premium quality fresh fish delivered to your doorstep. Order now for same-day delivery!',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="pb-20">
              {children}
            </main>
            <FloatingActions />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}

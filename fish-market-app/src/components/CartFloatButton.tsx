'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function CartFloatButton({ className = '' }: { className?: string }) {
  const { state } = useCart();
  const count = state.itemCount;

  if (typeof window !== 'undefined') {
    // no-op, required for client
  }

  return (
    <Link
      href="/cart"
      className={`bg-[#1E90FF] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-[50] group ${className}`}
      aria-label="Go to Cart"
    >
      <div className="relative">
        <ShoppingCart className="h-6 w-6" />
        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5 min-w-[1.25rem] text-center">
            {count}
          </span>
        )}
      </div>
      <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        View cart
        <span className="absolute right-0 top-1/2 translate-x-1 -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent"></span>
      </span>
    </Link>
  );
}




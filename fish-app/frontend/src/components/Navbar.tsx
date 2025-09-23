'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Fish } from 'lucide-react';

export default function Navbar() {
  const { state } = useCart();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-to-br from-[#1E90FF] to-[#0EA5E9] rounded-xl group-hover:scale-105 transition-transform duration-200">
              <Fish className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">AquaCatch</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-[#1E90FF] transition-colors duration-200 font-medium">
              Home
            </Link>
            <Link href="/cart" className="text-gray-700 hover:text-[#1E90FF] transition-colors duration-200 font-medium">
              Cart
            </Link>
            <Link href="#contact" className="text-gray-700 hover:text-[#1E90FF] transition-colors duration-200 font-medium">
              Contact
            </Link>
            <Link href="/admin" className="text-gray-500 hover:text-[#1E90FF] transition-colors duration-200 text-sm">
              Admin
            </Link>
          </div>

          {/* Floating Cart Button */}
          <Link href="/cart" className="relative group">
            <div className="bg-gradient-to-r from-[#1E90FF] to-[#0EA5E9] text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-105">
              <ShoppingCart className="h-6 w-6" />
            </div>
            {state.itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#22C55E] text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
                {state.itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}


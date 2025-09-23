'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import Logo from './Logo';

const Header = () => {
  const { state } = useCart();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Categories', href: '/categories' },
    { name: 'Pincode Check', href: '/pincode-check' },
    { name: 'Cart', href: '/cart' },
    { name: 'Tank Calculator', href: '/tank-calculator' },
    { name: 'Admin', href: '/admin/login' },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  pathname === item.href
                    ? 'text-[#1E90FF] bg-blue-50'
                    : 'text-gray-700 hover:text-[#1E90FF] hover:bg-blue-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative p-2 text-gray-700 hover:text-[#1E90FF] transition-colors duration-200 group"
          >
            <ShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
            {state.itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#22C55E] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-bounce-slow">
                {state.itemCount}
              </span>
            )}
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-[#1E90FF] transition-colors duration-200"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 animate-fade-in-up">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    pathname === item.href
                      ? 'text-[#1E90FF] bg-blue-50'
                      : 'text-gray-700 hover:text-[#1E90FF] hover:bg-blue-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

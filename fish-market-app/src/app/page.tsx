'use client';

import { useEffect, useState } from 'react';
import type { Fish } from '@/types';
import FishCard from '@/components/FishCard';
import AnimatedFish from '@/components/AnimatedFish';
import Logo from '@/components/Logo';

interface HomepageContent {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  trendingTitle: string;
  featuredTitle: string;
  saleTitle: string;
  allProductsTitle: string;
  updatedAt: string;
}

export default function Home() {
  const [fishes, setFishes] = useState<Fish[]>([]);
  const [homepageContent, setHomepageContent] = useState<HomepageContent>({
    heroTitle: 'FreshCatch Aquarium',
    heroSubtitle: 'Premium quality aquarium fish, plants, and accessories',
    heroDescription: 'Your one-stop shop for all aquarium needs!',
    trendingTitle: 'Trending Products',
    featuredTitle: 'Featured Products',
    saleTitle: 'On Sale',
    allProductsTitle: 'All Products',
    updatedAt: new Date().toISOString()
  });

  useEffect(() => {
    const loadFishes = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/fishes`);
        if (response.ok) {
          const data = await response.json();
          setFishes(data);
        } else {
          console.error('Failed to load fishes');
        }
      } catch (error) {
        console.error('Error loading fishes:', error);
      }
    };
    
    const loadHomepageContent = () => {
      const saved = localStorage.getItem('homepageContent');
      if (saved) {
        setHomepageContent(JSON.parse(saved));
      }
    };

    loadFishes();
    loadHomepageContent();

    // Listen for content updates
    const handleContentUpdate = () => loadHomepageContent();
    window.addEventListener('homepageContentUpdated', handleContentUpdate);

    return () => {
      window.removeEventListener('homepageContentUpdated', handleContentUpdate);
    };
  }, []);

  // Get trending products (first 8 items)
  const trendingProducts = fishes.slice(0, 8);
  
  // Get featured products (betta and premium fish)
  const featuredProducts = fishes.filter(fish => 
    fish.category === 'betta' || fish.price > 100
  );
  
  // Get sale products (items with discount > 0)
  const saleProducts = fishes.filter(fish => fish.discount > 0);

  return (
    <main className="min-h-screen relative">
      {/* Floating Fish Background */}
      <div className="floating-fish floating-fish-1">
        <AnimatedFish type="floating" size="medium" delay={0} />
      </div>
      <div className="floating-fish floating-fish-2">
        <AnimatedFish type="floating" size="small" delay={1} />
      </div>
      <div className="floating-fish floating-fish-3">
        <AnimatedFish type="floating" size="large" delay={2} />
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1E90FF] via-[#0EA5E9] to-[#06B6D4] text-white py-16 relative overflow-hidden">
        {/* Bubbles Animation */}
        <div className="absolute inset-0">
          <div className="bubble bubble-animation" style={{ left: '20%', top: '80%' }}></div>
          <div className="bubble bubble-animation" style={{ left: '50%', top: '70%', animationDelay: '1s' }}></div>
          <div className="bubble bubble-animation" style={{ left: '80%', top: '90%', animationDelay: '2s' }}></div>
          <div className="bubble bubble-animation" style={{ left: '30%', top: '60%', animationDelay: '0.5s' }}></div>
          <div className="bubble bubble-animation" style={{ left: '70%', top: '85%', animationDelay: '1.5s' }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-6">
            <Logo />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center">{homepageContent.heroTitle}</h1>
          <p className="text-blue-100 mt-3 max-w-2xl mx-auto text-center">
            {homepageContent.heroSubtitle}
          </p>
          <p className="text-blue-200 mt-2 max-w-2xl mx-auto text-center text-sm">
            {homepageContent.heroDescription}
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/categories?category=community'}
              className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 hover:bg-white/30 transition-all duration-300 cursor-pointer group"
            >
              <span className="text-sm font-medium group-hover:scale-105 transition-transform duration-200">🐠 Live Fish</span>
            </button>
            <button 
              onClick={() => window.location.href = '/categories?category=plants'}
              className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 hover:bg-white/30 transition-all duration-300 cursor-pointer group"
            >
              <span className="text-sm font-medium group-hover:scale-105 transition-transform duration-200">🌱 Live Plants</span>
            </button>
            <button 
              onClick={() => window.location.href = '/categories?category=betta'}
              className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 hover:bg-white/30 transition-all duration-300 cursor-pointer group"
            >
              <span className="text-sm font-medium group-hover:scale-105 transition-transform duration-200">🐟 Betta Fish</span>
            </button>
            <button 
              onClick={() => window.location.href = '/categories?category=monster'}
              className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 hover:bg-white/30 transition-all duration-300 cursor-pointer group"
            >
              <span className="text-sm font-medium group-hover:scale-105 transition-transform duration-200">🦈 Monster Fish</span>
            </button>
          </div>
        </div>
      </section>

      {/* Trending Products Section */}
      {trendingProducts.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">🔥 {homepageContent.trendingTitle}</h2>
              <p className="text-gray-600">Our most popular items this week</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingProducts.map((fish, index) => (
                <FishCard key={fish._id} fish={fish} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">⭐ {homepageContent.featuredTitle}</h2>
              <p className="text-gray-600">Premium quality fish and accessories</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((fish, index) => (
                <FishCard key={fish._id} fish={fish} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sale Products Section */}
      {saleProducts.length > 0 && (
        <section className="py-12 bg-red-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">🏷️ {homepageContent.saleTitle}</h2>
              <p className="text-gray-600">Limited time offers - Don't miss out!</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {saleProducts.map((fish, index) => (
                <FishCard key={fish._id} fish={fish} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Products Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">🐠 {homepageContent.allProductsTitle}</h2>
            <p className="text-gray-600">Complete collection of aquarium fish and accessories</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {fishes.map((fish, index) => (
              <FishCard key={fish._id} fish={fish} index={index} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}


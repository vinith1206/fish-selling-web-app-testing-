'use client';

import Image from 'next/image';
import { Plus, Minus, GitCompare } from 'lucide-react';
import { Fish } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getFishImagePath, getFishImageAlt } from '@/lib/fishImageUtils';

interface FishCardProps {
  fish: Fish;
  index: number;
}

const FishCard = ({ fish, index }: FishCardProps) => {
  const { addToCart, state, updateQuantity } = useCart();
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);

  const cartItem = state.items.find(item => item.fish._id === fish._id);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      if (quantity >= (fish.stock || 0)) {
        console.warn('Cannot add more than stock available');
      } else {
        addToCart(fish, 1);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  const handleQuantityChange = (newQuantity: number) => {
    const clamped = Math.max(0, Math.min(newQuantity, fish.stock || 0));
    if (clamped === 0) {
      updateQuantity(fish._id, 0);
    } else {
      updateQuantity(fish._id, clamped);
    }
  };

  const isInStock = fish.availability === 'in_stock';

  const handleCompare = () => {
    try {
      const key = 'compareFishes';
      const existingRaw = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      const existing: Fish[] = existingRaw ? JSON.parse(existingRaw) : [];
      const already = existing.some((f) => f._id === fish._id);
      const updated = already ? existing : [...existing, fish];
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(updated));
      }
      router.push('/compare');
    } catch (e) {
      console.error('Compare action failed', e);
    }
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 group animate-fade-in-up fish-card-hover"
      style={{ 
        animationDelay: `${index * 150}ms`,
        animationName: 'fadeInUp',
        animationDuration: '0.6s',
        animationTimingFunction: 'ease-out',
        animationFillMode: 'forwards'
      }}
    >
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={fish.image}
          alt={getFishImageAlt(fish.name)}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          priority={index < 4}
          onError={(e) => {
            // Fallback to constructed image path if database image fails to load
            const target = e.target as HTMLImageElement;
            const fallbackPath = getFishImagePath(fish.name);
            if (target.src !== fallbackPath) {
              target.src = fallbackPath;
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${
            fish.category === 'expert' || fish.category === 'monster'
              ? 'bg-gradient-to-r from-red-400 to-red-500 text-white' 
              : fish.category === 'semi-aggressive'
              ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white'
              : fish.category === 'coldwater'
              ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white'
              : fish.category === 'solo' || fish.category === 'betta'
              ? 'bg-gradient-to-r from-purple-400 to-purple-500 text-white'
              : fish.category === 'breeding'
              ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white'
              : fish.category === 'molly'
              ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white'
              : fish.category === 'glow'
              ? 'bg-gradient-to-r from-cyan-400 to-cyan-500 text-white'
              : fish.category === 'shrimp'
              ? 'bg-gradient-to-r from-rose-400 to-rose-500 text-white'
              : fish.category === 'plants'
              ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-white'
              : fish.category === 'live_culture'
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white'
              : 'bg-gradient-to-r from-[#22C55E] to-green-500 text-white'
          }`}>
            {fish.category.replace('_', ' ')}
          </span>
        </div>
        {/* Sale Badge */}
        {fish.discount > 0 && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm bg-gradient-to-r from-red-500 to-red-600 text-white">
              -{fish.discount}%
            </span>
          </div>
        )}
        {/* Care Level Badge */}
        {fish.careLevel && (
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${
              fish.careLevel === 'beginner'
                ? 'bg-gradient-to-r from-green-400 to-green-500 text-white'
                : fish.careLevel === 'intermediate'
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white'
                : 'bg-gradient-to-r from-red-400 to-red-500 text-white'
            }`}>
              {fish.careLevel}
            </span>
          </div>
        )}
        <div className="absolute bottom-4 left-4">
          <div className={`flex items-center backdrop-blur-sm rounded-full px-3 py-1 shadow-lg ${
            isInStock ? 'bg-white/95' : 'bg-red-500/95'
          }`}>
            <span className={`w-2 h-2 rounded-full mr-2 ${
              isInStock ? 'bg-[#22C55E] animate-pulse' : 'bg-white'
            }`}></span>
            <span className={`text-xs font-bold ${
              isInStock ? 'text-gray-800' : 'text-white'
            }`}>
              {isInStock ? 'In Stock' : 'Sold Out'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#1E90FF] transition-colors duration-300">
          {fish.name}
        </h3>
        {fish.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{fish.description}</p>
        )}
        <div className="space-y-2 mb-4">
          {fish.tankSize && (
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-medium mr-2">Tank:</span>
              <span>{fish.tankSize}</span>
            </div>
          )}
          {fish.waterTemp && (
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-medium mr-2">Temp:</span>
              <span>{fish.waterTemp}</span>
            </div>
          )}
          {fish.schooling && fish.groupSize && (
            <div className="flex items-center text-sm text-blue-600">
              <span className="font-medium mr-2">School:</span>
              <span>Min {fish.groupSize} fish</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center space-x-2">
              {(() => {
                const rawOriginal = (fish as any).originalPrice;
                const original = typeof rawOriginal === 'number' && rawOriginal > 0 ? rawOriginal : fish.price;
                const dp = (fish as any).discountPrice;
                const hasPct = typeof fish.discount === 'number' && fish.discount > 0;
                const pctPrice = hasPct ? Number((original * (1 - (fish.discount as number) / 100)).toFixed(2)) : undefined;
                const discounted = typeof dp === 'number' && dp > 0 ? dp : pctPrice;

                if (typeof discounted === 'number' && discounted > 0 && discounted < original) {
                  return (
                    <>
                      <span className="text-3xl font-bold text-[#1E90FF]">₹{discounted}</span>
                      <span className="text-lg text-gray-400 line-through">₹{original}</span>
                    </>
                  );
                }
                return <span className="text-3xl font-bold text-[#1E90FF]">₹{original}</span>;
              })()}
            </div>
        {fish.priceUnit === 'per_kg' && (
          <span className="text-gray-500 text-sm font-medium">/kg</span>
        )}
            {fish.discount && fish.discount > 0 && (
              <div className="text-green-600 text-sm font-semibold">
                {(() => {
                  const rawOriginal = (fish as any).originalPrice;
                  const original = typeof rawOriginal === 'number' && rawOriginal > 0 ? rawOriginal : fish.price;
                  const dp = (fish as any).discountPrice;
                  const hasPct = typeof fish.discount === 'number' && fish.discount > 0;
                  const effective = typeof dp === 'number' && dp > 0 ? dp : hasPct ? Number((original * (1 - (fish.discount as number) / 100)).toFixed(2)) : original;
                  const savings = Math.max(0, original - effective);
                  if (savings > 0) {
                    return `Save ₹${savings.toFixed(0)}`;
                  }
                  return `Save ${fish.discount}%`;
                })()}
              </div>
            )}
          </div>
        </div>
        <div className="space-y-3">
          {isInStock ? (
            quantity > 0 ? (
              <div className="flex flex-col items-center bg-gray-50 rounded-xl p-2">
                <div className="flex items-center justify-between w-full">
                  <button onClick={() => handleQuantityChange(quantity - 1)} className="p-2 text-gray-600 hover:text-[#1E90FF] hover:bg-white rounded-lg transition-all duration-200">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-lg font-bold text-gray-900 px-4">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= (fish.stock || 0)}
                    className={`p-2 rounded-lg transition-all duration-200 ${quantity >= (fish.stock || 0) ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-[#1E90FF] hover:bg-white'}`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {fish.stock !== undefined && (
                  <div className="text-xs text-gray-500 mt-1 text-center">
                    {quantity >= fish.stock ? 'Max stock reached' : `In stock: ${fish.stock}`}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={isAdding || (fish.stock || 0) === 0}
                className={`w-full bg-gradient-to-r from-[#1E90FF] to-[#0EA5E9] text-white py-3 px-4 rounded-xl hover:from-[#0EA5E9] hover:to-[#06B6D4] transition-all duration-300 flex items-center justify-center space-x-2 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 ${isAdding || (fish.stock || 0) === 0 ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                <Plus className="h-5 w-5" />
                <span>{isAdding ? 'Adding...' : (fish.stock || 0) === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
              </button>
            )
          ) : (
            <button disabled className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-xl cursor-not-allowed font-bold">Sold Out</button>
          )}
          
          {/* Compare Button */}
          <button onClick={handleCompare} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 font-medium">
            <GitCompare className="h-4 w-4" />
            <span>Compare</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FishCard;

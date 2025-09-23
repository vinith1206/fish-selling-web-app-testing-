'use client';

import { useState, useEffect } from 'react';
import { Fish, fishApi } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import { Plus, ShoppingCart } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  const [fishes, setFishes] = useState<Fish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFishes = async () => {
      try {
        const response = await fishApi.getAll();
        setFishes(response.data);
      } catch (err) {
        setError('Failed to load fishes');
        console.error('Error fetching fishes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFishes();
  }, []);

  const handleAddToCart = (fish: Fish) => {
    addToCart(fish, 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading fresh fish...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          Fresh Fish
          <span className="text-blue-600"> Delivered</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Order the freshest fish directly to your doorstep. 
          Fast delivery, great prices, and quality guaranteed.
        </p>
      </div>

      {/* Fish Catalog */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {fishes.map((fish) => (
          <div key={fish._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 w-full">
              <Image
                src={fish.image}
                alt={fish.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{fish.name}</h3>
              
              {fish.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{fish.description}</p>
              )}
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-2xl font-bold text-blue-600">₹{fish.price}</span>
                  <span className="text-gray-500 text-sm ml-1">
                    /{fish.priceUnit === 'per_kg' ? 'kg' : 'piece'}
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => handleAddToCart(fish)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {fishes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No fish available at the moment.</p>
        </div>
      )}
    </div>
  );
}
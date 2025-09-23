'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Fish } from '@/types';
import FishCard from '@/components/FishCard';
import AnimatedFish from '@/components/AnimatedFish';
import { Filter, Search, Grid, List } from 'lucide-react';

const getCategories = (fishes: Fish[]) => [
  { id: 'all', name: 'All Categories', count: fishes.length, icon: '🐠' },
  { id: 'betta', name: 'Betta Fish', count: fishes.filter(f => f.category === 'betta').length, icon: '🐟' },
  { id: 'community', name: 'Guppy Fish', count: fishes.filter(f => f.category === 'community').length, icon: '🐠' },
  { id: 'molly', name: 'Molly Fish', count: fishes.filter(f => f.category === 'molly').length, icon: '🐡' },
  { id: 'monster', name: 'Monster Fishes', count: fishes.filter(f => f.category === 'monster').length, icon: '🦈' },
  { id: 'glow', name: 'Glow Fish', count: fishes.filter(f => f.category === 'glow').length, icon: '✨' },
  { id: 'shrimp', name: 'Shrimps', count: fishes.filter(f => f.category === 'shrimp').length, icon: '🦐' },
  { id: 'plants', name: 'Aquarium Plants', count: fishes.filter(f => f.category === 'plants').length, icon: '🌱' },
  { id: 'live_culture', name: 'Live Culture', count: fishes.filter(f => f.category === 'live_culture').length, icon: '🧪' }
];

export default function FishCategories() {
  const searchParams = useSearchParams();
  const [fishes, setFishes] = useState<Fish[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'newest'>('name');

  // Load fishes from API
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
    
    loadFishes();
  }, []);

  // Handle URL parameters
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  const filteredFishes = fishes.filter(fish => {
    const matchesCategory = selectedCategory === 'all' || fish.category === selectedCategory;
    const matchesSearch = fish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fish.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'newest':
        return b._id.localeCompare(a._id);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Fish Categories</h1>
          <p className="text-xl text-gray-600">Browse our complete collection of aquarium fish and accessories</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search fish..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Categories
                </h3>
                <div className="space-y-2">
                  {getCategories(fishes).map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                        selectedCategory === category.id
                          ? 'bg-[#1E90FF] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg fish-icon">{category.icon}</span>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <span className={`text-sm ${
                          selectedCategory === category.id ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {category.count}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                >
                  <option value="name">Name A-Z</option>
                  <option value="price">Price Low to High</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedCategory === 'all' ? 'All Products' : getCategories(fishes).find(c => c.id === selectedCategory)?.name}
                  </h2>
                  <p className="text-gray-600">{filteredFishes.length} products found</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-colors duration-200 ${
                        viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600'
                      }`}
                    >
                      <Grid className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-colors duration-200 ${
                        viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'
                      }`}
                    >
                      <List className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredFishes.length > 0 ? (
              <div className={`grid gap-8 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredFishes.map((fish, index) => (
                  <FishCard key={fish._id} fish={fish} index={index} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">🐠</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No fish found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="bg-[#1E90FF] text-white px-6 py-3 rounded-xl hover:bg-[#0EA5E9] transition-colors duration-200"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

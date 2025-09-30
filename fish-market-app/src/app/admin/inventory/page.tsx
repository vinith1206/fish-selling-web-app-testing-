'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Upload,
  Search,
  Filter,
  Save,
  X,
  Image as ImageIcon,
  ChevronDown,
  Tag,
  PlusCircle
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { fishApi } from '@/lib/api';

interface Fish {
  _id: string;
  name: string;
  price: number;
  category: string;
  availability: 'in_stock' | 'sold_out';
  image: string;
  stock: number;
  description: string;
  weight: number;
  origin: string;
  discount?: number;
  discountPrice?: number;
  originalPrice?: number;
  priceUnit: 'per_kg' | 'per_piece';
  careLevel?: 'beginner' | 'intermediate' | 'expert';
  tankSize?: string;
  waterTemp?: string;
  waterPH?: string;
  schooling?: boolean;
  groupSize?: number;
}

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  isActive: boolean;
}

// Available categories
const availableCategories: Category[] = [
  {
    id: 'aquarium_fish',
    name: 'Aquarium Fish',
    description: 'All types of aquarium fish including betta, guppy, molly, and more',
    color: 'blue',
    icon: '🐠',
    isActive: true
  },
  {
    id: 'pets',
    name: 'Pets',
    description: 'Pet fish and aquatic animals for home aquariums',
    color: 'green',
    icon: '🐟',
    isActive: true
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Aquarium accessories, tanks, filters, and equipment',
    color: 'indigo',
    icon: '🔧',
    isActive: true
  },
  {
    id: 'betta',
    name: 'Betta Fishes',
    description: 'Breeding pairs and individual betta fish',
    color: 'purple',
    icon: '🐠',
    isActive: true
  },
  {
    id: 'community',
    name: 'Guppy Fishes',
    description: 'Colorful and hardy community fish',
    color: 'green',
    icon: '🐟',
    isActive: true
  },
  {
    id: 'molly',
    name: 'Molly Fishes',
    description: 'Mixed colors, great for beginners',
    color: 'yellow',
    icon: '🐠',
    isActive: true
  },
  {
    id: 'monster',
    name: 'Monster Fishes',
    description: 'Large species requiring big tanks',
    color: 'red',
    icon: '🦈',
    isActive: true
  },
  {
    id: 'glow',
    name: 'Glow Fishes',
    description: 'Genetically modified fluorescent fish',
    color: 'cyan',
    icon: '✨',
    isActive: true
  },
  {
    id: 'shrimp',
    name: 'Shrimp & Lobster',
    description: 'Live culture and aquarium cleaners',
    color: 'rose',
    icon: '🦐',
    isActive: true
  },
  {
    id: 'plants',
    name: 'Live Plants',
    description: 'Aquatic plants for aquascaping',
    color: 'emerald',
    icon: '🌿',
    isActive: true
  },
  {
    id: 'live_culture',
    name: 'Live Culture',
    description: 'Fish food cultures and live feeds',
    color: 'amber',
    icon: '🧪',
    isActive: true
  }
];

export default function InventoryPage() {
  const router = useRouter();
  const [fishes, setFishes] = useState<Fish[]>([]);
  const [filteredFishes, setFilteredFishes] = useState<Fish[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAdding, setIsAdding] = useState(false);
  const [editingFish, setEditingFish] = useState<Fish | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    color: 'blue',
    icon: '🐠'
  });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    originalPrice: 0,
    category: 'community',
    availability: 'in_stock' as Fish['availability'],
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop&auto=format',
    stock: 0,
    description: '',
    weight: 0,
    origin: '',
    discount: 0,
    discountPrice: 0,
    priceUnit: 'per_piece' as Fish['priceUnit'],
    careLevel: 'beginner' as Fish['careLevel'],
    tankSize: '',
    waterTemp: '',
    waterPH: '',
    schooling: false,
    groupSize: 1
  });

  // Check admin authentication
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('adminAuth');
    if (!isAuthenticated) {
      router.push('/admin/login');
      return;
    }
  }, [router]);

  // Load inventory data
  useEffect(() => {
    loadInventory();
  }, []);

  // Filter fishes
  useEffect(() => {
    let filtered = fishes;

    if (searchTerm) {
      filtered = filtered.filter(fish =>
        fish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fish.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(fish => fish.category === categoryFilter);
    }

    setFilteredFishes(filtered);
  }, [fishes, searchTerm, categoryFilter]);

  const loadInventory = async () => {
    setIsLoading(true);
    try {
      const response = await fishApi.getAll();
      setFishes(response.data);
    } catch (error) {
      console.error('Error loading inventory:', error);
      setFishes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In production, upload to server and get URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          image: event.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingFish) {
        // Update existing fish
        const response = await fishApi.update(editingFish._id, formData);
        setFishes(prev => prev.map(fish => 
          fish._id === editingFish._id ? response.data : fish
        ));
      } else {
        // Add new fish
        const response = await fishApi.create(formData);
        setFishes(prev => [...prev, response.data]);
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving fish:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: 0,
      originalPrice: 0,
      category: 'community',
      availability: 'in_stock',
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop&auto=format',
      stock: 0,
      description: '',
      weight: 0,
      origin: '',
      discount: 0,
      discountPrice: 0,
      priceUnit: 'per_piece',
      careLevel: 'beginner',
      tankSize: '',
      waterTemp: '',
      waterPH: '',
      schooling: false,
      groupSize: 1
    });
    setIsAdding(false);
    setEditingFish(null);
  };

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      const category: Category = {
        id: newCategory.name.toLowerCase().replace(/\s+/g, '_'),
        name: newCategory.name,
        description: newCategory.description,
        color: newCategory.color,
        icon: newCategory.icon,
        isActive: true
      };
      
      // In a real app, this would be saved to the database
      console.log('New category added:', category);
      
      setNewCategory({
        name: '',
        description: '',
        color: 'blue',
        icon: '🐠'
      });
      setShowAddCategory(false);
    }
  };

  const getCategoryColor = (categoryId: string) => {
    const category = availableCategories.find(cat => cat.id === categoryId);
    if (!category) return 'bg-gray-100 text-gray-800';
    
    const colorMap: { [key: string]: string } = {
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      red: 'bg-red-100 text-red-800',
      purple: 'bg-purple-100 text-purple-800',
      cyan: 'bg-cyan-100 text-cyan-800',
      rose: 'bg-rose-100 text-rose-800',
      emerald: 'bg-emerald-100 text-emerald-800',
      amber: 'bg-amber-100 text-amber-800',
      indigo: 'bg-indigo-100 text-indigo-800'
    };
    
    return colorMap[category.color] || 'bg-gray-100 text-gray-800';
  };

  const handleEdit = (fish: Fish) => {
    setFormData(fish);
    setEditingFish(fish);
    setIsAdding(true);
  };

  const handleDelete = async (fishId: string) => {
    if (confirm('Are you sure you want to delete this fish?')) {
      try {
        await fishApi.delete(fishId);
        setFishes(prev => prev.filter(fish => fish._id !== fishId));
      } catch (error) {
        console.error('Error deleting fish:', error);
      }
    }
  };


  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'in_stock': return 'bg-green-100 text-green-800';
      case 'sold_out': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner h-12 w-12 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/dashboard"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Inventory Management</h1>
            </div>
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center space-x-2 bg-[#1E90FF] text-white px-4 py-2 rounded-lg hover:bg-[#0EA5E9] transition-colors duration-200"
            >
              <Plus className="h-5 w-5" />
              <span>Add Fish</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search fish by name or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {availableCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Add/Edit Form Modal */}
        {isAdding && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingFish ? 'Edit Fish' : 'Add New Fish'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fish Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (₹) *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={(e) => {
                          const price = e.target.value === '' ? '' : Number(e.target.value);
                          setFormData(prev => ({
                            ...prev,
                            price: price,
                            discountPrice: prev.discount && price ? 
                              Math.round(price * (1 - prev.discount / 100) * 100) / 100 : 0
                          }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="Enter price"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <div className="relative">
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent pr-10"
                          required
                        >
                          {availableCategories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.icon} {category.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowAddCategory(true)}
                        className="mt-2 flex items-center space-x-2 text-sm text-[#1E90FF] hover:text-[#0EA5E9] transition-colors duration-200"
                      >
                        <PlusCircle className="h-4 w-4" />
                        <span>Add New Category</span>
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock Quantity *
                      </label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="Enter stock quantity"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Weight (grams)
                      </label>
                      <input
                        type="number"
                        step="1"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="Enter weight in grams"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Origin
                      </label>
                      <input
                        type="text"
                        name="origin"
                        value={formData.origin}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount (%)
                      </label>
                      <input
                        type="number"
                        name="discount"
                        value={formData.discount}
                        onChange={(e) => {
                          const discount = e.target.value === '' ? '' : Number(e.target.value);
                          setFormData(prev => ({
                            ...prev,
                            discount: discount,
                            discountPrice: discount && formData.price ? 
                              Math.round(formData.price * (1 - discount / 100) * 100) / 100 : 0
                          }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="Enter discount percentage"
                      />
                      {formData.discount > 0 && formData.price > 0 && (
                        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Discounted Price:</span>
                            <span className="text-lg font-bold text-green-600">
                              ₹{Math.round(formData.price * (1 - formData.discount / 100) * 100) / 100}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Original: ₹{formData.price} - {formData.discount}% = ₹{Math.round(formData.price * (1 - formData.discount / 100) * 100) / 100}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Availability
                      </label>
                      <select
                        name="availability"
                        value={formData.availability}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                      >
                        <option value="in_stock">In Stock</option>
                        <option value="sold_out">Sold Out</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fish Image
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <Upload className="h-5 w-5" />
                        <span>Upload Image</span>
                      </label>
                      {formData.image && (
                        <div className="relative w-20 h-20">
                          <Image
                            src={formData.image}
                            alt="Fish preview"
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center space-x-2 px-6 py-2 bg-[#1E90FF] text-white rounded-lg hover:bg-[#0EA5E9]"
                    >
                      <Save className="h-5 w-5" />
                      <span>{editingFish ? 'Update' : 'Add'} Fish</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Add New Category Modal */}
        {showAddCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Add New Category</h2>
                  <button
                    onClick={() => setShowAddCategory(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                      placeholder="Enter category name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                      placeholder="Enter category description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color
                      </label>
                      <select
                        value={newCategory.color}
                        onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                      >
                        <option value="blue">Blue</option>
                        <option value="green">Green</option>
                        <option value="yellow">Yellow</option>
                        <option value="red">Red</option>
                        <option value="purple">Purple</option>
                        <option value="cyan">Cyan</option>
                        <option value="rose">Rose</option>
                        <option value="emerald">Emerald</option>
                        <option value="amber">Amber</option>
                        <option value="indigo">Indigo</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Icon
                      </label>
                      <select
                        value={newCategory.icon}
                        onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                      >
                        <option value="🐠">🐠 Fish</option>
                        <option value="🐟">🐟 Fish</option>
                        <option value="🦈">🦈 Shark</option>
                        <option value="✨">✨ Glow</option>
                        <option value="🦐">🦐 Shrimp</option>
                        <option value="🌿">🌿 Plant</option>
                        <option value="🧪">🧪 Culture</option>
                        <option value="🔧">🔧 Accessory</option>
                        <option value="💎">💎 Premium</option>
                        <option value="⭐">⭐ Star</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => setShowAddCategory(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCategory}
                    className="flex items-center space-x-2 px-4 py-2 bg-[#1E90FF] text-white rounded-lg hover:bg-[#0EA5E9]"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Add Category</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Inventory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFishes.map((fish) => (
            <div key={fish._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={fish.image}
                  alt={fish.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${getCategoryColor(fish.category)}`}>
                    {availableCategories.find(cat => cat.id === fish.category)?.icon} {availableCategories.find(cat => cat.id === fish.category)?.name || fish.category}
                  </span>
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${getAvailabilityColor(fish.availability)}`}>
                    {fish.availability === 'in_stock' ? 'In Stock' : 'Sold Out'}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{fish.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{fish.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-semibold">
                      {fish.discount ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-red-500 line-through">₹{fish.price}</span>
                          <span className="text-green-600">₹{fish.discountPrice}</span>
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            {fish.discount}% OFF
                          </span>
                        </div>
                      ) : (
                        `₹${fish.price}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stock:</span>
                    <span className={`font-semibold ${fish.stock < 5 ? 'text-red-600' : 'text-green-600'}`}>
                      {fish.stock} units
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-semibold">{fish.weight ? fish.weight.toFixed(0) : 'N/A'} g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Origin:</span>
                    <span className="font-semibold">{fish.origin}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(fish)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(fish._id)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredFishes.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No fish found</h3>
            <p className="text-gray-600">Try adjusting your search or add a new fish to the inventory.</p>
          </div>
        )}
      </div>
    </div>
  );
}

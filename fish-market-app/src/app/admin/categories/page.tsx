'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Search, Filter } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  isActive: boolean;
  productCount: number;
}

const defaultCategories: Category[] = [
  {
    id: 'aquarium_fish',
    name: 'Aquarium Fish',
    description: 'All types of aquarium fish including betta, guppy, molly, and more',
    color: 'blue',
    icon: '🐠',
    isActive: true,
    productCount: 8
  },
  {
    id: 'pets',
    name: 'Pets',
    description: 'Pet fish and aquatic animals for home aquariums',
    color: 'green',
    icon: '🐟',
    isActive: true,
    productCount: 5
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Aquarium accessories, tanks, filters, and equipment',
    color: 'indigo',
    icon: '🔧',
    isActive: true,
    productCount: 3
  },
  {
    id: 'betta',
    name: 'Betta Fishes',
    description: 'Breeding pairs and individual betta fish',
    color: 'purple',
    icon: '🐠',
    isActive: true,
    productCount: 2
  },
  {
    id: 'community',
    name: 'Guppy Fishes',
    description: 'Colorful and hardy community fish',
    color: 'green',
    icon: '🐟',
    isActive: true,
    productCount: 1
  },
  {
    id: 'molly',
    name: 'Molly Fishes',
    description: 'Mixed colors, great for beginners',
    color: 'yellow',
    icon: '🐠',
    isActive: true,
    productCount: 1
  },
  {
    id: 'monster',
    name: 'Monster Fishes',
    description: 'Large species requiring big tanks',
    color: 'red',
    icon: '🦈',
    isActive: true,
    productCount: 4
  },
  {
    id: 'glow',
    name: 'Glow Fishes',
    description: 'Genetically modified fluorescent fish',
    color: 'cyan',
    icon: '✨',
    isActive: true,
    productCount: 1
  },
  {
    id: 'shrimp',
    name: 'Shrimp & Lobster',
    description: 'Live culture and aquarium cleaners',
    color: 'rose',
    icon: '🦐',
    isActive: true,
    productCount: 1
  },
  {
    id: 'plants',
    name: 'Live Plants',
    description: 'Aquatic plants for aquascaping',
    color: 'emerald',
    icon: '🌿',
    isActive: true,
    productCount: 1
  },
  {
    id: 'live_culture',
    name: 'Live Culture',
    description: 'Fish food cultures and live feeds',
    color: 'amber',
    icon: '🧪',
    isActive: true,
    productCount: 1
  }
];

const colorOptions = [
  { value: 'purple', label: 'Purple', class: 'from-purple-500 to-purple-600' },
  { value: 'green', label: 'Green', class: 'from-green-500 to-green-600' },
  { value: 'yellow', label: 'Yellow', class: 'from-yellow-500 to-yellow-600' },
  { value: 'red', label: 'Red', class: 'from-red-500 to-red-600' },
  { value: 'cyan', label: 'Cyan', class: 'from-cyan-500 to-cyan-600' },
  { value: 'rose', label: 'Rose', class: 'from-rose-500 to-rose-600' },
  { value: 'emerald', label: 'Emerald', class: 'from-emerald-500 to-emerald-600' },
  { value: 'amber', label: 'Amber', class: 'from-amber-500 to-amber-600' },
  { value: 'indigo', label: 'Indigo', class: 'from-indigo-500 to-indigo-600' },
  { value: 'pink', label: 'Pink', class: 'from-pink-500 to-pink-600' },
  { value: 'teal', label: 'Teal', class: 'from-teal-500 to-teal-600' },
  { value: 'violet', label: 'Violet', class: 'from-violet-500 to-violet-600' }
];

const iconOptions = [
  '🐠', '🐟', '🦈', '✨', '🦐', '🌿', '🧪', '🔧', '🏷️', '🆕', '🏺',
  '🐡', '🐙', '🦑', '🦀', '🐚', '🌊', '💧', '🔬', '📦', '🎣', '🏊'
];

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: '',
    description: '',
    color: 'purple',
    icon: '🐠',
    isActive: true
  });

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && category.isActive) ||
                         (filterStatus === 'inactive' && !category.isActive);
    return matchesSearch && matchesFilter;
  });

  const handleAddCategory = () => {
    if (newCategory.name && newCategory.description) {
      const category: Category = {
        id: newCategory.name.toLowerCase().replace(/\s+/g, '_'),
        name: newCategory.name,
        description: newCategory.description,
        color: newCategory.color || 'purple',
        icon: newCategory.icon || '🐠',
        isActive: newCategory.isActive || true,
        productCount: 0
      };
      
      setCategories([...categories, category]);
      setNewCategory({ name: '', description: '', color: 'purple', icon: '🐠', isActive: true });
      setIsAdding(false);
    }
  };

  const handleEditCategory = (id: string) => {
    setEditingId(id);
  };

  const handleSaveEdit = (id: string, updatedCategory: Partial<Category>) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, ...updatedCategory } : cat
    ));
    setEditingId(null);
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, isActive: !cat.isActive } : cat
    ));
  };

  const getColorClass = (color: string) => {
    const colorOption = colorOptions.find(opt => opt.value === color);
    return colorOption?.class || 'from-purple-500 to-purple-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
              <p className="text-gray-600 mt-2">Manage product categories and their properties</p>
            </div>
            <button
              onClick={() => setIsAdding(true)}
              className="bg-[#1E90FF] text-white px-6 py-3 rounded-xl hover:bg-[#0EA5E9] transition-colors duration-200 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Category</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Add Category Form */}
        {isAdding && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Category</h3>
            
            {/* Quick Category Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Quick Select Main Categories</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setNewCategory({
                    name: 'Aquarium Fish',
                    description: 'All types of aquarium fish including betta, guppy, molly, and more',
                    color: 'blue',
                    icon: '🐠',
                    isActive: true
                  })}
                  className="p-4 border-2 border-gray-200 rounded-xl hover:border-[#1E90FF] hover:bg-blue-50 transition-colors duration-200 text-left"
                >
                  <div className="text-2xl mb-2">🐠</div>
                  <div className="font-medium text-gray-900">Aquarium Fish</div>
                  <div className="text-sm text-gray-500">All aquarium fish types</div>
                </button>
                
                <button
                  onClick={() => setNewCategory({
                    name: 'Pets',
                    description: 'Pet fish and aquatic animals for home aquariums',
                    color: 'green',
                    icon: '🐟',
                    isActive: true
                  })}
                  className="p-4 border-2 border-gray-200 rounded-xl hover:border-[#1E90FF] hover:bg-blue-50 transition-colors duration-200 text-left"
                >
                  <div className="text-2xl mb-2">🐟</div>
                  <div className="font-medium text-gray-900">Pets</div>
                  <div className="text-sm text-gray-500">Pet fish and animals</div>
                </button>
                
                <button
                  onClick={() => setNewCategory({
                    name: 'Accessories',
                    description: 'Aquarium accessories, tanks, filters, and equipment',
                    color: 'indigo',
                    icon: '🔧',
                    isActive: true
                  })}
                  className="p-4 border-2 border-gray-200 rounded-xl hover:border-[#1E90FF] hover:bg-blue-50 transition-colors duration-200 text-left"
                >
                  <div className="text-2xl mb-2">🔧</div>
                  <div className="font-medium text-gray-900">Accessories</div>
                  <div className="text-sm text-gray-500">Tanks and equipment</div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                <input
                  type="text"
                  value={newCategory.name || ''}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                  placeholder="Enter category name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={newCategory.description || ''}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                  placeholder="Enter category description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <select
                  value={newCategory.color || 'purple'}
                  onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                >
                  {colorOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                <select
                  value={newCategory.icon || '🐠'}
                  onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                >
                  {iconOptions.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setIsAdding(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="px-6 py-3 bg-[#1E90FF] text-white rounded-xl hover:bg-[#0EA5E9] transition-colors duration-200 flex items-center space-x-2"
              >
                <Save className="h-5 w-5" />
                <span>Save Category</span>
              </button>
            </div>
          </div>
        )}

        {/* Edit Category Form */}
        {editingId && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Category</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                <input
                  type="text"
                  value={editingId ? categories.find(c => c.id === editingId)?.name || '' : ''}
                  onChange={(e) => {
                    const category = categories.find(c => c.id === editingId);
                    if (category) {
                      handleSaveEdit(editingId, { ...category, name: e.target.value });
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                  placeholder="Enter category name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={editingId ? categories.find(c => c.id === editingId)?.description || '' : ''}
                  onChange={(e) => {
                    const category = categories.find(c => c.id === editingId);
                    if (category) {
                      handleSaveEdit(editingId, { ...category, description: e.target.value });
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                  placeholder="Enter category description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <select
                  value={editingId ? categories.find(c => c.id === editingId)?.color || 'purple' : 'purple'}
                  onChange={(e) => {
                    const category = categories.find(c => c.id === editingId);
                    if (category) {
                      handleSaveEdit(editingId, { ...category, color: e.target.value });
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                >
                  {colorOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                <div className="grid grid-cols-6 gap-2">
                  {iconOptions.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => {
                        const category = categories.find(c => c.id === editingId);
                        if (category) {
                          handleSaveEdit(editingId, { ...category, icon });
                        }
                      }}
                      className={`p-3 text-2xl rounded-lg border-2 transition-colors duration-200 ${
                        editingId && categories.find(c => c.id === editingId)?.icon === icon
                          ? 'border-[#1E90FF] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setEditingId(null)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => setEditingId(null)}
                className="px-6 py-3 bg-[#1E90FF] text-white rounded-xl hover:bg-[#0EA5E9] transition-colors duration-200 flex items-center space-x-2"
              >
                <Save className="h-5 w-5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        )}

        {/* Categories List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className={`h-24 bg-gradient-to-br ${getColorClass(category.color)} flex items-center justify-center`}>
                <span className="text-4xl">{category.icon}</span>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{category.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      category.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-gray-500">
                    {category.productCount} products
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleStatus(category.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors duration-200 ${
                        category.isActive
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {category.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleEditCategory(category.id)}
                    className="flex items-center space-x-2 px-4 py-2 text-[#1E90FF] hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by adding your first category'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <button
                onClick={() => setIsAdding(true)}
                className="bg-[#1E90FF] text-white px-6 py-3 rounded-xl hover:bg-[#0EA5E9] transition-colors duration-200"
              >
                Add First Category
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

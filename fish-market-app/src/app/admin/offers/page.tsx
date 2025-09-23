'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  Calendar,
  Percent,
  Tag,
  Clock
} from 'lucide-react';
import Link from 'next/link';

interface Offer {
  _id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  applicableItems: string[]; // Fish IDs
  minOrderAmount?: number;
  maxDiscountAmount?: number;
}

interface Fish {
  _id: string;
  name: string;
  price: number;
  category: string;
}

export default function OffersPage() {
  const router = useRouter();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [fishes, setFishes] = useState<Fish[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'percentage' as Offer['type'],
    value: 0,
    startDate: '',
    endDate: '',
    isActive: true,
    applicableItems: [] as string[],
    minOrderAmount: 0,
    maxDiscountAmount: 0
  });

  // Check admin authentication
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('adminAuth');
    if (!isAuthenticated) {
      router.push('/admin/login');
      return;
    }
  }, [router]);

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Mock offers data
      const mockOffers: Offer[] = [
        {
          _id: '1',
          name: 'Weekend Special',
          description: 'Get 15% off on all fresh fish',
          type: 'percentage',
          value: 15,
          startDate: '2024-01-20',
          endDate: '2024-01-21',
          isActive: true,
          applicableItems: ['1', '2', '4'],
          minOrderAmount: 1000
        },
        {
          _id: '2',
          name: 'Premium Fish Sale',
          description: 'Flat ₹200 off on premium fish',
          type: 'fixed',
          value: 200,
          startDate: '2024-01-15',
          endDate: '2024-01-25',
          isActive: true,
          applicableItems: ['1', '3'],
          minOrderAmount: 1500,
          maxDiscountAmount: 200
        },
        {
          _id: '3',
          name: 'Seafood Combo',
          description: 'Buy 2 get 1 free on seafood items',
          type: 'percentage',
          value: 33,
          startDate: '2024-01-10',
          endDate: '2024-01-30',
          isActive: false,
          applicableItems: ['5', '6']
        }
      ];

      // Mock fishes data
      const mockFishes: Fish[] = [
        { _id: '1', name: 'Fresh Salmon', price: 899, category: 'premium' },
        { _id: '2', name: 'Red Snapper', price: 699, category: 'fresh' },
        { _id: '3', name: 'Tuna Steak', price: 1299, category: 'premium' },
        { _id: '4', name: 'Sea Bass', price: 799, category: 'fresh' },
        { _id: '5', name: 'Prawns', price: 599, category: 'seafood' },
        { _id: '6', name: 'Crab', price: 999, category: 'seafood' }
      ];

      setOffers(mockOffers);
      setFishes(mockFishes);
    } catch (error) {
      console.error('Error loading data:', error);
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

  const handleCheckboxChange = (fishId: string) => {
    setFormData(prev => ({
      ...prev,
      applicableItems: prev.applicableItems.includes(fishId)
        ? prev.applicableItems.filter(id => id !== fishId)
        : [...prev.applicableItems, fishId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingOffer) {
      // Update existing offer
      setOffers(prev => prev.map(offer => 
        offer._id === editingOffer._id 
          ? { ...formData, _id: editingOffer._id }
          : offer
      ));
    } else {
      // Add new offer
      const newOffer: Offer = {
        ...formData,
        _id: Date.now().toString()
      };
      setOffers(prev => [...prev, newOffer]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'percentage',
      value: 0,
      startDate: '',
      endDate: '',
      isActive: true,
      applicableItems: [],
      minOrderAmount: 0,
      maxDiscountAmount: 0
    });
    setIsAdding(false);
    setEditingOffer(null);
  };

  const handleEdit = (offer: Offer) => {
    setFormData(offer);
    setEditingOffer(offer);
    setIsAdding(true);
  };

  const handleDelete = (offerId: string) => {
    if (confirm('Are you sure you want to delete this offer?')) {
      setOffers(prev => prev.filter(offer => offer._id !== offerId));
    }
  };

  const toggleOfferStatus = (offerId: string) => {
    setOffers(prev => prev.map(offer => 
      offer._id === offerId 
        ? { ...offer, isActive: !offer.isActive }
        : offer
    ));
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string) => {
    return type === 'percentage' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-purple-100 text-purple-800';
  };

  const isOfferActive = (offer: Offer) => {
    const now = new Date();
    const startDate = new Date(offer.startDate);
    const endDate = new Date(offer.endDate);
    return offer.isActive && now >= startDate && now <= endDate;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner h-12 w-12 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading offers...</p>
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
              <h1 className="text-xl font-bold text-gray-900">Offers & Discounts</h1>
            </div>
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center space-x-2 bg-[#1E90FF] text-white px-4 py-2 rounded-lg hover:bg-[#0EA5E9] transition-colors duration-200"
            >
              <Plus className="h-5 w-5" />
              <span>Create Offer</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {offers.map((offer) => (
            <div key={offer._id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{offer.name}</h3>
                  <p className="text-gray-600 text-sm">{offer.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(offer)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(offer._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-bold text-lg">
                    {offer.type === 'percentage' ? `${offer.value}%` : `₹${offer.value}`}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Type:</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(offer.type)}`}>
                    {offer.type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(offer.isActive)}`}>
                    {isOfferActive(offer) ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Valid Until:</span>
                  <span className="text-sm">{new Date(offer.endDate).toLocaleDateString()}</span>
                </div>

                {offer.minOrderAmount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Min Order:</span>
                    <span className="text-sm">₹{offer.minOrderAmount}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Applicable Items:</span>
                  <span className="text-sm">{offer.applicableItems.length} items</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => toggleOfferStatus(offer._id)}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    offer.isActive
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {offer.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Form Modal */}
        {isAdding && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingOffer ? 'Edit Offer' : 'Create New Offer'}
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
                        Offer Name *
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
                        Discount Type *
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                        required
                      >
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed Amount</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount Value *
                      </label>
                      <input
                        type="number"
                        name="value"
                        value={formData.value}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="Enter discount value"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Min Order Amount (₹)
                      </label>
                      <input
                        type="number"
                        name="minOrderAmount"
                        value={formData.minOrderAmount}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="Enter minimum order amount"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date *
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                        required
                      />
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
                      Applicable Fish Items
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
                      {fishes.map((fish) => (
                        <label key={fish._id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.applicableItems.includes(fish._id)}
                            onChange={() => handleCheckboxChange(fish._id)}
                            className="rounded border-gray-300 text-[#1E90FF] focus:ring-[#1E90FF]"
                          />
                          <span className="text-sm text-gray-700">{fish.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="rounded border-gray-300 text-[#1E90FF] focus:ring-[#1E90FF]"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                      Activate this offer immediately
                    </label>
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
                      <span>{editingOffer ? 'Update' : 'Create'} Offer</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {offers.length === 0 && (
          <div className="text-center py-12">
            <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No offers created</h3>
            <p className="text-gray-600">Create your first offer to start attracting customers with discounts.</p>
          </div>
        )}
      </div>
    </div>
  );
}

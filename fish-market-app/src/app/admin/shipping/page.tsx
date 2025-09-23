'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Truck, MapPin, Clock, DollarSign, Save, X } from 'lucide-react';

interface ShippingRate {
  id: string;
  name: string;
  type: 'standard' | 'express' | 'same_day' | 'free';
  baseRate: number;
  perKgRate?: number;
  minOrderAmount?: number;
  maxWeight?: number;
  deliveryTime: string;
  zipcodes?: string[];
  isActive: boolean;
}

const mockShippingRates: ShippingRate[] = [
  {
    id: '1',
    name: 'Standard Delivery',
    type: 'standard',
    baseRate: 50,
    perKgRate: 10,
    deliveryTime: '3-5 business days',
    isActive: true
  },
  {
    id: '2',
    name: 'Express Delivery',
    type: 'express',
    baseRate: 100,
    perKgRate: 20,
    deliveryTime: '1-2 business days',
    isActive: true
  },
  {
    id: '3',
    name: 'Same Day Delivery',
    type: 'same_day',
    baseRate: 200,
    perKgRate: 30,
    maxWeight: 5,
    deliveryTime: 'Same day (within 6 hours)',
    isActive: true
  },
  {
    id: '4',
    name: 'Free Shipping',
    type: 'free',
    baseRate: 0,
    minOrderAmount: 1000,
    deliveryTime: '3-5 business days',
    isActive: true
  }
];

export default function ShippingManagement() {
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>(mockShippingRates);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newRate, setNewRate] = useState<Partial<ShippingRate>>({
    name: '',
    type: 'standard',
    baseRate: 0,
    perKgRate: 0,
    deliveryTime: '',
    isActive: true
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddNew = () => {
    setIsAddingNew(true);
    setNewRate({
      name: '',
      type: 'standard',
      baseRate: 0,
      perKgRate: 0,
      deliveryTime: '',
      isActive: true
    });
  };

  const handleSaveNew = () => {
    if (newRate.name && newRate.deliveryTime) {
      const rate: ShippingRate = {
        id: Date.now().toString(),
        name: newRate.name,
        type: newRate.type as any,
        baseRate: newRate.baseRate || 0,
        perKgRate: newRate.perKgRate,
        minOrderAmount: newRate.minOrderAmount,
        maxWeight: newRate.maxWeight,
        deliveryTime: newRate.deliveryTime,
        zipcodes: newRate.zipcodes,
        isActive: newRate.isActive || true
      };
      
      setShippingRates([...shippingRates, rate]);
      setHasChanges(true);
      setIsAddingNew(false);
      setNewRate({});
    }
  };

  const handleEdit = (rate: ShippingRate) => {
    setEditingId(rate.id);
    setNewRate(rate);
  };

  const handleSaveEdit = () => {
    if (editingId && newRate.name && newRate.deliveryTime) {
      setShippingRates(shippingRates.map(rate => 
        rate.id === editingId 
          ? { ...rate, ...newRate }
          : rate
      ));
      setHasChanges(true);
      setEditingId(null);
      setNewRate({});
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this shipping rate?')) {
      setShippingRates(shippingRates.filter(rate => rate.id !== id));
      setHasChanges(true);
    }
  };

  const handleToggleActive = (id: string) => {
    setShippingRates(shippingRates.map(rate => 
      rate.id === id 
        ? { ...rate, isActive: !rate.isActive }
        : rate
    ));
    setHasChanges(true);
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage
      localStorage.setItem('shippingRates', JSON.stringify(shippingRates));
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setHasChanges(false);
      alert('Shipping rates saved successfully!');
    } catch (error) {
      console.error('Error saving shipping rates:', error);
      alert('Error saving shipping rates. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'standard':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'express':
        return <Clock className="h-5 w-5 text-orange-500" />;
      case 'same_day':
        return <MapPin className="h-5 w-5 text-red-500" />;
      case 'free':
        return <DollarSign className="h-5 w-5 text-green-500" />;
      default:
        return <Truck className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'standard':
        return 'bg-blue-100 text-blue-800';
      case 'express':
        return 'bg-orange-100 text-orange-800';
      case 'same_day':
        return 'bg-red-100 text-red-800';
      case 'free':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Shipping Management</h1>
              <p className="text-gray-600">Manage shipping rates, delivery options, and free shipping thresholds</p>
            </div>
            <button
              onClick={handleSaveAll}
              disabled={!hasChanges || isSaving}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                hasChanges && !isSaving
                  ? 'bg-[#1E90FF] text-white hover:bg-[#0EA5E9] shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Save className="h-5 w-5" />
              <span>{isSaving ? 'Saving...' : 'Save All Changes'}</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Rates</p>
                <p className="text-2xl font-bold text-gray-900">{shippingRates.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Rates</p>
                <p className="text-2xl font-bold text-gray-900">
                  {shippingRates.filter(r => r.isActive).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Express Options</p>
                <p className="text-2xl font-bold text-gray-900">
                  {shippingRates.filter(r => r.type === 'express' || r.type === 'same_day').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Free Shipping</p>
                <p className="text-2xl font-bold text-gray-900">
                  {shippingRates.filter(r => r.type === 'free').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add New Rate Button */}
        <div className="mb-6">
          <button
            onClick={handleAddNew}
            className="bg-[#1E90FF] text-white px-4 py-2 rounded-lg hover:bg-[#0EA5E9] transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add New Shipping Rate</span>
          </button>
        </div>

        {/* Add/Edit Form */}
        {(isAddingNew || editingId) && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {isAddingNew ? 'Add New Shipping Rate' : 'Edit Shipping Rate'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rate Name</label>
                <input
                  type="text"
                  value={newRate.name || ''}
                  onChange={(e) => setNewRate({...newRate, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                  placeholder="e.g., Standard Delivery"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Type</label>
                <select
                  value={newRate.type || 'standard'}
                  onChange={(e) => setNewRate({...newRate, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                >
                  <option value="standard">Standard</option>
                  <option value="express">Express</option>
                  <option value="same_day">Same Day</option>
                  <option value="free">Free Shipping</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Base Rate (₹)</label>
                <input
                  type="number"
                  value={newRate.baseRate || ''}
                  onChange={(e) => setNewRate({...newRate, baseRate: e.target.value === '' ? '' : parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Per Kg Rate (₹)</label>
                <input
                  type="number"
                  value={newRate.perKgRate || ''}
                  onChange={(e) => setNewRate({...newRate, perKgRate: e.target.value === '' ? '' : parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="10"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Order Amount (₹)</label>
                <input
                  type="number"
                  value={newRate.minOrderAmount || ''}
                  onChange={(e) => setNewRate({...newRate, minOrderAmount: e.target.value === '' ? '' : parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="1000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Weight (kg)</label>
                <input
                  type="number"
                  value={newRate.maxWeight || ''}
                  onChange={(e) => setNewRate({...newRate, maxWeight: e.target.value === '' ? '' : parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="5"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Time</label>
                <input
                  type="text"
                  value={newRate.deliveryTime || ''}
                  onChange={(e) => setNewRate({...newRate, deliveryTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                  placeholder="e.g., 3-5 business days"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newRate.isActive || false}
                    onChange={(e) => setNewRate({...newRate, isActive: e.target.checked})}
                    className="rounded border-gray-300 text-[#1E90FF] focus:ring-[#1E90FF]"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active</span>
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => {
                  setIsAddingNew(false);
                  setEditingId(null);
                  setNewRate({});
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={isAddingNew ? handleSaveNew : handleSaveEdit}
                className="px-4 py-2 bg-[#1E90FF] text-white rounded-lg hover:bg-[#0EA5E9] transition-colors duration-200 flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{isAddingNew ? 'Add Rate' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Shipping Rates List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Shipping Rates</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pricing
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {shippingRates.map((rate) => (
                  <tr key={rate.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTypeIcon(rate.type)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{rate.name}</div>
                          <div className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(rate.type)}`}>
                            {rate.type.replace('_', ' ').toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>Base: ₹{rate.baseRate}</div>
                        {rate.perKgRate && <div>Per kg: ₹{rate.perKgRate}</div>}
                        {rate.minOrderAmount && <div>Min order: ₹{rate.minOrderAmount}</div>}
                        {rate.maxWeight && <div>Max weight: {rate.maxWeight}kg</div>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {rate.deliveryTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(rate.id)}
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          rate.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {rate.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(rate)}
                        className="text-[#1E90FF] hover:text-[#0EA5E9] flex items-center space-x-1"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(rate.id)}
                        className="text-red-600 hover:text-red-800 flex items-center space-x-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shipping Settings */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Free Shipping Threshold (₹)
              </label>
              <input
                type="number"
                defaultValue="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                placeholder="1000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Delivery Distance (km)
              </label>
              <input
                type="number"
                defaultValue="50"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                placeholder="50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Handling Fee (₹)
              </label>
              <input
                type="number"
                defaultValue="25"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                placeholder="25"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Insurance Fee (₹)
              </label>
              <input
                type="number"
                defaultValue="10"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                placeholder="10"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <button className="bg-[#1E90FF] text-white px-6 py-2 rounded-lg hover:bg-[#0EA5E9] transition-colors duration-200">
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

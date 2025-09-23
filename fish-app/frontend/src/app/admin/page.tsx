'use client';

import { useState, useEffect } from 'react';
import { Fish, fishApi, orderApi, Order } from '@/lib/api';
import { Plus, Edit, Trash2, Eye, Package } from 'lucide-react';

export default function AdminPage() {
  const [fishes, setFishes] = useState<Fish[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'fishes' | 'orders'>('fishes');
  const [showFishForm, setShowFishForm] = useState(false);
  const [editingFish, setEditingFish] = useState<Fish | null>(null);
  const [fishForm, setFishForm] = useState({
    name: '',
    image: '',
    price: 0,
    priceUnit: 'per_kg' as 'per_kg' | 'per_piece',
    description: '',
    category: 'fresh',
    availability: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [fishesRes, ordersRes] = await Promise.all([
        fishApi.getAll(),
        orderApi.getAll()
      ]);
      setFishes(fishesRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFish) {
        await fishApi.update(editingFish._id, fishForm);
      } else {
        await fishApi.create(fishForm);
      }
      await fetchData();
      setShowFishForm(false);
      setEditingFish(null);
      setFishForm({
        name: '',
        image: '',
        price: 0,
        priceUnit: 'per_kg',
        description: '',
        category: 'fresh',
        availability: true
      });
    } catch (error) {
      console.error('Error saving fish:', error);
    }
  };

  const handleEditFish = (fish: Fish) => {
    setEditingFish(fish);
    setFishForm({
      name: fish.name,
      image: fish.image,
      price: fish.price,
      priceUnit: fish.priceUnit,
      description: fish.description || '',
      category: fish.category || 'fresh',
      availability: fish.availability
    });
    setShowFishForm(true);
  };

  const handleDeleteFish = async (id: string) => {
    if (confirm('Are you sure you want to delete this fish?')) {
      try {
        await fishApi.delete(id);
        await fetchData();
      } catch (error) {
        console.error('Error deleting fish:', error);
      }
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await orderApi.updateStatus(orderId, status);
      await fetchData();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your fish inventory and orders</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('fishes')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'fishes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Fish Inventory ({fishes.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'orders'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Orders ({orders.length})
          </button>
        </nav>
      </div>

      {/* Fish Management */}
      {activeTab === 'fishes' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Fish Inventory</h2>
            <button
              onClick={() => setShowFishForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Fish</span>
            </button>
          </div>

          {/* Fish Form Modal */}
          {showFishForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">
                  {editingFish ? 'Edit Fish' : 'Add New Fish'}
                </h3>
                <form onSubmit={handleFishSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={fishForm.name}
                      onChange={(e) => setFishForm({...fishForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input
                      type="url"
                      value={fishForm.image}
                      onChange={(e) => setFishForm({...fishForm, image: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                      <input
                        type="number"
                        value={fishForm.price}
                        onChange={(e) => setFishForm({...fishForm, price: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                      <select
                        value={fishForm.priceUnit}
                        onChange={(e) => setFishForm({...fishForm, priceUnit: e.target.value as 'per_kg' | 'per_piece'})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="per_kg">Per KG</option>
                        <option value="per_piece">Per Piece</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={fishForm.description}
                      onChange={(e) => setFishForm({...fishForm, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={fishForm.availability}
                        onChange={(e) => setFishForm({...fishForm, availability: e.target.checked})}
                        className="mr-2"
                      />
                      Available
                    </label>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowFishForm(false);
                        setEditingFish(null);
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      {editingFish ? 'Update' : 'Add'} Fish
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Fish List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fishes.map((fish) => (
              <div key={fish._id} className="bg-white rounded-lg shadow-md p-4">
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  <img
                    src={fish.image}
                    alt={fish.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{fish.name}</h3>
                <p className="text-blue-600 font-bold text-xl mb-2">
                  ₹{fish.price} / {fish.priceUnit === 'per_kg' ? 'kg' : 'piece'}
                </p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{fish.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    fish.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {fish.availability ? 'Available' : 'Out of Stock'}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditFish(fish)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteFish(fish._id)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders Management */}
      {activeTab === 'orders' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Orders</h2>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order._id.slice(-8)}
                    </h3>
                    <p className="text-gray-600">{order.customerName} • {order.customerPhone}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-blue-600">₹{order.total.toFixed(2)}</p>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className="mt-2 px-3 py-1 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Items:</p>
                  <div className="space-y-1">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.fishName} × {item.quantity}</span>
                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600">
                    <strong>Address:</strong> {order.customerAddress}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

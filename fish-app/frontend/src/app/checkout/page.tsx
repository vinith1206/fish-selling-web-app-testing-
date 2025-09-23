'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { orderApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { state, clearCart } = useCart();
  const router = useRouter();
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
  });
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const deliveryCharge = 50;
  const total = state.total + deliveryCharge;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.customerPhone || !formData.customerAddress) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerAddress: formData.customerAddress,
        items: state.items.map(item => ({
          fishId: item.fish._id,
          fishName: item.fish.name,
          quantity: item.quantity,
          price: item.fish.price,
          priceUnit: item.fish.priceUnit,
        })),
        subtotal: state.total,
        deliveryCharge,
        total,
      };

      const response = await orderApi.create(orderData);
      
      if (response.data.success) {
        setOrderId(response.data.order._id);
        setOrderSuccess(true);
        clearCart();
      } else {
        throw new Error('Order creation failed');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (state.items.length === 0 && !orderSuccess) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16 bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl">
          <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-4xl">🛒</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
          <p className="text-gray-600 mb-8 text-lg">Add some items to your cart before checking out.</p>
          <Link 
            href="/" 
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            🐟 Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-12">
          <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🎉 Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-6 text-lg">
            Thank you for your order! We've sent the invoice to the seller via WhatsApp.
            {orderId && (
              <span className="block mt-4 text-sm bg-white px-4 py-2 rounded-lg inline-block font-mono">
                Order ID: #{orderId.slice(-8)}
              </span>
            )}
          </p>
          <div className="space-y-4">
            <Link 
              href="/" 
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl inline-block"
            >
              🐟 Continue Shopping
            </Link>
            <div className="text-sm text-gray-500 mt-4">
              <p>📱 You'll receive updates via WhatsApp</p>
              <p>🚚 Delivery within 2-4 hours</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-8">
        <Link href="/cart" className="mr-4 text-gray-600 hover:text-gray-800">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-3">👤</span>
                Customer Information
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="customerName" className="block text-sm font-bold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="customerPhone" className="block text-sm font-bold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="customerPhone"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="customerAddress" className="block text-sm font-bold text-gray-700 mb-2">
                    Delivery Address *
                  </label>
                  <textarea
                    id="customerAddress"
                    name="customerAddress"
                    value={formData.customerAddress}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg resize-none"
                    placeholder="Enter your complete delivery address"
                    required
                  />
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white py-4 px-6 rounded-xl hover:from-[#16A34A] hover:to-[#15803D] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {loading ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Placing Order...</span>
                </>
              ) : (
                <>
                  <span>🛒</span>
                  <span>Place Order - ₹{total.toFixed(2)}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-lg p-6 sticky top-24 border border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-2">📋</span>
              Order Summary
            </h2>
            
            <div className="space-y-4 mb-6">
              {state.items.map((item) => (
                <div key={item.fish._id} className="flex justify-between items-center py-2 bg-white rounded-lg px-3">
                  <span className="text-gray-700 font-medium">
                    {item.fish.name} × {item.quantity}
                  </span>
                  <span className="font-bold text-[#1E90FF]">₹{(item.fish.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              
              <div className="border-t-2 border-blue-200 pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Subtotal</span>
                  <span className="font-bold text-lg">₹{state.total.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Delivery Charge</span>
                  <span className="font-bold text-lg">₹{deliveryCharge.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center text-xl font-bold pt-3 border-t border-blue-200">
                  <span className="text-gray-900">Total</span>
                  <span className="text-[#1E90FF] text-2xl">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 text-sm text-gray-600 space-y-2">
              <p className="flex items-center">📱 Order will be confirmed via WhatsApp</p>
              <p className="flex items-center">🚚 Delivery within 2-4 hours</p>
              <p className="flex items-center">🐟 Fresh fish guaranteed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useCart } from '@/contexts/CartContext';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { state, updateQuantity, removeFromCart, clearCart } = useCart();
  const deliveryCharge = 50;

  if (state.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
          <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <ShoppingBag className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
          <p className="text-gray-600 mb-8 text-lg">Add some fresh fish to get started!</p>
          <Link 
            href="/" 
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            🐟 Browse Fresh Fish
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <button
          onClick={clearCart}
          className="text-red-600 hover:text-red-700 text-sm font-medium"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {state.items.map((item) => (
              <div key={item.fish._id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <div className="relative h-24 w-24 flex-shrink-0 rounded-xl overflow-hidden">
                    <Image
                      src={item.fish.image}
                      alt={item.fish.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{item.fish.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      ₹{item.fish.price} / {item.fish.priceUnit === 'per_kg' ? 'kg' : 'piece'}
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      ₹{(item.fish.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center bg-gray-100 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.fish._id, item.quantity - 1)}
                        className="p-2 rounded-l-lg hover:bg-gray-200 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      
                      <span className="w-12 text-center font-bold text-lg px-2">{item.quantity}</span>
                      
                      <button
                        onClick={() => updateQuantity(item.fish._id, item.quantity + 1)}
                        className="p-2 rounded-r-lg hover:bg-gray-200 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.fish._id)}
                      className="p-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-lg p-6 sticky top-24 border border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-2">📋</span>
              Order Summary
            </h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 font-medium">Subtotal ({state.itemCount} items)</span>
                <span className="font-bold text-lg">₹{state.total.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 font-medium">Delivery Charge</span>
                <span className="font-bold text-lg">₹{deliveryCharge.toFixed(2)}</span>
              </div>
              
              <div className="border-t-2 border-blue-200 pt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-blue-600 text-2xl">₹{(state.total + deliveryCharge).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
            <Link
              href="/checkout"
              className="w-full bg-gradient-to-r from-[#1E90FF] to-[#0EA5E9] text-white py-4 px-6 rounded-xl hover:from-[#0EA5E9] hover:to-[#06B6D4] transition-all duration-200 text-center block font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🛒 Proceed to Checkout
            </Link>
              
              <Link
                href="/"
                className="w-full bg-white text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-all duration-200 text-center block font-medium border border-gray-200 hover:border-gray-300"
              >
                🐟 Continue Shopping
              </Link>
            </div>
            
            <div className="mt-6 text-xs text-gray-500 text-center">
              <p>✅ Free delivery on orders over ₹500</p>
              <p>🕐 Delivery within 2-4 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useCart } from '@/contexts/CartContext';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { state, updateQuantity, removeFromCart, clearCart } = useCart();
  const router = useRouter();

  // Total weight in grams for all items
  const totalWeightGrams = state.items.reduce((sum, item) => {
    const perUnitWeight = item.fish.weight || 0; // grams per unit
    return sum + perUnitWeight * item.quantity;
  }, 0);
  const totalWeightKg = totalWeightGrams / 1000;

  // Delivery charge: ₹90 × exact weight in kg, minimum ₹90
  const deliveryCharge = totalWeightKg > 0 ? Math.max(90, Math.round(90 * totalWeightKg * 100) / 100) : 0;
  const total = state.total + deliveryCharge;


  const handleQuantityChange = (fishId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(fishId);
    } else {
      updateQuantity(fishId, newQuantity);
    }
  };

  const handleProceedToCheckout = () => {
    if (state.items.length === 0) return;
    router.push('/checkout');
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Add some fresh fish to get started!</p>
            
            <div className="flex gap-4 justify-center">
              <Link href="/" className="btn-primary">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Cart Items ({state.itemCount})
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {state.items.map((item) => (
                  <div key={item.fish._id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center space-x-4">
                      {/* Fish Image */}
                      <div className="relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.fish.image}
                          alt={item.fish.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      {/* Fish Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {item.fish.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {item.fish.priceUnit === 'per_kg' ? 'per kg' : 'per piece'}
                        </p>
                        <div className="flex items-center space-x-2">
                          {(() => {
                            const rawOriginal = (item.fish as any).originalPrice;
                            const original = typeof rawOriginal === 'number' && rawOriginal > 0 ? rawOriginal : item.fish.price;
                            const dp = (item.fish as any).discountPrice;
                            const hasPct = typeof item.fish.discount === 'number' && item.fish.discount > 0;
                            const pctPrice = hasPct ? Number((original * (1 - (item.fish.discount as number) / 100)).toFixed(2)) : undefined;
                            const discounted = typeof dp === 'number' && dp > 0 ? dp : pctPrice;

                            if (typeof discounted === 'number' && discounted > 0 && discounted < original) {
                              return (
                                <>
                                  <span className="text-lg font-bold text-[#1E90FF]">₹{discounted}</span>
                                  <span className="text-sm text-gray-400 line-through">₹{original}</span>
                                </>
                              );
                            }
                            return <span className="text-lg font-bold text-[#1E90FF]">₹{original}</span>;
                          })()}
                        </div>
                        {typeof item.fish.weight === 'number' && item.fish.weight > 0 && (
                          <p className="text-sm text-gray-600 mt-1">
                            Weight: {(item.fish.weight * item.quantity).toFixed(0)} g
                          </p>
                        )}
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleQuantityChange(item.fish._id, item.quantity - 1)}
                          className="p-2 text-gray-600 hover:text-[#1E90FF] hover:bg-blue-50 rounded-lg transition-all duration-200"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        
                        <span className="text-lg font-bold text-gray-900 min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => handleQuantityChange(item.fish._id, item.quantity + 1)}
                          className="p-2 text-gray-600 hover:text-[#1E90FF] hover:bg-blue-50 rounded-lg transition-all duration-200"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {/* Item Total */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {(() => {
                            const rawOriginal = (item.fish as any).originalPrice;
                            const original = typeof rawOriginal === 'number' && rawOriginal > 0 ? rawOriginal : item.fish.price;
                            const dp = (item.fish as any).discountPrice;
                            const hasPct = typeof item.fish.discount === 'number' && item.fish.discount > 0;
                            const pctPrice = hasPct ? Number((original * (1 - (item.fish.discount as number) / 100)).toFixed(2)) : undefined;
                            const discounted = typeof dp === 'number' && dp > 0 ? dp : pctPrice;
                            const effectivePrice = typeof discounted === 'number' && discounted > 0 && discounted < original ? discounted : original;
                            return `₹${(effectivePrice * item.quantity).toFixed(2)}`;
                          })()}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.fish._id)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({state.itemCount} items)</span>
                  <span>₹{state.total.toFixed(2)}</span>
                </div>

                {totalWeightGrams > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Total Weight</span>
                    <span>{totalWeightGrams.toFixed(0)} g ({totalWeightKg.toFixed(2)} kg)</span>
                  </div>
                )}
                
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charge</span>
                  <span>₹{deliveryCharge.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleProceedToCheckout}
                className="w-full btn-primary mt-6 text-lg py-4"
              >
                Proceed to Checkout
              </button>
              
              <Link
                href="/"
                className="w-full block text-center text-gray-600 hover:text-[#1E90FF] font-medium mt-4 transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4 inline mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Phone, User, Truck, Clock, DollarSign } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import PincodeInput from '@/components/PincodeInput';
import { HybridPincodeData } from '@/services/hybridPincodeService';

export default function CheckoutPage() {
  const { state, clearCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    country: 'India',
    streetAddress1: '',
    streetAddress2: '',
    city: '',
    state: '',
    zipcode: '',
    phone: '',
    email: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedShipping, setSelectedShipping] = useState<string>('standard');
  const [pincodeData, setPincodeData] = useState<HybridPincodeData | null>(null);
  const [shippingRates, setShippingRates] = useState([
    {
      id: 'standard',
      name: 'Standard Delivery',
      price: 50,
      deliveryTime: '3-5 business days',
      icon: 'truck'
    },
    {
      id: 'express',
      name: 'Express Delivery',
      price: 100,
      deliveryTime: '1-2 business days',
      icon: 'clock'
    },
    {
      id: 'same_day',
      name: 'Same Day Delivery',
      price: 200,
      deliveryTime: 'Same day (within 6 hours)',
      icon: 'map'
    }
  ]);

  const selectedShippingRate = shippingRates.find(rate => rate.id === selectedShipping) || shippingRates[0];
  
  const deliveryCharge = pincodeData?.isServiceable 
    ? (pincodeData.shippingCost || selectedShippingRate.price)
    : selectedShippingRate.price;
  
  const total = state.total + deliveryCharge;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.streetAddress1.trim()) newErrors.streetAddress1 = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipcode.trim()) {
      newErrors.zipcode = 'Pincode is required';
    } else if (!/^[0-9]{6}$/.test(formData.zipcode)) {
      newErrors.zipcode = 'Please enter a valid 6-digit pincode';
    } else if (pincodeData && !pincodeData.isServiceable) {
      newErrors.zipcode = 'Delivery not available to this pincode';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const orderId = `ORD-${Date.now()}`;
      clearCart();
      const orderData = {
        orderId,
        billingDetails: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          companyName: formData.companyName,
          country: formData.country,
          streetAddress1: formData.streetAddress1,
          streetAddress2: formData.streetAddress2,
          city: formData.city,
          state: formData.state,
          zipcode: formData.zipcode,
          phone: formData.phone,
          email: formData.email,
        },
        items: state.items.map(item => ({
          name: item.fish.name,
          quantity: item.quantity,
          price: item.fish.price,
          total: item.fish.price * item.quantity
        })),
        subtotal: state.total,
        shippingMethod: selectedShippingRate.name,
        deliveryCharge: deliveryCharge,
        total: total,
        orderTime: new Date().toLocaleString(),
      };
      sessionStorage.setItem('orderData', JSON.stringify(orderData));
      router.push(`/confirmation?orderId=${orderId}`);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">No Items in Cart</h1>
          <p className="text-gray-600 mb-8">Add some items to your cart first.</p>
          <Link href="/" className="btn-primary">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your order to get fresh fish delivered</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent transition-all duration-200 ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent transition-all duration-200 ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name (Optional)
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent transition-all duration-200"
                  placeholder="Enter your company name"
                />
              </div>
              
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                  Country / Region <span className="text-red-500">*</span>
                </label>
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                  India
                </div>
              </div>
              
              <div>
                <label htmlFor="streetAddress1" className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="streetAddress1"
                  name="streetAddress1"
                  value={formData.streetAddress1}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent transition-all duration-200 ${
                    errors.streetAddress1 ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="House number and street name"
                />
                {errors.streetAddress1 && (
                  <p className="text-red-500 text-sm mt-1">{errors.streetAddress1}</p>
                )}
                
                <input
                  type="text"
                  id="streetAddress2"
                  name="streetAddress2"
                  value={formData.streetAddress2}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent transition-all duration-200 mt-2"
                  placeholder="Apartment, suite, unit, etc. (optional)"
                />
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  Town / City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent transition-all duration-200 ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your city"
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent transition-all duration-200 ${
                    errors.state ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select your state</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                  <option value="Assam">Assam</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Chhattisgarh">Chhattisgarh</option>
                  <option value="Goa">Goa</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Manipur">Manipur</option>
                  <option value="Meghalaya">Meghalaya</option>
                  <option value="Mizoram">Mizoram</option>
                  <option value="Nagaland">Nagaland</option>
                  <option value="Odisha">Odisha</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Sikkim">Sikkim</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Tripura">Tripura</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Chandigarh">Chandigarh</option>
                  <option value="Puducherry">Puducherry</option>
                </select>
                {errors.state && (
                  <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700 mb-2">
                  PIN Code <span className="text-red-500">*</span>
                </label>
                <PincodeInput
                  value={formData.zipcode}
                  onChange={(pincode) => setFormData(prev => ({ ...prev, zipcode: pincode }))}
                  onPincodeData={setPincodeData}
                  placeholder="Enter 6-digit pincode"
                  required
                />
                {errors.zipcode && (
                  <p className="text-red-500 text-sm mt-1">{errors.zipcode}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent transition-all duration-200 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-gray-500 text-sm">(Optional)</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent transition-all duration-200 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email address (optional)"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Truck className="h-4 w-4 inline mr-2" />
                  Shipping Method
                </label>
                <div className="space-y-3">
                  {shippingRates.map((rate) => (
                    <div
                      key={rate.id}
                      onClick={() => setSelectedShipping(rate.id)}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        selectedShipping === rate.id
                          ? 'border-[#1E90FF] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            selectedShipping === rate.id ? 'bg-[#1E90FF] text-white' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {rate.icon === 'truck' && <Truck className="h-5 w-5" />}
                            {rate.icon === 'clock' && <Clock className="h-5 w-5" />}
                            {rate.icon === 'map' && <MapPin className="h-5 w-5" />}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{rate.name}</h3>
                            <p className="text-sm text-gray-600">{rate.deliveryTime}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-[#1E90FF]">₹{rate.price}</div>
                          {rate.id === 'same_day' && (
                            <div className="text-xs text-red-600">Limited availability</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'btn-primary hover:scale-105 active:scale-95'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="spinner h-5 w-5 mr-3"></div>
                    Processing Order...
                  </div>
                ) : (
                  'Confirm Order'
                )}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {state.items.map((item) => (
                <div key={item.fish._id} className="flex items-center space-x-4">
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.fish.image}
                      alt={item.fish.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {item.fish.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {item.quantity} × ₹{item.fish.price}
                    </p>
                  </div>
                  
                  <div className="text-sm font-bold text-gray-900">
                    ₹{(item.fish.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({state.itemCount} items)</span>
                <span>₹{state.total.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <div>
                  <span>Delivery Charge</span>
                  <div className="text-xs text-gray-500">
                    {pincodeData?.isServiceable 
                      ? `${pincodeData.city}, ${pincodeData.state} - ${selectedShippingRate.name}`
                      : selectedShippingRate.name
                    }
                  </div>
                </div>
                <span>₹{deliveryCharge.toFixed(2)}</span>
              </div>
              
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <Link
              href="/cart"
              className="w-full block text-center text-gray-600 hover:text-[#1E90FF] font-medium mt-6 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 inline mr-2" />
              Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

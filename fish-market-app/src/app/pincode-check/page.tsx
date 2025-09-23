'use client';

import { useState } from 'react';
import { MapPin, Search, CheckCircle, XCircle, Clock, Truck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import PincodeInput from '@/components/PincodeInput';
import { PincodeData, searchPincodes, getPopularCities } from '@/services/pincodeService';

export default function PincodeCheckPage() {
  const [pincodeData, setPincodeData] = useState<PincodeData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PincodeData[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchPincodes(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const popularCities = getPopularCities();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-[#1E90FF] hover:text-[#0EA5E9] mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Check Delivery Availability</h1>
          <p className="text-gray-600 mt-2">Enter your pincode to check if we deliver to your area</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pincode Checker */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Check Your Pincode</h2>
            
            <PincodeInput
              value=""
              onChange={(pincode) => {
                // This will be handled by the PincodeInput component
              }}
              onPincodeData={setPincodeData}
              placeholder="Enter 6-digit pincode"
            />

            {/* Search by City */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Search by City</h3>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                  placeholder="Search by city name..."
                />
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                  {searchResults.map((result) => (
                    <div
                      key={result.pincode}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setPincodeData(result);
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{result.city}</div>
                          <div className="text-sm text-gray-500">{result.district}, {result.state}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-sm text-gray-600">{result.pincode}</div>
                          <div className={`text-xs ${
                            result.isServiceable ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {result.isServiceable ? 'Available' : 'Not Available'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Results Display */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Delivery Information</h2>
            
            {pincodeData ? (
              <div className={`p-6 rounded-xl border-2 ${
                pincodeData.isServiceable 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-full ${
                    pincodeData.isServiceable 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {pincodeData.isServiceable ? (
                      <CheckCircle className="h-8 w-8" />
                    ) : (
                      <XCircle className="h-8 w-8" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold ${
                      pincodeData.isServiceable ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {pincodeData.isServiceable ? 'Delivery Available!' : 'Delivery Not Available'}
                    </h3>
                    
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-gray-600" />
                        <div>
                          <div className="font-medium text-gray-900">{pincodeData.city}</div>
                          <div className="text-sm text-gray-600">{pincodeData.district}, {pincodeData.state}</div>
                          <div className="text-sm text-gray-500">Pincode: {pincodeData.pincode}</div>
                        </div>
                      </div>

                      {pincodeData.isServiceable && (
                        <>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-5 w-5 text-gray-600" />
                            <span className="text-gray-700">Delivery Time: {pincodeData.deliveryTime}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Truck className="h-5 w-5 text-gray-600" />
                            <span className="text-gray-700">Shipping Cost: ₹{pincodeData.shippingCost}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {pincodeData.isServiceable && (
                      <div className="mt-6">
                        <Link
                          href="/"
                          className="inline-flex items-center px-6 py-3 bg-[#1E90FF] text-white rounded-lg hover:bg-[#0EA5E9] transition-colors duration-200"
                        >
                          <MapPin className="h-5 w-5 mr-2" />
                          Start Shopping
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Enter Your Pincode</h3>
                <p className="text-gray-600">Check delivery availability to your area</p>
              </div>
            )}
          </div>
        </div>

        {/* Popular Cities */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Cities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularCities.map((city) => (
              <button
                key={city.pincode}
                onClick={() => setPincodeData(city)}
                className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-left group"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    city.isServiceable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{city.city}</div>
                    <div className="text-xs text-gray-500 truncate">{city.state}</div>
                    <div className="text-xs font-mono text-gray-400">{city.pincode}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Delivery Information */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Delivery Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-sm text-gray-600">Same day delivery in major cities</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Live Fish Guarantee</h3>
              <p className="text-sm text-gray-600">100% live fish delivery guarantee</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Flexible Timing</h3>
              <p className="text-sm text-gray-600">Delivery between 10 AM - 8 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

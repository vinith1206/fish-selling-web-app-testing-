'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Search, CheckCircle, XCircle, Clock, Truck } from 'lucide-react';
import { getHybridPincodeData, validateHybridPincode, HybridPincodeData } from '@/services/hybridPincodeService';

interface PincodeInputProps {
  value: string;
  onChange: (pincode: string) => void;
  onPincodeData?: (data: HybridPincodeData | null) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export default function PincodeInput({
  value,
  onChange,
  onPincodeData,
  placeholder = "Enter 6-digit pincode",
  className = "",
  required = false
}: PincodeInputProps) {
  const [isValidating, setIsValidating] = useState(false);
  const [pincodeData, setPincodeData] = useState<HybridPincodeData | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Validate pincode when value changes
  useEffect(() => {
    if (value.length === 6) {
      validatePincodeAsync(value);
    } else {
      setPincodeData(null);
      setError(null);
      onPincodeData?.(null);
    }
  }, [value, onPincodeData]);

  const validatePincodeAsync = async (pincode: string) => {
    setIsValidating(true);
    setError(null);
    try {
      if (!validateHybridPincode(pincode)) {
        setError('Please enter a valid 6-digit pincode');
        setPincodeData(null);
        onPincodeData?.(null);
        return;
      }
      const data = await getHybridPincodeData(pincode);
      if (data) {
        setPincodeData(data);
        onPincodeData?.(data);
        setError(null);
      } else {
        setError('Pincode not found in our database');
        setPincodeData(null);
        onPincodeData?.(null);
      }
    } catch (err) {
      setError('Error validating pincode');
      setPincodeData(null);
      onPincodeData?.(null);
    } finally {
      setIsValidating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (inputValue.length <= 6) {
      onChange(inputValue);
    }
  };

  const handleInputFocus = () => setShowSuggestions(true);
  const handleInputBlur = () => setTimeout(() => setShowSuggestions(false), 200);

  const getInputState = () => {
    if (isValidating) return 'validating';
    if (error) return 'error';
    if (pincodeData?.isServiceable) return 'success';
    if (pincodeData && !pincodeData.isServiceable) return 'warning';
    return 'default';
  };

  const inputState = getInputState();

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          maxLength={6}
          className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent transition-all duration-200 ${
            inputState === 'error' 
              ? 'border-red-300 bg-red-50' 
              : inputState === 'success' 
              ? 'border-green-300 bg-green-50' 
              : inputState === 'warning'
              ? 'border-yellow-300 bg-yellow-50'
              : 'border-gray-300'
          }`}
          required={required}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {isValidating ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#1E90FF]"></div>
          ) : inputState === 'success' ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : inputState === 'error' || inputState === 'warning' ? (
            <XCircle className="h-5 w-5 text-red-500" />
          ) : (
            <Search className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Pincode Data Display */}
      {pincodeData && (
        <div className={`mt-3 p-4 rounded-lg border ${
          pincodeData.isServiceable 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-full ${
              pincodeData.isServiceable 
                ? 'bg-green-100 text-green-600' 
                : 'bg-red-100 text-red-600'
            }`}>
              {pincodeData.isServiceable ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
            </div>
            <div className="flex-1">
              <h4 className={`font-semibold ${
                pincodeData.isServiceable ? 'text-green-800' : 'text-red-800'
              }`}>
                {pincodeData.isServiceable ? 'Delivery Available' : 'Delivery Not Available'}
              </h4>
              <p className={`text-sm ${
                pincodeData.isServiceable ? 'text-green-700' : 'text-red-700'
              }`}>
                {pincodeData.city}, {pincodeData.district}, {pincodeData.state}
              </p>
              {pincodeData.isServiceable && (
                <div className="mt-2 flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span className="text-green-700">{pincodeData.deliveryTime}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Truck className="h-4 w-4 text-green-600" />
                    <span className="text-green-700">₹{pincodeData.shippingCost} shipping</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-2 flex items-center space-x-2 text-red-600 text-sm">
          <XCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Quick Pincode Suggestions */}
      {showSuggestions && value.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          <div className="p-3 border-b border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700">Popular Cities</h4>
          </div>
          <div className="p-2">
            {[
              { pincode: '110001', city: 'New Delhi', state: 'Delhi' },
              { pincode: '400001', city: 'Mumbai', state: 'Maharashtra' },
              { pincode: '560001', city: 'Bangalore', state: 'Karnataka' },
              { pincode: '600001', city: 'Chennai', state: 'Tamil Nadu' },
              { pincode: '700001', city: 'Kolkata', state: 'West Bengal' },
              { pincode: '380001', city: 'Ahmedabad', state: 'Gujarat' }
            ].map((suggestion) => (
              <button
                key={suggestion.pincode}
                onClick={() => {
                  onChange(suggestion.pincode);
                  setShowSuggestions(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md text-sm"
              >
                <div className="font-medium text-gray-900">{suggestion.city}</div>
                <div className="text-gray-500">{suggestion.state} - {suggestion.pincode}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

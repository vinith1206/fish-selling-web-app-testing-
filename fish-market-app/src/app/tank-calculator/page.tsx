'use client';

import { useState } from 'react';
import { Fish } from '@/types';
import { Calculator, Droplets, Thermometer, Gauge, Info } from 'lucide-react';

const fishDatabase: Fish[] = [
  { _id: '1', name: 'Neon Tetra', category: 'community', careLevel: 'beginner', tankSize: '10 gallons', waterTemp: '72-78°F', waterPH: '6.0-7.0', schooling: true, groupSize: 6, price: 25, priceUnit: 'per_piece', availability: 'in_stock', image: '', description: 'Bright, colorful schooling fish' },
  { _id: '2', name: 'Betta Fish', category: 'solo', careLevel: 'beginner', tankSize: '5 gallons', waterTemp: '76-82°F', waterPH: '6.5-7.5', schooling: false, groupSize: 1, price: 150, priceUnit: 'per_piece', availability: 'in_stock', image: '', description: 'Beautiful, vibrant fish' },
  { _id: '3', name: 'Angelfish', category: 'semi-aggressive', careLevel: 'intermediate', tankSize: '30 gallons', waterTemp: '75-82°F', waterPH: '6.0-7.5', schooling: false, groupSize: 1, price: 300, priceUnit: 'per_piece', availability: 'in_stock', image: '', description: 'Elegant cichlid' },
  { _id: '4', name: 'Guppy', category: 'community', careLevel: 'beginner', tankSize: '10 gallons', waterTemp: '72-82°F', waterPH: '7.0-8.5', schooling: true, groupSize: 3, price: 35, priceUnit: 'per_piece', availability: 'in_stock', image: '', description: 'Colorful, hardy fish' },
  { _id: '5', name: 'Goldfish', category: 'coldwater', careLevel: 'beginner', tankSize: '20 gallons', waterTemp: '65-75°F', waterPH: '6.5-8.0', schooling: true, groupSize: 2, price: 80, priceUnit: 'per_piece', availability: 'in_stock', image: '', description: 'Classic aquarium fish' },
  { _id: '6', name: 'Discus', category: 'expert', careLevel: 'expert', tankSize: '50 gallons', waterTemp: '82-86°F', waterPH: '6.0-7.0', schooling: true, groupSize: 4, price: 1200, priceUnit: 'per_piece', availability: 'sold_out', image: '', description: 'King of freshwater fish' }
];

interface TankSetup {
  fish: Fish;
  quantity: number;
}

export default function TankCalculator() {
  const [tankSetup, setTankSetup] = useState<TankSetup[]>([]);
  const [tankDimensions, setTankDimensions] = useState({
    length: '',
    width: '',
    height: ''
  });

  const addFish = (fish: Fish) => {
    const existingFish = tankSetup.find(f => f.fish._id === fish._id);
    if (existingFish) {
      setTankSetup(tankSetup.map(f => 
        f.fish._id === fish._id 
          ? { ...f, quantity: f.quantity + 1 }
          : f
      ));
    } else {
      setTankSetup([...tankSetup, { fish, quantity: 1 }]);
    }
  };

  const updateQuantity = (fishId: string, quantity: number) => {
    if (quantity === 0) {
      setTankSetup(tankSetup.filter(f => f.fish._id !== fishId));
    } else {
      setTankSetup(tankSetup.map(f => 
        f.fish._id === fishId 
          ? { ...f, quantity }
          : f
      ));
    }
  };

  const calculateTankVolume = () => {
    const length = parseFloat(tankDimensions.length) || 0;
    const width = parseFloat(tankDimensions.width) || 0;
    const height = parseFloat(tankDimensions.height) || 0;
    
    if (length && width && height) {
      // Convert inches to gallons (assuming dimensions are in inches)
      const volumeInches = length * width * height;
      const volumeGallons = volumeInches / 231; // 1 gallon = 231 cubic inches
      return Math.round(volumeGallons * 10) / 10;
    }
    return 0;
  };

  const getRequiredTankSize = () => {
    if (tankSetup.length === 0) return 0;
    
    const tankSizes = tankSetup.map(setup => {
      const size = setup.fish.tankSize?.match(/(\d+)/)?.[1];
      return size ? parseInt(size) : 0;
    });
    
    return Math.max(...tankSizes);
  };

  const getTotalFish = () => {
    return tankSetup.reduce((total, setup) => total + setup.quantity, 0);
  };

  const getWaterParameters = () => {
    if (tankSetup.length === 0) return null;
    
    const temps = tankSetup.map(setup => {
      const temp = setup.fish.waterTemp?.match(/(\d+)-(\d+)/);
      return temp ? { min: parseInt(temp[1]), max: parseInt(temp[2]) } : null;
    }).filter(Boolean);
    
    const phs = tankSetup.map(setup => {
      const ph = setup.fish.waterPH?.match(/(\d+\.?\d*)-(\d+\.?\d*)/);
      return ph ? { min: parseFloat(ph[1]), max: parseFloat(ph[2]) } : null;
    }).filter(Boolean);
    
    if (temps.length === 0 || phs.length === 0) return null;
    
    const tempMin = Math.max(...temps.map(t => t!.min));
    const tempMax = Math.min(...temps.map(t => t!.max));
    const phMin = Math.max(...phs.map(p => p!.min));
    const phMax = Math.min(...phs.map(p => p!.max));
    
    return {
      temperature: tempMin <= tempMax ? `${tempMin}-${tempMax}°F` : 'Incompatible',
      ph: phMin <= phMax ? `${phMin}-${phMax}` : 'Incompatible'
    };
  };

  const getCompatibilityIssues = () => {
    const issues: string[] = [];
    
    // Check for incompatible water parameters
    const waterParams = getWaterParameters();
    if (waterParams?.temperature === 'Incompatible') {
      issues.push('Incompatible temperature requirements');
    }
    if (waterParams?.ph === 'Incompatible') {
      issues.push('Incompatible pH requirements');
    }
    
    // Check for overcrowding
    const currentVolume = calculateTankVolume();
    const requiredSize = getRequiredTankSize();
    if (currentVolume > 0 && currentVolume < requiredSize) {
      issues.push(`Tank too small. Need at least ${requiredSize} gallons`);
    }
    
    // Check for overstocking (1 inch of fish per gallon rule)
    const totalFishLength = tankSetup.reduce((total, setup) => {
      const avgLength = setup.fish.name === 'Goldfish' ? 6 : 
                       setup.fish.name === 'Angelfish' ? 4 :
                       setup.fish.name === 'Discus' ? 6 : 2;
      return total + (setup.quantity * avgLength);
    }, 0);
    
    if (currentVolume > 0 && totalFishLength > currentVolume) {
      issues.push(`Overstocked. ${totalFishLength}" of fish in ${currentVolume} gallon tank`);
    }
    
    return issues;
  };

  const getRecommendations = () => {
    const recommendations: string[] = [];
    
    if (tankSetup.length === 0) {
      recommendations.push('Add fish to get personalized recommendations');
      return recommendations;
    }
    
    // Schooling fish recommendations
    const schoolingFish = tankSetup.filter(setup => setup.fish.schooling);
    schoolingFish.forEach(setup => {
      if (setup.quantity < (setup.fish.groupSize || 1)) {
        recommendations.push(`${setup.fish.name} should be kept in groups of at least ${setup.fish.groupSize}. Consider adding more.`);
      }
    });
    
    // Tank size recommendations
    const requiredSize = getRequiredTankSize();
    if (requiredSize > 0) {
      recommendations.push(`Minimum tank size: ${requiredSize} gallons`);
    }
    
    // Water parameter recommendations
    const waterParams = getWaterParameters();
    if (waterParams) {
      recommendations.push(`Recommended temperature: ${waterParams.temperature}`);
      recommendations.push(`Recommended pH: ${waterParams.ph}`);
    }
    
    return recommendations;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tank Size Calculator</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calculate the perfect tank size and water parameters for your aquarium setup. Add fish and enter your tank dimensions to get personalized recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Fish Selection */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Fish to Your Tank</h2>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {fishDatabase.map((fish) => (
                <div
                  key={fish._id}
                  onClick={() => addFish(fish)}
                  className="p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer transition-all duration-200"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-900">{fish.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          fish.careLevel === 'beginner' ? 'bg-green-100 text-green-800' :
                          fish.careLevel === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {fish.careLevel}
                        </span>
                        <span>{fish.tankSize}</span>
                        <span>{fish.waterTemp}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-[#1E90FF]">₹{fish.price}</div>
                      <div className="text-sm text-gray-500">per piece</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tank Setup & Results */}
          <div className="space-y-6">
            {/* Tank Dimensions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tank Dimensions</h2>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Length (inches)</label>
                  <input
                    type="number"
                    value={tankDimensions.length}
                    onChange={(e) => setTankDimensions({...tankDimensions, length: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                    placeholder="24"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Width (inches)</label>
                  <input
                    type="number"
                    value={tankDimensions.width}
                    onChange={(e) => setTankDimensions({...tankDimensions, width: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                    placeholder="12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Height (inches)</label>
                  <input
                    type="number"
                    value={tankDimensions.height}
                    onChange={(e) => setTankDimensions({...tankDimensions, height: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                    placeholder="16"
                  />
                </div>
              </div>
              
              {calculateTankVolume() > 0 && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Calculator className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-blue-900">
                      Tank Volume: {calculateTankVolume()} gallons
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Current Setup */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Tank Setup</h2>
              
              {tankSetup.length === 0 ? (
                <div className="text-center py-8">
                  <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Add fish to see your tank setup</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tankSetup.map((setup) => (
                    <div key={setup.fish._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-gray-900">{setup.fish.name}</h3>
                        <div className="text-sm text-gray-600">
                          {setup.fish.tankSize} • {setup.fish.waterTemp} • {setup.fish.waterPH}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(setup.fish._id, setup.quantity - 1)}
                          className="p-1 text-gray-600 hover:text-red-600"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold">{setup.quantity}</span>
                        <button
                          onClick={() => updateQuantity(setup.fish._id, setup.quantity + 1)}
                          className="p-1 text-gray-600 hover:text-green-600"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Analysis Results */}
            {tankSetup.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Tank Analysis</h2>
                
                <div className="space-y-4">
                  {/* Water Parameters */}
                  {getWaterParameters() && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                        <Droplets className="h-5 w-5 mr-2" />
                        Water Parameters
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Temperature:</span>
                          <span className="ml-2 text-blue-800">{getWaterParameters()?.temperature}</span>
                        </div>
                        <div>
                          <span className="font-medium">pH:</span>
                          <span className="ml-2 text-blue-800">{getWaterParameters()?.ph}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tank Size Requirements */}
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2 flex items-center">
                      <Gauge className="h-5 w-5 mr-2" />
                      Tank Size Requirements
                    </h3>
                    <div className="text-sm">
                      <div className="mb-2">
                        <span className="font-medium">Minimum tank size:</span>
                        <span className="ml-2 text-green-800">{getRequiredTankSize()} gallons</span>
                      </div>
                      <div>
                        <span className="font-medium">Total fish:</span>
                        <span className="ml-2 text-green-800">{getTotalFish()} fish</span>
                      </div>
                    </div>
                  </div>

                  {/* Issues */}
                  {getCompatibilityIssues().length > 0 && (
                    <div className="p-4 bg-red-50 rounded-lg">
                      <h3 className="font-semibold text-red-900 mb-2 flex items-center">
                        <Info className="h-5 w-5 mr-2" />
                        Issues Found
                      </h3>
                      <ul className="text-sm text-red-800 space-y-1">
                        {getCompatibilityIssues().map((issue, index) => (
                          <li key={index}>• {issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendations */}
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h3 className="font-semibold text-yellow-900 mb-2 flex items-center">
                      <Info className="h-5 w-5 mr-2" />
                      Recommendations
                    </h3>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      {getRecommendations().map((rec, index) => (
                        <li key={index}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

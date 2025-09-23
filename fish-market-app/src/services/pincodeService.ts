// Indian Pincode Service
export interface PincodeData {
  pincode: string;
  state: string;
  city: string;
  district: string;
  region: string;
  deliveryTime: string;
  shippingCost: number;
  isServiceable: boolean;
}

// Mock data for Indian pincodes (in real app, this would come from an API)
const pincodeDatabase: Record<string, PincodeData> = {
  // Major cities
  '110001': { pincode: '110001', state: 'Delhi', city: 'New Delhi', district: 'Central Delhi', region: 'North', deliveryTime: '1-2 days', shippingCost: 50, isServiceable: true },
  '400001': { pincode: '400001', state: 'Maharashtra', city: 'Mumbai', district: 'Mumbai', region: 'West', deliveryTime: '1-2 days', shippingCost: 60, isServiceable: true },
  '560001': { pincode: '560001', state: 'Karnataka', city: 'Bangalore', district: 'Bangalore Urban', region: 'South', deliveryTime: '2-3 days', shippingCost: 70, isServiceable: true },
  '600001': { pincode: '600001', state: 'Tamil Nadu', city: 'Chennai', district: 'Chennai', region: 'South', deliveryTime: '2-3 days', shippingCost: 65, isServiceable: true },
  '700001': { pincode: '700001', state: 'West Bengal', city: 'Kolkata', district: 'Kolkata', region: 'East', deliveryTime: '2-3 days', shippingCost: 55, isServiceable: true },
  '380001': { pincode: '380001', state: 'Gujarat', city: 'Ahmedabad', district: 'Ahmedabad', region: 'West', deliveryTime: '2-3 days', shippingCost: 60, isServiceable: true },
  '110017': { pincode: '110017', state: 'Delhi', city: 'New Delhi', district: 'New Delhi', region: 'North', deliveryTime: '1-2 days', shippingCost: 50, isServiceable: true },
  '400051': { pincode: '400051', state: 'Maharashtra', city: 'Mumbai', district: 'Mumbai Suburban', region: 'West', deliveryTime: '1-2 days', shippingCost: 60, isServiceable: true },
  '560025': { pincode: '560025', state: 'Karnataka', city: 'Bangalore', district: 'Bangalore Urban', region: 'South', deliveryTime: '2-3 days', shippingCost: 70, isServiceable: true },
  '600020': { pincode: '600020', state: 'Tamil Nadu', city: 'Chennai', district: 'Chennai', region: 'South', deliveryTime: '2-3 days', shippingCost: 65, isServiceable: true },
  '700019': { pincode: '700019', state: 'West Bengal', city: 'Kolkata', district: 'Kolkata', region: 'East', deliveryTime: '2-3 days', shippingCost: 55, isServiceable: true },
  '380015': { pincode: '380015', state: 'Gujarat', city: 'Ahmedabad', district: 'Ahmedabad', region: 'West', deliveryTime: '2-3 days', shippingCost: 60, isServiceable: true },
  
  // Tier 2 cities
  '411001': { pincode: '411001', state: 'Maharashtra', city: 'Pune', district: 'Pune', region: 'West', deliveryTime: '2-3 days', shippingCost: 80, isServiceable: true },
  '302001': { pincode: '302001', state: 'Rajasthan', city: 'Jaipur', district: 'Jaipur', region: 'North', deliveryTime: '3-4 days', shippingCost: 90, isServiceable: true },
  '500001': { pincode: '500001', state: 'Telangana', city: 'Hyderabad', district: 'Hyderabad', region: 'South', deliveryTime: '2-3 days', shippingCost: 90, isServiceable: true },
  '520001': { pincode: '520001', state: 'Andhra Pradesh', city: 'Vijayawada', district: 'Krishna', region: 'South', deliveryTime: '2-3 days', shippingCost: 80, isServiceable: true },
  '530001': { pincode: '530001', state: 'Andhra Pradesh', city: 'Visakhapatnam', district: 'Visakhapatnam', region: 'South', deliveryTime: '2-3 days', shippingCost: 80, isServiceable: true },
  '110092': { pincode: '110092', state: 'Delhi', city: 'New Delhi', district: 'North West Delhi', region: 'North', deliveryTime: '1-2 days', shippingCost: 50, isServiceable: true },
  '400053': { pincode: '400053', state: 'Maharashtra', city: 'Mumbai', district: 'Mumbai Suburban', region: 'West', deliveryTime: '1-2 days', shippingCost: 60, isServiceable: true },
  '560030': { pincode: '560030', state: 'Karnataka', city: 'Bangalore', district: 'Bangalore Urban', region: 'South', deliveryTime: '2-3 days', shippingCost: 70, isServiceable: true },
  '600032': { pincode: '600032', state: 'Tamil Nadu', city: 'Chennai', district: 'Chennai', region: 'South', deliveryTime: '2-3 days', shippingCost: 65, isServiceable: true },
  '700025': { pincode: '700025', state: 'West Bengal', city: 'Kolkata', district: 'Kolkata', region: 'East', deliveryTime: '2-3 days', shippingCost: 55, isServiceable: true },
  '380009': { pincode: '380009', state: 'Gujarat', city: 'Ahmedabad', district: 'Ahmedabad', region: 'West', deliveryTime: '2-3 days', shippingCost: 60, isServiceable: true },
  
  // Tier 3 cities and rural areas
  '201301': { pincode: '201301', state: 'Uttar Pradesh', city: 'Noida', district: 'Gautam Buddha Nagar', region: 'North', deliveryTime: '3-4 days', shippingCost: 100, isServiceable: true },
  '122001': { pincode: '122001', state: 'Haryana', city: 'Gurgaon', district: 'Gurgaon', region: 'North', deliveryTime: '2-3 days', shippingCost: 85, isServiceable: true },
  '141001': { pincode: '141001', state: 'Punjab', city: 'Ludhiana', district: 'Ludhiana', region: 'North', deliveryTime: '4-5 days', shippingCost: 120, isServiceable: true },
  '160001': { pincode: '160001', state: 'Punjab', city: 'Chandigarh', district: 'Chandigarh', region: 'North', deliveryTime: '3-4 days', shippingCost: 110, isServiceable: true },
  '226001': { pincode: '226001', state: 'Uttar Pradesh', city: 'Lucknow', district: 'Lucknow', region: 'North', deliveryTime: '4-5 days', shippingCost: 130, isServiceable: true },
  '800001': { pincode: '800001', state: 'Bihar', city: 'Patna', district: 'Patna', region: 'East', deliveryTime: '5-6 days', shippingCost: 150, isServiceable: true },
  '751001': { pincode: '751001', state: 'Odisha', city: 'Bhubaneswar', district: 'Khordha', region: 'East', deliveryTime: '4-5 days', shippingCost: 140, isServiceable: true },
  '781001': { pincode: '781001', state: 'Assam', city: 'Guwahati', district: 'Kamrup', region: 'Northeast', deliveryTime: '6-7 days', shippingCost: 180, isServiceable: true },
  '790001': { pincode: '790001', state: 'Arunachal Pradesh', city: 'Itanagar', district: 'Papum Pare', region: 'Northeast', deliveryTime: '7-8 days', shippingCost: 200, isServiceable: true },
  '795001': { pincode: '795001', state: 'Manipur', city: 'Imphal', district: 'Imphal West', region: 'Northeast', deliveryTime: '7-8 days', shippingCost: 200, isServiceable: true },
  
  // Non-serviceable areas (example)
  '799001': { pincode: '799001', state: 'Tripura', city: 'Agartala', district: 'West Tripura', region: 'Northeast', deliveryTime: 'Not available', shippingCost: 0, isServiceable: false },
  '737001': { pincode: '737001', state: 'Sikkim', city: 'Gangtok', district: 'East Sikkim', region: 'Northeast', deliveryTime: 'Not available', shippingCost: 0, isServiceable: false },
};

// Validate Indian pincode format
export const validatePincode = (pincode: string): boolean => {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
};

// Get pincode data
export const getPincodeData = async (pincode: string): Promise<PincodeData | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!validatePincode(pincode)) {
    return null;
  }
  
  return pincodeDatabase[pincode] || null;
};

// Check if pincode is serviceable
export const isPincodeServiceable = async (pincode: string): Promise<boolean> => {
  const data = await getPincodeData(pincode);
  return data?.isServiceable || false;
};

// Get shipping cost for pincode
export const getShippingCost = async (pincode: string): Promise<number> => {
  const data = await getPincodeData(pincode);
  return data?.shippingCost || 0;
};

// Get delivery time for pincode
export const getDeliveryTime = async (pincode: string): Promise<string> => {
  const data = await getPincodeData(pincode);
  return data?.deliveryTime || 'Not available';
};

// Search pincodes by city or state
export const searchPincodes = async (query: string): Promise<PincodeData[]> => {
  const results: PincodeData[] = [];
  const searchQuery = query.toLowerCase();
  
  for (const pincode in pincodeDatabase) {
    const data = pincodeDatabase[pincode];
    if (
      data.city.toLowerCase().includes(searchQuery) ||
      data.state.toLowerCase().includes(searchQuery) ||
      data.district.toLowerCase().includes(searchQuery)
    ) {
      results.push(data);
    }
  }
  
  return results.slice(0, 10); // Limit to 10 results
};

// Get popular cities for quick selection
export const getPopularCities = (): PincodeData[] => {
  return [
    { pincode: '110001', state: 'Delhi', city: 'New Delhi', district: 'Central Delhi', region: 'North', deliveryTime: '1-2 days', shippingCost: 50, isServiceable: true },
    { pincode: '400001', state: 'Maharashtra', city: 'Mumbai', district: 'Mumbai', region: 'West', deliveryTime: '1-2 days', shippingCost: 60, isServiceable: true },
    { pincode: '560001', state: 'Karnataka', city: 'Bangalore', district: 'Bangalore Urban', region: 'South', deliveryTime: '2-3 days', shippingCost: 70, isServiceable: true },
    { pincode: '600001', state: 'Tamil Nadu', city: 'Chennai', district: 'Chennai', region: 'South', deliveryTime: '2-3 days', shippingCost: 65, isServiceable: true },
    { pincode: '700001', state: 'West Bengal', city: 'Kolkata', district: 'Kolkata', region: 'East', deliveryTime: '2-3 days', shippingCost: 55, isServiceable: true },
    { pincode: '380001', state: 'Gujarat', city: 'Ahmedabad', district: 'Ahmedabad', region: 'West', deliveryTime: '2-3 days', shippingCost: 60, isServiceable: true },
    { pincode: '411001', state: 'Maharashtra', city: 'Pune', district: 'Pune', region: 'West', deliveryTime: '2-3 days', shippingCost: 80, isServiceable: true },
    { pincode: '302001', state: 'Rajasthan', city: 'Jaipur', district: 'Jaipur', region: 'North', deliveryTime: '3-4 days', shippingCost: 90, isServiceable: true },
    { pincode: '500001', state: 'Telangana', city: 'Hyderabad', district: 'Hyderabad', region: 'South', deliveryTime: '2-3 days', shippingCost: 90, isServiceable: true },
  ];
};

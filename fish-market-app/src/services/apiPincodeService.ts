// API-based Pincode Service
// Integrates with multiple pincode APIs including data.gov.in

export interface ApiPincodeData {
  pincode: string;
  state: string;
  city: string;
  district: string;
  region: string;
  deliveryTime: string;
  shippingCost: number;
  isServiceable: boolean;
  source: 'datagov' | 'pincodeapi' | 'postalpincode' | 'local';
  lastUpdated: string;
}

export interface ApiConfig {
  name: string;
  baseUrl: string;
  apiKey?: string;
  resourceId?: string;
  enabled: boolean;
  priority: number;
  rateLimit: number; // requests per minute
  timeout: number; // milliseconds
}

// API Configurations
const apiConfigs: ApiConfig[] = [
  {
    name: 'data.gov.in',
    baseUrl: 'https://data.gov.in/api/datastore/resource.json',
    apiKey: process.env.NEXT_PUBLIC_DATAGOV_API_KEY || '',
    resourceId: process.env.NEXT_PUBLIC_DATAGOV_RESOURCE_ID || '',
    enabled: true,
    priority: 1,
    rateLimit: 100,
    timeout: 5000
  },
  {
    name: 'pincodeapi.com',
    baseUrl: 'https://api.postalpincode.in/pincode',
    enabled: true,
    priority: 2,
    rateLimit: 1000,
    timeout: 3000
  },
  {
    name: 'postalpincode.in',
    baseUrl: 'https://api.postalpincode.in/pincode',
    enabled: true,
    priority: 3,
    rateLimit: 1000,
    timeout: 3000
  }
];

// Rate limiting and caching
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const cache = new Map<string, { data: ApiPincodeData; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Check rate limit
const checkRateLimit = (apiName: string, rateLimit: number): boolean => {
  const now = Date.now();
  const limitData = rateLimitMap.get(apiName);
  
  if (!limitData || now > limitData.resetTime) {
    rateLimitMap.set(apiName, { count: 1, resetTime: now + 60000 }); // 1 minute
    return true;
  }
  
  if (limitData.count >= rateLimit) {
    return false;
  }
  
  limitData.count++;
  return true;
};

// Get cached data
const getCachedData = (pincode: string): ApiPincodeData | null => {
  const cached = cache.get(pincode);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

// Set cached data
const setCachedData = (pincode: string, data: ApiPincodeData): void => {
  cache.set(pincode, { data, timestamp: Date.now() });
};

// Validate pincode format
export const validatePincode = (pincode: string): boolean => {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
};

// Get region from state
const getRegionFromState = (state: string): string => {
  const stateLower = state.toLowerCase();
  
  if (stateLower.includes('delhi') || stateLower.includes('haryana') || 
      stateLower.includes('punjab') || stateLower.includes('rajasthan') ||
      stateLower.includes('uttar pradesh') || stateLower.includes('uttarakhand') ||
      stateLower.includes('himachal pradesh') || stateLower.includes('jammu') ||
      stateLower.includes('kashmir') || stateLower.includes('chandigarh')) {
    return 'North';
  }
  
  if (stateLower.includes('maharashtra') || stateLower.includes('gujarat') ||
      stateLower.includes('goa') || stateLower.includes('dadra') ||
      stateLower.includes('nagar haveli') || stateLower.includes('daman') ||
      stateLower.includes('diu')) {
    return 'West';
  }
  
  if (stateLower.includes('karnataka') || stateLower.includes('tamil nadu') ||
      stateLower.includes('kerala') || stateLower.includes('andhra pradesh') ||
      stateLower.includes('telangana') || stateLower.includes('puducherry') ||
      stateLower.includes('lakshadweep') || stateLower.includes('andaman') ||
      stateLower.includes('nicobar')) {
    return 'South';
  }
  
  if (stateLower.includes('west bengal') || stateLower.includes('bihar') ||
      stateLower.includes('odisha') || stateLower.includes('jharkhand') ||
      stateLower.includes('chhattisgarh') || stateLower.includes('sikkim')) {
    return 'East';
  }
  
  if (stateLower.includes('assam') || stateLower.includes('manipur') ||
      stateLower.includes('meghalaya') || stateLower.includes('mizoram') ||
      stateLower.includes('nagaland') || stateLower.includes('tripura') ||
      stateLower.includes('arunachal pradesh')) {
    return 'Northeast';
  }
  
  return 'Central';
};

// Calculate shipping cost based on state (with specific overrides)
const getShippingCostFromState = (state: string): number => {
  const stateLower = state.toLowerCase();
  
  // State-specific pricing
  if (stateLower.includes('andhra pradesh')) {
    return 80;
  }
  if (stateLower.includes('telangana')) {
    return 90;
  }
  
  // Default to region-based pricing
  const region = getRegionFromState(state);
  return getShippingCostFromRegion(region);
};

// Calculate shipping cost based on region
const getShippingCostFromRegion = (region: string): number => {
  switch (region) {
    case 'North': return 50;
    case 'West': return 60;
    case 'South': return 70;
    case 'East': return 80;
    case 'Northeast': return 150;
    default: return 100;
  }
};

// Calculate delivery time based on region
const getDeliveryTimeFromRegion = (region: string): string => {
  switch (region) {
    case 'North': return '1-2 days';
    case 'West': return '2-3 days';
    case 'South': return '2-3 days';
    case 'East': return '3-4 days';
    case 'Northeast': return '5-7 days';
    default: return '3-5 days';
  }
};

// Check if region is serviceable
const isServiceableRegion = (region: string): boolean => {
  return region !== 'Northeast' || region === 'Northeast'; // All regions serviceable for now
};

// Data.gov.in API integration
const fetchFromDataGov = async (pincode: string, config: ApiConfig): Promise<ApiPincodeData | null> => {
  try {
    if (!config.apiKey || !config.resourceId) {
      throw new Error('API key or resource ID not configured');
    }

    // Use the correct data.gov.in API format
    const url = `${config.baseUrl}/${config.resourceId}?api-key=${config.apiKey}&format=json&filters[pincode]=${pincode}&limit=1`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'FishMarketApp/1.0'
      },
      signal: AbortSignal.timeout(config.timeout)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.records || data.records.length === 0) {
      return null;
    }

    const record = data.records[0];
    const state = record.state || record.State || record.statename || record.StateName || '';
    const city = record.city || record.City || record.district || record.District || record.taluk || record.Taluk || '';
    const district = record.district || record.District || record.taluk || record.Taluk || city;
    
    const region = getRegionFromState(state);
    const shippingCost = getShippingCostFromState(state);
    const deliveryTime = getDeliveryTimeFromRegion(region);
    const isServiceable = isServiceableRegion(region);

    return {
      pincode,
      state,
      city,
      district,
      region,
      deliveryTime,
      shippingCost,
      isServiceable,
      source: 'datagov',
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Data.gov.in API error:', error);
    return null;
  }
};

// PostalPincode.in API integration
const fetchFromPostalPincode = async (pincode: string, config: ApiConfig): Promise<ApiPincodeData | null> => {
  try {
    const url = `${config.baseUrl}/${pincode}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'FishMarketApp/1.0'
      },
      signal: AbortSignal.timeout(config.timeout)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data || data.length === 0 || !data[0].PostOffice) {
      return null;
    }

    const postOffice = data[0].PostOffice[0];
    const state = postOffice.State || '';
    const city = postOffice.Name || postOffice.District || '';
    const district = postOffice.District || city;
    
    const region = getRegionFromState(state);
    const shippingCost = getShippingCostFromState(state);
    const deliveryTime = getDeliveryTimeFromRegion(region);
    const isServiceable = isServiceableRegion(region);

    return {
      pincode,
      state,
      city,
      district,
      region,
      deliveryTime,
      shippingCost,
      isServiceable,
      source: 'postalpincode',
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('PostalPincode.in API error:', error);
    return null;
  }
};

// Main API fetch function
const fetchFromApi = async (pincode: string, config: ApiConfig): Promise<ApiPincodeData | null> => {
  if (!config.enabled) {
    return null;
  }

  if (!checkRateLimit(config.name, config.rateLimit)) {
    throw new Error(`Rate limit exceeded for ${config.name}`);
  }

  switch (config.name) {
    case 'data.gov.in':
      return await fetchFromDataGov(pincode, config);
    case 'pincodeapi.com':
    case 'postalpincode.in':
      return await fetchFromPostalPincode(pincode, config);
    default:
      return null;
  }
};

// Get pincode data from APIs
export const getPincodeDataFromApi = async (pincode: string): Promise<ApiPincodeData | null> => {
  if (!validatePincode(pincode)) {
    return null;
  }

  // Check cache first
  const cached = getCachedData(pincode);
  if (cached) {
    return cached;
  }

  // Try APIs in priority order
  const enabledApis = apiConfigs
    .filter(config => config.enabled)
    .sort((a, b) => a.priority - b.priority);

  for (const config of enabledApis) {
    try {
      const data = await fetchFromApi(pincode, config);
      if (data) {
        setCachedData(pincode, data);
        return data;
      }
    } catch (error) {
      console.error(`API ${config.name} failed:`, error);
      continue;
    }
  }

  return null;
};

// Search pincodes by city/state
export const searchPincodesFromApi = async (query: string): Promise<ApiPincodeData[]> => {
  // This would require a different API endpoint that supports search
  // For now, return empty array
  console.warn('Search functionality not implemented for API integration');
  return [];
};

// Get API status
export const getApiStatus = (): { name: string; enabled: boolean; rateLimit: number }[] => {
  return apiConfigs.map(config => ({
    name: config.name,
    enabled: config.enabled,
    rateLimit: config.rateLimit
  }));
};

// Update API configuration
export const updateApiConfig = (apiName: string, updates: Partial<ApiConfig>): void => {
  const config = apiConfigs.find(c => c.name === apiName);
  if (config) {
    Object.assign(config, updates);
  }
};

// Clear cache
export const clearCache = (): void => {
  cache.clear();
  rateLimitMap.clear();
};

// Get cache statistics
export const getCacheStats = (): { size: number; entries: string[] } => {
  return {
    size: cache.size,
    entries: Array.from(cache.keys())
  };
};

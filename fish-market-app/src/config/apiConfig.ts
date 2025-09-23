// API Configuration
// This file contains configuration for various pincode APIs

export const apiConfig = {
  // Data.gov.in API Configuration
  datagov: {
    baseUrl: 'https://api.data.gov.in/resource',
    apiKey: process.env.NEXT_PUBLIC_DATAGOV_API_KEY || '579b464db66ec23bdd00000182f6ad27266d4ed17d54befee7536dea',
    resourceId: process.env.NEXT_PUBLIC_DATAGOV_RESOURCE_ID || '6176ee09-3d56-4a3b-8115-21841576b2f6',
    enabled: true,
    priority: 1,
    rateLimit: 100, // requests per minute
    timeout: 5000 // milliseconds
  },
  
  // PostalPincode.in API Configuration
  postalpincode: {
    baseUrl: 'https://api.postalpincode.in/pincode',
    enabled: true,
    priority: 2,
    rateLimit: 1000, // requests per minute
    timeout: 3000 // milliseconds
  },
  
  // PincodeAPI.com Configuration
  pincodeapi: {
    baseUrl: 'https://api.postalpincode.in/pincode',
    enabled: true,
    priority: 3,
    rateLimit: 1000, // requests per minute
    timeout: 3000 // milliseconds
  }
};

// Environment variables validation
export const validateApiConfig = () => {
  const warnings: string[] = [];
  
  if (!apiConfig.datagov.apiKey) {
    warnings.push('Data.gov.in API key not configured. Set NEXT_PUBLIC_DATAGOV_API_KEY in your environment variables.');
  }
  
  if (!apiConfig.datagov.resourceId) {
    warnings.push('Data.gov.in Resource ID not configured. Set NEXT_PUBLIC_DATAGOV_RESOURCE_ID in your environment variables.');
  }
  
  return {
    isValid: warnings.length === 0,
    warnings
  };
};

// Get API status
export const getApiStatus = () => {
  const validation = validateApiConfig();
  
  return {
    datagov: {
      enabled: apiConfig.datagov.enabled,
      configured: !!(apiConfig.datagov.apiKey && apiConfig.datagov.resourceId),
      warnings: validation.warnings.filter(w => w.includes('datagov'))
    },
    postalpincode: {
      enabled: apiConfig.postalpincode.enabled,
      configured: true, // No API key required
      warnings: []
    },
    pincodeapi: {
      enabled: apiConfig.pincodeapi.enabled,
      configured: true, // No API key required
      warnings: []
    }
  };
};


export const apiConfig = {
  // Data.gov.in API Configuration
  datagov: {
    baseUrl: 'https://api.data.gov.in/resource',
    apiKey: process.env.NEXT_PUBLIC_DATAGOV_API_KEY || '579b464db66ec23bdd00000182f6ad27266d4ed17d54befee7536dea',
    resourceId: process.env.NEXT_PUBLIC_DATAGOV_RESOURCE_ID || '6176ee09-3d56-4a3b-8115-21841576b2f6',
    enabled: true,
    priority: 1,
    rateLimit: 100, // requests per minute
    timeout: 5000 // milliseconds
  },
  
  // PostalPincode.in API Configuration
  postalpincode: {
    baseUrl: 'https://api.postalpincode.in/pincode',
    enabled: true,
    priority: 2,
    rateLimit: 1000, // requests per minute
    timeout: 3000 // milliseconds
  },
  
  // PincodeAPI.com Configuration
  pincodeapi: {
    baseUrl: 'https://api.postalpincode.in/pincode',
    enabled: true,
    priority: 3,
    rateLimit: 1000, // requests per minute
    timeout: 3000 // milliseconds
  }
};

// Environment variables validation
export const validateApiConfig = () => {
  const warnings: string[] = [];
  
  if (!apiConfig.datagov.apiKey) {
    warnings.push('Data.gov.in API key not configured. Set NEXT_PUBLIC_DATAGOV_API_KEY in your environment variables.');
  }
  
  if (!apiConfig.datagov.resourceId) {
    warnings.push('Data.gov.in Resource ID not configured. Set NEXT_PUBLIC_DATAGOV_RESOURCE_ID in your environment variables.');
  }
  
  return {
    isValid: warnings.length === 0,
    warnings
  };
};

// Get API status
export const getApiStatus = () => {
  const validation = validateApiConfig();
  
  return {
    datagov: {
      enabled: apiConfig.datagov.enabled,
      configured: !!(apiConfig.datagov.apiKey && apiConfig.datagov.resourceId),
      warnings: validation.warnings.filter(w => w.includes('datagov'))
    },
    postalpincode: {
      enabled: apiConfig.postalpincode.enabled,
      configured: true, // No API key required
      warnings: []
    },
    pincodeapi: {
      enabled: apiConfig.pincodeapi.enabled,
      configured: true, // No API key required
      warnings: []
    }
  };
};


export const apiConfig = {
  // Data.gov.in API Configuration
  datagov: {
    baseUrl: 'https://api.data.gov.in/resource',
    apiKey: process.env.NEXT_PUBLIC_DATAGOV_API_KEY || '579b464db66ec23bdd00000182f6ad27266d4ed17d54befee7536dea',
    resourceId: process.env.NEXT_PUBLIC_DATAGOV_RESOURCE_ID || '6176ee09-3d56-4a3b-8115-21841576b2f6',
    enabled: true,
    priority: 1,
    rateLimit: 100, // requests per minute
    timeout: 5000 // milliseconds
  },
  
  // PostalPincode.in API Configuration
  postalpincode: {
    baseUrl: 'https://api.postalpincode.in/pincode',
    enabled: true,
    priority: 2,
    rateLimit: 1000, // requests per minute
    timeout: 3000 // milliseconds
  },
  
  // PincodeAPI.com Configuration
  pincodeapi: {
    baseUrl: 'https://api.postalpincode.in/pincode',
    enabled: true,
    priority: 3,
    rateLimit: 1000, // requests per minute
    timeout: 3000 // milliseconds
  }
};

// Environment variables validation
export const validateApiConfig = () => {
  const warnings: string[] = [];
  
  if (!apiConfig.datagov.apiKey) {
    warnings.push('Data.gov.in API key not configured. Set NEXT_PUBLIC_DATAGOV_API_KEY in your environment variables.');
  }
  
  if (!apiConfig.datagov.resourceId) {
    warnings.push('Data.gov.in Resource ID not configured. Set NEXT_PUBLIC_DATAGOV_RESOURCE_ID in your environment variables.');
  }
  
  return {
    isValid: warnings.length === 0,
    warnings
  };
};

// Get API status
export const getApiStatus = () => {
  const validation = validateApiConfig();
  
  return {
    datagov: {
      enabled: apiConfig.datagov.enabled,
      configured: !!(apiConfig.datagov.apiKey && apiConfig.datagov.resourceId),
      warnings: validation.warnings.filter(w => w.includes('datagov'))
    },
    postalpincode: {
      enabled: apiConfig.postalpincode.enabled,
      configured: true, // No API key required
      warnings: []
    },
    pincodeapi: {
      enabled: apiConfig.pincodeapi.enabled,
      configured: true, // No API key required
      warnings: []
    }
  };
};

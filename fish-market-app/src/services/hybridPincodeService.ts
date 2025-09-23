// Hybrid Pincode Service - single, deduplicated implementation
import { PincodeData, getPincodeData as getLocalPincodeData } from './pincodeService';
import { ApiPincodeData, getPincodeDataFromApi, searchPincodesFromApi } from './apiPincodeService';

export interface HybridPincodeData extends PincodeData {
  source: 'local' | 'api' | 'hybrid';
  lastUpdated: string;
  confidence: 'high' | 'medium' | 'low';
}

const convertApiToLocal = (apiData: ApiPincodeData): PincodeData => ({
  pincode: apiData.pincode,
  state: apiData.state,
  city: apiData.city,
  district: apiData.district,
  region: apiData.region,
  deliveryTime: apiData.deliveryTime,
  shippingCost: apiData.shippingCost,
  isServiceable: apiData.isServiceable
});

const mergePincodeData = (localData: PincodeData | null, apiData: ApiPincodeData | null): HybridPincodeData => {
  if (localData && apiData) {
    return {
      ...localData,
      state: apiData.state || localData.state,
      city: apiData.city || localData.city,
      district: apiData.district || localData.district,
      region: apiData.region || localData.region,
      deliveryTime: apiData.deliveryTime || localData.deliveryTime,
      shippingCost: apiData.shippingCost || localData.shippingCost,
      isServiceable: apiData.isServiceable !== undefined ? apiData.isServiceable : localData.isServiceable,
      source: 'hybrid',
      lastUpdated: apiData.lastUpdated,
      confidence: 'high'
    };
  }
  if (apiData) {
    return { ...convertApiToLocal(apiData), source: 'api', lastUpdated: apiData.lastUpdated, confidence: 'medium' };
  }
  if (localData) {
    return { ...localData, source: 'local', lastUpdated: new Date().toISOString(), confidence: 'low' };
  }
  throw new Error('No data available from any source');
};

export const getHybridPincodeData = async (pincode: string): Promise<HybridPincodeData | null> => {
  try {
    const [localData, apiData] = await Promise.allSettled([
      Promise.resolve(getLocalPincodeData(pincode)),
      getPincodeDataFromApi(pincode)
    ]);

    const localResult = localData.status === 'fulfilled' ? localData.value : null;
    const apiResult = apiData.status === 'fulfilled' ? apiData.value : null;

    if (!localResult && !apiResult) return null;
    return mergePincodeData(localResult, apiResult);
  } catch (error) {
    console.error('Error getting hybrid pincode data:', error);
    return null;
  }
};

export const searchHybridPincodes = async (query: string): Promise<HybridPincodeData[]> => {
  try {
    const apiResults = await searchPincodesFromApi(query);
    return apiResults.map(apiData => ({
      ...convertApiToLocal(apiData),
      source: 'api' as const,
      lastUpdated: apiData.lastUpdated,
      confidence: 'medium' as const
    }));
  } catch (error) {
    console.error('Error searching hybrid pincodes:', error);
    return [];
  }
};

export const validateHybridPincode = (pincode: string): boolean => {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
};

export const isHybridPincodeServiceable = async (pincode: string): Promise<boolean> => {
  const data = await getHybridPincodeData(pincode);
  return data?.isServiceable || false;
};

export const getHybridShippingCost = async (pincode: string): Promise<number> => {
  const data = await getHybridPincodeData(pincode);
  return data?.shippingCost || 0;
};

export const getHybridDeliveryTime = async (pincode: string): Promise<string> => {
  const data = await getHybridPincodeData(pincode);
  return data?.deliveryTime || 'Not available';
};

export const getDataSourceInfo = (data: HybridPincodeData): string => {
  switch (data.source) {
    case 'local': return 'Local Database';
    case 'api': return 'Government API';
    case 'hybrid': return 'Local + API (Merged)';
    default: return 'Unknown';
  }
};

export const getConfidenceDescription = (confidence: 'high' | 'medium' | 'low'): string => {
  switch (confidence) {
    case 'high': return 'High accuracy - data verified from multiple sources';
    case 'medium': return 'Medium accuracy - data from API source';
    case 'low': return 'Low accuracy - data from local database only';
    default: return 'Unknown accuracy';
  }
};

export const batchProcessPincodes = async (pincodes: string[]): Promise<HybridPincodeData[]> => {
  const results: HybridPincodeData[] = [];
  const batchSize = 10;
  for (let i = 0; i < pincodes.length; i += batchSize) {
    const batch = pincodes.slice(i, i + batchSize);
    const batchPromises = batch.map(pincode => getHybridPincodeData(pincode));
    try {
      const batchResults = await Promise.allSettled(batchPromises);
      batchResults.forEach(result => { if (result.status === 'fulfilled' && result.value) results.push(result.value); });
    } catch (error) {
      console.error(`Error processing batch ${i / batchSize + 1}:`, error);
    }
    if (i + batchSize < pincodes.length) await new Promise(resolve => setTimeout(resolve, 1000));
  }
  return results;
};

export const getDataSourceStats = async (pincodes: string[]): Promise<{ total: number; local: number; api: number; hybrid: number; serviceable: number; averageConfidence: number; }> => {
  const results = await batchProcessPincodes(pincodes);
  const stats = { total: results.length, local: 0, api: 0, hybrid: 0, serviceable: 0, averageConfidence: 0 };
  let confidenceSum = 0;
  results.forEach(data => {
    if (data.source === 'local') stats.local++;
    else if (data.source === 'api') stats.api++;
    else if (data.source === 'hybrid') stats.hybrid++;
    if (data.isServiceable) stats.serviceable++;
    const value = data.confidence === 'high' ? 3 : data.confidence === 'medium' ? 2 : 1;
    confidenceSum += value;
  });
  stats.averageConfidence = results.length > 0 ? confidenceSum / results.length : 0;
  return stats;
};

export {
  getHybridPincodeData as getPincodeData,
  searchHybridPincodes as searchPincodes,
  validateHybridPincode as validatePincode,
  isHybridPincodeServiceable as isPincodeServiceable,
  getHybridShippingCost as getShippingCost,
  getHybridDeliveryTime as getDeliveryTime
};






















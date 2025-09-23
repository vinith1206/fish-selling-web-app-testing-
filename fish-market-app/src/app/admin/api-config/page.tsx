'use client';

import { useState, useEffect } from 'react';
import { Database, Globe, Settings, CheckCircle, XCircle, AlertTriangle, RefreshCw, Save } from 'lucide-react';

interface ApiConfig {
  name: string;
  baseUrl: string;
  apiKey?: string;
  resourceId?: string;
  enabled: boolean;
  priority: number;
  rateLimit: number;
  timeout: number;
}

interface ApiStatus {
  name: string;
  enabled: boolean;
  rateLimit: number;
  lastChecked?: string;
  status: 'online' | 'offline' | 'error';
  responseTime?: number;
}

export default function ApiConfigPage() {
  const [configs, setConfigs] = useState<ApiConfig[]>([]);
  const [statuses, setStatuses] = useState<ApiStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedApi, setSelectedApi] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // API configurations with your data.gov.in key
  const defaultConfigs: ApiConfig[] = [
    {
      name: 'data.gov.in',
      baseUrl: 'https://api.data.gov.in/resource',
      apiKey: '579b464db66ec23bdd00000182f6ad27266d4ed17d54befee7536dea',
      resourceId: '6176ee09-3d56-4a3b-8115-21841576b2f6',
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

  useEffect(() => {
    setConfigs(defaultConfigs);
    setStatuses(defaultConfigs.map(config => ({
      name: config.name,
      enabled: config.enabled,
      rateLimit: config.rateLimit,
      status: 'offline'
    })));
  }, []);

  const testApi = async (config: ApiConfig) => {
    setIsLoading(true);
    const startTime = Date.now();
    
    try {
      // Test with a known pincode
      const testPincode = '110001';
      let testUrl = '';
      
      if (config.name === 'data.gov.in') {
        testUrl = `${config.baseUrl}/${config.resourceId}?api-key=${config.apiKey}&format=json&filters[pincode]=${testPincode}&limit=1`;
      } else {
        testUrl = `${config.baseUrl}/${testPincode}`;
      }
      
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'FishMarketApp/1.0'
        },
        signal: AbortSignal.timeout(config.timeout)
      });
      
      const responseTime = Date.now() - startTime;
      
      if (response.ok) {
        const data = await response.json();
        setTestResults(prev => ({
          ...prev,
          [config.name]: {
            status: 'success',
            responseTime,
            data: data,
            message: 'API is working correctly'
          }
        }));
        
        // Update status
        setStatuses(prev => prev.map(status => 
          status.name === config.name 
            ? { ...status, status: 'online', lastChecked: new Date().toISOString(), responseTime }
            : status
        ));
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      setTestResults(prev => ({
        ...prev,
        [config.name]: {
          status: 'error',
          responseTime,
          error: error instanceof Error ? error.message : 'Unknown error',
          message: 'API test failed'
        }
      }));
      
      // Update status
      setStatuses(prev => prev.map(status => 
        status.name === config.name 
          ? { ...status, status: 'error', lastChecked: new Date().toISOString(), responseTime }
          : status
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const updateConfig = (apiName: string, updates: Partial<ApiConfig>) => {
    setConfigs(prev => prev.map(config => 
      config.name === apiName ? { ...config, ...updates } : config
    ));
    setHasChanges(true);
  };

  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage
      localStorage.setItem('apiConfigs', JSON.stringify(configs));
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setHasChanges(false);
      alert('Configuration saved successfully!');
    } catch (error) {
      console.error('Error saving configuration:', error);
      alert('Error saving configuration. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleApi = (apiName: string) => {
    updateConfig(apiName, { enabled: !configs.find(c => c.name === apiName)?.enabled });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'offline':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'offline':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">API Configuration</h1>
          <p className="text-gray-600 mt-2">Manage pincode data sources and API integrations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* API Status Overview */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">API Status</h2>
            
            <div className="space-y-4">
              {statuses.map((status) => (
                <div
                  key={status.name}
                  className={`p-4 rounded-lg border-2 ${getStatusColor(status.status)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(status.status)}
                      <div>
                        <h3 className="font-semibold text-gray-900">{status.name}</h3>
                        <p className="text-sm text-gray-600">
                          {status.status === 'online' ? 'Online' : 
                           status.status === 'error' ? 'Error' : 'Offline'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        {status.responseTime ? `${status.responseTime}ms` : 'Not tested'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {status.lastChecked ? new Date(status.lastChecked).toLocaleTimeString() : 'Never'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* API Configuration */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Configuration</h2>
              <button
                onClick={handleSaveConfig}
                disabled={!hasChanges || isSaving}
                className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  hasChanges && !isSaving
                    ? 'bg-[#1E90FF] text-white hover:bg-[#0EA5E9] shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Save className="h-5 w-5" />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
            
            <div className="space-y-6">
              {configs.map((config) => (
                <div key={config.name} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Globe className="h-5 w-5 text-gray-600" />
                      <h3 className="font-semibold text-gray-900">{config.name}</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleApi(config.name)}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          config.enabled
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {config.enabled ? 'Enabled' : 'Disabled'}
                      </button>
                      <button
                        onClick={() => testApi(config)}
                        disabled={isLoading}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          'Test'
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Base URL
                      </label>
                      <input
                        type="text"
                        value={config.baseUrl}
                        onChange={(e) => updateConfig(config.name, { baseUrl: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                      />
                    </div>

                    {config.apiKey !== undefined && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          API Key
                        </label>
                        <input
                          type="password"
                          value={config.apiKey}
                          onChange={(e) => updateConfig(config.name, { apiKey: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                          placeholder="Enter API key"
                        />
                      </div>
                    )}

                    {config.resourceId !== undefined && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Resource ID
                        </label>
                        <input
                          type="text"
                          value={config.resourceId}
                          onChange={(e) => updateConfig(config.name, { resourceId: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                          placeholder="Enter resource ID"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Priority
                        </label>
                        <input
                          type="number"
                          value={config.priority}
                          onChange={(e) => updateConfig(config.name, { priority: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          min="1"
                          max="10"
                          placeholder="1-10"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Rate Limit (req/min)
                        </label>
                        <input
                          type="number"
                          value={config.rateLimit}
                          onChange={(e) => updateConfig(config.name, { rateLimit: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          min="1"
                          placeholder="Enter rate limit"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Test Results */}
                  {testResults[config.name] && (
                    <div className={`mt-4 p-3 rounded-lg ${
                      testResults[config.name].status === 'success' 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-red-50 border border-red-200'
                    }`}>
                      <div className="flex items-center space-x-2">
                        {testResults[config.name].status === 'success' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className={`text-sm font-medium ${
                          testResults[config.name].status === 'success' 
                            ? 'text-green-800' 
                            : 'text-red-800'
                        }`}>
                          {testResults[config.name].message}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Response time: {testResults[config.name].responseTime}ms
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Setup Instructions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Data.gov.in Setup</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Visit <a href="https://auth.mygov.in/user/register?destination=oauth2/register/datagovindia" target="_blank" rel="noopener noreferrer" className="text-[#1E90FF] hover:underline">data.gov.in registration</a></li>
                <li>Register and obtain your API key</li>
                <li>Find the pincode dataset and note the resource ID</li>
                <li>Enter the API key and resource ID in the configuration above</li>
                <li>Test the API connection</li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">PostalPincode.in Setup</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>No API key required - this is a free service</li>
                <li>Enable the API in the configuration above</li>
                <li>Test the API connection</li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Priority Order</h3>
              <p className="text-gray-700">
                APIs are used in priority order (1 = highest priority). The system will try each enabled API 
                until it finds data for a pincode. Lower priority APIs serve as fallbacks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

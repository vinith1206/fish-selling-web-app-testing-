'use client';

import { useState, useEffect } from 'react';
import { Upload, Save, RotateCcw, Eye, Download } from 'lucide-react';
import Image from 'next/image';

interface LogoData {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
  isActive: boolean;
}

interface BrandData {
  mainName: string;
  subName: string;
  updatedAt: string;
}

const LogoManagement = () => {
  const [logoData, setLogoData] = useState<LogoData | null>(null);
  const [brandData, setBrandData] = useState<BrandData>({
    mainName: 'FreshCatch',
    subName: 'Aquarium',
    updatedAt: new Date().toISOString()
  });
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load current logo and brand data
  useEffect(() => {
    const loadData = () => {
      // Load logo data
      const savedLogo = localStorage.getItem('logoData');
      if (savedLogo) {
        setLogoData(JSON.parse(savedLogo));
      } else {
        // Default logo data
        setLogoData({
          id: 'default',
          name: 'Default Betta Logo',
          url: '/logo-betta.svg',
          uploadedAt: new Date().toISOString(),
          isActive: true
        });
      }

      // Load brand data
      const savedBrand = localStorage.getItem('brandData');
      if (savedBrand) {
        setBrandData(JSON.parse(savedBrand));
      }
    };
    loadData();
  }, []);

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, etc.)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Convert file to base64 for storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        const newLogoData: LogoData = {
          id: Date.now().toString(),
          name: file.name,
          url: base64,
          uploadedAt: new Date().toISOString(),
          isActive: true
        };

        setLogoData(newLogoData);
        setPreviewUrl(base64);
        
        // Save to localStorage
        localStorage.setItem('logoData', JSON.stringify(newLogoData));
        
        // Update the Logo component by triggering a storage event
        window.dispatchEvent(new Event('logoUpdated'));
        
        alert('Logo updated successfully!');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Error uploading logo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  // Reset to default logo
  const resetToDefault = () => {
    const defaultLogo: LogoData = {
      id: 'default',
      name: 'Default Betta Logo',
      url: '/logo-betta.svg',
      uploadedAt: new Date().toISOString(),
      isActive: true
    };
    
    setLogoData(defaultLogo);
    setPreviewUrl(null);
    localStorage.setItem('logoData', JSON.stringify(defaultLogo));
    window.dispatchEvent(new Event('logoUpdated'));
    alert('Reset to default logo!');
  };

  // Download current logo
  const downloadLogo = () => {
    if (logoData?.url) {
      const link = document.createElement('a');
      link.href = logoData.url;
      link.download = logoData.name || 'logo';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Handle brand name changes
  const handleBrandChange = (field: 'mainName' | 'subName', value: string) => {
    setBrandData(prev => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString()
    }));
  };

  // Save brand data
  const saveBrandData = () => {
    setIsSaving(true);
    try {
      localStorage.setItem('brandData', JSON.stringify(brandData));
      window.dispatchEvent(new Event('brandUpdated'));
      alert('Brand name updated successfully!');
    } catch (error) {
      console.error('Error saving brand data:', error);
      alert('Error saving brand data. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset brand to default
  const resetBrandToDefault = () => {
    const defaultBrand: BrandData = {
      mainName: 'FreshCatch',
      subName: 'Aquarium',
      updatedAt: new Date().toISOString()
    };
    setBrandData(defaultBrand);
    localStorage.setItem('brandData', JSON.stringify(defaultBrand));
    window.dispatchEvent(new Event('brandUpdated'));
    alert('Reset to default brand name!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Logo & Brand Management</h1>
          <p className="text-gray-600">Upload and manage your website logo and brand name. Supported formats: PNG, JPG, SVG</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload New Logo</h2>
            
            {/* Drag and Drop Area */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                dragActive
                  ? 'border-[#1E90FF] bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drag & drop your logo here
              </p>
              <p className="text-sm text-gray-500 mb-4">
                or click to browse files
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
                id="logo-upload"
                disabled={isUploading}
              />
              <label
                htmlFor="logo-upload"
                className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                  isUploading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#1E90FF] text-white hover:bg-[#0EA5E9] shadow-lg hover:shadow-xl'
                }`}
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </>
                )}
              </label>
              <p className="text-xs text-gray-400 mt-2">
                Max file size: 5MB • PNG, JPG, SVG supported
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 mt-6">
              <button
                onClick={resetToDefault}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset to Default</span>
              </button>
              {logoData && (
                <button
                  onClick={downloadLogo}
                  className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
              )}
            </div>
          </div>

          {/* Brand Name Management */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Brand Name Management</h2>
            
            {/* Brand Name Inputs */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Main Brand Name</label>
                <input
                  type="text"
                  value={brandData.mainName}
                  onChange={(e) => handleBrandChange('mainName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                  placeholder="Enter main brand name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sub Brand Name</label>
                <input
                  type="text"
                  value={brandData.subName}
                  onChange={(e) => handleBrandChange('subName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                  placeholder="Enter sub brand name"
                />
              </div>

              {/* Live Preview */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Live Preview</h3>
                <div className="flex items-center space-x-3">
                  <div className="relative w-12 h-12">
                    {logoData && (
                      <Image
                        src={logoData.url}
                        alt="Logo Preview"
                        width={48}
                        height={48}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-gray-900">{brandData.mainName}</span>
                    <span className="text-xs text-gray-600 -mt-1">{brandData.subName}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={saveBrandData}
                  disabled={isSaving}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    isSaving
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#1E90FF] text-white hover:bg-[#0EA5E9] shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={resetBrandToDefault}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Logo Preview</h2>
            
            {/* Current Logo Display */}
            <div className="bg-gray-50 rounded-xl p-8 mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-24 h-24">
                  {logoData && (
                    <Image
                      src={logoData.url}
                      alt="Current Logo"
                      width={96}
                      height={96}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-medium text-gray-900">{logoData?.name}</h3>
                <p className="text-sm text-gray-500">
                  Uploaded: {logoData ? new Date(logoData.uploadedAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            {/* Live Preview in Header Style */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Live Preview (Header Style)</h3>
              <div className="flex items-center space-x-3">
                <div className="relative w-12 h-12">
                  {logoData && (
                    <Image
                      src={logoData.url}
                      alt="Logo Preview"
                      width={48}
                      height={48}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-gray-900">{brandData.mainName}</span>
                  <span className="text-xs text-gray-600 -mt-1">{brandData.subName}</span>
                </div>
              </div>
            </div>

            {/* Logo Information */}
            {logoData && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Logo Information</h4>
                <div className="space-y-1 text-sm text-blue-800">
                  <p><strong>Name:</strong> {logoData.name}</p>
                  <p><strong>Type:</strong> {logoData.url.startsWith('data:') ? 'Uploaded Image' : 'Default SVG'}</p>
                  <p><strong>Status:</strong> {logoData.isActive ? 'Active' : 'Inactive'}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">📝 Instructions</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>• <strong>Upload:</strong> Drag and drop or click to select your logo image</p>
            <p>• <strong>Formats:</strong> PNG, JPG, SVG files are supported</p>
            <p>• <strong>Size:</strong> Maximum file size is 5MB</p>
            <p>• <strong>Dimensions:</strong> Recommended size is 64x64 pixels or square aspect ratio</p>
            <p>• <strong>Background:</strong> Use transparent background for best results</p>
            <p>• <strong>Changes:</strong> Logo updates will be visible immediately across the website</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoManagement;

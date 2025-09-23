'use client';

import { useState, useEffect } from 'react';
import { Save, RotateCcw, Eye, Edit3, Type } from 'lucide-react';

interface HomepageContent {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  trendingTitle: string;
  featuredTitle: string;
  saleTitle: string;
  allProductsTitle: string;
  updatedAt: string;
}

const HomepageManagement = () => {
  const [content, setContent] = useState<HomepageContent>({
    heroTitle: 'FreshCatch Aquarium',
    heroSubtitle: 'Premium quality aquarium fish, plants, and accessories',
    heroDescription: 'Your one-stop shop for all aquarium needs!',
    trendingTitle: 'Trending Products',
    featuredTitle: 'Featured Products',
    saleTitle: 'On Sale',
    allProductsTitle: 'All Products',
    updatedAt: new Date().toISOString()
  });
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Load homepage content
  useEffect(() => {
    const loadContent = () => {
      const saved = localStorage.getItem('homepageContent');
      if (saved) {
        setContent(JSON.parse(saved));
      }
    };
    loadContent();
  }, []);

  // Handle content changes
  const handleContentChange = (field: keyof HomepageContent, value: string) => {
    setContent(prev => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString()
    }));
  };

  // Save content
  const saveContent = () => {
    setIsSaving(true);
    try {
      localStorage.setItem('homepageContent', JSON.stringify(content));
      window.dispatchEvent(new Event('homepageContentUpdated'));
      alert('Homepage content updated successfully!');
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Error saving content. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default
  const resetToDefault = () => {
    const defaultContent: HomepageContent = {
      heroTitle: 'FreshCatch Aquarium',
      heroSubtitle: 'Premium quality aquarium fish, plants, and accessories',
      heroDescription: 'Your one-stop shop for all aquarium needs!',
      trendingTitle: 'Trending Products',
      featuredTitle: 'Featured Products',
      saleTitle: 'On Sale',
      allProductsTitle: 'All Products',
      updatedAt: new Date().toISOString()
    };
    setContent(defaultContent);
    localStorage.setItem('homepageContent', JSON.stringify(defaultContent));
    window.dispatchEvent(new Event('homepageContentUpdated'));
    alert('Reset to default content!');
  };

  const sections = [
    { id: 'hero', name: 'Hero Section', icon: Type },
    { id: 'trending', name: 'Trending Section', icon: Edit3 },
    { id: 'featured', name: 'Featured Section', icon: Eye },
    { id: 'sale', name: 'Sale Section', icon: Edit3 },
    { id: 'products', name: 'Products Section', icon: Edit3 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Homepage Content Management</h1>
          <p className="text-gray-600">Edit and manage all text content on your homepage</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Content Sections</h2>
            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                      activeSection === section.id
                        ? 'bg-[#1E90FF] text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{section.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content Editor */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Hero Section */}
              {activeSection === 'hero' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Hero Section</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Main Title</label>
                      <input
                        type="text"
                        value={content.heroTitle}
                        onChange={(e) => handleContentChange('heroTitle', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent text-xl font-bold"
                        placeholder="Enter main title"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                      <input
                        type="text"
                        value={content.heroSubtitle}
                        onChange={(e) => handleContentChange('heroSubtitle', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                        placeholder="Enter subtitle"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={content.heroDescription}
                        onChange={(e) => handleContentChange('heroDescription', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                        placeholder="Enter description"
                      />
                    </div>

                    {/* Live Preview */}
                    <div className="bg-gradient-to-br from-[#1E90FF] via-[#0EA5E9] to-[#06B6D4] text-white p-8 rounded-xl">
                      <h3 className="text-sm font-medium text-blue-100 mb-4">Live Preview</h3>
                      <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">{content.heroTitle}</h1>
                      <p className="text-blue-100 text-center text-lg mb-4">{content.heroSubtitle}</p>
                      <p className="text-blue-200 text-center max-w-2xl mx-auto">{content.heroDescription}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Trending Section */}
              {activeSection === 'trending' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Trending Products Section</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                      <input
                        type="text"
                        value={content.trendingTitle}
                        onChange={(e) => handleContentChange('trendingTitle', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent text-xl font-bold"
                        placeholder="Enter section title"
                      />
                    </div>

                    {/* Live Preview */}
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h3 className="text-sm font-medium text-gray-700 mb-4">Live Preview</h3>
                      <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">{content.trendingTitle}</h2>
                        <p className="text-gray-600">This section will show your trending products</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Featured Section */}
              {activeSection === 'featured' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Products Section</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                      <input
                        type="text"
                        value={content.featuredTitle}
                        onChange={(e) => handleContentChange('featuredTitle', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent text-xl font-bold"
                        placeholder="Enter section title"
                      />
                    </div>

                    {/* Live Preview */}
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h3 className="text-sm font-medium text-gray-700 mb-4">Live Preview</h3>
                      <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">{content.featuredTitle}</h2>
                        <p className="text-gray-600">This section will show your featured products</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sale Section */}
              {activeSection === 'sale' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Sale Products Section</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                      <input
                        type="text"
                        value={content.saleTitle}
                        onChange={(e) => handleContentChange('saleTitle', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent text-xl font-bold"
                        placeholder="Enter section title"
                      />
                    </div>

                    {/* Live Preview */}
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h3 className="text-sm font-medium text-gray-700 mb-4">Live Preview</h3>
                      <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">{content.saleTitle}</h2>
                        <p className="text-gray-600">This section will show your products on sale</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Products Section */}
              {activeSection === 'products' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">All Products Section</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                      <input
                        type="text"
                        value={content.allProductsTitle}
                        onChange={(e) => handleContentChange('allProductsTitle', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent text-xl font-bold"
                        placeholder="Enter section title"
                      />
                    </div>

                    {/* Live Preview */}
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h3 className="text-sm font-medium text-gray-700 mb-4">Live Preview</h3>
                      <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">{content.allProductsTitle}</h2>
                        <p className="text-gray-600">This section will show all your products</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={saveContent}
                  disabled={isSaving}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
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
                      <span>Save All Changes</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={resetToDefault}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset to Default</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">📝 Instructions</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>• <strong>Edit Text:</strong> Click on any section to edit the text content</p>
            <p>• <strong>Live Preview:</strong> See how your changes will look on the homepage</p>
            <p>• <strong>Save Changes:</strong> Click "Save All Changes" to apply your edits</p>
            <p>• <strong>Reset:</strong> Use "Reset to Default" to restore original content</p>
            <p>• <strong>Real-time Updates:</strong> Changes will appear immediately on your website</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomepageManagement;

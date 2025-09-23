'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

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

const Logo = () => {
  const [logoData, setLogoData] = useState<LogoData | null>(null);
  const [brandData, setBrandData] = useState<BrandData>({
    mainName: 'FreshCatch',
    subName: 'Aquarium',
    updatedAt: new Date().toISOString()
  });

  // Load logo and brand data
  useEffect(() => {
    const loadData = () => {
      // Load logo data
      const savedLogo = localStorage.getItem('logoData');
      if (savedLogo) {
        setLogoData(JSON.parse(savedLogo));
      } else {
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

    // Listen for updates
    const handleLogoUpdate = () => loadData();
    const handleBrandUpdate = () => loadData();

    window.addEventListener('logoUpdated', handleLogoUpdate);
    window.addEventListener('brandUpdated', handleBrandUpdate);

    return () => {
      window.removeEventListener('logoUpdated', handleLogoUpdate);
      window.removeEventListener('brandUpdated', handleBrandUpdate);
    };
  }, []);

  return (
    <Link href="/" className="flex items-center space-x-3 group">
      <div className="relative w-16 h-16 group-hover:scale-110 transition-transform duration-300">
        {/* Dynamic Logo Image */}
        {logoData && (
          <Image
            src={logoData.url}
            alt={`${brandData.mainName} ${brandData.subName} Logo`}
            width={64}
            height={64}
            className="w-full h-full object-contain"
            priority
          />
        )}
        {/* Fallback CSS Betta Fish if image doesn't load */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-20 transition-opacity duration-300">
          <span className="text-2xl">🐟</span>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-gray-900 group-hover:text-[#1E90FF] transition-colors duration-300">
          {brandData.mainName}
        </span>
        <span className="text-sm text-gray-600 -mt-1">{brandData.subName}</span>
      </div>
    </Link>
  );
};

export default Logo;
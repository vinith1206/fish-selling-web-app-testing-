'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Fish } from '@/types';

export default function ComparePage() {
  const [items, setItems] = useState<Fish[]>([]);

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem('compareFishes') : null;
      const parsed: Fish[] = raw ? JSON.parse(raw) : [];
      setItems(parsed);
    } catch (e) {
      console.error('Failed to load comparison items', e);
    }
  }, []);

  const removeItem = (id: string) => {
    const next = items.filter(i => i._id !== id);
    setItems(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('compareFishes', JSON.stringify(next));
    }
  };

  const clearAll = () => {
    setItems([]);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('compareFishes');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Compare</h1>
          <div className="flex gap-3">
            <button onClick={clearAll} className="text-red-600 hover:text-red-700 font-medium">Clear All</button>
            <Link href="/" className="text-gray-600 hover:text-[#1E90FF] font-medium">
              <ArrowLeft className="h-4 w-4 inline mr-2" />
              Back to Home
            </Link>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-600">
            No items to compare yet. Add some from product cards.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-2xl shadow">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-700">
                  <th className="p-4">Item</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Unit</th>
                  <th className="p-4">Weight</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Care Level</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((f) => (
                  <tr key={f._id} className="border-t">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-14 w-14 rounded overflow-hidden">
                          <Image src={f.image} alt={f.name} fill className="object-cover" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{f.name}</div>
                          {f.description && (
                            <div className="text-xs text-gray-500 line-clamp-1">{f.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-gray-900">₹{f.price}</td>
                    <td className="p-4 text-gray-700">{f.priceUnit === 'per_kg' ? 'kg' : 'piece'}</td>
                    <td className="p-4 text-gray-700">{typeof f.weight === 'number' ? `${f.weight} g` : 'N/A'}</td>
                    <td className="p-4 text-gray-700">{f.category?.replace('_',' ')}</td>
                    <td className="p-4 text-gray-700">{f.careLevel || '-'}</td>
                    <td className="p-4">
                      <button onClick={() => removeItem(f._id)} className="text-red-600 hover:text-red-700 font-medium">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}



'use client';

import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const handleWhatsAppClick = () => {
    const phoneNumber = '+1234567890';
    const message = 'Hi! I have a question about your fresh fish delivery service.';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 group"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="h-6 w-6 group-hover:rotate-12 transition-transform duration-200" />
      <div className="absolute -top-2 -right-2 bg-[#22C55E] text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
        💬
      </div>
    </button>
  );
}



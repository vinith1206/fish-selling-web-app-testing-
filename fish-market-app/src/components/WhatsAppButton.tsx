'use client';

import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = '+1234567890';
    const message = 'Hi! I have a question about your fresh fish.';
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 bg-[#22C55E] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 animate-bounce-slow z-50 group"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="h-6 w-6 group-hover:rotate-12 transition-transform duration-200" />
      <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        Chat with us!
        <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
      </div>
    </button>
  );
};

export default WhatsAppButton;






















'use client';

import CartFloatButton from './CartFloatButton';
import InstagramButton from './InstagramButton';
import WhatsAppButton from './WhatsAppButton';

export default function FloatingActions() {
  return (
    <div className="fixed right-6 bottom-4 flex flex-col items-center gap-4 z-50">
      <CartFloatButton />
      <InstagramButton />
      <WhatsAppButton />
    </div>
  );
}



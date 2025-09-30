export interface Fish {
  _id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  priceUnit: 'per_kg' | 'per_piece';
  category: 'community' | 'solo' | 'semi-aggressive' | 'coldwater' | 'expert' | 'breeding' | 'betta' | 'monster' | 'molly' | 'glow' | 'shrimp' | 'plants' | 'live_culture';
  availability: 'in_stock' | 'sold_out';
  description?: string;
  weight?: number;
  origin?: string;
  // Aquarium-specific properties
  careLevel?: 'beginner' | 'intermediate' | 'expert';
  tankSize?: string;
  waterTemp?: string;
  waterPH?: string;
  schooling?: boolean;
  groupSize?: number;
  discount?: number;
}

export interface CartItem {
  fish: Fish;
  quantity: number;
}

export interface Order {
  _id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivered';
  createdAt: string;
  pdfPath?: string;
}

export interface OrderSummary {
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
}

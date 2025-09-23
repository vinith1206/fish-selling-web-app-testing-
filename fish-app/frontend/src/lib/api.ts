import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

console.log('API_BASE_URL:', API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface Fish {
  _id: string;
  name: string;
  image: string;
  price: number;
  priceUnit: 'per_kg' | 'per_piece';
  availability: boolean;
  description?: string;
  category?: string;
}

export interface OrderItem {
  fishId: string;
  fishName: string;
  quantity: number;
  price: number;
  priceUnit: string;
}

export interface Order {
  _id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  status: string;
  pdfPath: string;
  createdAt: string;
}

export interface CartItem {
  fish: Fish;
  quantity: number;
}

// API functions
export const fishApi = {
  getAll: () => api.get<Fish[]>('/fishes'),
  getById: (id: string) => api.get<Fish>(`/fishes/${id}`),
  create: (fishData: Omit<Fish, '_id'>) => api.post<Fish>('/fishes', fishData),
  update: (id: string, fishData: Partial<Fish>) => api.put<Fish>(`/fishes/${id}`, fishData),
  delete: (id: string) => api.delete(`/fishes/${id}`),
};

export const orderApi = {
  create: (orderData: Omit<Order, '_id' | 'createdAt' | 'status' | 'pdfPath'>) =>
    api.post<{ success: boolean; order: Order; message: string }>('/orders', orderData),
  getById: (id: string) => api.get<Order>(`/orders/${id}`),
  getAll: () => api.get<Order[]>('/orders'),
  updateStatus: (id: string, status: string) =>
    api.put<Order>(`/orders/${id}/status`, { status }),
};

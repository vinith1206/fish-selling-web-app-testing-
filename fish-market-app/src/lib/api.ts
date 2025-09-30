import axios from 'axios';
import { Fish, Order } from '@/types';

// Normalize API base to always include /api
const frontendBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const API_BASE_URL = frontendBase.endsWith('/api') ? frontendBase : `${frontendBase}/api`;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fish API
export const fishApi = {
  getAll: () => {
    console.log('fishApi.getAll called, API_BASE_URL:', API_BASE_URL);
    return api.get<Fish[]>('/fishes');
  },
  getById: (id: string) => api.get<Fish>(`/fishes/${id}`),
  create: (fishData: Omit<Fish, '_id' | 'createdAt' | 'updatedAt'>) =>
    api.post<Fish>('/fishes', fishData),
  update: (id: string, fishData: Partial<Fish>) =>
    api.put<Fish>(`/fishes/${id}`, fishData),
  delete: (id: string) => api.delete(`/fishes/${id}`),
};

// Order API
export const orderApi = {
  create: (orderData: Omit<Order, '_id' | 'createdAt' | 'status'>) =>
    api.post<{ order: Order; pdfPath: string }>('/orders', orderData),
  getById: (id: string) => api.get<Order>(`/orders/${id}`),
  getAll: () => api.get<Order[]>('/orders'),
};

// WhatsApp API
export const whatsappApi = {
  sendMessage: (phone: string, message: string) => api.post('/whatsapp/send', { phone, message }),
  sendPDF: (phone: string, pdfPath: string) => api.post('/whatsapp/send-pdf', { phone, pdfPath }),
};






















import axios from 'axios';
import { Fish, Order } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fish API
export const fishApi = {
  getAll: () => api.get<Fish[]>('/fishes'),
  getById: (id: string) => api.get<Fish>(`/fishes/${id}`),
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






















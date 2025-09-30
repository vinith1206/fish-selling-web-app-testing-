'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Fish, CartItem } from '@/types';

const getEffectiveUnitPrice = (fish: Fish): number => {
  const hasPercentDiscount = typeof fish.discount === 'number' && fish.discount > 0;
  const hasOriginal = typeof (fish as any).originalPrice === 'number';
  const discountPriceField = (fish as any).discountPrice as number | undefined;
  if (typeof discountPriceField === 'number') return discountPriceField;
  if (hasPercentDiscount && hasOriginal) {
    const original = (fish as any).originalPrice as number;
    const computed = original * (1 - (fish.discount as number) / 100);
    return Number(computed.toFixed(2));
  }
  return fish.price;
};

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { fish: Fish; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { fishId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { fishId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addToCart: (fish: Fish, quantity: number) => void;
  removeFromCart: (fishId: string) => void;
  updateQuantity: (fishId: string, quantity: number) => void;
  clearCart: () => void;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { fish, quantity } = action.payload;
      const existingItem = state.items.find(item => item.fish._id === fish._id);
      
      let updatedItems;
      if (existingItem) {
        updatedItems = state.items.map(item =>
          item.fish._id === fish._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedItems = [...state.items, { fish, quantity }];
      }
      
      return {
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (getEffectiveUnitPrice(item.fish) * item.quantity), 0),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.fish._id !== action.payload.fishId);
      return {
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (getEffectiveUnitPrice(item.fish) * item.quantity), 0),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { fishId, quantity } = action.payload;
      const updatedItems = state.items.map(item =>
        item.fish._id === fishId
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      ).filter(item => item.quantity > 0);
      
      return {
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (getEffectiveUnitPrice(item.fish) * item.quantity), 0),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    }
    
    case 'CLEAR_CART':
      return { items: [], total: 0, itemCount: 0 };
    
    case 'LOAD_CART':
      return {
        items: action.payload,
        total: action.payload.reduce((sum, item) => sum + (getEffectiveUnitPrice(item.fish) * item.quantity), 0),
        itemCount: action.payload.reduce((sum, item) => sum + item.quantity, 0),
      };
    
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0, itemCount: 0 });

  useEffect(() => {
    const savedCart = localStorage.getItem('fish-market-cart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cartItems });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('fish-market-cart', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (fish: Fish, quantity: number) => {
    dispatch({ type: 'ADD_ITEM', payload: { fish, quantity } });
  };

  const removeFromCart = (fishId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { fishId } });
  };

  const updateQuantity = (fishId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { fishId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ state, dispatch, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

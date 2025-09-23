import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useCart } from '@/contexts/CartContext'
import CartPage from '@/app/cart/page'
import { Fish, CartItem } from '@/types'

// Mock the cart context
jest.mock('@/contexts/CartContext')
const mockUseCart = useCart as jest.MockedFunction<typeof useCart>

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn()
  }))
}))

const mockFish: Fish = {
  _id: '1',
  name: 'Test Fish',
  price: 100,
  category: 'community',
  availability: 'in_stock',
  image: 'https://example.com/fish.jpg',
  stock: 10,
  description: 'A test fish',
  weight: 0.1,
  origin: 'Test Origin',
  priceUnit: 'per_piece',
  careLevel: 'beginner',
  tankSize: '10 gallons',
  waterTemp: '72-78°F',
  waterPH: '6.5-7.5',
  schooling: false,
  groupSize: 1
}

describe('CartPage', () => {
  const mockUpdateQuantity = jest.fn()
  const mockRemoveFromCart = jest.fn()
  const mockClearCart = jest.fn()

  beforeEach(() => {
    mockUseCart.mockReturnValue({
      state: {
        items: [],
        total: 0,
        itemCount: 0
      },
      dispatch: jest.fn(),
      addToCart: jest.fn(),
      removeFromCart: mockRemoveFromCart,
      updateQuantity: mockUpdateQuantity,
      clearCart: mockClearCart
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('shows empty cart message when no items', () => {
    render(<CartPage />)
    
    expect(screen.getByText('Your Cart is Empty')).toBeInTheDocument()
    expect(screen.getByText('Add some fresh fish to get started!')).toBeInTheDocument()
    expect(screen.getByText('Continue Shopping')).toBeInTheDocument()
  })

  test('displays cart items when items are present', () => {
    const cartItems: CartItem[] = [
      { fish: mockFish, quantity: 2 }
    ]

    mockUseCart.mockReturnValue({
      state: {
        items: cartItems,
        total: 200,
        itemCount: 2
      },
      dispatch: jest.fn(),
      addToCart: jest.fn(),
      removeFromCart: mockRemoveFromCart,
      updateQuantity: mockUpdateQuantity,
      clearCart: mockClearCart
    })

    render(<CartPage />)
    
    expect(screen.getByText('Test Fish')).toBeInTheDocument()
    expect(screen.getByText('₹100')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('₹200')).toBeInTheDocument()
  })

  test('updates quantity when plus/minus buttons are clicked', () => {
    const cartItems: CartItem[] = [
      { fish: mockFish, quantity: 1 }
    ]

    mockUseCart.mockReturnValue({
      state: {
        items: cartItems,
        total: 100,
        itemCount: 1
      },
      dispatch: jest.fn(),
      addToCart: jest.fn(),
      removeFromCart: mockRemoveFromCart,
      updateQuantity: mockUpdateQuantity,
      clearCart: mockClearCart
    })

    render(<CartPage />)
    
    const plusButton = screen.getByRole('button', { name: /increase quantity/i })
    fireEvent.click(plusButton)
    
    expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 2)
  })

  test('removes item when quantity is set to 0', () => {
    const cartItems: CartItem[] = [
      { fish: mockFish, quantity: 1 }
    ]

    mockUseCart.mockReturnValue({
      state: {
        items: cartItems,
        total: 100,
        itemCount: 1
      },
      dispatch: jest.fn(),
      addToCart: jest.fn(),
      removeFromCart: mockRemoveFromCart,
      updateQuantity: mockUpdateQuantity,
      clearCart: mockClearCart
    })

    render(<CartPage />)
    
    const minusButton = screen.getByRole('button', { name: /decrease quantity/i })
    fireEvent.click(minusButton)
    
    expect(mockRemoveFromCart).toHaveBeenCalledWith('1')
  })

  test('shows correct total including delivery charge', () => {
    const cartItems: CartItem[] = [
      { fish: mockFish, quantity: 2 }
    ]

    mockUseCart.mockReturnValue({
      state: {
        items: cartItems,
        total: 200,
        itemCount: 2
      },
      dispatch: jest.fn(),
      addToCart: jest.fn(),
      removeFromCart: mockRemoveFromCart,
      updateQuantity: mockUpdateQuantity,
      clearCart: mockClearCart
    })

    render(<CartPage />)
    
    expect(screen.getByText('₹200')).toBeInTheDocument() // Subtotal
    expect(screen.getByText('₹50')).toBeInTheDocument() // Delivery
    expect(screen.getByText('₹250')).toBeInTheDocument() // Total
  })
})

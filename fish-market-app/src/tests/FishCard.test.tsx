import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useCart } from '@/contexts/CartContext'
import FishCard from '@/components/FishCard'
import { Fish } from '@/types'

// Mock the cart context
jest.mock('@/contexts/CartContext')
const mockUseCart = useCart as jest.MockedFunction<typeof useCart>

const mockFish: Fish = {
  _id: '1',
  name: 'Test Fish',
  price: 100,
  category: 'community',
  availability: 'in_stock',
  image: 'https://example.com/fish.jpg',
  stock: 10,
  description: 'A test fish',
  weight: 100,
  origin: 'Test Origin',
  priceUnit: 'per_piece',
  careLevel: 'beginner',
  tankSize: '10 gallons',
  waterTemp: '72-78°F',
  waterPH: '6.5-7.5',
  schooling: false,
  groupSize: 1
}

describe('FishCard Component', () => {
  const mockAddToCart = jest.fn()
  const mockUpdateQuantity = jest.fn()

  beforeEach(() => {
    mockUseCart.mockReturnValue({
      state: {
        items: [],
        total: 0,
        itemCount: 0
      },
      dispatch: jest.fn(),
      addToCart: mockAddToCart,
      removeFromCart: jest.fn(),
      updateQuantity: mockUpdateQuantity,
      clearCart: jest.fn()
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('renders fish information correctly', () => {
    render(<FishCard fish={mockFish} index={0} />)
    
    expect(screen.getByText('Test Fish')).toBeInTheDocument()
    expect(screen.getByText('₹100')).toBeInTheDocument()
    expect(screen.getByText('A test fish')).toBeInTheDocument()
    expect(screen.getByText('Add to Cart')).toBeInTheDocument()
  })

  test('calls addToCart when Add to Cart button is clicked', async () => {
    render(<FishCard fish={mockFish} index={0} />)
    
    const addButton = screen.getByText('Add to Cart')
    fireEvent.click(addButton)
    
    await waitFor(() => {
      expect(mockAddToCart).toHaveBeenCalledWith(mockFish, 1)
    })
  })

  test('shows quantity controls when fish is in cart', () => {
    mockUseCart.mockReturnValue({
      state: {
        items: [{ fish: mockFish, quantity: 2 }],
        total: 200,
        itemCount: 2
      },
      dispatch: jest.fn(),
      addToCart: mockAddToCart,
      removeFromCart: jest.fn(),
      updateQuantity: mockUpdateQuantity,
      clearCart: jest.fn()
    })

    render(<FishCard fish={mockFish} index={0} />)
    
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /minus/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /plus/i })).toBeInTheDocument()
  })

  test('shows sold out button when fish is not in stock', () => {
    const soldOutFish = { ...mockFish, availability: 'sold_out' as const }
    render(<FishCard fish={soldOutFish} index={0} />)
    
    expect(screen.getByText('Sold Out')).toBeInTheDocument()
    expect(screen.getByText('Sold Out')).toBeDisabled()
  })
})

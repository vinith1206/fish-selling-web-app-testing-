'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Plus, 
  Minus,
  Search,
  User,
  Phone,
  MapPin,
  ShoppingCart,
  Calculator,
  Save,
  X,
  Trash2,
  Package
} from 'lucide-react';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  availability: 'in_stock' | 'sold_out';
  image: string;
  stock: number;
  description: string;
  weight: number;
  origin: string;
  discount?: number;
  discountPrice?: number;
  originalPrice?: number;
  priceUnit: 'per_kg' | 'per_piece';
}

interface OrderItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Customer {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export default function ManualOrdersPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [customer, setCustomer] = useState<Customer>({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check admin authentication
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('adminAuth');
    if (!isAuthenticated) {
      router.push('/admin/login');
      return;
    }
  }, [router]);

  // Load products
  useEffect(() => {
    loadProducts();
  }, []);

  // Filter products
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, categoryFilter]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      // Mock data - in production, fetch from API
      const mockProducts: Product[] = [
        {
          _id: '1',
          name: 'Fresh Salmon',
          price: 899,
          category: 'aquarium_fish',
          availability: 'in_stock',
          image: '/images/salmon.jpg',
          stock: 50,
          description: 'Premium fresh salmon',
          weight: 1,
          origin: 'Norway',
          priceUnit: 'per_kg'
        },
        {
          _id: '2',
          name: 'Red Snapper',
          price: 699,
          category: 'aquarium_fish',
          availability: 'in_stock',
          image: '/images/snapper.jpg',
          stock: 30,
          description: 'Fresh red snapper',
          weight: 1,
          origin: 'India',
          priceUnit: 'per_kg'
        },
        {
          _id: '3',
          name: 'Tuna Steak',
          price: 1299,
          category: 'aquarium_fish',
          availability: 'in_stock',
          image: '/images/tuna.jpg',
          stock: 25,
          description: 'Premium tuna steak',
          weight: 1,
          origin: 'Japan',
          priceUnit: 'per_kg'
        },
        {
          _id: '4',
          name: 'Prawns',
          price: 599,
          category: 'aquarium_fish',
          availability: 'in_stock',
          image: '/images/prawns.jpg',
          stock: 40,
          description: 'Fresh prawns',
          weight: 1,
          origin: 'India',
          priceUnit: 'per_kg'
        },
        {
          _id: '5',
          name: 'Fish Tank Filter',
          price: 2499,
          category: 'accessories',
          availability: 'in_stock',
          image: '/images/filter.jpg',
          stock: 15,
          description: 'High-quality aquarium filter',
          weight: 2,
          origin: 'China',
          priceUnit: 'per_piece'
        },
        {
          _id: '6',
          name: 'Fish Food',
          price: 299,
          category: 'accessories',
          availability: 'in_stock',
          image: '/images/fish-food.jpg',
          stock: 100,
          description: 'Premium fish food',
          weight: 0.5,
          origin: 'India',
          priceUnit: 'per_piece'
        }
      ];

      setProducts(mockProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToOrder = (product: Product) => {
    const existingItem = orderItems.find(item => item.product._id === product._id);
    
    if (existingItem) {
      setOrderItems(prev => prev.map(item =>
        item.product._id === product._id
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.unitPrice }
          : item
      ));
    } else {
      const newItem: OrderItem = {
        product,
        quantity: 1,
        unitPrice: product.price,
        total: product.price
      };
      setOrderItems(prev => [...prev, newItem]);
    }
    setShowProductModal(false);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setOrderItems(prev => prev.filter(item => item.product._id !== productId));
    } else {
      setOrderItems(prev => prev.map(item =>
        item.product._id === productId
          ? { ...item, quantity, total: quantity * item.unitPrice }
          : item
      ));
    }
  };

  const removeFromOrder = (productId: string) => {
    setOrderItems(prev => prev.filter(item => item.product._id !== productId));
  };

  const calculateSubtotal = () => {
    return orderItems.reduce((total, item) => total + item.total, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + deliveryCharge;
  };

  const handleCustomerChange = (field: keyof Customer, value: string) => {
    setCustomer(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!customer.name.trim()) {
      alert('Customer name is required');
      return false;
    }
    if (!customer.phone.trim()) {
      alert('Customer phone is required');
      return false;
    }
    if (!customer.address.trim()) {
      alert('Customer address is required');
      return false;
    }
    if (!customer.city.trim()) {
      alert('City is required');
      return false;
    }
    if (!customer.state.trim()) {
      alert('State is required');
      return false;
    }
    if (!customer.pincode.trim()) {
      alert('Pincode is required');
      return false;
    }
    if (orderItems.length === 0) {
      alert('Please add at least one item to the order');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Generate order ID
      const orderId = `ORD-${Date.now()}`;
      
      // Create order object
      const order = {
        id: orderId,
        customerName: customer.name,
        customerPhone: customer.phone,
        customerEmail: customer.email,
        customerAddress: `${customer.address}, ${customer.city}, ${customer.state} ${customer.pincode}`,
        total: calculateTotal(),
        subtotal: calculateSubtotal(),
        deliveryCharge,
        status: 'pending',
        createdAt: new Date().toISOString(),
        items: orderItems.map(item => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.unitPrice,
          total: item.total
        })),
        isManualOrder: true
      };

      // Save to localStorage to persist the order
      const existingOrders = localStorage.getItem('adminOrders');
      const orders = existingOrders ? JSON.parse(existingOrders) : [];
      orders.push(order);
      localStorage.setItem('adminOrders', JSON.stringify(orders));
      
      console.log('Manual order created:', order);
      
      // Reset form
      setOrderItems([]);
      setCustomer({
        name: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
      });
      setDeliveryCharge(0);
      
      alert(`Order ${orderId} created successfully!`);
      
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error creating order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'aquarium_fish', name: 'Aquarium Fish' },
    { id: 'pets', name: 'Pets' },
    { id: 'accessories', name: 'Accessories' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner h-12 w-12 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/dashboard"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Manual Order Management</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Customer Information
              </h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customer.name}
                    onChange={(e) => handleCustomerChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                    placeholder="Enter customer name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={customer.phone}
                    onChange={(e) => handleCustomerChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={customer.email}
                    onChange={(e) => handleCustomerChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                    placeholder="Enter email address (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={customer.address}
                    onChange={(e) => handleCustomerChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                    rows={3}
                    placeholder="Enter full address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customer.city}
                      onChange={(e) => handleCustomerChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customer.state}
                      onChange={(e) => handleCustomerChange('state', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                      placeholder="State"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customer.pincode}
                    onChange={(e) => handleCustomerChange('pincode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                    placeholder="Enter pincode"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Charge (₹)
                  </label>
                  <input
                    type="number"
                    value={deliveryCharge}
                    onChange={(e) => setDeliveryCharge(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="Enter delivery charge"
                    min="0"
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Order Items & Products */}
          <div className="lg:col-span-2">
            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Order Items ({orderItems.length})
                </h2>
                <button
                  onClick={() => setShowProductModal(true)}
                  className="bg-[#1E90FF] text-white px-4 py-2 rounded-lg hover:bg-[#0EA5E9] flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </button>
              </div>

              {orderItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No items in order. Click "Add Product" to start.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orderItems.map((item) => (
                    <div key={item.product._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                        <p className="text-sm text-gray-500">₹{item.unitPrice} per {item.product.priceUnit === 'per_kg' ? 'kg' : 'piece'}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <span className="font-semibold text-gray-900 w-20 text-right">₹{item.total}</span>
                        <button
                          onClick={() => removeFromOrder(item.product._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Order Summary */}
              {orderItems.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{calculateSubtotal()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Charge:</span>
                      <span>₹{deliveryCharge}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total:</span>
                      <span>₹{calculateTotal()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || orderItems.length === 0}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner h-5 w-5 mr-2"></div>
                    Creating Order...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Create Manual Order
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Product Selection Modal */}
        {showProductModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Select Products</h2>
                  <button
                    onClick={() => setShowProductModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Search and Filter */}
                <div className="mb-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search products..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                      >
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <div key={product._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        <span className="text-sm text-gray-500">{product.category}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-[#1E90FF]">₹{product.price}</span>
                        <button
                          onClick={() => addToOrder(product)}
                          disabled={product.availability === 'sold_out'}
                          className="bg-[#1E90FF] text-white px-3 py-1 rounded text-sm hover:bg-[#0EA5E9] disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {product.availability === 'sold_out' ? 'Out of Stock' : 'Add'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

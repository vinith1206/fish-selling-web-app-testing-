'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  DollarSign, 
  Users, 
  Package, 
  TrendingUp, 
  Clock,
  LogOut,
  Plus,
  Eye,
  Edit,
  Trash2,
  Truck
} from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled' | 'deleted';
  createdAt: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

interface Fish {
  _id: string;
  name: string;
  price: number;
  category: string;
  availability: 'in_stock' | 'sold_out';
  image: string;
  stock: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fishes, setFishes] = useState<Fish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  // Check admin authentication
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('adminAuth');
    if (!isAuthenticated) {
      router.push('/admin/login');
      return;
    }
  }, [router]);

  // Load data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Mock data - in production, fetch from API
      const mockOrders: Order[] = [
        {
          id: 'ORD-001',
          customerName: 'John Doe',
          customerPhone: '+1 234-567-8900',
          total: 2547,
          status: 'confirmed',
          createdAt: '2024-01-15T10:30:00Z',
          items: [
            { name: 'Fresh Salmon', quantity: 2, price: 899 },
            { name: 'Red Snapper', quantity: 1, price: 699 }
          ]
        },
        {
          id: 'ORD-002',
          customerName: 'Jane Smith',
          customerPhone: '+1 234-567-8901',
          total: 1899,
          status: 'delivered',
          createdAt: '2024-01-15T09:15:00Z',
          items: [
            { name: 'Tuna Steak', quantity: 1, price: 1299 },
            { name: 'Prawns', quantity: 1, price: 599 }
          ]
        },
        {
          id: 'ORD-003',
          customerName: 'Mike Johnson',
          customerPhone: '+1 234-567-8902',
          total: 1249,
          status: 'preparing',
          createdAt: '2024-01-15T11:45:00Z',
          items: [
            { name: 'Sea Bass', quantity: 1, price: 799 },
            { name: 'Crab', quantity: 1, price: 999 }
          ]
        }
      ];

      const mockFishes: Fish[] = [
        {
          _id: '1',
          name: 'Fresh Salmon',
          price: 899,
          category: 'premium',
          availability: 'in_stock',
          image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop&auto=format',
          stock: 15
        },
        {
          _id: '2',
          name: 'Red Snapper',
          price: 699,
          category: 'fresh',
          availability: 'in_stock',
          image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop&auto=format',
          stock: 8
        },
        {
          _id: '3',
          name: 'Tuna Steak',
          price: 1299,
          category: 'premium',
          availability: 'sold_out',
          image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&auto=format',
          stock: 0
        }
      ];

      // Check if we have saved orders in localStorage
      const savedOrders = localStorage.getItem('adminOrders');
      
      if (savedOrders) {
        // Load saved orders
        const parsedOrders = JSON.parse(savedOrders);
        console.log('Dashboard: Loading saved orders from localStorage:', parsedOrders.length, 'orders');
        setOrders(parsedOrders);
      } else {
        // Load mock data only if no saved data exists
        setOrders(mockOrders);
      }
      
      setFishes(mockFishes);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    router.push('/admin/login');
  };

  const handleDeleteOrder = (order: Order) => {
    setOrderToDelete(order);
    setShowDeleteModal(true);
  };

  const confirmDeleteOrder = () => {
    if (orderToDelete) {
      const updatedOrders = orders.filter(order => order.id !== orderToDelete.id);
      console.log('Dashboard: Deleting order:', orderToDelete.id, 'Remaining orders:', updatedOrders.length);
      setOrders(updatedOrders);
      // Immediately save to localStorage
      localStorage.setItem('adminOrders', JSON.stringify(updatedOrders));
      console.log('Dashboard: Saved to localStorage:', updatedOrders.length, 'orders');
      setShowDeleteModal(false);
      setOrderToDelete(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const lowStockItems = fishes.filter(fish => fish.stock < 5).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner h-12 w-12 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
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
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-[#1E90FF] to-[#0EA5E9] rounded-xl">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">FreshCatch Admin</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalSales.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-full">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <Package className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-gray-900">{lowStockItems}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/orders"
              className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200"
            >
              <Eye className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">View All Orders</h3>
                <p className="text-sm text-gray-600">Manage customer orders</p>
              </div>
            </Link>

            <Link
              href="/admin/inventory"
              className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200"
            >
              <Package className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Manage Inventory</h3>
                <p className="text-sm text-gray-600">Add/update fish products</p>
              </div>
            </Link>

            <Link
              href="/admin/offers"
              className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200"
            >
              <TrendingUp className="h-6 w-6 text-purple-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Manage Offers</h3>
                <p className="text-sm text-gray-600">Set discounts and promotions</p>
              </div>
            </Link>

            <Link
              href="/admin/shipping"
              className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200"
            >
              <Truck className="h-6 w-6 text-orange-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Shipping Management</h3>
                <p className="text-sm text-gray-600">Manage shipping rates & delivery</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-[#1E90FF] hover:text-[#0EA5E9] font-medium"
            >
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-gray-500">{order.customerPhone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{order.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-[#1E90FF] hover:text-[#0EA5E9] mr-3" title="View Details">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900 mr-3" title="Edit Order">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteOrder(order)}
                        className="text-red-600 hover:text-red-900" 
                        title="Delete Order"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Order Confirmation Modal */}
        {showDeleteModal && orderToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <Trash2 className="h-6 w-6 text-red-500 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Delete Order</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to permanently delete order <strong>{orderToDelete.id}</strong>? 
                  This action cannot be undone and the order will be removed from the system.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setOrderToDelete(null);
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteOrder}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Yes, Delete Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

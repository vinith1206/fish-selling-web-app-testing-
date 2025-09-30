'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Download,
  Clock,
  CheckCircle,
  Truck,
  Package,
  X,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  total: number;
  subtotal: number;
  deliveryCharge: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled' | 'deleted';
  createdAt: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToAction, setOrderToAction] = useState<Order | null>(null);
  const isInitialLoad = useRef(true);

  // Check admin authentication
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('adminAuth');
    if (!isAuthenticated) {
      router.push('/admin/login');
      return;
    }
  }, [router]);

  // Load orders data
  useEffect(() => {
    loadOrders();
  }, []);

  // No longer using localStorage - orders are fetched from API
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
    }
  }, [orders]);

  // Filter orders
  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerPhone.includes(searchTerm) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      // Fetch real orders from the API
      const response = await fetch('http://localhost:5001/api/orders');
      
      if (response.ok) {
        const realOrders = await response.json();
        console.log('Loading real orders from API:', realOrders.length, 'orders');
        
        // Transform API data to match the expected format
        const transformedOrders: Order[] = realOrders.map((order: any) => ({
          id: order.orderId || order._id,
          customerName: order.customerName || 'N/A',
          customerPhone: order.customerPhone || 'N/A',
          customerAddress: order.customerAddress || 'N/A',
          total: order.total || 0,
          subtotal: order.subtotal || 0,
          deliveryCharge: order.deliveryCharge || 0,
          status: order.status || 'pending',
          createdAt: order.createdAt || new Date().toISOString(),
          items: order.items?.map((item: any) => ({
            name: item.fish?.name || 'Unknown Fish',
            quantity: item.quantity || 0,
            price: item.price || 0,
            total: (item.quantity || 0) * (item.price || 0)
          })) || []
        }));
        
        setOrders(transformedOrders);
      } else {
        console.error('Failed to fetch orders from API:', response.status);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error loading orders from API:', error);
      // Fallback to mock data if API fails
      loadMockOrders();
    } finally {
      setIsLoading(false);
    }
  };

  const loadMockOrders = () => {
    setOrders([]);
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      // Update status via API
      const response = await fetch(`http://localhost:5001/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Update local state
        const updatedOrders = orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
        console.log(`Order ${orderId} status updated to ${newStatus}`);
      } else {
        console.error('Failed to update order status:', response.status);
        // Still update local state for immediate UI feedback
        const updatedOrders = orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      // Still update local state for immediate UI feedback
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
    }
  };

  const handleCancelOrder = (order: Order) => {
    setOrderToAction(order);
    setShowCancelModal(true);
  };

  const handleDeleteOrder = (order: Order) => {
    setOrderToAction(order);
    setShowDeleteModal(true);
  };

  const confirmCancelOrder = () => {
    if (orderToAction) {
      updateOrderStatus(orderToAction.id, 'cancelled');
      setShowCancelModal(false);
      setOrderToAction(null);
    }
  };

  const confirmDeleteOrder = () => {
    if (orderToAction) {
      const updatedOrders = orders.filter(order => order.id !== orderToAction.id);
      console.log('Deleting order:', orderToAction.id, 'Remaining orders:', updatedOrders.length);
      setOrders(updatedOrders);
      setShowDeleteModal(false);
      setOrderToAction(null);
    }
  };

  const resetOrders = async () => {
    if (confirm('Are you sure you want to delete ALL orders? This action cannot be undone!')) {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5001/api/orders', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('Reset orders result:', result);
          setOrders([]);
          setFilteredOrders([]);
          alert(`Successfully deleted ${result.deletedCount} orders`);
        } else {
          console.error('Failed to reset orders:', response.status);
          alert('Failed to reset orders. Please try again.');
        }
      } catch (error) {
        console.error('Error resetting orders:', error);
        alert('Error resetting orders. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'preparing': return <Package className="h-4 w-4" />;
      case 'delivered': return <Truck className="h-4 w-4" />;
      case 'cancelled': return <X className="h-4 w-4" />;
      case 'deleted': return <Trash2 className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'deleted': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Build display address from available fields (supports older orders and new billingDetails structure)
  const getOrderAddress = (order: Order) => {
    if (order.customerAddress && order.customerAddress.trim()) return order.customerAddress;
    const anyOrder = order as unknown as { billingDetails?: any };
    const b = anyOrder?.billingDetails;
    if (!b) return '';
    const parts = [
      b.streetAddress1,
      b.streetAddress2,
      b.city,
      b.state,
      b.zipcode || b.pincode,
    ]
      .filter((p: string | undefined) => typeof p === 'string' && p.trim().length > 0)
      .map((p: string) => p.trim());
    return parts.join(', ');
  };

  const getOrderName = (order: Order) => {
    if (order.customerName && order.customerName.trim()) return order.customerName;
    const anyOrder = order as unknown as { billingDetails?: any };
    const b = anyOrder?.billingDetails;
    if (!b) return '';
    const first = (b.firstName || '').trim();
    const last = (b.lastName || '').trim();
    return [first, last].filter(Boolean).join(' ');
  };

  const getOrderPhone = (order: Order) => {
    if (order.customerPhone && order.customerPhone.trim()) return order.customerPhone;
    const anyOrder = order as unknown as { billingDetails?: any };
    const b = anyOrder?.billingDetails;
    return (b?.phone || '').trim();
  };

  const getOrderZipcode = (order: Order) => {
    const anyOrder = order as unknown as { billingDetails?: any };
    const b = anyOrder?.billingDetails;
    return (b?.zipcode || b?.pincode || '').toString().trim();
  };

  const downloadOrderPDF = (order: Order) => {
    // Generate PDF for order
    const orderHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Order ${order.id}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .order-info { margin-bottom: 20px; }
          .items { margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .total { font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>FreshCatch - Order Receipt</h1>
          <h2>Order #${order.id}</h2>
        </div>
        <div class="order-info">
          <h3>Customer Information</h3>
          <p><strong>Name:</strong> ${getOrderName(order)}</p>
          <p><strong>Phone:</strong> ${getOrderPhone(order)}</p>
          <p><strong>Address:</strong> ${getOrderAddress(order)}</p>
          <p><strong>Zipcode:</strong> ${getOrderZipcode(order) || 'N/A'}</p>
        </div>
        <div class="items">
          <h3>Order Items</h3>
          <table>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
            ${order.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price}</td>
                <td>₹${item.total}</td>
              </tr>
            `).join('')}
            <tr>
              <td colspan="3"><strong>Subtotal</strong></td>
              <td class="total">₹${order.subtotal}</td>
            </tr>
            <tr>
              <td colspan="3"><strong>Delivery Charge</strong></td>
              <td class="total">₹${order.deliveryCharge}</td>
            </tr>
            <tr>
              <td colspan="3"><strong>Total</strong></td>
              <td class="total">₹${order.total}</td>
            </tr>
          </table>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([orderHTML], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `order-${order.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner h-12 w-12 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
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
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-4">
                <Link
                  href="/admin/dashboard"
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Dashboard
                </Link>
                <h1 className="text-xl font-bold text-gray-900">Orders Management</h1>
              </div>
              <button
                onClick={resetOrders}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                title="Delete all orders permanently"
              >
                Clear All Orders
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders by customer name, phone, or order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="deleted">Deleted</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
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
                    Items
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
                {filteredOrders.map((order) => (
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
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{order.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-[#1E90FF] hover:text-[#0EA5E9]"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => downloadOrderPDF(order)}
                          className="text-green-600 hover:text-green-900"
                          title="Download PDF"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        {order.status !== 'cancelled' && order.status !== 'deleted' && (
                          <button
                            onClick={() => handleCancelOrder(order)}
                            className="text-orange-600 hover:text-orange-900"
                            title="Cancel Order"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteOrder(order)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Order"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Preparing</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Order Details - {selectedOrder.id}</h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Customer Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p><strong>Name:</strong> {getOrderName(selectedOrder) || 'N/A'}</p>
                      <p><strong>Phone:</strong> {getOrderPhone(selectedOrder) || 'N/A'}</p>
                      <p><strong>Address:</strong> {getOrderAddress(selectedOrder) || 'N/A'}</p>
                      <p><strong>Zipcode:</strong> {getOrderZipcode(selectedOrder) || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Items</h3>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity} × ₹{item.price}</p>
                          </div>
                          <p className="font-semibold">₹{item.total}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Summary</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{selectedOrder.subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Charge:</span>
                        <span>₹{selectedOrder.deliveryCharge}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t pt-2">
                        <span>Total:</span>
                        <span>₹{selectedOrder.total}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Order Confirmation Modal */}
        {showCancelModal && orderToAction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-orange-500 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Cancel Order</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to cancel order <strong>{orderToAction.id}</strong>? 
                  This action will mark the order as cancelled and cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowCancelModal(false);
                      setOrderToAction(null);
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmCancelOrder}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    Yes, Cancel Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Order Confirmation Modal */}
        {showDeleteModal && orderToAction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <Trash2 className="h-6 w-6 text-red-500 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Delete Order</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to permanently delete order <strong>{orderToAction.id}</strong>? 
                  This action cannot be undone and the order will be removed from the system.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setOrderToAction(null);
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

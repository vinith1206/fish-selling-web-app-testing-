'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Download, Home, ShoppingBag, Clock, MapPin, Phone, User } from 'lucide-react';
import Link from 'next/link';

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(true);
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const [orderData, setOrderData] = useState({
    orderId: orderId || 'ORD-1234567890',
    customerName: 'Loading...',
    customerPhone: 'Loading...',
    customerAddress: 'Loading...',
    items: [],
    subtotal: 0,
    deliveryCharge: 50,
    total: 0,
    estimatedDelivery: '2:30 PM - 3:00 PM',
    orderTime: new Date().toLocaleString(),
  });

  // Load order data from sessionStorage
  useEffect(() => {
    const storedOrderData = sessionStorage.getItem('orderData');
    if (storedOrderData) {
      try {
        const parsedData = JSON.parse(storedOrderData);
        const billing = parsedData.billingDetails || {};
        const fullName = [billing.firstName, billing.lastName].filter(Boolean).join(' ').trim();
        const composedAddress = [
          billing.streetAddress1,
          billing.streetAddress2,
          billing.city,
          billing.state
        ]
          .filter(Boolean)
          .join(', ');

        setOrderData({
          orderId: parsedData.orderId || orderId || 'ORD-1234567890',
          customerName: fullName || 'N/A',
          customerPhone: billing.phone || 'N/A',
          customerAddress: composedAddress || 'N/A',
          customerZipcode: billing.zipcode || 'N/A',
          items: Array.isArray(parsedData.items) ? parsedData.items : [],
          subtotal: parsedData.subtotal ?? 0,
          deliveryCharge: parsedData.deliveryCharge ?? 0,
          total: parsedData.total ?? 0,
          estimatedDelivery: parsedData.estimatedDelivery || '2:30 PM - 3:00 PM',
          orderTime: parsedData.orderTime || new Date().toLocaleString(),
          shippingMethod: parsedData.shippingMethod || 'Standard Delivery',
        } as any);

        // Clear the stored data after loading
        sessionStorage.removeItem('orderData');
      } catch (error) {
        console.error('Error parsing order data:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Simulate PDF generation
    const timer = setTimeout(() => {
      setIsGeneratingPDF(false);
      setPdfGenerated(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleDownloadPDF = () => {
    // Create a beautiful HTML receipt
    const receiptHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Invoice - ${orderData.orderId}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Arial', sans-serif;
          background: #f8f9fa;
          padding: 20px;
        }
        
        .receipt {
          max-width: 400px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        
        .header {
          background: linear-gradient(135deg, #1E90FF, #0EA5E9);
          color: white;
          padding: 20px;
          text-align: center;
        }
        
        .logo {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        
        .tagline {
          font-size: 12px;
          opacity: 0.9;
        }
        
        .address {
          background: #f8f9fa;
          padding: 15px 20px;
          border-bottom: 1px solid #e9ecef;
        }
        
        .address h3 {
          color: #495057;
          font-size: 14px;
          margin-bottom: 8px;
        }
        
        .address p {
          color: #6c757d;
          font-size: 12px;
          line-height: 1.4;
        }
        
        .order-info {
          padding: 20px;
          border-bottom: 1px solid #e9ecef;
        }
        
        .order-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        
        .order-row strong {
          color: #495057;
        }
        
        .items {
          padding: 20px;
        }
        
        .item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f1f3f4;
        }
        
        .item:last-child {
          border-bottom: none;
        }
        
        .item-name {
          font-weight: 500;
          color: #212529;
        }
        
        .item-qty {
          color: #6c757d;
          font-size: 14px;
        }
        
        .item-price {
          font-weight: 600;
          color: #495057;
        }
        
        .totals {
          padding: 20px;
          background: #f8f9fa;
        }
        
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        
        .total-row.final {
          border-top: 2px solid #1E90FF;
          padding-top: 12px;
          margin-top: 12px;
          font-size: 18px;
          font-weight: bold;
          color: #1E90FF;
        }
        
        .footer {
          padding: 20px;
          text-align: center;
          background: #f8f9fa;
          color: #6c757d;
          font-size: 12px;
        }
        
        .thank-you {
          color: #22C55E;
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .divider {
          height: 1px;
          background: #e9ecef;
          margin: 15px 0;
        }
      </style>
    </head>
    <body>
      <div class="receipt">
        <div class="header">
          <div class="logo">🐟 FreshCatch</div>
          <div class="tagline">Fresh Fish, Delivered Daily</div>
        </div>
        
        <div class="address">
          <h3>📍 Store Address</h3>
          <p>123 Ocean Drive, Fish Market<br>
          Mumbai, Maharashtra 400001<br>
          Phone: +91 98765 43210<br>
          Email: info@freshcatch.com</p>
        </div>
        
        <div class="address" style="background: #e3f2fd; border-left: 4px solid #1E90FF;">
          <h3>👤 Customer Information</h3>
        <p><strong>Name:</strong> ${orderData.customerName}<br>
        <strong>Phone:</strong> ${orderData.customerPhone}<br>
        <strong>Delivery Address:</strong><br>
        ${orderData.customerAddress}<br>
        <strong>Zipcode:</strong> ${orderData.customerZipcode || 'N/A'}<br>
        <strong>Shipping Method:</strong> ${orderData.shippingMethod || 'Standard Delivery'}</p>
        </div>
        
        <div class="order-info">
          <div class="order-row">
            <span><strong>Order ID:</strong></span>
            <span>${orderData.orderId}</span>
          </div>
          <div class="order-row">
            <span><strong>Date:</strong></span>
            <span>${orderData.orderTime}</span>
          </div>
        </div>
        
        <div class="items">
          <h3 style="color: #495057; margin-bottom: 15px; font-size: 16px;">🛒 Order Items</h3>
          ${orderData.items.map(item => `
            <div class="item">
              <div>
                <div class="item-name">${item.name}</div>
                <div class="item-qty">Qty: ${item.quantity}</div>
              </div>
              <div class="item-price">₹${item.total}</div>
            </div>
          `).join('')}
        </div>
        
        <div class="totals">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>₹${orderData.subtotal}</span>
          </div>
        <div class="total-row">
          <span>Delivery Charge (${orderData.shippingMethod || 'Standard Delivery'}):</span>
          <span>₹${orderData.deliveryCharge}</span>
        </div>
          <div class="total-row final">
            <span>Total Amount:</span>
            <span>₹${orderData.total}</span>
          </div>
        </div>
        
        <div class="footer">
          <div class="thank-you">Thank you for choosing FreshCatch! 🐟</div>
          <div class="divider"></div>
          <p>We appreciate your business and look forward to serving you again!</p>
          <p style="margin-top: 8px;">Visit us at: www.freshcatch.com</p>
        </div>
      </div>
    </body>
    </html>
    `;
    
    // Create and download the HTML file
    const blob = new Blob([receiptHTML], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${orderData.orderId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleWhatsAppShare = () => {
    const message = `Hi! I just placed an order #${orderData.orderId} for fresh fish. Total: ₹${orderData.total}`;
    const whatsappUrl = `https://wa.me/+1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
          <p className="text-xl text-gray-600 mb-2">
            Thank you for your order. We're preparing your fresh fish.
          </p>
          <p className="text-lg text-gray-500">
            Order ID: <span className="font-bold text-[#1E90FF]">{orderData.orderId}</span>
          </p>
        </div>

        {/* PDF Generation Status */}
        {isGeneratingPDF && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center">
            <div className="spinner h-12 w-12 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating Invoice</h2>
            <p className="text-gray-600">Please wait while we create your order invoice...</p>
          </div>
        )}

        {/* Order Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {orderData.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₹{item.total}</p>
                    <p className="text-sm text-gray-500">₹{item.price} each</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{orderData.subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <div>
                  <span>Delivery Charge</span>
                  <div className="text-xs text-gray-500">{orderData.shippingMethod || 'Standard Delivery'}</div>
                </div>
                <span>₹{orderData.deliveryCharge}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{orderData.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Delivery Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <User className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Customer Name</h3>
                  <p className="text-gray-600">{orderData.customerName}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Delivery Address</h3>
                  <p className="text-gray-600">{orderData.customerAddress}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Contact Number</h3>
                  <p className="text-gray-600">{orderData.customerPhone}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-orange-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Shipping Method</h3>
                  <p className="text-gray-600">{orderData.shippingMethod || 'Standard Delivery'}</p>
                  <p className="text-sm text-gray-500">Order placed at {orderData.orderTime}</p>
                </div>
              </div>
              
              {orderData.customerZipcode && (
                <div className="flex items-start space-x-4">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Zipcode</h3>
                    <p className="text-gray-600">{orderData.customerZipcode}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Next?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-6 bg-blue-50 rounded-xl">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="font-semibold text-gray-900 mb-2">Track Your Order</h3>
              <p className="text-sm text-gray-600 mb-4">We'll send you updates via SMS</p>
              <button className="btn-primary text-sm px-4 py-2">Track Now</button>
            </div>
            
            <div className="p-6 bg-green-50 rounded-xl">
              <div className="text-3xl mb-3">💬</div>
              <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">Chat with us on WhatsApp</p>
              <button 
                onClick={handleWhatsAppShare}
                className="btn-secondary text-sm px-4 py-2"
              >
                Chat Now
              </button>
            </div>
            
            <div className="p-6 bg-purple-50 rounded-xl">
              <div className="text-3xl mb-3">📄</div>
              <h3 className="font-semibold text-gray-900 mb-2">Download Receipt</h3>
              <p className="text-sm text-gray-600 mb-4">Get your beautiful order receipt</p>
              <button 
                onClick={handleDownloadPDF}
                disabled={!pdfGenerated}
                className={`text-sm px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                  pdfGenerated 
                    ? 'bg-purple-600 text-white hover:bg-purple-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Download className="h-4 w-4 inline mr-2" />
                {pdfGenerated ? 'Download Receipt' : 'Generating...'}
              </button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn-primary">
              <Home className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
            <Link href="/" className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200">
              <ShoppingBag className="h-5 w-5 mr-2 inline" />
              Order More Fish
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

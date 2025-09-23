const express = require('express');
const Order = require('../models/Order');
const Fish = require('../models/Fish');
const { generatePDF } = require('../utils/pdfGenerator');
const router = express.Router();

// GET /api/orders - Get all orders (Admin only)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('items.fish').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// GET /api/orders/:id - Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.fish');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error fetching order' });
  }
});

// POST /api/orders - Create new order
router.post('/', async (req, res) => {
  try {
    const { customerName, customerPhone, customerAddress, items } = req.body;
    
    const orderId = `ORD-${Date.now()}`;
    
    let subtotal = 0;
    const orderItems = [];
    
    for (const item of items) {
      const fish = await Fish.findById(item.fish._id);
      if (!fish) {
        return res.status(400).json({ message: `Fish with ID ${item.fish._id} not found` });
      }
      
      const itemTotal = fish.price * item.quantity;
      subtotal += itemTotal;
      
      orderItems.push({ fish: fish._id, quantity: item.quantity, price: fish.price });
    }
    
    const deliveryCharge = 50;
    const total = subtotal + deliveryCharge;
    
    const order = new Order({
      orderId,
      customerName,
      customerPhone,
      customerAddress,
      items: orderItems,
      subtotal,
      deliveryCharge,
      total,
    });
    
    await order.save();
    
    const pdfPath = await generatePDF(order);
    order.pdfPath = pdfPath;
    await order.save();
    
    res.status(201).json({ order: await Order.findById(order._id).populate('items.fish'), pdfPath });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
});

// PUT /api/orders/:id/status - Update order status (Admin only)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('items.fish');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
});

module.exports = router;






















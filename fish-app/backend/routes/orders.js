const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Fish = require('../models/Fish');
const { generateInvoice } = require('../utils/pdfGenerator');
const { sendOrderConfirmation } = require('../utils/whatsappSender');

// POST /api/orders - Create new order
router.post('/', async (req, res) => {
  try {
    const { customerName, customerPhone, customerAddress, items } = req.body;

    // Validate required fields
    if (!customerName || !customerPhone || !customerAddress || !items || items.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const fish = await Fish.findById(item.fishId);
      if (!fish || !fish.availability) {
        return res.status(400).json({ error: `Fish ${item.fishName || item.fishId} is not available` });
      }

      const itemTotal = item.quantity * item.price;
      subtotal += itemTotal;

      orderItems.push({
        fishId: fish._id,
        fishName: fish.name,
        quantity: item.quantity,
        price: item.price,
        priceUnit: fish.priceUnit
      });
    }

    const deliveryCharge = 50; // Fixed delivery charge
    const total = subtotal + deliveryCharge;

    // Create order
    const order = new Order({
      customerName,
      customerPhone,
      customerAddress,
      items: orderItems,
      subtotal,
      deliveryCharge,
      total
    });

    await order.save();

    // Generate PDF invoice
    const pdfPath = await generateInvoice(order);
    order.pdfPath = pdfPath;
    await order.save();

    // Send WhatsApp notification
    try {
      await sendOrderConfirmation(order);
      order.whatsappMessageId = 'sent';
      await order.save();
    } catch (whatsappError) {
      console.error('WhatsApp notification failed:', whatsappError);
      // Don't fail the order if WhatsApp fails
    }

    res.status(201).json({
      success: true,
      order,
      message: 'Order placed successfully! Invoice has been sent to the seller.'
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// GET /api/orders/:id - Get specific order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.fishId');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// GET /api/orders - Get all orders (Admin only)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate('items.fishId');
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// PUT /api/orders/:id/status - Update order status (Admin only)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;

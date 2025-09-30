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
    let totalWeightGrams = 0;
    const orderItems = [];
    
    for (const item of items) {
      const fish = await Fish.findById(item.fish._id);
      if (!fish) {
        return res.status(400).json({ message: `Fish with ID ${item.fish._id} not found` });
      }
      
      // Calculate effective price (same logic as frontend)
      let effectivePrice = fish.price;
      if (fish.discountPrice) {
        effectivePrice = fish.discountPrice;
      } else if (fish.discount && fish.originalPrice) {
        effectivePrice = fish.originalPrice * (1 - fish.discount / 100);
      }
      
      const itemTotal = effectivePrice * item.quantity;
      subtotal += itemTotal;
      
      // Calculate total weight in grams
      const perUnitWeight = fish.weight || 0; // grams per unit
      totalWeightGrams += perUnitWeight * item.quantity;
      
      orderItems.push({ fish: fish._id, quantity: item.quantity, price: effectivePrice });
    }
    
    // Calculate delivery charge: ₹90 × exact weight in kg, minimum ₹90
    const totalWeightKg = totalWeightGrams / 1000;
    const deliveryCharge = totalWeightKg > 0 ? Math.max(90, Math.round(90 * totalWeightKg * 100) / 100) : 0;
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
    
    let pdfPath = null;
    try {
      pdfPath = await generatePDF(order);
      order.pdfPath = pdfPath;
      await order.save();
    } catch (err) {
      console.error('PDF generation failed, proceeding without PDF:', err.message);
    }
    
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
    const orderId = req.params.id;
    
    // Try to find by orderId field first (for custom IDs like ORD-xxx), then by _id
    let order = await Order.findOneAndUpdate(
      { orderId: orderId }, 
      { status }, 
      { new: true }
    ).populate('items.fish');
    
    // If not found by orderId, try by _id (for MongoDB ObjectIds)
    if (!order) {
      order = await Order.findByIdAndUpdate(orderId, { status }, { new: true }).populate('items.fish');
    }
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
});

// DELETE /api/orders - Delete all orders (Admin only)
router.delete('/', async (req, res) => {
  try {
    const result = await Order.deleteMany({});
    res.json({ 
      message: `Successfully deleted ${result.deletedCount} orders`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting all orders:', error);
    res.status(500).json({ message: 'Error deleting all orders' });
  }
});

module.exports = router;






















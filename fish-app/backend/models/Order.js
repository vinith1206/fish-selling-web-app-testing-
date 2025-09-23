const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  fishId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fish',
    required: true
  },
  fishName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  priceUnit: {
    type: String,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerPhone: {
    type: String,
    required: true,
    trim: true
  },
  customerAddress: {
    type: String,
    required: true,
    trim: true
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryCharge: {
    type: Number,
    default: 50,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  pdfPath: {
    type: String,
    default: ''
  },
  whatsappMessageId: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);

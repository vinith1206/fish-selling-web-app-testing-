const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  fish: { type: mongoose.Schema.Types.ObjectId, ref: 'Fish', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true, trim: true },
    customerPhone: { type: String, required: true, trim: true },
    customerAddress: { type: String, required: true, trim: true },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true, min: 0 },
    deliveryCharge: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['pending', 'confirmed', 'preparing', 'delivered'], default: 'pending' },
    pdfPath: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);






















const mongoose = require('mongoose');

const fishSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    priceUnit: { type: String, enum: ['per_kg', 'per_piece'], default: 'per_piece' },
    category: { 
      type: String, 
      enum: ['betta', 'community', 'monster', 'glow', 'shrimp', 'plants', 'live_culture', 'breeding', 'coldwater', 'solo', 'molly', 'expert', 'semi-aggressive'], 
      default: 'community' 
    },
    availability: { type: String, enum: ['in_stock', 'sold_out'], default: 'in_stock' },
    description: { type: String, trim: true },
    weight: { type: Number, min: 0 },
    origin: { type: String, trim: true },
    discount: { type: Number, min: 0, max: 100, default: 0 },
    discountPrice: { type: Number, min: 0 },
    careLevel: { type: String, enum: ['beginner', 'intermediate', 'expert'], default: 'beginner' },
    tankSize: { type: String, trim: true },
    waterTemp: { type: String, trim: true },
    waterPH: { type: String, trim: true },
    schooling: { type: Boolean, default: false },
    groupSize: { type: Number, min: 1, default: 1 },
    stock: { type: Number, min: 0, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Fish', fishSchema);






















const mongoose = require('mongoose');

const fishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  priceUnit: {
    type: String,
    enum: ['per_kg', 'per_piece'],
    default: 'per_kg'
  },
  availability: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: 'fresh'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Fish', fishSchema);

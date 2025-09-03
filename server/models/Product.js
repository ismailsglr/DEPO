const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  emoji: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  features: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    enum: ['chicken', 'duck', 'cow', 'goose', 'turkey', 'sheep', 'pig'],
    required: true
  },
  stock: {
    type: Number,
    default: 100,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  metadata: {
    color: String,
    bgColor: String,
    borderColor: String
  }
}, {
  timestamps: true
});

// Index for better query performance
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });

module.exports = mongoose.model('Product', productSchema); 
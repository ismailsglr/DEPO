const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    trim: true
  },
  publicKey: {
    type: String,
    required: true,
    trim: true
  },
  profile: {
    username: {
      type: String,
      trim: true
    },
    avatar: {
      type: String
    }
  },
  stats: {
    totalPurchases: {
      type: Number,
      default: 0
    },
    totalSpent: {
      type: Number,
      default: 0
    },
    firstPurchase: {
      type: Date
    },
    lastPurchase: {
      type: Date
    }
  },
  preferences: {
    notifications: {
      type: Boolean,
      default: true
    },
    newsletter: {
      type: Boolean,
      default: false
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
userSchema.index({ walletAddress: 1 }, { unique: true });
userSchema.index({ 'stats.totalPurchases': -1 });
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', userSchema); 
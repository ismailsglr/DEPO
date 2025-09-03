const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    walletAddress: {
      type: String,
      required: true,
      trim: true
    },
    publicKey: {
      type: String,
      required: true,
      trim: true
    }
  },
  product: {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    emoji: {
      type: String,
      required: true
    }
  },
  transaction: {
    signature: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'failed'],
      default: 'pending'
    },
    blockTime: {
      type: Date
    }
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled', 'failed'],
    default: 'pending'
  },
  metadata: {
    solanaNetwork: {
      type: String,
      enum: ['devnet', 'testnet', 'mainnet-beta'],
      default: 'devnet'
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
orderSchema.index({ 'user.walletAddress': 1 });
orderSchema.index({ 'transaction.signature': 1 }, { unique: true });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ 'transaction.status': 1 });

module.exports = mongoose.model('Order', orderSchema); 
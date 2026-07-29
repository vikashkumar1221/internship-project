const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MarketplaceItem',
      required: true
    },
    licenseType: {
      type: String,
      enum: ['Lease', 'Premium', 'Exclusive'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    stripePaymentIntentId: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
      default: 'Completed'
    },
    downloadUrl: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);

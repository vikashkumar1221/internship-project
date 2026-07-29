const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'usd'
    },
    type: {
      type: String,
      enum: ['Subscription', 'Marketplace', 'RoyaltyPayout'],
      required: true
    },
    stripeId: {
      type: String,
      required: true
    },
    status: {
      type: String,
      default: 'succeeded'
    },
    description: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', PaymentSchema);

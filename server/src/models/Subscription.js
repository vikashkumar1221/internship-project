const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    stripeSubscriptionId: {
      type: String,
      required: true
    },
    plan: {
      type: String,
      enum: ['Free', 'Pro', 'Studio', 'Enterprise'],
      default: 'Free'
    },
    interval: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'monthly'
    },
    status: {
      type: String,
      enum: ['active', 'canceled', 'past_due'],
      default: 'active'
    },
    currentPeriodEnd: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subscription', SubscriptionSchema);

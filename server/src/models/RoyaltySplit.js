const mongoose = require('mongoose');

const RoyaltySplitSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    contributors: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: { type: String, required: true },
        role: { type: String, default: 'Producer' },
        percentage: { type: Number, required: true, min: 0, max: 100 },
        stripeConnectAccountId: { type: String, default: null }
      }
    ],
    totalPercentage: {
      type: Number,
      required: true,
      default: 100
    },
    isLocked: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('RoyaltySplit', RoyaltySplitSchema);

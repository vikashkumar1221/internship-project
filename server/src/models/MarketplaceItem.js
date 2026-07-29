const mongoose = require('mongoose');

const MarketplaceItemSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80'
    },
    previewAudioUrl: {
      type: String,
      required: true
    },
    stemsZipUrl: {
      type: String,
      default: ''
    },
    genre: {
      type: String,
      default: 'Hip Hop'
    },
    bpm: {
      type: Number,
      default: 140
    },
    keySignature: {
      type: String,
      default: 'F Minor'
    },
    tags: [{ type: String }],
    leasePrice: {
      type: Number,
      default: 29.99
    },
    premiumPrice: {
      type: Number,
      default: 79.99
    },
    exclusivePrice: {
      type: Number,
      default: 299.99
    },
    salesCount: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 5.0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('MarketplaceItem', MarketplaceItemSchema);

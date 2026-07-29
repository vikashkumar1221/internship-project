const mongoose = require('mongoose');

const TrackSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    color: {
      type: String,
      default: '#6366f1' // Hex color for DAW track strip
    },
    volume: {
      type: Number,
      default: 0, // dB (-60 to +6)
      min: -60,
      max: 12
    },
    pan: {
      type: Number,
      default: 0, // -1 (Left) to +1 (Right)
      min: -1,
      max: 1
    },
    isMuted: {
      type: Boolean,
      default: false
    },
    isSoloed: {
      type: Boolean,
      default: false
    },
    eqSettings: {
      low: { type: Number, default: 0 },
      mid: { type: Number, default: 0 },
      high: { type: Number, default: 0 }
    },
    reverbSend: { type: Number, default: 0 },
    delaySend: { type: Number, default: 0 },
    compressorSettings: {
      threshold: { type: Number, default: -24 },
      ratio: { type: Number, default: 4 }
    },
    lockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    order: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Track', TrackSchema);

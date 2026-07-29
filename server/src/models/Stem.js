const mongoose = require('mongoose');

const StemSchema = new mongoose.Schema(
  {
    track: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Track',
      required: true
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    s3Key: {
      type: String,
      default: ''
    },
    fileType: {
      type: String,
      enum: ['wav', 'mp3', 'aiff', 'flac'],
      default: 'mp3'
    },
    duration: {
      type: Number,
      default: 0
    },
    startTime: {
      type: Number,
      default: 0
    },
    peaks: [{ type: Number }], // Waveform peak array
    stemCategory: {
      type: String,
      enum: ['Vocals', 'Drums', 'Bass', 'Piano', 'Guitar', 'Other', 'Custom'],
      default: 'Custom'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Stem', StemSchema);

const mongoose = require('mongoose');

const VersionSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    versionNumber: {
      type: String,
      required: true // e.g. "v1.2.0"
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    snapshotData: {
      type: mongoose.Schema.Types.Mixed, // Serialized DAW state (tracks, volumes, FX, stems)
      required: true
    },
    audioRenderUrl: {
      type: String,
      default: ''
    },
    createdByUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    branchName: {
      type: String,
      default: 'main'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Version', VersionSchema);

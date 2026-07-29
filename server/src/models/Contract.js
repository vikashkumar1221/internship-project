const mongoose = require('mongoose');

const ContractSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    title: {
      type: String,
      required: true,
      default: 'Music Producer & Contributor Agreement'
    },
    terms: {
      type: String,
      required: true
    },
    versionNumber: {
      type: Number,
      default: 1
    },
    splitBreakdown: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: String,
        email: String,
        role: String,
        percentage: Number
      }
    ],
    status: {
      type: String,
      enum: ['Draft', 'Pending Signatures', 'Fully Signed', 'Rejected'],
      default: 'Draft'
    },
    docusignEnvelopeId: {
      type: String,
      default: null
    },
    signatures: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        signedAt: Date,
        signatureDataUrl: String,
        ipAddress: String
      }
    ],
    pdfFileUrl: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contract', ContractSchema);

const mongoose = require('mongoose');

const CollaboratorSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['Owner', 'Admin', 'Editor', 'Viewer'],
      default: 'Editor'
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Declined'],
      default: 'Accepted'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Collaborator', CollaboratorSchema);

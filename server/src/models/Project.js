const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80'
    },
    genre: {
      type: String,
      default: 'Electronic'
    },
    tempo: {
      type: Number,
      default: 120
    },
    keySignature: {
      type: String,
      default: 'C Major'
    },
    timeSignature: {
      type: String,
      default: '4/4'
    },
    tags: [{ type: String }],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isPublic: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['In Progress', 'Completed', 'Archived'],
      default: 'In Progress'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', ProjectSchema);

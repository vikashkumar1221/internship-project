const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Project = require('../models/Project');
const Track = require('../models/Track');
const MarketplaceItem = require('../models/MarketplaceItem');

const seedDatabase = async (standalone = false) => {
  try {
    if (standalone) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/music_collab_studio');
      console.log('[Seed] Connected to MongoDB...');
    }

    // Check if data already exists
    const userCount = await User.countDocuments();
    if (userCount > 0 && !standalone) {
      console.log(`[Seed] Database already contains ${userCount} users. Skipping auto-seed.`);
      return;
    }

    // Clear existing if standalone
    if (standalone) {
      await User.deleteMany();
      await Project.deleteMany();
      await Track.deleteMany();
      await MarketplaceItem.deleteMany();
    }

    // Create Admin & Demo Users
    const adminUser = await User.create({
      name: 'Alex Rivera (Mastering Eng)',
      email: 'alex@studio.com',
      password: 'password123',
      role: 'admin',
      subscriptionTier: 'Enterprise',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: 'Grammy Nominated Producer & Audio Engineer'
    });

    const user2 = await User.create({
      name: 'Sarah Chen (Vocalist)',
      email: 'sarah@studio.com',
      password: 'password123',
      role: 'user',
      subscriptionTier: 'Pro',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'
    });

    console.log('[Seed] Created demo users...');

    // Create Sample Project
    const project = await Project.create({
      title: 'Midnight Synthwave Anthem',
      description: '80s inspired retro synthwave collaboration project with lush vocal hooks.',
      genre: 'Synthwave',
      tempo: 124,
      keySignature: 'F Minor',
      timeSignature: '4/4',
      tags: ['80s', 'Retrowave', 'Vocals', 'Analog Synth'],
      owner: adminUser._id
    });

    // Create Sample Tracks
    await Track.insertMany([
      { project: project._id, name: 'Lead Vocals (Sarah)', color: '#ec4899', volume: -2, pan: 0, order: 0 },
      { project: project._id, name: 'Analog Jupiter Synth', color: '#6366f1', volume: -4, pan: -0.2, order: 1 },
      { project: project._id, name: 'Phat Bassline', color: '#10b981', volume: -1, pan: 0, order: 2 },
      { project: project._id, name: '707 Drum Machine', color: '#f59e0b', volume: 0, pan: 0, order: 3 }
    ]);

    // Create Sample Marketplace Beat
    await MarketplaceItem.create({
      seller: adminUser._id,
      title: 'Cyberpunk Neon Nights Stem Pack',
      description: 'Heavy industrial dark synthwave beat with 12 separated 24-bit WAV stems.',
      previewAudioUrl: 'https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg',
      genre: 'Cyberpunk',
      bpm: 128,
      keySignature: 'A Minor',
      tags: ['Cyberpunk', 'Heavy', 'Stems'],
      leasePrice: 29.99,
      premiumPrice: 79.99,
      exclusivePrice: 299.99
    });

    console.log('[Seed] Database successfully seeded!');
    if (standalone) process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    if (standalone) process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase(true);
}

module.exports = seedDatabase;


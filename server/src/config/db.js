const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const seedDatabase = require('../seed/seedData');

let mongodInstance = null;

const connectDB = async () => {
  const targetUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/music_collab_studio';

  try {
    // Attempt connecting to the configured MongoDB with a short timeout
    const conn = await mongoose.connect(targetUri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`[MongoDB] Connected to database: ${conn.connection.host}`);
    await seedDatabase(false);
  } catch (error) {
    console.warn(`[MongoDB Warning] Local MongoDB instance not reachable (${error.message}). Launching embedded MongoDB engine...`);
    try {
      mongodInstance = await MongoMemoryServer.create();
      const inMemoryUri = mongodInstance.getUri();
      const conn = await mongoose.connect(inMemoryUri);
      console.log(`[MongoDB] Connected to high-performance embedded MongoDB engine at: ${inMemoryUri}`);
      await seedDatabase(false);
    } catch (innerErr) {
      console.error(`[MongoDB Fatal] Could not initialize in-memory database: ${innerErr.message}`);
    }
  }
};

module.exports = connectDB;

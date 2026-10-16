const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
const setupSocketHandler = require('./sockets/collabHandler');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const stemRoutes = require('./routes/stemRoutes');
const versionRoutes = require('./routes/versionRoutes');
const chatRoutes = require('./routes/chatRoutes');
const royaltyRoutes = require('./routes/royaltyRoutes');
const contractRoutes = require('./routes/contractRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const stripeRoutes = require('./routes/stripeRoutes');
const distributionRoutes = require('./routes/distributionRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Initialize App & Server
const app = express();
const server = http.createServer(app);

// Socket.io Real-Time Collaboration Setup
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});
setupSocketHandler(io);

// Connect Database
connectDB();

// Security & Parsing Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 300, // Limit each IP
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Serve Uploaded Files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/stems', stemRoutes);
app.use('/api/versions', versionRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/royalty', royaltyRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/distribution', distributionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Music Collaboration Studio API Server Running' });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start HTTP & Socket Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  // console.log(`=======================================================`);
  console.log(`🚀 Music Collaboration Studio API Server running on port ${PORT}`);
  // console.log(`=======================================================`);
});

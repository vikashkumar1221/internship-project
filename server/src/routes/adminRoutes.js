const express = require('express');
const { getAdminAnalytics } = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.get('/analytics', protect, authorize('admin'), getAdminAnalytics);

module.exports = router;

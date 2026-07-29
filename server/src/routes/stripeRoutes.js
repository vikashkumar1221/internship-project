const express = require('express');
const { createSubscriptionSession, onboardStripeConnect } = require('../controllers/stripeController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/checkout-session', protect, createSubscriptionSession);
router.post('/connect-onboard', protect, onboardStripeConnect);

module.exports = router;

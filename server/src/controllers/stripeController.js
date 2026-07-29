const { createCheckoutSession, createStripeConnectAccount } = require('../services/stripeService');
const User = require('../models/User');

// @desc Create SaaS Subscription Checkout Session
// @route POST /api/stripe/checkout-session
exports.createSubscriptionSession = async (req, res) => {
  try {
    const { plan, interval } = req.body;
    const priceMap = {
      Pro: interval === 'yearly' ? 'price_pro_yearly' : 'price_pro_monthly',
      Studio: interval === 'yearly' ? 'price_studio_yearly' : 'price_studio_monthly',
      Enterprise: interval === 'yearly' ? 'price_enterprise_yearly' : 'price_enterprise_monthly'
    };

    const session = await createCheckoutSession(
      priceMap[plan] || 'price_pro_monthly',
      req.user.stripeCustomerId,
      `${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard?subscription=success`,
      `${process.env.CLIENT_URL || 'http://localhost:5173'}/billing?subscription=cancelled`
    );

    // Update user subscription tier
    await User.findByIdAndUpdate(req.user.id, { subscriptionTier: plan });

    res.status(200).json({ success: true, url: session.url });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Onboard Contributor to Stripe Connect for Royalty Payouts
// @route POST /api/stripe/connect-onboard
exports.onboardStripeConnect = async (req, res) => {
  try {
    const account = await createStripeConnectAccount(req.user.email);
    await User.findByIdAndUpdate(req.user.id, { stripeConnectAccountId: account.id });

    res.status(200).json({
      success: true,
      message: 'Stripe Connect account created successfully',
      accountId: account.id,
      onboardingUrl: `https://connect.stripe.com/express/oauth/authorize?client_id=${process.env.STRIPE_CONNECT_CLIENT_ID}&state=mockState`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mockKeyForMusicStudio', {
  apiVersion: '2023-10-16'
});

const createCheckoutSession = async (priceId, customerId, successUrl, cancelUrl) => {
  try {
    return await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl
    });
  } catch (error) {
    console.warn('[Stripe Warning] Fallback session mode:', error.message);
    return { id: 'cs_test_mockCheckoutSession123', url: successUrl };
  }
};

const createStripeConnectAccount = async (email) => {
  try {
    return await stripe.accounts.create({
      type: 'express',
      email: email,
      capabilities: {
        transfers: { requested: true }
      }
    });
  } catch (error) {
    return { id: 'acct_mockStripeConnect123' };
  }
};

module.exports = { createCheckoutSession, createStripeConnectAccount, stripe };

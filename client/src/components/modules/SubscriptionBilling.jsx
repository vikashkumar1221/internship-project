import React, { useState } from 'react';
import { CreditCard, Check, Sparkles, Zap, Shield } from 'lucide-react';
import api from '../../services/api';

export default function SubscriptionBilling() {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [activePlan, setActivePlan] = useState('Pro');

  const plans = [
    {
      name: 'Free',
      priceMonthly: 0,
      priceYearly: 0,
      storage: '2 GB',
      features: ['Up to 3 Projects', 'Standard Audio Uploads', 'Basic Waveform Editor']
    },
    {
      name: 'Pro',
      priceMonthly: 19,
      priceYearly: 190,
      storage: '50 GB',
      features: ['Unlimited Projects', 'Demucs AI Stem Separator (50 hrs/mo)', 'Real-Time Socket.io Collaboration', 'PDF Contract Generator']
    },
    {
      name: 'Studio',
      priceMonthly: 49,
      priceYearly: 490,
      storage: '500 GB',
      features: ['Everything in Pro', 'Unlimited AI Stem Separations', 'Stripe Connect Royalty Payouts', 'DSP Multi-Track Mixing Console', 'Priority Support']
    },
    {
      name: 'Enterprise',
      priceMonthly: 149,
      priceYearly: 1490,
      storage: '2 TB',
      features: ['Dedicated S3 Bucket', 'Custom API Access', 'DistroKid Bulk Release API', 'Admin Analytics Panel', '24/7 Dedicated Account Manager']
    }
  ];

  const handleUpgrade = async (planName) => {
    setActivePlan(planName);
    try {
      await api.post('/stripe/checkout-session', { plan: planName, interval: billingCycle });
    } catch (err) {
      // Local fallback
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-white">Subscription & Billing Plans</h1>
        <p className="text-xs text-gray-400">Unlock high-speed AI stem separation, unlimited S3 cloud storage, and real-time studio collaboration.</p>

        {/* Monthly / Yearly Toggle */}
        <div className="flex items-center justify-center gap-3 pt-4">
          <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-indigo-400' : 'text-gray-400'}`}>Monthly</span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="w-12 h-6 rounded-full bg-studio-panel border border-studio-border p-1 flex items-center transition"
          >
            <div className={`w-4 h-4 rounded-full bg-indigo-500 transition transform ${billingCycle === 'yearly' ? 'translate-x-6' : ''}`} />
          </button>
          <span className={`text-xs font-semibold ${billingCycle === 'yearly' ? 'text-indigo-400' : 'text-gray-400'}`}>
            Yearly <span className="text-[10px] text-pink-400 font-bold bg-pink-500/20 px-1.5 py-0.5 rounded">Save 20%</span>
          </span>
        </div>
      </div>

      {/* Plans Tier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
        {plans.map((plan) => {
          const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly;
          const isCurrent = activePlan === plan.name;

          return (
            <div
              key={plan.name}
              className={`bg-studio-card border rounded-2xl p-5 flex flex-col justify-between transition-all ${
                isCurrent ? 'border-indigo-500 shadow-xl shadow-indigo-500/20 ring-1 ring-indigo-500' : 'border-studio-border hover:border-gray-600'
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-extrabold text-base text-gray-100">{plan.name}</h3>
                  {isCurrent && <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">Active</span>}
                </div>

                <div className="my-4">
                  <span className="text-3xl font-extrabold font-mono text-white">${price}</span>
                  <span className="text-xs text-gray-500">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                </div>

                <p className="text-xs font-semibold text-indigo-400 mb-3">Storage: {plan.storage}</p>

                <ul className="space-y-2 border-t border-studio-border/60 pt-3 text-xs text-gray-300">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleUpgrade(plan.name)}
                className={`w-full py-2.5 rounded-xl font-bold text-xs mt-6 transition ${
                  isCurrent
                    ? 'bg-studio-panel border border-studio-border text-gray-300 cursor-default'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/30'
                }`}
              >
                {isCurrent ? 'Current Tier' : `Upgrade to ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

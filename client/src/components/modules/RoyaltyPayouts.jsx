import React, { useState } from 'react';
import { Wallet, ArrowUpRight, DollarSign, CheckCircle2, CreditCard, ShieldCheck } from 'lucide-react';
import api from '../../services/api';

export default function RoyaltyPayouts() {
  const [balance, setBalance] = useState(1485.50);
  const [isConnected, setIsConnected] = useState(true);
  const [history] = useState([
    { id: 'tx_1', date: '2026-07-25', source: 'Spotify Royalties (Midnight Anthem)', amount: 450.00, status: 'Completed' },
    { id: 'tx_2', date: '2026-07-20', source: 'Marketplace Beat Sale (Cyberpunk)', amount: 299.99, status: 'Completed' },
    { id: 'tx_3', date: '2026-07-12', source: 'Apple Music Split (Synthwave)', amount: 735.51, status: 'Completed' }
  ]);

  const handleWithdraw = () => {
    alert('Withdrawal request of $' + balance + ' submitted via Stripe Connect Direct Deposit!');
    setBalance(0);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-studio-border">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Wallet className="w-6 h-6 text-emerald-400" /> Royalty Wallet & Stripe Connect Payouts
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Automated royalty payouts and direct deposit balance management for all track contributors.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wallet Balance Card */}
        <div className="bg-gradient-to-tr from-emerald-950/60 via-studio-card to-indigo-950/40 border border-emerald-500/40 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
          <div>
            <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block mb-1">
              Available Earnings Balance
            </span>
            <div className="text-4xl font-extrabold font-mono text-white my-2">
              ${balance.toFixed(2)}
            </div>
            <p className="text-[11px] text-gray-400">Ready for instant withdrawal via Stripe Connect</p>
          </div>

          <button
            onClick={handleWithdraw}
            disabled={balance === 0}
            className="w-full mt-6 py-3 rounded-xl bg-emerald-600 font-bold text-xs text-white hover:bg-emerald-500 transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <ArrowUpRight className="w-4 h-4" /> Withdraw Balance to Bank
          </button>
        </div>

        {/* Transaction History Table */}
        <div className="lg:col-span-2 bg-studio-card border border-studio-border rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-sm text-gray-200">Payout Ledger History</h3>

          <div className="space-y-2.5">
            {history.map((tx) => (
              <div key={tx.id} className="p-3 rounded-xl bg-studio-panel border border-studio-border flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-gray-200">{tx.source}</p>
                  <span className="text-[10px] text-gray-500">{tx.date} • {tx.id}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-emerald-400 text-sm">+${tx.amount.toFixed(2)}</span>
                  <span className="block text-[10px] text-emerald-300 font-semibold">{tx.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

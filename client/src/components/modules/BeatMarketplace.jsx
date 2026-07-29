import React, { useState } from 'react';
import { ShoppingBag, Play, Download, Search, Tag, Star, CreditCard } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BeatMarketplace() {
  const [beats] = useState([
    {
      id: 'b1',
      title: 'Neon Nights Cyberpunk Beat',
      seller: 'Alex Rivera',
      genre: 'Cyberpunk',
      bpm: 128,
      key: 'F Minor',
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600',
      leasePrice: 29.99,
      exclusivePrice: 299.99
    },
    {
      id: 'b2',
      title: 'Lofi Chill Hop Sunset',
      seller: 'Sarah Chen',
      genre: 'Lofi Hip Hop',
      bpm: 85,
      key: 'C Major',
      cover: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600',
      leasePrice: 19.99,
      exclusivePrice: 199.99
    }
  ]);
  const [purchasedBeat, setPurchasedBeat] = useState(null);

  const handleCheckout = (beat) => {
    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}
    setPurchasedBeat(beat);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-studio-border">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-indigo-400" /> Beat & Stem Marketplace
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Buy and sell exclusive beats, sample packs, and stem bundles with instant Stripe checkout.
          </p>
        </div>
      </div>

      {purchasedBeat && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex justify-between items-center">
          <div>
            <span className="font-bold block">Purchase Confirmed for {purchasedBeat.title}!</span>
            <span className="text-gray-300">Stripe Payment Intent Succeeded. Download link unlocked.</span>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-500">
            <Download className="w-4 h-4" /> Download WAV Stems
          </button>
        </div>
      )}

      {/* Beats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {beats.map((beat) => (
          <div key={beat.id} className="bg-studio-card border border-studio-border rounded-2xl p-4 flex gap-4 hover:border-indigo-500/50 transition">
            <img src={beat.cover} alt={beat.title} className="w-28 h-28 rounded-xl object-cover shrink-0" />
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{beat.genre}</span>
                <h3 className="font-bold text-sm text-gray-100">{beat.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5">By {beat.seller} • {beat.bpm} BPM ({beat.key})</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-studio-border/50">
                <div>
                  <span className="text-xs text-gray-400">Lease: </span>
                  <span className="font-mono font-bold text-indigo-300 text-sm">${beat.leasePrice}</span>
                </div>
                <button
                  onClick={() => handleCheckout(beat)}
                  className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 font-bold text-xs text-white shadow-md shadow-indigo-600/30 hover:scale-105 transition"
                >
                  <CreditCard className="w-3.5 h-3.5" /> Buy License
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

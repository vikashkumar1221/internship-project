import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Sliders, Cpu, Zap, ArrowRight, ShieldCheck, PieChart, FileSignature } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-studio-darker text-white flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Hero Navigation */}
      <header className="h-20 px-8 flex justify-between items-center border-b border-studio-border/50 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Music className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-400">
            Music Collaboration Studio
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login" className="text-xs font-semibold text-gray-300 hover:text-white transition">
            Log In
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 font-bold text-xs text-white shadow-lg shadow-indigo-600/30 hover:scale-105 transition"
          >
            Start Free Studio Trial
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-20 text-center space-y-8 flex-1 flex flex-col justify-center items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/20 to-pink-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <Zap className="w-4 h-4 text-pink-400 animate-pulse" />
          <span>Next-Generation Real-Time Figma + DAW Audio Workstation</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl">
          Collaborate on Music Projects in <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-pink-400 to-purple-400">Real Time</span>
        </h1>

        <p className="text-base text-gray-400 max-w-2xl leading-relaxed">
          Produce, edit stem waveforms, isolate audio with Demucs AI, mix with Web Audio DSP, generate legal royalty contracts, and sell beat stem packs in a single production suite.
        </p>

        <div className="flex items-center gap-4 pt-4">
          <Link
            to="/studio"
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 font-extrabold text-sm text-white shadow-2xl shadow-indigo-600/40 hover:scale-105 transition"
          >
            Launch Interactive DAW Studio <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/dashboard"
            className="px-6 py-3.5 rounded-xl bg-studio-card border border-studio-border font-bold text-sm text-gray-200 hover:border-gray-500 transition"
          >
            Explore Producer Dashboard
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 text-left w-full">
          <div className="p-6 rounded-2xl bg-studio-card border border-studio-border space-y-3">
            <Sliders className="w-8 h-8 text-indigo-400" />
            <h3 className="font-bold text-base text-gray-100">Web Audio DSP Console</h3>
            <p className="text-xs text-gray-400">Interactive 3-Band Parametric EQ, stereo panners, compression, and master output limiter.</p>
          </div>

          <div className="p-6 rounded-2xl bg-studio-card border border-studio-border space-y-3">
            <Cpu className="w-8 h-8 text-pink-400" />
            <h3 className="font-bold text-base text-gray-100">Demucs AI Stem Separation</h3>
            <p className="text-xs text-gray-400">Separate mixed audio files into isolated Lead Vocals, Bass, Drums, and Guitar tracks instantly.</p>
          </div>

          <div className="p-6 rounded-2xl bg-studio-card border border-studio-border space-y-3">
            <PieChart className="w-8 h-8 text-emerald-400" />
            <h3 className="font-bold text-base text-gray-100">Royalty & PDF Contracts</h3>
            <p className="text-xs text-gray-400">Calculate percentage splits, generate legal PDF agreements, and collect payouts via Stripe Connect.</p>
          </div>
        </div>
      </main>

      <footer className="h-16 border-t border-studio-border/40 text-center text-xs text-gray-500 flex items-center justify-center">
        © 2026 Music Collaboration Studio SaaS. Built with React, Vite, Web Audio API & Node.js.
      </footer>
    </div>
  );
}

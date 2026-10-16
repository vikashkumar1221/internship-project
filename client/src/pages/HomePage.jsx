import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Music, Sliders, Users, FileText, ArrowRight, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/common/AuthModal';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  const handleAction = (mode = 'login') => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      setAuthMode(mode);
      setAuthModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#231f1d] flex flex-col justify-between selection:bg-[#dcc5b2] selection:text-[#2c2420]">
      {/* Top Header - Always shows Sign In & Sign Up */}
      <header className="h-16 bg-[#2c2420] px-6 sm:px-10 flex items-center justify-between sticky top-0 z-40 shadow-sm text-white">
        <div onClick={() => handleAction('login')} className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-8 h-8 rounded-xl bg-[#dcc5b2] flex items-center justify-center text-[#2c2420] shadow-sm">
            <Music className="w-4 h-4 fill-current" />
          </div>
          <span className="font-bold text-base tracking-tight text-white">
            StudioCollab
          </span>
        </div>

        {/* Top Header Auth Buttons: Sign In & Sign Up */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleAction('login')}
            className="text-xs sm:text-sm font-medium text-[#e6ded5] hover:text-white transition px-2 py-1"
          >
            Sign In
          </button>
          <button
            onClick={() => handleAction('register')}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-[#2c2420] bg-[#dcc5b2] hover:bg-[#cfb59f] rounded-xl shadow-sm transition"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Full-Width Atmospheric Hero Banner */}
        <section className="relative w-full min-h-[460px] md:min-h-[520px] bg-[#1e1715] flex items-center overflow-hidden">
          {/* Background Studio Photography */}
          <img
            src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1600&auto=format&fit=crop&q=85"
            alt="Warm music studio setup with monitors, laptop, and guitar"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-85"
          />

          {/* Left Dark Gradient Overlay for typography contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#181311]/95 via-[#221b18]/80 sm:via-[#221b18]/65 to-transparent" />

          {/* Hero Content Container */}
          <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10 py-16 w-full">
            <div className="max-w-xl space-y-6">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.08]">
                Make music<br />together.
              </h1>

              <p className="text-base sm:text-lg text-[#ded8d2] leading-relaxed max-w-lg">
                A simple studio to record, edit and collaborate with your team — right in your browser.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  onClick={() => handleAction('register')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#dcc5b2] hover:bg-[#cfb59f] font-bold text-sm text-[#2c2420] shadow-md transition transform hover:scale-[1.02]"
                >
                  <span>Open Studio</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>

                <button
                  onClick={() => handleAction('login')}
                  className="px-6 py-3 rounded-xl bg-black/30 hover:bg-black/50 border border-white/30 backdrop-blur-xs font-semibold text-sm text-white shadow-sm transition"
                >
                  Explore Projects
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards Section (Rounded Boxes with smooth corners) */}
        <section className="bg-white py-14 px-6 sm:px-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Box 1: Work on tracks */}
            <div
              onClick={() => handleAction('register')}
              className="bg-[#faf8f5] border border-[#e6ded5] rounded-3xl p-7 sm:p-8 flex flex-col justify-between space-y-5 shadow-subtle hover:shadow-card hover:border-[#cfb59f] transition cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#e6ded5] flex items-center justify-center text-[#2c2420] shadow-xs group-hover:scale-105 transition-transform">
                <Sliders className="w-5 h-5 stroke-[2.2]" />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-[#231f1d]">
                    Work on tracks
                  </h3>
                  <Lock className="w-3.5 h-3.5 text-[#a89f97] opacity-60" />
                </div>
                <p className="text-xs sm:text-sm text-[#736a64] leading-relaxed">
                  Record, edit and mix multiple tracks right in your browser.
                </p>
              </div>
            </div>

            {/* Box 2: Real-time collaboration */}
            <div
              onClick={() => handleAction('register')}
              className="bg-[#faf8f5] border border-[#e6ded5] rounded-3xl p-7 sm:p-8 flex flex-col justify-between space-y-5 shadow-subtle hover:shadow-card hover:border-[#cfb59f] transition cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#e6ded5] flex items-center justify-center text-[#2c2420] shadow-xs group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5 stroke-[2.2]" />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-[#231f1d]">
                    Real-time collaboration
                  </h3>
                  <Lock className="w-3.5 h-3.5 text-[#a89f97] opacity-60" />
                </div>
                <p className="text-xs sm:text-sm text-[#736a64] leading-relaxed">
                  Invite collaborators, leave feedback and create together.
                </p>
              </div>
            </div>

            {/* Box 3: Keep your work safe */}
            <div
              onClick={() => handleAction('register')}
              className="bg-[#faf8f5] border border-[#e6ded5] rounded-3xl p-7 sm:p-8 flex flex-col justify-between space-y-5 shadow-subtle hover:shadow-card hover:border-[#cfb59f] transition cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#e6ded5] flex items-center justify-center text-[#2c2420] shadow-xs group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5 stroke-[2.2]" />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-[#231f1d]">
                    Keep your work safe
                  </h3>
                  <Lock className="w-3.5 h-3.5 text-[#a89f97] opacity-60" />
                </div>
                <p className="text-xs sm:text-sm text-[#736a64] leading-relaxed">
                  Track versions, save snapshots and give proper credit.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e6ded5] bg-[#faf8f5] py-6 px-6 text-xs text-[#736a64]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>© 2026 StudioCollab. Crafted for musicians & producers.</p>
          <div className="flex gap-4">
            <button onClick={() => handleAction('login')} className="hover:text-[#231f1d] transition">Sign In</button>
            <button onClick={() => handleAction('register')} className="hover:text-[#231f1d] transition">Sign Up</button>
          </div>
        </div>
      </footer>

      {/* Interactive Auth Modal for any click without login */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Music, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    setError('');
    if (!name.trim()) {
      setError('Please enter your full name.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address (e.g. name@example.com).');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const res = await register(name, email, password);
    setLoading(false);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Registration failed. Email may already be registered.');
    }
  };

  const handleQuickDemo = async () => {
    setLoading(true);
    await login('vikash@studio.com', 'studio1234');
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col justify-between selection:bg-[#dcc5b2] selection:text-[#2c2420]">
      {/* Top Header */}
      <header className="h-16 bg-[#2c2420] px-6 sm:px-10 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#dcc5b2] flex items-center justify-center text-[#2c2420] shadow-sm">
            <Music className="w-4 h-4 fill-current" />
          </div>
          <span className="font-bold text-base tracking-tight text-white">
            StudioCollab
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-xs sm:text-sm font-medium text-[#e6ded5] hover:text-white transition px-2 py-1"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-[#2c2420] bg-[#dcc5b2] hover:bg-[#cfb59f] rounded-xl shadow-sm transition"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Main Split Layout */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-4xl w-full bg-white border border-[#e6ded5] rounded-3xl shadow-card overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Left Atmospheric Photo Banner */}
          <div className="relative min-h-[300px] md:min-h-[520px] bg-[#2c2420] p-8 flex flex-col justify-end text-white overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80"
              alt="Keyboard and music production workspace"
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1f1917]/95 via-[#2c2420]/50 to-transparent" />
            <div className="relative z-10 space-y-2">
              <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
                Create an account
              </h2>
              <p className="text-sm text-[#e6ded5] leading-relaxed max-w-xs">
                Start making music with your team in a collaborative studio.
              </p>
            </div>
          </div>

          {/* Right Form Container */}
          <div className="p-8 sm:p-10 flex flex-col justify-center bg-white">
            <div className="mb-6">
              <h3 className="text-2xl font-extrabold text-[#231f1d]">Create account</h3>
              <p className="text-xs text-[#736a64] mt-1">Join the collaboration studio today</p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-700 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#231f1d] block mb-1">Full name</label>
                <input
                  type="text"
                  required
                  placeholder="Vikash"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#e6ded5] rounded-xl px-4 py-2.5 text-xs text-[#231f1d] placeholder-[#a89f97] focus:outline-none focus:bg-white focus:border-[#2c2420] transition shadow-2xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#231f1d] block mb-1">Email address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#e6ded5] rounded-xl px-4 py-2.5 text-xs text-[#231f1d] placeholder-[#a89f97] focus:outline-none focus:bg-white focus:border-[#2c2420] transition shadow-2xs"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-[#231f1d]">Password</label>
                  <span className="text-[10px] text-[#8c827a]">Min 6 chars</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#e6ded5] rounded-xl pl-4 pr-10 py-2.5 text-xs text-[#231f1d] placeholder-[#a89f97] focus:outline-none focus:bg-white focus:border-[#2c2420] transition shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-[#8c827a] hover:text-[#231f1d]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-[#2c2420] hover:bg-[#3d332e] font-semibold text-xs text-white shadow-sm transition flex items-center justify-center gap-1.5 mt-1"
              >
                <span>{loading ? 'Creating account...' : 'Create Account'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Quick Demo Option */}
            <div className="mt-4 pt-4 border-t border-[#e6ded5]">
              <button
                type="button"
                onClick={handleQuickDemo}
                className="w-full py-2 rounded-xl bg-[#f5f0ea] hover:bg-[#dcc5b2] text-[#2c2420] text-xs font-bold transition flex items-center justify-center gap-1.5 border border-[#e6ded5]"
              >
                <span>⚡ Instant 1-Click Demo Login</span>
              </button>
            </div>

            <p className="text-center text-xs text-[#736a64] mt-4">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#2c2420] hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e6ded5] bg-[#f5f0ea] py-4 px-6 text-xs text-[#736a64] text-center">
        © 2026 StudioCollab. All rights reserved.
      </footer>
    </div>
  );
}

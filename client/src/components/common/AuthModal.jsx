import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Music, X, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight, Shield } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    setError('');
    if (mode === 'register' && !name.trim()) {
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
    let res;
    if (mode === 'login') {
      res = await login(email, password);
    } else {
      res = await register(name, email, password);
    }
    setLoading(false);

    if (res.success) {
      onClose();
      navigate('/dashboard');
    } else {
      setError(res.error || 'Authentication failed. Please check your credentials.');
    }
  };

  const handleQuickDemo = async () => {
    setLoading(true);
    await login('vikash@studio.com', 'studio1234');
    setLoading(false);
    onClose();
    navigate('/dashboard');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-[#e6ded5] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-elevated relative animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-[#8c827a] hover:text-[#231f1d] hover:bg-[#faf8f5] transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Brand Header */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-xl bg-[#dcc5b2] flex items-center justify-center text-[#2c2420] shadow-xs">
            <Music className="w-4 h-4 fill-current" />
          </div>
          <span className="font-bold text-base tracking-tight text-[#231f1d]">
            StudioCollab
          </span>
        </div>

        {/* Mode Switch Tabs */}
        <div className="flex bg-[#faf8f5] p-1 rounded-2xl border border-[#e6ded5] mb-5">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
              mode === 'login'
                ? 'bg-white text-[#2c2420] shadow-xs'
                : 'text-[#736a64] hover:text-[#231f1d]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
              mode === 'register'
                ? 'bg-white text-[#2c2420] shadow-xs'
                : 'text-[#736a64] hover:text-[#231f1d]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert Banner */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-700 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <span className="leading-tight">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="text-xs font-semibold text-[#231f1d] block mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Vikash"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#faf8f5] border border-[#e6ded5] rounded-xl px-3.5 py-2.5 text-xs text-[#231f1d] placeholder-[#a89f97] focus:outline-none focus:bg-white focus:border-[#2c2420] transition"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-[#231f1d] block mb-1">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#faf8f5] border border-[#e6ded5] rounded-xl px-3.5 py-2.5 text-xs text-[#231f1d] placeholder-[#a89f97] focus:outline-none focus:bg-white focus:border-[#2c2420] transition"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-[#231f1d]">Password</label>
              <span className="text-[10px] text-[#8c827a]">Min 6 characters</span>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#faf8f5] border border-[#e6ded5] rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-[#231f1d] placeholder-[#a89f97] focus:outline-none focus:bg-white focus:border-[#2c2420] transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-[#8c827a] hover:text-[#231f1d]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'login' && (
            <div className="flex items-center justify-between text-xs text-[#736a64] pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={keepSignedIn}
                  onChange={(e) => setKeepSignedIn(e.target.checked)}
                  className="rounded-md border-[#e6ded5] text-[#2c2420] focus:ring-0"
                />
                <span>Remember me</span>
              </label>
              <span className="text-[#8c827a] hover:underline cursor-pointer">Forgot?</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-[#2c2420] hover:bg-[#3d332e] font-semibold text-xs text-white shadow-sm transition flex items-center justify-center gap-1.5 mt-2"
          >
            <span>{loading ? 'Authenticating...' : mode === 'login' ? 'Sign In to Studio' : 'Create Free Account'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Quick Demo Login Option */}
        <div className="mt-4 pt-4 border-t border-[#e6ded5]">
          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full py-2 rounded-xl bg-[#f5f0ea] hover:bg-[#dcc5b2] text-[#2c2420] text-xs font-bold transition flex items-center justify-center gap-1.5 border border-[#e6ded5]"
          >
            <span>⚡ Instant 1-Click Demo Login</span>
          </button>
        </div>

        {/* Security Note */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#8c827a] mt-3">
          <Shield className="w-3 h-3 text-emerald-600" />
          <span>Secure session authentication required for all audio projects</span>
        </div>
      </div>
    </div>
  );
}

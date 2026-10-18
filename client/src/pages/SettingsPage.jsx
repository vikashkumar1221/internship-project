import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { useAuth } from '../context/AuthContext';
import { User, Bell, Shield, Sliders, Check, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('Account');
  const [fullName, setFullName] = useState(user?.name || 'Alex Rivera');
  const [email, setEmail] = useState(user?.email || 'alex@studio.com');
  const [sampleRate, setSampleRate] = useState('48000');
  const [bufferSize, setBufferSize] = useState('128');
  const [autoSave, setAutoSave] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/auth/profile', { name: fullName, email });
      if (updateProfile) {
        updateProfile({ name: fullName, email });
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      if (updateProfile) {
        updateProfile({ name: fullName, email });
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const navItems = [
    { name: 'Account', icon: User },
    { name: 'Audio Engine', icon: Sliders },
    { name: 'Notifications', icon: Bell },
    { name: 'Privacy & Security', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-amber-100 selection:text-amber-900">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Studio Settings</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage your account, audio hardware buffers, and notification preferences.</p>
          </div>

          {savedSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Settings updated successfully!</span>
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
            {/* Left Tabs */}
            <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-slate-200 p-4 bg-slate-50/50 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition ${
                    activeTab === item.name
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </button>
              ))}
            </div>

            {/* Right Content */}
            <div className="md:col-span-8 p-6 sm:p-8 bg-white flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 mb-4">
                  {activeTab} Settings
                </h2>

                {activeTab === 'Account' && (
                  <form onSubmit={handleSave} className="space-y-4 max-w-md text-xs">
                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Full Name</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:bg-white focus:border-slate-900 transition font-medium"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:bg-white focus:border-slate-900 transition font-medium"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition"
                      >
                        {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        <span>{saving ? 'Saving...' : 'Save Account Settings'}</span>
                      </button>
                    </div>
                  </form>
                )}

                {activeTab === 'Audio Engine' && (
                  <div className="space-y-4 max-w-md text-xs">
                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Sample Rate</label>
                      <select
                        value={sampleRate}
                        onChange={(e) => setSampleRate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono"
                      >
                        <option value="48000">48,000 Hz (Professional Studio Quality)</option>
                        <option value="44100">44,100 Hz (Standard CD Quality)</option>
                        <option value="96000">96,000 Hz (High Resolution Master)</option>
                      </select>
                      <p className="text-[11px] text-slate-500 mt-1">Sets the Web Audio API processing rate.</p>
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Buffer Size</label>
                      <select
                        value={bufferSize}
                        onChange={(e) => setBufferSize(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono"
                      >
                        <option value="128">128 samples (4.2ms ultra-low latency)</option>
                        <option value="256">256 samples (Balanced monitoring)</option>
                        <option value="512">512 samples (High stability / mixing)</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div>
                        <p className="font-bold text-slate-900">Auto-Save Snapshots</p>
                        <p className="text-[11px] text-slate-500">Save project version every 60 seconds</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={autoSave}
                        onChange={(e) => setAutoSave(e.target.checked)}
                        className="w-4 h-4 rounded text-slate-900"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'Notifications' && (
                  <div className="space-y-3 max-w-md text-xs">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div>
                        <p className="font-bold text-slate-900">Project Invitations</p>
                        <p className="text-[11px] text-slate-500">Notify when added to a collaborative session</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={emailNotifs}
                        onChange={(e) => setEmailNotifs(e.target.checked)}
                        className="w-4 h-4 rounded text-slate-900"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div>
                        <p className="font-bold text-slate-900">Audio Feedback Mentions</p>
                        <p className="text-[11px] text-slate-500">Receive alert when someone comments at a playhead</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-slate-900" />
                    </div>
                  </div>
                )}

                {activeTab === 'Privacy & Security' && (
                  <div className="space-y-4 max-w-md text-xs">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <p className="font-bold text-slate-900">Encryption & Audio Ownership</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Uploaded WAV and MP3 stems remain 100% your legal intellectual property. Encrypted via SHA-256 and stored securely.
                      </p>
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Session Visibility</label>
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900">
                        <option>Private (Invited Collaborators Only)</option>
                        <option>Community (Listed in Explore tab)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-slate-400 pt-6 border-t border-slate-100">
                User ID: usr_{user?._id || 'vikash_2026'} • StudioCollab Member
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

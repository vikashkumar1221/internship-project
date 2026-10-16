import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { useAuth } from '../context/AuthContext';
import { User, Bell, Shield, Link2, Sliders, Check } from 'lucide-react';

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('Account');
  const [fullName, setFullName] = useState(user?.name || 'Session Producer');
  const [email, setEmail] = useState(user?.email || 'producer@studio.com');
  const [username, setUsername] = useState(user?.name ? user.name.toLowerCase().replace(/\s+/g, '_') : 'producer');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (updateProfile) {
      updateProfile({ name: fullName, email });
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const navItems = [
    { name: 'Account', icon: User },
    { name: 'Notifications', icon: Bell },
    { name: 'Privacy', icon: Shield },
    { name: 'Connected Accounts', icon: Link2 },
    { name: 'Preferences', icon: Sliders }
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col justify-between selection:bg-[#dcc5b2] selection:text-[#2c2420]">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-[#231f1d] tracking-tight">Settings</h1>
            <p className="text-xs text-[#736a64] mt-0.5">Manage your studio account preferences and profile.</p>
          </div>

        <div className="bg-white border border-[#e6ded5] rounded-2xl shadow-subtle overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
          {/* Left Sidebar Navigation */}
          <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-[#e6ded5] p-4 bg-[#faf8f5]/60 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-left transition ${
                  activeTab === item.name
                    ? 'bg-[#2c2420] text-white shadow-xs'
                    : 'text-[#736a64] hover:text-[#231f1d] hover:bg-[#f5f0ea]'
                }`}
              >
                <item.icon className="w-4 h-4 opacity-80" />
                <span>{item.name}</span>
              </button>
            ))}
          </div>

          {/* Right Content Form */}
          <div className="md:col-span-8 p-6 sm:p-8 bg-white flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-[#231f1d] pb-3 border-b border-[#e6ded5]">
                {activeTab} Settings
              </h2>

              {activeTab === 'Account' && (
                <form onSubmit={handleSave} className="space-y-4 pt-4 max-w-md">
                  <div>
                    <label className="text-xs font-semibold text-[#231f1d] block mb-1">Full name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full bg-[#faf8f5] border border-[#e6ded5] rounded-lg px-3 py-2 text-xs text-[#231f1d] focus:outline-none focus:bg-white focus:border-[#2c2420] transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#231f1d] block mb-1">Email address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-[#faf8f5] border border-[#e6ded5] rounded-lg px-3 py-2 text-xs text-[#231f1d] focus:outline-none focus:bg-white focus:border-[#2c2420] transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#231f1d] block mb-1">Username</label>
                    <div className="flex rounded-lg overflow-hidden border border-[#e6ded5] bg-[#faf8f5]">
                      <span className="px-3 py-2 text-xs text-[#8c827a] font-mono bg-[#f5f0ea] border-r border-[#e6ded5]">
                        @
                      </span>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="flex-1 px-3 py-2 text-xs text-[#231f1d] bg-transparent focus:outline-none focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#2c2420] hover:bg-[#3d332e] text-white text-xs font-semibold shadow-xs transition"
                    >
                      {savedSuccess ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Saved Successfully</span>
                        </>
                      ) : (
                        <span>Save Changes</span>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {activeTab !== 'Account' && (
                <div className="py-12 text-center text-xs text-[#8c827a]">
                  <p>{activeTab} preferences are synced and active with default studio settings.</p>
                </div>
              )}
            </div>

            <p className="text-[11px] text-[#a89f97] pt-6 border-t border-[#e6ded5]/60">
              User ID: usr_vikash_2026 • StudioCollab Member
            </p>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}

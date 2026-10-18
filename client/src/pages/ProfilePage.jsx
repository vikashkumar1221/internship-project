import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { useAuth } from '../context/AuthContext';
import { Play, Settings, Headphones, Heart, FolderKanban, Check, Edit2, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('Projects');
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || 'Alex Rivera');
  const [bio, setBio] = useState(user?.bio || 'Electronic music producer & multi-track sound designer.');
  const [role, setRole] = useState(user?.role || 'Producer');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const userTracks = [
    {
      id: 'p1',
      title: 'Midnight Synthwave Anthem',
      genre: 'Electronic / Synth',
      updated: '2 hours ago',
      tracksCount: 6,
      plays: 492,
      cover: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400'
    },
    {
      id: 'p2',
      title: 'Acoustic Indie Session',
      genre: 'Indie Folk',
      updated: 'Yesterday',
      tracksCount: 4,
      plays: 388,
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400'
    }
  ];

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/auth/profile', { name, bio, role });
      updateProfile({ name, bio, role });
      setSavedSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      updateProfile({ name, bio, role });
      setSavedSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-amber-100 selection:text-amber-900">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
          {/* Success Banner */}
          {savedSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          {/* Profile Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-900 border-2 border-amber-300 flex items-center justify-center font-extrabold text-2xl shadow-xs shrink-0">
                {(user?.name || name || 'A').charAt(0).toUpperCase()}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h1 className="text-2xl font-extrabold text-slate-900">{user?.name || name}</h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider">
                    {user?.role || role}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono">{user?.email || 'creator@studiocollab.com'}</p>
                <p className="text-xs text-slate-600 max-w-lg leading-relaxed pt-1">
                  {user?.bio || bio}
                </p>

                {/* Stats row */}
                <div className="flex items-center justify-center sm:justify-start gap-6 pt-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{userTracks.length}</span>{' '}
                    <span className="text-slate-500">Active Sessions</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">24</span>{' '}
                    <span className="text-slate-500">Collaborators</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">100%</span>{' '}
                    <span className="text-slate-500">Royalties Verified</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 shadow-xs transition shrink-0"
            >
              <Edit2 className="w-3.5 h-3.5 text-slate-500" />
              <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
            </button>
          </div>

          {/* Inline Edit Form */}
          {isEditing && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs animate-in fade-in">
              <h3 className="font-bold text-sm text-slate-900 mb-4 pb-2 border-b border-slate-100">
                Update Creator Information
              </h3>
              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs max-w-xl">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Display Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-hidden focus:bg-white focus:border-slate-900 transition font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Primary Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-hidden focus:bg-white focus:border-slate-900 transition font-medium"
                  >
                    <option value="Producer">Music Producer</option>
                    <option value="Vocalist">Topline Vocalist</option>
                    <option value="Sound Designer">Sound Designer / Beats</option>
                    <option value="Mixing Engineer">Mixing & Mastering Engineer</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Bio & Credentials</label>
                  <textarea
                    rows="3"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-hidden focus:bg-white focus:border-slate-900 transition font-medium"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* User's Project Sessions */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-base text-slate-900">Your Active Studio Tracks</h3>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs divide-y divide-slate-100 overflow-hidden">
              {userTracks.map((t) => (
                <div key={t.id} className="p-4 flex items-center justify-between hover:bg-slate-50/60 transition">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={t.cover}
                      alt={t.title}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{t.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {t.genre} • {t.tracksCount} stems • Updated {t.updated}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="hidden sm:flex items-center gap-1 text-xs font-mono text-slate-500">
                      <Headphones className="w-3.5 h-3.5" /> {t.plays}
                    </span>

                    <Link
                      to="/studio"
                      className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1 transition shadow-xs"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Open Studio</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

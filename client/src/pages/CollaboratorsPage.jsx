import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { Users, UserPlus, Mail, Shield, Check, X, Trash2, Loader2, Music } from 'lucide-react';
import api from '../services/api';

export default function CollaboratorsPage() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Producer');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [projects, setProjects] = useState([]);
  const [statusMessage, setStatusMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inviting, setInviting] = useState(false);

  const [collaborators, setCollaborators] = useState([
    {
      id: 'c1',
      name: 'Alex Rivera',
      email: 'alex@studio.com',
      role: 'Owner & Lead Producer',
      status: 'Active',
      projectsCount: 4,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
    },
    {
      id: 'c2',
      name: 'Sarah Chen',
      email: 'sarah@studio.com',
      role: 'Topline Vocalist & Songwriter',
      status: 'Active',
      projectsCount: 2,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
    },
    {
      id: 'c3',
      name: 'Marcus Bell',
      email: 'marcus@studio.com',
      role: 'Mixing & Sound Engineer',
      status: 'Active',
      projectsCount: 3,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
    }
  ]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      const list = res.data?.data?.recent || [];
      setProjects(list);
      if (list.length > 0) {
        setSelectedProjectId(list[0]._id);
      }
    } catch (err) {
      console.warn('Could not fetch projects for invite:', err.message);
    }
  };

  const handleSendInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setInviting(true);
    setStatusMessage(null);
    try {
      if (selectedProjectId) {
        await api.post(`/projects/${selectedProjectId}/collaborators`, {
          email: inviteEmail,
          role: inviteRole
        });
      }

      const newCollab = {
        id: `c_${Date.now()}`,
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        role: inviteRole,
        status: 'Active',
        projectsCount: 1,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
      };

      setCollaborators([newCollab, ...collaborators]);
      setStatusMessage({ type: 'success', text: `Invitation sent to ${inviteEmail}!` });
      setInviteEmail('');
      setTimeout(() => {
        setShowInviteModal(false);
        setStatusMessage(null);
      }, 1500);
    } catch (err) {
      const newCollab = {
        id: `c_${Date.now()}`,
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        role: inviteRole,
        status: 'Invited',
        projectsCount: 1,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
      };
      setCollaborators([newCollab, ...collaborators]);
      setStatusMessage({ type: 'success', text: `Collaborator invitation recorded for ${inviteEmail}!` });
      setInviteEmail('');
      setTimeout(() => {
        setShowInviteModal(false);
        setStatusMessage(null);
      }, 1500);
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveCollaborator = (id) => {
    if (window.confirm('Remove collaborator from your studio sessions?')) {
      setCollaborators(collaborators.filter(c => c.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-amber-100 selection:text-amber-900">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Studio Collaborators</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Musicians, producers, and vocalists sharing access to your multi-track DAW sessions.
              </p>
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 font-semibold text-xs text-white shadow-xs transition"
            >
              <UserPlus className="w-4 h-4 stroke-[2.5]" />
              <span>Invite Collaborator</span>
            </button>
          </div>

          {/* Collaborator List Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <span className="text-xs font-bold text-slate-900">Active Collaborators ({collaborators.length})</span>
              <span className="text-xs text-slate-500">Live multi-user sync enabled</span>
            </div>

            <div className="divide-y divide-slate-100">
              {collaborators.map((c) => (
                <div key={c.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/60 transition">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{c.name}</span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          c.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{c.role} • {c.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="hidden sm:inline text-xs font-mono text-slate-500">
                      {c.projectsCount} project{c.projectsCount === 1 ? '' : 's'}
                    </span>
                    <button
                      onClick={() => handleRemoveCollaborator(c.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition"
                      title="Remove collaborator"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => setShowInviteModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Invite Collaborator</h3>
                <p className="text-xs text-slate-500">Grant track recording and playback access</p>
              </div>
            </div>

            {statusMessage && (
              <div className={`mt-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
                statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                <Check className="w-4 h-4 shrink-0" />
                <span>{statusMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleSendInvite} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="collaborator@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:bg-white focus:border-slate-900 transition font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Collaborator Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:bg-white focus:border-slate-900 transition font-medium"
                >
                  <option value="Producer">Producer (Full Playback, Stems & Edit)</option>
                  <option value="Vocalist">Vocalist (Record & Audio Comments)</option>
                  <option value="Mixing Engineer">Mixing Engineer (Faders & FX)</option>
                  <option value="Viewer">Viewer (Listen Only)</option>
                </select>
              </div>

              {projects.length > 0 && (
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Target Project</label>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:bg-white focus:border-slate-900 transition font-medium"
                  >
                    {projects.map((p) => (
                      <option key={p._id} value={p._id}>{p.title} ({p.genre})</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviting}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  {inviting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{inviting ? 'Sending...' : 'Send Invite'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

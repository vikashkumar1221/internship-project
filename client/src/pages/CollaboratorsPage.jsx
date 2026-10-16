import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { Users, UserPlus, Mail, Shield, Check, X, Trash2, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function CollaboratorsPage() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Producer');
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
      role: 'Drum Programmer & Sound Designer',
      status: 'Active',
      projectsCount: 1,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
    }
  ]);

  const handleSendInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setInviting(true);
    setStatusMessage(null);
    try {
      const newCollab = {
        id: `c_${Date.now()}`,
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        role: inviteRole,
        status: 'Invited',
        projectsCount: 1,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
      };

      setCollaborators([...collaborators, newCollab]);
      setStatusMessage({ type: 'success', text: `Invitation sent to ${inviteEmail} as ${inviteRole}!` });
      setInviteEmail('');
      setTimeout(() => {
        setStatusMessage(null);
        setShowInviteModal(false);
      }, 1500);
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Could not send invitation.' });
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveCollaborator = (id) => {
    if (window.confirm('Remove this collaborator from all shared sessions?')) {
      setCollaborators(collaborators.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col justify-between selection:bg-[#dcc5b2] selection:text-[#2c2420]">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#e6ded5]">
            <div>
              <h1 className="text-2xl font-extrabold text-[#231f1d] tracking-tight">Studio Collaborators</h1>
              <p className="text-xs text-[#736a64] mt-0.5">
                Manage musicians, producers, and vocalists with access to your DAW sessions.
              </p>
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2c2420] hover:bg-[#3d332e] font-semibold text-xs text-white shadow-xs transition"
            >
              <UserPlus className="w-4 h-4 stroke-[2.5]" />
              <span>Invite Collaborator</span>
            </button>
          </div>

          {/* Collaborator List Table */}
          <div className="bg-white border border-[#e6ded5] rounded-2xl shadow-subtle overflow-hidden">
            <div className="p-4 border-b border-[#e6ded5] flex justify-between items-center bg-[#faf8f5]">
              <span className="text-xs font-bold text-[#231f1d]">Team Members ({collaborators.length})</span>
              <span className="text-xs text-[#736a64]">Live multi-user DAW enabled</span>
            </div>

            <div className="divide-y divide-[#e6ded5]">
              {collaborators.map((c) => (
                <div key={c.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-[#faf8f5] transition">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#e6ded5]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#231f1d]">{c.name}</span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          c.status === 'Active' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-[#faf8f5] text-[#8c827a] border border-[#e6ded5]'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#736a64] mt-0.5">{c.role} • {c.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="hidden sm:inline text-xs font-mono text-[#736a64]">
                      {c.projectsCount} project{c.projectsCount === 1 ? '' : 's'}
                    </span>
                    <button
                      onClick={() => handleRemoveCollaborator(c.id)}
                      className="p-1.5 text-[#8c827a] hover:text-red-600 rounded-lg hover:bg-[#faf8f5] transition"
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
        <div className="fixed inset-0 bg-[#2c2420]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e6ded5] rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => setShowInviteModal(false)}
              className="absolute top-4 right-4 text-[#8c827a] hover:text-[#231f1d] p-1 rounded-lg hover:bg-[#faf8f5]"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-extrabold text-base text-[#231f1d] mb-1">Invite Collaborator</h3>
            <p className="text-xs text-[#736a64] mb-4">
              Add a team member to collaborate on your multi-track DAW sessions.
            </p>

            {statusMessage && (
              <div className={`mb-3 p-3 rounded-xl text-xs flex items-center gap-2 ${
                statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {statusMessage.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <X className="w-4 h-4 shrink-0" />}
                <span>{statusMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleSendInvite} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#231f1d] block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8c827a] absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="artist@music.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#e6ded5] rounded-xl pl-9 pr-3 py-2 text-xs text-[#231f1d] placeholder-[#a89f97] focus:outline-none focus:border-[#2c2420]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#231f1d] block mb-1">Role & Permissions</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#e6ded5] rounded-xl px-3 py-2 text-xs text-[#231f1d] font-medium focus:outline-none focus:border-[#2c2420]"
                >
                  <option value="Producer">Producer (Full track mixer & arrangement editing)</option>
                  <option value="Vocalist">Vocalist (Upload vocal stems & pinned comments)</option>
                  <option value="Owner">Co-Owner (All permissions, versioning & contracts)</option>
                  <option value="Viewer">Viewer (Preview & comment access only)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#736a64] hover:bg-[#faf8f5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviting || !inviteEmail.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#2c2420] hover:bg-[#3d332e] text-xs font-bold text-white shadow-xs transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  {inviting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
                  <span>{inviting ? 'Sending...' : 'Send Invitation'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

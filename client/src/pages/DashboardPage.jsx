import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import ProjectCard from '../components/dashboard/ProjectCard';
import { Plus, FolderKanban, Search, X, Loader2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newGenre, setNewGenre] = useState('Electronic / Synth');
  const [newTempo, setNewTempo] = useState(124);
  const [newKey, setNewKey] = useState('F Minor');
  const [newDescription, setNewDescription] = useState('');

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get('/projects');
      const recents = res.data?.data?.recent || [];
      const shared = res.data?.data?.shared || [];

      // Combine owned and shared with category tag
      const mappedOwned = recents.map(p => ({ ...p, category: p.status === 'Archived' ? 'Archived' : 'Owned' }));
      const mappedShared = shared
        .filter(s => !recents.some(r => r._id === s._id))
        .map(s => ({ ...s, category: 'Collaborating' }));

      const all = [...mappedOwned, ...mappedShared];
      if (all.length > 0) {
        setProjects(all);
      } else {
        // Fallback default demo projects if empty database
        setProjects([
          {
            _id: 'proj_demo_1',
            title: 'Midnight Synthwave Anthem',
            genre: 'Synthwave',
            category: 'Owned',
            tempo: 124,
            keySignature: 'F Minor',
            description: 'Lush vocal hooks paired with analog Jupiter synth chords and a driving drum beat.',
            coverImage: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600'
          },
          {
            _id: 'proj_demo_2',
            title: 'Acoustic Indie Session',
            genre: 'Acoustic / Indie',
            category: 'Owned',
            tempo: 96,
            keySignature: 'G Major',
            description: 'Warm acoustic guitar tracks, recorded vocal harmonies, and shaker percussion.',
            coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600'
          }
        ]);
      }
    } catch (err) {
      console.warn('Failed to load projects from server, displaying local:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setCreating(true);
    try {
      const res = await api.post('/projects', {
        title: newTitle,
        genre: newGenre,
        tempo: Number(newTempo),
        keySignature: newKey,
        description: newDescription || 'Multi-track DAW collaboration session.',
        coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600'
      });

      if (res.data?.data) {
        const created = { ...res.data.data, category: 'Owned' };
        setProjects([created, ...projects]);
        setShowCreateModal(false);
        navigate(`/studio/${created._id}`);
      }
    } catch (err) {
      console.warn('Fallback creating project locally:', err.message);
      const created = {
        _id: `proj_${Date.now()}`,
        title: newTitle,
        genre: newGenre,
        category: 'Owned',
        tempo: Number(newTempo),
        keySignature: newKey,
        description: newDescription || 'Work in progress collaboration session.',
        coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600'
      };
      setProjects([created, ...projects]);
      setShowCreateModal(false);
      navigate(`/studio/${created._id}`);
    } finally {
      setCreating(false);
      setNewTitle('');
      setNewDescription('');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(p => p._id !== projectId));
      try {
        await api.delete(`/projects/${projectId}`);
      } catch (err) {
        console.error('Delete project error:', err);
      }
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.genre || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || p.category === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col justify-between selection:bg-[#dcc5b2] selection:text-[#2c2420]">
      <Navbar onOpenNewProject={() => setShowCreateModal(true)} />

      <main className="flex-1 max-w-6xl mx-auto px-6 py-8 w-full space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#231f1d] tracking-tight">Your Projects</h1>
            <p className="text-xs text-[#736a64] mt-0.5">
              Manage your multi-track DAW sessions, audio stems, and team agreements.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2c2420] hover:bg-[#3d332e] font-semibold text-xs text-white shadow-xs transition"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Project</span>
          </button>
        </div>

        {/* Search & Tabs Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-1">
          {/* Tabs: All, Owned, Collaborating, Archived */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Owned', 'Collaborating', 'Archived'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === tab
                    ? 'bg-[#2c2420] text-white shadow-xs'
                    : 'bg-white border border-[#e6ded5] text-[#736a64] hover:text-[#231f1d] hover:bg-[#faf8f5]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#8c827a] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#e6ded5] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#231f1d] placeholder-[#a89f97] focus:outline-none focus:border-[#2c2420] shadow-xs transition"
            />
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="p-12 text-center text-xs text-[#736a64] flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#2c2420]" />
            <span>Loading sessions from database...</span>
          </div>
        )}

        {/* Project Cards Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((p) => (
              <ProjectCard key={p._id} project={p} onDelete={handleDeleteProject} />
            ))}
          </div>
        )}

        {!loading && filteredProjects.length === 0 && (
          <div className="bg-white border border-dashed border-[#e6ded5] rounded-2xl p-12 text-center space-y-3">
            <FolderKanban className="w-8 h-8 text-[#8c827a] mx-auto" />
            <h3 className="text-sm font-bold text-[#231f1d]">No projects found in this category</h3>
            <p className="text-xs text-[#736a64]">Try selecting 'All' or create a new project above.</p>
          </div>
        )}
      </main>

      {/* New Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-[#2c2420]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e6ded5] rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-[#8c827a] hover:text-[#231f1d] p-1 rounded-lg hover:bg-[#faf8f5]"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-extrabold text-base text-[#231f1d] mb-1">Create New Project</h3>
            <p className="text-xs text-[#736a64] mb-4">Initialize a new multi-track DAW session in MongoDB.</p>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#231f1d] block mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Midnight Jam"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#e6ded5] rounded-xl px-3 py-2 text-xs text-[#231f1d] placeholder-[#a89f97] focus:outline-none focus:border-[#2c2420]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#231f1d] block mb-1">Genre</label>
                  <select
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#e6ded5] rounded-xl px-2.5 py-2 text-xs text-[#231f1d] font-medium focus:outline-none focus:border-[#2c2420]"
                  >
                    <option value="Electronic / Synth">Electronic / Synth</option>
                    <option value="Pop / Vocal">Pop / Vocal</option>
                    <option value="Acoustic / Indie">Acoustic / Indie</option>
                    <option value="Hip Hop / Trap">Hip Hop / Trap</option>
                    <option value="R&B / Soul">R&B / Soul</option>
                    <option value="Rock / Alternative">Rock / Alternative</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#231f1d] block mb-1">Tempo (BPM)</label>
                  <input
                    type="number"
                    min="40"
                    max="260"
                    value={newTempo}
                    onChange={(e) => setNewTempo(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#e6ded5] rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#231f1d] focus:outline-none focus:border-[#2c2420]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#231f1d] block mb-1">Musical Key</label>
                <input
                  type="text"
                  placeholder="e.g. F Minor, C Major"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#e6ded5] rounded-xl px-3 py-2 text-xs text-[#231f1d] placeholder-[#a89f97] focus:outline-none focus:border-[#2c2420]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#231f1d] block mb-1">Session Description</label>
                <textarea
                  rows="2"
                  placeholder="Notes for collaborators, vocal guide details..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#e6ded5] rounded-xl px-3 py-2 text-xs text-[#231f1d] placeholder-[#a89f97] focus:outline-none focus:border-[#2c2420]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#736a64] hover:bg-[#faf8f5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !newTitle.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#2c2420] hover:bg-[#3d332e] text-xs font-bold text-white shadow-xs transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  {creating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>{creating ? 'Creating...' : 'Create & Open Studio'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

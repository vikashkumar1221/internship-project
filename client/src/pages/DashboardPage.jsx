import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import ProjectCard from '../components/dashboard/ProjectCard';
import { Plus, FolderKanban, Search, X, Loader2, Music, Users, HardDrive, Sliders } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
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

      const mappedOwned = recents.map(p => ({ ...p, category: p.status === 'Archived' ? 'Archived' : 'Owned' }));
      const mappedShared = shared
        .filter(s => !recents.some(r => r._id === s._id))
        .map(s => ({ ...s, category: 'Collaborating' }));

      const all = [...mappedOwned, ...mappedShared];
      if (all.length > 0) {
        setProjects(all);
      } else {
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
      console.warn('Failed to load projects from server:', err.message);
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-amber-100 selection:text-amber-900">
      <Navbar onOpenNewProject={() => setShowCreateModal(true)} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar onOpenNewProject={() => setShowCreateModal(true)} />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
          {/* Welcome Banner */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Welcome, {user?.name || 'Creator'}!
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Collaborate in real time on multi-track DAW projects without exchanging audio files.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/studio"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Open Studio</span>
              </Link>

              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>New Project</span>
              </button>
            </div>
          </div>

          {/* KPI Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold text-slate-500">Active Projects</span>
                <Music className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{projects.length}</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold text-slate-500">Audio Stems</span>
                <HardDrive className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{projects.length * 5}</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold text-slate-500">Collaborators</span>
                <Users className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                {projects.filter(p => p.category === 'Collaborating').length + 3}
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold text-slate-500">Cloud Storage</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">Free</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">14.2 MB</p>
            </div>
          </div>

          {/* Search & Tabs Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['All', 'Owned', 'Collaborating', 'Archived'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeTab === tab
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search projects by title or genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-slate-900 shadow-xs transition"
              />
            </div>
          </div>

          {/* Loading Spinner */}
          {loading && (
            <div className="p-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-slate-900" />
              <span>Loading projects...</span>
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
            <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center space-y-3">
              <FolderKanban className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">No projects found in this tab</h3>
              <p className="text-xs text-slate-500">Try selecting 'All' or click 'New Project' to create one.</p>
            </div>
          )}
        </main>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Create New Project</h2>
                <p className="text-xs text-slate-500">Start a new multi-track session</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer Sunset Acoustic"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:bg-white focus:border-slate-900 transition font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Genre</label>
                  <select
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:bg-white focus:border-slate-900 transition font-medium"
                  >
                    <option value="Electronic / Synth">Electronic / Synth</option>
                    <option value="Pop / Vocal">Pop / Vocal</option>
                    <option value="Acoustic / Indie">Acoustic / Indie</option>
                    <option value="Hip Hop / Trap">Hip Hop / Trap</option>
                    <option value="Lo-Fi Chill">Lo-Fi Chill</option>
                    <option value="R&B / Soul">R&B / Soul</option>
                    <option value="Rock / Alternative">Rock / Alternative</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Tempo (BPM)</label>
                  <input
                    type="number"
                    min="40"
                    max="240"
                    value={newTempo}
                    onChange={(e) => setNewTempo(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:bg-white focus:border-slate-900 transition font-medium font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Musical Key</label>
                <select
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:bg-white focus:border-slate-900 transition font-medium font-mono"
                >
                  <option value="C Major">C Major</option>
                  <option value="C Minor">C Minor</option>
                  <option value="D Minor">D Minor</option>
                  <option value="E Minor">E Minor</option>
                  <option value="F Minor">F Minor</option>
                  <option value="G Major">G Major</option>
                  <option value="A Minor">A Minor</option>
                  <option value="B♭ Major">B♭ Major</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Description & Notes</label>
                <textarea
                  rows="2"
                  placeholder="Notes for vocalists, bpm, key, or reference song..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:bg-white focus:border-slate-900 transition font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  {creating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
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

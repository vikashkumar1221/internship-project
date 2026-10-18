import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import ProjectCard from '../components/dashboard/ProjectCard';
import { Plus, FolderKanban, Search, X, Loader2, Music, Users, HardDrive } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
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

      const mappedOwned = recents.map((p) => ({
        ...p,
        category: p.status === 'Archived' ? 'Archived' : 'Owned'
      }));
      const mappedShared = shared
        .filter((s) => !recents.some((r) => r._id === s._id))
        .map((s) => ({ ...s, category: 'Collaborating' }));

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
          },
          {
            _id: 'proj_demo_3',
            title: 'Lo-Fi Sunset Jam',
            genre: 'Lo-Fi / Hip Hop',
            category: 'Collaborating',
            tempo: 85,
            keySignature: 'C Minor',
            description: 'Mellow Rhodes chords, vinyl crackle, and laid-back boom bap drum pattern.',
            coverImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600'
          },
          {
            _id: 'proj_demo_4',
            title: 'Neon Horizon Club Mix',
            genre: 'Melodic Techno',
            category: 'Owned',
            tempo: 128,
            keySignature: 'A Minor',
            description: 'Driving basslines and ethereal vocal chops designed for club sound systems.',
            coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600'
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
      setProjects(projects.filter((p) => p._id !== projectId));
      try {
        await api.delete(`/projects/${projectId}`);
      } catch (err) {
        console.error('Delete project error:', err);
      }
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      (project.title && project.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.genre && project.genre.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()));

    if (activeFilter === 'All') return matchesSearch;
    if (activeFilter === 'Owned') return matchesSearch && project.category === 'Owned';
    if (activeFilter === 'Collaborating') return matchesSearch && project.category === 'Collaborating';
    if (activeFilter === 'Archived') return matchesSearch && project.category === 'Archived';
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-amber-100 selection:text-amber-900">
      <Navbar onOpenNewProject={() => setShowCreateModal(true)} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar onOpenNewProject={() => setShowCreateModal(true)} />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Studio Projects</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your multi-track DAW sessions, audio stems, and team agreements.
              </p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 font-semibold text-xs text-white shadow-xs transition"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create Project</span>
            </button>
          </div>

          {/* Search & Category Filter Pills */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search projects by title, genre, key..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-slate-900 transition shadow-xs"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {['All', 'Owned', 'Collaborating', 'Archived'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    activeFilter === filter
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="p-16 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-slate-900" />
              <span>Loading projects...</span>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto space-y-4 my-8 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <FolderKanban className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">No projects found</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {searchQuery
                    ? 'No project matches your search criteria. Try a different query.'
                    : 'Get started by creating your first music collaboration project.'}
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create New Project</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project._id} project={project} onDelete={handleDeleteProject} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h2 className="text-base font-extrabold text-slate-900">Create New Project</h2>
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
                  placeholder="e.g. Midnight Synthwave Anthem"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:bg-white focus:border-slate-900 transition font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Genre</label>
                  <select
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:bg-white focus:border-slate-900 transition font-medium"
                  >
                    <option value="Electronic / Synth">Electronic / Synth</option>
                    <option value="Pop / Vocal">Pop / Vocal</option>
                    <option value="Indie Rock">Indie Rock</option>
                    <option value="Hip Hop / Trap">Hip Hop / Trap</option>
                    <option value="Lo-Fi Chill">Lo-Fi Chill</option>
                    <option value="R&B / Soul">R&B / Soul</option>
                    <option value="Classical / Score">Classical / Score</option>
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
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:bg-white focus:border-slate-900 transition font-medium font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Key Signature</label>
                <select
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:bg-white focus:border-slate-900 transition font-medium font-mono"
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
                  rows="3"
                  placeholder="Notes about arrangement, required stems, or reference tracks..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:bg-white focus:border-slate-900 transition font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition flex items-center gap-1.5 shadow-xs"
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

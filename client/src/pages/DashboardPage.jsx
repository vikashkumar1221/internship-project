import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import ProjectCard from '../components/dashboard/ProjectCard';
import { Plus, Folder, Clock, Sparkles, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newGenre, setNewGenre] = useState('Electronic');

  const [projects] = useState([
    {
      _id: 'proj_demo_123',
      title: 'Midnight Synthwave Anthem',
      genre: 'Synthwave',
      tempo: 124,
      keySignature: 'F Minor',
      description: '80s retro synthwave project featuring Jupiter analog chords and lead vocals.',
      coverImage: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600'
    },
    {
      _id: 'proj_demo_456',
      title: 'Cyberpunk Neon Underground',
      genre: 'Cyberpunk',
      tempo: 130,
      keySignature: 'A Minor',
      description: 'Heavy industrial beat collaboration with distorted sub bass line.',
      coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600'
    }
  ]);

  const handleCreateProject = (e) => {
    e.preventDefault();
    setShowCreateModal(false);
    navigate('/studio');
  };

  return (
    <div className="min-h-screen bg-studio-darker flex flex-col">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto space-y-8">
          {/* Header Action Banner */}
          <div className="flex justify-between items-center pb-4 border-b border-studio-border">
            <div>
              <h1 className="text-2xl font-extrabold text-white">Producer Dashboard</h1>
              <p className="text-xs text-gray-400 mt-1">Manage your active DAW projects and real-time collaborations.</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 font-bold text-xs text-white shadow-lg shadow-indigo-600/30 hover:scale-105 transition"
            >
              <Plus className="w-4 h-4" /> Quick Create Project
            </button>
          </div>

          {/* Recent Projects Section */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-gray-200 flex items-center gap-2">
              <Folder className="w-5 h-5 text-indigo-400" /> Recent Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p) => (
                <ProjectCard key={p._id} project={p} />
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Quick Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-studio-card border border-studio-border rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in zoom-in-95">
            <button onClick={() => setShowCreateModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-extrabold text-base text-gray-100 mb-4">Create New Studio Project</h3>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer House Vocal Mix"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-studio-panel border border-studio-border rounded-xl px-3.5 py-2 text-xs text-gray-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Genre</label>
                <select
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
                  className="w-full bg-studio-panel border border-studio-border rounded-xl px-3.5 py-2 text-xs text-gray-200 focus:outline-none"
                >
                  <option value="Electronic">Electronic / EDM</option>
                  <option value="Hip Hop">Hip Hop / Trap</option>
                  <option value="Synthwave">Synthwave / 80s</option>
                  <option value="Pop">Pop / R&B</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 font-bold text-xs text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/30"
              >
                Create & Open Studio
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

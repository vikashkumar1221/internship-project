import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import RoyaltySplitModal from '../components/studio/RoyaltySplitModal';
import { Play, Heart, Headphones, Sliders, Music, ArrowLeft, FileText, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showRoyaltyModal, setShowRoyaltyModal] = useState(false);
  const [likesCount, setLikesCount] = useState(156);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        if (id && id !== 'project-details') {
          const res = await api.get(`/projects/${id}`);
          if (res.data?.data) {
            setProject(res.data.data.project);
            setTracks(res.data.data.tracks || []);
            setCollaborators(res.data.data.collaborators || []);
          }
        } else {
          // Fallback first project
          const res = await api.get('/projects');
          const recents = res.data?.data?.recent || [];
          if (recents.length > 0) {
            setProject(recents[0]);
          }
        }
      } catch (err) {
        console.warn('Failed to load project details:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleLike = () => {
    if (hasLiked) {
      setLikesCount(likesCount - 1);
      setHasLiked(false);
    } else {
      setLikesCount(likesCount + 1);
      setHasLiked(true);
    }
  };

  const currentProject = project || {
    _id: id || 'demo',
    title: 'Midnight Synthwave Anthem',
    genre: 'Synthwave',
    tempo: 124,
    keySignature: 'F Minor',
    description: '80s inspired retro synthwave collaboration project with lush vocal hooks.',
    coverImage: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800'
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col justify-between selection:bg-[#dcc5b2] selection:text-[#2c2420]">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#736a64] hover:text-[#231f1d] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Projects
          </Link>

        {loading ? (
          <div className="p-16 text-center text-xs text-[#736a64] flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#2c2420]" />
            <span>Loading project details...</span>
          </div>
        ) : (
          <>
            {/* Top Hero Card */}
            <div className="bg-white border border-[#e6ded5] rounded-2xl p-6 sm:p-8 shadow-subtle grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Big Cover Image */}
              <div className="md:col-span-5 rounded-xl overflow-hidden aspect-square bg-[#f5f0ea] border border-[#e6ded5] shadow-card">
                <img
                  src={currentProject.coverImage || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800'}
                  alt={currentProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details & Actions */}
              <div className="md:col-span-7 flex flex-col justify-between h-full space-y-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#2c2420] text-white text-[11px] font-semibold">
                      {currentProject.genre || 'Electronic'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-[#dcc5b2] text-[#2c2420] text-[11px] font-bold">
                      {currentProject.status || 'Active Collaboration'}
                    </span>
                  </div>

                  <h1 className="text-3xl font-extrabold text-[#231f1d] tracking-tight">
                    {currentProject.title}
                  </h1>

                  <div className="flex items-center gap-2 mt-1">
                    <img
                      src={currentProject.owner?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt="Owner"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-sm font-semibold text-[#2c2420]">
                      {currentProject.owner?.name || 'Producer'}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 mt-4 pt-4 border-t border-[#e6ded5] text-xs font-mono text-[#736a64]">
                    <span className="flex items-center gap-1.5 font-bold text-[#231f1d]">
                      <Headphones className="w-4 h-4 text-[#8c827a]" /> 1,240 plays
                    </span>
                    <span className="flex items-center gap-1.5 font-bold text-[#231f1d]">
                      <Sliders className="w-4 h-4 text-[#8c827a]" /> {tracks.length || 4} tracks
                    </span>
                    <button
                      onClick={handleLike}
                      className={`flex items-center gap-1.5 font-bold transition ${
                        hasLiked ? 'text-red-600' : 'text-[#231f1d] hover:text-red-600'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} /> {likesCount} likes
                    </button>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    to={`/studio/${currentProject._id}`}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2c2420] hover:bg-[#3d332e] font-semibold text-xs text-white shadow-xs transition"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Open in DAW Studio</span>
                  </Link>

                  <button
                    onClick={() => setShowRoyaltyModal(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-[#e6ded5] text-[#2c2420] hover:bg-[#faf8f5] font-semibold text-xs transition"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Royalty Splits & Contracts</span>
                  </button>
                </div>

                {/* About Box */}
                <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e6ded5] text-xs space-y-3">
                  <div>
                    <span className="font-bold text-[#231f1d] block mb-1">Session Notes</span>
                    <p className="text-[#736a64] leading-relaxed">
                      {currentProject.description || 'Collaborative DAW project session ready for stems and vocal recordings.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#e6ded5]/80 text-[#8c827a] font-mono text-[11px]">
                    <div>
                      <span className="block text-[#a89f97] text-[10px] uppercase">Created</span>
                      <span className="font-semibold text-[#231f1d]">
                        {currentProject.createdAt ? new Date(currentProject.createdAt).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[#a89f97] text-[10px] uppercase">Tempo</span>
                      <span className="font-semibold text-[#231f1d]">{currentProject.tempo || 120} BPM</span>
                    </div>
                    <div>
                      <span className="block text-[#a89f97] text-[10px] uppercase">Key</span>
                      <span className="font-semibold text-[#231f1d]">{currentProject.keySignature || 'C Major'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Track Stems List */}
            <div className="bg-white border border-[#e6ded5] rounded-2xl p-6 shadow-subtle space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[#e6ded5]">
                <h2 className="font-bold text-sm text-[#231f1d]">DAW Audio Tracks ({tracks.length || 4})</h2>
                <Link to={`/studio/${currentProject._id}`} className="text-xs font-semibold text-[#2c2420] hover:underline">
                  Launch Studio Console &rarr;
                </Link>
              </div>

              <div className="space-y-2">
                {(tracks.length > 0 ? tracks : [
                  { name: 'Lead Vocals (Sarah)', stems: [{ name: 'Lead_Take1.wav', duration: 180 }] },
                  { name: 'Analog Jupiter Synth', stems: [{ name: 'Synth_Chords.wav', duration: 180 }] },
                  { name: 'Phat Bassline', stems: [{ name: 'Sub_Bass.wav', duration: 180 }] },
                  { name: '707 Drum Machine', stems: [{ name: 'Drum_Loop.wav', duration: 180 }] }
                ]).map((t, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#faf8f5] border border-[#e6ded5]/70 hover:bg-[#f5f0ea] transition text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-[#e6ded5] flex items-center justify-center text-[#2c2420]">
                        <Music className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-[#231f1d] block">{t.name}</span>
                        <span className="text-[10px] text-[#8c827a]">
                          {t.stems?.length || 0} stem clip{t.stems?.length === 1 ? '' : 's'} loaded
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link
                        to={`/studio/${currentProject._id}`}
                        className="px-3 py-1 rounded-lg bg-[#2c2420] text-white text-[11px] font-semibold hover:bg-[#3d332e] transition"
                      >
                        Mix in DAW
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        </main>
      </div>

      <RoyaltySplitModal
        isOpen={showRoyaltyModal}
        onClose={() => setShowRoyaltyModal(false)}
        projectId={currentProject._id}
        projectTitle={currentProject.title}
      />
    </div>
  );
}

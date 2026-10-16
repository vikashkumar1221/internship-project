import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DAWHeader from '../components/studio/DAWHeader';
import Sidebar from '../components/common/Sidebar';
import Timeline from '../components/studio/Timeline';
import MixingConsole from '../components/studio/MixingConsole';
import PianoRoll from '../components/studio/PianoRoll';
import VersionControlPanel from '../components/studio/VersionControlPanel';
import ProjectChat from '../components/studio/ProjectChat';
import RoyaltySplitModal from '../components/studio/RoyaltySplitModal';
import { useSocket } from '../context/SocketContext';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentTime, setIsPlaying, setActiveProject, setTracks } from '../store/studioSlice';
import api from '../services/api';
import { Download, X, Check, Mail, UserPlus, Loader2 } from 'lucide-react';

export default function StudioPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { isPlaying, currentTime, activeProject, tracks } = useSelector((state) => state.studio);
  const { joinProjectRoom } = useSocket();

  const [showMixer, setShowMixer] = useState(false);
  const [showPianoRoll, setShowPianoRoll] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showRoyaltyModal, setShowRoyaltyModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('WAV (24-bit 48kHz)');

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Producer');
  const [inviteStatus, setInviteStatus] = useState(null);
  const [isInviting, setIsInviting] = useState(false);

  // Load project details and tracks from real MongoDB API
  useEffect(() => {
    const loadProjectData = async () => {
      try {
        let targetId = id;
        if (!targetId) {
          const resAll = await api.get('/projects');
          const recents = resAll.data?.data?.recent || [];
          if (recents.length > 0) {
            targetId = recents[0]._id;
          }
        }

        if (targetId) {
          const res = await api.get(`/projects/${targetId}`);
          if (res.data?.data?.project) {
            dispatch(setActiveProject(res.data.data.project));
          }
          if (res.data?.data?.tracks && res.data.data.tracks.length > 0) {
            dispatch(setTracks(res.data.data.tracks));
          }
          joinProjectRoom(targetId);
        }
      } catch (err) {
        console.warn('Could not fetch project from backend, running default state:', err.message);
        if (id) joinProjectRoom(id);
      }
    };

    loadProjectData();
  }, [id, dispatch, joinProjectRoom]);

  // Smooth playhead animation loop when isPlaying is true
  useEffect(() => {
    let animationFrameId;
    let lastTimestamp = performance.now();

    const step = (now) => {
      if (isPlaying) {
        const delta = (now - lastTimestamp) / 1000;
        dispatch(setCurrentTime(Number((currentTime + delta).toFixed(2))));
      }
      lastTimestamp = now;
      if (isPlaying) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    if (isPlaying) {
      animationFrameId = requestAnimationFrame(step);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPlaying, currentTime, dispatch]);

  const handleStartExport = () => {
    setIsExporting(true);
    setExportProgress(15);
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          const element = document.createElement('a');
          const file = new Blob([`Studio Master Mixdown for ${activeProject?.title || 'Session'}`], { type: 'audio/wav' });
          element.href = URL.createObjectURL(file);
          element.download = `${(activeProject?.title || 'Mixdown').replace(/\s+/g, '_')}_Master.${selectedFormat.startsWith('WAV') ? 'wav' : 'mp3'}`;
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
          return 100;
        }
        return prev + 25;
      });
    }, 350);
  };

  const handleSendInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setIsInviting(true);
    setInviteStatus(null);
    try {
      await api.post(`/projects/${activeProject?._id || id}/collaborators`, {
        email: inviteEmail,
        role: inviteRole
      });
      setInviteStatus({ type: 'success', text: `Invitation sent to ${inviteEmail} as ${inviteRole}!` });
      setInviteEmail('');
      setTimeout(() => setInviteStatus(null), 3000);
    } catch (err) {
      setInviteStatus({ type: 'error', text: err.response?.data?.message || 'Could not send invite.' });
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div className="h-screen bg-[#141110] flex flex-col overflow-hidden select-none">
      {/* DAW Header Controls */}
      <DAWHeader
        onToggleChat={() => setShowChat(!showChat)}
        onToggleVersions={() => setShowVersions(!showVersions)}
        onToggleMixer={() => {
          setShowMixer(!showMixer);
          if (showPianoRoll) setShowPianoRoll(false);
        }}
        onTogglePianoRoll={() => {
          setShowPianoRoll(!showPianoRoll);
          if (showMixer) setShowMixer(false);
        }}
        onOpenExport={() => setShowExportModal(true)}
        onOpenInvite={() => setShowInviteModal(true)}
        onOpenRoyalty={() => setShowRoyaltyModal(true)}
      />

      {/* Center DAW Multi-Track Timeline with docked Sidebar */}
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden relative min-w-0">
          <Timeline onSelectTrack={() => {}} projectId={activeProject?._id || id} />

          {/* Sliding Chat Drawer */}
          <ProjectChat isOpen={showChat} onClose={() => setShowChat(false)} projectId={activeProject?._id || id} />

          {/* Version History Drawer */}
          <VersionControlPanel isOpen={showVersions} onClose={() => setShowVersions(false)} projectId={activeProject?._id || id} />
        </div>
      </div>

      {/* Royalty Split Calculator Modal */}
      <RoyaltySplitModal
        isOpen={showRoyaltyModal}
        onClose={() => setShowRoyaltyModal(false)}
        projectId={activeProject?._id || id}
        projectTitle={activeProject?.title}
      />

      {/* Bottom Panel: Mixing Console or Sequencer */}
      {showMixer && <MixingConsole onClose={() => setShowMixer(false)} />}
      {showPianoRoll && <PianoRoll onClose={() => setShowPianoRoll(false)} />}

      {/* Export / Bounce Audio Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-[#2c2420]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e6ded5] rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => {
                setShowExportModal(false);
                setExportProgress(0);
              }}
              className="absolute top-4 right-4 text-[#8c827a] hover:text-[#231f1d] p-1 rounded-lg hover:bg-[#faf8f5] transition"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-extrabold text-base text-[#231f1d] mb-1">Export Project Mixdown</h3>
            <p className="text-xs text-[#736a64] mb-4">
              Bounce your master stereo output with active track volume and panning.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#231f1d] block mb-1">Audio Format</label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#e6ded5] rounded-xl px-3 py-2 text-xs text-[#231f1d] font-medium focus:outline-none focus:border-[#2c2420]"
                >
                  <option value="WAV (24-bit 48kHz)">WAV (Uncompressed 24-bit 48kHz Master)</option>
                  <option value="MP3 (320kbps)">MP3 (High Quality 320kbps Preview)</option>
                  <option value="Stems ZIP">Individual Track Stems (.ZIP)</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-[#faf8f5] border border-[#e6ded5] text-xs space-y-1.5 text-[#736a64]">
                <div className="flex justify-between">
                  <span>Project Title:</span>
                  <span className="font-bold text-[#231f1d]">{activeProject?.title || 'Session'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Included Tracks:</span>
                  <span className="font-bold text-[#231f1d]">{tracks.length} Channels</span>
                </div>
                <div className="flex justify-between">
                  <span>Tempo & Key:</span>
                  <span className="font-bold text-[#231f1d]">{activeProject?.tempo || 120} BPM • {activeProject?.keySignature || 'C Major'}</span>
                </div>
              </div>

              {isExporting && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-[#231f1d] font-semibold">
                    <span>Rendering mixdown...</span>
                    <span>{exportProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#faf8f5] rounded-full overflow-hidden border border-[#e6ded5]">
                    <div
                      className="h-full bg-[#2c2420] transition-all duration-300 rounded-full"
                      style={{ width: `${exportProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#736a64] hover:bg-[#faf8f5] transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={handleStartExport}
                  className="px-5 py-2.5 rounded-xl bg-[#2c2420] hover:bg-[#3d332e] text-xs font-bold text-white shadow-xs transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isExporting ? 'Exporting...' : 'Bounce & Download'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invite Collaborator Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-[#2c2420]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e6ded5] rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => {
                setShowInviteModal(false);
                setInviteStatus(null);
              }}
              className="absolute top-4 right-4 text-[#8c827a] hover:text-[#231f1d] p-1 rounded-lg hover:bg-[#faf8f5] transition"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-extrabold text-base text-[#231f1d] mb-1">Invite Collaborator to Session</h3>
            <p className="text-xs text-[#736a64] mb-4">
              Collaborate live on this DAW project with synchronized audio stems and playhead.
            </p>

            {inviteStatus && (
              <div className={`mb-3 p-3 rounded-xl text-xs flex items-center gap-2 ${
                inviteStatus.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {inviteStatus.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <X className="w-4 h-4 shrink-0" />}
                <span>{inviteStatus.text}</span>
              </div>
            )}

            <form onSubmit={handleSendInvite} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#231f1d] block mb-1">Collaborator Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8c827a] absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="sarah@studio.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#e6ded5] rounded-xl pl-9 pr-3 py-2 text-xs text-[#231f1d] placeholder-[#a89f97] focus:outline-none focus:border-[#2c2420]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#231f1d] block mb-1">Assign Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#e6ded5] rounded-xl px-3 py-2 text-xs text-[#231f1d] font-medium focus:outline-none focus:border-[#2c2420]"
                >
                  <option value="Producer">Producer (Full edit & mixer control)</option>
                  <option value="Vocalist">Vocalist (Drop vocal stems & comments)</option>
                  <option value="Owner">Co-Owner (Full administrative rights)</option>
                  <option value="Viewer">Viewer (Listen-only preview access)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#736a64] hover:bg-[#faf8f5] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isInviting || !inviteEmail.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#2c2420] hover:bg-[#3d332e] text-xs font-bold text-white shadow-xs transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isInviting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
                  <span>{isInviting ? 'Sending...' : 'Send Invitation'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

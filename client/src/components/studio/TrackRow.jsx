import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  toggleMuteTrack,
  toggleSoloTrack,
  updateTrackVolume,
  updateTrackPan,
  addStemToTrack,
  deleteTrack
} from '../../store/studioSlice';
import { audioEngine } from '../../services/webAudioEngine';
import api from '../../services/api';
import { Upload, Trash2, Volume2, VolumeX, Music, Loader2, Play, Pause } from 'lucide-react';

export default function TrackRow({ track, onSelectTrack, projectId }) {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const audioRef = useRef(null);
  const { currentTime, activeProject } = useSelector((state) => state.studio);
  const [isUploading, setIsUploading] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const currentProjectId = projectId || activeProject?._id;

  const handleVolumeChange = async (e) => {
    const vol = parseFloat(e.target.value);
    dispatch(updateTrackVolume({ trackId: track._id, volume: vol }));
    audioEngine.setTrackVolume(track._id, vol);

    if (currentProjectId && !track._id.startsWith('track_')) {
      try {
        await api.put(`/projects/${currentProjectId}/tracks/${track._id}`, { volume: vol });
      } catch (err) {
        // quiet ignore for quick drag
      }
    }
  };

  const handlePanChange = async (e) => {
    const pan = parseFloat(e.target.value);
    dispatch(updateTrackPan({ trackId: track._id, pan }));
    audioEngine.setTrackPan(track._id, pan);

    if (currentProjectId && !track._id.startsWith('track_')) {
      try {
        await api.put(`/projects/${currentProjectId}/tracks/${track._id}`, { pan });
      } catch (err) {}
    }
  };

  const handleToggleMute = async () => {
    const nextState = !track.isMuted;
    dispatch(toggleMuteTrack(track._id));
    if (audioRef.current) {
      audioRef.current.muted = nextState;
    }
    if (currentProjectId && !track._id.startsWith('track_')) {
      try {
        await api.put(`/projects/${currentProjectId}/tracks/${track._id}`, { isMuted: nextState });
      } catch (err) {}
    }
  };

  const handleToggleSolo = async () => {
    const nextState = !track.isSoloed;
    dispatch(toggleSoloTrack(track._id));
    if (currentProjectId && !track._id.startsWith('track_')) {
      try {
        await api.put(`/projects/${currentProjectId}/tracks/${track._id}`, { isSoloed: nextState });
      } catch (err) {}
    }
  };

  const handleDeleteTrack = async () => {
    if (window.confirm(`Are you sure you want to delete track "${track.name}"?`)) {
      dispatch(deleteTrack(track._id));
      if (currentProjectId && !track._id.startsWith('track_')) {
        try {
          await api.delete(`/projects/${currentProjectId}/tracks/${track._id}`);
        } catch (err) {
          console.error('Failed to delete track from server:', err);
        }
      }
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('audio', file);
      formData.append('trackId', track._id);
      formData.append('projectId', currentProjectId || 'proj_demo_123');
      formData.append('name', file.name);

      const res = await api.post('/stems/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data?.data) {
        dispatch(
          addStemToTrack({
            trackId: track._id,
            stem: res.data.data
          })
        );
      }
    } catch (err) {
      console.warn('Backend stem upload error, falling back to local clip:', err.message);
      const peaks = Array.from({ length: 90 }, () => Math.random() * 0.75 + 0.15);
      dispatch(
        addStemToTrack({
          trackId: track._id,
          stem: {
            _id: `stem_${Date.now()}`,
            name: file.name,
            duration: 180,
            startTime: 0,
            peaks,
            fileUrl: URL.createObjectURL(file)
          }
        })
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const toggleStemAudioPlayback = (fileUrl) => {
    if (!audioRef.current) {
      audioRef.current = new Audio(fileUrl);
      audioRef.current.onended = () => setIsPlayingAudio(false);
    }

    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.src = fileUrl;
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => setIsPlayingAudio(false));
    }
  };

  const formatPan = (pan) => {
    if (pan === 0) return 'C';
    if (pan < 0) return `${Math.round(Math.abs(pan) * 100)}L`;
    return `${Math.round(pan * 100)}R`;
  };

  return (
    <div className="h-24 border-b border-[#2d2622] bg-[#1a1614] flex items-stretch hover:bg-[#201c19] transition group select-none">
      {/* Left Control Panel Header (Dark DAW Strip) */}
      <div
        className="w-64 border-r border-[#2d2622] p-2.5 flex flex-col justify-between shrink-0 bg-[#231e1b]"
        style={{ borderLeft: `4px solid ${track.color || '#dcc5b2'}` }}
      >
        {/* Track Title & Top Action */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span
              onClick={() => onSelectTrack && onSelectTrack(track)}
              className="font-bold text-xs text-[#faf8f5] truncate cursor-pointer hover:text-[#dcc5b2] transition"
              title={track.name}
            >
              {track.name}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="p-1 rounded text-[#a89f97] hover:text-[#faf8f5] hover:bg-white/10 transition"
              title="Upload Audio Stem (MP3, WAV, AIFF)"
            >
              {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#dcc5b2]" /> : <Upload className="w-3.5 h-3.5" />}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="audio/*,.wav,.mp3,.aiff,.flac"
              className="hidden"
            />
            <button
              onClick={handleDeleteTrack}
              className="p-1 rounded text-[#a89f97] hover:text-red-400 hover:bg-white/10 transition"
              title="Delete Track"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mute, Solo & Track Status */}
        <div className="flex items-center gap-1.5 my-0.5">
          <button
            onClick={handleToggleMute}
            className={`w-6 h-5 rounded text-[10px] font-bold uppercase transition flex items-center justify-center ${
              track.isMuted
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-[#2e2723] border border-[#443a34] text-[#a89f97] hover:text-white hover:bg-[#38302b]'
            }`}
            title="Mute Track (M)"
          >
            M
          </button>

          <button
            onClick={handleToggleSolo}
            className={`w-6 h-5 rounded text-[10px] font-bold uppercase transition flex items-center justify-center ${
              track.isSoloed
                ? 'bg-[#dcc5b2] text-[#2c2420] font-extrabold shadow-xs'
                : 'bg-[#2e2723] border border-[#443a34] text-[#a89f97] hover:text-white hover:bg-[#38302b]'
            }`}
            title="Solo Track (S)"
          >
            S
          </button>

          <span className="text-[10px] text-[#736a64] font-mono ml-auto">
            {track.stems?.length || 0} stem{track.stems?.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Volume & Pan Sliders */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] text-[#a89f97]">
            <span className="w-6 text-[9px] font-mono text-[#736a64]">VOL</span>
            <input
              type="range"
              min="-40"
              max="6"
              step="0.5"
              value={track.volume ?? 0}
              onChange={handleVolumeChange}
              className="w-full accent-[#dcc5b2] h-1.5 bg-[#38302b] rounded-lg cursor-pointer"
            />
            <span className="w-9 text-right font-mono text-[9px] text-[#faf8f5] font-bold">
              {track.volume > 0 ? `+${track.volume}` : track.volume}dB
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-[#a89f97]">
            <span className="w-6 text-[9px] font-mono text-[#736a64]">PAN</span>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.05"
              value={track.pan ?? 0}
              onChange={handlePanChange}
              className="w-full accent-[#dcc5b2] h-1.5 bg-[#38302b] rounded-lg cursor-pointer"
            />
            <span className="w-9 text-right font-mono text-[9px] text-[#faf8f5] font-bold">
              {formatPan(track.pan ?? 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Right Waveform & Clips Lane (Deep Dark Studio Canvas) */}
      <div className="flex-1 relative flex items-center px-2 bg-[#141110] overflow-hidden">
        {track.stems && track.stems.length > 0 ? (
          track.stems.map((stem) => {
            const playedRatio = Math.min(1, Math.max(0, currentTime / 60));
            return (
              <div
                key={stem._id}
                className="h-16 rounded-xl border border-[#38302b] bg-[#231e1b] shadow-md flex flex-col justify-between p-2 relative overflow-hidden select-none"
                style={{ width: `${Math.max(480, (stem.duration || 120) * 8)}px` }}
              >
                {/* Stem Waveform Canvas Visualization */}
                <div className="flex items-center justify-between text-[10px] text-[#a89f97] z-10 font-mono">
                  <div className="flex items-center gap-2">
                    {stem.fileUrl && (
                      <button
                        onClick={() => toggleStemAudioPlayback(stem.fileUrl)}
                        className="w-4 h-4 rounded-full bg-[#dcc5b2] text-[#2c2420] flex items-center justify-center hover:scale-105 transition"
                        title={isPlayingAudio ? 'Pause' : 'Play audio stem'}
                      >
                        {isPlayingAudio ? <Pause className="w-2.5 h-2.5 fill-current" /> : <Play className="w-2.5 h-2.5 fill-current ml-0.5" />}
                      </button>
                    )}
                    <span className="font-bold text-[#faf8f5] truncate max-w-[200px]">{stem.name}</span>
                  </div>
                  <span className="text-[#736a64]">{stem.duration ? `${Math.round(stem.duration)}s` : 'Stem Clip'} • 48kHz</span>
                </div>

                <div className="flex items-center gap-0.5 h-7 relative z-10">
                  {(stem.peaks || Array.from({ length: 70 }, () => Math.random() * 0.7 + 0.2)).map((p, i) => (
                    <div
                      key={i}
                      className="w-1 rounded-full transition-colors duration-75"
                      style={{
                        height: `${Math.max(4, p * 26)}px`,
                        backgroundColor:
                          (i / 70) <= playedRatio
                            ? track.color || '#dcc5b2'
                            : '#3d342f'
                      }}
                    />
                  ))}
                </div>

                <div className="flex justify-between items-center text-[9px] text-[#736a64] font-mono z-10">
                  <span>Start 00:00</span>
                  <span>End 01:00</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex items-center gap-2 text-xs text-[#736a64] pl-4 italic">
            <span>No audio clip loaded. Click the upload button on the left to drop an audio track.</span>
          </div>
        )}
      </div>
    </div>
  );
}

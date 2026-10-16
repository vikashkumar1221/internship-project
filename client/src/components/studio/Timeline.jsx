import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TrackRow from './TrackRow';
import { setCurrentTime, addTrack } from '../../store/studioSlice';
import { useSocket } from '../../context/SocketContext';
import api from '../../services/api';
import { Plus } from 'lucide-react';

export default function Timeline({ onSelectTrack, projectId }) {
  const dispatch = useDispatch();
  const timelineRef = useRef(null);
  const { tracks, currentTime, activeProject } = useSelector((state) => state.studio);
  const { socket } = useSocket();

  const currentProjectId = projectId || activeProject?._id;

  const handleTimelineScrub = (e) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left - 256;
    if (clickX >= 0) {
      const newSec = Math.max(0, parseFloat((clickX / 20).toFixed(1)));
      dispatch(setCurrentTime(newSec));

      if (socket) {
        socket.emit('playhead-scrub', { projectId: currentProjectId, currentTime: newSec, isPlaying: true });
      }
    }
  };

  const handleAddNewTrack = async () => {
    const trackColors = ['#06b6d4', '#ec4899', '#6366f1', '#10b981', '#f59e0b', '#dcc5b2'];
    const trackTypes = ['Lead Vocal', 'Acoustic Guitar', 'Backing Vocals', 'Synthesizer', 'Sub Bass', 'Drums'];
    const randomName = trackTypes[tracks.length % trackTypes.length];
    const randomColor = trackColors[tracks.length % trackColors.length];

    if (currentProjectId && !currentProjectId.startsWith('proj_demo_')) {
      try {
        const res = await api.post(`/projects/${currentProjectId}/tracks`, {
          name: `${randomName} ${tracks.length + 1}`,
          color: randomColor,
          volume: 0,
          pan: 0
        });
        if (res.data?.data) {
          dispatch(addTrack(res.data.data));
          return;
        }
      } catch (err) {
        console.warn('Failed to add track to server, using local fallback:', err.message);
      }
    }

    const newTrack = {
      _id: `track_${Date.now()}`,
      name: `${randomName} ${tracks.length + 1}`,
      color: randomColor,
      volume: 0,
      pan: 0,
      isMuted: false,
      isSoloed: false,
      stems: []
    };

    dispatch(addTrack(newTrack));
  };

  return (
    <div className="flex-1 flex flex-col bg-[#141110] overflow-x-auto relative select-none" ref={timelineRef}>
      {/* Top Timeline Ruler Bar (Dark DAW Style) */}
      <div
        onClick={handleTimelineScrub}
        className="h-8 border-b border-[#2d2622] bg-[#1f1a18] flex items-center text-[10px] font-mono text-[#a89f97] sticky top-0 z-20 cursor-pointer shadow-sm"
      >
        {/* Track Controls Spacer Header */}
        <div className="w-64 border-r border-[#2d2622] px-3 font-bold text-[#faf8f5] shrink-0 flex items-center justify-between">
          <span>TRACKS ({tracks.length})</span>
          <span className="text-[9px] text-[#736a64] font-normal">TIME (SEC)</span>
        </div>

        {/* Time Seconds & Bar Markers */}
        <div className="flex-1 flex items-center relative h-full">
          {Array.from({ length: 40 }).map((_, bar) => (
            <div key={bar} className="w-20 border-l border-[#2d2622] h-full flex items-end pb-1 px-1.5 shrink-0">
              <span className="text-[#736a64] font-medium">00:{(bar * 4).toString().padStart(2, '0')}</span>
            </div>
          ))}

          {/* Clean Red Playhead Needle */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-600 z-30 pointer-events-none transition-all duration-75"
            style={{ left: `${currentTime * 20}px` }}
          >
            <div className="w-2.5 h-2.5 bg-red-600 transform -translate-x-[4px] rotate-45 rounded-xs" />
          </div>
        </div>
      </div>

      {/* Multi-Track List Rows */}
      <div className="flex-1 divide-y divide-[#2d2622] overflow-y-auto">
        {tracks.map((track) => (
          <TrackRow key={track._id} track={track} onSelectTrack={onSelectTrack} projectId={currentProjectId} />
        ))}

        {/* Add Track Button Bar */}
        <div className="p-3 bg-[#1a1614] flex items-center gap-2 border-b border-[#2d2622]">
          <button
            onClick={handleAddNewTrack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-[#443a34] hover:border-[#dcc5b2] text-[#a89f97] hover:text-[#faf8f5] hover:bg-[#231e1b] text-xs font-medium transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Audio Track</span>
          </button>
        </div>
      </div>
    </div>
  );
}

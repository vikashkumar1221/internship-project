import React, { useState, useEffect } from 'react';
import DAWHeader from '../components/studio/DAWHeader';
import Timeline from '../components/studio/Timeline';
import MixingConsole from '../components/studio/MixingConsole';
import PianoRoll from '../components/studio/PianoRoll';
import StemIsolationModal from '../components/studio/StemIsolationModal';
import VersionControlPanel from '../components/studio/VersionControlPanel';
import ProjectChat from '../components/studio/ProjectChat';
import { useSocket } from '../context/SocketContext';
import { useDispatch } from 'react-redux';
import { addStemToTrack } from '../store/studioSlice';

export default function StudioPage() {
  const dispatch = useDispatch();
  const { joinProjectRoom } = useSocket();

  const [showMixer, setShowMixer] = useState(false);
  const [showPianoRoll, setShowPianoRoll] = useState(false);
  const [showAIStems, setShowAIStems] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);

  useEffect(() => {
    joinProjectRoom('proj_demo_123');
  }, []);

  const handleImportStem = (stemData) => {
    dispatch(
      addStemToTrack({
        trackId: selectedTrack?._id || 'track_1',
        stem: {
          _id: `stem_ai_${Date.now()}`,
          name: stemData.name,
          duration: 180,
          startTime: 0,
          peaks: Array.from({ length: 80 }, () => Math.random() * 0.8 + 0.2)
        }
      })
    );
    setShowAIStems(false);
  };

  return (
    <div className="h-screen bg-studio-darker flex flex-col overflow-hidden select-none">
      {/* DAW Header Controls */}
      <DAWHeader
        onOpenAIStems={() => setShowAIStems(true)}
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
      />

      {/* Center DAW Multi-Track Timeline */}
      <div className="flex-1 flex overflow-hidden relative">
        <Timeline onSelectTrack={(t) => setSelectedTrack(t)} />

        {/* Sliding Chat Drawer */}
        <ProjectChat isOpen={showChat} onClose={() => setShowChat(false)} />

        {/* Version History Drawer */}
        <VersionControlPanel isOpen={showVersions} onClose={() => setShowVersions(false)} />
      </div>

      {/* Bottom Panel (Mixing Console or Piano Roll) */}
      {showMixer && <MixingConsole onClose={() => setShowMixer(false)} />}
      {showPianoRoll && <PianoRoll onClose={() => setShowPianoRoll(false)} />}

      {/* Demucs AI Stem Modal */}
      <StemIsolationModal
        isOpen={showAIStems}
        onClose={() => setShowAIStems(false)}
        onImportStems={handleImportStem}
      />
    </div>
  );
}

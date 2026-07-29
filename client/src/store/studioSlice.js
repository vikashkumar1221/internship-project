import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeProject: {
    _id: 'proj_demo_123',
    title: 'Midnight Synthwave Anthem',
    tempo: 124,
    keySignature: 'F Minor',
    timeSignature: '4/4',
    genre: 'Synthwave',
    description: '80s inspired retro synthwave collaboration project with lush vocal hooks.'
  },
  tracks: [
    {
      _id: 'track_1',
      name: 'Lead Vocals (Sarah)',
      color: '#ec4899',
      volume: -2,
      pan: 0,
      isMuted: false,
      isSoloed: false,
      eqSettings: { low: 0, mid: 2, high: 1 },
      stems: [
        {
          _id: 'stem_1',
          name: 'Sarah_Vocal_Lead_Hook.wav',
          duration: 180,
          startTime: 0,
          peaks: Array.from({ length: 80 }, (_, i) => Math.abs(Math.sin(i * 0.2) * 0.8 + 0.1))
        }
      ]
    },
    {
      _id: 'track_2',
      name: 'Analog Jupiter Synth',
      color: '#6366f1',
      volume: -4,
      pan: -0.2,
      isMuted: false,
      isSoloed: false,
      eqSettings: { low: -1, mid: 3, high: 4 },
      stems: [
        {
          _id: 'stem_2',
          name: 'Jupiter_8_Chords.wav',
          duration: 180,
          startTime: 0,
          peaks: Array.from({ length: 80 }, (_, i) => Math.abs(Math.cos(i * 0.15) * 0.7 + 0.2))
        }
      ]
    },
    {
      _id: 'track_3',
      name: 'Sub Bassline',
      color: '#10b981',
      volume: -1,
      pan: 0,
      isMuted: false,
      isSoloed: false,
      eqSettings: { low: 5, mid: -2, high: -6 },
      stems: [
        {
          _id: 'stem_3',
          name: 'Moog_Sub_Bass.wav',
          duration: 180,
          startTime: 0,
          peaks: Array.from({ length: 80 }, (_, i) => Math.abs(Math.sin(i * 0.1) * 0.9 + 0.1))
        }
      ]
    },
    {
      _id: 'track_4',
      name: '707 Drum Loop',
      color: '#f59e0b',
      volume: 0,
      pan: 0,
      isMuted: false,
      isSoloed: false,
      eqSettings: { low: 2, mid: 0, high: 3 },
      stems: [
        {
          _id: 'stem_4',
          name: 'TR707_Full_Beat.wav',
          duration: 180,
          startTime: 0,
          peaks: Array.from({ length: 80 }, (_, i) => (i % 4 === 0 ? 0.95 : 0.25))
        }
      ]
    }
  ],
  isPlaying: false,
  currentTime: 0,
  zoomLevel: 100,
  snapToGrid: '1/16',
  selectedTool: 'pointer', // 'pointer', 'cut', 'trim', 'loop'
  loopRegion: { start: 0, end: 16, active: false },
  history: [],
  onlineCollaborators: [
    { id: 'u1', name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', role: 'Owner' },
    { id: 'u2', name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', role: 'Editor' }
  ]
};

export const studioSlice = createSlice({
  name: 'studio',
  initialState,
  reducers: {
    setActiveProject: (state, action) => {
      state.activeProject = action.payload;
    },
    setTracks: (state, action) => {
      state.tracks = action.payload;
    },
    updateTrackVolume: (state, action) => {
      const { trackId, volume } = action.payload;
      const track = state.tracks.find((t) => t._id === trackId);
      if (track) track.volume = volume;
    },
    updateTrackPan: (state, action) => {
      const { trackId, pan } = action.payload;
      const track = state.tracks.find((t) => t._id === trackId);
      if (track) track.pan = pan;
    },
    toggleMuteTrack: (state, action) => {
      const track = state.tracks.find((t) => t._id === action.payload);
      if (track) track.isMuted = !track.isMuted;
    },
    toggleSoloTrack: (state, action) => {
      const track = state.tracks.find((t) => t._id === action.payload);
      if (track) track.isSoloed = !track.isSoloed;
    },
    updateTrackEQ: (state, action) => {
      const { trackId, eq } = action.payload;
      const track = state.tracks.find((t) => t._id === trackId);
      if (track) track.eqSettings = { ...track.eqSettings, ...eq };
    },
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
    setCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    },
    setZoomLevel: (state, action) => {
      state.zoomLevel = action.payload;
    },
    setSnapToGrid: (state, action) => {
      state.snapToGrid = action.payload;
    },
    setSelectedTool: (state, action) => {
      state.selectedTool = action.payload;
    },
    addTrack: (state, action) => {
      state.tracks.push(action.payload);
    },
    addStemToTrack: (state, action) => {
      const { trackId, stem } = action.payload;
      const track = state.tracks.find((t) => t._id === trackId);
      if (track) track.stems.push(stem);
    },
    setOnlineCollaborators: (state, action) => {
      state.onlineCollaborators = action.payload;
    }
  }
});

export const {
  setActiveProject,
  setTracks,
  updateTrackVolume,
  updateTrackPan,
  toggleMuteTrack,
  toggleSoloTrack,
  updateTrackEQ,
  setIsPlaying,
  setCurrentTime,
  setZoomLevel,
  setSnapToGrid,
  setSelectedTool,
  addTrack,
  addStemToTrack,
  setOnlineCollaborators
} = studioSlice.actions;

export default studioSlice.reducer;

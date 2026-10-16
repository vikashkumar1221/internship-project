import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeProject: {
    _id: 'proj_demo_123',
    title: 'New Song',
    folder: 'My Project',
    tempo: 124,
    keySignature: 'F Minor',
    timeSignature: '4/4',
    genre: 'Indie Pop',
    description: 'Collaborative studio session with Vocals, Guitar, Drums, and Bass.'
  },
  tracks: [
    {
      _id: 'track_1',
      name: 'Vocals',
      color: '#06b6d4',
      volume: -2,
      pan: 0,
      isMuted: false,
      isSoloed: false,
      eqSettings: { low: 0, mid: 2, high: 1 },
      stems: [
        {
          _id: 'stem_1',
          name: 'Lead_Vocal_Take1.wav',
          duration: 180,
          startTime: 0,
          peaks: Array.from({ length: 80 }, (_, i) => Math.abs(Math.sin(i * 0.2) * 0.8 + 0.1))
        }
      ]
    },
    {
      _id: 'track_2',
      name: 'Guitar',
      color: '#3b82f6',
      volume: -4,
      pan: -0.2,
      isMuted: false,
      isSoloed: false,
      eqSettings: { low: -1, mid: 3, high: 4 },
      stems: [
        {
          _id: 'stem_2',
          name: 'Acoustic_Guitar_Chords.wav',
          duration: 180,
          startTime: 0,
          peaks: Array.from({ length: 80 }, (_, i) => Math.abs(Math.cos(i * 0.15) * 0.7 + 0.2))
        }
      ]
    },
    {
      _id: 'track_3',
      name: 'Drums',
      color: '#f59e0b',
      volume: 0,
      pan: 0,
      isMuted: false,
      isSoloed: false,
      eqSettings: { low: 2, mid: 0, high: 3 },
      stems: [
        {
          _id: 'stem_3',
          name: 'Drum_Groove_Pattern.wav',
          duration: 180,
          startTime: 0,
          peaks: Array.from({ length: 80 }, (_, i) => (i % 4 === 0 ? 0.95 : 0.25))
        }
      ]
    },
    {
      _id: 'track_4',
      name: 'Bass',
      color: '#8b5cf6',
      volume: -1,
      pan: 0,
      isMuted: false,
      isSoloed: false,
      eqSettings: { low: 5, mid: -2, high: -6 },
      stems: [
        {
          _id: 'stem_4',
          name: 'Moog_Sub_Bass.wav',
          duration: 180,
          startTime: 0,
          peaks: Array.from({ length: 80 }, (_, i) => Math.abs(Math.sin(i * 0.1) * 0.9 + 0.1))
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
    deleteTrack: (state, action) => {
      state.tracks = state.tracks.filter((t) => t._id !== action.payload);
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
  deleteTrack,
  addStemToTrack,
  setOnlineCollaborators
} = studioSlice.actions;

export default studioSlice.reducer;

// Socket.io Real-Time DAW Collaboration Handler

const activeUsersInProject = new Map(); // projectId -> Map(socketId, userData)
const lockedTracks = new Map(); // trackId -> userId

const setupSocketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Join Project Studio Room
    socket.on('join-project', ({ projectId, user }) => {
      socket.join(projectId);
      socket.projectId = projectId;
      socket.user = user;

      if (!activeUsersInProject.has(projectId)) {
        activeUsersInProject.set(projectId, new Map());
      }
      activeUsersInProject.get(projectId).set(socket.id, {
        id: user.id || socket.id,
        name: user.name || 'Anonymous Producer',
        avatar: user.avatar,
        cursor: { x: 0, y: 0 }
      });

      // Broadcast active collaborator presence list
      const presenceList = Array.from(activeUsersInProject.get(projectId).values());
      io.to(projectId).emit('presence-update', presenceList);
      console.log(`[Socket.io] User ${user.name} joined project room: ${projectId}`);
    });

    // Real-time Cursor Movement (Figma-style)
    socket.on('cursor-move', ({ projectId, cursor }) => {
      socket.to(projectId).emit('cursor-moved', {
        socketId: socket.id,
        userId: socket.user?.id,
        name: socket.user?.name,
        cursor
      });
    });

    // Real-time Track Parameter Update (Volume, Pan, EQ, Mute/Solo)
    socket.on('track-update', ({ projectId, trackId, updates }) => {
      socket.to(projectId).emit('track-updated', { trackId, updates, updatedBy: socket.user?.name });
    });

    // Track Locking & Conflict Resolution
    socket.on('lock-track', ({ projectId, trackId }) => {
      if (!lockedTracks.has(trackId)) {
        lockedTracks.set(trackId, socket.user?.id || socket.id);
        io.to(projectId).emit('track-locked', { trackId, lockedBy: socket.user });
      } else {
        socket.emit('lock-failed', { trackId, reason: 'Track currently locked by another collaborator' });
      }
    });

    socket.on('unlock-track', ({ projectId, trackId }) => {
      if (lockedTracks.get(trackId) === (socket.user?.id || socket.id)) {
        lockedTracks.delete(trackId);
        io.to(projectId).emit('track-unlocked', { trackId });
      }
    });

    // Timeline Scrub & Playhead Sync
    socket.on('playhead-scrub', ({ projectId, currentTime, isPlaying }) => {
      socket.to(projectId).emit('playhead-synced', { currentTime, isPlaying, sender: socket.user?.name });
    });

    // Realtime Project Chat & Typing Indicator
    socket.on('typing-start', ({ projectId }) => {
      socket.to(projectId).emit('user-typing', { user: socket.user?.name });
    });

    socket.on('typing-stop', ({ projectId }) => {
      socket.to(projectId).emit('user-stopped-typing', { user: socket.user?.name });
    });

    socket.on('send-message', ({ projectId, message }) => {
      io.to(projectId).emit('new-message', message);
    });

    // Disconnect Handler
    socket.on('disconnect', () => {
      if (socket.projectId && activeUsersInProject.has(socket.projectId)) {
        const projectRoom = activeUsersInProject.get(socket.projectId);
        projectRoom.delete(socket.id);
        const presenceList = Array.from(projectRoom.values());
        io.to(socket.projectId).emit('presence-update', presenceList);
      }
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });
};

module.exports = setupSocketHandler;

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [collaborators, setCollaborators] = useState([]);

  useEffect(() => {
    const newSocket = io(window.location.origin, {
      autoConnect: true,
      transports: ['websocket', 'polling']
    });

    setSocket(newSocket);

    newSocket.on('presence-update', (presenceList) => {
      setCollaborators(presenceList);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const joinProjectRoom = (projectId) => {
    if (socket && user) {
      socket.emit('join-project', { projectId, user });
    }
  };

  return (
    <SocketContext.Provider value={{ socket, collaborators, joinProjectRoom }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

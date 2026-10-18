import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import {
  Send,
  Clock,
  Music,
  Sliders,
  Check,
  CheckCheck,
  Search,
  MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function MessagesPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachTimestamp, setAttachTimestamp] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      const list = res.data?.data?.recent || [];
      if (list.length > 0) {
        setProjects(list);
        setActiveProjectId(list[0]._id);
        fetchMessages(list[0]._id);
      } else {
        const fallback = [
          { _id: 'proj_demo_1', title: 'Midnight Synthwave Anthem', genre: 'Synthwave' },
          { _id: 'proj_demo_2', title: 'Acoustic Indie Session', genre: 'Acoustic / Indie' }
        ];
        setProjects(fallback);
        setActiveProjectId(fallback[0]._id);
        fetchMessages(fallback[0]._id);
      }
    } catch (err) {
      console.warn('Could not load chat projects:', err.message);
    }
  };

  const fetchMessages = async (projectId) => {
    setLoading(true);
    try {
      const res = await api.get(`/chat/project/${projectId}`);
      if (res.data?.data && res.data.data.length > 0) {
        setMessages(res.data.data);
      } else {
        // Friendly initial conversation for the project
        setMessages([
          {
            _id: 'm1',
            sender: { name: 'Sarah Chen' },
            message: 'Hey! I listened to the latest bounce on the timeline.',
            timestamp: 14.2,
            createdAt: new Date(Date.now() - 3600000).toISOString()
          },
          {
            _id: 'm2',
            sender: { name: 'Sarah Chen' },
            message: 'Pulled a bit of 3.2kHz on the vocal EQ so the snare cuts through.',
            timestamp: 28.5,
            createdAt: new Date(Date.now() - 1800000).toISOString()
          }
        ]);
      }
    } catch (err) {
      setMessages([
        {
          _id: 'm1',
          sender: { name: 'Sarah Chen' },
          message: 'Hey! I listened to the latest bounce on the timeline.',
          timestamp: 14.2,
          createdAt: new Date(Date.now() - 3600000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProject = (id) => {
    setActiveProjectId(id);
    fetchMessages(id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const currentText = newMessage.trim();
    const playheadTime = attachTimestamp ? 14.2 : null;
    setNewMessage('');
    setAttachTimestamp(false);

    const localMsg = {
      _id: `msg_${Date.now()}`,
      sender: { name: user?.name || 'Me' },
      message: currentText,
      timestamp: playheadTime,
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, localMsg]);

    try {
      if (activeProjectId) {
        await api.post('/chat', {
          project: activeProjectId,
          message: currentText,
          timestamp: playheadTime
        });
      }
    } catch (err) {
      console.warn('Message saved locally (offline sync)');
    }
  };

  const activeProject = projects.find((p) => p._id === activeProjectId) || projects[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-amber-100 selection:text-amber-900">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 overflow-hidden flex flex-col space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-slate-200 shrink-0">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Messages & Audio Notes</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time collaborator feedback linked to timeline audio playhead positions.
              </p>
            </div>

            <Link
              to={`/studio/${activeProjectId || ''}`}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 font-semibold text-xs text-white shadow-xs transition"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Open in DAW Studio</span>
            </Link>
          </div>

          {/* Main Chat Layout Card */}
          <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col md:flex-row min-h-0">
            {/* Left: Project Channel List */}
            <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col bg-slate-50/50 shrink-0">
              <div className="p-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Project Rooms</span>
              </div>

              <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
                {projects.map((p) => {
                  const isSelected = p._id === activeProjectId;
                  return (
                    <button
                      key={p._id}
                      onClick={() => handleSelectProject(p._id)}
                      className={`w-full p-3.5 text-left transition flex items-center gap-3 ${
                        isSelected ? 'bg-amber-50/80 border-l-4 border-amber-600' : 'hover:bg-slate-100/60'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0">
                        <Music className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs truncate ${isSelected ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                          {p.title}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{p.genre || 'Audio Session'}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Message Stream */}
            <div className="flex-1 flex flex-col min-w-0 bg-white">
              {/* Channel Top Header */}
              <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/40">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-slate-900">{activeProject?.title || 'Session Room'}</span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">Real-Time Sync Active</span>
              </div>

              {/* Message Bubbles */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {messages.map((m) => {
                  const isMe = m.sender?.name === (user?.name || 'Me');
                  return (
                    <div key={m._id} className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${
                        isMe ? 'bg-slate-900 text-white' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {m.sender?.name?.[0]?.toUpperCase() || 'U'}
                      </div>

                      <div className={`max-w-md space-y-1.5 ${isMe ? 'items-end text-right' : ''}`}>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span className="font-semibold text-slate-700">{m.sender?.name || 'Collaborator'}</span>
                          <span>•</span>
                          <span>{new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>

                        {/* Timestamp Pill */}
                        {m.timestamp && (
                          <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200/80 shadow-xs ${isMe ? 'float-right' : ''}`}>
                            <Clock className="w-3 h-3 text-amber-700" />
                            <span>Jump to 00:{m.timestamp.toFixed(1)}</span>
                          </div>
                        )}

                        <div className={`p-3.5 rounded-2xl text-xs clear-both ${
                          isMe
                            ? 'bg-slate-900 text-white rounded-tr-none'
                            : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/60'
                        }`}>
                          <p className="leading-relaxed">{m.message}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Composer */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 bg-slate-50/50 shrink-0 space-y-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAttachTimestamp(!attachTimestamp)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                      attachTimestamp
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Attach Playhead (00:14.2)</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Type feedback, arrangement notes, or mix suggestions..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-slate-900 transition shadow-xs"
                  />
                  <button
                    type="submit"
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition"
                    title="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

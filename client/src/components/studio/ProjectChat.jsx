import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentTime } from '../../store/studioSlice';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { MessageSquare, Send, Clock, X, Loader2 } from 'lucide-react';

export default function ProjectChat({ isOpen, onClose, projectId }) {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { socket } = useSocket();
  const { currentTime, activeProject } = useSelector((state) => state.studio);
  const currentProjectId = projectId || activeProject?._id;

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [attachTimestamp, setAttachTimestamp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (isOpen && currentProjectId) {
      fetchMessages();
    }
  }, [isOpen, currentProjectId]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    socket.on('new-message', handleNewMessage);
    return () => {
      socket.off('new-message', handleNewMessage);
    };
  }, [socket]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/chat/project/${currentProjectId}`);
      if (res.data?.data) {
        setMessages(res.data.data);
      }
    } catch (err) {
      console.warn('Could not load messages from server, using fallback:', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setSending(true);
    const audioTime = attachTimestamp ? currentTime : null;

    try {
      const res = await api.post('/chat', {
        projectId: currentProjectId,
        content: inputText,
        audioTimestamp: audioTime
      });

      if (res.data?.data) {
        const newMsg = res.data.data;
        setMessages((prev) => [...prev, newMsg]);
        if (socket) {
          socket.emit('send-message', { projectId: currentProjectId, message: newMsg });
        }
      }
      setInputText('');
      setAttachTimestamp(false);
    } catch (err) {
      console.warn('Fallback sending message locally:', err.message);
      const fallbackMsg = {
        _id: `msg_${Date.now()}`,
        sender: { name: user?.name || 'Producer', avatar: user?.avatar },
        content: inputText,
        audioTimestamp: audioTime,
        createdAt: new Date().toISOString()
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      setInputText('');
      setAttachTimestamp(false);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-84 bg-white border-l border-[#e6ded5] z-40 p-4 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-[#e6ded5] mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#2c2420] text-[#dcc5b2] flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-xs text-[#231f1d]">Notes & Comments</h3>
            <span className="text-[10px] text-[#736a64]">Timestamped audio feedback</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-[#8c827a] hover:text-[#231f1d] p-1 rounded-lg hover:bg-[#faf8f5] transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {loading && (
          <div className="p-6 text-center text-xs text-[#736a64] flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#2c2420]" />
            <span>Loading comments...</span>
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="p-6 text-center text-xs text-[#736a64] bg-[#faf8f5] rounded-xl border border-dashed border-[#e6ded5]">
            <p className="font-semibold text-[#231f1d]">No comments yet</p>
            <p className="mt-1">Add a note or pin feedback to an audio timestamp below.</p>
          </div>
        )}

        {messages.map((m) => (
          <div key={m._id || m.id} className="p-3 rounded-xl bg-[#faf8f5] border border-[#e6ded5] text-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={m.sender?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={m.sender?.name || 'User'}
                  className="w-5 h-5 rounded-full object-cover border border-[#e6ded5]"
                />
                <span className="font-bold text-[#231f1d]">{m.sender?.name || 'Collaborator'}</span>
              </div>
              <span className="text-[10px] text-[#8c827a]">
                {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
              </span>
            </div>

            <p className="text-[#443a34] leading-relaxed text-xs">{m.content}</p>

            {/* Audio Timestamp Marker Button */}
            {m.audioTimestamp !== null && m.audioTimestamp !== undefined && (
              <button
                type="button"
                onClick={() => dispatch(setCurrentTime(Number(m.audioTimestamp)))}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#2c2420] text-[#dcc5b2] text-[11px] font-mono hover:bg-[#3d332e] transition w-fit shadow-xs"
                title="Jump playhead to this position"
              >
                <Clock className="w-3 h-3 stroke-[2.5]" />
                <span>Jump to 00:{(Number(m.audioTimestamp) % 60).toFixed(1)}</span>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Message Input Box */}
      <form onSubmit={handleSendMessage} className="mt-3 pt-3 border-t border-[#e6ded5] space-y-2">
        <div className="flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => setAttachTimestamp(!attachTimestamp)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono transition ${
              attachTimestamp
                ? 'bg-[#2c2420] text-[#dcc5b2] font-bold shadow-xs'
                : 'bg-[#faf8f5] text-[#736a64] border border-[#e6ded5] hover:text-[#231f1d]'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>Pin at 00:{(currentTime % 60).toFixed(1)}</span>
          </button>
          <span className="text-[10px] text-[#8c827a]">Playhead marker</span>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Write audio feedback or comment..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full bg-[#faf8f5] border border-[#e6ded5] rounded-xl pl-3 pr-10 py-2.5 text-xs text-[#231f1d] placeholder-[#a89f97] focus:outline-none focus:border-[#2c2420]"
          />
          <button
            type="submit"
            disabled={sending || !inputText.trim()}
            className="absolute right-2 top-2 p-1.5 rounded-lg bg-[#2c2420] hover:bg-[#3d332e] text-[#dcc5b2] transition disabled:opacity-40"
          >
            {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          </button>
        </div>
      </form>
    </div>
  );
}

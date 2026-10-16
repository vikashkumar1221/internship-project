import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import {
  Mail,
  Send,
  Clock,
  Music,
  Sliders,
  Check,
  CheckCheck,
  Search,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MessagesPage() {
  const [activeThreadId, setActiveThreadId] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  const [attachTimestamp, setAttachTimestamp] = useState(false);

  const threads = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Topline Vocalist',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      lastMessage: 'Could you boost the high shelf EQ on the lead vocals?',
      time: '18:35',
      unread: 2,
      project: 'Midnight Synthwave Anthem'
    },
    {
      id: 2,
      name: 'Midnight Synthwave Studio Chat',
      role: 'Project Room',
      avatar: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=100',
      lastMessage: 'Alex uploaded Jupiter_8_Chords_Warm_Reverb.wav',
      time: '17:40',
      unread: 0,
      project: 'Midnight Synthwave Anthem'
    },
    {
      id: 3,
      name: 'Marcus Bell',
      role: 'Drum Programmer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      lastMessage: 'Check out the new 707 drum swing pattern.',
      time: 'Yesterday',
      unread: 0,
      project: 'Acoustic Indie Session'
    }
  ];

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Sarah Chen',
      isMe: false,
      text: 'Hey Alex! Just listened to the rough mix down on the studio timeline.',
      timestampAudio: null,
      time: '18:30'
    },
    {
      id: 2,
      sender: 'Sarah Chen',
      isMe: false,
      text: 'Could you boost the high shelf EQ on the lead vocals around this section? Sounds a bit dark with the Jupiter synth pad.',
      timestampAudio: '00:14.2',
      time: '18:32'
    },
    {
      id: 3,
      sender: 'Alex Rivera',
      isMe: true,
      text: 'Added +2.5dB at 4.2kHz and tightened the vocal compressor threshold.',
      timestampAudio: '00:16.0',
      time: '18:34'
    },
    {
      id: 4,
      sender: 'Sarah Chen',
      isMe: false,
      text: 'That sits so much better in the stereo field! Ready to finalize the master.',
      timestampAudio: null,
      time: '18:35'
    }
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      id: Date.now(),
      sender: 'Alex Rivera',
      isMe: true,
      text: newMessage,
      timestampAudio: attachTimestamp ? '00:24.0' : null,
      time: 'Just now'
    };

    setMessages([...messages, msg]);
    setNewMessage('');
    setAttachTimestamp(false);
  };

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col justify-between selection:bg-[#dcc5b2] selection:text-[#2c2420]">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 overflow-hidden flex flex-col space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-[#e6ded5] shrink-0">
            <div>
              <h1 className="text-2xl font-extrabold text-[#231f1d] tracking-tight">Messages & Feedback</h1>
              <p className="text-xs text-[#736a64] mt-0.5">
                Direct collaborator discussions and timestamped audio revision notes.
              </p>
            </div>

            <Link
              to="/studio"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2c2420] hover:bg-[#3d332e] font-semibold text-xs text-white shadow-xs transition"
            >
              <Sliders className="w-4 h-4" />
              <span>Open in DAW Studio</span>
            </Link>
          </div>

          {/* Chat Workstation Container */}
          <div className="flex-1 bg-white border border-[#e6ded5] rounded-2xl shadow-subtle flex overflow-hidden min-h-[500px]">
            {/* Left Thread List */}
            <div className="w-80 border-r border-[#e6ded5] flex flex-col bg-[#faf8f5]/60 shrink-0">
              <div className="p-3 border-b border-[#e6ded5]">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#8c827a] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full bg-white border border-[#e6ded5] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#231f1d] placeholder-[#a89f97] focus:outline-none focus:border-[#2c2420]"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-[#e6ded5]/70">
                {threads.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveThreadId(t.id)}
                    className={`w-full p-4 text-left transition flex items-start gap-3 ${
                      activeThreadId === t.id ? 'bg-white shadow-xs' : 'hover:bg-white/60'
                    }`}
                  >
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#e6ded5] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-bold text-xs text-[#231f1d] truncate">{t.name}</span>
                        <span className="text-[10px] text-[#8c827a] font-mono">{t.time}</span>
                      </div>
                      <p className="text-[11px] text-[#736a64] truncate">{t.lastMessage}</p>
                      <span className="text-[10px] text-[#8c827a] font-semibold mt-1 block">
                        Session: {t.project}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Chat Stream */}
            <div className="flex-1 flex flex-col justify-between bg-white overflow-hidden">
              {/* Thread Header */}
              <div className="p-4 border-b border-[#e6ded5] flex justify-between items-center bg-[#faf8f5]">
                <div className="flex items-center gap-3">
                  <img
                    src={activeThread.avatar}
                    alt={activeThread.name}
                    className="w-9 h-9 rounded-full object-cover border border-[#e6ded5]"
                  />
                  <div>
                    <span className="font-bold text-xs text-[#231f1d] block">{activeThread.name}</span>
                    <span className="text-[10px] text-[#736a64] font-medium">
                      {activeThread.role} • Project: <span className="text-[#2c2420] font-semibold">{activeThread.project}</span>
                    </span>
                  </div>
                </div>

                <Link
                  to="/studio"
                  className="px-3 py-1.5 rounded-lg border border-[#e6ded5] bg-white hover:bg-[#faf8f5] text-xs font-semibold text-[#2c2420] transition flex items-center gap-1.5"
                >
                  <Music className="w-3.5 h-3.5" />
                  <span>View Timeline</span>
                </Link>
              </div>

              {/* Messages Body */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#faf8f5]/30">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md rounded-2xl p-3.5 text-xs space-y-2 shadow-xs ${
                        m.isMe
                          ? 'bg-[#2c2420] text-white rounded-br-xs'
                          : 'bg-white border border-[#e6ded5] text-[#231f1d] rounded-bl-xs'
                      }`}
                    >
                      <div className="flex justify-between items-center gap-4 text-[10px] opacity-75 mb-1 font-mono">
                        <span className="font-bold">{m.sender}</span>
                        <span>{m.time}</span>
                      </div>

                      <p className="leading-relaxed">{m.text}</p>

                      {/* Timestamp audio marker jump pill */}
                      {m.timestampAudio && (
                        <Link
                          to="/studio"
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition shadow-xs ${
                            m.isMe
                              ? 'bg-[#dcc5b2] text-[#2c2420] hover:bg-[#e4ceb7]'
                              : 'bg-[#2c2420] text-[#dcc5b2] hover:bg-[#3d332e]'
                          }`}
                        >
                          <Clock className="w-3 h-3 stroke-[2.5]" />
                          <span>Jump to playhead {m.timestampAudio}</span>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Composer */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-[#e6ded5] bg-white space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setAttachTimestamp(!attachTimestamp)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition ${
                      attachTimestamp
                        ? 'bg-[#2c2420] text-[#dcc5b2] font-bold shadow-xs'
                        : 'bg-[#faf8f5] text-[#736a64] border border-[#e6ded5] hover:text-[#231f1d]'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Attach Playhead Timestamp (00:24.0)</span>
                  </button>
                  <span className="text-[11px] text-[#8c827a]">Direct project sync</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a message or audio feedback note..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 bg-[#faf8f5] border border-[#e6ded5] rounded-xl px-3.5 py-2.5 text-xs text-[#231f1d] placeholder-[#a89f97] focus:outline-none focus:border-[#2c2420]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#2c2420] hover:bg-[#3d332e] text-[#dcc5b2] font-bold text-xs shadow-xs transition flex items-center gap-1.5"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
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

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentTime } from '../../store/studioSlice';
import { MessageSquare, Send, Clock, X, Paperclip, Smile } from 'lucide-react';

export default function ProjectChat({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { currentTime } = useSelector((state) => state.studio);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: { name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
      content: 'Hey Alex! Could you boost the high EQ on the lead vocals around bar 8?',
      audioTimestamp: 12.4,
      time: '18:32'
    },
    {
      id: 2,
      sender: { name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
      content: 'Sure thing! Just added +2dB high shelf and compressed the vocal transient.',
      audioTimestamp: null,
      time: '18:35'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [attachTimestamp, setAttachTimestamp] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: { name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
      content: inputText,
      audioTimestamp: attachTimestamp ? currentTime : null,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMsg]);
    setInputText('');
    setAttachTimestamp(false);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-studio-dark/95 border-l border-studio-border z-40 p-4 flex flex-col shadow-2xl animate-in slide-in-from-right">
      <div className="flex justify-between items-center pb-3 border-b border-studio-border mb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-indigo-400" />
          <h3 className="font-bold text-xs text-gray-200">Studio Chat & Timeline Notes</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.map((m) => (
          <div key={m.id} className="p-3 rounded-xl bg-studio-card/80 border border-studio-border text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={m.sender.avatar} alt={m.sender.name} className="w-5 h-5 rounded-full object-cover" />
                <span className="font-bold text-gray-200">{m.sender.name}</span>
              </div>
              <span className="text-[9px] text-gray-500">{m.time}</span>
            </div>

            <p className="text-gray-300 leading-relaxed">{m.content}</p>

            {/* Audio Timestamp Marker Button */}
            {m.audioTimestamp !== null && (
              <button
                onClick={() => dispatch(setCurrentTime(m.audioTimestamp))}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono hover:bg-indigo-500/30 transition w-fit"
              >
                <Clock className="w-3 h-3 text-indigo-400" />
                Jump to 00:{(m.audioTimestamp % 60).toFixed(1)}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Message Input Box */}
      <form onSubmit={handleSendMessage} className="mt-3 pt-3 border-t border-studio-border space-y-2">
        <div className="flex items-center gap-2 text-[10px]">
          <button
            type="button"
            onClick={() => setAttachTimestamp(!attachTimestamp)}
            className={`flex items-center gap-1 px-2 py-1 rounded transition ${
              attachTimestamp ? 'bg-indigo-600 text-white' : 'bg-studio-panel text-gray-400 hover:text-gray-200'
            }`}
          >
            <Clock className="w-3 h-3" /> Attach Time (00:{currentTime.toFixed(1)})
          </button>
        </div>

        <div className="flex items-center gap-2 bg-studio-card border border-studio-border rounded-xl px-3 py-1.5">
          <input
            type="text"
            placeholder="Type comment or feedback..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-transparent text-xs text-gray-200 focus:outline-none placeholder-gray-500"
          />
          <button type="submit" className="text-indigo-400 hover:text-indigo-300 transition">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

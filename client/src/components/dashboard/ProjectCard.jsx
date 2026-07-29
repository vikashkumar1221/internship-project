import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Users, Clock, Music, Tag } from 'lucide-react';

export default function ProjectCard({ project }) {
  return (
    <div className="bg-studio-card/80 border border-studio-border hover:border-indigo-500/50 rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 group flex flex-col justify-between">
      <div>
        {/* Cover Image Header */}
        <div className="h-36 rounded-xl overflow-hidden relative mb-3 bg-studio-panel">
          <img
            src={project.coverImage || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600'}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-studio-card via-transparent to-transparent opacity-80" />

          {/* Quick Play Studio Button */}
          <Link
            to={`/studio`}
            className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/50 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110"
          >
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </Link>

          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold uppercase text-indigo-300 border border-white/10">
            {project.genre || 'Electronic'}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="font-bold text-sm text-gray-100 group-hover:text-indigo-300 transition truncate">
          {project.title}
        </h3>
        <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
          {project.description || 'No description provided.'}
        </p>
      </div>

      {/* Footer Details (BPM, Key, Collaborators) */}
      <div className="pt-3 border-t border-studio-border/60 mt-3 flex justify-between items-center text-[11px] text-gray-400">
        <div className="flex items-center gap-2 font-mono">
          <span className="text-emerald-400 font-bold">{project.tempo || 120} BPM</span>
          <span>•</span>
          <span className="text-pink-400 font-bold">{project.keySignature || 'C Major'}</span>
        </div>

        <div className="flex items-center -space-x-1.5">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
            alt="Owner"
            className="w-5 h-5 rounded-full ring-1 ring-studio-dark"
          />
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
            alt="Collaborator"
            className="w-5 h-5 rounded-full ring-1 ring-studio-dark"
          />
        </div>
      </div>
    </div>
  );
}

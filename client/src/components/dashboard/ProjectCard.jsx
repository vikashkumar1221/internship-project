import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Trash2, ArrowRight } from 'lucide-react';

export default function ProjectCard({ project, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-4 transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between group">
      <div>
        {/* Cover Thumbnail */}
        <div
          onClick={() => navigate(`/studio/${project._id}`)}
          className="block h-36 rounded-xl overflow-hidden relative mb-3 bg-slate-100 border border-slate-200/60 cursor-pointer"
        >
          <img
            src={project.coverImage || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600'}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

          {/* Quick Open Studio Button */}
          <div
            className="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-lg bg-white/95 hover:bg-white text-slate-900 text-xs font-bold flex items-center gap-1.5 shadow-md transition-transform transform group-hover:scale-105"
            title="Open in DAW Studio"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Open Studio</span>
          </div>

          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold uppercase tracking-wider shadow-xs">
            {project.genre || 'Electronic'}
          </span>
        </div>

        {/* Title & Description */}
        <div className="flex justify-between items-start gap-2">
          <Link to={`/studio/${project._id}`} className="flex-1">
            <h3 className="font-bold text-sm text-slate-900 group-hover:text-amber-800 transition truncate">
              {project.title}
            </h3>
          </Link>
          {onDelete && (
            <button
              onClick={() => onDelete(project._id)}
              className="text-slate-400 hover:text-red-600 transition p-1 rounded-md opacity-0 group-hover:opacity-100"
              title="Delete project"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
          {project.description || 'Collaborative DAW project session.'}
        </p>
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-slate-100 mt-3 flex justify-between items-center text-xs text-slate-500">
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <span className="font-bold text-slate-800">{project.tempo || 120} BPM</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-600">{project.keySignature || 'F Minor'}</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/project/${project._id}`}
            className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 transition flex items-center gap-0.5"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

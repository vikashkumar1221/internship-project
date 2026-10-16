import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FolderKanban,
  Sliders,
  Users,
  MessageSquare,
  HardDrive
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();

  const navItems = [
    { name: 'Projects', path: '/dashboard', icon: FolderKanban },
    { name: 'Studio DAW', path: '/studio', icon: Sliders },
    { name: 'Collaborators', path: '/collaborators', icon: Users },
    { name: 'Activity & Notes', path: '/activity', icon: MessageSquare },
  ];

  return (
    <aside className="w-56 border-r border-studio-border bg-studio-bg flex flex-col justify-between py-5 px-3 z-30 shrink-0">
      <div className="space-y-6">
        <div>
          <p className="text-[11px] font-bold text-studio-muted uppercase tracking-wider px-3 mb-2">
            Workspace
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition ${
                    isActive
                      ? 'bg-studio-header text-white font-semibold shadow-xs'
                      : 'text-studio-text hover:text-studio-header hover:bg-studio-section font-medium'
                  }`
                }
              >
                <item.icon className="w-4 h-4 opacity-80" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Cloud Storage Usage */}
      <div className="px-2">
        <div className="p-3 rounded-xl bg-studio-section border border-studio-border text-xs">
          <div className="flex justify-between items-center text-studio-text mb-1.5 font-medium">
            <span className="flex items-center gap-1.5 text-[11px]">
              <HardDrive className="w-3.5 h-3.5 text-studio-muted" /> Cloud Stems
            </span>
            <span className="text-[11px] font-semibold text-studio-muted">2.4 / 10 GB</span>
          </div>
          <div className="w-full h-1.5 bg-studio-border rounded-full overflow-hidden">
            <div className="w-1/4 h-full bg-studio-header rounded-full" />
          </div>
          <p className="text-[10px] text-studio-muted mt-2">
            Audio stems & multi-track sync
          </p>
        </div>
      </div>
    </aside>
  );
}

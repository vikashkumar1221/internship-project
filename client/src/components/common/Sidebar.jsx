import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Music,
  Home,
  Folder,
  Compass,
  Users,
  Mail,
  Library,
  BarChart2,
  User,
  Settings,
  Plus
} from 'lucide-react';

export default function Sidebar({ onOpenNewProject }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home, exact: true },
    { name: 'Projects', path: '/projects', icon: Folder, match: ['/projects', '/project', '/studio'] },
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'Collaborators', path: '/collaborators', icon: Users },
    { name: 'Messages', path: '/messages', icon: Mail, match: ['/messages', '/activity', '/notifications'] },
    { name: 'My Library', path: '/library', icon: Library },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

  const handleCreateProject = () => {
    if (onOpenNewProject) {
      onOpenNewProject();
    } else {
      navigate('/projects');
    }
  };

  return (
    <aside className="w-64 lg:w-72 bg-white border-r border-slate-200 flex flex-col justify-between py-6 px-4 z-30 shrink-0 select-none min-h-[calc(100vh-64px)] h-full overflow-y-auto">
      <div>
        {/* Logo */}
        <div className="px-3 pb-6 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-500/20 flex items-center justify-center shadow-xs">
            <Music className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900 block leading-tight">
              StudioCollab
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
              Music Studio
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const targetPath = item.fallback || item.path;
            const isActive = item.exact
              ? location.pathname === item.path
              : item.match
                ? item.match.some((m) => location.pathname.startsWith(m))
                : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.name}
                to={targetPath}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition text-left group ${
                  isActive
                    ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200/80 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive
                      ? 'text-amber-700 stroke-[2.4]'
                      : 'text-slate-400 group-hover:text-slate-700 stroke-[2]'
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Button: + Create Project */}
      <div className="pt-4 border-t border-slate-100 mt-4">
        <button
          onClick={handleCreateProject}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Project</span>
        </button>
      </div>
    </aside>
  );
}

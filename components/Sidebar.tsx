import React from 'react';
import { 
  Zap, Plus, Search, Home, Inbox, FileText, PieChart, 
  Target, Shapes, LogOut, Layout, Box
} from 'lucide-react';
import { ViewType, Workspace } from '../types';

interface SidebarProps {
  currentView: ViewType;
  onChangeView: (view: ViewType) => void;
  workspaces: Workspace[];
  onCreateTask: () => void;
  onSearch: (query: string) => void;
  onCreateWorkspace: () => void;
  tasksCount: number;
  user: string;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onChangeView, 
  workspaces, 
  onCreateTask,
  onSearch,
  onCreateWorkspace,
  tasksCount,
  user,
  onLogout
}) => {
  return (
    <aside className="w-64 bg-gradient-to-b from-indigo-950 to-purple-950 text-white flex flex-col flex-shrink-0 transition-all duration-300 h-full border-r border-indigo-900/50">
      {/* Logo */}
      <div className="p-4 border-b border-indigo-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-900/50">
            <Zap className="text-white fill-current" size={20} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">TaskFlow</h1>
            <p className="text-xs text-indigo-300">Project Management</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-3">
        <button 
          onClick={onCreateTask}
          className="w-full bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md shadow-violet-900/30 group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform" /> 
          <span className="font-medium">New Task</span>
        </button>
      </div>

      {/* Search */}
      <div className="px-3 mb-2">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-violet-400 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search everything..." 
            className="w-full bg-indigo-900/40 border border-indigo-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-indigo-900/60 transition-all placeholder-indigo-400/70"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-2 py-2 space-y-6">
        <div>
          <div className="px-3 py-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">Main</div>
          <div className="space-y-1">
            <NavItem 
              active={currentView === 'home'} 
              icon={<Home size={18} />} 
              label="Home" 
              onClick={() => onChangeView('home')} 
            />
            <NavItem 
              active={currentView === 'inbox'} 
              icon={<Inbox size={18} />} 
              label="Inbox" 
              onClick={() => onChangeView('inbox')}
              badge={3}
            />
            <NavItem 
              active={currentView === 'docs'} 
              icon={<FileText size={18} />} 
              label="Docs" 
              onClick={() => onChangeView('docs')} 
            />
            <NavItem 
              active={currentView === 'dashboards'} 
              icon={<PieChart size={18} />} 
              label="Dashboards" 
              onClick={() => onChangeView('dashboards')} 
            />
            <NavItem 
              active={currentView === 'goals'} 
              icon={<Target size={18} />} 
              label="Goals" 
              onClick={() => onChangeView('goals')} 
            />
            <NavItem 
              active={currentView === 'whiteboards'} 
              icon={<Shapes size={18} />} 
              label="Whiteboards" 
              onClick={() => onChangeView('whiteboards')} 
            />
          </div>
        </div>

        {/* Workspaces */}
        <div>
          <div className="px-3 py-2 text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center justify-between group">
            <span>Workspaces</span>
            <button onClick={onCreateWorkspace} className="opacity-0 group-hover:opacity-100 hover:text-white transition-opacity">
              <Plus size={14} />
            </button>
          </div>
          <div className="space-y-1">
            {workspaces.map(ws => (
              <div key={ws.id} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors text-indigo-100 group">
                <span className="text-lg">{ws.icon}</span>
                <span className="flex-1 truncate text-sm">{ws.name}</span>
                <span className="text-xs text-indigo-400 bg-indigo-900/50 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {Math.floor(Math.random() * 10) + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* User Section */}
      <div className="p-3 border-t border-indigo-800">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors group">
          <div className="w-9 h-9 bg-gradient-to-br from-pink-500 to-orange-400 rounded-full flex items-center justify-center font-bold text-white shadow-sm text-sm uppercase">
            {user.substring(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">{user}</div>
            <div className="text-xs text-indigo-300">Admin</div>
          </div>
          <button 
            onClick={onLogout}
            className="text-indigo-400 hover:text-red-400 transition-colors p-1.5 rounded-md hover:bg-white/5"
            title="Log out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

const NavItem = ({ active, icon, label, onClick, badge }: { active: boolean, icon: React.ReactNode, label: string, onClick: () => void, badge?: number }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
      active 
        ? 'bg-violet-600 text-white shadow-md shadow-violet-900/30' 
        : 'text-indigo-100 hover:bg-white/10'
    }`}
  >
    <span className={active ? 'text-white' : 'text-indigo-300 group-hover:text-white transition-colors'}>
      {icon}
    </span>
    {label}
    {badge && (
      <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
        {badge}
      </span>
    )}
  </button>
);

export default Sidebar;
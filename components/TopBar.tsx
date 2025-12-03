
import React from 'react';
import { 
  Menu, List, Kanban, Calendar, Activity, Table, 
  Filter, Moon, Sun, Bell, Clock, StopCircle, Cloud, RefreshCw
} from 'lucide-react';
import { TaskViewType, TimerState, FilterState } from '../types';

interface TopBarProps {
  currentTaskView: TaskViewType;
  onChangeTaskView: (view: TaskViewType) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  timer: TimerState;
  onStopTimer: () => void;
  onToggleSidebar: () => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  // Drive Props
  isDriveReady: boolean;
  isDriveConnected: boolean;
  onConnectDrive: () => void;
  onSyncDrive: () => void;
  isSyncing: boolean;
}

const TopBar: React.FC<TopBarProps> = ({
  currentTaskView,
  onChangeTaskView,
  isDark,
  onToggleTheme,
  timer,
  onStopTimer,
  onToggleSidebar,
  showFilters,
  onToggleFilters,
  isDriveReady,
  isDriveConnected,
  onConnectDrive,
  onSyncDrive,
  isSyncing
}) => {
  
  const formatTimer = (elapsed: number) => {
    const h = Math.floor(elapsed / 3600).toString().padStart(2, '0');
    const m = Math.floor((elapsed % 3600) / 60).toString().padStart(2, '0');
    const s = (elapsed % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <header className="bg-bg-card border-b border-[var(--border)] dark:border-gray-800 px-6 py-3 flex items-center justify-between sticky top-0 z-20 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button onClick={onToggleSidebar} className="lg:hidden text-gray-500 hover:text-primary transition-colors">
          <Menu size={24} />
        </button>
        <div className="hidden sm:flex items-center gap-2 text-sm">
          <span className="text-gray-500">Workspace</span>
          <span className="text-gray-400 text-xs">/</span>
          <span className="text-gray-900 dark:text-white font-medium">All Tasks</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Drive Integration */}
        {isDriveReady && (
          <div className="flex items-center">
            {!isDriveConnected ? (
              <button 
                onClick={onConnectDrive}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-600/20 rounded-lg text-sm hover:bg-blue-600/20 transition-colors"
                title="Save data to Google Drive"
              >
                <Cloud size={16} />
                <span className="hidden md:inline">Connect Drive</span>
              </button>
            ) : (
              <button 
                onClick={onSyncDrive}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors border ${
                  isSyncing 
                    ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' 
                    : 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 hover:bg-green-500/20'
                }`}
                title={isSyncing ? "Syncing..." : "Synced with Google Drive"}
                disabled={isSyncing}
              >
                <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} />
                <span className="hidden md:inline">{isSyncing ? "Syncing..." : "Synced"}</span>
              </button>
            )}
          </div>
        )}

        {/* View Switcher */}
        <div className="hidden lg:flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <ViewBtn active={currentTaskView === 'list'} icon={<List size={16} />} onClick={() => onChangeTaskView('list')} />
          <ViewBtn active={currentTaskView === 'kanban'} icon={<Kanban size={16} />} onClick={() => onChangeTaskView('kanban')} />
          <ViewBtn active={currentTaskView === 'calendar'} icon={<Calendar size={16} />} onClick={() => onChangeTaskView('calendar')} />
          <ViewBtn active={currentTaskView === 'gantt'} icon={<Activity size={16} />} onClick={() => onChangeTaskView('gantt')} />
          <ViewBtn active={currentTaskView === 'table'} icon={<Table size={16} />} onClick={() => onChangeTaskView('table')} />
        </div>

        {/* Filter */}
        <button 
          onClick={onToggleFilters}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
            showFilters ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          <Filter size={16} />
          <span className="hidden md:inline">Filter</span>
        </button>

        {/* Timer */}
        {timer.running && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg border border-green-500/20">
            <Clock size={16} />
            <span className="font-mono font-medium">{formatTimer(timer.elapsed)}</span>
            <button onClick={onStopTimer} className="ml-1 hover:text-green-700 dark:hover:text-green-300">
              <StopCircle size={16} />
            </button>
          </div>
        )}

        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

        {/* Theme */}
        <button onClick={onToggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors">
          {isDark ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
        </button>
      </div>
    </header>
  );
};

const ViewBtn = ({ active, icon, onClick }: { active: boolean, icon: React.ReactNode, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`p-1.5 rounded-md transition-all ${
      active 
        ? 'bg-white dark:bg-gray-600 text-primary dark:text-white shadow-sm' 
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
    }`}
  >
    {icon}
  </button>
);

export default TopBar;

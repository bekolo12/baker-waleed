import React from 'react';
import { Task } from '../types';
import { Check, Calendar, User, Clock, Play, Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onOpen: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
  onStartTimer: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onOpen, onToggleStatus, onDelete, onStartTimer }) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
  const priorityColors = {
    urgent: 'border-l-4 border-l-red-500',
    high: 'border-l-4 border-l-orange-500',
    normal: 'border-l-4 border-l-blue-500',
    low: 'border-l-4 border-l-gray-500'
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div 
      onClick={onOpen}
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:shadow-md hover:translate-y-[-2px] transition-all group ${priorityColors[task.priority]}`}
    >
      <div className="flex items-start gap-4">
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleStatus(); }}
          className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            task.status === 'done' 
              ? 'bg-green-500 border-green-500' 
              : 'border-gray-400 hover:border-primary'
          }`}
        >
          {task.status === 'done' && <Check size={12} className="text-white" />}
        </button>
        
        <div className="flex-1 min-w-0">
          <h4 className={`font-medium text-gray-900 dark:text-gray-100 truncate ${task.status === 'done' ? 'line-through text-gray-500' : ''}`}>
            {task.title}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
            {task.description || 'No description provided'}
          </p>
          
          <div className="flex items-center gap-3 mt-3 flex-wrap text-xs text-gray-500 dark:text-gray-400">
            <span className={`px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 font-medium ${
              task.status === 'done' ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'
            }`}>
              {task.status.replace('-', ' ')}
            </span>
            
            {task.dueDate && (
              <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-500' : ''}`}>
                <Calendar size={12} />
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
            
            {task.assignee && (
              <span className="flex items-center gap-1 capitalize">
                <User size={12} />
                {task.assignee}
              </span>
            )}

            {task.timeTracked > 0 && (
              <span className="flex items-center gap-1 text-primary">
                <Clock size={12} />
                {formatTime(task.timeTracked)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.stopPropagation(); onStartTimer(); }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 hover:text-green-500 transition-colors"
            title="Start Timer"
          >
            <Play size={16} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-500 hover:text-red-500 transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
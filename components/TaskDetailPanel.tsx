import React, { useState } from 'react';
import { Task, Status, Priority } from '../types';
import { X, Play, Clock, Calendar, User, Tag, Send } from 'lucide-react';

interface TaskDetailPanelProps {
  task: Task | null;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onAddComment: (id: string, text: string) => void;
}

const TaskDetailPanel: React.FC<TaskDetailPanelProps> = ({ task, onClose, onUpdate, onAddComment }) => {
  const [commentText, setCommentText] = useState('');

  if (!task) return null;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(task.id, commentText);
      setCommentText('');
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <aside className="w-96 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex-shrink-0 flex flex-col h-full shadow-2xl animate-in slide-in-from-right duration-300 z-30">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-900">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Task Details</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
          <input 
            type="text" 
            value={task.title}
            onChange={(e) => onUpdate(task.id, { title: e.target.value })}
            className="w-full bg-transparent text-xl font-bold mb-2 border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-primary focus:outline-none transition-colors"
          />
          <textarea 
            value={task.description || ''}
            onChange={(e) => onUpdate(task.id, { description: e.target.value })}
            placeholder="Add a description..."
            className="w-full bg-transparent text-gray-600 dark:text-gray-400 text-sm resize-none focus:outline-none min-h-[60px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Status</label>
            <select 
              value={task.status}
              onChange={(e) => onUpdate(task.id, { status: e.target.value as Status })}
              className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Priority</label>
            <select 
              value={task.priority}
              onChange={(e) => onUpdate(task.id, { priority: e.target.value as Priority })}
              className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <User size={14} /> Assignee
            </label>
            <select 
              value={task.assignee || ''}
              onChange={(e) => onUpdate(task.id, { assignee: e.target.value })}
              className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Unassigned</option>
              <option value="john">John Doe</option>
              <option value="jane">Jane Smith</option>
              <option value="bob">Bob Wilson</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Calendar size={14} /> Due Date
            </label>
            <input 
              type="date" 
              value={task.dueDate || ''}
              onChange={(e) => onUpdate(task.id, { dueDate: e.target.value })}
              className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Clock size={16} className="text-primary" /> Time Tracking
            </h4>
            <span className="font-mono font-bold text-lg">{formatTime(task.timeTracked)}</span>
          </div>
          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
            <Play size={16} /> Start Timer
          </button>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
          <h4 className="font-medium text-sm mb-3">Comments</h4>
          <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
            {task.comments.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No comments yet.</p>
            ) : (
              task.comments.map((comment, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-primary">John Doe</span>
                    <span className="text-[10px] text-gray-500">{new Date(comment.time).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
                </div>
              ))
            )}
          </div>
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input 
              type="text" 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            />
            <button type="submit" className="bg-primary hover:bg-primary-dark text-white p-2 rounded-lg transition-colors">
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
};

export default TaskDetailPanel;
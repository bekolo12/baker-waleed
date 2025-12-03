import React from 'react';
import { Task, TaskViewType, Priority, Status, FilterState } from '../../types';
import TaskCard from '../TaskCard';
import { MoreHorizontal, Calendar as CalendarIcon, Clock, Plus } from 'lucide-react';

interface TaskViewProps {
  viewType: TaskViewType;
  tasks: Task[];
  filters: FilterState;
  onOpenTask: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onStartTimer: (id: string) => void;
  onUpdateTaskStatus: (id: string, status: Status) => void;
  onCreateTask: (status?: Status) => void;
}

const TaskView: React.FC<TaskViewProps> = ({
  viewType,
  tasks,
  filters,
  onOpenTask,
  onToggleStatus,
  onDeleteTask,
  onStartTimer,
  onUpdateTaskStatus,
  onCreateTask
}) => {
  // Apply filters
  const filteredTasks = tasks.filter(t => {
    if (filters.status && t.status !== filters.status) return false;
    if (filters.priority && t.priority !== filters.priority) return false;
    if (filters.assignee && t.assignee !== filters.assignee) return false;
    if (filters.dueDate && t.dueDate !== filters.dueDate) return false;
    return true;
  });

  const statuses: Status[] = ['todo', 'in-progress', 'review', 'done'];
  const statusLabels: Record<Status, string> = {
    'todo': 'To Do',
    'in-progress': 'In Progress',
    'review': 'Review',
    'done': 'Done'
  };
  const statusColors: Record<Status, string> = {
    'todo': 'bg-gray-500',
    'in-progress': 'bg-blue-500',
    'review': 'bg-yellow-500',
    'done': 'bg-green-500'
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: Status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onUpdateTaskStatus(taskId, status);
    }
  };

  if (viewType === 'list') {
    return (
      <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex justify-between items-center mb-4">
           <h2 className="text-xl font-bold text-gray-900 dark:text-white">All Tasks</h2>
           <button onClick={() => onCreateTask()} className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
              <Plus size={16} /> Add Task
           </button>
        </div>
        {filteredTasks.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No tasks found.</div>
        ) : (
          filteredTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onOpen={() => onOpenTask(task.id)}
              onToggleStatus={() => onToggleStatus(task.id)}
              onDelete={() => onDeleteTask(task.id)}
              onStartTimer={() => onStartTimer(task.id)}
            />
          ))
        )}
      </div>
    );
  }

  if (viewType === 'kanban') {
    return (
      <div className="flex gap-6 overflow-x-auto pb-6 h-full min-h-[calc(100vh-200px)]">
        {statuses.map(status => (
          <div 
            key={status} 
            className="flex-shrink-0 w-80 flex flex-col bg-gray-100/50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700/50"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
          >
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-inherit rounded-t-xl z-10 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${statusColors[status]}`}></span>
                <span className="font-semibold text-gray-700 dark:text-gray-200">{statusLabels[status]}</span>
                <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full font-medium">
                  {filteredTasks.filter(t => t.status === status).length}
                </span>
              </div>
              <button onClick={() => onCreateTask(status)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <Plus size={18} />
              </button>
            </div>
            <div className="p-3 space-y-3 flex-1 overflow-y-auto scrollbar-thin">
              {filteredTasks.filter(t => t.status === status).map(task => (
                <div 
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  onClick={() => onOpenTask(task.id)}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-primary/50 transition-all cursor-move group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium uppercase tracking-wide ${
                      task.priority === 'urgent' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                      task.priority === 'high' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
                      'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {task.priority}
                    </span>
                    <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{task.title}</h4>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                       {task.dueDate && (
                         <span className={`flex items-center gap-1 ${new Date(task.dueDate) < new Date() ? 'text-red-500' : ''}`}>
                           <CalendarIcon size={12} />
                           {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                         </span>
                       )}
                    </div>
                    {task.assignee && (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold">
                        {task.assignee.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (viewType === 'table') {
    return (
       <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-left text-sm">
             <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                <tr>
                   <th className="p-4 font-medium">Task Name</th>
                   <th className="p-4 font-medium">Status</th>
                   <th className="p-4 font-medium">Priority</th>
                   <th className="p-4 font-medium">Assignee</th>
                   <th className="p-4 font-medium">Due Date</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTasks.map(task => (
                   <tr key={task.id} onClick={() => onOpenTask(task.id)} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors">
                      <td className="p-4 font-medium text-gray-900 dark:text-gray-100">{task.title}</td>
                      <td className="p-4">
                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            task.status === 'done' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            task.status === 'in-progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                         }`}>
                            {statusLabels[task.status]}
                         </span>
                      </td>
                      <td className="p-4 capitalize text-gray-600 dark:text-gray-300">{task.priority}</td>
                      <td className="p-4 text-gray-600 dark:text-gray-300">{task.assignee || '-'}</td>
                      <td className="p-4 text-gray-600 dark:text-gray-300">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    );
  }

  if (viewType === 'calendar' || viewType === 'gantt') {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
         <div className="p-4 bg-primary/10 rounded-full mb-4">
            {viewType === 'calendar' ? <CalendarIcon size={32} className="text-primary" /> : <Clock size={32} className="text-primary" />}
         </div>
         <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 capitalize">{viewType} View</h3>
         <p className="text-gray-500 text-center max-w-md px-4">
            This is a simplified demo. The {viewType} view would typically render a complex D3 or HTML grid visualization here based on task dates.
         </p>
      </div>
    );
  }

  return null;
};

export default TaskView;
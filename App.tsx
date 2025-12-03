import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import HomeView from './components/views/HomeView';
import TaskView from './components/views/TaskView';
import TaskDetailPanel from './components/TaskDetailPanel';
import TaskModal from './components/TaskModal';
import LoginView from './components/LoginView';
import { 
  ViewType, TaskViewType, Task, Workspace, Activity, 
  TimerState, Status, FilterState, Goal, Doc, Whiteboard
} from './types';
import { 
  INITIAL_TASKS, INITIAL_WORKSPACES, INITIAL_ACTIVITIES,
  INITIAL_GOALS, INITIAL_DOCS, INITIAL_WHITEBOARDS 
} from './constants';
import { Inbox, FileText, Target, Shapes, PieChart } from 'lucide-react';

const App: React.FC = () => {
  // Authentication State
  const [user, setUser] = useState<string | null>(() => {
    return localStorage.getItem('taskflow_user');
  });

  // Global State with Persistence
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('taskflow_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });
  
  const [workspaces, setWorkspaces] = useState<Workspace[]>(() => {
    const saved = localStorage.getItem('taskflow_workspaces');
    return saved ? JSON.parse(saved) : INITIAL_WORKSPACES;
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('taskflow_activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });
  
  // UI State
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [currentTaskView, setCurrentTaskView] = useState<TaskViewType>('list');
  const [isDark, setIsDark] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState<Status>('todo');
  const [filters, setFilters] = useState<FilterState>({ status: '', priority: '', assignee: '', dueDate: '' });
  const [showFilters, setShowFilters] = useState(false);
  
  // Timer State
  const [timer, setTimer] = useState<TimerState>({ running: false, taskId: null, startTime: null, elapsed: 0 });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('taskflow_workspaces', JSON.stringify(workspaces));
  }, [workspaces]);

  useEffect(() => {
    localStorage.setItem('taskflow_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('taskflow_user', user);
    } else {
      localStorage.removeItem('taskflow_user');
    }
  }, [user]);

  // Initial Theme Setup
  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  // Timer Effect
  useEffect(() => {
    let interval: number;
    if (timer.running) {
      interval = window.setInterval(() => {
        setTimer(prev => ({ ...prev, elapsed: Math.floor((Date.now() - (prev.startTime || 0)) / 1000) }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer.running]);

  // Handlers
  const handleLogin = (username: string) => {
    setUser(username);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleCreateTask = (status: Status = 'todo') => {
    setNewTaskStatus(status);
    setIsTaskModalOpen(true);
  };

  const handleSubmitTask = (newTaskData: any) => {
    const newTask: Task = {
      ...newTaskData,
      id: `t${Date.now()}`,
      workspace: 'ws1', // Default to first workspace for demo
      createdAt: Date.now()
    };
    setTasks([newTask, ...tasks]);
    addActivity('task_created', newTask.title);
  };

  const addActivity = (type: Activity['type'], taskTitle: string, from?: string, to?: string) => {
    const newActivity: Activity = {
      id: `a${Date.now()}`,
      type,
      user: user || 'Unknown',
      task: taskTitle,
      from,
      to,
      time: Date.now()
    };
    setActivities([newActivity, ...activities]);
  };

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        if (updates.status && updates.status !== t.status) {
          addActivity('status_changed', t.title, t.status, updates.status);
        }
        return { ...t, ...updates };
      }
      return t;
    }));
  };

  const handleAddComment = (id: string, text: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return { 
          ...t, 
          comments: [...t.comments, { text, time: Date.now() }] 
        };
      }
      return t;
    }));
    const task = tasks.find(t => t.id === id);
    if (task) addActivity('comment_added', task.title);
  };

  const handleDeleteTask = (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setTasks(prev => prev.filter(t => t.id !== id));
      if (selectedTaskId === id) setSelectedTaskId(null);
    }
  };

  const handleStartTimer = (id: string) => {
    if (timer.running && timer.taskId) {
      handleStopTimer();
    }
    setTimer({ running: true, taskId: id, startTime: Date.now(), elapsed: 0 });
  };

  const handleStopTimer = () => {
    if (timer.taskId) {
      handleUpdateTask(timer.taskId, { 
        timeTracked: (tasks.find(t => t.id === timer.taskId)?.timeTracked || 0) + timer.elapsed 
      });
    }
    setTimer({ running: false, taskId: null, startTime: null, elapsed: 0 });
  };

  const PlaceholderView = ({ title, icon: Icon }: any) => (
    <div className="flex flex-col items-center justify-center h-full text-gray-500">
      <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
        <Icon size={48} className="text-primary opacity-50" />
      </div>
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h2>
      <p className="max-w-md text-center">This module is not implemented in this demo version.</p>
    </div>
  );

  if (!user) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-bg-main text-gray-900 dark:text-gray-100 font-sans">
      <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block h-full shadow-xl z-30`}>
        <Sidebar 
          currentView={currentView}
          onChangeView={setCurrentView}
          workspaces={workspaces}
          onCreateTask={() => handleCreateTask()}
          onSearch={() => {}}
          onCreateWorkspace={() => {}}
          tasksCount={tasks.length}
          user={user}
          onLogout={handleLogout}
        />
      </div>

      <main className="flex-1 flex flex-col min-w-0 bg-gray-50 dark:bg-[#0f0f23] transition-colors duration-300">
        <TopBar 
          currentTaskView={currentTaskView}
          onChangeTaskView={(view) => {
             setCurrentTaskView(view);
             setCurrentView('home');
          }}
          isDark={isDark}
          onToggleTheme={() => setIsDark(!isDark)}
          timer={timer}
          onStopTimer={handleStopTimer}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />

        {showFilters && (
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 grid grid-cols-2 md:grid-cols-4 gap-4 animate-in slide-in-from-top-5">
            <select 
              className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-sm"
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="">All Statuses</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <select 
              className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-sm"
              onChange={(e) => setFilters({...filters, priority: e.target.value})}
            >
              <option value="">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
            </select>
          </div>
        )}

        <div className="flex-1 overflow-auto p-6 relative">
          {currentView === 'home' && (
             <div className="flex flex-col h-full space-y-6">
                <HomeView 
                  tasks={tasks}
                  activities={activities}
                  userName={user}
                  onCreateTask={handleCreateTask}
                  onViewReports={() => setCurrentView('dashboards')}
                  onOpenTask={setSelectedTaskId}
                />
                <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                   <TaskView 
                     viewType={currentTaskView}
                     tasks={tasks}
                     filters={filters}
                     onOpenTask={setSelectedTaskId}
                     onToggleStatus={(id) => {
                        const t = tasks.find(x => x.id === id);
                        if(t) handleUpdateTask(id, { status: t.status === 'done' ? 'todo' : 'done' });
                     }}
                     onDeleteTask={handleDeleteTask}
                     onStartTimer={handleStartTimer}
                     onUpdateTaskStatus={(id, status) => handleUpdateTask(id, { status })}
                     onCreateTask={handleCreateTask}
                   />
                </div>
             </div>
          )}
          
          {currentView === 'inbox' && <PlaceholderView title="Inbox" icon={Inbox} />}
          {currentView === 'docs' && <PlaceholderView title="Documents" icon={FileText} />}
          {currentView === 'dashboards' && <PlaceholderView title="Advanced Reports" icon={PieChart} />}
          {currentView === 'goals' && <PlaceholderView title="Goals" icon={Target} />}
          {currentView === 'whiteboards' && <PlaceholderView title="Whiteboards" icon={Shapes} />}
        </div>
      </main>

      {/* Task Detail Panel (Slide-over) */}
      {selectedTaskId && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" onClick={() => setSelectedTaskId(null)}></div>
          <TaskDetailPanel 
            task={tasks.find(t => t.id === selectedTaskId) || null}
            onClose={() => setSelectedTaskId(null)}
            onUpdate={handleUpdateTask}
            onAddComment={handleAddComment}
          />
        </div>
      )}

      {/* Modals */}
      <TaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
        onSubmit={handleSubmitTask}
        initialStatus={newTaskStatus}
      />
    </div>
  );
};

export default App;
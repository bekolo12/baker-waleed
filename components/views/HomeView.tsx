import React from 'react';
import { Task, Activity as ActivityType } from '../../types';
import { 
  CheckCircle, Clock, AlertTriangle, Play, Calendar 
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface HomeViewProps {
  tasks: Task[];
  activities: ActivityType[];
  userName: string;
  onCreateTask: () => void;
  onViewReports: () => void;
  onOpenTask: (id: string) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ 
  tasks, activities, userName, onCreateTask, onViewReports, onOpenTask 
}) => {
  const completed = tasks.filter(t => t.status === 'done').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length;
  const total = tasks.length;
  const completionRate = total ? Math.round((completed / total) * 100) : 0;

  const chartData = [
    { name: 'Completed', value: completionRate },
    { name: 'Remaining', value: 100 - completionRate }
  ];
  const COLORS = ['#8b5cf6', '#334155'];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Welcome Card */}
        <div className="lg:col-span-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Welcome back, {userName}! 👋</h2>
            <p className="text-violet-100 mb-6 text-lg">You have {tasks.filter(t => t.status !== 'done').length} active tasks and {overdue} overdue items.</p>
            <div className="flex gap-4">
              <button onClick={onCreateTask} className="bg-white/20 hover:bg-white/30 px-5 py-2.5 rounded-xl transition backdrop-blur-sm font-medium flex items-center gap-2">
                <Play size={16} /> Add Task
              </button>
              <button onClick={onViewReports} className="bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-xl transition backdrop-blur-sm font-medium">
                View Reports
              </button>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
            <CheckCircle size={200} />
          </div>
        </div>

        {/* Progress Circle */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center relative">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 absolute top-6 left-6">Today's Progress</h3>
          <div className="h-40 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={70}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={10}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pt-8">
               <span className="text-4xl font-bold text-gray-900 dark:text-white">{completionRate}%</span>
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">{completed} of {total} tasks completed</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          icon={<CheckCircle className="text-green-500" size={24} />} 
          value={completed} 
          label="Completed" 
          trend="+8%" 
          trendUp={true} 
        />
        <StatCard 
          icon={<Clock className="text-yellow-500" size={24} />} 
          value={inProgress} 
          label="In Progress" 
          trend="-3%" 
          trendUp={false} 
        />
        <StatCard 
          icon={<AlertTriangle className="text-red-500" size={24} />} 
          value={overdue} 
          label="Overdue" 
          trend="+2" 
          trendUp={false} 
          trendColor="text-red-500"
        />
        <StatCard 
          icon={<Calendar className="text-blue-500" size={24} />} 
          value={total} 
          label="Total Tasks" 
          trend="+12%" 
          trendUp={true} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Recent Tasks</h3>
            <button className="text-sm text-primary hover:text-primary-dark">View All</button>
          </div>
          <div className="p-2">
            {tasks.slice(0, 5).map(task => (
              <div 
                key={task.id} 
                onClick={() => onOpenTask(task.id)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
              >
                <span className={`w-2.5 h-2.5 rounded-full ${
                  task.status === 'done' ? 'bg-green-500' : 
                  task.status === 'in-progress' ? 'bg-blue-500' : 
                  task.status === 'review' ? 'bg-yellow-500' : 'bg-gray-500'
                }`}></span>
                <span className="flex-1 truncate font-medium text-gray-700 dark:text-gray-200">{task.title}</span>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {new Date(task.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Activity Feed</h3>
          </div>
          <div className="p-4 space-y-4">
            {activities.slice(0, 5).map(activity => (
              <div key={activity.id} className="flex gap-3 relative pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-white dark:ring-gray-800"></div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium text-gray-900 dark:text-white">{activity.user}</span>
                    {' '}
                    {activity.type === 'task_created' ? 'created' : 
                     activity.type === 'status_changed' ? 'updated status for' :
                     activity.type === 'comment_added' ? 'commented on' : 'completed'}
                    {' '}
                    <span className="text-primary">{activity.task}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {Math.floor((Date.now() - activity.time) / (1000 * 60 * 60))}h ago
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, value, label, trend, trendUp, trendColor }: any) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-2">
      <div className="p-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg">{icon}</div>
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${trendColor ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : trendUp ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-red-100 dark:bg-red-900/30 text-red-600'}`}>
        {trend}
      </span>
    </div>
    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</div>
    <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
  </div>
);

export default HomeView;
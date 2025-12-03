export type ViewType = 'home' | 'inbox' | 'docs' | 'dashboards' | 'goals' | 'whiteboards';
export type TaskViewType = 'list' | 'kanban' | 'calendar' | 'gantt' | 'table';

export type Priority = 'low' | 'normal' | 'high' | 'urgent';
export type Status = 'todo' | 'in-progress' | 'review' | 'done';

export interface Comment {
  text: string;
  time: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  assignee?: string;
  dueDate?: string;
  estimate?: number;
  timeTracked: number;
  tags?: string[];
  workspace: string;
  createdAt: number;
  comments: Comment[];
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  target: number;
  progress: number;
  dueDate?: string;
}

export interface Workspace {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Activity {
  id: string;
  type: 'task_created' | 'status_changed' | 'comment_added' | 'task_completed';
  user: string;
  task: string;
  from?: string;
  to?: string;
  time: number;
}

export interface Doc {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

export interface Whiteboard {
  id: string;
  title: string;
  thumbnail: string;
  updatedAt: number;
}

export interface FilterState {
  status: string;
  priority: string;
  assignee: string;
  dueDate: string;
}

export interface TimerState {
  running: boolean;
  taskId: string | null;
  startTime: number | null;
  elapsed: number;
}
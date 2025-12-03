
import { Task, Goal, Workspace, Activity, Doc, Whiteboard } from './types';

const now = Date.now();
const day = 24 * 60 * 60 * 1000;

// GOOGLE DRIVE CONFIGURATION
// TODO: Replace these with your actual credentials from Google Cloud Console
export const GOOGLE_CONFIG = {
  CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID', // e.g., "123456789-abc...apps.googleusercontent.com"
  API_KEY: 'YOUR_GOOGLE_API_KEY',     // e.g., "AIzaSy..."
  // The folder ID you provided
  FOLDER_ID: '1BnTF6h-Vg1A4iy_aMr3lZabbnY5jeaBk', 
  SCOPES: 'https://www.googleapis.com/auth/drive.file'
};

export const INITIAL_WORKSPACES: Workspace[] = [
  { id: 'ws1', name: 'Marketing Team', icon: '📈', color: '#8b5cf6' },
  { id: 'ws2', name: 'Product Development', icon: '🚀', color: '#3b82f6' }
];

export const INITIAL_TASKS: Task[] = [
  { id: 't1', title: 'Design homepage mockup', description: 'Create wireframes and high-fidelity designs', status: 'in-progress', priority: 'high', assignee: 'john', dueDate: new Date(now).toISOString().split('T')[0], estimate: 8, timeTracked: 12600, tags: ['design', 'urgent'], workspace: 'ws1', createdAt: now - day, comments: [] },
  { id: 't2', title: 'Review marketing strategy', description: 'Q4 marketing plan review', status: 'review', priority: 'normal', assignee: 'jane', dueDate: new Date(now + day).toISOString().split('T')[0], estimate: 4, timeTracked: 7200, tags: ['marketing'], workspace: 'ws1', createdAt: now - 2 * day, comments: [] },
  { id: 't3', title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions', status: 'todo', priority: 'urgent', assignee: 'bob', dueDate: new Date(now - day).toISOString().split('T')[0], estimate: 6, timeTracked: 0, tags: ['devops'], workspace: 'ws2', createdAt: now - 3 * day, comments: [] },
  { id: 't4', title: 'Write API documentation', description: 'Document all endpoints', status: 'todo', priority: 'normal', assignee: 'alice', dueDate: new Date(now + 7 * day).toISOString().split('T')[0], estimate: 10, timeTracked: 3600, tags: ['docs'], workspace: 'ws2', createdAt: now - 4 * day, comments: [] },
  { id: 't5', title: 'User testing session', description: 'Conduct usability testing', status: 'done', priority: 'high', assignee: 'john', dueDate: new Date(now - day).toISOString().split('T')[0], estimate: 3, timeTracked: 10800, tags: ['ux'], workspace: 'ws1', createdAt: now - 5 * day, comments: [] },
  { id: 't6', title: 'Database optimization', description: 'Improve query performance', status: 'in-progress', priority: 'high', assignee: 'bob', dueDate: new Date(now + day).toISOString().split('T')[0], estimate: 5, timeTracked: 5400, tags: ['backend'], workspace: 'ws2', createdAt: now - 6 * day, comments: [] }
];

export const INITIAL_GOALS: Goal[] = [
  { id: 'g1', title: 'Launch MVP', description: 'Complete and launch minimum viable product', target: 100, progress: 65, dueDate: new Date(now + 30 * day).toISOString().split('T')[0] },
  { id: 'g2', title: 'Improve Team Velocity', description: 'Increase sprint points by 20%', target: 120, progress: 85, dueDate: new Date(now + 7 * day).toISOString().split('T')[0] }
];

export const INITIAL_DOCS: Doc[] = [
  { id: 'd1', title: 'Project Requirements', content: 'Full project specifications...', updatedAt: now - 3600000 },
  { id: 'd2', title: 'API Guidelines', content: 'REST API best practices...', updatedAt: now - day }
];

export const INITIAL_WHITEBOARDS: Whiteboard[] = [
  { id: 'w1', title: 'Sprint Planning', thumbnail: '🎯', updatedAt: now - 7200000 },
  { id: 'w2', title: 'Architecture Diagram', thumbnail: '🏗️', updatedAt: now - 2 * day }
];

export const INITIAL_ACTIVITIES: Activity[] = [
  { id: 'a1', type: 'task_created', user: 'John Doe', task: 'Design homepage mockup', time: now - 3600000 },
  { id: 'a2', type: 'status_changed', user: 'Jane Smith', task: 'Review marketing strategy', from: 'In Progress', to: 'Review', time: now - 7200000 },
  { id: 'a3', type: 'comment_added', user: 'Bob Wilson', task: 'Set up CI/CD pipeline', time: now - 14400000 },
  { id: 'a4', type: 'task_completed', user: 'John Doe', task: 'User testing session', time: now - day }
];

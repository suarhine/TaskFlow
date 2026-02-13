import { create } from 'zustand';
import { AuthState, TaskState, Priority, Task, Category } from './types';

// --- Mock Data ---
const initialCategories: Category[] = [
  { id: '1', name: 'Work', color: '#4F46E5' },
  { id: '2', name: 'Personal', color: '#10B981' },
  { id: '3', name: 'Shopping', color: '#F59E0B' },
];

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Finalize Q1 Report',
    description: 'Review the sales numbers and draft the executive summary.',
    priority: Priority.CRITICAL,
    categoryId: '1',
    isCompleted: false,
    dueDate: new Date().toISOString().split('T')[0], // Set to today for calendar demo
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Buy Groceries',
    description: 'Milk, Eggs, Bread, and Coffee.',
    priority: Priority.MEDIUM,
    categoryId: '3',
    isCompleted: false,
    dueDate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Gym Workout',
    description: 'Leg day.',
    priority: Priority.LOW,
    categoryId: '2',
    isCompleted: true,
    dueDate: '2023-11-10',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// --- Stores ---

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (username: string) => set({
    isAuthenticated: true,
    user: {
      id: 'u1',
      username,
      name: username.includes('@') ? username.split('@')[0] : username,
      avatarUrl: `https://ui-avatars.com/api/?name=${username}&background=random`
    }
  }),
  logout: () => set({ isAuthenticated: false, user: null }),
}));

export const useTaskStore = create<TaskState>((set) => ({
  tasks: initialTasks,
  categories: initialCategories,
  addTask: (taskData) => set((state) => ({
    tasks: [
      {
        ...taskData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      ...state.tasks
    ]
  })),
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map((t) => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t)
  })),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((t) => t.id !== id)
  })),
  toggleComplete: (id) => set((state) => ({
    tasks: state.tasks.map((t) => 
      t.id === id ? { ...t, isCompleted: !t.isCompleted, updatedAt: new Date().toISOString() } : t
    )
  })),
  addCategory: (catData) => set((state) => ({
    categories: [...state.categories, { ...catData, id: Math.random().toString(36).substr(2, 9) }]
  }))
}));
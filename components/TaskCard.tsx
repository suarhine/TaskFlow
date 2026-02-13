import React from 'react';
import { Task, Priority } from '../types';
import { useTaskStore } from '../store';
import { IconCalendar, IconAlertTriangle, IconArrowUp, IconArrowDown, IconMinus, IconTrash, IconCheck } from './Icons';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { toggleComplete, deleteTask, categories } = useTaskStore();

  const getPriorityIcon = (priority: Priority) => {
    switch (priority) {
      case Priority.CRITICAL: return <IconAlertTriangle className="w-4 h-4 text-priority-critical" />;
      case Priority.HIGH: return <IconArrowUp className="w-4 h-4 text-priority-high" />;
      case Priority.MEDIUM: return <IconMinus className="w-4 h-4 text-priority-medium" />;
      case Priority.LOW: return <IconArrowDown className="w-4 h-4 text-priority-low" />;
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.CRITICAL: return 'border-l-priority-critical';
      case Priority.HIGH: return 'border-l-priority-high';
      case Priority.MEDIUM: return 'border-l-priority-medium';
      case Priority.LOW: return 'border-l-priority-low';
    }
  };

  const category = categories.find(c => c.id === task.categoryId);

  return (
    <div className={`
      relative bg-white p-4 rounded-lg shadow-sm border border-slate-200 border-l-4 transition-all duration-200 hover:shadow-md
      ${getPriorityColor(task.priority)}
      ${task.isCompleted ? 'opacity-60 bg-slate-50' : ''}
    `}>
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button 
          onClick={() => toggleComplete(task.id)}
          className={`
            mt-1 w-5 h-5 rounded border flex items-center justify-center transition-colors
            ${task.isCompleted 
              ? 'bg-emerald-500 border-emerald-500 text-white' 
              : 'bg-white border-slate-300 hover:border-indigo-500'}
          `}
        >
          {task.isCompleted && <IconCheck className="w-3.5 h-3.5" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className={`text-base font-medium text-slate-800 truncate pr-2 ${task.isCompleted ? 'line-through text-slate-500' : ''}`}>
              {task.title}
            </h3>
            <button 
              onClick={() => deleteTask(task.id)}
              className="text-slate-400 hover:text-red-500 transition-colors p-1"
              aria-label="Delete task"
            >
              <IconTrash className="w-4 h-4" />
            </button>
          </div>
          
          {task.description && (
            <p className="mt-1 text-sm text-slate-500 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            {/* Priority Badge */}
            <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded-full border border-slate-200">
              {getPriorityIcon(task.priority)}
              <span className="capitalize">{task.priority}</span>
            </div>

            {/* Category Badge */}
            {category && (
              <span 
                className="px-2 py-0.5 rounded-full border"
                style={{ 
                  backgroundColor: `${category.color}15`, 
                  color: category.color,
                  borderColor: `${category.color}30`
                }}
              >
                {category.name}
              </span>
            )}

            {/* Due Date */}
            {task.dueDate && (
              <div className="flex items-center gap-1 ml-auto">
                <IconCalendar className="w-3.5 h-3.5" />
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;

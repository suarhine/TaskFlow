import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTaskStore } from '../store';
import TaskCard from '../components/TaskCard';
import { Priority } from '../types';

const Dashboard: React.FC = () => {
  const { tasks, categories } = useTaskStore();
  const [searchParams] = useSearchParams();
  const [filterPriority, setFilterPriority] = useState<string>('all');

  // Get category ID from URL
  const categoryIdParam = searchParams.get('cat');

  // Derive current category object if selected
  const currentCategory = useMemo(() => 
    categoryIdParam ? categories.find(c => c.id === categoryIdParam) : null,
  [categoryIdParam, categories]);

  const pendingTasks = useMemo(() => 
    tasks.filter(t => !t.isCompleted).sort((a, b) => {
      const pOrder = { [Priority.CRITICAL]: 1, [Priority.HIGH]: 2, [Priority.MEDIUM]: 3, [Priority.LOW]: 4 };
      return pOrder[a.priority] - pOrder[b.priority];
    }), 
  [tasks]);

  const completedTasks = useMemo(() => 
    tasks.filter(t => t.isCompleted).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()), 
  [tasks]);

  // Filter based on both Priority (Local State) and Category (URL Param)
  const filteredPending = useMemo(() => {
    return pendingTasks.filter(t => {
      const matchPriority = filterPriority === 'all' || t.priority === filterPriority;
      const matchCategory = !categoryIdParam || t.categoryId === categoryIdParam;
      return matchPriority && matchCategory;
    });
  }, [pendingTasks, filterPriority, categoryIdParam]);

  const filteredCompleted = useMemo(() => {
    return completedTasks.filter(t => {
      const matchCategory = !categoryIdParam || t.categoryId === categoryIdParam;
      return matchCategory;
    });
  }, [completedTasks, categoryIdParam]);

  return (
    <div className="space-y-8">
      {/* Filters and Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            {currentCategory ? (
              <>
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: currentCategory.color }}></span>
                {currentCategory.name} Tasks
              </>
            ) : (
              "My Tasks"
            )}
          </h2>
          <p className="text-slate-500 text-sm">
             You have {filteredPending.length} pending tasks {currentCategory ? `in ${currentCategory.name}` : ''}
          </p>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          <button 
            onClick={() => setFilterPriority('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap ${filterPriority === 'all' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
          >
            All Priorities
          </button>
          {Object.values(Priority).map((p: string) => (
             <button 
             key={p}
             onClick={() => setFilterPriority(p)}
             className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors capitalize whitespace-nowrap ${filterPriority === p ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
           >
             {p}
           </button>
          ))}
        </div>
      </div>

      {/* Pending Tasks List */}
      <div className="space-y-3">
        {filteredPending.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
            <div className="mx-auto w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-slate-900 font-medium">No tasks found</h3>
            <p className="text-slate-500 text-sm">
              {currentCategory 
                ? `No pending tasks in ${currentCategory.name}.` 
                : "Get started by creating a new task."}
            </p>
          </div>
        ) : (
          filteredPending.map(task => (
            <TaskCard key={task.id} task={task} />
          ))
        )}
      </div>

      {/* Completed Tasks Section */}
      {filteredCompleted.length > 0 && (
        <div className="pt-8 border-t border-slate-200">
          <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">Completed ({filteredCompleted.length})</h3>
          <div className="space-y-3 opacity-75 hover:opacity-100 transition-opacity">
            {filteredCompleted.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
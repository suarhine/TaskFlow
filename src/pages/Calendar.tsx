import React, { useState, useMemo } from 'react';
import { useTaskStore } from '../store';
import { IconChevronLeft, IconChevronRight } from '../components/Icons';
import { Priority } from '../types';

const Calendar: React.FC = () => {
  const { tasks, categories } = useTaskStore();
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weeks = useMemo(() => {
    const w = [];
    let currentWeek = [];

    // Add empty cells for days before the 1st
    for (let i = 0; i < firstDayOfMonth; i++) {
      currentWeek.push(null);
    }

    // Add days
    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        w.push(currentWeek);
        currentWeek = [];
      }
    }

    // Add empty cells for the last week
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      w.push(currentWeek);
    }

    return w;
  }, [daysInMonth, firstDayOfMonth]);

  const getTasksForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter(t => t.dueDate === dateStr && !t.isCompleted);
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.CRITICAL: return 'bg-red-500';
      case Priority.HIGH: return 'bg-orange-500';
      case Priority.MEDIUM: return 'bg-blue-500';
      case Priority.LOW: return 'bg-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Calendar</h2>
        <div className="flex items-center gap-4 bg-white rounded-lg p-1 shadow-sm border border-slate-200">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 rounded-md transition-colors text-slate-600">
            <IconChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-semibold text-slate-800 w-32 text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 rounded-md transition-colors text-slate-600">
            <IconChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-3 text-center text-sm font-semibold text-slate-600">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 auto-rows-fr bg-slate-200 gap-px">
          {weeks.map((week, wIndex) => (
            <React.Fragment key={wIndex}>
              {week.map((day, dIndex) => {
                const dayTasks = day ? getTasksForDate(day) : [];
                const isToday = day && 
                  day === new Date().getDate() && 
                  currentDate.getMonth() === new Date().getMonth() && 
                  currentDate.getFullYear() === new Date().getFullYear();

                return (
                  <div key={dIndex} className={`bg-white min-h-[120px] p-2 relative ${!day ? 'bg-slate-50' : ''}`}>
                    {day && (
                      <>
                        <span className={`
                          text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-1
                          ${isToday ? 'bg-indigo-600 text-white' : 'text-slate-700'}
                        `}>
                          {day}
                        </span>
                        
                        <div className="space-y-1">
                          {dayTasks.map(task => {
                             const category = categories.find(c => c.id === task.categoryId);
                             return (
                              <div 
                                key={task.id} 
                                className="text-xs p-1 rounded border border-slate-100 shadow-sm bg-white truncate flex items-center gap-1.5"
                                title={task.title}
                              >
                                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${getPriorityColor(task.priority)}`} />
                                <span className="truncate">{task.title}</span>
                              </div>
                            )
                          })}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;

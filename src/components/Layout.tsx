import React, { useState } from 'react';
import { useLocation, useNavigate, Outlet, useSearchParams } from 'react-router-dom';
import { useAuthStore, useTaskStore } from '../store';
import Button from './Button';
import CreateTaskModal from './CreateTaskModal';
import { IconMenu, IconHome, IconList, IconLogOut, IconPlus, IconSearch, IconCalendar } from './Icons';

const Layout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { categories } = useTaskStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Helper to check active route
  const currentCatId = searchParams.get('cat');
  const isDashboard = location.pathname === '/dashboard';
  const isCalendar = location.pathname === '/calendar';
  const isCategories = location.pathname === '/categories';
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-600">
            <IconMenu className="w-6 h-6" />
          </button>
          <span className="font-bold text-indigo-600 text-lg">TaskFlow</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
           {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Sidebar (Desktop + Mobile Overlay) */}
      <>
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <aside className={`
          fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 z-40 transition-transform duration-200 ease-in-out flex flex-col
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="p-6 border-b border-slate-100 hidden md:flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-bold text-xl text-slate-800">TaskFlow</span>
          </div>

          <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
            <Button 
              fullWidth 
              className="mb-6 justify-start gap-2 shadow-sm shadow-indigo-200"
              onClick={() => {
                setIsCreateModalOpen(true);
                setIsSidebarOpen(false);
              }}
            >
              <IconPlus className="w-5 h-5" />
              <span>New Task</span>
            </Button>

            {/* Main Dashboard Link */}
            <button
              onClick={() => handleNavClick('/dashboard')}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1
                ${isDashboard && !currentCatId 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <IconHome className="w-5 h-5" />
              All Tasks
            </button>

            {/* Calendar Link */}
            <button
              onClick={() => handleNavClick('/calendar')}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1
                ${isCalendar
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <IconCalendar className="w-5 h-5" />
              Calendar
            </button>

            {/* Categories Sub-menu */}
            <div className="ml-4 pl-3 border-l border-slate-200 space-y-1 mt-1 mb-4">
              <p className="px-2 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Categories
              </p>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleNavClick(`/dashboard?cat=${cat.id}`)}
                  className={`
                    w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors
                    ${isDashboard && currentCatId === cat.id
                      ? 'bg-indigo-50 text-indigo-700 font-medium'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                  `}
                >
                  <span 
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="truncate">{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Manage Categories Link */}
            <button
              onClick={() => handleNavClick('/categories')}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${isCategories
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <IconList className="w-5 h-5" />
              Manage Categories
            </button>
          </div>

          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3 px-2 mb-3">
              <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                <img src={user?.avatarUrl} alt={user?.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.username}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <IconLogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>
      </>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-[calc(100vh-64px)] md:h-screen overflow-hidden">
        {/* Desktop Top Bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-slate-800">
             {isDashboard ? 'Dashboard' : isCalendar ? 'Calendar' : isCategories ? 'Categories' : 'Management'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                className="pl-9 pr-4 py-2 rounded-full bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 shadow-sm"
              />
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
             <Outlet />
          </div>
        </div>
      </main>

      {/* Global Modals */}
      <CreateTaskModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
      
      {/* Mobile FAB */}
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-600/30 flex items-center justify-center z-40 active:scale-95 transition-transform"
      >
        <IconPlus className="w-8 h-8" />
      </button>
    </div>
  );
};

export default Layout;

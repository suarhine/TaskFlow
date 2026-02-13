import React, { useState } from 'react';
import { useTaskStore } from '../store';
import Button from '../components/Button';
import Input from '../components/Input';

const Categories: React.FC = () => {
  const { categories, addCategory } = useTaskStore();
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#4F46E5');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCatName.trim()) {
      addCategory({ name: newCatName, color: newCatColor });
      setNewCatName('');
      setNewCatColor('#4F46E5');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Categories</h2>
        <p className="text-slate-500">Organize your tasks with custom color-coded categories.</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-medium text-slate-800 mb-4">Add New Category</h3>
        <form onSubmit={handleAdd} className="flex gap-4 items-end">
          <div className="flex-1">
             <Input 
                label="Name" 
                value={newCatName} 
                onChange={e => setNewCatName(e.target.value)} 
                placeholder="e.g. Finance"
                className="mb-0"
             />
          </div>
          <div className="w-20">
             <label className="block text-sm font-medium text-slate-700 mb-1">Color</label>
             <input 
               type="color" 
               value={newCatColor} 
               onChange={e => setNewCatColor(e.target.value)}
               className="h-[42px] w-full rounded-lg cursor-pointer border border-slate-300 p-1"
             />
          </div>
          <Button type="submit">Add</Button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white p-4 rounded-lg border border-slate-200 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: cat.color }}
              />
              <span className="font-medium text-slate-700">{cat.name}</span>
            </div>
            {/* Future: Add delete/edit buttons here */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
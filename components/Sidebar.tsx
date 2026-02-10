
import React from 'react';
import { Note } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentNote: Note;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, currentNote }) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-white border-r z-50 transition-transform duration-300 transform
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:static lg:translate-x-0
        ${!isOpen ? 'lg:w-0 lg:border-none lg:overflow-hidden' : 'lg:w-72'}
      `}>
        <div className="h-14 flex items-center justify-between px-6 border-b">
          <span className="font-bold text-xl text-blue-600 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </div>
            OmniNote
          </span>
          <button onClick={onToggle} className="lg:hidden p-2 text-slate-400 hover:text-slate-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-3.5rem)]">
          <div>
            <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors mb-6">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              New Note
            </button>
            
            <h3 className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Recent Notes</h3>
            <div className="space-y-1">
              <div className="bg-blue-50 border-l-4 border-blue-600 px-4 py-3 rounded-r-xl cursor-pointer">
                <div className="font-medium text-blue-900 truncate">{currentNote.title}</div>
                <div className="text-xs text-blue-600 mt-1">Edited 2m ago</div>
              </div>
              <NoteItem title="Market Research" time="1h ago" />
              <NoteItem title="Project Roadmap" time="Yesterday" />
              <NoteItem title="Meeting Minutes" time="Oct 24" />
            </div>
          </div>

          <div>
            <h3 className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Categories</h3>
            <div className="space-y-1">
              <CategoryItem label="Personal" color="bg-pink-400" />
              <CategoryItem label="Work" color="bg-blue-400" />
              <CategoryItem label="Sketching" color="bg-emerald-400" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-4 border-t bg-slate-50">
          <div className="flex items-center gap-3">
            <img src="https://picsum.photos/40/40" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="User" />
            <div>
              <div className="text-sm font-semibold">User Account</div>
              <div className="text-xs text-slate-400">Sync Active</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

const NoteItem = ({ title, time }: { title: string, time: string }) => (
  <div className="px-4 py-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors group">
    <div className="font-medium text-slate-700 truncate group-hover:text-slate-900">{title}</div>
    <div className="text-xs text-slate-400 mt-1">{time}</div>
  </div>
);

const CategoryItem = ({ label, color }: { label: string, color: string }) => (
  <div className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
    <div className={`w-2 h-2 rounded-full ${color}`} />
    <span className="text-sm text-slate-600">{label}</span>
  </div>
);

export default Sidebar;

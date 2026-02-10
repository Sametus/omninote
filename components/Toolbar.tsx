
import React from 'react';
import { Tool } from '../types';

interface ToolbarProps {
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
  color: string;
  setColor: (color: string) => void;
  width: number;
  setWidth: (width: number) => void;
  onUndo: () => void;
}

const COLORS = ['#2563eb', '#dc2626', '#16a34a', '#ca8a04', '#000000', '#ffffff'];
const WIDTHS = [2, 4, 8, 16];

const Toolbar: React.FC<ToolbarProps> = ({ 
  activeTool, setActiveTool, color, setColor, width, setWidth 
}) => {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-slate-200 shadow-2xl rounded-2xl flex items-center p-2 gap-2 z-30 ring-1 ring-slate-900/5">
      
      {/* Tools Section */}
      <div className="flex gap-1 border-r pr-2 border-slate-200">
        <ToolButton 
          active={activeTool === 'pen'} 
          onClick={() => setActiveTool('pen')}
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>}
        />
        <ToolButton 
          active={activeTool === 'eraser'} 
          onClick={() => setActiveTool('eraser')}
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>}
        />
        <ToolButton 
          active={activeTool === 'text'} 
          onClick={() => setActiveTool('text')}
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>}
        />
        <ToolButton 
          active={activeTool === 'select'} 
          onClick={() => setActiveTool('select')}
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0V12m-3-0.5a3 3 0 006 0V6a1.5 1.5 0 113 0v5.5m-9 0h.01" /></svg>}
        />
      </div>

      {/* Colors Section */}
      <div className="flex gap-2 border-r pr-2 border-slate-200">
        {COLORS.map(c => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={`w-6 h-6 rounded-full border border-slate-200 transition-transform active:scale-90 ${color === c ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      {/* Width Section */}
      <div className="flex gap-2 items-center px-1">
        {WIDTHS.map(w => (
          <button
            key={w}
            onClick={() => setWidth(w)}
            className={`flex items-center justify-center transition-all ${width === w ? 'text-blue-600 scale-125' : 'text-slate-400'}`}
          >
            <div 
              style={{ width: `${w + 4}px`, height: `${w + 4}px` }} 
              className={`rounded-full bg-current`}
            />
          </button>
        ))}
      </div>

    </div>
  );
};

const ToolButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode }> = ({ active, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`p-2.5 rounded-xl transition-all ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-100 active:bg-slate-200'}`}
  >
    {icon}
  </button>
);

export default Toolbar;


import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Note, Tool, Stroke, TextElement, ImageElement, SyncMessage } from './types';
import Sidebar from './components/Sidebar';
import Toolbar from './components/Toolbar';
import DrawingCanvas from './components/DrawingCanvas';
import LandingPage from './components/LandingPage';

const DEVICE_ID = Math.random().toString(36).substring(7);

const App: React.FC = () => {
  const [appMode, setAppMode] = useState<'tablet' | 'pc' | null>(null);
  const [roomId, setRoomId] = useState<string>('');
  const [note, setNote] = useState<Note>({ 
    id: 'default', 
    title: 'Yeni Not', 
    strokes: [], 
    texts: [], 
    images: [], 
    lastModified: Date.now() 
  });
  const [activeTool, setActiveTool] = useState<Tool>('pen');
  const [color, setColor] = useState('#2563eb');
  const [width, setWidth] = useState(3);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const syncChannel = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (!roomId) return;
    syncChannel.current = new BroadcastChannel(`omni-sync-${roomId}`);
    
    syncChannel.current.onmessage = (event: MessageEvent<SyncMessage>) => {
      const { type, payload, senderId } = event.data;
      if (senderId === DEVICE_ID) return;

      setIsSyncing(true);
      if (type === 'STROKE_UPDATE') {
        setNote(prev => ({ ...prev, strokes: [...prev.strokes, payload] }));
      } else if (type === 'TEXT_UPDATE') {
        setNote(prev => ({
          ...prev,
          texts: prev.texts.some(t => t.id === payload.id) 
            ? prev.texts.map(t => t.id === payload.id ? payload : t)
            : [...prev.texts, payload]
        }));
      } else if (type === 'CLEAR_NOTE') {
        setNote({ id: 'default', title: 'Yeni Not', strokes: [], texts: [], images: [], lastModified: Date.now() });
      }
      setTimeout(() => setIsSyncing(false), 300);
    };

    return () => syncChannel.current?.close();
  }, [roomId]);

  const handleNoteUpdate = useCallback((updater: (prev: Note) => Note, broadcastPayload?: any) => {
    setNote(prev => updater(prev));
    if (broadcastPayload && syncChannel.current) {
      syncChannel.current.postMessage({
        type: broadcastPayload.type,
        payload: broadcastPayload.data,
        senderId: DEVICE_ID
      });
    }
  }, []);

  const clearAll = () => {
    if (window.confirm('Tüm sayfayı temizlemek istediğinize emin misiniz?')) {
      const emptyNote: Note = { 
        id: 'default', 
        title: 'Yeni Not', 
        strokes: [], 
        texts: [], 
        images: [], 
        lastModified: Date.now() 
      };
      setNote(emptyNote);
      if (syncChannel.current) {
        syncChannel.current.postMessage({
          type: 'CLEAR_NOTE',
          payload: null,
          senderId: DEVICE_ID
        });
      }
    }
  };

  const startApp = (mode: 'tablet' | 'pc', code: string) => {
    setAppMode(mode);
    setRoomId(code || 'GENEL-ODA');
  };

  if (!appMode) {
    return <LandingPage onStart={startApp} />;
  }

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden text-slate-900">
      <Sidebar isOpen={showSidebar} onToggle={() => setShowSidebar(!showSidebar)} currentNote={note} />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-14 bg-white border-b flex items-center justify-between px-4 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowSidebar(true)} className="p-2 hover:bg-slate-100 rounded-lg">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight">OmniNote</span>
              <span className="text-[10px] text-slate-400 font-mono uppercase">ODA: {roomId}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={clearAll}
              className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 active:scale-95 transition-all shadow-md"
            >
              TEMİZLE
            </button>
            <div className={`px-3 py-1.5 rounded-full text-[10px] font-bold ${isSyncing ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-400'}`}>
              {isSyncing ? 'SENKRON' : 'BAĞLI'}
            </div>
          </div>
        </header>

        <div className="flex-1 relative bg-white overflow-hidden">
          <DrawingCanvas 
            note={note} 
            activeTool={activeTool} 
            color={color} 
            width={width} 
            deviceId={DEVICE_ID}
            onUpdate={handleNoteUpdate} 
          />
        </div>

        <Toolbar 
          activeTool={activeTool} 
          setActiveTool={setActiveTool} 
          color={color} 
          setColor={setColor} 
          width={width} 
          setWidth={setWidth} 
          onUndo={() => {}} 
        />
      </main>
    </div>
  );
};

export default App;

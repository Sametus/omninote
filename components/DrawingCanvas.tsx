
import React, { useRef, useEffect, useCallback } from 'react';
import { Note, Tool, Point, Stroke, TextElement } from '../types';

interface DrawingCanvasProps {
  note: Note;
  activeTool: Tool;
  color: string;
  width: number;
  deviceId: string;
  onUpdate: (updater: (prev: Note) => Note, broadcastPayload?: any) => void;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ note, activeTool, color, width, deviceId, onUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDrawing = useRef(false);
  const pointsRef = useRef<Point[]>([]);
  const currentDpr = useRef(window.devicePixelRatio || 1);

  const drawStroke = (ctx: CanvasRenderingContext2D, stroke: Stroke) => {
    if (!stroke.points || stroke.points.length === 0) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (stroke.type === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = stroke.width * 25;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
    }

    ctx.beginPath();
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
    for (let i = 1; i < stroke.points.length; i++) {
      ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
    }
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
  };

  const fullRender = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = currentDpr.current;
    
    // KESİN TEMİZLİK: Koordinatları sıfırla, temizle ve dpr ölçeğini tekrar kur
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Eğer notta çizgi yoksa (temizlenmişse) döngüye girmeyecek ve ekran boş kalacaktır.
    if (note.strokes && note.strokes.length > 0) {
      note.strokes.forEach(s => drawStroke(ctx, s));
    }
  }, [note.strokes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      currentDpr.current = dpr;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      fullRender();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    window.addEventListener('resize', resize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [fullRender]);

  // Herhangi bir stroke değişikliğinde fiziksel temizliği tetikle
  useEffect(() => {
    requestAnimationFrame(() => fullRender());
  }, [note.strokes, fullRender]);

  const handlePointerDown = (e: React.PointerEvent) => {
    // S-Pen Yan Düğme veya Silgi ucu tespiti
    const isEraserRequest = e.buttons === 2 || e.buttons === 32 || activeTool === 'eraser';
    
    if (activeTool === 'text' && !isEraserRequest) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newText: TextElement = { id: crypto.randomUUID(), x, y, content: '', fontSize: 20, color };
      onUpdate(prev => ({ ...prev, texts: [...prev.texts, newText] }), { type: 'TEXT_UPDATE', data: newText });
      return;
    }

    isDrawing.current = true;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const p: Point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      pressure: e.pressure || 1
    };
    pointsRef.current = [p];
    
    if (canvasRef.current) canvasRef.current.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing.current || !canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const p: Point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      pressure: e.pressure || 1
    };

    // Dinamik S-Pen yan düğme kontrolü
    const isEraserRequest = e.buttons === 2 || e.buttons === 32 || activeTool === 'eraser';

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (isEraserRequest) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = width * 25;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
    }

    const lastP = pointsRef.current[pointsRef.current.length - 1];
    ctx.beginPath();
    ctx.moveTo(lastP.x, lastP.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();

    pointsRef.current.push(p);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    if (canvasRef.current) canvasRef.current.releasePointerCapture(e.pointerId);

    const isEraserRequest = e.button === 2 || activeTool === 'eraser';

    if (pointsRef.current.length > 0) {
      const newStroke: Stroke = {
        id: crypto.randomUUID(),
        deviceId,
        points: [...pointsRef.current],
        color,
        width,
        type: isEraserRequest ? 'eraser' : 'pen'
      };
      
      onUpdate(prev => ({
        ...prev,
        strokes: [...prev.strokes, newStroke],
        lastModified: Date.now()
      }), { type: 'STROKE_UPDATE', data: newStroke });
    }
    pointsRef.current = [];
  };

  return (
    <div ref={containerRef} className="w-full h-full relative touch-none bg-white overflow-hidden">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onContextMenu={(e) => {
          e.preventDefault(); // S-Pen yan tuş sağ tık menüsünü engelle
          return false;
        }}
        className="block touch-none absolute inset-0 outline-none"
      />
      <div className="absolute inset-0 pointer-events-none">
        {note.texts.map(text => (
          <div 
            key={text.id} 
            style={{ left: text.x, top: text.y, color: text.color, fontSize: `${text.fontSize}px` }} 
            className="absolute pointer-events-auto"
          >
            <input
              autoFocus={!text.content}
              className="bg-transparent outline-none border-b border-dashed border-slate-300 focus:border-blue-500 text-inherit p-1"
              value={text.content}
              placeholder="Not..."
              onChange={(e) => {
                const val = e.target.value;
                onUpdate(prev => ({
                  ...prev,
                  texts: prev.texts.map(t => t.id === text.id ? { ...t, content: val } : t)
                }), { type: 'TEXT_UPDATE', data: { ...text, content: val } });
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DrawingCanvas;

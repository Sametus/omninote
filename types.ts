
export type Tool = 'pen' | 'eraser' | 'text' | 'select' | 'image';

export interface Point {
  x: number;
  y: number;
  pressure: number;
}

export interface Stroke {
  id: string;
  deviceId: string;
  points: Point[];
  color: string;
  width: number;
  type: 'pen' | 'eraser';
}

export interface TextElement {
  id: string;
  x: number;
  y: number;
  content: string;
  fontSize: number;
  color: string;
}

export interface ImageElement {
  id: string;
  x: number;
  y: number;
  src: string;
  width: number;
  height: number;
}

export interface Note {
  id: string;
  title: string;
  strokes: Stroke[];
  texts: TextElement[];
  images: ImageElement[];
  lastModified: number;
}

export interface SyncMessage {
  type: 'STROKE_UPDATE' | 'TEXT_UPDATE' | 'IMAGE_UPDATE' | 'CURSOR_MOVE' | 'CLEAR_NOTE';
  payload: any;
  senderId: string;
}

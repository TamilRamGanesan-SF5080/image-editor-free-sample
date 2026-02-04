// TypeScript types for Image Editor application

export type ToolType = 'none' | 'crop' | 'filter' | 'finetune' | 'annotate' | 'frame' | 'resize' | 'redact';

export const ToolType = {
  NONE: 'none' as const,
  CROP: 'crop' as const,
  FILTER: 'filter' as const,
  FINETUNE: 'finetune' as const,
  ANNOTATE: 'annotate' as const,
  FRAME: 'frame' as const,
  RESIZE: 'resize' as const,
  REDACT: 'redact' as const,
};

export type AnnotationType = 'text' | 'rectangle' | 'ellipse' | 'line' | 'arrow' | 'freehand' | 'image';

export const AnnotationType = {
  TEXT: 'text' as const,
  RECTANGLE: 'rectangle' as const,
  ELLIPSE: 'ellipse' as const,
  LINE: 'line' as const,
  ARROW: 'arrow' as const,
  FREEHAND: 'freehand' as const,
  IMAGE: 'image' as const,
};

export interface ImageEditorState {
  currentTool: ToolType;
  isImageLoaded: boolean;
  canUndo: boolean;
  canRedo: boolean;
  zoomLevel: number;
  exportFormat: string;
}

export interface ToolPanelProps {
  editorRef: React.RefObject<any>;
  onClose?: () => void;
}

export interface TopBarProps {
  editorRef: React.RefObject<any>;
  onExport: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onReset?: () => void;
  exportFormat: string;
  setExportFormat: (format: string) => void;
}

export interface BottomTabsProps {
  currentTool: ToolType;
  onToolChange: (tool: ToolType) => void;
  isImageLoaded: boolean;
  onOpenImage?: () => void;
}

export interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  disabled?: boolean;
  zoomLevel?: number;
  onSetZoom?: (zoom: number) => void; // zoom factor (1 = 100%)
  minZoom?: number; // factor
  maxZoom?: number; // factor
}

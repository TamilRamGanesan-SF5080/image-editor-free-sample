import { useRef, useState, useCallback } from 'react';
import { ImageEditorComponent } from '@syncfusion/ej2-react-image-editor';
import { ToolType, type ImageEditorState } from '../types/imageEditor.types';

export const useImageEditor = () => {
    const editorRef = useRef<ImageEditorComponent>(null);

    const [state, setState] = useState<ImageEditorState>({
        currentTool: ToolType.NONE,
        isImageLoaded: false,
        canUndo: true,
        canRedo: true,
        zoomLevel: 1,
        exportFormat: 'PNG',
    });

    const updateUndoRedoState = useCallback(() => {
        if (editorRef.current) {
            setState(prev => ({
                ...prev,
                canUndo: editorRef.current?.canUndo() || false,
                canRedo: editorRef.current?.canRedo() || false,
            }));
        }
    }, []);

    const setCurrentTool = useCallback((tool: ToolType) => {
        setState(prev => ({ ...prev, currentTool: tool }));
    }, []);

    const setImageLoaded = useCallback((loaded: boolean) => {
        setState(prev => ({ ...prev, isImageLoaded: loaded }));
    }, []);

    const setExportFormat = useCallback((format: string) => {
        setState(prev => ({ ...prev, exportFormat: format }));
    }, []);

    const undo = useCallback(() => {
        editorRef.current?.undo();
        updateUndoRedoState();
    }, [updateUndoRedoState]);

    const redo = useCallback(() => {
        editorRef.current?.redo();
        updateUndoRedoState();
    }, [updateUndoRedoState]);

    const zoomIn = useCallback(() => {
        if (editorRef.current) {
            const newZoom = state.zoomLevel + 0.1;
            editorRef.current.zoom(newZoom);
            setState(prev => ({ ...prev, zoomLevel: newZoom }));
        }
    }, [state.zoomLevel]);

    const zoomOut = useCallback(() => {
        if (editorRef.current) {
            const newZoom = Math.max(0.1, state.zoomLevel - 0.1);
            editorRef.current.zoom(newZoom);
            setState(prev => ({ ...prev, zoomLevel: newZoom }));
        }
    }, [state.zoomLevel]);

    const resetEditor = useCallback(() => {
        if (editorRef.current) {
            editorRef.current.reset();
            // Optional: reset your local zoom tracking if you want to show 100% again
            setState(prev => ({
                ...prev,
                zoomLevel: 1,
                // You can also reset currentTool if desired
                // currentTool: ToolType.NONE,
            }));
            updateUndoRedoState(); // Refresh undo/redo buttons
        }
    }, [updateUndoRedoState]);

    return {
        editorRef,
        state,
        setCurrentTool,
        setImageLoaded,
        setExportFormat,
        updateUndoRedoState,
        undo,
        redo,
        zoomIn,
        zoomOut,
        resetEditor,
    };
};

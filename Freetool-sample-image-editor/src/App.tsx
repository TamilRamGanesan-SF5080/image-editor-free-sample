import { useEffect } from 'react';
import { registerLicense } from '@syncfusion/ej2-base';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { ImageEditorCanvas } from './components/ImageEditorCanvas';
import { TopBar } from './components/TopBar';
import { LeftSidebar } from './components/LeftSidebar';
import { CropPanel } from './components/tools/CropPanel';
import { FilterPanel } from './components/tools/FilterPanel';
import { FinetunePanel } from './components/tools/FinetunePanel';
import { AnnotatePanel } from './components/tools/AnnotatePanel';
import { FramePanel } from './components/tools/FramePanel';
import { ResizePanel } from './components/tools/ResizePanel';
import { RedactPanel } from './components/tools/RedactPanel';
import { useImageEditor } from './hooks/useImageEditor';
import { ToolType } from './types/imageEditor.types';
import './App.css';
// Syncfusion theme styles for Bootstrap5
import '@syncfusion/ej2-base/styles/bootstrap5.css';
import '@syncfusion/ej2-react-buttons/styles/bootstrap5.css';
import '@syncfusion/ej2-react-inputs/styles/bootstrap5.css';

// Register Syncfusion license (use trial license or your own license key)
registerLicense('YOUR_LICENSE_KEY_HERE'); // TODO: Replace with actual license

function App() {
  const {
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
  } = useImageEditor();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case 'y':
            e.preventDefault();
            redo();
            break;
          case 's':
            e.preventDefault();
            editorRef.current?.export(state.exportFormat ?? 'PNG', 'edited-image');
            break;
          case '=':
          case '+':
            e.preventDefault();
            zoomIn();
            break;
          case '-':
            e.preventDefault();
            zoomOut();
            break;
        }
      }

      // ESC to close tool panel
      if (e.key === 'Escape') {
        setCurrentTool(ToolType.NONE);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, zoomIn, zoomOut, editorRef, setCurrentTool, state.exportFormat]);

  const handleImageLoaded = () => {
    console.log('Image loaded callback fired!');
    setImageLoaded(true);
    updateUndoRedoState();
  };

  const handleEditComplete = () => {
    updateUndoRedoState();
  };

  const handleOpenImage = () => {
    // Called after image opens
  };

  const handleExport = () => {
    // Called after export
  };

  const handleToolChange = (tool: ToolType) => {
    // Toggle tool off if clicking the same tool
    setCurrentTool(state.currentTool === tool ? ToolType.NONE : tool);
  };

  const openFileDialog = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && editorRef.current) {
        console.log('File selected:', file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageData = event.target?.result as string;
          console.log('Image data loaded, size:', imageData.length);
          console.log('EditorRef current:', editorRef.current);
          editorRef.current?.open(imageData);
        };
        reader.readAsDataURL(file);
      } else {
        console.log('No file or editorRef:', { file, editorRef: editorRef.current });
      }
    };
    input.click();
  };

  // Render appropriate tool panel
  const renderToolPanel = () => {
    switch (state.currentTool) {
      case ToolType.CROP:
        return <CropPanel editorRef={editorRef} />;
      case ToolType.FILTER:
        return <FilterPanel editorRef={editorRef} />;
      case ToolType.FINETUNE:
        return <FinetunePanel editorRef={editorRef} />;
      case ToolType.ANNOTATE:
        return <AnnotatePanel editorRef={editorRef} />;
      case ToolType.FRAME:
        return <FramePanel editorRef={editorRef} />;
      case ToolType.RESIZE:
        return <ResizePanel editorRef={editorRef} />;
      case ToolType.REDACT:
        return <RedactPanel editorRef={editorRef} />;
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <TopBar
        editorRef={editorRef}
        onOpenImage={handleOpenImage}
        onExport={handleExport}
        canUndo={state.canUndo}
        canRedo={state.canRedo}
        onUndo={undo}
        onRedo={redo}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        exportFormat={state.exportFormat}
        setExportFormat={setExportFormat}
        onReset={resetEditor}
      />

      <div className="app-content">
        <LeftSidebar
          currentTool={state.currentTool}
          onToolChange={handleToolChange}
          isImageLoaded={state.isImageLoaded}
        />

        <div className="canvas-container">
          <ImageEditorCanvas
            ref={editorRef}
            onImageLoaded={handleImageLoaded}
            onEditComplete={handleEditComplete}
          />
          {!state.isImageLoaded && (
            <div className="placeholder-overlay">
              <div className="placeholder">
                <div className="placeholder-icon e-icons e-image"></div>
                <div className="placeholder-text">
                  <p>No image loaded</p>
                  <p style={{ fontSize: '14px', color: '#666' }}>
                    Click "Open" or drag and drop an image to start editing
                  </p>
                </div>
                <ButtonComponent cssClass="placeholder-btn" onClick={openFileDialog}>
                  <span className="top-icon e-icons e-folder" aria-hidden="true" />
                  Open Image
                </ButtonComponent>
              </div>
            </div>
          )}
        </div>

        {/* Tool panels rendered based on currentTool */}
        <div className={`tool-panel-container ${state.currentTool !== ToolType.NONE ? 'visible' : ''}`}>
          {state.currentTool !== ToolType.NONE && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between',color:'#333', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}>
                  {state.currentTool.charAt(0).toUpperCase() + state.currentTool.slice(1)} Tools
                </h3>
                <ButtonComponent
                  cssClass="tool-btn small"
                  onClick={() => setCurrentTool(ToolType.NONE)}
                >
                  ✕
                </ButtonComponent>
              </div>
              {renderToolPanel()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;



import React, { useEffect, useRef } from 'react';
import { registerLicense } from '@syncfusion/ej2-base';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { SidebarComponent } from '@syncfusion/ej2-react-navigations';
import { ImageEditorCanvas } from './components/ImageEditorCanvas';
import { TopBar } from './components/TopBar';
import { LeftSidebar } from './components/LeftSidebar';
import { ZoomControls } from './components/ZoomControls';
import { CropPanel } from './components/tools/CropPanel';
import { FilterPanel } from './components/tools/FilterPanel';
import { FinetunePanel } from './components/tools/FinetunePanel';
import { AnnotatePanel } from './components/tools/AnnotatePanel';
import { FramePanel } from './components/tools/FramePanel';
import { ResizePanel } from './components/tools/ResizePanel';
import { RedactPanel } from './components/tools/RedactPanel';
import { useImageEditor } from './hooks/useImageEditor';
import type { ZoomSettingsModel } from '@syncfusion/ej2-react-image-editor';
import { ToolType } from './types/imageEditor.types';
import './App.css';
// Syncfusion theme styles for Bootstrap5
import '@syncfusion/ej2-base/styles/bootstrap5.css';
import '@syncfusion/ej2-react-buttons/styles/bootstrap5.css';
import '@syncfusion/ej2-react-inputs/styles/bootstrap5.css';
import '@syncfusion/ej2-react-navigations/styles/bootstrap5.css';

// Register Syncfusion license (use trial license or your own license key)
registerLicense('YOUR_LICENSE_KEY_HERE'); // TODO: Replace with actual license

const FooterBar = React.memo(function FooterBar() {
  return (
    <div className="footer">
      <div className="footer-container">
        <div className="image-icon e-icons e-image">
          {/* You could also use a proper photo/camera/picture icon class if available */}
        </div>
        <div className="footer-content">
          <div className="title">
            <span>Want a powerful photo editor in your app? 
              <span style={{marginLeft:'5px'}}>Try our Image Editor SDK
              — crop, rotate, annotate, draw & Frame images!</span>
            </span>
          </div>
          <div className="buttons">
            <button
              type="button"
              className="footer-trial-btn"
              onClick={() =>
                window.open(
                  'https://www.syncfusion.com/downloads/react?tag=es-freetools-organizational-chart-sample-ads-trial',
                  '_blank'
                )
              }
            >
              Start Free Trial
            </button>
            <button
              type="button"
              className="footer-demo-btn"
              onClick={() =>
                window.open(
                  'https://www.syncfusion.com/request-demo?tag=es-freetools-image-editor-sample-demo-promotion',
                  '_blank'
                )
              }
            >
              Request Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

function App() {
  const sidebarRef = useRef<SidebarComponent>(null);
  const lastToolRef = useRef<ToolType>(ToolType.CROP);
  const zoomSettings: ZoomSettingsModel = {
    // min 10% (0.1), max 500% (5.0)
    minZoomFactor: 0.1,
    maxZoomFactor: 5,
    zoomFactor: 1,
  };

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
    setZoom,
    resetEditor,
  } = useImageEditor(zoomSettings);

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
  const handleExport = () => {
    // Called after export
  };

  const handleToolChange = (tool: ToolType) => {
    // Toggle tool off if clicking the same tool
    setCurrentTool(state.currentTool === tool ? ToolType.NONE : tool);
  };

  // Keep track of last selected tool so we can reopen the same panel
  useEffect(() => {
    if (state.currentTool !== ToolType.NONE) {
      lastToolRef.current = state.currentTool;
    }
  }, [state.currentTool]);

  const handleDockToggle = () => {
    // If sidebar is open, collapse to dock; if docked, expand to last tool
    if (state.currentTool !== ToolType.NONE) {
      setCurrentTool(ToolType.NONE);
    } else {
      setCurrentTool(lastToolRef.current ?? ToolType.CROP);
    }
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer?.files?.[0];
    if (file && editorRef.current) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        editorRef.current?.open(imageData);
        setImageLoaded(true);
        updateUndoRedoState();
      };
      reader.readAsDataURL(file);
    }
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
      {state.isImageLoaded && (
        <TopBar
          editorRef={editorRef}
          onExport={handleExport}
          canUndo={state.canUndo}
          canRedo={state.canRedo}
          onUndo={undo}
          onRedo={redo}
          exportFormat={state.exportFormat}
          setExportFormat={setExportFormat}
          onReset={resetEditor}
        />
      )}

      <div className={`app-content ${state.currentTool !== ToolType.NONE ? 'tool-open' : ''}`}>
        {state.isImageLoaded && (
          <LeftSidebar
            currentTool={state.currentTool}
            onToolChange={handleToolChange}
            onOpenImage={openFileDialog}
            isImageLoaded={state.isImageLoaded}
          />
        )}

        <div className="canvas-container">
          <ImageEditorCanvas
            ref={editorRef}
            onImageLoaded={handleImageLoaded}
            onEditComplete={handleEditComplete}
            zoomSettings={zoomSettings}
          />
          {state.isImageLoaded && (
            <ZoomControls
              onZoomIn={zoomIn}
              onZoomOut={zoomOut}
              zoomLevel={state.zoomLevel}
              onSetZoom={setZoom}
              minZoom={zoomSettings.minZoomFactor}
              maxZoom={zoomSettings.maxZoomFactor}
            />
          )}
          {!state.isImageLoaded && (
            <div
              className="placeholder-overlay uploader-overlay"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="uploader-dropzone">
                <div className="uploader-content">
                  <ButtonComponent cssClass="e-primary upload-btn uploader-button" iconCss='e-icons e-upload-1' onClick={openFileDialog}>
                    Upload a File
                  </ButtonComponent>

                  <p className="uploader-hint">Or drop files here</p>
                  <p className="uploader-sub">Supported formats: JPEG, PNG, WEBP, SVG</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tool panels rendered using Syncfusion Sidebar */}
        <SidebarComponent
          ref={sidebarRef}
          position="Right"
          type="Push"
          width="330px"
          dockSize="50px"
          enableDock={true}
          mediaQuery="(min-width: 640px)"
          className='right-sidebar'
          target=".app-content"
          enableGestures={false}
          showBackdrop={false}
          isOpen={state.currentTool !== ToolType.NONE}
        >
          {/* Toggle visible on the sidebar edge (docked or open) */}
          <button
            className={`sidebar-toggle  ${state.currentTool !== ToolType.NONE ? 'open' : 'collapsed'}`}
            aria-label={state.currentTool !== ToolType.NONE ? 'Collapse tool panel' : 'Expand tool panel'}
            onClick={handleDockToggle}
            type="button"
          >
            <span className={`e-icons ${state.currentTool !== ToolType.NONE ? 'e-show-hide-panel' : 'e-show-side-panel'}`} />
          </button>
          {state.currentTool !== ToolType.NONE && (
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color:'#333', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}>
                  {state.currentTool.charAt(0).toUpperCase() + state.currentTool.slice(1)} Tools
                </h3>
                <ButtonComponent
                  cssClass="tool-btn small"
                  iconCss='e-icons e-close'
                  onClick={() => setCurrentTool(ToolType.NONE)}
                >
                </ButtonComponent>
              </div>
              {renderToolPanel()}
            </div>
          )}
        </SidebarComponent>
      </div>
      <FooterBar />
    </div>
  );
}

export default App;



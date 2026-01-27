import type { TopBarProps } from '../types/imageEditor.types';
import './styles/TopBar.css';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { useId } from 'react';

export const TopBar = ({
    editorRef,
    onOpenImage,
    onExport,
    canUndo,
    canRedo,
    onUndo,
    onRedo,
    onZoomIn,
    onZoomOut,
    exportFormat,
    setExportFormat,
    onReset,
}: TopBarProps) => {
    const selectId = useId();
    const handleOpenClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file && editorRef.current) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const imageData = event.target?.result as string;
                    editorRef.current?.open(imageData);
                    onOpenImage();
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    const handleExportClick = () => {
        const fmt = exportFormat || 'PNG';
        const filename = `edited-image`;
        editorRef.current?.export(fmt, filename);
        onExport();
    };

    return (
        <div className="top-bar">
            <div className="top-bar-left">
                <h1 className="app-title">Image Editor</h1>
            </div>

            <div className="top-bar-center">
                <ButtonComponent cssClass="top-bar-btn" onClick={handleOpenClick} title="Open Image">
                    <span className="top-icon e-icons e-folder" aria-hidden="true" />
                    Open
                </ButtonComponent>

                <div className="divider"></div>

                <ButtonComponent
                    cssClass="top-bar-btn"
                    onClick={onUndo}
                    disabled={!canUndo}
                    title="Undo (Ctrl+Z)"
                >
                    <span className="top-icon e-icons e-undo" aria-hidden="true" />
                    Undo
                </ButtonComponent>
                <ButtonComponent
                    cssClass="top-bar-btn"
                    onClick={onRedo}
                    disabled={!canRedo}
                    title="Redo (Ctrl+Y)"
                >
                    <span className="top-icon e-icons e-redo" aria-hidden="true" />
                    Redo
                </ButtonComponent>

                <div className="divider"></div>

                <ButtonComponent cssClass="top-bar-btn" onClick={onZoomOut} title="Zoom Out">
                    <span className="top-icon e-icons e-zoom-out" aria-hidden="true" />
                    Zoom Out
                </ButtonComponent>
                <ButtonComponent cssClass="top-bar-btn" onClick={onZoomIn} title="Zoom In">
                    <span className="top-icon e-icons e-zoom-in" aria-hidden="true" />
                    Zoom In
                </ButtonComponent>
                <div style={{ marginLeft: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label htmlFor={selectId} style={{ fontSize: '13px', color: '#ffffff' }}>Format:</label>
                    <select
                        id={selectId}
                        value={exportFormat}
                        onChange={(e) => setExportFormat(e.target.value)}
                        className='format-select'
                        style={{ padding: '6px', borderRadius: '6px',background:'#046ae5' }}
                        title="Select export format"
                    >
                        <option value="PNG">PNG</option>
                        <option value="JPEG">JPEG</option>
                        <option value="WEBP">WEBP</option>
                        <option value="SVG">SVG</option>
                        <option value="BMP">BMP</option>
                    </select>
                </div>
            </div>
            

            <div className="top-bar-right">
                <ButtonComponent
                    cssClass="top-bar-btn"
                    onClick={onReset}
                    title="Reset to original (discard all changes)"
                >
                    <span className="top-icon e-icons e-refresh" aria-hidden="true" />
                    Reset
                </ButtonComponent>
                <ButtonComponent cssClass="top-bar-btn primary" onClick={handleExportClick} title="Export Image">
                    <span className="top-icon e-icons e-save" aria-hidden="true" />
                    Export
                </ButtonComponent>
            </div>
        </div>
    );
};

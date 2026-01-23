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
                    📂 Open
                </ButtonComponent>

                <div className="divider"></div>

                <ButtonComponent
                    cssClass="top-bar-btn"
                    onClick={onUndo}
                    disabled={!canUndo}
                    title="Undo (Ctrl+Z)"
                >
                    ↶ Undo
                </ButtonComponent>
                <ButtonComponent
                    cssClass="top-bar-btn"
                    onClick={onRedo}
                    disabled={!canRedo}
                    title="Redo (Ctrl+Y)"
                >
                    ↷ Redo
                </ButtonComponent>

                <div className="divider"></div>

                <ButtonComponent cssClass="top-bar-btn" onClick={onZoomOut} title="Zoom Out">
                    🔍−
                </ButtonComponent>
                <ButtonComponent cssClass="top-bar-btn" onClick={onZoomIn} title="Zoom In">
                    🔍+
                </ButtonComponent>
                <div style={{ marginLeft: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label htmlFor={selectId} style={{ fontSize: '13px', color: '#444' }}>Format:</label>
                    <select
                        id={selectId}
                        value={exportFormat}
                        onChange={(e) => setExportFormat(e.target.value)}
                        style={{ padding: '6px', borderRadius: '6px' }}
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
                    🔄 Reset
                </ButtonComponent>
                <ButtonComponent cssClass="top-bar-btn primary" onClick={handleExportClick} title="Export Image">
                    💾 Export
                </ButtonComponent>
            </div>
        </div>
    );
};

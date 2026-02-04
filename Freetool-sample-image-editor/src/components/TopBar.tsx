import type { TopBarProps } from '../types/imageEditor.types';
import './styles/TopBar.css';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { useState, useRef, useEffect } from 'react';

export const TopBar = ({
    editorRef,
    onExport,
    canUndo,
    canRedo,
    onUndo,
    onRedo,
    setExportFormat,
    onReset,
}: TopBarProps) => {
    // const selectId = useId(); // No longer needed
    const [showFormatMenu, setShowFormatMenu] = useState(false);
    const formatMenuRef = useRef<HTMLDivElement>(null);

    // Hide format menu when clicking outside
    useEffect(() => {
        if (!showFormatMenu) return;
        function handleClickOutside(event: MouseEvent) {
            if (formatMenuRef.current && !formatMenuRef.current.contains(event.target as Node)) {
                setShowFormatMenu(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showFormatMenu]);
    

    const handleExportClick = () => {
        setShowFormatMenu((prev) => !prev);
    };

    const handleFormatSelect = (fmt: string) => {
        setExportFormat(fmt);
        setShowFormatMenu(false);
        const filename = `edited-image`;
        editorRef.current?.export(fmt, filename);
        onExport();
    };

    // exportFormat is only used for the select, which is now removed, so we don't need to reference it directly here
    return (
        <div className="top-bar">
            <div className="top-bar-left">
                <h1 className="app-title">Image Editor</h1>
            </div>

            <div className="top-bar-center">

                <ButtonComponent
                    cssClass="top-bar-btn"
                    onClick={onUndo}
                    disabled={!canUndo}
                    title="Undo (Ctrl+Z)"
                    iconCss='e-icons e-undo'
                >
                    
                </ButtonComponent>
                <ButtonComponent
                    cssClass="top-bar-btn"
                    onClick={onRedo}
                    disabled={!canRedo}
                    title="Redo (Ctrl+Y)"
                    iconCss='e-icons e-redo'
                >

                   
                </ButtonComponent>

                {/* Zoom controls moved to bottom-left toolbar */}
            </div>

            <div className="top-bar-right" style={{ position: 'relative' }}>
                <ButtonComponent
                    cssClass="top-bar-btn"
                    onClick={onReset}
                    iconCss='e-icons e-reset'
                    title="Reset to original (discard all changes)"
                >
                    Reset
                </ButtonComponent>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <ButtonComponent cssClass="top-bar-btn primary" iconCss='e-icons e-save' onClick={handleExportClick} title="Export Image">
                        Export
                    </ButtonComponent>
                    {showFormatMenu && (
                        <div
                            ref={formatMenuRef}
                            className="export-format-menu"
                        >
                            <div
                                className="export-format-option"
                                onClick={() => handleFormatSelect('PNG')}
                            >
                                PNG (.png)
                            </div>
                            <div
                                className="export-format-option"
                                onClick={() => handleFormatSelect('JPEG')}
                            >
                                JPEG (.jpeg)
                            </div>
                            <div
                                className="export-format-option"
                                onClick={() => handleFormatSelect('WEBP')}
                            >
                                WEBP (.webp)
                            </div>
                            <div
                                className="export-format-option"
                                onClick={() => handleFormatSelect('SVG')}
                            >
                                SVG (.svg)
                            </div>
                            <div
                                className="export-format-option"
                                onClick={() => handleFormatSelect('BMP')}
                            >
                                BMP (.bmp)
                            </div>
                        </div>
                    )}
                </div>
                <div className="help-pane-content">
                    <img
                        className="syncfusion-logo"
                        src="https://static.syncfusion.com/wp-content/free-tools/document-editor-online-app/online-docx-editor/icons/Syncfusion-Logo.svg"
                        alt="Syncfusion"
                    />
                    <span className="help-text">Powered by&nbsp;</span>
                    <a
                        className="free-tools-sample-explore-btn"
                        href="https://www.syncfusion.com/react-components/react-image-editor"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Syncfusion Image Editor SDK
                    </a>
                </div>
            </div>
        </div>
    );
};

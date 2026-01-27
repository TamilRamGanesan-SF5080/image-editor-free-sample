import type { ToolPanelProps } from '../../types/imageEditor.types';
import { useState } from 'react';
import '../styles/ToolPanel.css';
import { NumericTextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { CheckBoxComponent, ButtonComponent } from '@syncfusion/ej2-react-buttons';

export const ResizePanel = ({ editorRef }: ToolPanelProps) => {
    const [width, setWidth] = useState(800);
    const [height, setHeight] = useState(600);
    const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);

    const handleResize = () => {
        if (!editorRef.current) return;
        editorRef.current.resize(width, height, maintainAspectRatio);
    };

    const handleWidthChange = (newWidth: number) => {
        setWidth(newWidth);
        if (maintainAspectRatio && width > 0) {
            const aspectRatio = height / width;
            setHeight(Math.round(newWidth * aspectRatio));
        }
    };

    const handleHeightChange = (newHeight: number) => {
        setHeight(newHeight);
        if (maintainAspectRatio && height > 0) {
            const aspectRatio = width / height;
            setWidth(Math.round(newHeight * aspectRatio));
        }
    };

    // Preset sizes
    const presets = [
        { label: 'Instagram Square', width: 1080, height: 1080 },
        { label: 'Instagram Portrait', width: 1080, height: 1350 },
        { label: 'Facebook Post', width: 1200, height: 630 },
        { label: 'Twitter Header', width: 1500, height: 500 },
        { label: 'YouTube Thumbnail', width: 1280, height: 720 },
    ];

    const applyPreset = (presetWidth: number, presetHeight: number) => {
        setWidth(presetWidth);
        setHeight(presetHeight);
    };

    return (
        <div className="tool-panel">
            <div className="panel-section">
                <h4 className="section-title">Dimensions</h4>

                <div className="style-row">
                    <label className="style-label">Width (px)</label>
                    <NumericTextBoxComponent
                        value={width}
                        min={1}
                        format='n0'
                        change={(e: any) => handleWidthChange(Number(e?.value ?? width))}
                        width={'100%'}
                    />
                </div>

                <div className="style-row">
                    <label className="style-label">Height (px)</label>
                    <NumericTextBoxComponent
                        value={height}
                        min={1}
                        format='n0'
                        change={(e: any) => handleHeightChange(Number(e?.value ?? height))}
                        width={'100%'}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                    <CheckBoxComponent
                        label="Maintain aspect ratio"
                        checked={maintainAspectRatio}
                        change={(e: any) => setMaintainAspectRatio(!!e?.checked)}
                    />
                </div>

                <ButtonComponent cssClass="tool-btn primary full-width" onClick={handleResize}>
                    <span className="top-icon e-icons e-resize" aria-hidden="true" />
                     Apply Resize
                </ButtonComponent>
            </div>

            <div className="panel-section">
                <h4 className="section-title">Presets</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {presets.map((preset) => (
                        <ButtonComponent
                            key={preset.label}
                            cssClass="tool-btn"
                            onClick={() => applyPreset(preset.width, preset.height)}
                        >
                            {preset.label} ({preset.width}×{preset.height})
                        </ButtonComponent>
                    ))}
                </div>
            </div>
        </div>
    );
};

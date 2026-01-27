import type { ToolPanelProps } from '../../types/imageEditor.types';
import { useState } from 'react';
import '../styles/ToolPanel.css';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { ColorPickerComponent, SliderComponent } from '@syncfusion/ej2-react-inputs';

type FrameType = 'None' | 'Mat' | 'Bevel' | 'Line' | 'Hook' | 'Inset';

export const FramePanel = ({ editorRef }: ToolPanelProps) => {
    const [activeFrame, setActiveFrame] = useState<FrameType>('None');
    const [frameColor, setFrameColor] = useState('#FFFFFF');
    const [frameSize, setFrameSize] = useState(20);
    const [showFramePicker, setShowFramePicker] = useState(false);

    const frames: { type: FrameType; iconClass: string; description: string }[] = [
        { type: 'None', iconClass: 'e-frame-none', description: 'No frame' },
        { type: 'Mat', iconClass: 'e-frame-mat', description: 'Mat frame' },
        { type: 'Bevel', iconClass: 'e-frame-bevel', description: 'Bevel frame' },
        { type: 'Hook', iconClass: 'e-frame-hook', description: 'Hook frame' },
        { type: 'Inset', iconClass: 'e-frame-inset', description: 'Inset frame' },
    ];

    const applyFrame = (frameType: FrameType) => {
        if (!editorRef.current) return;

        setActiveFrame(frameType);

        if (frameType === 'None') {
            // Reset or remove frame (Syncfusion may not have a direct remove, so apply default)
            return;
        }

        editorRef.current.drawFrame(
            frameType,
            frameColor,
            undefined, // gradientColor
            frameSize,
            undefined, // inset
            undefined, // offset
            undefined, // borderRadius
            undefined, // frameLineStyle
            undefined  // lineCount
        );
    };

    return (
        <div className="tool-panel">
            <div className="panel-section">
                <h4 className="section-title">Frame Types</h4>
                <div className="filter-grid">
                    {frames.map((frame) => (
                        <ButtonComponent
                            key={frame.type}
                            cssClass={`filter-btn ${activeFrame === frame.type ? 'active' : ''}`}
                            onClick={() => applyFrame(frame.type)}
                            title={frame.description}
                        >
                            <span className={`filter-icon e-icons ${frame.iconClass}`} aria-hidden="true" />
                            <span className="filter-name">{frame.type}</span>
                        </ButtonComponent>
                    ))}
                </div>
            </div>

            {activeFrame !== 'None' && (
                <>
                    <div className="panel-section">
                        <h4 className="section-title">Frame Color</h4>
                        <div className="style-row">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div
                                    aria-label="Selected frame color"
                                    style={{
                                        width: '28px',
                                        height: '18px',
                                        borderRadius: '4px',
                                        border: '1px solid var(--border-color, #555)',
                                        background: frameColor,
                                    }}
                                />
                                <ButtonComponent
                                    cssClass="tool-btn small"
                                    onClick={() => setShowFramePicker((v) => !v)}
                                >
                                    Pick
                                </ButtonComponent>
                            </div>
                        </div>
                        {showFramePicker && (
                            <div
                                style={{ marginTop: '8px' }}
                                onClick={(evt) => {
                                    const el = evt.target as HTMLElement;
                                    if (el.closest('.e-apply') || el.closest('.e-cancel')) {
                                        setShowFramePicker(false);
                                    }
                                }}
                            >
                                <ColorPickerComponent
                                    value={frameColor}
                                    inline={true}
                                    showButtons={true}
                                    change={(e: any) => {
                                        const next = String(e?.currentValue?.hex ?? frameColor);
                                        setFrameColor(next);
                                        applyFrame(activeFrame);
                                        // Close on apply
                                        setShowFramePicker(false);
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="panel-section">
                        <div className="style-row">
                            <label className="style-label">Frame Size: {frameSize}px</label>
                            <SliderComponent
                                min={5}
                                max={100}
                                value={frameSize}
                                change={(e: any) => {
                                    setFrameSize(Number(e?.value ?? frameSize));
                                    applyFrame(activeFrame);
                                }}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

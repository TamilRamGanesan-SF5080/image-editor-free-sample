import type { ToolPanelProps } from '../../types/imageEditor.types';
import { useState } from 'react';
import '../styles/ToolPanel.css';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { SliderComponent } from '@syncfusion/ej2-react-inputs';
import { ImageEditorComponent, RedactType } from '@syncfusion/ej2-react-image-editor';

export const RedactPanel = ({ editorRef }: ToolPanelProps) => {
    const [redactType, setRedactType] = useState<'Blur' | 'Pixelate'>('Blur');
    const [blurIntensity, setBlurIntensity] = useState(20);     // default from docs
    const [pixelSize, setPixelSize] = useState(20);             // default from docs

    const getSafeEditor = (): ImageEditorComponent | null => {
        if (!editorRef.current) {
            alert('Editor not ready yet');
            return null;
        }
        return editorRef.current;
    };

    const handleApplyRedact = () => {
        const editor = getSafeEditor();
        if (!editor) return;

        try {
            // Get image dimensions to place redaction sensibly in visible area
            const dimRaw = editor.getImageDimension?.();
const dim: any = dimRaw && dimRaw.width > 0 
    ? dimRaw as any 
    : { x: 50, y: 50, width: 400, height: 300 };

// Then use dim.x, dim.y safely

            const centerX = dim.x + dim.width / 4;   // slightly left of center
            const centerY = dim.y + dim.height / 4;
            const rectWidth = Math.min(200, dim.width * 0.4);
            const rectHeight = Math.min(150, dim.height * 0.4);

            const type = redactType === 'Blur' ? RedactType.Blur : RedactType.Pixelate;
            const value = redactType === 'Blur' ? blurIntensity : pixelSize;

            console.log(`Applying ${redactType} redaction at:`, { centerX, centerY, rectWidth, rectHeight, value });

            // Correct method call
            editor.drawRedact(
                type,           // RedactType.Blur | RedactType.Pixelate
                centerX,
                centerY,
                rectWidth,
                rectHeight,
                value           // blurIntensity or pixelSize
            );

            console.log('Redaction added');
        } catch (error) {
            console.error('Failed to add redaction:', error);
            alert(`Error adding redaction: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    const handleDeleteLastRedact = () => {
        const editor = getSafeEditor();
        if (!editor) return;

        try {
            const redacts = editor.getRedacts();

            if (!redacts || redacts.length === 0) {
                alert('No redactions present to delete.');
                return;
            }

            // Delete the most recently added (last in array)
            const lastRedact = redacts[redacts.length - 1];
            editor.deleteRedact(lastRedact.id);

            console.log(`Deleted redaction ID: ${lastRedact.id}`);
        } catch (error) {
            console.error('Failed to delete redaction:', error);
            alert(`Error deleting redaction: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    return (
        <div className="tool-panel">
            <div className="panel-section">
                <h4 className="section-title">Redaction Type</h4>
                <div className="button-grid">
                    <ButtonComponent
                        cssClass={`tool-btn ${redactType === 'Blur' ? 'active' : ''}`}
                        onClick={() => setRedactType('Blur')}
                    >
                        🌫️ Blur
                    </ButtonComponent>
                    <ButtonComponent
                        cssClass={`tool-btn ${redactType === 'Pixelate' ? 'active' : ''}`}
                        onClick={() => setRedactType('Pixelate')}
                    >
                        ◻️ Pixelate
                    </ButtonComponent>
                </div>
            </div>

            {redactType === 'Blur' && (
                <div className="panel-section">
                    <div className="style-row">
                        <label className="style-label">Blur Intensity: {blurIntensity}</label>
                        <SliderComponent
                            min={1}
                            max={50}
                            value={blurIntensity}
                            change={(e: any) => setBlurIntensity(Number(e?.value ?? blurIntensity))}
                        />
                    </div>
                </div>
            )}

            {redactType === 'Pixelate' && (
                <div className="panel-section">
                    <div className="style-row">
                        <label className="style-label">Pixel Size: {pixelSize}px</label>
                        <SliderComponent
                            min={2}
                            max={50}
                            value={pixelSize}
                            change={(e: any) => setPixelSize(Number(e?.value ?? pixelSize))}
                        />
                    </div>
                </div>
            )}

            <div className="panel-section">
                <ButtonComponent
                    cssClass="tool-btn primary full-width"
                    onClick={handleApplyRedact}
                >
                    🔒 Add Redaction
                </ButtonComponent>

                <ButtonComponent
                    cssClass="tool-btn danger full-width"
                    onClick={handleDeleteLastRedact}
                    style={{ marginTop: '12px' }}
                >
                    🗑️ Delete Last Redaction
                </ButtonComponent>
            </div>

            <div className="panel-section" style={{ borderBottom: 'none' }}>
                <p style={{ fontSize: '12px', color: '#999', lineHeight: '1.5' }}>
                    💡 <strong>Tip:</strong> Use redaction to hide sensitive information like faces,
                    license plates, or personal data before sharing images.<br />
                    <small>Redactions are placed near the top-left center of the visible image area.</small>
                </p>
            </div>
        </div>
    );
};
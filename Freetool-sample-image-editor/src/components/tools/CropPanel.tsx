import type { ToolPanelProps } from '../../types/imageEditor.types';
import { useState } from 'react';
import '../styles/ToolPanel.css';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';

export const CropPanel = ({ editorRef }: ToolPanelProps) => {
    const [aspectRatio, setAspectRatio] = useState<string>('free');

    const handleCrop = (ratio?: string) => {
        if (!editorRef.current) return;

        setAspectRatio(ratio || 'free');

        // Apply selection based on ratio
        switch (ratio) {
            case '1:1':
                editorRef.current.select('square');
                break;
            case '4:3':
                editorRef.current.select('custom', undefined, undefined, 400, 300);
                break;
            case '16:9':
                editorRef.current.select('custom', undefined, undefined, 1600, 900);
                break;
            case 'circle':
                editorRef.current.select('circle');
                break;
            default:
                editorRef.current.select('custom');
        }
    };

    const handleApplyCrop = () => {
        editorRef.current?.crop();
    };

    const handleRotate = (degree: number) => {
        editorRef.current?.rotate(degree);
    };

    const handleFlip = (direction: 'Horizontal' | 'Vertical') => {
        editorRef.current?.flip(direction);
    };

    return (
        <div className="tool-panel">
            <div className="panel-section">
                <h4 className="section-title">Aspect Ratio</h4>
                <div className="button-grid">
                    <ButtonComponent
                        cssClass={`tool-btn ${aspectRatio === 'free' ? 'active' : ''}`}
                        onClick={() => handleCrop('free')}
                    >
                        Free
                    </ButtonComponent>
                    <ButtonComponent
                        cssClass={`tool-btn ${aspectRatio === '1:1' ? 'active' : ''}`}
                        onClick={() => handleCrop('1:1')}
                    >
                        1:1
                    </ButtonComponent>
                    <ButtonComponent
                        cssClass={`tool-btn ${aspectRatio === '4:3' ? 'active' : ''}`}
                        onClick={() => handleCrop('4:3')}
                    >
                        4:3
                    </ButtonComponent>
                    <ButtonComponent
                        cssClass={`tool-btn ${aspectRatio === '16:9' ? 'active' : ''}`}
                        onClick={() => handleCrop('16:9')}
                    >
                        16:9
                    </ButtonComponent>
                    <ButtonComponent
                        cssClass={`tool-btn ${aspectRatio === 'circle' ? 'active' : ''}`}
                        onClick={() => handleCrop('circle')}
                    >
                        Circle
                    </ButtonComponent>
                </div>
                    <ButtonComponent cssClass="tool-btn primary full-width" onClick={handleApplyCrop}>
                        <span className="tool-icon e-icons e-crop" aria-hidden="true"/>
                        Apply Crop
                    </ButtonComponent>
            </div>

            <div className="panel-section">
                <h4 className="section-title">Transform</h4>
                <div className="button-grid">
                    <ButtonComponent cssClass="tool-btn" onClick={() => handleRotate(90)}>
                        <span className="tool-icon e-icons e-rotate-right" aria-hidden="true" />
                        Rotate 90°
                    </ButtonComponent>
                    <ButtonComponent cssClass="tool-btn" onClick={() => handleRotate(-90)}>
                        <span className="tool-icon e-icons e-rotate-left" aria-hidden="true" />
                        Rotate -90°
                    </ButtonComponent>
                    <ButtonComponent cssClass="tool-btn" onClick={() => handleFlip('Horizontal')}>
                        <span className="tool-icon e-icons e-flip-horizontal" aria-hidden="true" />
                        Flip H
                    </ButtonComponent>
                    <ButtonComponent cssClass="tool-btn" onClick={() => handleFlip('Vertical')}>
                        <span className="tool-icon e-icons e-flip-vertical" aria-hidden="true" />
                        Flip V
                    </ButtonComponent>
                </div>
            </div>
        </div>
    );
};

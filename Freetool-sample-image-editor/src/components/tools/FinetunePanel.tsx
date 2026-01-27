import type { ToolPanelProps } from '../../types/imageEditor.types';
import { useState } from 'react';
import '../styles/ToolPanel.css';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { SliderComponent } from '@syncfusion/ej2-react-inputs';

type FinetuneOption = 'Brightness' | 'Contrast' | 'Saturation' | 'Hue' | 'Exposure' | 'Blur' | 'Opacity';

interface AdjustmentSetting {
    label: string;
    option: FinetuneOption;
    min: number;
    max: number;
    default: number;
    step: number;
    iconClass: string;
}

export const FinetunePanel = ({ editorRef }: ToolPanelProps) => {
    const [values, setValues] = useState<Record<FinetuneOption, number>>({
        Brightness: 0,
        Contrast: 0,
        Saturation: 0,
        Hue: 0,
        Exposure: 0,
        Blur: 0,
        Opacity: 100,
    });

    const adjustments: AdjustmentSetting[] = [
        { label: 'Brightness', option: 'Brightness', min: -100, max: 100, default: 0, step: 1, iconClass: 'e-brightness' },
        { label: 'Contrast', option: 'Contrast', min: -100, max: 100, default: 0, step: 1, iconClass: 'e-contrast' },
        { label: 'Saturation', option: 'Saturation', min: -100, max: 100, default: 0, step: 1, iconClass: 'e-saturation' },
        { label: 'Hue', option: 'Hue', min: 0, max: 360, default: 0, step: 1, iconClass: 'e-chart' },
        { label: 'Exposure', option: 'Exposure', min: -100, max: 100, default: 0, step: 1, iconClass: 'e-display' },
        { label: 'Blur', option: 'Blur', min: 0, max: 100, default: 0, step: 1, iconClass: 'e-export-png' },
        { label: 'Opacity', option: 'Opacity', min: 0, max: 100, default: 100, step: 1, iconClass: 'e-opacity' },
    ];

    const handleAdjustment = (option: FinetuneOption, value: number) => {
        if (!editorRef.current) return;

        setValues(prev => ({ ...prev, [option]: value }));
        editorRef.current.finetuneImage(option, value);
    };

    const handleReset = () => {
        adjustments.forEach(adj => {
            handleAdjustment(adj.option, adj.default);
        });
    };

    return (
        <div className="tool-panel">
            <div className="panel-section">
                <div className="section-header">
                    <h4 className="section-title">Fine-tune</h4>
                    <ButtonComponent cssClass="tool-btn small" onClick={handleReset}>
                        Reset All
                    </ButtonComponent>
                </div>

                <div className="adjustments-list">
                    {adjustments.map((adj) => (
                        <div key={adj.option} className="adjustment-item">
                            <div className="adjustment-header">
                                <span className={`adjustment-icon e-icons ${adj.iconClass}`} aria-hidden="true" />
                                <span className="adjustment-label">{adj.label}</span>
                                <span className="adjustment-value">{values[adj.option]}</span>
                            </div>
                            <SliderComponent
                                min={adj.min}
                                max={adj.max}
                                step={adj.step}
                                value={values[adj.option]}
                                change={(e: any) => handleAdjustment(adj.option, Number(e?.value ?? values[adj.option]))}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

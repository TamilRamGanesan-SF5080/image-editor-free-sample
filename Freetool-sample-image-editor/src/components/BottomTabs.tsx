import { ToolType } from '../types/imageEditor.types';
import type { BottomTabsProps } from '../types/imageEditor.types';
import './styles/BottomTabs.css';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';

export const BottomTabs = ({ currentTool, onToolChange, isImageLoaded }: BottomTabsProps) => {
    const tabs = [
        { id: ToolType.CROP, label: '✂️ Crop', icon: '✂️' },
        { id: ToolType.FILTER, label: '🎨 Filter', icon: '🎨' },
        { id: ToolType.FINETUNE, label: '⚙️ Adjust', icon: '⚙️' },
        { id: ToolType.ANNOTATE, label: '✏️ Annotate', icon: '✏️' },
        { id: ToolType.FRAME, label: '🖼️ Frame', icon: '🖼️' },
        { id: ToolType.RESIZE, label: '📐 Resize', icon: '📐' },
        { id: ToolType.REDACT, label: '🔒 Redact', icon: '🔒' },
    ];

    return (
        <div className="bottom-tabs">
            {tabs.map((tab) => (
                <ButtonComponent
                    key={tab.id}
                    cssClass={`tab-btn ${currentTool === tab.id ? 'active' : ''} ${!isImageLoaded ? 'disabled' : ''}`}
                    onClick={() => isImageLoaded && onToolChange(tab.id)}
                    disabled={!isImageLoaded}
                    title={tab.label}
                >
                    <span className="tab-icon">{tab.icon}</span>
                    <span className="tab-label">{tab.label.replace(/^.* /, '')}</span>
                </ButtonComponent>
            ))}
        </div>
    );
};

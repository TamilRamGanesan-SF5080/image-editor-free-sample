import { ToolType } from '../types/imageEditor.types';
import type { BottomTabsProps } from '../types/imageEditor.types';
import './styles/LeftSidebar.css';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';

export const LeftSidebar = ({ currentTool, onToolChange, isImageLoaded }: BottomTabsProps) => {
    const tabs = [
        { id: ToolType.CROP, label: 'Crop', icon: '✂️' },
        { id: ToolType.FILTER, label: 'Filter', icon: '🎨' },
        { id: ToolType.FINETUNE, label: 'Adjust', icon: '⚙️' },
        { id: ToolType.ANNOTATE, label: 'Annotate', icon: '✏️' },
        { id: ToolType.FRAME, label: 'Frame', icon: '🖼️' },
        { id: ToolType.RESIZE, label: 'Resize', icon: '📐' },
        { id: ToolType.REDACT, label: 'Redact', icon: '🔒' },
    ];

    return (
        <div className="left-sidebar">
            {tabs.map((tab) => (
                <ButtonComponent
                    key={tab.id}
                    cssClass={`sidebar-btn ${currentTool === tab.id ? 'active' : ''} ${!isImageLoaded ? 'disabled' : ''}`}
                    onClick={() => isImageLoaded && onToolChange(tab.id)}
                    disabled={!isImageLoaded}
                    title={tab.label}
                >
                    <span className="sidebar-icon">{tab.icon}</span>
                    <span className="sidebar-label">{tab.label}</span>
                </ButtonComponent>
            ))}
        </div>
    );
};

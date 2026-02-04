import { ToolType } from '../types/imageEditor.types';
import type { BottomTabsProps } from '../types/imageEditor.types';
import './styles/LeftSidebar.css';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { SidebarComponent } from '@syncfusion/ej2-react-navigations';

export const LeftSidebar = ({ currentTool, onToolChange, isImageLoaded, onOpenImage }: BottomTabsProps) => {
    const tabs = [
        { id: ToolType.CROP, label: 'Crop', iconClass: 'e-crop' },
        { id: ToolType.FILTER, label: 'Filter', iconClass: 'e-filters' },
        { id: ToolType.FINETUNE, label: 'Adjust', iconClass: 'e-adjustment' },
        { id: ToolType.ANNOTATE, label: 'Annotate', iconClass: 'e-edit' },
        { id: ToolType.FRAME, label: 'Frame', iconClass: 'e-frame-custom' },
        { id: ToolType.RESIZE, label: 'Resize', iconClass: 'e-resize' },
        { id: ToolType.REDACT, label: 'Redact', iconClass: 'e-redact' },
    ];

    return (
        <SidebarComponent
            id="leftSidebar"
            width="240px"
            position="Left"
            isOpen={true}
            enableGestures={false}
            showBackdrop={false}
            className="left-sidebar-sidebar"
        >
            <div className="left-sidebar">
                <ButtonComponent
                    cssClass={`sidebar-btn btn-create`}
                    onClick={() => onOpenImage && onOpenImage()}
                    title="Open Image"
                >
                    <span className={`sidebar-icon e-icons e-folder`} aria-hidden="true" />
                    <span className="create">Create New</span>
                </ButtonComponent>

                {tabs.map((tab) => (
                    <ButtonComponent
                        key={tab.id}
                        cssClass={`sidebar-btn ${currentTool === tab.id ? 'active' : ''} ${!isImageLoaded ? 'disabled' : ''}`}
                        onClick={() => isImageLoaded && onToolChange(tab.id)}
                        disabled={!isImageLoaded}
                        title={tab.label}
                    >
                        <span className={`sidebar-icon e-icons ${tab.iconClass}`} aria-hidden="true" />
                        <span className="sidebar-label">{tab.label}</span>
                    </ButtonComponent>
                ))}
            </div>
        </SidebarComponent>
    );
};

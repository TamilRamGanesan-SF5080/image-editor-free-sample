import type { ToolPanelProps } from '../../types/imageEditor.types';
import { useState } from 'react';
import '../styles/ToolPanel.css';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';

type FilterType = 'Default' | 'Chrome' | 'Cold' | 'Warm' | 'Grayscale' | 'Sepia' | 'Invert';

export const FilterPanel = ({ editorRef }: ToolPanelProps) => {
    const [activeFilter, setActiveFilter] = useState<FilterType>('Default');

    const filters: { name: FilterType; iconClass: string; description: string }[] = [
        { name: 'Default', iconClass: 'e-format-painter', description: 'No filter' },
        { name: 'Chrome', iconClass: 'e-ai-chat', description: 'Chrome effect' },
        { name: 'Cold', iconClass: 'e-tint', description: 'Cool tones' },
        { name: 'Warm', iconClass: 'e-brightness', description: 'Warm tones' },
        { name: 'Grayscale', iconClass: 'e-contrast', description: 'Black & white' },
        { name: 'Sepia', iconClass: 'e-file-format', description: 'Vintage sepia' },
        { name: 'Invert', iconClass: 'e-freeze-pane', description: 'Invert colors' },
    ];

    const applyFilter = (filter: FilterType) => {
        if (!editorRef.current) return;

        setActiveFilter(filter);
        editorRef.current.applyImageFilter(filter);
    };

    return (
        <div className="tool-panel">
            <div className="panel-section">
                <h4 className="section-title">Image Filters</h4>
                <div className="filter-grid">
                    {filters.map((filter) => (
                        <ButtonComponent
                            key={filter.name}
                            cssClass={`filter-btn ${activeFilter === filter.name ? 'active' : ''}`}
                            onClick={() => applyFilter(filter.name)}
                            iconCss={`filter-icon e-icons ${filter.iconClass}`}
                            title={filter.description}
                        >
                            {filter.name}
                        </ButtonComponent>
                    ))}
                </div>
            </div>
        </div>
    );
};

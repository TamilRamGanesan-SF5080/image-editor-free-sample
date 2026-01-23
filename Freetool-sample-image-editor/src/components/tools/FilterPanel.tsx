import type { ToolPanelProps } from '../../types/imageEditor.types';
import { useState } from 'react';
import '../styles/ToolPanel.css';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';

type FilterType = 'Default' | 'Chrome' | 'Cold' | 'Warm' | 'Grayscale' | 'Sepia' | 'Invert';

export const FilterPanel = ({ editorRef }: ToolPanelProps) => {
    const [activeFilter, setActiveFilter] = useState<FilterType>('Default');

    const filters: { name: FilterType; icon: string; description: string }[] = [
        { name: 'Default', icon: '🎨', description: 'No filter' },
        { name: 'Chrome', icon: '✨', description: 'Chrome effect' },
        { name: 'Cold', icon: '❄️', description: 'Cool tones' },
        { name: 'Warm', icon: '🔥', description: 'Warm tones' },
        { name: 'Grayscale', icon: '⚫', description: 'Black & white' },
        { name: 'Sepia', icon: '📜', description: 'Vintage sepia' },
        { name: 'Invert', icon: '🔄', description: 'Invert colors' },
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
                            title={filter.description}
                        >
                            <span className="filter-icon">{filter.icon}</span>
                            <span className="filter-name">{filter.name}</span>
                        </ButtonComponent>
                    ))}
                </div>
            </div>
        </div>
    );
};

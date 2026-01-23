import type { ToolPanelProps } from '../../types/imageEditor.types';
import { AnnotationType } from '../../types/imageEditor.types';
import { useState } from 'react';
import '../styles/ToolPanel.css';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { ColorPickerComponent, SliderComponent, TextBoxComponent } from '@syncfusion/ej2-react-inputs';

export const AnnotatePanel = ({ editorRef }: ToolPanelProps) => {
    const [activeAnnotation, setActiveAnnotation] = useState<AnnotationType | null>(null);
    const [strokeColor, setStrokeColor] = useState('#FF0000');
    const [fillColor, setFillColor] = useState('transparent');
    const [strokeWidth, setStrokeWidth] = useState(3);
    const [text, setText] = useState('');
    const [fontSize, setFontSize] = useState(24);
    const [bold, setBold] = useState(false);
    const [italic, setItalic] = useState(false);
    const [showStrokePicker, setShowStrokePicker] = useState(false);
    const [showFillPicker, setShowFillPicker] = useState(false);

    const annotations = [
        { type: AnnotationType.TEXT, icon: '📝', label: 'Text' },
        { type: AnnotationType.RECTANGLE, icon: '▭', label: 'Rectangle' },
        { type: AnnotationType.ELLIPSE, icon: '○', label: 'Ellipse' },
        { type: AnnotationType.LINE, icon: '─', label: 'Line' },
        { type: AnnotationType.ARROW, icon: '→', label: 'Arrow' },
        { type: AnnotationType.FREEHAND, icon: '✏️', label: 'Freehand' },
    ];

    const getSafeEditor = () => {
        if (!editorRef.current) {
            alert('Editor not initialized');
            return null;
        }
        return editorRef.current;
    };

    const handleAnnotationSelect = (type: AnnotationType) => {
        const editor = getSafeEditor();
        if (!editor) return;

        setActiveAnnotation(type);

        // Only enable freehand mode when selected
        editor.freeHandDraw(type === AnnotationType.FREEHAND);
    };

    const handleAddText = () => {
        const editor = getSafeEditor();
        if (!editor || !text.trim()) {
            alert('Please enter text first');
            return;
        }

        try {
            // Optional: position relative to visible image area
            const dim = editor.getImageDimension?.() || { x: 50, y: 50, width: 400, height: 300 };

            const x = dim.x + 40;   // a bit inset from left
            const y = dim.y + 60;

            console.log('Adding text at:', { x, y, text, fontSize, bold, italic, strokeColor });

            editor.drawText(
                x,
                y,
                text,
                'Arial',
                fontSize,
                bold,
                italic,
                strokeColor,          // text color
                true,                 // isSelected — makes it editable immediately
                0,                    // rotation degree
                fillColor,            // background fill (can be 'transparent')
                '#000000',            // stroke/border around letters — optional
                1,                    // stroke width around letters
                undefined,            // transformCollection
                false,                // underline
                false                 // strikethrough
            );

            console.log('Text added');
            setText('');
        } catch (error) {
            console.error('Error adding text:', error);
            alert(`Failed to add text: ${error}`);
        }
    };

    const handleAddShape = () => {
        const editor = getSafeEditor();
        if (!editor || !activeAnnotation) return;

        try {
            const dim = editor.getImageDimension?.() || { x: 100, y: 100, width: 400, height: 300 };
            const centerX = dim.x + dim.width / 2;
            const centerY = dim.y + dim.height / 2;

            console.log(`Adding ${activeAnnotation} at center:`, { centerX, centerY });

            switch (activeAnnotation) {
                case AnnotationType.RECTANGLE:
                    editor.drawRectangle(
                        centerX - 80,
                        centerY - 50,
                        160,
                        100,
                        strokeWidth,
                        strokeColor,
                        fillColor,
                        0,       // degree
                        true     // isSelected
                    );
                    break;

                case AnnotationType.ELLIPSE:
                    editor.drawEllipse(
                        centerX,
                        centerY,
                        80,
                        50,
                        strokeWidth,
                        strokeColor,
                        fillColor,
                        0,
                        true
                    );
                    break;

                case AnnotationType.LINE:
                    editor.drawLine(
                        centerX - 100,
                        centerY,
                        centerX + 100,
                        centerY,
                        strokeWidth,
                        strokeColor,
                        true
                    );
                    break;

                case AnnotationType.ARROW:
                    editor.drawArrow(
                        centerX - 120,
                        centerY,
                        centerX + 120,
                        centerY,
                        strokeWidth,
                        strokeColor,
                        'None',   // arrowStart
                        'Arrow',  // arrowEnd
                        true
                    );
                    break;
            }

            console.log('Shape added');
        } catch (error) {
            console.error('Error adding shape:', error);
            alert(`Failed to add shape: ${error}`);
        }
    };

    const handleDeleteSelected = () => {
        const editor = getSafeEditor();
        if (!editor) return;

        try {
            // Ensure we're not in freehand drawing mode while deleting
            editor.freeHandDraw?.(false);

            // Try to delete currently selected object first
            const activeId = (editor as any)?.activeObj?.currIndex as string | undefined;
            if (activeId) {
                editor.deleteShape(activeId);
                console.log('Deleted selected annotation', activeId);
                return;
            }

            // Fallbacks: use shape settings (includes shapes, text, and freehand with ids like 'shape_*' or 'pen_*')
            const shapes = editor.getShapeSettings?.() ?? [];
            if (Array.isArray(shapes) && shapes.length > 0) {
                // Prefer the last-added annotation when nothing is selected
                const toDelete = shapes[shapes.length - 1];
                if (toDelete?.id) {
                    editor.deleteShape(toDelete.id);
                    console.log('Deleted last annotation', toDelete.id);
                    return;
                }
            }

            alert('No annotation to delete. Select one and try again.');
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete selection.');
        }
    };

    // JSX remains almost the same — only handlers changed
    return (
        <div className="tool-panel">
            <div className="panel-section">
                <h4 className="section-title">Annotation Tools</h4>
                <div className="button-grid">
                    {annotations.map((ann) => (
                        <ButtonComponent
                            key={ann.type}
                            cssClass={`tool-btn ${activeAnnotation === ann.type ? 'active' : ''}`}
                            onClick={() => handleAnnotationSelect(ann.type)}
                            title={ann.label}
                        >
                            {ann.icon} {ann.label}
                        </ButtonComponent>
                    ))}
                </div>
            </div>

            {activeAnnotation === AnnotationType.TEXT && (
                <div className="panel-section">
                    <h4 className="section-title">Add Text</h4>
                    <TextBoxComponent
                        value={text as any}
                        placeholder="Enter text..."
                        change={(e: any) => setText(String(e?.value ?? ''))}
                        floatLabelType={'Never'}
                        width={'100%'}
                    />

                    <div className="style-row" style={{ marginTop: '12px' }}>
                        <label className="style-label">Font Size: {fontSize}px</label>
                        <SliderComponent
                            min={12}
                            max={72}
                            value={fontSize}
                            change={(e: any) => setFontSize(Number(e?.value ?? fontSize))}
                        />
                    </div>

                    <div className="button-grid" style={{ marginTop: '8px' }}>
                        <ButtonComponent
                            cssClass={`tool-btn ${bold ? 'active' : ''}`}
                            onClick={() => setBold(!bold)}
                        >
                            <strong>B</strong> Bold
                        </ButtonComponent>
                        <ButtonComponent
                            cssClass={`tool-btn ${italic ? 'active' : ''}`}
                            onClick={() => setItalic(!italic)}
                        >
                            <em>I</em> Italic
                        </ButtonComponent>
                    </div>

                    <ButtonComponent cssClass="tool-btn primary full-width" onClick={handleAddText}>
                        ➕ Add Text
                    </ButtonComponent>
                </div>
            )}

            {activeAnnotation && activeAnnotation !== AnnotationType.TEXT && activeAnnotation !== AnnotationType.FREEHAND && (
                <div className="panel-section">
                    <h4 className="section-title">Add Shape</h4>
                    <ButtonComponent cssClass="tool-btn primary full-width" onClick={handleAddShape}>
                        ➕ Add {activeAnnotation}
                    </ButtonComponent>
                </div>
            )}

            {/* Style section unchanged */}
            <div className="panel-section">
                <h4 className="section-title">Style</h4>

                <div className="style-row">
                    <label className="style-label">Stroke Color</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div
                            aria-label="Stroke color preview"
                            style={{
                                width: 28,
                                height: 18,
                                borderRadius: 4,
                                border: '1px solid #555',
                                background: strokeColor,
                            }}
                        />
                        <ButtonComponent
                            cssClass="tool-btn small"
                            onClick={() => {
                                setShowFillPicker(false);
                                setShowStrokePicker((v) => !v);
                            }}
                        >
                            {showStrokePicker ? 'Close' : 'Pick'}
                        </ButtonComponent>
                    </div>

                    {showStrokePicker && (
                        <div
                            style={{ marginTop: 12 }}
                            onClick={(evt) => {
                                const el = evt.target as HTMLElement;
                                if (el.closest('.e-apply') || el.closest('.e-cancel')) {
                                    setShowStrokePicker(false);
                                }
                            }}
                        >
                            <ColorPickerComponent
                                value={strokeColor}
                                inline={true}
                                showButtons={true}
                                change={(e: any) => {
                                    setStrokeColor(String(e?.currentValue?.hex ?? strokeColor));
                                    setShowStrokePicker(false);
                                }}
                            />
                        </div>
                    )}
                </div>

                <div className="style-row">
                    <label className="style-label">Fill Color</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div
                            aria-label="Fill color preview"
                            style={{
                                width: 28,
                                height: 18,
                                borderRadius: 4,
                                border: '1px solid #555',
                                background: fillColor === 'transparent' ? 'linear-gradient(45deg, #999 25%, transparent 25%, transparent 50%, #999 50%, #999 75%, transparent 75%, transparent)'
                                    : fillColor,
                            }}
                        />
                        <ButtonComponent
                            cssClass="tool-btn small"
                            onClick={() => {
                                setShowStrokePicker(false);
                                setShowFillPicker((v) => !v);
                            }}
                        >
                            {showFillPicker ? 'Close' : 'Pick'}
                        </ButtonComponent>
                        <ButtonComponent
                            cssClass={`tool-btn small ${fillColor === 'transparent' ? 'active' : ''}`}
                            onClick={() => {
                                setFillColor('transparent');
                                setShowFillPicker(false);
                            }}
                        >
                            None
                        </ButtonComponent>
                    </div>

                    {showFillPicker && (
                        <div
                            style={{ marginTop: 12 }}
                            onClick={(evt) => {
                                const el = evt.target as HTMLElement;
                                if (el.closest('.e-apply') || el.closest('.e-cancel')) {
                                    setShowFillPicker(false);
                                }
                            }}
                        >
                            <ColorPickerComponent
                                value={fillColor === 'transparent' ? '#FFFFFF' : fillColor}
                                inline={true}
                                showButtons={true}
                                change={(e: any) => {
                                    setFillColor(String(e?.currentValue?.hex ?? fillColor));
                                    setShowFillPicker(false);
                                }}
                            />
                        </div>
                    )}
                </div>

                <div className="style-row">
                    <label className="style-label">Stroke Width: {strokeWidth}px</label>
                    <SliderComponent
                        min={1}
                        max={20}
                        value={strokeWidth}
                        change={(e: any) => setStrokeWidth(Number(e?.value ?? strokeWidth))}
                    />
                </div>
            </div>

            <div className="panel-section">
                <ButtonComponent cssClass="tool-btn danger full-width" onClick={handleDeleteSelected}>
                    🗑️ Delete Selected
                </ButtonComponent>
            </div>
        </div>
    );
};
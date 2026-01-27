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

    // Text specific
    const [text, setText] = useState('');
    const [fontSize, setFontSize] = useState(24);
    const [bold, setBold] = useState(false);
    const [italic, setItalic] = useState(false);

    // Image specific
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [imageWidth, setImageWidth] = useState<number>(160);
    const [imageHeight, setImageHeight] = useState<number>(120);
    const [preserveAspect, setPreserveAspect] = useState<boolean>(true);

    // Color pickers visibility
    const [showStrokePicker, setShowStrokePicker] = useState(false);
    const [showFillPicker, setShowFillPicker] = useState(false);

    const annotations = [
        { type: AnnotationType.TEXT, iconClass: 'e-text-annotation', label: 'Text' },
        { type: AnnotationType.RECTANGLE, iconClass: 'e-rectangle', label: 'Rectangle' },
        { type: AnnotationType.ELLIPSE, iconClass: 'e-circle', label: 'Ellipse' },
        { type: AnnotationType.LINE, iconClass: 'e-horizontal-line', label: 'Line' },
        { type: AnnotationType.ARROW, iconClass: 'e-arrow-right', label: 'Arrow' },
        { type: AnnotationType.FREEHAND, iconClass: 'e-hand-gestures', label: 'Freehand' },
        { type: AnnotationType.IMAGE, iconClass: 'e-image', label: 'Image' }, // ← Added
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

        // Enable/disable freehand drawing mode
        editor.freeHandDraw?.(type === AnnotationType.FREEHAND);
    };

    // ────────────────────────────────────────────────
    //                  TEXT HANDLER
    // ────────────────────────────────────────────────
    const handleAddText = () => {
        const editor = getSafeEditor();
        if (!editor || !text.trim()) {
            alert('Please enter text first');
            return;
        }

        try {
            const dim = editor.getImageDimension?.() || { x: 50, y: 50, width: 400, height: 300 };
            const x = dim.x + 40;
            const y = dim.y + 60;

            editor.drawText(
                x,
                y,
                text,
                'Arial',
                fontSize,
                bold,
                italic,
                strokeColor,    // text color
                true,           // isSelected
                0,              // rotation
                fillColor,      // background
                '#000000',      // letter border color
                1,              // letter border width
                undefined,
                false,          // underline
                false           // strikethrough
            );

            setText('');
        } catch (error) {
            console.error('Error adding text:', error);
            alert(`Failed to add text: ${error}`);
        }
    };

    // ────────────────────────────────────────────────
    //                  SHAPE HANDLER
    // ────────────────────────────────────────────────
    const handleAddShape = () => {
        const editor = getSafeEditor();
        if (!editor || !activeAnnotation) return;

        try {
            const dim = editor.getImageDimension?.() || { x: 100, y: 100, width: 400, height: 300 };
            const centerX = dim.x + dim.width / 2;
            const centerY = dim.y + dim.height / 2;

            switch (activeAnnotation) {
                case AnnotationType.RECTANGLE:
                    editor.drawRectangle(centerX - 80, centerY - 50, 160, 100, strokeWidth, strokeColor, fillColor, 0, true);
                    break;
                case AnnotationType.ELLIPSE:
                    editor.drawEllipse(centerX, centerY, 80, 50, strokeWidth, strokeColor, fillColor, 0, true);
                    break;
                case AnnotationType.LINE:
                    editor.drawLine(centerX - 100, centerY, centerX + 100, centerY, strokeWidth, strokeColor, true);
                    break;
                case AnnotationType.ARROW:
                    editor.drawArrow(centerX - 120, centerY, centerX + 120, centerY, strokeWidth, strokeColor, 'None', 'Arrow', true);
                    break;
            }
        } catch (error) {
            console.error('Error adding shape:', error);
            alert(`Failed to add shape: ${error}`);
        }
    };

    // ────────────────────────────────────────────────
    //                  IMAGE HANDLER
    // ────────────────────────────────────────────────
    const handleAddImage = () => {
        const editor = getSafeEditor();
        if (!editor || !imagePreviewUrl) {
            alert('Please select an image first');
            return;
        }

        try {
            const dim = editor.getImageDimension?.() || { x: 0, y: 0, width: 400, height: 300 };
            const centerX = dim.x + dim.width / 2 - imageWidth / 2;
            const centerY = dim.y + dim.height / 2 - imageHeight / 2;

            const success = editor.drawImage(
                imagePreviewUrl,
                centerX,
                centerY,
                imageWidth,
                imageHeight,
                preserveAspect,
                0,     // rotation
                1,     // opacity
                true   // isSelected → shows resize handles
            );

            if (success) {
                // Optional: reset after successful insert
                setImageFile(null);
                setImagePreviewUrl(null);
                // setImageWidth(160);
                // setImageHeight(120);
            } else {
                alert('Failed to insert image (method returned false)');
            }
        } catch (error) {
            console.error('Error adding image annotation:', error);
            alert(`Failed to add image: ${error}`);
        }
    };

    const handleDeleteSelected = () => {
        const editor = getSafeEditor();
        if (!editor) return;

        try {
            editor.freeHandDraw?.(false);

            const activeId = (editor as any)?.activeObj?.currIndex as string | undefined;
            if (activeId) {
                editor.deleteShape(activeId);
                return;
            }

            const shapes = editor.getShapeSettings?.() ?? [];
            if (shapes.length > 0) {
                const toDelete = shapes[shapes.length - 1];
                if (toDelete?.id) {
                    editor.deleteShape(toDelete.id);
                    return;
                }
            }

            alert('No annotation selected to delete.');
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete selection.');
        }
    };

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
                            <span className={`ann-icon e-icons ${ann.iconClass}`} aria-hidden="true" />
                            <span className="ann-label">{ann.label}</span>
                        </ButtonComponent>
                    ))}
                </div>
            </div>

            {/* ─────────────── TEXT CONTROLS ─────────────── */}
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
                        <span className="tool-icon e-icons e-add" aria-hidden="true" />
                        Add Text
                    </ButtonComponent>
                </div>
            )}

            {/* ─────────────── IMAGE CONTROLS ─────────────── */}
            {activeAnnotation === AnnotationType.IMAGE && (
                <div className="panel-section">
                    <h4 className="section-title">Add Image</h4>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            setImageFile(file);

                            const reader = new FileReader();
                            reader.onload = (ev) => {
                                setImagePreviewUrl(ev.target?.result as string);
                            };
                            reader.readAsDataURL(file);
                        }}
                        style={{ marginBottom: '16px', display: 'block', width: '100%', color: '#605e5c' }}
                    />

                    {imagePreviewUrl && (
                        <div style={{ margin: '16px 0', textAlign: 'center' }}>
                            <img
                                src={imagePreviewUrl}
                                alt="Preview"
                                style={{
                                    maxWidth: '220px',
                                    maxHeight: '180px',
                                    border: '1px solid #ddd',
                                    borderRadius: '6px',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                                }}
                            />
                        </div>
                    )}

                    <div className="style-row">
                        <label>Width: {imageWidth}px</label>
                        <SliderComponent
                            min={40}
                            max={500}
                            value={imageWidth}
                            change={(e: any) => setImageWidth(Number(e?.value ?? imageWidth))}
                        />
                    </div>

                    <div className="style-row">
                        <label>Height: {imageHeight}px</label>
                        <SliderComponent
                            min={30}
                            max={400}
                            value={imageHeight}
                            change={(e: any) => setImageHeight(Number(e?.value ?? imageHeight))}
                        />
                    </div>

                    <div style={{ margin: '16px 0' }}>
                        <label style={{ display: 'flex', color:'#605e5c',fontSize:'13px', alignItems: 'center', gap: 8 }}>
                            <input
                                type="checkbox"
                                checked={preserveAspect}
                                onChange={(e) => setPreserveAspect(e.target.checked)}
                            />
                            Preserve aspect ratio
                        </label>
                    </div>

                    <ButtonComponent
                        cssClass="tool-btn primary full-width"
                        disabled={!imagePreviewUrl}
                        onClick={handleAddImage}
                    >
                        <span className="tool-icon e-icons e-add" aria-hidden="true" />
                        Insert Image
                    </ButtonComponent>
                </div>
            )}

            {/* ─────────────── SHAPE BUTTON (non-text, non-freehand, non-image) ─────────────── */}
            {activeAnnotation &&
                activeAnnotation !== AnnotationType.TEXT &&
                activeAnnotation !== AnnotationType.FREEHAND &&
                activeAnnotation !== AnnotationType.IMAGE && (
                    <div className="panel-section">
                        <h4 className="section-title">Add Shape</h4>
                        <ButtonComponent cssClass="tool-btn primary full-width" onClick={handleAddShape}>
                            <span className="tool-icon e-icons e-add" aria-hidden="true" />
                            Add {activeAnnotation}
                        </ButtonComponent>
                    </div>
                )}

            {/* ─────────────── COMMON STYLE CONTROLS ─────────────── */}
            <div className="panel-section">
                <h4 className="section-title">Style</h4>

                <div className="style-row">
                    <label className="style-label">Stroke Color</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div
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
                        <div style={{ marginTop: 12 }}>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <div
                            style={{
                                width: 28,
                                height: 18,
                                borderRadius: 4,
                                border: '1px solid #555',
                                background: fillColor === 'transparent'
                                    ? 'linear-gradient(45deg, #999 25%, transparent 25%, transparent 50%, #999 50%, #999 75%, transparent 75%, transparent)'
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
                        <div style={{ marginTop: 12 }}>
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

            {/* Delete */}
            <div className="panel-section">
                <ButtonComponent cssClass="tool-btn danger full-width" onClick={handleDeleteSelected}>
                    <span className="top-icon e-icons e-trash" aria-hidden="true" />
                    Delete Selected
                </ButtonComponent>
            </div>
        </div>
    );
};
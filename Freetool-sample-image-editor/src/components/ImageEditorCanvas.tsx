import { ImageEditorComponent } from '@syncfusion/ej2-react-image-editor';
import { useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import type { ZoomSettingsModel } from '@syncfusion/ej2-react-image-editor';

interface ImageEditorCanvasProps {
    onImageLoaded?: () => void;
    onEditComplete?: () => void;
    zoomSettings?: ZoomSettingsModel;
}

export const ImageEditorCanvas = forwardRef<ImageEditorComponent, ImageEditorCanvasProps>(
    ({ onImageLoaded, onEditComplete, zoomSettings }, ref) => {
        const internalRef = useRef<ImageEditorComponent>(null);

        useImperativeHandle(ref, () => internalRef.current as ImageEditorComponent);

        useEffect(() => {
            // Any initialization logic can go here
        }, []);

        const handleFileOpened = () => {
            console.log('ImageEditorCanvas: File opened event triggered');
            onImageLoaded?.();
        };

        const handleEditComplete = () => {
            console.log('ImageEditorCanvas: Edit complete event triggered');
            onEditComplete?.();
        };

        return (
            <div className="image-editor-canvas">
                <ImageEditorComponent
                    ref={internalRef}
                    height="100%"
                    width="100%"
                    theme="Bootstrap5"
                    zoomSettings={zoomSettings}
                    fileOpened={handleFileOpened}
                    editComplete={handleEditComplete}
                    toolbar={[]} // Hide default toolbar, we'll use custom UI
                    showQuickAccessToolbar={false}
                />
            </div>
        );
    }
);

ImageEditorCanvas.displayName = 'ImageEditorCanvas';

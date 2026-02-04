import React from 'react';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import type { ZoomControlsProps } from '../types/imageEditor.types';
import './styles/ZoomControls.css';

export const ZoomControls: React.FC<ZoomControlsProps> = ({ onZoomIn, onZoomOut, disabled, zoomLevel = 1, onSetZoom, minZoom = 0.1, maxZoom = 5 }) => {
  const percent = Math.round(zoomLevel * 100);
  const [inputValue, setInputValue] = React.useState<string>(String(percent));

  React.useEffect(() => {
    // keep input synced when external zoom changes
    setInputValue(String(Math.round(zoomLevel * 100)));
  }, [zoomLevel]);

  const commitValue = (val: string) => {
    const n = Number(val.replace('%', '').trim());
    if (Number.isFinite(n)) {
      let factor = n / 100;
      factor = Math.max(minZoom, Math.min(maxZoom, factor));
      onSetZoom?.(factor);
      // ensure displayed value matches clamped value
      setInputValue(String(Math.round(factor * 100)));
    } else {
      // restore
      setInputValue(String(Math.round(zoomLevel * 100)));
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      commitValue((e.target as HTMLInputElement).value);
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div className="zoom-controls" aria-label="Zoom controls">
      <div className="zoom-row">
        <ButtonComponent
          cssClass={`zoom-btn ${disabled ? 'e-disabled' : ''}`}
          onClick={onZoomOut}
          disabled={!!disabled}
          iconCss='e-icons e-zoom-out'
          title="Zoom Out"
        >
        </ButtonComponent>

        <input
          className="zoom-input"
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={(e) => commitValue(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label="Zoom percentage"
          min={Math.round(minZoom * 100)}
          max={Math.round(maxZoom * 100)}
        />

        <ButtonComponent
          cssClass={`zoom-btn ${disabled ? 'e-disabled' : ''}`}
          onClick={onZoomIn}
          disabled={!!disabled}
          iconCss='e-icons e-zoom-in'
          title="Zoom In"
        >
        </ButtonComponent>
      </div>
    </div>
  );
};

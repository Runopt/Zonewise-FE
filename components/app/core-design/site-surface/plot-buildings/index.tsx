import React from 'react';

interface PlotBuildingsProps {
  onBack: () => void;
  onNext: () => void;
}
const PlotBuildings: React.FC<PlotBuildingsProps> = ({ onBack, onNext }) => {
  return (
    <div className="place-building-container visualization-container">
      <div className="plot-building visualization"></div>
      <div className="cta">
        <button id="prev" onClick={onBack}>
          Make changes
        </button>
        <button id="next" onClick={onNext}>
          Confirm layout
        </button>
      </div>
    </div>
  );
};

export default PlotBuildings;

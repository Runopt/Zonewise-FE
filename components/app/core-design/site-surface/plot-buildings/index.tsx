import React from 'react';

interface PlotBuildingsProps {
  onBack: () => void;
  onNext: () => void;
}
const PlotBuildings: React.FC<PlotBuildingsProps> = ({ onBack, onNext }) => {
  return (
    <div className='place-building-container'>
      PlotBuildings
      <div className="cta">
        <button id="prev" onClick={onBack}>Make changes</button>
        <button>Confirm layout</button>
      </div>
    </div>
  );
};

export default PlotBuildings;

import React from 'react';

interface ThreeDVisualizatiaonProps {
  onBack?: () => void;
  onNext?: () => void;
}

const ThreeDVisualizatiaon: React.FC<ThreeDVisualizatiaonProps> = ({
  onBack,
  onNext,
}) => {
  const visualizationImage = '';
  return (
    <div className="visualization-container">
      <div className="visualization">
        3D visualization of the pipe system (image)
        <img src={visualizationImage} alt="3d visualization" />
      </div>
      <div className="cta">
        <button id="prev" onClick={onBack}>
          Back
        </button>
        <button id="next" onClick={onNext}>
          Total Price $()
        </button>
      </div>
    </div>
  );
};

export default ThreeDVisualizatiaon;

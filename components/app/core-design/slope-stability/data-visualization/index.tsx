import React from 'react';

interface DataVisualizationProps {
  onBack?: () => void;
  onNext?: () => void;
}

const DataVisualization: React.FC<DataVisualizationProps> = ({ onBack }) => {
  return (
    <div className="node-container building-information-container">
      HELLO WORLD HELLO WORLD HELLO WORLD HELLO WORLD HELLO WORLD HELLO WORLD
      HELLO WORLD HELLO WORLD HELLO WORLD HELLO WORLD
    </div>
  );
};

export default DataVisualization;

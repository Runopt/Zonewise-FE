import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { RootState } from '@/components/store/store';

// Dynamically import Plotly with SSR disabled
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface ThreeDVisualizatiaonProps {
  onBack?: () => void;
  onNext?: () => void;
}

const ThreeDVisualizatiaon: React.FC<ThreeDVisualizatiaonProps> = ({
  onBack,
  onNext,
}) => {
  const responseData = useSelector(
    (state: RootState) => state.node.responseData,
  );

  const plotlyData = responseData ? JSON.parse(responseData.plot) : { data: [], layout: {} };

// const plotData = useMemo(() => {
//   if (!responseData?.plot) {
//     console.error('Plot data is missing');
//     return { data: [], layout: {} };
//   }
//   try {
//     const parsedData = JSON.parse(responseData.plot);
//     // Validate the structure of parsedData
//     if (!Array.isArray(parsedData.data)) {
//       console.error('Invalid plot data structure');
//       return { data: [], layout: {} };
//     }
//     return parsedData;
//   } catch (error) {
//     console.error('Error parsing plot data:', error);
//     return { data: [], layout: {} };
//   }
// }, [responseData]);

  return (
    <div className="visualization-container">
      <div className="visualization">
        <h3>3D Visualization of the Pipe System</h3>
        {plotlyData.data.length > 0 ? (
          <Plot
            data={plotlyData.data}
            layout={{
              // ...plotData.layout,
              title: '3D Pipe Design Visualization',
              width: 800,
              height: 600,
            }}
          />
        ) : (
          <p>No plot data available.</p>
        )}
      </div>
      <div className="cta">
        <button id="prev" onClick={onBack}>
          Back
        </button>
        <button id="next" onClick={onNext} disabled={!responseData}>
          {responseData
            ? `Total Price: $${responseData.total_price.toFixed(2)}`
            : 'Total Price: N/A'}
        </button>
      </div>
    </div>
  );
};

export default ThreeDVisualizatiaon;

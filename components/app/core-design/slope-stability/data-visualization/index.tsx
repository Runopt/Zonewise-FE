import dynamic from 'next/dynamic';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/components/store/store';
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });
interface DataVisualizationProps {
  onBack?: () => void;
  onNext?: () => void;
}

const DataVisualization: React.FC<DataVisualizationProps> = ({ onBack }) => {

  const uploadState = useSelector((state: RootState) => state.uploadSlopeFile);
  const responseData = useSelector(
    (state: RootState) => state.node.responseData,
  );

const plotlyData =
  uploadState.data && uploadState.data.plot
    ? JSON.parse(uploadState.data.plot)
    : {
        data: [],
        layout: {
          layout: {
            plot_bgcolor: '#000000',
            paper_bgcolor: '#000000',
            autosize: true,
            height: 740,
            showlegend: false,
            scene: {
              xaxis: {
                title: 'X Axis',
                gridcolor: '#ffffff20',
                zerolinecolor: '#ffffff10',
                showbackground: true,
                backgroundcolor: '#00000000',
                color: '#FFFFFF10',
              },
              yaxis: {
                title: 'Y Axis',
                gridcolor: '#ffffff20',
                zerolinecolor: '#ffffff40',
                showbackground: true,
                backgroundcolor: '#00000000',
                color: '#fff',
              },
              zaxis: {
                title: 'Z Axis',
                gridcolor: '#ffffff20',
                zerolinecolor: '#ffffff40',
                showbackground: true,
                backgroundcolor: '#00000000',
                color: '#fff',
              },
              camera: {
                eye: { x: 1.5, y: 1.5, z: 1.5 },
              },
            },
            margin: { l: 0, r: 0, t: 0, b: 0 },
          },
        },
      };

  return (
    <div className="node-container building-information-container">
      {plotlyData.data.length > 0 ? (
        <Plot
          data={plotlyData.data}
          layout={{
            title: 'Slope Stability Visualization',
            width: 800,
            height: 600,
            ...plotlyData.layout,
          }}
        />
      ) : (
        <p>No plot data available.</p>
      )}

      <div className="cta">
        <button id="prev" onClick={onBack}>
          Back
        </button>
        <button id="next">Done</button>
      </div>
    </div>
  );
};

export default DataVisualization;

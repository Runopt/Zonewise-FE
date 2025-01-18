import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { RootState } from '@/components/store/store';
import { Layout, PlotData } from 'plotly.js';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface ThreeDVisualizationProps {
  onBack?: () => void;
  onNext?: () => void;
  customWidth?: number;
  customHeight?: number;
  showTitle?: boolean;
  titleText?: string;
}

const ThreeDVisualization: React.FC<ThreeDVisualizationProps> = ({
  onBack,
  onNext,
  customWidth = 1500,
  customHeight = 700,
  showTitle = false,
  titleText = '3D Pipe Design Visualization',
}) => {
  const responseData = useSelector(
    (state: RootState) => state.node.responseData,
  );

  const plotData = useMemo(() => {
    if (!responseData?.plot) {
      console.error('Plot data is missing');
      return { data: [], layout: {} };
    }

    try {
      const parsedData = JSON.parse(responseData.plot);

      // Enhanced validation
      if (!parsedData || !Array.isArray(parsedData.data)) {
        console.error('Invalid plot data structure');
        return { data: [], layout: {} };
      }

      return parsedData;
    } catch (error) {
      console.error('Error parsing plot data:', error);
      return { data: [], layout: {} };
    }
  }, [responseData]);

  // Custom layout configuration with black background
  const customLayout: Partial<Layout> = {
    ...(plotData.layout || {}),
    width: customWidth,
    height: customHeight,
    paper_bgcolor: '#080808',
    plot_bgcolor: '#080808',
    title: showTitle
      ? {
          text: titleText,
          font: {
            size: 20,
            color: 'white',
          },
        }
      : undefined,
    scene: {
      ...(plotData.layout?.scene || {}),
      bgcolor: '#080808',
      aspectmode: 'manual',
      aspectratio: {
        x: 1,
        y: 1,
        z: 0.7,
      },
      xaxis: {
        title: {
          text: 'X Axis',
          font: { color: 'white' },
        },
        tickfont: { color: 'lightgray' },
        showgrid: true,
        gridcolor: 'rgba(255,255,255,0.2)',
        showline: true,
        linecolor: 'white',
      },
      yaxis: {
        title: {
          text: 'Y Axis',
          font: { color: 'white' },
        },
        tickfont: { color: 'lightgray' },
        showgrid: true,
        gridcolor: 'rgba(255,255,255,0.2)',
        showline: true,
        linecolor: 'white',
      },
      zaxis: {
        title: {
          text: 'Z Axis',
          font: { color: 'white' },
        },
        tickfont: { color: 'lightgray' },
        showgrid: true,
        gridcolor: 'rgba(255,255,255,0.2)',
        showline: true,
        linecolor: 'white',
      },
    },
  };

  return (
    <div className="visualization-container bg-black">
      <div className="visualization">
        {plotData.data.length > 0 ? (
          <Plot
            data={plotData.data as PlotData[]}
            layout={customLayout}
            config={{
              responsive: true,
              displaylogo: false,
              modeBarButtonsToRemove: ['sendDataToCloud'],
            }}
          />
        ) : (
          <div className="no-data-placeholder text-white">
            <p>No visualization data available.</p>
            <p>Please ensure data has been properly generated.</p>
          </div>
        )}
      </div>
      <div className="cta flex space-x-4 mt-4">
        <button
          id="prev"
          onClick={onBack}
          className="px-4 py-2 bg-gray-700 text-white hover:bg-gray-600 rounded"
        >
          Back
        </button>
        <button
          id="next"
          onClick={onNext}
          disabled={!responseData}
          className={`px-4 py-2 rounded ${
            responseData
              ? 'bg-blue-800 text-white hover:bg-blue-700'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          {responseData
            ? `Total Price: $${responseData.total_price.toFixed(2)}`
            : 'Total Price: N/A'}
        </button>
      </div>
    </div>
  );
};

export default ThreeDVisualization;

import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import { selectUploadSessionId } from '@/components/store/slices/uploadSlice'; // Import from your upload slice

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface DataItem {
  x: number;
  y: number;
  z: number;
}
interface PlotGraphProps {
  onBack: () => void;
  onNext: () => void;
}
const INITIAL_LOAD = 40;
const LOAD_MORE_COUNT = 20;

const PlotGraph: React.FC<PlotGraphProps> = ({ onBack, onNext }) => {
  const [data, setData] = useState<DataItem[]>([]);
  const [chartData, setChartData] = useState<any>(null);
  const [displayData, setDisplayData] = useState<DataItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const tbodyRef = useRef<HTMLTableSectionElement>(null);
  const currentIndexRef = useRef(INITIAL_LOAD);

  // Get the upload session ID from Redux store
  const uploadSessionId = useSelector(selectUploadSessionId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!uploadSessionId) {
          console.warn('No upload session ID found');
          return;
        }

        // Fetch the uploaded file data using the session ID
        const response = await fetch(`/api/get-upload/${uploadSessionId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch uploaded file');
        }
        const jsonData = await response.json();

        // Process the data similar to previous implementation
        const enhancedChartData = {
          data: jsonData.data.map((trace: any) => ({
            ...trace,
            marker: {
              ...trace.marker,
              size: 9,
              color: trace.z,
              colorscale: 'Viridis',
              opacity: 0.9,
            },
            line: {
              width: 0.2,
              color: '#ffffff10',
            },
          })),
          layout: {
            ...jsonData.layout,
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
        };

        setChartData(enhancedChartData);

        const extractedData: DataItem[] = [];
        const xLength = jsonData.data[0].x.length;

        for (let i = 0; i < xLength; i++) {
          extractedData.push({
            x: jsonData.data[0].x[i],
            y: jsonData.data[0].y[i],
            z: jsonData.data[0].z[i],
          });
        }

        setData(extractedData);
        setDisplayData(extractedData.slice(0, INITIAL_LOAD));
      } catch (error) {
        console.error('Error fetching or processing uploaded data:', error);
      }
    };

    fetchData();
  }, [uploadSessionId]);

  // Rest of the component remains the same as in the original implementation
  const loadMoreData = () => {
    if (isLoading || currentIndexRef.current >= data.length) return;

    setIsLoading(true);
    const nextIndex = Math.min(
      currentIndexRef.current + LOAD_MORE_COUNT,
      data.length,
    );

    setTimeout(() => {
      setDisplayData((prevData) => [
        ...prevData,
        ...data.slice(currentIndexRef.current, nextIndex),
      ]);
      currentIndexRef.current = nextIndex;
      setIsLoading(false);
    }, 100);
  };

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      const { scrollTop, scrollHeight, clientHeight } = target;

      // Check if we're near the bottom (within 50px)
      if (scrollHeight - scrollTop <= clientHeight + 50) {
        loadMoreData();
      }
    };

    const tbody = tbodyRef.current;
    if (tbody) {
      tbody.addEventListener('scroll', handleScroll);
      return () => tbody.removeEventListener('scroll', handleScroll);
    }
  }, [data]);

  // Render logic remains the same
  return (
    <div className="plot-graph-container">
      <div className="main-content">
        <div className="plot-graph-graph">
          {chartData ? (
            <Plot
              data={chartData.data}
              layout={chartData.layout}
              config={{
                responsive: true,
                displaylogo: false,
                modeBarButtonsToRemove: ['toImage', 'sendDataToCloud'],
              }}
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            <div className="plot-graph-graph-loading">
              <img src="../../images/icons/loading.svg" alt="Loading..." />
            </div>
          )}
        </div>

        {/* Data Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>x</th>
                <th>y</th>
                <th>Scatter (z) Values</th>
              </tr>
            </thead>
            <tbody ref={tbodyRef}>
              {displayData.map((item, index) => (
                <tr key={index}>
                  <td>{item.x.toFixed(2)}</td>
                  <td>{item.y.toFixed(6)}</td>
                  <td>{item.z.toFixed(6)}</td>
                </tr>
              ))}
              {isLoading && (
                <tr>
                  <td
                    colSpan={3}
                    style={{
                      textAlign: 'center',
                      padding: '1rem',
                      color: '#fff',
                    }}
                  >
                    Loading more data...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="plot-graph-cta">
        <button id="prev" onClick={onBack}>
          Back
        </button>
        <button id="next" onClick={onNext}>
          Place Building
        </button>
      </div>
    </div>
  );
};

export default PlotGraph;

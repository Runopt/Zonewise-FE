import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/components/store/store';

interface FinalDataFrameProps {
  onBack?: () => void;
}

const parseCSV = (csvText: string): string[][] => {
  const lines = csvText.split('\n');
  return lines
    .map((line) => {
      const cells: string[] = [];
      let currentCell = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"' && line[i + 1] === '"') {
          currentCell += '"';
          i++;
        } else if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          cells.push(currentCell.trim());
          currentCell = '';
        } else {
          currentCell += char;
        }
      }

      cells.push(currentCell.trim());

      return cells;
    })
    .filter((row) => row.length > 0);
};

const FinalDataFrame: React.FC<FinalDataFrameProps> = ({ onBack }) => {
  const [csvContent, setCsvContent] = useState<string[][]>([]);
  const dispatch = useDispatch();
  const csvData = useSelector((state: RootState) => state.path.csvData);

  useEffect(() => {
    const processCSV = async () => {
      if (csvData) {
        try {
          const text = await csvData.text();
          const parsedContent = parseCSV(text);
          setCsvContent(parsedContent);
        } catch (error) {
          console.error('Error parsing CSV:', error);
        }
      }
    };

    processCSV();
  }, [csvData]);

  const handleDownload = () => {
    if (csvData) {
      const url = window.URL.createObjectURL(csvData);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'water_supply_processed.csv');
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };

  const formatHeader = (header: string) => {
    return header
      .replace(/_/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) //
      .join(' ');
  };

  return (
    <div className="final-data-container">
      <div className="final-data-wrapper">
        <div className="final-data">
          <table>
            <thead>
              <tr>
                {csvContent[0]?.map((header, index) => (
                  <th key={index}>{formatHeader(header)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {csvContent.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="cta flex justify-between mt-4">
        <button id="prev" onClick={onBack}>
          Back
        </button>
        <button id="next" onClick={handleDownload} disabled={!csvData}>
          DOWNLOAD CSV
        </button>
      </div>
    </div>
  );
};

export default FinalDataFrame;

import React from 'react';
interface ExportDataProps {
  onBack: () => void;
  onNext: () => void;
}
const ExportData: React.FC<ExportDataProps> = ({ onBack, onNext }) => {
  return (
    <div className='export-data-container'>
      ExportData
      <div className="cta">
        <button id="prev">Make changes</button>
        <button>Confirm layout</button>
      </div>
    </div>
  );
};

export default ExportData;

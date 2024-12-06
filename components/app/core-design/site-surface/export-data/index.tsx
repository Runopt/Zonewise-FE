import React from 'react';
interface ExportDataProps {
  onBack: () => void;
  onNext: () => void;
}
const ExportData: React.FC<ExportDataProps> = ({ onBack, onNext }) => {
  return (
    <div className='export-data-container visualization-container'>
     <div className="export-data">

     </div>
      <div className="cta">
        <button id="prev" onClick={onBack}>Make changes</button>
        <button id='next' onClick={onNext}>Export data</button>
      </div>
    </div>
  );
};

export default ExportData;

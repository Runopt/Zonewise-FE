import React from 'react'

interface FinalDataFrameProps {
  onBack?: () => void;
  onNext?: () => void;
}
const FinalDataFrame: React.FC<FinalDataFrameProps> = ({onBack}) => {
  return (
    <div className="final-data-container">
      <div className="final-data">

      </div>

      <div className="cta">
        <button id="prev" onClick={onBack}>
          Back
        </button>
        {/* <button id="next">Submit</button> */}
      </div>
    </div>
  );
}

export default FinalDataFrame
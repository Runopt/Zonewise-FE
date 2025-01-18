import React, { useState } from 'react';

interface DataReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (selectedOption: string) => void;
}

const DataReferenceModal: React.FC<DataReferenceModalProps> = ({
  isOpen,
  onClose,
  onContinue,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };

  const handleContinueClick = () => {
    if (selectedOption) {
      onContinue(selectedOption);
    } else {
      alert('Please select an option before continuing.');
    }
  };

  return (
    <div className="data-modal-container">
      <div className="modal">
        <div className="title-container">
          <div className="title">
            <h4>Select Referencing Option</h4>
            <p>
              Specify whether they'll be uploading a PDF for referencing or
              using the available data in your trained AI software
            </p>
          </div>

          <button title="close modal" onClick={onClose}>
            <img src="../images/icons/close.svg" alt="Close" />
          </button>
        </div>

        <div className="options">
          <div
            className={`option ${
              selectedOption === 'upload' ? 'selected' : ''
            }`}
            onClick={() => handleOptionClick('upload')}
          >
            <img src="../images/icons/upload-pdf.svg" alt="Upload PDF" />
            <div>
              <h6>Upload PDF</h6>
              <p>Uploading a PDF for referencing</p>
            </div>
          </div>

          <div
            className={`option ${selectedOption === 'ai' ? 'selected' : ''}`}
            onClick={() => handleOptionClick('ai')}
          >
            <img src="../images/icons/ai-data.svg" alt="AI Data" />
            <div>
              <h6>AI Data</h6>
              <p>Use the available data in your trained AI software</p>
            </div>
          </div>
        </div>

        <div className="cta">
          <a id="need-help" href="#">
            Need help?
          </a>

          <div className="btns">
            <button id="close" onClick={onClose}>
              Close
            </button>
            <button id="continue" onClick={handleContinueClick}>
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataReferenceModal;

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/components/store/store';
import {
  fetchRequiredPathNumbers,
  submitPathNumbers,
  updatePathNumber,
  resetPathNumbers,
} from '@/components/store/slices/pathNumberSlice';

interface PathNumberProps {
  onBack?: () => void;
  onNext?: () => void;
}

const PathNumber: React.FC<PathNumberProps> = ({ onBack, onNext }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { pathNumbers, isLoading, isSubmitting, error, isFormValid } =
    useSelector((state: RootState) => state.path);

  useEffect(() => {
    dispatch(fetchRequiredPathNumbers());

    return () => {
      dispatch(resetPathNumbers());
    };
  }, [dispatch]);

  const handleInputChange = (index: number, value: string) => {
    dispatch(updatePathNumber({ index, value }));
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;

    const result = await dispatch(submitPathNumbers(pathNumbers.values));
    if (submitPathNumbers.fulfilled.match(result)) {
      onNext?.();
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pathnumber-container building-information-container">
      <div className="title">
        <h2>Path Numbers</h2>
        <p>Enter the path number data below</p>
      </div>

      <div className={`form-container ${!isFormValid ? 'form-error' : ''}`}>
        <div className="form">
          <div className="title">
            <div className="path-number-title">Path Number</div>
            <div className="value-title">Flow Rate in M^3/ S</div>
          </div>

          <div className="main-fields">
            <div className="path-number">
              {Array.from({ length: pathNumbers.required }, (_, i) => (
                <div key={i}>Use node {i + 1}</div>
              ))}
            </div>

            <div className="path-flow-rate">
              {Array.from({ length: pathNumbers.required }, (_, i) => (
                <div key={i} className="flow-rate-value">
                  <input
                    type="number"
                    placeholder="00"
                    value={pathNumbers.values[i] || ''}
                    onChange={(e) => handleInputChange(i, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="cta">
        <button id="prev" onClick={onBack}>
          Back
        </button>
        <button
          id="next"
          onClick={handleSubmit}
          disabled={isSubmitting || !isFormValid}
        >
          {isSubmitting ? (
            <img src="../../images/icons/loading.svg" alt="Loading..." />
          ) : (
            'Submit'
          )}
        </button>
      </div>
    </div>
  );
};

export default PathNumber;

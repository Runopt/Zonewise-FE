import React from 'react';
import UploadFile from './upload-file';
import DataVisualization from './data-visualization';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/components/types';
import {
  slopeStabilityNextStep,
  slopeStabilityPreviousStep,
} from '../../../store/slices/stepperSlopeSlice';

const SlopeStability = () => {
  const dispatch = useDispatch();
  const currentStep = useSelector(
    (state: RootState) => state.slopeStabilityStepper.currentStep,
  );

  const handleNext = () => {
    dispatch(slopeStabilityNextStep());
  };

  const handleBack = () => {
    dispatch(slopeStabilityPreviousStep());
  };
  return (
    <div className="site-surface-container">
      {currentStep === 1 && (
        <UploadFile fileTypes={['.csv', '.xlsx']} onNext={handleNext} />
      )}
      {currentStep === 2 && (
        <DataVisualization onBack={handleBack} onNext={handleNext} />
      )}
    </div>
  );
};

export default SlopeStability;

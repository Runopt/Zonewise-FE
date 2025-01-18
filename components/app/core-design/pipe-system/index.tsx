import React from 'react';
import UploadFile from './upload-file';
import Node from './node';
import { useSelector, useDispatch } from 'react-redux';
import {
  pipeSystemNextStep,
  pipeSystemPreviousStep,
} from '../../../store/slices/stepperPipeSlice';
import { RootState } from '@/components/types';
import ThreeDVisualizatiaon from './3d-visualization';

const PipeSystem = () => {
  const dispatch = useDispatch();
  const currentStep = useSelector(
    (state: RootState) => state.pipeSystemStepper.currentStep,
  );

  const handleNext = () => {
    dispatch(pipeSystemNextStep());
  };

  const handleBack = () => {
    dispatch(pipeSystemPreviousStep());
  };

  return (
    <div className="site-surface-container">
      {currentStep === 1 && (
        <UploadFile onBack={handleBack} onNext={handleNext} />
      )}
      {currentStep === 2 && <Node onBack={handleBack} onNext={handleNext} />}
      {currentStep === 3 && (
        <ThreeDVisualizatiaon onBack={handleBack} onNext={handleNext} />
      )}
    </div>
  );
};

export default PipeSystem;

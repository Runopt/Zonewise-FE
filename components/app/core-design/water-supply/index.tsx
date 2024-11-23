import React from 'react';
import UploadFile from './upload-file';
import PathNumber from './path-number';
import FinalDataFrame from './final-data';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/components/types';
import {
  waterSupplyNextStep,
  waterSupplyPreviousStep,
} from '../../../store/slices/stepperWaterSlice';
const WaterSupply = () => {
  const dispatch = useDispatch();
  const currentStep = useSelector(
    (state: RootState) => state.waterSupplyStepper.currentStep,
  );

  const handleNext = () => {
    dispatch(waterSupplyNextStep());
  };

  const handleBack = () => {
    dispatch(waterSupplyPreviousStep());
  };
  return (
    <div className="site-surface-container">
      {currentStep === 1 && (
        <UploadFile fileTypes={['.csv', '.xlsx']} onNext={handleNext} />
      )}
      {currentStep === 2 && (
        <PathNumber onBack={handleBack} onNext={handleNext} />
      )}
      {currentStep === 3 && (
        <FinalDataFrame onBack={handleBack} onNext={handleNext} />
      )}
    </div>
  );
};

export default WaterSupply;

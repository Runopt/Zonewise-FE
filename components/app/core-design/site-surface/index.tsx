import React, { useState } from 'react';
import UploadFile from './upload-file';
import BuildingInformation from './building-information';
import PlotGraph from './plot-graph';
import PlotBuildings from './plot-buildings';
import ExportData from './export-data';
import { useSelector, useDispatch } from 'react-redux';
import {
  siteSurfaceNextStep,
  siteSurfacePreviousStep,
} from '../../../store/slices/stepperSlice';
import { RootState } from '@/components/types';

const SiteSurface: React.FC = () => {
  const dispatch = useDispatch();
  const currentStep = useSelector(
    (state: RootState) => state.siteSurfaceStepper.currentStep,
  );

  const handleNext = () => {
    dispatch(siteSurfaceNextStep());
  };

  const handleBack = () => {
    dispatch(siteSurfacePreviousStep());
  };
  return (
    <div className="site-surface-container">
      {currentStep === 1 && (
        <UploadFile
          fileTypes={['.csv', '.xlsx']}
          onNext={handleNext}
        />
      )}
      {currentStep === 2 && (
        <PlotGraph onBack={handleBack} onNext={handleNext} />
      )}

      {currentStep === 3 && (
        <BuildingInformation onBack={handleBack} onNext={handleNext} />
      )}
      {currentStep === 4 && (
        <PlotBuildings onBack={handleBack} onNext={handleNext} />
      )}
      {currentStep === 5 && (
        <ExportData onBack={handleBack} onNext={handleNext} />
      )}
    </div>
  );
};

export default SiteSurface;

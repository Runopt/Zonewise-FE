import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Building {
  name: string;
  length: string;
  width: string;
}

export interface DataItem {
  x: number;
  y: number;
  z: number;
}

export interface PlotData {
  data: Array<{
    x: number[];
    y: number[];
    z: number[];
    type: string;
    mode: string;
    marker: {
      size: number;
      color: number[];
      colorscale: string;
      opacity: number;
    };
    line: {
      width: number;
      color: string;
    };
  }>;
  layout: any;
}

export interface UploadState {
  file: File | null;
  progress: number;
  status: 'idle' | 'uploading' | 'completed' | 'error';
  error: string | null;
}

export interface PlotState {
  plotData: PlotData | null;
  rawData: DataItem[];
  displayData: DataItem[];
  isLoading: boolean;
  error: string | null;
}

export interface BuildingState {
  buildings: Building[];
  currentBuilding: Building | null;
  editingIndex: number | null;
  error: string | null;
}

export interface ExportState {
  exportData: any;
  isExporting: boolean;
  error: string | null;
}

export interface RootState {
  upload: UploadState;
  plot: PlotState;
  building: BuildingState;
  export: ExportState;
  stepper: StepperState;
}

export interface StepperState {
  currentStep: number;
  stepsCompleted: Record<number, boolean>;
}

export const siteSurfaceStepperSlice = createSlice({
  name: 'siteSurfaceStepper',
  initialState: {
    currentStep: 1,
    stepsCompleted: {},
  } as StepperState,
  reducers: {
    nextStep: (state) => {
      state.stepsCompleted[state.currentStep] = true;
      state.currentStep += 1;
    },
    previousStep: (state) => {
      state.currentStep -= 1;
    },
    setStep: (state, action) => {
      state.currentStep = action.payload;
    },
    resetStepper: (state) => {
      state.currentStep = 1;
      state.stepsCompleted = {};
    },
  },
});

export const {
  nextStep: siteSurfaceNextStep,
  previousStep: siteSurfacePreviousStep,
  setStep: siteSurfaceSetStep,
  resetStepper: siteSurfaceResetStepper,
} = siteSurfaceStepperSlice.actions;

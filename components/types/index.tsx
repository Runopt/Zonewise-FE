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
export interface UploadStatePipe {
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

  siteSurfaceStepper: StepperState;
  pipeSystemStepper: StepperState;
  waterSupplyStepper: StepperState;
  slopeStabilityStepper: StepperState;
}

export interface StepperState {
  currentStep: number;
  stepsCompleted: Record<number, boolean>;
}

export interface PathNumberState {
  pathNumbers: {
    required: number;
    values: { [key: number]: string };
  };
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  isFormValid: boolean;
  csvData: Blob | null;
}

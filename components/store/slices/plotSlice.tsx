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
export const fetchPlotData = createAsyncThunk(
  'plot/fetchPlotData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/plot-data');
      if (!response.ok) throw new Error('Failed to fetch plot data');
      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch data',
      );
    }
  },
);

export const plotSlice = createSlice({
  name: 'plot',
  initialState: {
    plotData: null,
    rawData: [],
    displayData: [],
    isLoading: false,
    error: null,
  } as PlotState,
  reducers: {
    updateDisplayData: (state, action: PayloadAction<DataItem[]>) => {
      state.displayData = action.payload;
    },
    appendDisplayData: (state, action: PayloadAction<DataItem[]>) => {
      state.displayData = [...state.displayData, ...action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlotData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPlotData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.plotData = action.payload;
        state.rawData = action.payload.data[0].x.map(
          (x: number, i: number) => ({
            x: x,
            y: action.payload.data[0].y[i],
            z: action.payload.data[0].z[i],
          }),
        );
        state.displayData = state.rawData.slice(0, 40);
      })
      .addCase(fetchPlotData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

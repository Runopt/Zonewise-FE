import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

export interface Building {
  name: string;
  length: string;
  width: string;
}

export interface BuildingState {
  buildings: Building[];
  currentBuilding: Building | null;
  editingIndex: number | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export const submitBuildings = createAsyncThunk(
  'buildings/submitBuildings',
  async (payload: URLSearchParams, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'http://54.90.88.209:8000/upload/building-info',
        payload.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            accept: 'application/json',
          },
        },
      );
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || error.message || 'Unknown error';
      console.error('Error in submitBuildings:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  },
);

const initialState: BuildingState = {
  buildings: [],
  currentBuilding: null,
  editingIndex: null,
  status: 'idle',
  error: null,
};

export const buildingSlice = createSlice({
  name: 'building',
  initialState,
  reducers: {
    addBuilding: (state, action: PayloadAction<Building>) => {
      const { name, length, width } = action.payload;
      const trimmedName = name.trim().toLowerCase();

      const isDuplicate = state.buildings.some(
        (building) => building.name.trim().toLowerCase() === trimmedName,
      );

      if (isDuplicate) {
        toast.error('A building with this name already exists.');
        state.error = 'A building with this name already exists.';
        return state;
      }

      if (!name.trim() || !length.trim() || !width.trim()) {
        toast.error('All building details must be filled in.');
        state.error = 'All building details must be filled in.';
        return state;
      }

      state.buildings.push(action.payload);
      toast.success('Building added successfully.');
      state.error = null;
      return state;
    },
    updateBuilding: (
      state,
      action: PayloadAction<{ index: number; building: Building }>,
    ) => {
      const { index, building } = action.payload;
      const { name, length, width } = building;
      const trimmedName = name.trim().toLowerCase();

      const isDuplicate = state.buildings.some(
        (b, i) => i !== index && b.name.trim().toLowerCase() === trimmedName,
      );

      if (isDuplicate) {
        toast.error('A building with this name already exists.');
        state.error = 'A building with this name already exists.';
        return state;
      }

      if (!name.trim() || !length.trim() || !width.trim()) {
        toast.error('All building details must be filled in.');
        state.error = 'All building details must be filled in.';
        return state;
      }

      state.buildings[index] = building;
      toast.success('Building updated successfully.');
      state.error = null;
      return state;
    },
    deleteBuilding: (state, action: PayloadAction<number>) => {
      state.buildings = state.buildings.filter((_, i) => i !== action.payload);
      toast.success('Building deleted successfully.');
      state.error = null;
      return state;
    },
    setEditingBuilding: (state, action: PayloadAction<number | null>) => {
      state.editingIndex = action.payload;
      state.currentBuilding =
        action.payload !== null ? state.buildings[action.payload] : null;
      return state;
    },
    resetBuildingState: (state) => {
      state.status = 'idle';
      state.error = null;
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitBuildings.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        toast.dismiss();
        toast.info('Submitting buildings...', {
          toastId: 'building-submission',
          isLoading: true,
        });
        return state;
      })
      .addCase(submitBuildings.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
        toast.dismiss('building-submission');
        toast.success('Buildings submitted successfully.');
        return state;
      })
      .addCase(submitBuildings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        toast.dismiss('building-submission');
        toast.error(
          action.payload
            ? `Submission failed: ${action.payload}`
            : 'Failed to submit buildings.',
        );
        return state;
      });
  },
});

export const {
  addBuilding,
  updateBuilding,
  deleteBuilding,
  setEditingBuilding,
  resetBuildingState,
} = buildingSlice.actions;

export default buildingSlice.reducer;

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
  'building/submitBuildings',
  async (buildings: Building[], { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/buildings', { buildings });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || 'Failed to submit buildings';

        return rejectWithValue(errorMessage);
      }
      return rejectWithValue('An unexpected error occurred');
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
  
      const isDuplicate = state.buildings.some(
        (building) =>
          building.name.toLowerCase() === action.payload.name.toLowerCase(),
      );

      if (isDuplicate) {
        toast.error(
          'A building with this name already exists. Please use a unique name.',
        );
        state.error =
          'A building with this name already exists. Please use a unique name.';
        return;
      }

    
      const { name, length, width } = action.payload;
      if (!name.trim() || !length.trim() || !width.trim()) {
        toast.error('All building details must be filled in');
        state.error = 'All building details must be filled in';
        return;
      }

      
      state.buildings.push(action.payload);
      toast.success('Building added successfully');
      state.error = null;
    },
    updateBuilding: (
      state,
      action: PayloadAction<{ index: number; building: Building }>,
    ) => {
      const { index, building } = action.payload;


      const isDuplicate = state.buildings.some(
        (b, i) =>
          i !== index && b.name.toLowerCase() === building.name.toLowerCase(),
      );

      if (isDuplicate) {
        toast.error(
          'A building with this name already exists. Please use a unique name.',
        );
        state.error =
          'A building with this name already exists. Please use a unique name.';
        return;
      }

      // Validate inputs
      const { name, length, width } = building;
      if (!name.trim() || !length.trim() || !width.trim()) {
        toast.error('All building details must be filled in');
        state.error = 'All building details must be filled in';
        return;
      }

      state.buildings[index] = building;
      toast.success('Building updated successfully');
      state.error = null;
    },
    deleteBuilding: (state, action: PayloadAction<number>) => {
      state.buildings = state.buildings.filter((_, i) => i !== action.payload);
      toast.success('Building deleted successfully');
      state.error = null;
    },
    setEditingBuilding: (state, action: PayloadAction<number | null>) => {
      state.editingIndex = action.payload;
      state.currentBuilding =
        action.payload !== null ? state.buildings[action.payload] : null;
    },
    resetBuildingState: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitBuildings.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        toast.loading('Submitting buildings...');
      })
      .addCase(submitBuildings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        toast.dismiss();
        toast.success('Buildings submitted successfully');
      })
      .addCase(submitBuildings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        toast.dismiss();
        toast.error(action.payload as string);
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

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '@/components/store/store';
import { PathNumberState } from '../../types/index';

const initialState: PathNumberState = {
  pathNumbers: {
    required: 0,
    values: {},
  },
  isLoading: false,
  isSubmitting: false,
  error: null,
  isFormValid: false,
  csvData: null as Blob | null,
};

export const fetchRequiredPathNumbers = createAsyncThunk(
  'pathNumber/fetchRequired',
  async (_, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const uploadData = state.uploadWaterFile.data;

    if (!uploadData || !uploadData.unique_path_count) {
      return rejectWithValue('No path number data available');
    }
    return uploadData.unique_path_count;
  },
);

export const submitPathNumbers = createAsyncThunk(
  'pathNumber/submit',
  async (values: { [key: number]: string }, { rejectWithValue }) => {
    const flowRates = Object.values(values).map(Number);

    try {
      const response = await axios.post(
        'http://54.90.88.209:8000/upload/flow-rates',
        {
          flow_rates: flowRates,
        },
        {
          responseType: 'blob',
        },
      );

      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to submit path numbers');
    }
  },
);

export const pathNumberSlice = createSlice({
  name: 'pathNumber',
  initialState,
  reducers: {
    updatePathNumber: (state, action) => {
      const { index, value } = action.payload;
      state.pathNumbers.values[index] = value;

      // Validate form
      const allFieldsFilled =
        Object.keys(state.pathNumbers.values).length ===
          state.pathNumbers.required &&
        Object.values(state.pathNumbers.values).every((value) => value !== '');

      state.isFormValid = allFieldsFilled;
    },
    resetPathNumbers: (state) => {
      state.pathNumbers.values = {};
      state.isFormValid = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequiredPathNumbers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRequiredPathNumbers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pathNumbers.required = action.payload;
      })
      .addCase(fetchRequiredPathNumbers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(submitPathNumbers.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(submitPathNumbers.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.csvData = action.payload;
      })
      .addCase(submitPathNumbers.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });
  },
});

export const { updatePathNumber, resetPathNumbers } = pathNumberSlice.actions;
export default pathNumberSlice.reducer;

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import axios, { AxiosProgressEvent } from 'axios';

interface UploadConfig {
  apiEndpoint: string;
  additionalData?: Record<string, any>;
  sliceName: string;
}

type UploadState = {
  fileName: string | null;
  fileSize: number | null;
  fileType: string | null;
  progress: number;
  status: 'idle' | 'uploading' | 'completed' | 'error';
  error: string | null;
  data: any | null;
};

export const createUploadThunk = (config: UploadConfig) => {
  return createAsyncThunk(
    `${config.sliceName}/uploadFile`,
    async (fileName: string, { rejectWithValue }) => {
      try {
        const requestData = {
          fileName,
          ...config.additionalData,
        };

        const response = await axios.post(config.apiEndpoint, requestData, {
          headers: {
            'Content-Type': 'application/json',
          },
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            const totalSize = progressEvent.total || progressEvent.loaded;
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / totalSize,
            );
            // dispatch(setWaterProgress(percentCompleted));
          },
        });

        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message || error.message || 'Upload failed';
          return rejectWithValue(errorMessage);
        }
        return rejectWithValue('An unexpected error occurred during upload');
      }
    },
  );
};

export const createUploadSlice = (
  config: UploadConfig,
  uploadThunk: ReturnType<typeof createAsyncThunk>,
) => {
  const initialState: UploadState = {
    fileName: null,
    fileSize: null,
    fileType: null,
    progress: 0,
    status: 'idle',
    error: null,
    data: null,
  };

  return createSlice({
    name: config.sliceName,
    initialState,
    reducers: {
      setFile: (
        state,
        action: PayloadAction<{
          name: string;
          size: number;
          type: string;
        }>,
      ) => {
        state.fileName = action.payload.name;
        state.fileSize = action.payload.size;
        state.fileType = action.payload.type;
        state.status = 'idle';
        state.progress = 0;
        state.error = null;
        state.data = null;
      },
      resetUpload: (state) => {
        Object.assign(state, initialState);
      },
      setProgress: (state, action: PayloadAction<number>) => {
        state.progress = action.payload;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(uploadThunk.pending, (state) => {
          state.status = 'uploading';
          state.error = null;
          state.progress = 0;
        })
        .addCase(uploadThunk.fulfilled, (state, action) => {
          state.status = 'completed';
          state.progress = 100;
          state.data = action.payload;
          toast.success('Water data file uploaded successfully');
        })
        .addCase(uploadThunk.rejected, (state, action) => {
          state.status = 'error';
          state.error = action.payload as string;
          state.progress = 0;
          toast.error(state.error || 'Water data file upload failed');
        });
    },
  });
};

// Configuration for water data upload
const waterUploadConfig: UploadConfig = {
  sliceName: 'uploadWaterFile',
  apiEndpoint: '/api/upload-water-data',
  additionalData: {},
};

// Create the upload thunk and slice
export const uploadWaterFile = createUploadThunk(waterUploadConfig);
export const uploadWaterFileSlice = createUploadSlice(
  waterUploadConfig,
  uploadWaterFile as ReturnType<typeof createAsyncThunk>,
);

// Export actions and reducer
export const {
  setFile: setWaterFile,
  resetUpload: resetWaterUpload,
  setProgress: setWaterProgress,
} = uploadWaterFileSlice.actions;

export const waterUploadReducer = uploadWaterFileSlice.reducer;

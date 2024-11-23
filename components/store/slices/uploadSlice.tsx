import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import axios from 'axios';

export type UploadState = {
  fileName: string | null;
  fileSize: number | null;
  fileType: string | null;
  progress: number;
  status: 'idle' | 'uploading' | 'completed' | 'error';
  error: string | null;
  data: any | null;
};

export interface UploadConfig {
  sliceName: string;
  apiEndpoint: string;
}

export const createUploadThunk = (config: UploadConfig) => {
  return createAsyncThunk(
    `${config.sliceName}/uploadFile`,
    async (fileName: string, { rejectWithValue }) => {
      try {
        const response = await axios.post(
          config.apiEndpoint,
          { fileName },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total || 100),
              );
            },
          },
        );

        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          return rejectWithValue(
            error.response?.data?.message || error.message || 'Upload failed',
          );
        }
        return rejectWithValue('Upload failed');
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
        state.fileName = null;
        state.fileSize = null;
        state.fileType = null;
        state.progress = 0;
        state.status = 'idle';
        state.error = null;
        state.data = null;
      },
      // Optional: Add action to update progress
      setProgress: (state, action: PayloadAction<number>) => {
        state.progress = action.payload;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(uploadThunk.pending, (state) => {
          state.status = 'uploading';
          state.error = null;
        })
        .addCase(uploadThunk.fulfilled, (state, action) => {
          state.status = 'completed';
          state.progress = 100;
          state.data = action.payload;
        })
        .addCase(uploadThunk.rejected, (state, action) => {
          state.status = 'error';
          state.error = action.payload as string;
          toast.error(state.error || 'File upload failed');
        });
    },
  });
};

const siteUploadConfig: UploadConfig = {
  sliceName: 'upload',
  apiEndpoint: 'https://runopt.onrender.com/upload/site-surface',
};

export const uploadSiteFile = createUploadThunk(siteUploadConfig);
export const uploadSlice = createUploadSlice(
  siteUploadConfig,
  uploadSiteFile as ReturnType<typeof createAsyncThunk>,
);

export const {
  setFile: setSiteFile,
  resetUpload: resetSiteUpload,
  setProgress: setSiteProgress,
} = uploadSlice.actions;

export const siteUploadReducer = uploadSlice.reducer;

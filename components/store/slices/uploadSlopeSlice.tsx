import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

// Generic type for file upload configuration
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
        const response = await fetch(config.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fileName }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Upload failed');
        }
        return await response.json();
      } catch (error) {
        return rejectWithValue(
          error instanceof Error ? error.message : 'Upload failed',
        );
      }
    },
  );
};


export const createUploadSlice = (
  config: UploadConfig,
  uploadThunk: ReturnType<typeof createAsyncThunk<string, string>>,
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

const slopeUploadConfig: UploadConfig = {
  sliceName: 'uploadSlopeFile',
  apiEndpoint: '/api/upload-slope-data',
};

export const uploadSlopeFile = createUploadThunk(slopeUploadConfig);
export const uploadSlopeFileSlice = createUploadSlice(
  slopeUploadConfig,
  uploadSlopeFile,
);


export const { setFile: setSlopeFile, resetUpload: resetSlopeUpload } =
  uploadSlopeFileSlice.actions;
export const slopeUploadReducer = uploadSlopeFileSlice.reducer;

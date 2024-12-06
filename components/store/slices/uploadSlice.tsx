import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

export type UploadState = {
  fileName: string | null;
  fileSize: number | null;
  fileType: string | null;
  progress: number;
  status: 'idle' | 'uploading' | 'completed' | 'error';
  error: string | null;
  data: any | null;
  sessionId: string | null;
};

export interface UploadConfig {
  sliceName: string;
  apiEndpoint: string;
}

export interface UploadResponse {
  session_id: string;
  [key: string]: any;
}

export type UploadError = string;

export const createUploadThunk = (config: UploadConfig) => {
  return createAsyncThunk<UploadResponse, string, { rejectValue: UploadError }>(
    `${config.sliceName}/uploadFile`,
    async (fileName: string, { rejectWithValue }) => {
      try {
        const fileInput = document.querySelector(
          'input[type="file"]',
        ) as HTMLInputElement;
        const storedFileName = localStorage.getItem('uploadedFileName');
        const storedFileSize = localStorage.getItem('uploadedFileSize');
        const storedFileType = localStorage.getItem('uploadedFileType');

        if (!storedFileName) {
          return rejectWithValue('No file selected');
        }
        const file = fileInput?.files?.[0];

        if (!file) {
          return rejectWithValue('No file selected');
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await fetch(config.apiEndpoint, {
            method: 'POST',
            headers: {
              accept: 'application/json',
            },
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(
              errorData?.message || response.statusText || 'Upload failed',
            );
          }

          const result = await response.json();
          if (!result.session_id) {
            throw new Error('No session ID received from server');
          }
          return result as UploadResponse;
        } catch (error) {
          if (error instanceof Error) {
            throw error;
          }
          throw new Error('Upload failed');
        }
      } catch (error) {
        if (error instanceof Error) {
          return rejectWithValue(error.message);
        }
        return rejectWithValue('Upload failed');
      }
    },
  );
};

export const createUploadSlice = (
  config: UploadConfig,
  uploadThunk: ReturnType<typeof createUploadThunk>,
) => {
  const initialState: UploadState = {
    fileName: null,
    fileSize: null,
    fileType: null,
    progress: 0,
    status: 'idle',
    error: null,
    data: null,
    sessionId: null,
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
        state.sessionId = null;
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
          state.sessionId = null;
        })
        .addCase(
          uploadThunk.fulfilled,
          (state, action: PayloadAction<UploadResponse>) => {
            state.status = 'completed';
            state.progress = 100;
            state.data = action.payload;
            state.sessionId = action.payload.session_id;
            console.log('Session ID:', state.sessionId);
            toast.success('File uploaded successfully');
          },
        )
        .addCase(uploadThunk.rejected, (state, action) => {
          state.status = 'error';
          state.error = action.payload || 'Unknown error occurred';
          state.sessionId = null;
          toast.error(state.error);
        });
    },
  });
};

export interface RootState {
  upload: UploadState;
}

export const selectUploadSessionId = (state: RootState) =>
  state.upload.sessionId;

const siteUploadConfig: UploadConfig = {
  sliceName: 'upload',
  apiEndpoint: 'http://54.90.88.209:8000/upload/site-surface',
};

export const uploadSiteFile = createUploadThunk(siteUploadConfig);
export const uploadSlice = createUploadSlice(siteUploadConfig, uploadSiteFile);

export const {
  setFile: setSiteFile,
  resetUpload: resetSiteUpload,
  setProgress: setSiteProgress,
} = uploadSlice.actions;

export const siteUploadReducer = uploadSlice.reducer;

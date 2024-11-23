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
};

export interface UploadConfig {
  sliceName: string;
  apiEndpoint: string;
}

export const createUploadThunk = (config: UploadConfig) => {
  return createAsyncThunk(
    `${config.sliceName}/uploadFile`,
    async (fileName: string, { rejectWithValue }) => {
    
      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      const file = fileInput?.files?.[0];

      if (!file) {
        return rejectWithValue('No file selected');
      }

      try {
        const arrayBuffer = await new Promise<ArrayBuffer>(
          (resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
              const result = e.target?.result;
              if (result instanceof ArrayBuffer) {
                resolve(result);
              } else {
                reject(new Error('Failed to read file as ArrayBuffer'));
              }
            };

            reader.onerror = () => {
              reject(new Error('Failed to read file'));
            };

            reader.readAsArrayBuffer(file);
          },
        );

        const response = await fetch(config.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': file.type || 'application/octet-stream',
            accept: 'application/json',
          },
          body: arrayBuffer,
        });

        if (!response.ok) {
          throw new Error(response.statusText || 'Upload failed');
        }

        const result = await response.json();
        return result;
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
          toast.success('File uploaded successfully');
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
  apiEndpoint: 'http://localhost:8000/upload/site-surface',
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

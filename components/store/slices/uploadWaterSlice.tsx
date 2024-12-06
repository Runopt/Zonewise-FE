import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';


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
interface UploadResponse {
  message?: string,
  unique_path_count?: number
}

export const createUploadThunk = (config: UploadConfig) => {
  return createAsyncThunk<UploadResponse, string>(
    `${config.sliceName}/uploadFile`,
    async (fileName: string, { dispatch, rejectWithValue }) => {
      try {
        const fileInput = document.querySelector(
          'input[type="file"]',
        ) as HTMLInputElement;
        const file = fileInput?.files?.[0];

        if (!file) {
          return rejectWithValue('No file selected');
        }

        const formData = new FormData();
        formData.append('file', file);


        if (config.additionalData) {
          Object.entries(config.additionalData).forEach(([key, value]) => {
            formData.append(key, value);
          });
        }

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
          return result;
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
        .addCase(
          uploadThunk.fulfilled,
          (state, action: PayloadAction<UploadResponse>) => {
            state.status = 'completed';
            state.progress = 100;
            state.data = action.payload;

            const responseMessage =
              action.payload?.message ||
              'Water data file uploaded successfully';
            const uniquePathCount = action.payload?.unique_path_count;
            toast.success(
              `${responseMessage} (Unique Paths: ${uniquePathCount || 0})`,
            );
          },
        )
        .addCase(uploadThunk.rejected, (state, action) => {
          state.status = 'error';
          state.error = action.payload as string;
          state.progress = 0;
          toast.error(state.error || 'Water data file upload failed');
        });
    },
  });
};

const waterUploadConfig: UploadConfig = {
  sliceName: 'uploadWaterFile',
  apiEndpoint: 'http://54.90.88.209:8000/upload/water-supply',
  additionalData: {},
};

export const uploadWaterFile = createUploadThunk(waterUploadConfig);
export const uploadWaterFileSlice = createUploadSlice(
  waterUploadConfig,
  uploadWaterFile as ReturnType<typeof createAsyncThunk>,
);

export const {
  setFile: setWaterFile,
  resetUpload: resetWaterUpload,
  setProgress: setWaterProgress,
} = uploadWaterFileSlice.actions;

export const waterUploadReducer = uploadWaterFileSlice.reducer;

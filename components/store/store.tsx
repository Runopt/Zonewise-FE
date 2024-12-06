import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { siteUploadReducer } from './slices/uploadSlice';
import { pipeUploadReducer } from './slices/uploadPipeSlice';
import { slopeUploadReducer } from './slices/uploadSlopeSlice';
import { waterUploadReducer } from './slices/uploadWaterSlice';
import { plotSlice } from './slices/plotSlice';
import { buildingSlice } from './slices/buildingSlice';
import { pathNumberSlice } from './slices/pathNumberSlice';
import { siteSurfaceStepperSlice } from './slices/stepperSlice';
import { pipeSystemStepperSlice } from './slices/stepperPipeSlice';
import { waterSupplyStepperSlice } from './slices/stepperWaterSlice';
import { slopeStabilityStepperSlice } from './slices/stepperSlopeSlice';
import { nodeSlice } from './slices/nodeSlice';

const rootReducer = combineReducers({
  upload: siteUploadReducer,
  uploadPipeFile: pipeUploadReducer,
  uploadSlopeFile: slopeUploadReducer,
  uploadWaterFile: waterUploadReducer,
  plot: plotSlice.reducer,
  building: buildingSlice.reducer,
  path: pathNumberSlice.reducer,
  node: nodeSlice.reducer,
  siteSurfaceStepper: siteSurfaceStepperSlice.reducer,
  pipeSystemStepper: pipeSystemStepperSlice.reducer,
  waterSupplyStepper: waterSupplyStepperSlice.reducer,
  slopeStabilityStepper: slopeStabilityStepperSlice.reducer,
});

const persistConfig = {
  key: 'root',
  storage,

  whitelist: [
    'node',
    'upload',
    'path',
    'uploadPipeFile',
    'uploadSlopeFile',
    'uploadWaterFile',

    'siteSurfaceStepper',
    'pipeSystemStepper',
    'waterSupplyStepper',
    'siteSurfaceStepper',
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);

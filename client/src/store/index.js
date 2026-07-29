import { configureStore } from '@reduxjs/toolkit';
import studioReducer from './studioSlice';

export const store = configureStore({
  reducer: {
    studio: studioReducer
  }
});

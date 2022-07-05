import { configureStore } from '@reduxjs/toolkit';

import masterReducer from '../reducers/masterSlice';

export const store = configureStore({
  reducer: {
    master: masterReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore } from '@reduxjs/toolkit';
import summary from './summarySlice';

const store = configureStore({
  reducer: {
    summary
  }
});

export default store;
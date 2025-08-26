import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/slices/authSlice";
import productSliceReducer from "@/store/slices/productSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productSliceReducer,
  },
});

// Types for use in components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

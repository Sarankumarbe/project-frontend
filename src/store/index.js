import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../store/slices/authSlice";
import courseSlice from "../store/slices/courseSlice";
import testSlice from "../store/slices/testSlice";
import { adminApi } from "./api/adminApi";
import { userApi } from "./api/userApi";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    course: courseSlice,
    test: testSlice,
    [adminApi.reducerPath]: adminApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(adminApi.middleware, userApi.middleware),
});

export default store;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  courses: [],
  currentCourse: null,
  loading: false,
  error: null,
  filters: {
    category: "",
    priceRange: [0, 10000],
    duration: "",
  },
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCourses: (state, action) => {
      state.courses = action.payload;
    },
    setCurrentCourse: (state, action) => {
      state.currentCourse = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setCourses,
  setCurrentCourse,
  setError,
  updateFilters,
  clearError,
} = courseSlice.actions;
export default courseSlice.reducer;

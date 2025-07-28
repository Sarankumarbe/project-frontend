import { createSlice } from "@reduxjs/toolkit";

// Helper functions for localStorage with separate storage for users and admins
const loadAuthFromLocalStorage = () => {
  try {
    // Check for admin first, then user
    const admin = localStorage.getItem("adminInfo");
    if (admin) {
      const parsedAdmin = JSON.parse(admin);
      return {
        user: parsedAdmin,
        isAuthenticated: true,
        role: "admin",
      };
    }

    const user = localStorage.getItem("userInfo");
    if (user) {
      const parsedUser = JSON.parse(user);
      return {
        user: parsedUser,
        isAuthenticated: true,
        role: "user",
      };
    }
  } catch (error) {
    console.error("Error loading auth data from localStorage:", error);
  }
  return {};
};

const saveAuthToLocalStorage = (userData) => {
  try {
    if (userData.role === "admin") {
      localStorage.setItem("adminInfo", JSON.stringify(userData));
      localStorage.removeItem("userInfo"); // Clear user info if existed
    } else if (userData.role === "user") {
      localStorage.setItem("userInfo", JSON.stringify(userData));
      localStorage.removeItem("adminInfo"); // Clear admin info if existed
    }
  } catch (error) {
    console.error("Error saving auth data to localStorage:", error);
  }
};

const removeAuthFromLocalStorage = () => {
  try {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("adminInfo");
  } catch (error) {
    console.error("Error removing auth data from localStorage:", error);
  }
};

const initialState = {
  user: null,
  isAuthenticated: false,
  role: null, // 'admin' or 'user'
  loading: false,
  error: null,
  ...loadAuthFromLocalStorage(), // Load auth data from localStorage
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      const { user } = action.payload;

      // Validate role
      if (!["admin", "user"].includes(user.role)) {
        throw new Error(`Invalid role: ${user.role}`);
      }

      state.loading = false;
      state.isAuthenticated = true;
      state.user = {
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      };
      state.role = user.role;

      saveAuthToLocalStorage(state.user);
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.role = null;
      state.error = null;
      removeAuthFromLocalStorage();
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
        saveAuthToLocalStorage(state.user);
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  updateUser,
} = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserRole = (state) => state.auth.role;

export default authSlice.reducer;

// src/redux/themeSlice.js
import { createSlice } from "@reduxjs/toolkit";

// -------------------------
// Initial state for theme slice
// -------------------------
const initialState = {
  darkMode: false, // Default to light mode
};

// -------------------------
// Create a Redux slice for theme management
// -------------------------
const themeSlice = createSlice({
  name: "theme", // Name of the slice
  initialState, // Initial state object
  reducers: {
    // Toggle between dark mode and light mode
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
  },
});

// -------------------------
// Export the reducer to include in the Redux store
// -------------------------
export default themeSlice.reducer;

// -------------------------
// Selector to access the theme state in components
// -------------------------
export const selectProject = (state) => state.theme;

// -------------------------
// Export the actions to dispatch from components
// -------------------------
export const { toggleDarkMode, setLocale } = themeSlice.actions;

// src/redux/store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";

import themeReducer from "./themeSlice";

/**
 * Create a Redux store with optional persistence (redux-persist) for client-side
 * @returns {Promise<{store: any, persistor: any}>} Redux store and persistor
 */
export async function createStore() {
  const isClient = typeof window !== "undefined"; // Check if running in browser

  if (isClient) {
    // -------------------------
    // Dynamic import of redux-persist modules for client
    // -------------------------
    const persistModule = await import("redux-persist");
    const storageModule = await import("redux-persist/lib/storage");

    const persistStore = persistModule.persistStore;
    const persistReducer = persistModule.persistReducer;

    // Handle default export differences
    const storage = storageModule.default.default || storageModule.default;

    // -------------------------
    // Configure persistence for theme slice
    // -------------------------
    const themePersistConfig = {
      key: "theme", // Key for localStorage
      storage, // Storage engine (localStorage)
      whitelist: ["darkMode"], // Only persist darkMode property
    };

    // -------------------------
    // Combine reducers with persisted theme slice
    // -------------------------
    const rootReducer = combineReducers({
      theme: persistReducer(themePersistConfig, themeReducer),
    });

    // -------------------------
    // Create Redux store with default middleware
    // Disable serializableCheck and immutableCheck for simplicity
    // -------------------------
    const store = configureStore({
      reducer: rootReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
          immutableCheck: false,
        }),
      devTools: true, // Enable Redux DevTools in client
    });

    const persistor = persistStore(store); // Initialize persistor

    return { store, persistor };
  } else {
    // -------------------------
    // Server-side store (no persistence)
    // -------------------------
    const rootReducer = combineReducers({
      theme: themeReducer,
    });

    const store = configureStore({
      reducer: rootReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
          immutableCheck: false,
        }),
      devTools: false, // Disable DevTools on server
    });

    return { store, persistor: null }; // No persistor on server
  }
}

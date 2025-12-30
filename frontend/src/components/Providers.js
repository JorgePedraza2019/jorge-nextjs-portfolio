// src/components/Providers.js
"use client";

import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { createStore } from "@/redux/store";

/**
 * Providers component wraps the application with:
 * 1. Redux store and persistence (PersistGate)
 * 2. Token renewal for Firebase sessions
 * 3. Session management for inactivity logout
 * 4. Global toast notifications (react-hot-toast)
 *
 * Usage: Wrap your main app component with <Providers> in the root layout
 */
export default function Providers({ children }) {
  const [reduxData, setReduxData] = useState({ store: null, persistor: null });

  // -------------------------
  // Initialize Redux store asynchronously
  // -------------------------
  useEffect(() => {
    createStore().then(({ store, persistor }) => {
      setReduxData({ store, persistor });
    });
  }, []);

  // Wait until store is ready before rendering
  if (!reduxData.store) return null;

  return (
    <Provider store={reduxData.store}>
      {/* PersistGate ensures persisted Redux state is rehydrated */}
      {reduxData.persistor ? (
        <PersistGate loading={null} persistor={reduxData.persistor}>
          {children}
        </PersistGate>
      ) : (
        { children }
      )}
    </Provider>
  );
}

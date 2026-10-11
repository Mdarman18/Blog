import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import blogReducer from "./slices/blogSlice";

const rootReducer = combineReducers({
  blog: blogReducer,
  // add other reducers like userAuth here if needed
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["blog"], // only persist the blog state
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import filtersReducer from "./slices/filtersSlice";

const loadCartFromStorage = () => {
  try {
    const serializedCart = localStorage.getItem("cart");
    if (serializedCart === null) {
      return undefined;
    }
    return JSON.parse(serializedCart);
  } catch (err) {
    return undefined;
  }
};

const preloadedState = {
  cart: loadCartFromStorage() || undefined,
};

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    cart: cartReducer,
    filters: filtersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  preloadedState,
  devTools: process.env.NODE_ENV !== "production",
});

store.subscribe(() => {
  try {
    const serializedCart = JSON.stringify(store.getState().cart);
    localStorage.setItem("cart", serializedCart);
  } catch (err) {
  }
});

export default store;

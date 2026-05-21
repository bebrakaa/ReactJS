import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import productsReducer from "./slices/productsSlice";
import cartReducer from "./slices/cartSlice";
import ordersReducer from "./slices/ordersSlice";

// Load cart from localStorage
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

// Preloaded state
const preloadedState = {
  cart: loadCartFromStorage() || undefined,
};

// Configure store with Redux Toolkit
const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
    orders: ordersReducer,
  },
  preloadedState,
  devTools: process.env.NODE_ENV !== "production",
});

// Subscribe to store changes to save cart
store.subscribe(() => {
  try {
    const serializedCart = JSON.stringify(store.getState().cart);
    localStorage.setItem("cart", serializedCart);
  } catch (err) {
    // Ignore write errors
  }
});

export default store;

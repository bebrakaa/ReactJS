import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import productsReducer from "./slices/productsSlice";
import cartReducer from "./slices/cartSlice";
import ordersReducer from "./slices/ordersSlice";

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
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
    orders: ordersReducer,
  },
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

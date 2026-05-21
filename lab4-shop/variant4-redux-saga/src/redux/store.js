import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import authReducer from "./sagas/authSaga";
import productsReducer from "./sagas/productsSaga";
import cartReducer from "./slices/cartSlice";
import ordersReducer from "./sagas/ordersSaga";
import rootSaga from "./rootSaga";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
    orders: ordersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    }).concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== "production",
});

sagaMiddleware.run(rootSaga);

store.subscribe(() => {
  try {
    localStorage.setItem("cart", JSON.stringify(store.getState().cart.items));
  } catch {
    // localStorage may be unavailable in restricted browser modes.
  }
});

export default store;

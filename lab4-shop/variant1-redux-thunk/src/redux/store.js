import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import thunk from "redux-thunk";

// Reducers
import authReducer from "./reducers/authReducer";
import productsReducer from "./reducers/productsReducer";
import cartReducer from "./reducers/cartReducer";
import ordersReducer from "./reducers/ordersReducer";

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  products: productsReducer,
  cart: cartReducer,
  orders: ordersReducer
});

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const serializedCart = localStorage.getItem("cart");
    if (serializedCart === null) {
      return undefined;
    }
    const cartData = JSON.parse(serializedCart);
    
    // Если в localStorage только массив items (старый формат)
    if (Array.isArray(cartData)) {
      return undefined; // Пусть использует initialState из reducer
    }
    
    // Если полный объект cart state
    return { cart: cartData };
  } catch (err) {
    return undefined;
  }
};

// Save cart to localStorage
const saveCartToStorage = (state) => {
  try {
    const serializedCart = JSON.stringify(state.cart);
    localStorage.setItem("cart", serializedCart);
  } catch (err) {
    // Ignore write errors
  }
};

// Initial state
const preloadedState = loadCartFromStorage();

// Redux DevTools Extension
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Create store
const store = createStore(
  rootReducer,
  preloadedState,
  composeEnhancers(applyMiddleware(thunk))
);

// Subscribe to store changes to save cart
store.subscribe(() => {
  saveCartToStorage(store.getState());
});

export default store;

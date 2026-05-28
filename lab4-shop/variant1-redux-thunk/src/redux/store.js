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

const saveCartToStorage = (state) => {
  try {
    const serializedCart = JSON.stringify(state.cart);
    localStorage.setItem("cart", serializedCart);
  } catch (err) {
  }
};

const preloadedState = loadCartFromStorage();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  preloadedState,
  composeEnhancers(applyMiddleware(thunk))
);

store.subscribe(() => {
  saveCartToStorage(store.getState());
});

export default store;

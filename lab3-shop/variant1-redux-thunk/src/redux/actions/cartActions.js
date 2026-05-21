import * as types from "../actionTypes";

// Добавить товар в корзину
export const addToCart = (product, quantity = 1) => {
  return {
    type: types.ADD_TO_CART,
    payload: { product, quantity },
  };
};

// Удалить товар из корзины
export const removeFromCart = (productId) => {
  return {
    type: types.REMOVE_FROM_CART,
    payload: productId,
  };
};

// Изменить количество товара
export const updateCartQuantity = (productId, quantity) => {
  return {
    type: types.UPDATE_CART_QUANTITY,
    payload: { productId, quantity },
  };
};

// Очистить корзину
export const clearCart = () => {
  return {
    type: types.CLEAR_CART,
  };
};

// Загрузить корзину из localStorage
export const loadCartFromStorage = () => {
  return (dispatch) => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        const cartItems = JSON.parse(savedCart);
        if (Array.isArray(cartItems) && cartItems.length > 0) {
          dispatch({
            type: types.LOAD_CART,
            payload: cartItems,
          });
        }
      }
    } catch (error) {
      console.error("Ошибка загрузки корзины из localStorage:", error);
      localStorage.removeItem("cart");
    }
  };
};


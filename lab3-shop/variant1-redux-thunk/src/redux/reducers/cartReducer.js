import * as types from "../actionTypes";

const initialState = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
};

// Функция для подсчета общей суммы и количества товаров
const calculateTotals = (items) => {
  let totalAmount = 0;
  let totalItems = 0;
  
  for (let item of items) {
    totalAmount += item.price * item.quantity;
    totalItems += item.quantity;
  }
  
  return { totalAmount, totalItems };
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ADD_TO_CART: {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);

      let newItems;

      if (existingItem) {
        // Товар уже есть в корзине - увеличиваем количество
        newItems = state.items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Добавляем новый товар в корзину
        newItems = [
          ...state.items,
          {
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: quantity,
          },
        ];
      }

      const totals = calculateTotals(newItems);

      return {
        ...state,
        items: newItems,
        ...totals,
      };
    }

    case types.REMOVE_FROM_CART: {
      const newItems = state.items.filter((item) => item.id !== action.payload);
      const totals = calculateTotals(newItems);

      return {
        ...state,
        items: newItems,
        ...totals,
      };
    }

    case types.UPDATE_CART_QUANTITY: {
      const { productId, quantity } = action.payload;

      // Если количество 0 или меньше - удаляем товар
      if (quantity <= 0) {
        const newItems = state.items.filter((item) => item.id !== productId);
        const totals = calculateTotals(newItems);

        return {
          ...state,
          items: newItems,
          ...totals,
        };
      }

      // Обновляем количество товара
      const newItems = state.items.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );

      const totals = calculateTotals(newItems);

      return {
        ...state,
        items: newItems,
        ...totals,
      };
    }

    case types.CLEAR_CART:
      return {
        ...state,
        items: [],
        totalAmount: 0,
        totalItems: 0,
      };

    case types.LOAD_CART: {
      const loadedItems = action.payload;
      const totals = calculateTotals(loadedItems);

      return {
        ...state,
        items: loadedItems,
        ...totals,
      };
    }

    default:
      return state;
  }
};

export default cartReducer;

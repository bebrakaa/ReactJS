import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
};

function calculateTotals(items) {
  return items.reduce(
    (totals, item) => ({
      totalAmount: totals.totalAmount + item.price * item.quantity,
      totalItems: totals.totalItems + item.quantity,
    }),
    { totalAmount: 0, totalItems: 0 }
  );
}

function applyTotals(state) {
  const totals = calculateTotals(state.items);
  state.totalAmount = totals.totalAmount;
  state.totalItems = totals.totalItems;
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity,
        });
      }

      applyTotals(state);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      applyTotals(state);
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;

      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.id !== productId);
      } else {
        const item = state.items.find((cartItem) => cartItem.id === productId);
        if (item) {
          item.quantity = quantity;
        }
      }

      applyTotals(state);
    },
    clearCart: (state) => {
      state.items = [];
      applyTotals(state);
    },
    loadCart: (state, action) => {
      state.items = Array.isArray(action.payload) ? action.payload : [];
      applyTotals(state);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  loadCart,
} = cartSlice.actions;

export default cartSlice.reducer;

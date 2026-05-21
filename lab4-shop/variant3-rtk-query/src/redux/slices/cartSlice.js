import { createSlice } from "@reduxjs/toolkit";

// Helper function to calculate totals
const calculateTotals = (items) => {
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  return { totalAmount, totalItems };
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalAmount: 0,
    totalItems: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: quantity,
        });
      }

      const totals = calculateTotals(state.items);
      state.totalAmount = totals.totalAmount;
      state.totalItems = totals.totalItems;
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);

      const totals = calculateTotals(state.items);
      state.totalAmount = totals.totalAmount;
      state.totalItems = totals.totalItems;
    },

    updateCartQuantity: (state, action) => {
      const { productId, quantity } = action.payload;

      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.id !== productId);
      } else {
        const item = state.items.find((item) => item.id === productId);
        if (item) {
          item.quantity = quantity;
        }
      }

      const totals = calculateTotals(state.items);
      state.totalAmount = totals.totalAmount;
      state.totalItems = totals.totalItems;
    },

    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalItems = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateCartQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;

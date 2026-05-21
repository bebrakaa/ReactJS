import { createSagaSlice } from "../sagaSliceFactory";
import { API_URL } from "../../config/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Необходима авторизация");
  }

  return { Authorization: `Bearer ${token}` };
}

const ordersApi = {
  async createOrder(orderData) {
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Ошибка создания заказа");
    }

    return data.order;
  },

  async fetchOrders() {
    const response = await fetch(`${API_URL}/orders`, {
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Ошибка загрузки заказов");
    }

    return data.orders;
  },

  async cancelOrder(orderId) {
    const response = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Ошибка отмены заказа");
    }

    return data.order;
  },
};

const { slice, actions, saga } = createSagaSlice(
  "orders",
  {
    createOrder: {
      api: ordersApi.createOrder,
      onRequest: (state) => {
        state.lastCreatedOrder = null;
      },
      onSuccess: (state, action) => {
        state.items = [action.payload, ...state.items];
        state.lastCreatedOrder = action.payload;
      },
    },
    fetchOrders: {
      api: ordersApi.fetchOrders,
      onSuccess: (state, action) => {
        state.items = Array.isArray(action.payload) ? action.payload : [];
      },
    },
    cancelOrder: {
      api: ordersApi.cancelOrder,
      onSuccess: (state, action) => {
        state.items = state.items.map((order) =>
          order.id === action.payload.id ? action.payload : order
        );
      },
    },
  },
  {
    items: [],
    lastCreatedOrder: null,
  },
  {
    clearLastCreatedOrder: (state) => {
      state.lastCreatedOrder = null;
    },
  }
);

export const ordersActions = {
  ...actions,
  clearLastCreatedOrder: slice.actions.clearLastCreatedOrder,
};

export const ordersSaga = saga;
export default slice.reducer;

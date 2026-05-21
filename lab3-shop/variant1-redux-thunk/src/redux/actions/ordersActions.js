import * as types from "../actionTypes";
import { API_URL } from "../../config/api";

// Создание нового заказа
export const createOrder = (orderData) => {
  return async (dispatch) => {
    dispatch({ type: types.CREATE_ORDER_REQUEST });

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Необходима авторизация");
      }

      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Ошибка создания заказа");
      }

      dispatch({
        type: types.CREATE_ORDER_SUCCESS,
        payload: data.order,
      });

      return { success: true, order: data.order };
    } catch (error) {
      dispatch({
        type: types.CREATE_ORDER_FAILURE,
        payload: error.message,
      });

      return { success: false, error: error.message };
    }
  };
};

// Получение списка заказов пользователя
export const fetchOrders = () => {
  return async (dispatch) => {
    dispatch({ type: types.FETCH_ORDERS_REQUEST });

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Необходима авторизация");
      }

      const response = await fetch(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Ошибка загрузки заказов");
      }

      dispatch({
        type: types.FETCH_ORDERS_SUCCESS,
        payload: data.orders,
      });
    } catch (error) {
      dispatch({
        type: types.FETCH_ORDERS_FAILURE,
        payload: error.message,
      });
    }
  };
};

// Отмена заказа
export const cancelOrder = (orderId) => {
  return async (dispatch) => {
    dispatch({ type: types.CANCEL_ORDER_REQUEST });

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Необходима авторизация");
      }

      const response = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Ошибка отмены заказа");
      }

      dispatch({
        type: types.CANCEL_ORDER_SUCCESS,
        payload: data.order,
      });

      return { success: true };
    } catch (error) {
      dispatch({
        type: types.CANCEL_ORDER_FAILURE,
        payload: error.message,
      });

      return { success: false, error: error.message };
    }
  };
};


import * as types from "../actionTypes";
import { API_URL } from "../../config/api";

// Авторизация пользователя
export const login = (email, password) => {
  return async (dispatch) => {
    dispatch({ type: types.LOGIN_REQUEST });

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Ошибка авторизации");
      }

      localStorage.setItem("token", data.user.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      dispatch({
        type: types.LOGIN_SUCCESS,
        payload: data.user,
      });

      return { success: true };
    } catch (error) {
      dispatch({
        type: types.LOGIN_FAILURE,
        payload: error.message,
      });

      return { success: false, error: error.message };
    }
  };
};

// Регистрация нового пользователя
export const register = (name, email, password) => {
  return async (dispatch) => {
    dispatch({ type: types.REGISTER_REQUEST });

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Ошибка регистрации");
      }

      localStorage.setItem("token", data.user.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      dispatch({
        type: types.REGISTER_SUCCESS,
        payload: data.user,
      });

      return { success: true };
    } catch (error) {
      dispatch({
        type: types.REGISTER_FAILURE,
        payload: error.message,
      });

      return { success: false, error: error.message };
    }
  };
};

// Выход из системы
export const logout = () => {
  return (dispatch) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");

    dispatch({ type: types.LOGOUT });
  };
};

// Проверка токена при загрузке приложения
export const checkAuth = () => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");

    if (!token) {
      dispatch({ type: types.CHECK_AUTH_FAILURE });
      return;
    }

    dispatch({ type: types.CHECK_AUTH_REQUEST });

    try {
      const response = await fetch(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Invalid token");
      }

      dispatch({
        type: types.CHECK_AUTH_SUCCESS,
        payload: data.user,
      });
    } catch (error) {
      // Если токен невалидный, удаляем его
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      dispatch({
        type: types.CHECK_AUTH_FAILURE,
        payload: error.message,
      });
    }
  };
};


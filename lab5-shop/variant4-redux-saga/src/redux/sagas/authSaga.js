import { createSagaSlice } from "../sagaSliceFactory";
import { API_URL } from "../../config/api";

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

const authApi = {
  async login({ email, password }) {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Ошибка авторизации");
    }

    return data.user;
  },

  async register({ name, email, password }) {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Ошибка регистрации");
    }

    return data.user;
  },

  async checkAuth() {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token");
    }

    const response = await fetch(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error("Invalid token");
    }

    return data.user;
  },
};

function saveUser(user) {
  localStorage.setItem("token", user.token);
  localStorage.setItem("user", JSON.stringify(user));
}

function clearUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

const { slice, actions, saga } = createSagaSlice(
  "auth",
  {
    login: {
      api: authApi.login,
      afterSuccess: saveUser,
      onSuccess: (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      },
    },
    register: {
      api: authApi.register,
      afterSuccess: saveUser,
      onSuccess: (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      },
    },
    checkAuth: {
      api: authApi.checkAuth,
      afterFailure: clearUser,
      onSuccess: (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      },
      onFailure: (state) => {
        state.user = null;
        state.isAuthenticated = false;
      },
    },
  },
  {
    user: getStoredUser(),
    isAuthenticated: Boolean(localStorage.getItem("token")),
  },
  {
    logout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("cart");
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  }
);

export const authActions = {
  ...actions,
  logout: slice.actions.logout,
  clearError: slice.actions.clearError,
};

export const authSaga = saga;
export default slice.reducer;

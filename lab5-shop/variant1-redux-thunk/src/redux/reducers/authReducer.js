import * as types from "../actionTypes";

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

const initialState = {
  user: getStoredUser(),
  isAuthenticated: Boolean(localStorage.getItem("token")),
  loading: false,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.LOGIN_REQUEST:
    case types.REGISTER_REQUEST:
    case types.CHECK_AUTH_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.LOGIN_SUCCESS:
    case types.REGISTER_SUCCESS:
    case types.CHECK_AUTH_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };

    case types.LOGIN_FAILURE:
    case types.REGISTER_FAILURE:
    case types.CHECK_AUTH_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };

    case types.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };

    default:
      return state;
  }
};

export default authReducer;

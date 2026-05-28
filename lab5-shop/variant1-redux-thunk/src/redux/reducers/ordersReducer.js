import * as types from "../actionTypes";

const initialState = {
  items: [],
  currentOrder: null,
  loading: false,
  error: null,
};

const ordersReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.CREATE_ORDER_REQUEST:
    case types.FETCH_ORDERS_REQUEST:
    case types.CANCEL_ORDER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.CREATE_ORDER_SUCCESS:
      return {
        ...state,
        currentOrder: action.payload,
        items: [action.payload, ...state.items],
        loading: false,
        error: null,
      };

    case types.CREATE_ORDER_FAILURE:
    case types.FETCH_ORDERS_FAILURE:
    case types.CANCEL_ORDER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case types.FETCH_ORDERS_SUCCESS:
      return {
        ...state,
        items: action.payload,
        loading: false,
        error: null,
      };

    case types.CANCEL_ORDER_SUCCESS:
      return {
        ...state,
        items: state.items.map((order) =>
          order.id === action.payload.id ? action.payload : order
        ),
        loading: false,
        error: null,
      };

    default:
      return state;
  }
};

export default ordersReducer;

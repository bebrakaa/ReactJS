import * as types from "../actionTypes";

const initialState = {
  items: [],
  categories: [],
  filters: {
    category: "all",
    search: "",
    minPrice: "",
    maxPrice: "",
  },
  currentPage: 1,
  hasMore: true,
  loading: false,
  error: null,
};

const productsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_PRODUCTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        items: action.payload.append 
          ? [...state.items, ...action.payload.products]
          : action.payload.products,
        currentPage: action.payload.append ? state.currentPage + 1 : 1,
        hasMore: action.payload.hasMore,
        loading: false,
        error: null,
      };

    case types.FETCH_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case types.FETCH_CATEGORIES_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case types.FETCH_CATEGORIES_SUCCESS:
      return {
        ...state,
        categories: action.payload,
        loading: false,
      };

    case types.FETCH_CATEGORIES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case types.SET_FILTER:
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.filterName]: action.payload.value,
        },
        // Сбрасываем пагинацию при изменении фильтров
        currentPage: 1,
        items: [],
        hasMore: true,
      };

    case types.CLEAR_FILTERS:
      return {
        ...state,
        filters: {
          category: "all",
          search: "",
          minPrice: "",
          maxPrice: "",
        },
        // Сбрасываем пагинацию при очистке фильтров
        currentPage: 1,
        items: [],
        hasMore: true,
      };

    default:
      return state;
  }
};

export default productsReducer;

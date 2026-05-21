import * as types from "../actionTypes";
import { API_URL, PRODUCTS_PER_PAGE } from "../../config/api";

function buildProductsQuery(filters, page) {
  const queryParams = new URLSearchParams();

  if (filters.category && filters.category !== "all") {
    queryParams.append("category", filters.category);
  }
  if (filters.search) {
    queryParams.append("search", filters.search);
  }
  if (filters.minPrice) {
    queryParams.append("minPrice", filters.minPrice);
  }
  if (filters.maxPrice) {
    queryParams.append("maxPrice", filters.maxPrice);
  }

  queryParams.append("page", page);
  queryParams.append("limit", PRODUCTS_PER_PAGE);

  return queryParams.toString();
}

export const fetchProducts = (filters = {}, page = 1, append = false) => {
  return async (dispatch) => {
    dispatch({
      type: types.FETCH_PRODUCTS_REQUEST,
      payload: { append },
    });

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/products?${buildProductsQuery(filters, page)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Ошибка загрузки товаров");
      }

      const products = Array.isArray(data.products) ? data.products : [];

      dispatch({
        type: types.FETCH_PRODUCTS_SUCCESS,
        payload: {
          products,
          append,
          hasMore: data.hasMore ?? products.length === PRODUCTS_PER_PAGE,
        },
      });
    } catch (error) {
      dispatch({
        type: types.FETCH_PRODUCTS_FAILURE,
        payload: error.message,
      });
    }
  };
};

export const loadMoreProducts = () => {
  return (dispatch, getState) => {
    const { products } = getState();
    dispatch(fetchProducts(products.filters, products.currentPage + 1, true));
  };
};

export const fetchCategories = () => {
  return async (dispatch) => {
    dispatch({ type: types.FETCH_CATEGORIES_REQUEST });

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Ошибка загрузки категорий");
      }

      dispatch({
        type: types.FETCH_CATEGORIES_SUCCESS,
        payload: data.categories,
      });
    } catch (error) {
      dispatch({
        type: types.FETCH_CATEGORIES_FAILURE,
        payload: error.message,
      });
    }
  };
};

export const setFilter = (filterName, value) => ({
  type: types.SET_FILTER,
  payload: { filterName, value },
});

export const clearFilters = () => ({
  type: types.CLEAR_FILTERS,
});

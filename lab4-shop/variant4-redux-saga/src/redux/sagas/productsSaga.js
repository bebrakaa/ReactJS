import { createSagaSlice } from "../sagaSliceFactory";
import { API_URL, PRODUCTS_PER_PAGE } from "../../config/api";

function createInitialFilters() {
  return {
    category: "all",
    search: "",
    minPrice: "",
    maxPrice: "",
  };
}

function buildProductsQuery(filters, page) {
  const params = new URLSearchParams();

  if (filters.category && filters.category !== "all") {
    params.append("category", filters.category);
  }
  if (filters.search) {
    params.append("search", filters.search);
  }
  if (filters.minPrice) {
    params.append("minPrice", filters.minPrice);
  }
  if (filters.maxPrice) {
    params.append("maxPrice", filters.maxPrice);
  }

  params.append("page", page);
  params.append("limit", PRODUCTS_PER_PAGE);

  return params.toString();
}

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const productsApi = {
  async fetchProducts({ filters = createInitialFilters(), page = 1, append = false } = {}) {
    const response = await fetch(`${API_URL}/products?${buildProductsQuery(filters, page)}`, {
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Ошибка загрузки товаров");
    }

    return {
      products: Array.isArray(data.products) ? data.products : [],
      page,
      append,
      hasMore: data.hasMore ?? data.products?.length === PRODUCTS_PER_PAGE,
    };
  },

  async fetchCategories() {
    const response = await fetch(`${API_URL}/categories`, {
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Ошибка загрузки категорий");
    }

    return Array.isArray(data.categories) ? data.categories : [];
  },
};

const { slice, actions, saga } = createSagaSlice(
  "products",
  {
    fetchProducts: {
      api: productsApi.fetchProducts,
      onSuccess: (state, action) => {
        state.items = action.payload.append
          ? [...state.items, ...action.payload.products]
          : action.payload.products;
        state.currentPage = action.payload.page;
        state.hasMore = action.payload.hasMore;
      },
    },
    fetchCategories: {
      api: productsApi.fetchCategories,
      onSuccess: (state, action) => {
        state.categories = action.payload;
      },
    },
  },
  {
    items: [],
    categories: [],
    filters: createInitialFilters(),
    currentPage: 1,
    hasMore: true,
  },
  {
    setFilter: (state, action) => {
      const { filterName, value } = action.payload;
      state.filters[filterName] = value;
      state.currentPage = 1;
      state.items = [];
      state.hasMore = true;
    },
    clearFilters: (state) => {
      state.filters = createInitialFilters();
      state.currentPage = 1;
      state.items = [];
      state.hasMore = true;
    },
  }
);

export const productsActions = {
  ...actions,
  setFilter: slice.actions.setFilter,
  clearFilters: slice.actions.clearFilters,
};

export const productsSaga = saga;
export default slice.reducer;

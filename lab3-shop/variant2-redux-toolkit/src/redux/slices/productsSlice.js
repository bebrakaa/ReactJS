import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ filters = {}, page = 1, append = false }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/products?${buildProductsQuery(filters, page)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Ошибка загрузки товаров");
      }

      const products = Array.isArray(data.products) ? data.products : [];

      return {
        products,
        append,
        hasMore: data.hasMore ?? products.length === PRODUCTS_PER_PAGE,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Ошибка загрузки категорий");
      }

      return data.categories;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loadMoreProducts = createAsyncThunk(
  "products/loadMoreProducts",
  async (_, { getState, dispatch }) => {
    const { currentPage, filters } = getState().products;
    return dispatch(fetchProducts({ filters, page: currentPage + 1, append: true }));
  }
);

const createInitialFilters = () => ({
  category: "all",
  search: "",
  minPrice: "",
  maxPrice: "",
});

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    categories: [],
    filters: createInitialFilters(),
    currentPage: 1,
    hasMore: true,
    loading: false,
    error: null,
  },
  reducers: {
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.append
          ? [...state.items, ...action.payload.products]
          : action.payload.products;
        state.currentPage = action.payload.append ? state.currentPage + 1 : 1;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setFilter, clearFilters } = productsSlice.actions;
export default productsSlice.reducer;

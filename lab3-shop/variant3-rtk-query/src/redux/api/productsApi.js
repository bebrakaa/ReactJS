import { apiSlice } from "./apiSlice";
import { PRODUCTS_PER_PAGE } from "../../config/api";

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ filters = {}, page = 1 } = {}) => {
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

        return `/products?${params.toString()}`;
      },
      transformResponse: (response) => ({
        products: Array.isArray(response.products) ? response.products : [],
        hasMore: Boolean(response.hasMore),
      }),
      providesTags: (result) =>
        result?.products?.length
          ? [
              ...result.products.map(({ id }) => ({ type: "Products", id })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),

    getCategories: builder.query({
      query: () => "/categories",
      transformResponse: (response) => response.categories,
    }),
  }),
});

export const { useGetProductsQuery, useGetCategoriesQuery } = productsApi;

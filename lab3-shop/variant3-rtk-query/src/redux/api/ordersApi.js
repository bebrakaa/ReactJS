import { apiSlice } from "./apiSlice";

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => "/orders",
      transformResponse: (response) => response.orders,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Orders", id })),
              { type: "Orders", id: "LIST" },
            ]
          : [{ type: "Orders", id: "LIST" }],
    }),

    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "/orders",
        method: "POST",
        body: orderData,
      }),
      transformResponse: (response) => response.order,
      invalidatesTags: [{ type: "Orders", id: "LIST" }],
    }),

    cancelOrder: builder.mutation({
      query: (orderId) => ({
        url: `/orders/${orderId}/cancel`,
        method: "PATCH",
      }),
      transformResponse: (response) => response.order,
      invalidatesTags: (result, error, orderId) => [
        { type: "Orders", id: orderId },
        { type: "Orders", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useCreateOrderMutation,
  useCancelOrderMutation,
} = ordersApi;

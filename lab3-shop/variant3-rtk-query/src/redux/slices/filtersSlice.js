import { createSlice } from "@reduxjs/toolkit";

const filtersSlice = createSlice({
  name: "filters",
  initialState: {
    category: "all",
    search: "",
    minPrice: "",
    maxPrice: "",
  },
  reducers: {
    setFilter: (state, action) => {
      const { filterName, value } = action.payload;
      state[filterName] = value;
    },
    clearFilters: (state) => {
      state.category = "all";
      state.search = "";
      state.minPrice = "";
      state.maxPrice = "";
    },
  },
});

export const { setFilter, clearFilters } = filtersSlice.actions;
export default filtersSlice.reducer;

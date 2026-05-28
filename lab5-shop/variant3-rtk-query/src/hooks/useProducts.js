import { useEffect, useState } from "react";
import { useGetProductsQuery, useGetCategoriesQuery } from "../redux/api/productsApi";

const initialFilters = {
  category: "all",
  search: "",
  minPrice: "",
  maxPrice: "",
};

export function useProducts() {
  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsByPage, setProductsByPage] = useState({});

  const {
    data: productsData = { products: [], hasMore: false },
    isLoading: productsLoading,
    error: productsError,
    isFetching,
  } = useGetProductsQuery({ filters, page: currentPage });

  const {
    data: categories = [],
    isLoading: categoriesLoading,
  } = useGetCategoriesQuery();

  useEffect(() => {
    setProductsByPage((previousPages) => ({
      ...(currentPage === 1 ? {} : previousPages),
      [currentPage]: productsData.products,
    }));
  }, [currentPage, productsData.products]);

  const products = Object.keys(productsByPage)
    .map(Number)
    .sort((a, b) => a - b)
    .flatMap((page) => productsByPage[page]);

  const setFilter = (filterName, value) => {
    setFilters((previousFilters) => ({
      ...previousFilters,
      [filterName]: value,
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
  };

  const loadMore = () => {
    if (!isFetching && productsData.hasMore) {
      setCurrentPage((page) => page + 1);
    }
  };

  return {
    products,
    categories: Array.isArray(categories) ? categories : [],
    filters,
    loading: productsLoading || categoriesLoading || isFetching,
    error: productsError?.data?.message || productsError?.message || null,
    hasMore: productsData.hasMore,
    setFilter,
    clearFilters,
    loadMore,
  };
}

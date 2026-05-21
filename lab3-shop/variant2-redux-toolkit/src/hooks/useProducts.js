import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  fetchCategories,
  loadMoreProducts,
  setFilter,
  clearFilters,
} from "../redux/slices/productsSlice";

/**
 * Кастомный хук для работы с товарами
 * Инкапсулирует всю логику загрузки товаров и категорий с пагинацией
 */
export function useProducts() {
  const dispatch = useDispatch();
  const { items, categories, filters, hasMore, loading, error } = useSelector(
    (state) => state.products
  );

  // Загрузка категорий при монтировании
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Загрузка товаров при изменении фильтров
  useEffect(() => {
    dispatch(fetchProducts({ filters, page: 1, append: false }));
  }, [dispatch, filters]);

  // Методы для управления фильтрами
  const handleSetFilter = (filterName, value) => {
    dispatch(setFilter({ filterName, value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  // Загрузка следующей страницы
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      dispatch(loadMoreProducts());
    }
  };

  return {
    products: Array.isArray(items) ? items : [],
    categories: Array.isArray(categories) ? categories : [],
    filters: filters || { category: "all", search: "", minPrice: "", maxPrice: "" },
    loading: loading || false,
    error: error || null,
    hasMore: hasMore !== undefined ? hasMore : true,
    setFilter: handleSetFilter,
    clearFilters: handleClearFilters,
    loadMore: handleLoadMore,
  };
}

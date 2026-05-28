import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { productsActions } from "../redux/sagas/productsSaga";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

function ProductsPage() {
  const dispatch = useDispatch();
  const { items, categories, filters, currentPage, hasMore, loading, error } =
    useSelector((state) => state.products);

  useEffect(() => {
    document.title = "Каталог товаров - TechHub";
    dispatch(productsActions.fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(productsActions.fetchProducts({ filters, page: 1, append: false }));
  }, [dispatch, filters]);

  const handleFilterChange = (filterName, value) => {
    dispatch(productsActions.setFilter({ filterName, value }));
  };

  const handleClearFilters = () => {
    dispatch(productsActions.clearFilters());
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      dispatch(
        productsActions.fetchProducts({
          filters,
          page: currentPage + 1,
          append: true,
        })
      );
    }
  };

  return (
    <div className="container">
      <h1>Каталог товаров</h1>

      <section className="filters-section" aria-label="Фильтры товаров">
        <div className="filter-group">
          <label htmlFor="category-filter">Категория:</label>
          <select
            id="category-filter"
            value={filters.category}
            onChange={(event) => handleFilterChange("category", event.target.value)}
            aria-label="Выберите категорию товаров"
          >
            <option value="all">Все категории</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="search-filter">Поиск:</label>
          <input
            id="search-filter"
            type="text"
            placeholder="Название товара..."
            value={filters.search}
            onChange={(event) => handleFilterChange("search", event.target.value)}
            aria-label="Поиск товаров по названию"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="min-price-filter">Мин. цена:</label>
          <input
            id="min-price-filter"
            type="number"
            placeholder="От"
            value={filters.minPrice}
            onChange={(event) => handleFilterChange("minPrice", event.target.value)}
            aria-label="Минимальная цена"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="max-price-filter">Макс. цена:</label>
          <input
            id="max-price-filter"
            type="number"
            placeholder="До"
            value={filters.maxPrice}
            onChange={(event) => handleFilterChange("maxPrice", event.target.value)}
            aria-label="Максимальная цена"
          />
        </div>

        <button className="btn-clear-filters" onClick={handleClearFilters}>
          Сбросить фильтры
        </button>
      </section>

      {items.length > 0 && (
        <p className="goods-count" aria-live="polite">Загружено товаров: {items.length}</p>
      )}

      {loading && items.length === 0 && <Loader />}

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      <div className="products-grid" role="list" aria-live="polite">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {loading && items.length > 0 && <Loader />}

      {!loading && hasMore && items.length > 0 && (
        <button type="button" className="btn btn-load-more" onClick={handleLoadMore}>
          Загрузить ещё
        </button>
      )}

      {!hasMore && items.length > 0 && (
        <p className="no-more">Все товары загружены</p>
      )}

      {!loading && items.length === 0 && !error && (
        <p className="no-products">Товары не найдены</p>
      )}
    </div>
  );
}

export default ProductsPage;

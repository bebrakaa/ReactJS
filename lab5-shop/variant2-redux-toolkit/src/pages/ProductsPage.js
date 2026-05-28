import { useEffect } from "react";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

function ProductsPage() {
  const {
    products,
    categories,
    filters,
    loading,
    error,
    hasMore,
    setFilter,
    clearFilters,
    loadMore,
  } = useProducts();

  // Устанавливаем заголовок страницы
  useEffect(() => {
    document.title = "Каталог товаров - TechHub";
  }, []);

  return (
    <div className="container">
      <h1>Каталог товаров</h1>

      <section className="filters-section" aria-label="Фильтры товаров">
        <div className="filter-group">
          <label htmlFor="category-filter">Категория:</label>
          <select
            id="category-filter"
            value={filters.category}
            onChange={(e) => setFilter("category", e.target.value)}
            aria-label="Выберите категорию товаров"
          >
            <option value="all">Все категории</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="search-filter">Поиск:</label>
          <input
            type="text"
            id="search-filter"
            value={filters.search}
            onChange={(e) => setFilter("search", e.target.value)}
            placeholder="Название товара..."
            aria-label="Поиск товаров по названию"
          />
        </div>

        <button onClick={clearFilters} className="btn-clear-filters">
          Сбросить фильтры
        </button>
      </section>

      {products.length > 0 && (
        <p className="goods-count" aria-live="polite">Загружено товаров: {products.length}</p>
      )}

      {loading && products.length === 0 && (
        <div className="loading" role="status" aria-live="polite">Загрузка...</div>
      )}

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      <div className="products-grid" role="list" aria-live="polite">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {loading && products.length > 0 && <Loader />}

      {!loading && hasMore && products.length > 0 && (
        <button type="button" className="btn btn-load-more" onClick={loadMore}>
          Загрузить больше
        </button>
      )}

      {!hasMore && products.length > 0 && (
        <p className="no-more">Все товары загружены</p>
      )}

      {!loading && products.length === 0 && !error && (
        <p className="no-products">Товары не найдены</p>
      )}
    </div>
  );
}

export default ProductsPage;

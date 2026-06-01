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

  useEffect(() => {
    document.title = "Каталог товаров - TechHub";
  }, []);

  return (
    <div className="container" aria-busy={loading}>
      <h1>Каталог товаров</h1>
      <p className="section-intro" id="products-page-description">
        Используйте фильтры ниже, чтобы уточнить список товаров. Все элементы управления доступны с клавиатуры.
      </p>

      <section
        className="filters-section"
        aria-describedby="products-page-description"
        aria-label="Фильтры товаров"
      >
        <div className="filter-group">
          <label htmlFor="category-filter">Категория:</label>
          <select
            id="category-filter"
            value={filters.category}
            onChange={(event) => setFilter("category", event.target.value)}
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
            placeholder="Название товара"
            value={filters.search}
            onChange={(event) => setFilter("search", event.target.value)}
          />
        </div>

        <button type="button" className="btn-clear-filters" onClick={clearFilters}>
          Сбросить фильтры
        </button>
      </section>

      {products.length > 0 && (
        <p className="goods-count page-status" aria-live="polite" role="status">
          Загружено товаров: {products.length}
        </p>
      )}

      {loading && products.length === 0 && (
        <div className="loading" role="status" aria-live="polite">
          Загрузка товаров
        </div>
      )}

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      <div
        className="products-grid"
        role="list"
        aria-describedby="products-page-description"
        aria-live="polite"
      >
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

      {!hasMore && products.length > 0 && <p className="no-more">Все товары загружены</p>}

      {!loading && products.length === 0 && !error && (
        <p className="no-products">Товары не найдены</p>
      )}
    </div>
  );
}

export default ProductsPage;

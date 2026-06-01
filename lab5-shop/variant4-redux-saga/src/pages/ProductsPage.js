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
            onChange={(event) => handleFilterChange("category", event.target.value)}
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
            onChange={(event) => handleFilterChange("search", event.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="min-price-filter">Минимальная цена:</label>
          <input
            id="min-price-filter"
            type="number"
            placeholder="От"
            value={filters.minPrice}
            onChange={(event) => handleFilterChange("minPrice", event.target.value)}
            inputMode="numeric"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="max-price-filter">Максимальная цена:</label>
          <input
            id="max-price-filter"
            type="number"
            placeholder="До"
            value={filters.maxPrice}
            onChange={(event) => handleFilterChange("maxPrice", event.target.value)}
            inputMode="numeric"
          />
        </div>

        <button type="button" className="btn-clear-filters" onClick={handleClearFilters}>
          Сбросить фильтры
        </button>
      </section>

      {items.length > 0 ? (
        <p className="goods-count page-status" aria-live="polite" role="status">
          Загружено товаров: {items.length}
        </p>
      ) : null}

      {loading && items.length === 0 ? <Loader /> : null}

      {error ? (
        <div className="error-message" role="alert">
          {error}
        </div>
      ) : null}

      <div
        className="products-grid"
        role="list"
        aria-describedby="products-page-description"
        aria-live="polite"
      >
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {loading && items.length > 0 ? <Loader /> : null}

      {!loading && hasMore && items.length > 0 ? (
        <button type="button" className="btn btn-load-more" onClick={handleLoadMore}>
          Загрузить ещё
        </button>
      ) : null}

      {!hasMore && items.length > 0 ? <p className="no-more">Все товары загружены</p> : null}

      {!loading && items.length === 0 && !error ? (
        <p className="no-products">Товары не найдены</p>
      ) : null}
    </div>
  );
}

export default ProductsPage;

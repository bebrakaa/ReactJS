import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: 1 }));
  };

  return (
    <article className="product-card" aria-labelledby={`product-title-${product.id}`} role="listitem">
      <div className="product-image-placeholder" aria-hidden="true">
        <span className="product-category">{product.category}</span>
      </div>

      <div className="product-info">
        <h3 className="product-title" id={`product-title-${product.id}`}>
          {product.title}
        </h3>
        <p className="product-description">{product.description}</p>

        <div className="product-footer">
          <div className="product-price-section">
            <span className="product-price" aria-label={`Цена ${product.price.toLocaleString("ru-RU")} рублей`}>
              {product.price.toLocaleString("ru-RU")} ₽
            </span>
            <div className="product-meta">
              <span className="product-rating" aria-label={`Рейтинг товара ${product.rating} из 5`}>
                ⭐ {product.rating}
              </span>
              <span className="product-stock" aria-live="polite">
                {product.stock > 0 ? `В наличии: ${product.stock}` : "Нет в наличии"}
              </span>
            </div>
          </div>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleAddToCart}
              className="btn-add-to-cart"
              aria-label={`Добавить ${product.title} в корзину`}
              disabled={product.stock <= 0}
            >
              В корзину
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default ProductCard;

import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";

function ProductCard({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: 1 }));
  };

  return (
    <article className="product-card">
      <div className="product-image-placeholder">
        <span className="product-category">{product.category}</span>
      </div>

      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-description">{product.description}</p>

        <div className="product-footer">
          <div className="product-price-section">
            <span className="product-price">
              {product.price.toLocaleString("ru-RU")} ₽
            </span>
            <div className="product-meta">
              <span className="product-rating">★ {product.rating}</span>
              <span className="product-stock">
                {product.stock > 0 ? `В наличии: ${product.stock}` : "Нет в наличии"}
              </span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="btn-add-to-cart"
            disabled={product.stock <= 0}
          >
            В корзину
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;

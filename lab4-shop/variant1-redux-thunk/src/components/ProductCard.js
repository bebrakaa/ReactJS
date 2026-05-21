import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/actions/cartActions";

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleAddToCart = () => {
    dispatch(addToCart(product, 1));
  };

  return (
    <div className="product-card">
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
              <span className="product-rating">⭐ {product.rating}</span>
              <span className="product-stock">
                {product.stock > 0 ? `В наличии: ${product.stock}` : "Нет в наличии"}
              </span>
            </div>
          </div>

          {isAuthenticated && product.stock > 0 && (
            <button onClick={handleAddToCart} className="btn-add-to-cart">
              В корзину
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;

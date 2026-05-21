import { useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../redux/slices/cartSlice";

function CartItem({ item }) {
  const dispatch = useDispatch();
  const subtotal = item.price * item.quantity;

  const handleQuantityChange = (quantity) => {
    if (quantity >= 1) {
      dispatch(updateQuantity({ productId: item.id, quantity }));
    }
  };

  const handleQuantityInput = (event) => {
    const quantity = Number(event.target.value);

    if (Number.isInteger(quantity) && quantity >= 1) {
      handleQuantityChange(quantity);
    }
  };

  return (
    <div className="cart-item">
      <div className="cart-item-image-placeholder" />

      <div className="cart-item-info">
        <h3 className="cart-item-title">{item.title}</h3>
        <p className="cart-item-price">{item.price.toLocaleString("ru-RU")} ₽</p>
      </div>

      <div className="cart-item-controls">
        <div className="quantity-controls" aria-label={`Количество товара ${item.title}`}>
          <button
            type="button"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="quantity-btn"
            disabled={item.quantity <= 1}
            aria-label="Уменьшить количество"
          >
            -
          </button>
          <input
            className="quantity-input"
            type="number"
            min="1"
            value={item.quantity}
            onChange={handleQuantityInput}
            aria-label="Количество товара"
          />
          <button
            type="button"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="quantity-btn"
            aria-label="Увеличить количество"
          >
            +
          </button>
        </div>

        <div className="cart-item-subtotal">
          <span className="subtotal-label">Итого:</span>
          <span className="subtotal-value">{subtotal.toLocaleString("ru-RU")} ₽</span>
        </div>

        <button
          type="button"
          onClick={() => dispatch(removeFromCart(item.id))}
          className="btn-remove"
        >
          Удалить
        </button>
      </div>
    </div>
  );
}

export default CartItem;

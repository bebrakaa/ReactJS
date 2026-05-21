import { useDispatch } from "react-redux";
import { removeFromCart, updateCartQuantity } from "../redux/actions/cartActions";

function CartItem({ item }) {
  const dispatch = useDispatch();
  const subtotal = item.price * item.quantity;

  const handleQuantityChange = (value) => {
    const quantity = Number(value);

    if (Number.isInteger(quantity) && quantity >= 1) {
      dispatch(updateCartQuantity(item.id, quantity));
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
        <div className="quantity-controls">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="quantity-btn"
            disabled={item.quantity <= 1}
          >
            −
          </button>
          <input
            className="quantity-input"
            type="number"
            min="1"
            value={item.quantity}
            onChange={(event) => handleQuantityChange(event.target.value)}
            aria-label={`Количество товара ${item.title}`}
          />
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="quantity-btn"
          >
            +
          </button>
        </div>

        <div className="cart-item-subtotal">
          <span className="subtotal-label">Итого:</span>
          <span className="subtotal-value">{subtotal.toLocaleString("ru-RU")} ₽</span>
        </div>

        <button onClick={() => dispatch(removeFromCart(item.id))} className="btn-remove">
          Удалить
        </button>
      </div>
    </div>
  );
}

export default CartItem;

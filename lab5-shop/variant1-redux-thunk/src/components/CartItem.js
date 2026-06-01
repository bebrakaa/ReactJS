import { useDispatch } from "react-redux";
import { removeFromCart, updateCartQuantity } from "../redux/actions/cartActions";

function CartItem({ item }) {
  const dispatch = useDispatch();
  const subtotal = item.price * item.quantity;
  const quantityHelpId = `cart-quantity-help-${item.id}`;

  const handleQuantityChange = (value) => {
    const quantity = Number(value);

    if (Number.isInteger(quantity) && quantity >= 1) {
      dispatch(updateCartQuantity(item.id, quantity));
    }
  };

  return (
    <article className="cart-item" aria-labelledby={`cart-item-title-${item.id}`} role="listitem">
      <div className="cart-item-image-placeholder" aria-hidden="true" />

      <div className="cart-item-info">
        <h3 className="cart-item-title" id={`cart-item-title-${item.id}`}>
          {item.title}
        </h3>
        <p className="cart-item-price">{item.price.toLocaleString("ru-RU")} ₽</p>
      </div>

      <div className="cart-item-controls">
        <div className="quantity-controls" role="group" aria-label={`Изменение количества товара ${item.title}`}>
          <button
            type="button"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="quantity-btn"
            disabled={item.quantity <= 1}
            aria-label={`Уменьшить количество товара ${item.title}`}
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
            aria-describedby={quantityHelpId}
            inputMode="numeric"
          />
          <span id={quantityHelpId} className="sr-only">
            Введите количество товара числом не меньше одного.
          </span>
          <button
            type="button"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="quantity-btn"
            aria-label={`Увеличить количество товара ${item.title}`}
          >
            +
          </button>
        </div>

        <div className="cart-item-subtotal" aria-live="polite">
          <span className="subtotal-label">Итого:</span>
          <span className="subtotal-value">{subtotal.toLocaleString("ru-RU")} ₽</span>
        </div>

        <button
          type="button"
          onClick={() => dispatch(removeFromCart(item.id))}
          className="btn-remove"
          aria-label={`Удалить ${item.title} из корзины`}
        >
          Удалить
        </button>
      </div>
    </article>
  );
}

export default CartItem;

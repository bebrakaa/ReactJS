import { useDispatch } from "react-redux";
import { removeFromCart, updateCartQuantity } from "../redux/slices/cartSlice";

function CartItem({ item }) {
  const dispatch = useDispatch();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateCartQuantity({ productId: item.id, quantity: newQuantity }));
  };

  const handleRemove = () => {
    dispatch(removeFromCart(item.id));
  };

  const subtotal = item.price * item.quantity;

  return (
    <div className="cart-item">
      <div className="cart-item-image-placeholder"></div>

      <div className="cart-item-info">
        <h3 className="cart-item-title">{item.title}</h3>
        <p className="cart-item-price">{item.price.toLocaleString("ru-RU")} ₽</p>
      </div>

      <div className="cart-item-controls">
        <div className="quantity-controls">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="quantity-btn"
          >
            −
          </button>
          <span className="quantity-value">{item.quantity}</span>
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="quantity-btn"
          >
            +
          </button>
        </div>

        <div className="cart-item-subtotal">
          <span className="subtotal-label">Итого:</span>
          <span className="subtotal-value">
            {subtotal.toLocaleString("ru-RU")} ₽
          </span>
        </div>

        <button onClick={handleRemove} className="btn-remove">
          Удалить
        </button>
      </div>
    </div>
  );
}

export default CartItem;

import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { clearCart } from "../redux/actions/cartActions";
import CartItem from "../components/CartItem";

function CartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalAmount, totalItems } = useSelector((state) => state.cart);

  useEffect(() => {
    document.title = "Корзина - TechHub";
  }, []);

  const handleClearCart = () => {
    if (window.confirm("Очистить корзину?")) {
      dispatch(clearCart());
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="container">
        <h1>Корзина</h1>
        <div className="empty-cart">
          <p>Ваша корзина пуста</p>
          <Link to="/products" className="btn btn-primary">
            Перейти в каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="cart-header">
        <h1>Корзина ({totalItems} товаров)</h1>
        <button onClick={handleClearCart} className="btn-clear-cart">
          Очистить корзину
        </button>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        <div className="cart-summary" role="region" aria-label="Сводка заказа">
          <h3>Итого</h3>
          <div className="summary-row">
            <span>Товаров:</span>
            <span>{totalItems} шт.</span>
          </div>
          <div className="summary-row total">
            <span>Сумма:</span>
            <span>{totalAmount.toLocaleString("ru-RU")} ₽</span>
          </div>
          <button onClick={handleCheckout} className="btn btn-primary btn-checkout">
            Оформить заказ
          </button>
          <Link to="/products" className="btn btn-secondary">
            Продолжить покупки
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CartPage;

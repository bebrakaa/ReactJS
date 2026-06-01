import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../redux/slices/cartSlice";
import CartItem from "../components/CartItem";

function CartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalAmount, totalItems } = useSelector((state) => state.cart);

  const handleClearCart = () => {
    if (window.confirm("Очистить корзину?")) {
      dispatch(clearCart());
    }
  };

  useEffect(() => {
    document.title = "Корзина - TechHub";
  }, []);

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
        <h1>Корзина ({totalItems} шт.)</h1>
        <button type="button" onClick={handleClearCart} className="btn-clear-cart">
          Очистить корзину
        </button>
      </div>

      <div className="cart-content">
        <div className="cart-items" role="list" aria-label="Товары в корзине">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        <div className="cart-summary" role="region" aria-label="Сводка заказа">
          <h3>Итого</h3>
          <div className="summary-row page-status" aria-live="polite">
            <span>Товаров:</span>
            <span>{totalItems} шт.</span>
          </div>
          <div className="summary-row total">
            <span>Сумма:</span>
            <span>{totalAmount.toLocaleString("ru-RU")} ₽</span>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            className="btn btn-primary btn-checkout"
          >
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

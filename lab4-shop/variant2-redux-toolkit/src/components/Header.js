import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <span className="logo-text">TECH</span>
          <span className="logo-highlight">HUB</span>
        </Link>

        <nav className="header-nav">
          <Link
            to="/"
            className={location.pathname === "/" ? "active" : ""}
          >
            Главная
          </Link>

          <Link
            to="/products"
            className={location.pathname === "/products" ? "active" : ""}
          >
            Каталог
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/cart"
                className={`cart-link ${location.pathname === "/cart" ? "active" : ""}`}
              >
                Корзина
                {totalItems > 0 && (
                  <span className="cart-badge">{totalItems}</span>
                )}
              </Link>

              <Link
                to="/orders"
                className={location.pathname === "/orders" ? "active" : ""}
              >
                Мои заказы
              </Link>

              <div className="user-menu">
                <span className="user-name">{user?.name}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Выйти
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={location.pathname === "/login" ? "active" : ""}
              >
                Вход
              </Link>
              <Link
                to="/register"
                className={`register-link ${location.pathname === "/register" ? "active" : ""}`}
              >
                Регистрация
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;

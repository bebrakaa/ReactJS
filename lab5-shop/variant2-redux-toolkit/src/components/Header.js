import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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

  const getLinkProps = (path) => ({
    className: location.pathname === path ? "active" : "",
    "aria-current": location.pathname === path ? "page" : undefined,
  });

  return (
    <header className="header" role="banner">
      <div className="header-content">
        <Link to="/" className="logo" aria-label="TechHub, перейти на главную страницу">
          <span className="logo-text">TECH</span>
          <span className="logo-highlight">HUB</span>
        </Link>

        <nav className="header-nav" role="navigation" aria-label="Основная навигация">
          <Link to="/" {...getLinkProps("/")}>
            Главная
          </Link>
          <Link to="/products" {...getLinkProps("/products")}>
            Каталог
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/cart"
                className={`cart-link ${location.pathname === "/cart" ? "active" : ""}`}
                aria-current={location.pathname === "/cart" ? "page" : undefined}
                aria-label={`Корзина, товаров: ${totalItems}`}
              >
                Корзина
                {totalItems > 0 ? <span className="cart-badge" aria-hidden="true">{totalItems}</span> : null}
              </Link>
              <Link to="/orders" {...getLinkProps("/orders")}>
                Мои заказы
              </Link>

              <div className="user-menu" aria-label="Профиль пользователя">
                <span className="user-name">{user?.name}</span>
                <button type="button" onClick={handleLogout} className="logout-btn" aria-label="Выйти из аккаунта">
                  Выйти
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" {...getLinkProps("/login")}>
                Вход
              </Link>
              <Link
                to="/register"
                className={`register-link ${location.pathname === "/register" ? "active" : ""}`}
                aria-current={location.pathname === "/register" ? "page" : undefined}
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

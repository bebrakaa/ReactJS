import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function SitemapPage() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    document.title = "Карта сайта - TechHub";
  }, []);

  return (
    <div className="container">
      <h1>Карта сайта</h1>
      <nav aria-label="Карта сайта">
        <section>
          <h2>Основные страницы</h2>
          <ul>
            <li><Link to="/">Главная</Link></li>
            <li><Link to="/products">Каталог товаров</Link></li>
          </ul>
        </section>

        {!isAuthenticated ? (
          <section>
            <h2>Аутентификация</h2>
            <ul>
              <li><Link to="/login">Вход</Link></li>
              <li><Link to="/register">Регистрация</Link></li>
            </ul>
          </section>
        ) : (
          <section>
            <h2>Личный кабинет</h2>
            <ul>
              <li><Link to="/cart">Корзина</Link></li>
              <li><Link to="/checkout">Оформление заказа</Link></li>
              <li><Link to="/orders">Мои заказы</Link></li>
            </ul>
          </section>
        )}

        <section>
          <h2>Дополнительно</h2>
          <ul>
            <li><Link to="/sitemap">Карта сайта</Link></li>
          </ul>
        </section>
      </nav>
    </div>
  );
}

export default SitemapPage;

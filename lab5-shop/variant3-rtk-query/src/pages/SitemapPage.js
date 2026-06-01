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
      <p className="section-intro">Карта сайта поддерживает альтернативный способ перехода к разделам приложения.</p>

      <nav aria-label="Карта сайта">
        <section aria-labelledby="sitemap-main">
          <h2 id="sitemap-main">Основные страницы</h2>
          <ul>
            <li><Link to="/">Главная</Link></li>
            <li><Link to="/products">Каталог товаров</Link></li>
            <li><Link to="/sitemap">Карта сайта</Link></li>
          </ul>
        </section>

        {!isAuthenticated ? (
          <section aria-labelledby="sitemap-auth">
            <h2 id="sitemap-auth">Вход и регистрация</h2>
            <ul>
              <li><Link to="/login">Вход</Link></li>
              <li><Link to="/register">Регистрация</Link></li>
            </ul>
          </section>
        ) : (
          <section aria-labelledby="sitemap-account">
            <h2 id="sitemap-account">Личный кабинет</h2>
            <ul>
              <li><Link to="/cart">Корзина</Link></li>
              <li><Link to="/checkout">Оформление заказа</Link></li>
              <li><Link to="/orders">Мои заказы</Link></li>
            </ul>
          </section>
        )}
      </nav>
    </div>
  );
}

export default SitemapPage;

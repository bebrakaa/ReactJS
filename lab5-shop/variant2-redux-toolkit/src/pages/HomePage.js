import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function HomePage() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    document.title = "Главная - TechHub";
  }, []);

  return (
    <div className="container homepage">
      <div className="hero-section">
        <h1>Добро пожаловать в TechHub</h1>
        <p className="hero-subtitle">
          Ваш надежный интернет-магазин электроники и гаджетов
        </p>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon" aria-hidden="true">1</div>
          <h3>Широкий ассортимент</h3>
          <p>Более 1000 товаров от ведущих производителей</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon" aria-hidden="true">2</div>
          <h3>Быстрая доставка</h3>
          <p>Доставка по всей России от 1 дня</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon" aria-hidden="true">3</div>
          <h3>Гарантия качества</h3>
          <p>Официальная гарантия на все товары</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon" aria-hidden="true">4</div>
          <h3>Удобная оплата</h3>
          <p>Различные способы оплаты</p>
        </div>
      </div>

      <div className="cta-section">
        <h2>Начните покупки прямо сейчас!</h2>
        <div className="cta-buttons">
          <Link to="/products" className="btn btn-primary">
            Перейти в каталог
          </Link>
          {!isAuthenticated && (
            <Link to="/register" className="btn btn-secondary">
              Зарегистрироваться
            </Link>
          )}
        </div>
      </div>

      <div className="info-section">
        <h3>О проекте</h3>
        <p>
          Это демонстрационное приложение интернет-магазина, разработанное с
          использованием <strong>Redux Toolkit</strong> для
          управления состоянием.
        </p>
        <p className="tech-stack">
          <strong>Технологии:</strong> React, Redux Toolkit, React Router,
          Express
        </p>
      </div>
    </div>
  );
}

export default HomePage;

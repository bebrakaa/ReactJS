import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function HomePage() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    document.title = "Главная - TechHub";
  }, []);

  return (
    <div className="container homepage">
      <section className="hero-section" aria-labelledby="home-title">
        <h1 id="home-title">Добро пожаловать в TechHub</h1>
        <p className="hero-subtitle">
          Интернет-магазин электроники, доработанный под требования доступности уровня AA.
        </p>
      </section>

      <section aria-labelledby="benefits-title">
        <h2 id="benefits-title">Что улучшено в интерфейсе</h2>
        <p className="section-intro">Пользователь получает предсказуемую навигацию, достаточный контраст и понятные формы на всех ключевых страницах.</p>
        <div className="features-grid" role="list">
          <article className="feature-card" role="listitem">
            <div className="feature-icon" aria-hidden="true">1</div>
            <h3>Последовательная структура</h3>
            <p>Заголовки, списки и связи между полями передают смысл без опоры только на визуальное оформление.</p>
          </article>
          <article className="feature-card" role="listitem">
            <div className="feature-icon" aria-hidden="true">2</div>
            <h3>Удобные формы</h3>
            <p>Ошибки озвучиваются, поля имеют подсказки и поддерживают автозаполнение.</p>
          </article>
          <article className="feature-card" role="listitem">
            <div className="feature-icon" aria-hidden="true">3</div>
            <h3>Работа с клавиатуры</h3>
            <p>Каталог, корзина и оформление заказа не содержат клавиатурных ловушек.</p>
          </article>
          <article className="feature-card" role="listitem">
            <div className="feature-icon" aria-hidden="true">4</div>
            <h3>Защита от ошибок</h3>
            <p>Перед отправкой заказа покупатель проверяет данные и выбранный способ оплаты.</p>
          </article>
        </div>
      </section>

      <section className="cta-section" aria-labelledby="cta-title">
        <h2 id="cta-title">Продолжить работу</h2>
        <div className="cta-buttons">
          <Link to="/products" className="btn btn-primary">
            Открыть каталог
          </Link>
          {!isAuthenticated && (
            <Link to="/register" className="btn btn-secondary">
              Зарегистрироваться
            </Link>
          )}
        </div>
      </section>

      <section className="info-section" aria-labelledby="about-project-title">
        <h2 id="about-project-title">О проекте</h2>
        <p>Этот вариант лабораторной работы реализован на React, Redux Toolkit и React Router.</p>
        <p className="tech-stack">
          <strong>Технологии:</strong> React, Redux Toolkit, React Router, Express.
        </p>
      </section>
    </div>
  );
}

export default HomePage;

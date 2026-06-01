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
          Демонстрационный интернет-магазин электроники с улучшенной доступностью по ГОСТ Р 52872-2019.
        </p>
      </section>

      <section aria-labelledby="benefits-title">
        <h2 id="benefits-title">Почему пользователям удобно работать с магазином</h2>
        <p className="section-intro">Каталог, корзина и оформление заказа доступны с клавиатуры, со вспомогательными технологиями и при увеличении масштаба.</p>
        <div className="features-grid" role="list">
          <article className="feature-card" role="listitem">
            <div className="feature-icon" aria-hidden="true">1</div>
            <h3>Понятная структура</h3>
            <p>Страницы имеют последовательные заголовки, подписи полей и статусные сообщения.</p>
          </article>
          <article className="feature-card" role="listitem">
            <div className="feature-icon" aria-hidden="true">2</div>
            <h3>Управление без мыши</h3>
            <p>Все основные действия доступны с клавиатуры, а фокус всегда видим.</p>
          </article>
          <article className="feature-card" role="listitem">
            <div className="feature-icon" aria-hidden="true">3</div>
            <h3>Читаемый интерфейс</h3>
            <p>Контраст, подписи и подсказки подобраны так, чтобы интерфейс было проще воспринимать.</p>
          </article>
          <article className="feature-card" role="listitem">
            <div className="feature-icon" aria-hidden="true">4</div>
            <h3>Безопасное оформление заказа</h3>
            <p>Покупатель может проверить введённые данные перед отправкой заказа.</p>
          </article>
        </div>
      </section>

      <section className="cta-section" aria-labelledby="cta-title">
        <h2 id="cta-title">Начните работу</h2>
        <div className="cta-buttons">
          <Link to="/products" className="btn btn-primary">
            Перейти в каталог
          </Link>
          {!isAuthenticated && (
            <Link to="/register" className="btn btn-secondary">
              Создать аккаунт
            </Link>
          )}
        </div>
      </section>

      <section className="info-section" aria-labelledby="about-project-title">
        <h2 id="about-project-title">О проекте</h2>
        <p>Этот вариант лабораторной работы построен на React, Redux, Redux Thunk и React Router.</p>
        <p className="tech-stack">
          <strong>Технологии:</strong> React, Redux, Redux Thunk, React Router, Express.
        </p>
      </section>
    </div>
  );
}

export default HomePage;

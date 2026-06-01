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
          Демонстрационный магазин электроники на Redux Saga с доступным интерфейсом, выровненным под уровень AA.
        </p>
      </section>

      <section aria-labelledby="benefits-title">
        <h2 id="benefits-title">Что важно для доступности</h2>
        <p className="section-intro">В приложении соблюдены единообразие навигации, понятные подписи, контрастные элементы управления и защита от ошибок при оформлении заказа.</p>
        <div className="features-grid" role="list">
          <article className="feature-card" role="listitem">
            <div className="feature-icon" aria-hidden="true">1</div>
            <h3>Понятные страницы</h3>
            <p>Каждая страница имеет осмысленный заголовок и логичную структуру разделов.</p>
          </article>
          <article className="feature-card" role="listitem">
            <div className="feature-icon" aria-hidden="true">2</div>
            <h3>Полная клавиатурная доступность</h3>
            <p>Управление корзиной, каталогом и формами не требует использования мыши.</p>
          </article>
          <article className="feature-card" role="listitem">
            <div className="feature-icon" aria-hidden="true">3</div>
            <h3>Надёжная обратная связь</h3>
            <p>Статусы загрузки, пустых состояний и ошибок объявляются программно.</p>
          </article>
          <article className="feature-card" role="listitem">
            <div className="feature-icon" aria-hidden="true">4</div>
            <h3>Предсказуемые действия</h3>
            <p>Ни одно изменение контекста не происходит внезапно при вводе данных.</p>
          </article>
        </div>
      </section>

      <section className="cta-section" aria-labelledby="cta-title">
        <h2 id="cta-title">Продолжить работу</h2>
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
        <p>Этот вариант лабораторной работы построен на React, Redux Saga и React Router.</p>
        <p className="tech-stack">
          <strong>Технологии:</strong> React, Redux, Redux Saga, React Router, Express.
        </p>
      </section>
    </div>
  );
}

export default HomePage;

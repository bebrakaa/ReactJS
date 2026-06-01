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
          В этом варианте магазина данные загружаются через RTK Query, а интерфейс приведён к уровню доступности AA.
        </p>
      </section>

      <section aria-labelledby="benefits-title">
        <h2 id="benefits-title">Как устроена доступность</h2>
        <p className="section-intro">Главные пользовательские сценарии сопровождаются подсказками, статусными сообщениями и предсказуемой навигацией.</p>
        <div className="features-grid" role="list">
          <article className="feature-card" role="listitem">
            <div className="feature-icon" aria-hidden="true">1</div>
            <h3>Навигация без препятствий</h3>
            <p>Есть ссылка пропуска, карта сайта и единый порядок переходов между страницами.</p>
          </article>
          <article className="feature-card" role="listitem">
            <div className="feature-icon" aria-hidden="true">2</div>
            <h3>Понятные карточки товаров</h3>
            <p>Название, цена, рейтинг и наличие передаются не только визуально, но и программно.</p>
          </article>
          <article className="feature-card" role="listitem">
            <div className="feature-icon" aria-hidden="true">3</div>
            <h3>Удобное оформление заказа</h3>
            <p>Покупатель проходит шаги последовательно и получает подтверждение перед отправкой.</p>
          </article>
          <article className="feature-card" role="listitem">
            <div className="feature-icon" aria-hidden="true">4</div>
            <h3>Читаемый контент</h3>
            <p>Текст и элементы управления сохраняют различимость при увеличении и смене масштаба.</p>
          </article>
        </div>
      </section>

      <section className="cta-section" aria-labelledby="cta-title">
        <h2 id="cta-title">Продолжить</h2>
        <div className="cta-buttons">
          <Link to="/products" className="btn btn-primary">
            Открыть каталог
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
        <p>Этот вариант использует React, Redux Toolkit, RTK Query и React Router.</p>
        <p className="tech-stack">
          <strong>Технологии:</strong> React, Redux Toolkit, RTK Query, React Router, Express.
        </p>
      </section>
    </div>
  );
}

export default HomePage;

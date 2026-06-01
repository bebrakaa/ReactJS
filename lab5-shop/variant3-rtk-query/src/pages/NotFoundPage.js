import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function NotFoundPage() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    document.title = "Страница не найдена - TechHub";
  }, []);

  return (
    <div className="container not-found">
      <h1>404</h1>
      <h2>Страница не найдена</h2>
      <p>Указанный адрес не соответствует ни одной странице магазина.</p>
      <p>
        Перейдите на <Link to="/" className="link">главную страницу</Link>
        {isAuthenticated ? (
          <> или в <Link to="/products" className="link">каталог товаров</Link>.</>
        ) : (
          <> или на <Link to="/login" className="link">страницу входа</Link>.</>
        )}
      </p>
    </div>
  );
}

export default NotFoundPage;

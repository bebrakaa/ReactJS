import { useEffect } from "react";
import { Link } from "react-router-dom";

function NotFoundPage() {
  const token = localStorage.getItem("token");

  useEffect(() => {
    document.title = "Страница не найдена - TechHub";
  }, []);

  return (
    <div className="container not-found">
      <h1>404</h1>
      <h2>Страница не найдена</h2>
      <p>Извините, но такой страницы не существует.</p>
      <p>
        Перейдите на{" "}
        <Link to="/" className="link">
          главную страницу
        </Link>
        {token ? (
          <>
            {" "}
            или{" "}
            <Link to="/products" className="link">
              каталог товаров
            </Link>
          </>
        ) : (
          <>
            {" "}
            или{" "}
            <Link to="/login" className="link">
              страницу входа
            </Link>
          </>
        )}
      </p>
    </div>
  );
}

export default NotFoundPage;

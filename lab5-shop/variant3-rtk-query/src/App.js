import { Outlet, Link } from "react-router-dom";
import Header from "./components/Header";

function App() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Перейти к основному содержимому
      </a>

      <Header />

      <main id="main-content" className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>© 2026 TechHub. Лабораторная работа №5 - RTK Query, доступность AA</p>
        <Link to="/sitemap" className="sitemap-link">Карта сайта</Link>
      </footer>
    </>
  );
}

export default App;

import { Outlet } from "react-router-dom";
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
        <p>© 2026 TechHub. Лабораторная работа №4 - Redux Saga</p>
      </footer>
    </>
  );
}

export default App;

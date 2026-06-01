import { useCallback, useEffect, useRef, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Header from "./components/Header";

const FONT_SIZE_OPTIONS = [
  { id: "compact", label: "A-", description: "Компактный" },
  { id: "default", label: "A", description: "Стандартный" },
  { id: "large", label: "A+", description: "Крупный" },
  { id: "xlarge", label: "A++", description: "Очень крупный" },
];

const FONT_ZOOM_MAP = {
  compact: "0.95",
  default: "1",
  large: "1.1",
  xlarge: "1.2",
};

function App() {
  const navigate = useNavigate();
  const mainRef = useRef(null);
  const shortcutRef = useRef({ mode: "", timerId: null });
  const [fontSize, setFontSize] = useState(() => localStorage.getItem("techhub-font-size") || "default");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [shortcutStatus, setShortcutStatus] = useState("");

  // The handler intentionally closes over the current navigation and display settings.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    document.body.dataset.fontSize = fontSize;
    document.documentElement.style.zoom = FONT_ZOOM_MAP[fontSize] || "1";
    localStorage.setItem("techhub-font-size", fontSize);

    return () => {
      document.documentElement.style.zoom = "1";
    };
  }, [fontSize]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 320);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const clearShortcutMode = useCallback(() => {
    if (shortcutRef.current.timerId) {
      window.clearTimeout(shortcutRef.current.timerId);
    }
    shortcutRef.current = { mode: "", timerId: null };
    setShortcutStatus("");
  }, []);

  const armShortcutMode = useCallback((mode, message) => {
    clearShortcutMode();
    shortcutRef.current.mode = mode;
    shortcutRef.current.timerId = window.setTimeout(clearShortcutMode, 2200);
    setShortcutStatus(message);
  }, [clearShortcutMode]);

  const getMainTarget = useCallback(() => {
    const mainElement = mainRef.current;
    if (!mainElement) {
      return null;
    }

    return mainElement.querySelector("h1, [data-main-heading], h2") || mainElement;
  }, []);

  const focusMainContent = useCallback(() => {
    const mainElement = mainRef.current;
    const target = getMainTarget();

    if (!mainElement || !target) {
      return;
    }

    const targetRect = target.getBoundingClientRect();
    const isTargetVisible =
      targetRect.top >= 0 &&
      targetRect.bottom <= window.innerHeight;

    if (!isTargetVisible) {
      mainElement.scrollIntoView({ block: "start", behavior: "smooth" });
    }

    window.setTimeout(() => {
      if (target !== mainElement && !target.hasAttribute("tabindex")) {
        target.setAttribute("tabindex", "-1");
        target.setAttribute("data-skip-target", "true");
        target.addEventListener(
          "blur",
          () => {
            if (target.getAttribute("data-skip-target") === "true") {
              target.removeAttribute("tabindex");
              target.removeAttribute("data-skip-target");
            }
          },
          { once: true }
        );
      }

      try {
        target.focus({ preventScroll: true });
      } catch {
        target.focus();
      }

      window.setTimeout(() => {
        if (document.activeElement === target) {
          target.blur();
        }
      }, 120);
    }, 60);
  }, [getMainTarget]);

  const handleSkipLink = (event) => {
    event.preventDefault();
    focusMainContent();
    event.currentTarget.blur();
  };

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const handleHotkeys = (event) => {
      const tagName = event.target?.tagName;
      const isTypingContext =
        tagName === "INPUT" ||
        tagName === "TEXTAREA" ||
        tagName === "SELECT" ||
        event.target?.isContentEditable;

      if (isTypingContext) {
        return;
      }

      const code = event.code;
      const ctrlShiftCombo = event.ctrlKey && event.shiftKey && !event.altKey && !event.metaKey;

      const increaseFont = () => {
        const currentIndex = FONT_SIZE_OPTIONS.findIndex((option) => option.id === fontSize);
        const safeIndex = currentIndex === -1 ? 1 : currentIndex;
        const nextIndex = Math.min(FONT_SIZE_OPTIONS.length - 1, safeIndex + 1);
        setFontSize(FONT_SIZE_OPTIONS[nextIndex].id);
      };

      const decreaseFont = () => {
        const currentIndex = FONT_SIZE_OPTIONS.findIndex((option) => option.id === fontSize);
        const safeIndex = currentIndex === -1 ? 1 : currentIndex;
        const nextIndex = Math.max(0, safeIndex - 1);
        setFontSize(FONT_SIZE_OPTIONS[nextIndex].id);
      };

      const goCommands = {
        KeyH: () => navigate("/"),
        KeyK: () => navigate("/products"),
        KeyB: () => navigate("/cart"),
        KeyO: () => navigate("/orders"),
        KeyM: focusMainContent,
        KeyT: scrollToTop,
      };

      const textCommands = {
        Digit1: () => setFontSize("compact"),
        Digit2: () => setFontSize("default"),
        Digit3: () => setFontSize("large"),
        Digit4: () => setFontSize("xlarge"),
      };

      if (!event.ctrlKey && !event.altKey && !event.metaKey && !event.shiftKey) {
        if (shortcutRef.current.mode === "go") {
          const command = goCommands[code];
          clearShortcutMode();
          if (command) {
            event.preventDefault();
            command();
            return;
          }
        }

        if (shortcutRef.current.mode === "text") {
          const command = textCommands[code];
          clearShortcutMode();
          if (command) {
            event.preventDefault();
            command();
            return;
          }
        }

        if (code === "KeyG") {
          event.preventDefault();
          armShortcutMode("go", "Режим навигации: H — главная, K — каталог, B — корзина, O — заказы, M — контент, T — наверх.");
          return;
        }

        if (code === "KeyT") {
          event.preventDefault();
          armShortcutMode("text", "Размер текста: 1 — A-, 2 — A, 3 — A+, 4 — A++.");
          return;
        }
      }

      if (ctrlShiftCombo) {
        const directCommands = {
          Digit1: () => navigate("/"),
          Digit2: () => navigate("/products"),
          Digit3: () => navigate("/cart"),
          Digit4: () => navigate("/orders"),
          Digit5: scrollToTop,
          KeyS: focusMainContent,
          Equal: increaseFont,
          Minus: decreaseFont,
          NumpadAdd: increaseFont,
          NumpadSubtract: decreaseFont,
          F2: () => navigate("/"),
          F3: () => navigate("/products"),
          F4: () => navigate("/cart"),
          F6: () => navigate("/orders"),
          F7: focusMainContent,
          F8: scrollToTop,
        };

        const command = directCommands[code];
        if (command) {
          event.preventDefault();
          command();
        }
      }
    };

    document.addEventListener("keydown", handleHotkeys, true);
    return () => document.removeEventListener("keydown", handleHotkeys, true);
  }, [fontSize, navigate]);

  return (
    <>
      <a href="#main-content" className="skip-link" onClick={handleSkipLink}>
        Перейти к основному содержимому
      </a>

      <Header />

      <section className="accessibility-toolbar" aria-label="Настройки отображения">
        <div className="font-size-controls" role="group" aria-label="Размер текста">
          {FONT_SIZE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`font-size-btn ${fontSize === option.id ? "active" : ""}`}
              aria-pressed={fontSize === option.id}
              aria-label={`Размер текста: ${option.description}`}
              onClick={() => setFontSize(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className="hotkeys-hint">
          Быстрый доступ: `G` затем `H/K/B/O/M/T`, либо Ctrl+Shift+`1/2/3/4/S/5`. Размер текста: `T` затем `1/2/3/4`, либо Ctrl+Shift+`+/-`.
        </p>
        <p className="shortcut-status" role="status" aria-live="polite">
          {shortcutStatus}
        </p>
      </section>

      <main id="main-content" ref={mainRef} className="main-content" role="main" aria-label="Основное содержимое">
        <Outlet />
      </main>

      <footer className="footer">
        <p>© 2026 TechHub. Лабораторная работа №5, вариант Redux Toolkit, уровень доступности AA.</p>
        <div className="footer-actions">
          <Link to="/sitemap" className="sitemap-link">
            Карта сайта
          </Link>
        </div>
      </footer>

      {showBackToTop ? (
        <button
          type="button"
          className="back-to-top floating-back-to-top"
          onClick={scrollToTop}
          aria-label="Вернуться наверх страницы"
        >
          Наверх
        </button>
      ) : null}
    </>
  );
}

export default App;

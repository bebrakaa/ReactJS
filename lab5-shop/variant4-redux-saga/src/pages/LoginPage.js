import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../redux/sagas/authSaga";
import { validateEmail, validatePassword } from "../utils/validation";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    document.title = "Вход - TechHub";
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/products");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError) nextErrors.email = emailError;
    if (passwordError) nextErrors.password = passwordError;

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      dispatch(authActions.login({ email, password }));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Вход в систему</h1>
        <p className="section-intro">После входа станут доступны оформление заказа и история покупок.</p>

        {error && (
          <div className="form-error-summary" role="alert">
            <p><strong>Ошибка входа.</strong></p>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate aria-busy={loading}>
          <div className="form-group">
            <label htmlFor="login-email">Email *</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              placeholder="example@mail.com"
              className={errors.email ? "error" : ""}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "login-email-error" : "login-email-hint"}
              autoComplete="email"
              disabled={loading}
            />
            <span id="login-email-hint" className="field-hint">Используйте адрес электронной почты, привязанный к аккаунту.</span>
            {errors.email && <span id="login-email-error" className="error-text" role="alert">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Пароль *</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (errors.password) setErrors({ ...errors, password: "" });
              }}
              placeholder="Введите пароль"
              className={errors.password ? "error" : ""}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "login-password-error" : "login-password-hint"}
              autoComplete="current-password"
              disabled={loading}
              maxLength={50}
            />
            <span id="login-password-hint" className="field-hint">Пароль не отображается на экране для защиты данных.</span>
            {errors.password && <span id="login-password-error" className="error-text" role="alert">{errors.password}</span>}
          </div>

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Выполняется вход..." : "Войти"}
          </button>
        </form>

        <div className="auth-link">
          Нет аккаунта? <Link to="/register">Перейти к регистрации</Link>
        </div>

        <div className="test-credentials" aria-label="Тестовые учетные данные">
          <p><strong>Тестовые данные:</strong></p>
          <p>Email: test@example.com</p>
          <p>Пароль: password123</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../redux/api/authApi";
import { setCredentials } from "../redux/slices/authSlice";
import { validateEmail, validatePassword } from "../utils/validation";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading, error }] = useLoginMutation();

  useEffect(() => {
    document.title = "Вход - TechHub";
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError) nextErrors.email = emailError;
    if (passwordError) nextErrors.password = passwordError;

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      const user = await login({ email, password }).unwrap();
      dispatch(setCredentials(user));
      navigate("/products");
    } catch {
      // Сообщение об ошибке приходит из RTK Query и выводится ниже.
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Вход в систему</h1>
        <p className="section-intro">Авторизация даёт доступ к корзине, оформлению заказа и истории покупок.</p>

        {error && (
          <div className="form-error-summary" role="alert">
            <p><strong>Ошибка входа.</strong></p>
            <p>{error.data?.message || "Не удалось выполнить авторизацию."}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate aria-busy={isLoading}>
          <div className="form-group">
            <label htmlFor="login-email">Email *</label>
            <input
              type="email"
              id="login-email"
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
              disabled={isLoading}
            />
            <span id="login-email-hint" className="field-hint">Используйте адрес электронной почты, который вы зарегистрировали ранее.</span>
            {errors.email && <span id="login-email-error" className="error-text" role="alert">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Пароль *</label>
            <input
              type="password"
              id="login-password"
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
              disabled={isLoading}
              maxLength={50}
            />
            <span id="login-password-hint" className="field-hint">Пароль может быть автоматически подставлен менеджером паролей.</span>
            {errors.password && <span id="login-password-error" className="error-text" role="alert">{errors.password}</span>}
          </div>

          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? "Выполняется вход..." : "Войти"}
          </button>
        </form>

        <p className="auth-link">
          Нет аккаунта? <Link to="/register">Перейти к регистрации</Link>
        </p>

        <div className="test-credentials" aria-label="Тестовые учетные данные">
          <p><strong>Тестовые данные:</strong></p>
          <p>Email: user@test.com</p>
          <p>Пароль: 123456</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

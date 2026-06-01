import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../redux/actions/authActions";
import { validateEmail, validateName, validatePassword } from "../utils/validation";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated, error: authError } = useSelector((state) => state.auth);

  useEffect(() => {
    document.title = "Регистрация - TechHub";
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/products");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (nameError) nextErrors.name = nameError;
    if (emailError) nextErrors.email = emailError;
    if (passwordError) nextErrors.password = passwordError;
    if (!confirmPassword) {
      nextErrors.confirmPassword = "Подтвердите пароль.";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Пароли не совпадают.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const result = await dispatch(register(name, email, password));
    if (!result.success) {
      setErrors({ submit: result.error });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Регистрация</h1>
        <p className="section-intro">Создайте аккаунт, чтобы сохранять корзину и оформлять заказы. Все поля обязательны.</p>

        {(errors.submit || authError) && (
          <div className="form-error-summary" role="alert">
            <p><strong>Не удалось завершить регистрацию.</strong></p>
            <p>{errors.submit || authError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate aria-busy={loading}>
          <div className="form-group">
            <label htmlFor="register-name">Имя *</label>
            <input
              type="text"
              id="register-name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (errors.name) setErrors({ ...errors, name: "" });
              }}
              placeholder="Иван Иванов"
              disabled={loading}
              className={errors.name ? "error" : ""}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "register-name-error" : "register-name-hint"}
              autoComplete="name"
              maxLength={100}
            />
            <span id="register-name-hint" className="field-hint">Укажите имя, которое будет отображаться в личном кабинете.</span>
            {errors.name && <span id="register-name-error" className="error-text" role="alert">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="register-email">Email *</label>
            <input
              type="email"
              id="register-email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              placeholder="example@mail.com"
              disabled={loading}
              className={errors.email ? "error" : ""}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "register-email-error" : "register-email-hint"}
              autoComplete="email"
            />
            <span id="register-email-hint" className="field-hint">На этот адрес будет привязан вход в магазин.</span>
            {errors.email && <span id="register-email-error" className="error-text" role="alert">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="register-password">Пароль *</label>
            <input
              type="password"
              id="register-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (errors.password) setErrors({ ...errors, password: "" });
              }}
              placeholder="Минимум 4 символа"
              disabled={loading}
              className={errors.password ? "error" : ""}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "register-password-error" : "register-password-hint"}
              autoComplete="new-password"
              maxLength={50}
            />
            <span id="register-password-hint" className="field-hint">Используйте не менее четырёх символов.</span>
            {errors.password && <span id="register-password-error" className="error-text" role="alert">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="register-confirm-password">Подтвердите пароль *</label>
            <input
              type="password"
              id="register-confirm-password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" });
              }}
              placeholder="Повторите пароль"
              disabled={loading}
              className={errors.confirmPassword ? "error" : ""}
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={errors.confirmPassword ? "register-confirm-password-error" : "register-confirm-password-hint"}
              autoComplete="new-password"
              maxLength={50}
            />
            <span id="register-confirm-password-hint" className="field-hint">Поле помогает избежать ошибок перед созданием аккаунта.</span>
            {errors.confirmPassword && (
              <span id="register-confirm-password-error" className="error-text" role="alert">{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Регистрация..." : "Зарегистрироваться"}
          </button>
        </form>

        <p className="auth-link">
          Уже есть аккаунт? <Link to="/login">Перейти ко входу</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;

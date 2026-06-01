import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearError, register } from "../redux/slices/authSlice";
import { validateEmail, validateName, validatePassword } from "../utils/validation";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated, error } = useSelector((state) => state.auth);

  useEffect(() => {
    document.title = "Регистрация - TechHub";
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/products");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => () => {
    if (error) {
      dispatch(clearError());
    }
  }, [dispatch, error]);

  const handleSubmit = (event) => {
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

    dispatch(register({ name, email, password }));
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Регистрация</h1>
        <p className="section-intro">Создайте аккаунт, чтобы оформить заказ и просматривать историю покупок.</p>

        {error && (
          <div className="form-error-summary" role="alert">
            <p><strong>Ошибка регистрации.</strong></p>
            <p>{error}</p>
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
              className={errors.name ? "error" : ""}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "register-name-error" : "register-name-hint"}
              autoComplete="name"
              disabled={loading}
              maxLength={100}
            />
            <span id="register-name-hint" className="field-hint">Имя будет показано в правом верхнем углу после входа.</span>
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
              className={errors.email ? "error" : ""}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "register-email-error" : "register-email-hint"}
              autoComplete="email"
              disabled={loading}
            />
            <span id="register-email-hint" className="field-hint">На этот адрес будут приходить сообщения о доступе к аккаунту.</span>
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
              className={errors.password ? "error" : ""}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "register-password-error" : "register-password-hint"}
              autoComplete="new-password"
              disabled={loading}
              maxLength={50}
            />
            <span id="register-password-hint" className="field-hint">Пароль нужен для входа и должен быть понятен только вам.</span>
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
              className={errors.confirmPassword ? "error" : ""}
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={errors.confirmPassword ? "register-confirm-password-error" : "register-confirm-password-hint"}
              autoComplete="new-password"
              disabled={loading}
              maxLength={50}
            />
            <span id="register-confirm-password-hint" className="field-hint">Это поле помогает предотвратить ошибку перед отправкой формы.</span>
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

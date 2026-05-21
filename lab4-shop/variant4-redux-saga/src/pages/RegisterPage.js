import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../redux/sagas/authSaga";
import { validateEmail, validateName, validatePassword } from "../utils/validation";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/products");
    }
  }, [isAuthenticated, navigate]);

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
      nextErrors.confirmPassword = "Подтверждение пароля обязательно";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Пароли не совпадают";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      dispatch(authActions.register({ name, email, password }));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Регистрация</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="register-name">Имя *</label>
            <input
              id="register-name"
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (errors.name) setErrors({ ...errors, name: "" });
              }}
              placeholder="Иван Иванов"
              className={errors.name ? "error" : ""}
              disabled={loading}
              maxLength={100}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="register-email">Email *</label>
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              placeholder="example@mail.com"
              className={errors.email ? "error" : ""}
              disabled={loading}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="register-password">Пароль *</label>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (errors.password) setErrors({ ...errors, password: "" });
              }}
              placeholder="Минимум 4 символа"
              className={errors.password ? "error" : ""}
              disabled={loading}
              maxLength={50}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="register-confirm-password">Подтвердите пароль *</label>
            <input
              id="register-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                if (errors.confirmPassword) {
                  setErrors({ ...errors, confirmPassword: "" });
                }
              }}
              placeholder="Повторите пароль"
              className={errors.confirmPassword ? "error" : ""}
              disabled={loading}
              maxLength={50}
            />
            {errors.confirmPassword && (
              <span className="error-text">{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Регистрация..." : "Зарегистрироваться"}
          </button>
        </form>

        <div className="auth-link">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;

import { useState} from "react";
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    
    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;
    
    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      const user = await login({ email, password }).unwrap();
      dispatch(setCredentials(user));
      navigate("/products");
    } catch (err) {
      // Ошибка от сервера будет показана через error из useLoginMutation
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Вход в систему</h2>

        {error && (
          <div className="error-message">
            {error.data?.message || "Ошибка авторизации"}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              placeholder="example@mail.com"
              className={errors.email ? "error" : ""}
              disabled={isLoading}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль *</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: "" });
              }}
              placeholder="Введите пароль"
              className={errors.password ? "error" : ""}
              disabled={isLoading}
              maxLength={50}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? "Вход..." : "Войти"}
          </button>
        </form>

        <p className="auth-link">
          Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link>
        </p>

        <div className="test-credentials">
          <p><strong>Тестовые данные:</strong></p>
          <p>Email: user@test.com</p>
          <p>Пароль: 123456</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
